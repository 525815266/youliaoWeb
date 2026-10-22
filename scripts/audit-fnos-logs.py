#!/usr/bin/env python3
"""Read-only fnOS audit. Set FNOS_PASSWORD; output contains summaries, not chat bodies."""

import argparse
import collections
import datetime as dt
import json
import os
import pathlib
import re
import shlex
import subprocess
import sys
import time
import urllib.request


def redact(value):
    text = str(value)
    text = re.sub(r'(?i)(password|pwd|token|authorization|apiKey|secret)(["\s:=]+)[^\s,;"}]+', r'\1\2<redacted>', text)
    text = re.sub(r'(?i)(?:sk-|ck_)[a-z0-9_.-]+', '<redacted>', text)
    return text[:800]


def run(command):
    result = subprocess.run(command, capture_output=True, text=True, errors='replace', timeout=40)
    return result.stdout + result.stderr


def capture_summary(file, cutoff, max_bytes):
    stats = collections.defaultdict(lambda: {'requests': 0, 'httpErrors': 0, 'businessErrors': 0, 'nullData': 0, 'slow': 0, 'maxMs': 0})
    failures = collections.Counter()
    recent_errors = []
    size = file.stat().st_size
    pos = size
    pending = b''
    oldest = newest = ''
    scanned = records = 0
    reached_cutoff = False
    with file.open('rb') as handle:
        while pos and scanned < max_bytes and not reached_cutoff:
            count = min(pos, 4 * 1024 * 1024, max_bytes - scanned)
            pos -= count
            handle.seek(pos)
            block = handle.read(count) + pending
            scanned += count
            lines = block.split(b'\n')
            pending = lines.pop(0) if pos else b''
            for line in reversed(lines):
                try:
                    row = json.loads(line)
                except (ValueError, UnicodeDecodeError):
                    continue
                at = str(row.get('at', ''))
                if not at:
                    continue
                if at < cutoff:
                    reached_cutoff = True
                    continue
                oldest = min(oldest or at, at)
                newest = max(newest, at)
                records += 1
                endpoint = str(row.get('url', '')).split('?')[0]
                entry = stats[endpoint]
                entry['requests'] += 1
                duration = row.get('ms', row.get('elapsedMs', 0)) or 0
                entry['maxMs'] = max(entry['maxMs'], duration)
                entry['slow'] += int(duration >= 5000)
                status = int(row.get('status', 0) or 0)
                entry['httpErrors'] += int(status >= 400)
                response = row.get('responseBody', '')
                try:
                    payload = json.loads(response) if isinstance(response, str) else response
                except ValueError:
                    payload = None
                business_error = isinstance(payload, dict) and payload.get('success') is False
                entry['businessErrors'] += int(business_error)
                entry['nullData'] += int(isinstance(payload, dict) and 'data' in payload and payload['data'] is None)
                if row.get('error') or status >= 400 or business_error:
                    reason = row.get('error') or (payload.get('message') if isinstance(payload, dict) else '') or f'HTTP {status}'
                    reason = redact(reason)
                    failures[(endpoint, reason)] += 1
                    if len(recent_errors) < 30:
                        recent_errors.append({'at': at, 'path': endpoint, 'status': status, 'reason': reason})
    return {'file': str(file), 'bytes': size, 'scannedBytes': scanned, 'coverageComplete': reached_cutoff,
            'fileScanComplete': reached_cutoff or pos == 0, 'coverageNote': 'A new or rotated file may cover less than the requested window.',
            'oldest': oldest, 'newest': newest, 'records': records,
            'endpoints': dict(sorted(stats.items(), key=lambda pair: -pair[1]['requests'])),
            'failures': [{'path': key[0], 'reason': key[1], 'count': count} for key, count in failures.most_common(25)],
            'recentErrors': recent_errors}


def log_summary(text):
    lines = text.splitlines()
    pattern = re.compile(r'error|exception|fail|timeout|timed out|refused|abort|crash|deadlock|denied|异常|失败|断开|离线|重启|超时', re.I)
    errors = [redact(line) for line in lines if pattern.search(line)]
    types = collections.Counter()
    for line in errors:
        normalized = re.sub(r'^\S+\s+', '', line)
        normalized = re.sub(r'\b\d+\b', '#', normalized)
        types[normalized] += 1
    return {'lines': len(lines), 'matchedLines': len(errors), 'recent': errors[-12:], 'top': types.most_common(8)}


def remote_audit(hours, max_bytes):
    now = dt.datetime.now(dt.timezone.utc)
    cutoff = (now - dt.timedelta(hours=hours)).isoformat(timespec='seconds').replace('+00:00', 'Z')
    print(json.dumps({'kind': 'host', 'at': now.isoformat(), 'since': cutoff,
                      'resources': run(['sh', '-c', 'df -h /vol1; free -m; uptime'])}), flush=True)
    listing = run(['docker', 'ps', '-a', '--format', '{{.Names}}']).splitlines()
    names = [name for name in listing if name.startswith(('youchat', 'promptworks')) and 'recovery-old' not in name]
    for name in names:
        inspected = json.loads(run(['docker', 'inspect', name]))[0]
        state = inspected['State']
        logs = run(['docker', 'logs', '--since', f'{hours}h', '--tail', '12000', '--timestamps', name])
        print(json.dumps({'kind': 'container', 'name': name, 'state': state['Status'], 'restarts': inspected['RestartCount'],
                          'oomKilled': state['OOMKilled'], 'startedAt': state['StartedAt'],
                          'health': state.get('Health', {}).get('Status'), 'tailLimit': 12000, 'logs': log_summary(logs)}, ensure_ascii=False), flush=True)
    for label, directory, port in [('primary', 'youchat-dev-web', 5177), ('secondary', 'youchat-dev-web-2', 5178)]:
        root = pathlib.Path('/vol1/1000/Docker') / directory
        for file in [root / 'logs/api-capture.ndjson', *(root / 'logs').glob('api-capture.ndjson.[1-3]')]:
            if file.exists():
                print(json.dumps({'kind': 'api', 'stack': label, **capture_summary(file, cutoff, max_bytes)}, ensure_ascii=False), flush=True)
        for endpoint in ['/health', '/local/fnos/guard', '/local/campaign-skill']:
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}{endpoint}', timeout=15) as response:
                    data = json.load(response)
                if endpoint.endswith('campaign-skill'):
                    data = {key: data.get(key) for key in ('runtime', 'stats', 'settings')}
                print(json.dumps({'kind': 'health', 'stack': label, 'path': endpoint, 'data': data}, ensure_ascii=False), flush=True)
            except Exception as error:
                print(json.dumps({'kind': 'health', 'stack': label, 'path': endpoint, 'error': redact(error)}), flush=True)
    for directory in ['youchat', 'youchat-2']:
        root = pathlib.Path('/vol1/1000/Docker') / directory
        state_file = root / 'docker-control/backup-state.json'
        if state_file.exists():
            state = json.loads(state_file.read_text())
            print(json.dumps({'kind': 'backup', 'stack': directory, 'state': state}, ensure_ascii=False), flush=True)
        login_file = root / 'docker-control/login-state.json'
        if login_file.exists():
            print(json.dumps({'kind': 'login', 'stack': directory, 'state': json.loads(login_file.read_text())}), flush=True)
        name = 'youchat-service' + ('-2' if directory.endswith('-2') else '')
        info = json.loads(run(['docker', 'inspect', name]))[0]
        pid = info['State'].get('Pid', 0)
        sockets = run(['nsenter', '-t', str(pid), '-n', 'ss', '-nt']) if pid else ''
        upstream = [line.split()[4] for line in sockets.splitlines() if line.startswith('ESTAB') and ':7190' in line]
        print(json.dumps({'kind': 'upstream', 'stack': directory, 'establishedPeers': upstream,
                          'note': 'TCP presence is not proof of business authentication; cached GetAccountInfo is insufficient.'}), flush=True)
        for folder in root.glob('logs*'):
            if not folder.is_dir():
                continue
            for file in folder.glob('*/*.log'):
                if file.stat().st_mtime < time.time() - hours * 3600:
                    continue
                with file.open('rb') as handle:
                    handle.seek(max(0, file.stat().st_size - 2 * 1024 * 1024))
                    summary = log_summary(handle.read().decode('utf-8-sig', 'replace'))
                print(json.dumps({'kind': 'serviceLog', 'stack': directory, 'file': str(file), 'bytes': file.stat().st_size, **summary}, ensure_ascii=False), flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--remote', action='store_true')
    parser.add_argument('--hours', type=int, default=48)
    parser.add_argument('--max-mib', type=int, default=1024)
    args = parser.parse_args()
    if args.remote:
        remote_audit(args.hours, args.max_mib * 1024 * 1024)
        return
    import paramiko
    password = os.environ['FNOS_PASSWORD']
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(os.environ.get('FNOS_HOST', '192.168.9.83'), username=os.environ.get('FNOS_USER', 'Boom'), password=password, timeout=15)
    try:
        source = pathlib.Path(__file__).read_text(encoding='utf-8')
        command = f'sudo -S python3 -u -c {shlex.quote(source)} --remote --hours {args.hours} --max-mib {args.max_mib}'
        stdin, stdout, stderr = client.exec_command(command, timeout=600)
        stdin.write(os.environ.get('FNOS_SUDO_PASSWORD', password) + '\n')
        stdin.flush()
        for line in stdout:
            print(line.rstrip(), flush=True)
        if stdout.channel.recv_exit_status():
            raise RuntimeError(redact(stderr.read().decode('utf-8', 'replace')))
    finally:
        client.close()


if __name__ == '__main__':
    main()

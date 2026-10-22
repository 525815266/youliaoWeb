#!/usr/bin/env python3
"""Install bounded login recovery and persistent health in both existing autologin sidecars."""
import base64
import os
import pathlib
import shlex
import paramiko

SOURCE = pathlib.Path(__file__).resolve().parents[1] / 'ops/fnos-youchat-service/autologin-observability.sh'


def patch_autologin(text, helper):
    marker = '# BEGIN YOUCHAT LOGIN HEALTH\n'
    end_marker = '# END YOUCHAT LOGIN HEALTH\n'
    block = marker + helper.rstrip() + '\n' + end_marker
    if marker in text:
        start = text.index(marker)
        end = text.index(end_marker, start) + len(end_marker)
        text = text[:start] + block + text[end:]
    else:
        if 'last_status=""\n' not in text:
            raise ValueError('autologin initialization marker missing')
        text = text.replace('last_status=""\n', block + '\nlast_status=""\n', 1)
    call = '  record_login_status "$last_status" "$response"\n'
    if call not in text:
        if '  sleep "$interval"\ndone' not in text:
            raise ValueError('autologin loop marker missing')
        text = text.replace('  sleep "$interval"\ndone', call + '  sleep "$interval"\ndone', 1)
    return text


def main():
    import inspect
    helper = SOURCE.read_text(encoding='utf-8')
    remote = 'import pathlib, subprocess, time, base64\n' + inspect.getsource(patch_autologin) + '\n'
    remote += 'helper=base64.b64decode(' + repr(base64.b64encode(helper.encode()).decode()) + ').decode()\n'
    remote += '''
for directory, container in [('youchat', 'youchat-autologin'), ('youchat-2', 'youchat-autologin-2')]:
    file = pathlib.Path('/vol1/1000/Docker') / directory / 'docker/autologin.sh'
    before = file.read_text()
    after = patch_autologin(before, helper)
    subprocess.run(['sh', '-n'], input=after, text=True, check=True)
    if after != before:
        file.with_suffix('.sh.before-health-' + str(int(time.time()))).write_text(before)
        file.write_text(after)
        subprocess.run(['docker', 'restart', container], check=True, timeout=60)
    print(directory, 'login health installed', flush=True)
'''
    password = os.environ['FNOS_PASSWORD']
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(os.environ.get('FNOS_HOST', '192.168.9.83'), username=os.environ.get('FNOS_USER', 'Boom'), password=password, timeout=15)
    try:
        stdin, stdout, stderr = client.exec_command('sudo -S -p "" python3 -u -c ' + shlex.quote(remote), timeout=180)
        stdin.write(os.environ.get('FNOS_SUDO_PASSWORD', password) + '\n')
        stdin.flush()
        for line in stdout:
            print(line.rstrip(), flush=True)
        if stdout.channel.recv_exit_status():
            raise RuntimeError(stderr.read().decode())
    finally:
        client.close()


if __name__ == '__main__':
    main()

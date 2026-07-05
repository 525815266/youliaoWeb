#!/usr/bin/env python3
"""Install the YouChat backend config guard on fnOS.

The Web app can repair a mounted backend directory, but the backend should also
self-heal before each service start. This installer copies config-guard.sh into
the original YouChat Docker project and patches docker/run-youchat.sh to call it.
"""

from __future__ import annotations

import os
import pathlib
import time


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
GUARD_SOURCE = PROJECT_ROOT / "ops" / "fnos-youchat-service" / "config-guard.sh"
DEFAULT_REMOTE_DIR = "/vol1/1000/Docker/youchat"


def import_paramiko():
    try:
        import paramiko  # type: ignore

        return paramiko
    except ImportError as exc:
        raise SystemExit("paramiko is required to install the fnOS service guard.") from exc


def quote(value: str) -> str:
    return "'" + value.replace("'", "'\"'\"'") + "'"


def run_ssh(client, command: str, timeout: int = 300, input_text: str | None = None) -> str:
    stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
    if input_text is not None:
        stdin.write(input_text)
        stdin.flush()
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    if code != 0:
        raise RuntimeError(f"remote command failed ({code}): {command}\n{err or out}")
    return out


def install() -> None:
    paramiko = import_paramiko()
    host = os.environ.get("FNOS_HOST", "192.168.9.83")
    user = os.environ.get("FNOS_USER", "Boom")
    port = int(os.environ.get("FNOS_PORT", "22"))
    password = os.environ.get("FNOS_PASSWORD")
    sudo_password = os.environ.get("FNOS_SUDO_PASSWORD", password or "")
    remote_dir = os.environ.get("FNOS_YOUCHAT_REMOTE_DIR", DEFAULT_REMOTE_DIR)
    if not password:
        raise SystemExit("Set FNOS_PASSWORD before installing the fnOS service guard.")
    if not GUARD_SOURCE.exists():
        raise SystemExit(f"Missing guard source: {GUARD_SOURCE}")

    remote_guard = f"{remote_dir}/docker/config-guard.sh"
    remote_tmp = f"/tmp/config-guard-{int(time.time())}.sh"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, port=port, username=user, password=password, timeout=15, banner_timeout=15, auth_timeout=15)
    try:
        sftp = client.open_sftp()
        try:
            sftp.put(str(GUARD_SOURCE), remote_tmp)
        finally:
            sftp.close()

        sudo = f"printf '%s\\n' {quote(sudo_password)} | sudo -S "
        run_ssh(client, f"{sudo}mkdir -p {quote(remote_dir + '/docker')}")
        run_ssh(client, f"{sudo}cp -f {quote(remote_tmp)} {quote(remote_guard)} && {sudo}chmod +x {quote(remote_guard)} && rm -f {quote(remote_tmp)}")

        patch = f"""
set -e
cd {quote(remote_dir)}
if ! grep -q 'docker/config-guard.sh' docker/run-youchat.sh; then
  stamp=$(date +%Y%m%d-%H%M%S)
  cp -a docker/run-youchat.sh docker/run-youchat.sh.codex-backup-$stamp
  python3 - <<'PY'
from pathlib import Path
p = Path('docker/run-youchat.sh')
text = p.read_text(encoding='utf-8')
needle = '  chmod +x /app/YouChatService\\n'
insert = '''  if [ -x /app/docker/config-guard.sh ]; then\\n    /app/docker/config-guard.sh || echo \"YouChat config guard could not repair the config.\"\\n  fi\\n\\n'''
if insert not in text:
    if needle not in text:
        raise SystemExit('run-youchat.sh marker not found')
    text = text.replace(needle, insert + needle, 1)
    p.write_text(text, encoding='utf-8')
PY
fi
docker restart youchat-service >/dev/null
sleep 8
docker ps -a --filter name=youchat-service --format 'table {{{{.Names}}}}\\t{{{{.Status}}}}\\t{{{{.Ports}}}}'
"""
        print(run_ssh(client, f"{sudo}bash -lc {quote(patch)}", timeout=180))
        print("Installed fnOS YouChat service config guard.")
    finally:
        client.close()


if __name__ == "__main__":
    install()

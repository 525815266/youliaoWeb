#!/usr/bin/env python3
"""Deploy the YouChat dev web client to fnOS without touching the YouChat backend."""

from __future__ import annotations

import fnmatch
import os
import pathlib
import posixpath
import sys
import tarfile
import time


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_REMOTE_DIR = "/vol1/1000/Docker/youchat-dev-web"
EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    ".youchat-patch-backups",
    "patches",
    "reports",
    "logs",
    "deploy-dist",
}
EXCLUDED_FILES = {
    ".env",
    "chrome-check.png",
    "login-check.png",
    "login-native-icon-check.png",
    "native-icon-workbench-check.png",
    "toolbar-check.png",
    "workbench-native-icon-check.png",
}
EXCLUDED_PATTERNS = ("*.log", "*.tmp", "*.temp", "*.tar", "*.tar.gz", "*.zip")


def should_exclude(path: pathlib.Path) -> bool:
    relative = path.relative_to(PROJECT_ROOT)
    parts = relative.parts
    if any(part in EXCLUDED_DIRS for part in parts):
        return True
    name = parts[-1] if parts else ""
    if name in EXCLUDED_FILES:
        return True
    return any(fnmatch.fnmatch(name, pattern) for pattern in EXCLUDED_PATTERNS)


def import_paramiko():
    try:
        import paramiko  # type: ignore

        return paramiko
    except ImportError:
        fallback = pathlib.Path(r"C:\Users\ACER\Downloads\youChat-linux1\youChat-linux\.codex-tmp\paramiko")
        if fallback.exists():
            sys.path.insert(0, str(fallback))
            import paramiko  # type: ignore

            return paramiko
        raise SystemExit("paramiko is required to deploy over SSH.")


def quote(value: str) -> str:
    return "'" + value.replace("'", "'\"'\"'") + "'"


def create_archive() -> pathlib.Path:
    dist_dir = PROJECT_ROOT / "deploy-dist"
    dist_dir.mkdir(exist_ok=True)
    archive = dist_dir / f"youchat-dev-web-{time.strftime('%Y%m%d-%H%M%S')}.tar.gz"
    with tarfile.open(archive, "w:gz") as tar:
        for path in PROJECT_ROOT.rglob("*"):
            if should_exclude(path):
                continue
            tar.add(path, arcname=path.relative_to(PROJECT_ROOT).as_posix(), recursive=False)
    return archive


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


def deploy() -> None:
    paramiko = import_paramiko()
    host = os.environ.get("FNOS_HOST", "192.168.9.83")
    user = os.environ.get("FNOS_USER", "Boom")
    port = int(os.environ.get("FNOS_PORT", "22"))
    password = os.environ.get("FNOS_PASSWORD")
    sudo_password = os.environ.get("FNOS_SUDO_PASSWORD", password or "")
    remote_dir = os.environ.get("FNOS_WEB_REMOTE_DIR", DEFAULT_REMOTE_DIR)
    compose_file = os.environ.get("FNOS_WEB_COMPOSE_FILE", "compose.yaml")
    project_name = os.environ.get("FNOS_WEB_PROJECT_NAME", "youchat-dev-web")
    use_sudo = os.environ.get("FNOS_USE_SUDO", "1") != "0"
    if not password:
        raise SystemExit("Set FNOS_PASSWORD before deploying.")

    archive = create_archive()
    remote_tmp = f"/tmp/{archive.name}"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, port=port, username=user, password=password, timeout=15, banner_timeout=15, auth_timeout=15)
    try:
        sftp = client.open_sftp()
        try:
            sftp.put(str(archive), remote_tmp)
        finally:
            sftp.close()

        run_ssh(client, f"mkdir -p {quote(remote_dir)}")
        run_ssh(client, f"tar -xzf {quote(remote_tmp)} -C {quote(remote_dir)}", timeout=900)
        run_ssh(client, f"rm -f {quote(remote_tmp)}")
        run_ssh(client, f"cd {quote(remote_dir)} && mkdir -p data logs config")
        run_ssh(client, f"cd {quote(remote_dir)} && if [ ! -f .env ]; then cp .env.example .env; fi")
        run_ssh(
            client,
            f"cd {quote(remote_dir)} && "
            "if grep -qx 'YOUCHAT_API_BASE=http://192.168.9.83:18080/api' .env; then "
            "sed -i 's#^YOUCHAT_API_BASE=.*#YOUCHAT_API_BASE=http://host.docker.internal:18080/api#' .env; "
            "fi",
        )

        docker = "sudo -S docker" if use_sudo else "docker"
        sudo_input = f"{sudo_password}\n" if use_sudo else None
        compose_args = f"-p {quote(project_name)} -f {quote(compose_file)}"
        status = run_ssh(
            client,
            f"cd {quote(remote_dir)} && {docker} compose {compose_args} up -d --build --force-recreate",
            timeout=1200,
            input_text=sudo_input,
        )
        print(status)
        ps = run_ssh(
            client,
            f"cd {quote(remote_dir)} && {docker} compose {compose_args} ps",
            timeout=120,
            input_text=sudo_input,
        )
        print(ps)
        print(f"Deployed {archive.name} to {host}:{remote_dir}")
    finally:
        client.close()


if __name__ == "__main__":
    deploy()

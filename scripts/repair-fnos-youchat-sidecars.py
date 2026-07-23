#!/usr/bin/env python3
"""Recover FnOS YouChat control/backup sidecars using the configured cloud backup paths."""

from __future__ import annotations

import base64
import json
import os
import pathlib
import sys
import time


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]

DEFAULT_TARGETS = [
    {
        "name": "primary",
        "backendDir": "/vol1/1000/Docker/youchat",
        "projectName": "youliaoapp",
        "composeFiles": ["docker-compose.yml", "compose.mysql.yaml"],
        "services": ["youchat-control", "youchat-backup"],
        "containers": ["youchat-control", "youchat-backup"],
        "controlStatusUrl": "http://127.0.0.1:18081/api/status",
    },
    {
        "name": "secondary",
        "backendDir": "/vol1/1000/Docker/youchat-2",
        "projectName": "youchat-2",
        "composeFiles": ["compose.yaml"],
        "services": ["youchat-control", "youchat-backup"],
        "containers": ["youchat-control-2", "youchat-backup-2"],
        "controlStatusUrl": "http://127.0.0.1:18083/api/status",
    },
]


REMOTE_REPAIR_SCRIPT = r'''
from __future__ import annotations

import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request


def fail(message: str) -> None:
    raise RuntimeError(message)


def read_env_file(backend_dir: str) -> dict[str, str]:
    env_path = os.path.join(backend_dir, ".env")
    values: dict[str, str] = {}
    with open(env_path, "r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def write_probe(path: str) -> None:
    probe = os.path.join(path, f".codex-sidecar-write-test-{int(time.time())}")
    with open(probe, "w", encoding="utf-8") as handle:
        handle.write("ok\n")
    os.remove(probe)


def ensure_cloud_backup_path(path: str) -> dict:
    if not path:
        fail("YOUCHAT_BACKUP_HOST_PATH is empty.")
    if not os.path.isabs(path):
        fail(f"Backup path must be absolute, got: {path}")
    if not path.startswith("/vol02/"):
        fail(f"Refusing non-cloud/local backup path: {path}")

    result = {"path": path, "created": False}
    if not os.path.exists(path):
        parent = os.path.dirname(path)
        if not os.path.isdir(parent):
            fail(f"Cloud backup parent is missing or unauthorized: {parent}")
        try:
            os.makedirs(path, exist_ok=True)
            result["created"] = True
        except OSError as exc:
            fail(f"Could not create cloud backup path {path}: {exc}")

    if not os.path.isdir(path):
        fail(f"Backup path is not a directory: {path}")
    try:
        write_probe(path)
    except OSError as exc:
        fail(f"Backup path is not writable: {path}: {exc}")
    return result


def run(args: list[str], cwd: str | None = None, check: bool = True) -> subprocess.CompletedProcess:
    proc = subprocess.run(args, cwd=cwd, text=True, capture_output=True)
    if check and proc.returncode != 0:
        raise RuntimeError(
            "Command failed: "
            + " ".join(args)
            + "\nSTDOUT:\n"
            + proc.stdout
            + "\nSTDERR:\n"
            + proc.stderr
        )
    return proc


def compose_up(target: dict) -> str:
    args = ["docker", "compose"]
    project_name = target.get("projectName")
    if project_name:
        args += ["-p", str(project_name)]
    for compose_file in target.get("composeFiles") or []:
        args += ["-f", str(compose_file)]
    args += ["up", "-d"]
    args += [str(service) for service in target["services"]]
    proc = run(args, cwd=target["backendDir"])
    return (proc.stdout + proc.stderr).strip()


def inspect_container(name: str) -> dict:
    proc = run(["docker", "inspect", name], check=True)
    payload = json.loads(proc.stdout)
    if not payload:
        fail(f"Container not found: {name}")
    item = payload[0]
    state = item.get("State") or {}
    return {
        "name": name,
        "status": state.get("Status"),
        "exitCode": state.get("ExitCode"),
        "error": state.get("Error") or "",
        "startedAt": state.get("StartedAt"),
    }


def wait_control_status(url: str, token: str) -> dict:
    if not url or not token:
        return {"ok": False, "skipped": True, "reason": "missing control url or token"}

    last_error = ""
    for attempt in range(1, 11):
        try:
            request = urllib.request.Request(url, headers={"X-Control-Token": token})
            with urllib.request.urlopen(request, timeout=5) as response:
                text = response.read().decode("utf-8", "replace")
                return {
                    "ok": 200 <= response.status < 300,
                    "status": response.status,
                    "attempt": attempt,
                    "body": text[:500],
                }
        except (OSError, urllib.error.URLError, urllib.error.HTTPError) as exc:
            last_error = str(exc)
            time.sleep(1)
    return {"ok": False, "error": last_error}


def repair_target(target: dict) -> dict:
    backend_dir = target["backendDir"]
    if not os.path.isdir(backend_dir):
        fail(f"Backend dir does not exist: {backend_dir}")

    env = read_env_file(backend_dir)
    backup = ensure_cloud_backup_path(env.get("YOUCHAT_BACKUP_HOST_PATH", ""))
    compose_output = compose_up(target)
    containers = [inspect_container(name) for name in target["containers"]]
    not_running = [item for item in containers if item["status"] != "running"]
    if not_running:
        fail(f"Some sidecar containers are not running: {not_running}")
    control = wait_control_status(target.get("controlStatusUrl", ""), env.get("YOUCHAT_CONTROL_TOKEN", ""))
    return {
        "name": target["name"],
        "backendDir": backend_dir,
        "backup": backup,
        "composeOutput": compose_output,
        "containers": containers,
        "controlStatus": control,
    }


def main() -> None:
    payload = json.loads(base64.b64decode(sys.argv[1]).decode("utf-8"))
    selected = payload.get("selected") or []
    targets = [target for target in payload["targets"] if not selected or target["name"] in selected]
    if not targets:
        fail(f"No matching targets for selection: {selected}")

    results = []
    for target in targets:
        print(f"=== Repair {target['name']} ===", flush=True)
        result = repair_target(target)
        results.append(result)
        print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)

    print("=== Summary ===", flush=True)
    print(json.dumps({"success": True, "results": results}, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"success": False, "error": str(exc)}, ensure_ascii=False, indent=2), file=sys.stderr)
        raise
'''


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
        raise SystemExit("paramiko is required to repair FnOS sidecars over SSH.")


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


def load_targets() -> list[dict]:
    raw = os.environ.get("FNOS_SIDECAR_TARGETS_JSON", "").strip()
    if not raw:
        return DEFAULT_TARGETS
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"FNOS_SIDECAR_TARGETS_JSON is not valid JSON: {exc}") from exc
    if not isinstance(data, list) or not data:
        raise SystemExit("FNOS_SIDECAR_TARGETS_JSON must be a non-empty JSON array.")
    return data


def selected_targets() -> list[str]:
    raw = os.environ.get("FNOS_SIDECAR_TARGET", "all").strip()
    if not raw or raw == "all":
        return []
    return [item.strip() for item in raw.split(",") if item.strip()]


def main() -> None:
    paramiko = import_paramiko()
    host = os.environ.get("FNOS_HOST", "192.168.9.83")
    user = os.environ.get("FNOS_USER", "Boom")
    port = int(os.environ.get("FNOS_PORT", "22"))
    password = os.environ.get("FNOS_PASSWORD")
    sudo_password = os.environ.get("FNOS_SUDO_PASSWORD", password or "")
    if not password:
        raise SystemExit("Set FNOS_PASSWORD before repairing FnOS sidecars.")

    payload = {
        "targets": load_targets(),
        "selected": selected_targets(),
    }
    encoded_payload = base64.b64encode(json.dumps(payload, ensure_ascii=True).encode("utf-8")).decode("ascii")
    remote_path = f"/tmp/youchat-sidecar-repair-{int(time.time())}-{os.getpid()}.py"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=host,
        port=port,
        username=user,
        password=password,
        timeout=15,
        banner_timeout=15,
        auth_timeout=15,
    )
    try:
        sftp = client.open_sftp()
        try:
            with sftp.file(remote_path, "wb") as handle:
                handle.write(REMOTE_REPAIR_SCRIPT.encode("utf-8"))
            sftp.chmod(remote_path, 0o700)
        finally:
            sftp.close()

        sudo_command = f"printf %s {quote(sudo_password + chr(10))} | sudo -S -p '' python3 {quote(remote_path)} {quote(encoded_payload)}"
        output = run_ssh(client, sudo_command, timeout=600)
        print(output)
    finally:
        try:
            run_ssh(client, f"rm -f {quote(remote_path)}", timeout=30)
        except Exception:
            pass
        client.close()


if __name__ == "__main__":
    main()

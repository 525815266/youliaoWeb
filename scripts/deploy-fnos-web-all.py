#!/usr/bin/env python3
"""Deploy the Web client to every configured fnOS YouChat Web target."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_TARGETS_FILE = PROJECT_ROOT / "deploy" / "fnos-web-targets.json"
DEPLOY_SCRIPT = PROJECT_ROOT / "scripts" / "deploy-fnos-web.py"


def load_targets() -> list[dict]:
    targets_file = pathlib.Path(os.environ.get("FNOS_WEB_TARGETS_FILE", DEFAULT_TARGETS_FILE))
    if not targets_file.exists():
        raise SystemExit(f"Missing targets file: {targets_file}")
    data = json.loads(targets_file.read_text(encoding="utf-8"))
    targets = data.get("targets")
    if not isinstance(targets, list) or not targets:
        raise SystemExit(f"No targets configured in {targets_file}")
    return targets


def require_text(target: dict, key: str) -> str:
    value = str(target.get(key, "")).strip()
    if not value:
        raise SystemExit(f"Target {target.get('name') or '<unnamed>'} is missing {key}")
    return value


def deploy_target(target: dict) -> None:
    name = require_text(target, "name")
    label = str(target.get("label") or name)
    env = os.environ.copy()
    env["FNOS_WEB_REMOTE_DIR"] = require_text(target, "remoteDir")
    env["FNOS_WEB_PROJECT_NAME"] = require_text(target, "projectName")
    env["FNOS_WEB_COMPOSE_FILE"] = str(target.get("composeFile") or "compose.yaml")
    env["FNOS_WEB_ENV_OVERRIDES_JSON"] = json.dumps(target.get("env") or {}, ensure_ascii=False)

    print(f"\n=== Deploying {label} ({name}) ===", flush=True)
    subprocess.run([sys.executable, str(DEPLOY_SCRIPT)], cwd=PROJECT_ROOT, env=env, check=True)
    verify_health(target)


def verify_health(target: dict) -> None:
    health_url = require_text(target, "healthUrl")
    expected_api_base = str(target.get("expectedApiBase") or "").strip()
    try:
        with urllib.request.urlopen(health_url, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8", "replace"))
    except (OSError, urllib.error.URLError, json.JSONDecodeError) as exc:
        raise SystemExit(f"Health check failed for {health_url}: {exc}") from exc

    if not payload.get("ok"):
        raise SystemExit(f"Health check returned not-ok for {health_url}: {payload}")
    actual_api_base = str(payload.get("apiBase") or "")
    if expected_api_base and actual_api_base != expected_api_base:
        raise SystemExit(
            f"Health check API base mismatch for {health_url}: "
            f"expected {expected_api_base}, got {actual_api_base}"
        )
    print(f"Health OK: {health_url} apiBase={actual_api_base}", flush=True)


def main() -> None:
    if not os.environ.get("FNOS_PASSWORD"):
        raise SystemExit("Set FNOS_PASSWORD before deploying.")
    targets = load_targets()
    for target in targets:
        deploy_target(target)
    print("\nAll fnOS Web targets deployed successfully.", flush=True)


if __name__ == "__main__":
    main()

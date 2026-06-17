#!/usr/bin/env python3
"""Deploy PromptWorks as a sidecar prompt training workbench on fnOS."""

from __future__ import annotations

import json
import os
import pathlib
import re
import time
import urllib.error
import urllib.request
import urllib.parse


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
COMPOSE_SOURCE = PROJECT_ROOT / "deploy" / "promptworks-compose.fnos.yaml"
NGINX_SOURCE = PROJECT_ROOT / "deploy" / "promptworks-nginx.conf"
AI_PROVIDERS_FILE = PROJECT_ROOT / "config" / "ai-providers.json"
DEFAULT_REMOTE_DIR = "/vol1/1000/Docker/promptworks"
DEFAULT_PROJECT_NAME = "promptworks"
DEFAULT_FRONTEND_PORT = "5188"


def import_paramiko():
    try:
        import paramiko  # type: ignore

        return paramiko
    except ImportError:
        raise SystemExit("paramiko is required to deploy over SSH.") from None


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


def load_ai_provider_seed() -> list[dict[str, object]]:
    if os.environ.get("PROMPTWORKS_SEED_AI", "1") == "0":
        return []
    if not AI_PROVIDERS_FILE.exists():
        return []
    try:
        raw = json.loads(AI_PROVIDERS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    providers = raw.get("providers")
    if not isinstance(providers, dict):
        return []

    seeds: list[dict[str, object]] = []
    for key, provider in providers.items():
        if not isinstance(provider, dict):
            continue
        api_key = str(provider.get("apiKey") or "").strip()
        base_url = str(provider.get("baseUrl") or "").strip().rstrip("/")
        model = str(provider.get("model") or "").strip()
        label = str(provider.get("label") or provider.get("name") or key).strip()
        auth_type = str(provider.get("authType") or "bearer").strip().lower()
        if not api_key or not base_url or not model:
            continue
        if auth_type not in ("bearer", "openai", ""):
            continue
        if key == "sub2" and not base_url.endswith("/v1"):
            base_url = f"{base_url}/v1"
        if key == "deepseek" and not base_url.endswith("/v1"):
            base_url = f"{base_url}/v1"
        seeds.append(
            {
                "provider_name": label,
                "provider_key": key,
                "base_url": base_url,
                "api_key": api_key,
                "model": model,
                "models": provider.get("modelOptions") if isinstance(provider.get("modelOptions"), list) else [model],
            }
        )
    return seeds


def request_json(url: str, method: str = "GET", payload: dict[str, object] | None = None) -> object:
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=20) as response:
        text = response.read().decode("utf-8", "replace")
    if not text:
        return None
    return json.loads(text)


def wait_for_promptworks(base_url: str) -> None:
    last_error = ""
    for _ in range(36):
        try:
            request_json(f"{base_url}/api/v1/project-info/summary")
            return
        except Exception as exc:  # noqa: BLE001 - diagnostics for deploy script
            last_error = str(exc)
            time.sleep(5)
    raise RuntimeError(f"PromptWorks did not become ready: {last_error}")


def verify_frontend_api_base(base_url: str) -> None:
    index = str(request_text(f"{base_url}/"))
    scripts = re.findall(r'<script[^>]+src="([^"]+\.js)"', index)
    if not scripts:
        raise RuntimeError("PromptWorks frontend index did not expose a JavaScript bundle.")
    checked = 0
    for script in scripts:
        script_url = urllib.parse.urljoin(f"{base_url}/", script)
        body = request_text(script_url)
        checked += 1
        if "http://localhost:8000/api/v1" in body:
            raise RuntimeError(
                "PromptWorks frontend still points to http://localhost:8000/api/v1. "
                "The frontend bundle patch did not apply."
            )
    if checked:
        print(f"Verified frontend API base in {checked} bundle(s).")


def verify_promptworks_browser_paths(base_url: str) -> None:
    prompts_url = f"{base_url}/api/v1/prompts"
    request_json(prompts_url)
    classes_url = f"{base_url}/api/v1/prompt-classes"
    request_json(classes_url)
    print("Verified browser API redirect paths.")


def request_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"Accept": "*/*"}, method="GET")
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode("utf-8", "replace")


def seed_ai_providers(base_url: str) -> None:
    seeds = load_ai_provider_seed()
    if not seeds:
        print("AI provider seed skipped.")
        return

    existing_raw = request_json(f"{base_url}/api/v1/llm-providers/")
    existing = existing_raw if isinstance(existing_raw, list) else []
    existing_by_name = {
        str(item.get("provider_name")): item
        for item in existing
        if isinstance(item, dict) and item.get("provider_name")
    }

    for seed in seeds:
        provider_name = str(seed["provider_name"])
        provider = existing_by_name.get(provider_name)
        if provider:
            provider_id = int(provider["id"])
        else:
            create_payload = {
                "provider_name": provider_name,
                "provider_key": seed.get("provider_key"),
                "base_url": seed["base_url"],
                "api_key": seed["api_key"],
                "is_custom": True,
            }
            provider = request_json(f"{base_url}/api/v1/llm-providers/", "POST", create_payload)
            if not isinstance(provider, dict) or not provider.get("id"):
                raise RuntimeError(f"failed to create PromptWorks provider: {provider_name}")
            provider_id = int(provider["id"])
            print(f"Seeded provider: {provider_name}")

        current_models = provider.get("models") if isinstance(provider, dict) else []
        current_names = {
            str(item.get("name"))
            for item in current_models
            if isinstance(item, dict) and item.get("name")
        }
        model_names = []
        for item in seed.get("models", []):
            name = str(item or "").strip()
            if name and name not in model_names:
                model_names.append(name)
        for name in model_names:
            if name in current_names:
                continue
            try:
                request_json(
                    f"{base_url}/api/v1/llm-providers/{provider_id}/models",
                    "POST",
                    {
                        "name": name,
                        "capability": "chat",
                        "concurrency_limit": 3,
                        "cost_currency": "USD",
                        "cost_display_currency": "CNY",
                        "cost_exchange_rate": 7.2,
                        "cost_pricing_unit": 1000000,
                    },
                )
                print(f"Seeded model for {provider_name}: {name}")
            except urllib.error.HTTPError as exc:
                if exc.code != 400:
                    raise

        default_model = str(seed.get("model") or "").strip()
        if default_model:
            request_json(
                f"{base_url}/api/v1/llm-providers/{provider_id}",
                "PATCH",
                {"default_model_name": default_model},
            )


def deploy() -> None:
    if not COMPOSE_SOURCE.exists():
        raise SystemExit(f"Missing compose file: {COMPOSE_SOURCE}")
    if not NGINX_SOURCE.exists():
        raise SystemExit(f"Missing nginx file: {NGINX_SOURCE}")

    paramiko = import_paramiko()
    host = os.environ.get("FNOS_HOST", "192.168.9.83")
    user = os.environ.get("FNOS_USER", "Boom")
    port = int(os.environ.get("FNOS_PORT", "22"))
    password = os.environ.get("FNOS_PASSWORD")
    sudo_password = os.environ.get("FNOS_SUDO_PASSWORD", password or "")
    remote_dir = os.environ.get("PROMPTWORKS_REMOTE_DIR", DEFAULT_REMOTE_DIR)
    project_name = os.environ.get("PROMPTWORKS_PROJECT_NAME", DEFAULT_PROJECT_NAME)
    frontend_port = os.environ.get("PROMPTWORKS_FRONTEND_PORT", DEFAULT_FRONTEND_PORT)
    if not password:
        raise SystemExit("Set FNOS_PASSWORD before deploying.")

    remote_compose = f"{remote_dir}/compose.yaml"
    remote_nginx = f"{remote_dir}/nginx.conf"
    remote_tmp = f"/tmp/promptworks-compose-{int(time.time())}.yaml"
    remote_nginx_tmp = f"/tmp/promptworks-nginx-{int(time.time())}.conf"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, port=port, username=user, password=password, timeout=15, banner_timeout=15, auth_timeout=15)
    try:
        sftp = client.open_sftp()
        try:
            sftp.put(str(COMPOSE_SOURCE), remote_tmp)
            sftp.put(str(NGINX_SOURCE), remote_nginx_tmp)
        finally:
            sftp.close()

        run_ssh(client, f"mkdir -p {quote(remote_dir)}")
        run_ssh(client, f"mv {quote(remote_tmp)} {quote(remote_compose)}")
        run_ssh(client, f"mv {quote(remote_nginx_tmp)} {quote(remote_nginx)}")
        run_ssh(
            client,
            f"cd {quote(remote_dir)} && "
            f"if [ ! -f .env ]; then printf 'PROMPTWORKS_FRONTEND_PORT={frontend_port}\\n' > .env; fi && "
            f"if ! grep -q '^PROMPTWORKS_FRONTEND_PORT=' .env; then printf '\\nPROMPTWORKS_FRONTEND_PORT={frontend_port}\\n' >> .env; fi",
        )

        sudo_input = f"{sudo_password}\n"
        compose_args = f"-p {quote(project_name)} -f {quote('compose.yaml')}"
        print(
            run_ssh(
                client,
                f"cd {quote(remote_dir)} && sudo -S docker compose {compose_args} pull",
                timeout=1200,
                input_text=sudo_input,
            )
        )
        print(
            run_ssh(
                client,
                f"cd {quote(remote_dir)} && sudo -S docker compose {compose_args} up -d",
                timeout=1200,
                input_text=sudo_input,
            )
        )
        print(
            run_ssh(
                client,
                f"cd {quote(remote_dir)} && sudo -S docker compose {compose_args} ps",
                timeout=120,
                input_text=sudo_input,
            )
        )
    finally:
        client.close()

    base_url = f"http://{host}:{frontend_port}"
    wait_for_promptworks(base_url)
    verify_frontend_api_base(base_url)
    verify_promptworks_browser_paths(base_url)
    seed_ai_providers(base_url)
    print(f"PromptWorks is ready: {base_url}")


if __name__ == "__main__":
    deploy()

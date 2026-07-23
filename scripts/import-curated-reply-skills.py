#!/usr/bin/env python3
"""Import curated customer-service reply records into YouChat reply skills."""

from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import re
import sys
import urllib.request
from datetime import datetime, timezone
from typing import Any


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_SKILLS_FILE = PROJECT_ROOT / "data" / "reply-skills.json"


KEYWORD_PRESETS = {
    "提现失败-支付宝余额不足": {
        "keywords": ["支付宝接口异常", "付款方余额不足", "支付宝余额不足", "官方返回数据错误", "提现失败", "无法提现"],
        "negativeKeywords": ["微信提现", "长时间未下单", "100天未下单", "提现成功"],
    },
    "提现失败-长时间未下单": {
        "keywords": ["超过100天", "100天未下单", "长时间未下单", "无法提现", "近期下单", "一起提取"],
        "negativeKeywords": ["付款方余额不足", "支付宝接口异常", "微信提现", "提现成功"],
    },
    "提现失败-未绑定支付宝": {
        "keywords": ["未绑定支付宝", "需要绑定支付宝", "绑定支付宝", "登记", "支付宝账号"],
        "negativeKeywords": ["订单查不到", "付款方余额不足", "100天未下单"],
    },
    "订单显示为空": {
        "keywords": ["订单显示为空", "订单是空的", "点进去是空", "看不到订单", "机器人分类", "小程序登录"],
        "negativeKeywords": ["提现", "维权", "退换货"],
    },
    "提现问题-其他": {
        "keywords": ["提现有问题", "提不了", "无法提现", "怎么提现", "提取失败", "提现提示"],
        "negativeKeywords": ["提现成功", "已到账"],
    },
    "无法提现-情绪安抚": {
        "keywords": ["一直不能提现", "怎么还没处理", "太慢", "人工", "客服", "着急", "还没到账"],
        "negativeKeywords": ["提现成功", "已到账"],
    },
    "提现到账方式咨询": {
        "keywords": ["到微信零钱", "到支付宝", "提现到哪里", "到账方式", "微信零钱还是支付宝", "提现吗"],
        "negativeKeywords": ["付款方余额不足", "长时间未下单"],
    },
    "快递理赔/纠纷-进度咨询": {
        "keywords": ["快递理赔", "纠纷", "处理进度", "怎么还没处理", "协商", "上游反馈"],
        "negativeKeywords": ["提现", "订单为空"],
    },
    "快递理赔/纠纷-定价疑问": {
        "keywords": ["定价", "价格", "理赔金额", "不合理", "同款", "淘宝下单同款"],
        "negativeKeywords": ["提现", "订单为空"],
    },
    "订单退换货提示异常": {
        "keywords": ["退换货", "退货", "退款", "换货", "维权", "确认收货", "一直提示"],
        "negativeKeywords": ["提现成功", "到账方式"],
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", "-i", default="-", help="JSON input file. Use '-' for stdin.")
    parser.add_argument("--file", default="", help="Local reply-skills.json path to update.")
    parser.add_argument("--target", action="append", default=[], help="Remote /local/reply-skills endpoint to update. Repeatable.")
    parser.add_argument("--source-name", default="人工整理客服记录", help="Source label stored on imported skills.")
    parser.add_argument("--dry-run", action="store_true", help="Print summary without writing.")
    return parser.parse_args()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def load_text(path: str) -> str:
    if path == "-":
        return sys.stdin.read()
    return pathlib.Path(path).read_text(encoding="utf-8")


def parse_jsonish(text: str) -> list[dict[str, Any]]:
    cleaned = text.strip().strip("`")
    cleaned = re.sub(r'("sourceRef"\s*:\s*)(?=[,}])', r"\1null", cleaned)
    cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
    data = json.loads(cleaned)
    if not isinstance(data, list):
        raise ValueError("Input must be a JSON array.")
    return [item for item in data if isinstance(item, dict)]


def stable_id(item: dict[str, Any]) -> str:
    seed = "\n".join([
        str(item.get("skill") or ""),
        str(item.get("intent") or ""),
        str(item.get("scenario") or ""),
    ]).strip()
    digest = hashlib.sha1(seed.encode("utf-8")).hexdigest()[:12]
    return f"curated-{digest}"


def broad_intent_key(intent: str, scenario: str) -> str:
    text = f"{intent}\n{scenario}"
    if "提现" in text or "提取" in text:
        return "withdraw_query"
    if "订单" in text and ("空" in text or "查" in text or "退换货" in text or "维权" in text):
        return "order_missing"
    return "general"


def normalize_platform_key(value: Any) -> tuple[str, list[str], str]:
    raw = str(value or "").strip()
    if not raw or raw == "all":
        return "", [], raw or "all"
    if "," in raw:
        keys = [part.strip() for part in raw.split(",") if part.strip() and part.strip() != "all"]
        return keys[0] if len(keys) == 1 else "", keys, raw
    return raw, [], raw


def unique(values: list[Any], limit: int = 20) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = str(value or "").strip()
        if not text or text in seen:
            continue
        seen.add(text)
        result.append(text)
        if len(result) >= limit:
            break
    return result


def generated_samples(item: dict[str, Any], keywords: list[str]) -> list[str]:
    scenario = str(item.get("scenario") or "").strip()
    intent = str(item.get("intent") or "").strip()
    samples = [
        scenario,
        intent,
        *keywords[:8],
    ]
    if "余额不足" in intent:
        samples += ["提现提示付款方余额不足", "支付宝接口异常可以提现吗", "为什么提现失败"]
    if "长时间未下单" in intent:
        samples += ["提示我100天没下单不能提现", "长时间没下单怎么提取"]
    if "未绑定支付宝" in intent:
        samples += ["提现要绑定支付宝怎么办", "怎么登记支付宝"]
    if "订单显示为空" in intent:
        samples += ["订单页面是空的", "订单点进去什么都没有"]
    if "退换货" in intent:
        samples += ["为什么一直显示退换货", "我已经确认收货了还提示维权"]
    return unique(samples, 12)


def build_skill(item: dict[str, Any], source_name: str) -> dict[str, Any]:
    intent = str(item.get("intent") or "").strip()
    scenario = str(item.get("scenario") or "").strip()
    reply = str(item.get("reply") or "").strip()
    skill_name = str(item.get("skill") or intent or "人工整理回复").strip()
    platform_key, platform_keys, raw_platform = normalize_platform_key(item.get("platformKey"))
    preset = KEYWORD_PRESETS.get(intent, {})
    keywords = unique([
        *(preset.get("keywords") or []),
        intent,
        skill_name,
    ], 20)
    negative_keywords = unique(preset.get("negativeKeywords") or [], 20)
    intent_key = broad_intent_key(intent, scenario)
    allow_auto = bool(item.get("allowAutoReply"))
    recommend_only = bool(item.get("recommendOnly"))
    no_reply = bool(item.get("noReply"))

    skill: dict[str, Any] = {
        "id": stable_id(item),
        "title": f"{skill_name}：{intent}" if skill_name and skill_name != intent else intent,
        "source": "curated",
        "enabled": True,
        "allowAutoReply": allow_auto and not recommend_only and not no_reply,
        "recommendOnly": recommend_only,
        "noReply": no_reply,
        "priority": 78 if allow_auto else 70,
        "intentKey": intent_key,
        "intentKeys": unique([intent_key], 4),
        "keywords": keywords,
        "negativeKeywords": negative_keywords,
        "samples": generated_samples(item, keywords),
        "replySteps": ([{"type": "text", "content": reply, "url": "", "label": ""}] if reply and not no_reply else []),
        "fallback": reply,
        "contactUrl": "",
        "learningMode": "approved" if allow_auto and not recommend_only and not no_reply else "review_queue",
        "trainingStatus": "approved" if allow_auto and not recommend_only and not no_reply else "needs_review",
        "trainingNote": "来自人工整理的常见问题，导入后建议在 skill 训练页继续审核。",
        "sourceRef": item.get("sourceRef") or source_name,
        "scenario": scenario,
        "curatedIntent": intent,
        "platformScope": raw_platform,
        "updatedAt": now_iso(),
    }
    if platform_key:
        skill["platformKey"] = platform_key
    if platform_keys:
        skill["platformKeys"] = platform_keys
    return skill


def merge_skills(payload: dict[str, Any], imported: list[dict[str, Any]]) -> tuple[dict[str, Any], dict[str, int]]:
    existing = payload.get("skills") if isinstance(payload, dict) else []
    if not isinstance(existing, list):
        existing = []
    by_id = {str(skill.get("id") or ""): skill for skill in existing if isinstance(skill, dict)}
    inserted = 0
    updated = 0
    for skill in imported:
        sid = str(skill["id"])
        previous = by_id.get(sid)
        if previous:
            skill["hitCount"] = previous.get("hitCount", skill.get("hitCount", 0))
            if previous.get("manualOverrides"):
                skill["manualOverrides"] = previous["manualOverrides"]
            updated += 1
        else:
            inserted += 1
        by_id[sid] = {**(previous or {}), **skill}
    existing_ids = [str(skill.get("id") or "") for skill in existing if isinstance(skill, dict)]
    ordered_import_ids = [str(skill["id"]) for skill in imported]
    ordered = [by_id[sid] for sid in ordered_import_ids]
    ordered += [by_id[sid] for sid in existing_ids if sid in by_id and sid not in set(ordered_import_ids)]
    return {
        "version": int(payload.get("version") or 1) if isinstance(payload, dict) else 1,
        "updatedAt": now_iso(),
        "skills": ordered,
    }, {"inserted": inserted, "updated": updated, "total": len(ordered)}


def read_remote(url: str) -> dict[str, Any]:
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.loads(response.read().decode("utf-8", "replace"))


def write_remote(url: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(url, data=body, method="POST", headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8", "replace"))


def read_file(path: pathlib.Path) -> dict[str, Any]:
    if not path.exists():
        return {"version": 1, "updatedAt": None, "skills": []}
    return json.loads(path.read_text(encoding="utf-8"))


def write_file(path: pathlib.Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def main() -> None:
    args = parse_args()
    records = parse_jsonish(load_text(args.input))
    imported = [build_skill(item, args.source_name) for item in records]
    targets = args.target or []
    summaries: list[dict[str, Any]] = []

    if args.file:
        path = pathlib.Path(args.file)
        payload, summary = merge_skills(read_file(path), imported)
        if not args.dry_run:
            write_file(path, payload)
        summaries.append({"target": str(path), **summary, "dryRun": args.dry_run})

    for target in targets:
        payload, summary = merge_skills(read_remote(target), imported)
        if not args.dry_run:
            write_remote(target, payload)
        summaries.append({"target": target, **summary, "dryRun": args.dry_run})

    if not args.file and not targets:
        payload, summary = merge_skills(read_file(DEFAULT_SKILLS_FILE), imported)
        if not args.dry_run:
            write_file(DEFAULT_SKILLS_FILE, payload)
        summaries.append({"target": str(DEFAULT_SKILLS_FILE), **summary, "dryRun": args.dry_run})

    print(json.dumps({
        "success": True,
        "imported": len(imported),
        "skillIds": [skill["id"] for skill in imported],
        "summaries": summaries,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

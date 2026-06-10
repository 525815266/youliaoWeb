const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const signalR = require("@microsoft/signalr");

const PORT = Number(process.env.PORT || 5177);
const DEFAULT_API_BASE = process.env.YOUCHAT_API_BASE || "http://192.168.9.83:18080/api";
const DEFAULT_AI_BASE = process.env.YOUCHAT_AI_BASE || "https://sub2.sn55.cn/";
const DEFAULT_AI_MODEL = process.env.YOUCHAT_AI_MODEL || "gpt-5.4-mini";
const PUBLIC_DIR = path.join(__dirname, "public");
const CLIENT_WWWROOT = process.env.YOUCHAT_DESKTOP_WWWROOT || "C:\\Program Files\\youchat-desktop\\wwwroot";
const SIGNALR_BROWSER_FILE = path.join(__dirname, "node_modules", "@microsoft", "signalr", "dist", "browser", "signalr.min.js");
const LOG_DIR = path.join(__dirname, "logs");
const DATA_DIR = path.join(__dirname, "data");
const REPLY_SKILLS_FILE = path.join(DATA_DIR, "reply-skills.json");
const API_CAPTURE_FILE = path.join(LOG_DIR, "api-capture.ndjson");
const MAX_CAPTURE_TEXT = 8000;
const MAX_LINK_PREVIEW_BYTES = 900000;
const API_PROXY_TIMEOUT_MS = 60000;
const OSS_UPLOAD_TIMEOUT_MS = 70000;
const AI_PROXY_TIMEOUT_MS = 90000;
const SIGNALR_START_TIMEOUT_MS = 12000;
const SIGNALR_KEEP_ALIVE_MS = 120000;
const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|ogv|mov|m4v|m3u8)(?:$|\?)/i;
const signalRHubConnections = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = API_PROXY_TIMEOUT_MS, label = "request") {
  const controller = new AbortController();
  const externalSignal = options.signal;
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const abortFromExternal = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", abortFromExternal, { once: true });
  }

  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } catch (error) {
    if (timedOut) throw new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`);
    if (error?.name === "AbortError") throw new Error(`${label} was canceled`);
    throw error;
  } finally {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener("abort", abortFromExternal);
  }
}

function sendClientBraftIcons(res) {
  try {
    const cssFile = fs
      .readdirSync(CLIENT_WWWROOT)
      .find((name) => name.endsWith(".css") && fs.readFileSync(path.join(CLIENT_WWWROOT, name), "utf8").includes("braft-icons"));
    if (!cssFile) throw new Error("braft-icons CSS not found in desktop wwwroot");
    const css = fs.readFileSync(path.join(CLIENT_WWWROOT, cssFile), "utf8");
    const match = css.match(/@font-face\{font-family:braft-icons;src:url\((data:font\/woff;base64,[^)]+)\)/);
    if (!match) throw new Error("braft-icons font data not found");
    const buffer = Buffer.from(match[1].replace(/^data:font\/woff;base64,/, ""), "base64");
    res.writeHead(200, {
      "Content-Type": "font/woff",
      "Cache-Control": "public, max-age=86400"
    });
    res.end(buffer);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error.message);
  }
}

function sendClientStaticAsset(res, relativePath, contentType) {
  const filePath = path.normalize(path.join(CLIENT_WWWROOT, relativePath));
  if (!filePath.startsWith(CLIENT_WWWROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400"
    });
    res.end(content);
  });
}

function sendSignalRBrowserClient(res) {
  fs.readFile(SIGNALR_BROWSER_FILE, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("@microsoft/signalr browser bundle not found. Run npm install in the project root.");
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    });
    res.end(content);
  });
}

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function trimCaptureText(value, max = MAX_CAPTURE_TEXT) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max)}...<truncated ${text.length - max} chars>` : text;
}

function decodeCaptureBody(buffer, contentType = "") {
  if (!buffer || !buffer.length) return "";
  const type = String(contentType || "").toLowerCase();
  if (
    type.includes("application/json") ||
    type.includes("text/") ||
    type.includes("application/x-www-form-urlencoded") ||
    type.includes("multipart/form-data") ||
    !type
  ) {
    return trimCaptureText(buffer.toString("utf8"));
  }
  return `<binary ${buffer.length} bytes>`;
}

function summarizeUploadConfig(config = {}) {
  return {
    cloudType: config.cloudType,
    qnDomain: config.qnDomain || config.qiniuDomain || "",
    qnRegionUrl: config.qnRegionUrl || config.qiniuUploadUrl || config.qnUploadUrl || "",
    hasQnToken: Boolean(config.qnToken || config.qiniuToken || config.uploadToken),
    txHostUrl: config.txHostUrl || "",
    uploadUrl: config.uploadUrl || config.action || config.host || config.endpoint || config.ossHost || config.domain || "",
    hasPolicy: Boolean(config.policy || config.Policy),
    hasSignature: Boolean(config.signature || config.Signature)
  };
}

function captureApi(entry) {
  try {
    ensureLogDir();
    fs.appendFileSync(API_CAPTURE_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    console.warn(`Failed to write API capture log: ${error.message}`);
  }
}

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function defaultReplySkills() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    skills: [
      {
        id: "order-redpacket-not-bound",
        title: "订单查不到/红包避坑",
        source: "built-in",
        enabled: true,
        allowAutoReply: true,
        noReply: false,
        priority: 90,
        intentKey: "order_missing",
        keywords: [
          "查不到",
          "怎么查不到",
          "这一单怎么查不到",
          "没有绑定",
          "没绑定",
          "绑定失败",
          "没成功",
          "没有返利",
          "没返利",
          "无返利",
          "订单没有",
          "怎么没有"
        ],
        negativeKeywords: ["提现成功", "提现", "到账", "支付宝", "绑定支付宝", "未绑定支付宝"],
        samples: ["这一单怎么查不到", "查询后怎么没绑定", "怎么没成功"],
        replySteps: [
          {
            type: "text",
            content: "你好，目前大促期间订单没有返利，常见是两种原因：用了不参与返利的红包，或者从直播间/其他入口返回下单。你可以先检查订单优惠明细，如果用了红包，建议尽快取消后去掉红包重新下。"
          },
          {
            type: "image",
            url: "/assets/skill-order-redpacket-guide.png",
            label: "下单攻略/红包避坑图"
          },
          {
            type: "text",
            content: "不提示返利的订单，大概率就是用了红包或入口不对。取消后商家一般会自动拦截；如果不取消，这单通常就没有返利了。仍有疑问的话，可以发“客服”联系在线客服继续核实。"
          }
        ],
        fallback: "如果客户仍有疑问，引导发送“客服”联系在线客服。",
        contactUrl: "https://work.weixin.qq.com/kfid/kfcac6535078c49e290"
      },
      {
        id: "alipay-bind-failed",
        title: "支付宝绑定失败",
        source: "built-in",
        enabled: true,
        allowAutoReply: true,
        noReply: false,
        priority: 88,
        intentKey: "bind_failed",
        keywords: [
          "绑定支付宝",
          "绑定失败",
          "未绑定支付宝",
          "能不绑定支付宝吗",
          "怎么没绑定",
          "怎么没成功",
          "绑定方法",
          "支付宝账号"
        ],
        negativeKeywords: ["订单查不到", "没返利", "无返利", "红包"],
        samples: ["绑定支付宝", "绑定失败", "能不绑定支付宝吗"],
        replySteps: [
          {
            type: "text",
            content: "亲，绑定支付宝需要按这个格式发送：绑定支付宝 姓名 支付宝账号。中间要留空格，比如：绑定支付宝 张三 123456@qq.com。"
          },
          {
            type: "text",
            content: "如果还是提示失败，麻烦核对姓名和支付宝账号是否一致；不确定的话可以重新发一遍，我帮您看下格式。"
          }
        ],
        fallback: "引导客户按“绑定支付宝 姓名 支付宝账号”的格式重新发送。"
      },
      {
        id: "withdraw-success-no-reply",
        title: "提现成功提醒，无需回复",
        source: "built-in",
        enabled: true,
        allowAutoReply: false,
        noReply: true,
        priority: 80,
        intentKey: "withdraw_query",
        keywords: ["提现成功", "提取成功", "提了成功", "已经处理", "成功到账", "提现已提交", "提取已提交", "正在等待处理", "正在同步处理"],
        negativeKeywords: ["怎么", "为什么", "不到账", "没到账", "多久", "什么时候"],
        samples: ["提现成功", "提取成功", "您的提现已提交系统", "您的提现将尽快处理"],
        replySteps: [],
        fallback: "这类消息通常只是提醒客服查看状态，不需要回复客户。"
      },
      {
        id: "system-conversation-event",
        title: "系统会话提示，无需回复",
        source: "built-in",
        enabled: true,
        allowAutoReply: false,
        noReply: true,
        systemOnly: true,
        priority: 70,
        intentKey: "general",
        keywords: ["会话", "结束", "接待客服", "类型：系统关闭", "系统提示"],
        negativeKeywords: [],
        samples: ["会话结束，接待客服，类型：系统关闭"],
        replySteps: [],
        fallback: "这是内部系统提示，只给客服看，不作为客户消息处理。"
      }
    ]
  };
}

function mergeDefaultReplySkills(data) {
  const defaults = defaultReplySkills();
  const existing = Array.isArray(data?.skills) ? data.skills : [];
  const seen = new Set(existing.map((skill) => String(skill.id || "")));
  const missing = defaults.skills.filter((skill) => !seen.has(String(skill.id)));
  return {
    changed: missing.length > 0,
    data: {
      version: Number(data?.version || defaults.version || 1),
      updatedAt: data?.updatedAt || defaults.updatedAt,
      skills: [...existing, ...missing]
    }
  };
}

function readReplySkills() {
  ensureDataDir();
  if (!fs.existsSync(REPLY_SKILLS_FILE)) {
    const defaults = defaultReplySkills();
    fs.writeFileSync(REPLY_SKILLS_FILE, JSON.stringify(defaults, null, 2), "utf8");
    return defaults;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(REPLY_SKILLS_FILE, "utf8"));
    if (parsed && Array.isArray(parsed.skills)) {
      const merged = mergeDefaultReplySkills(parsed);
      if (merged.changed) return writeReplySkills(merged.data);
      return merged.data;
    }
  } catch (error) {
    const backup = `${REPLY_SKILLS_FILE}.${Date.now()}.broken`;
    fs.copyFileSync(REPLY_SKILLS_FILE, backup);
    console.warn(`Reply skills file was invalid, backed up to ${backup}`);
  }

  const defaults = defaultReplySkills();
  fs.writeFileSync(REPLY_SKILLS_FILE, JSON.stringify(defaults, null, 2), "utf8");
  return defaults;
}

function writeReplySkills(payload) {
  ensureDataDir();
  const next = {
    version: Number(payload.version || 1),
    updatedAt: new Date().toISOString(),
    skills: Array.isArray(payload.skills) ? payload.skills : []
  };
  fs.writeFileSync(REPLY_SKILLS_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

function normalizeLearnedSkill(skill) {
  const now = Date.now();
  const title = String(skill.title || "自动学习回复").trim();
  const normalized = {
    id: String(skill.id || `learned-${now}`),
    title,
    source: skill.source || "learned",
    enabled: skill.enabled !== false,
    allowAutoReply: Boolean(skill.allowAutoReply),
    noReply: Boolean(skill.noReply),
    priority: Number.isFinite(Number(skill.priority)) ? Number(skill.priority) : 50,
    hitCount: Number.isFinite(Number(skill.hitCount || skill.learnCount)) ? Number(skill.hitCount || skill.learnCount) : 1,
    keywords: Array.isArray(skill.keywords) ? skill.keywords.map(String).filter(Boolean).slice(0, 20) : [],
    negativeKeywords: Array.isArray(skill.negativeKeywords) ? skill.negativeKeywords.map(String).filter(Boolean).slice(0, 20) : [],
    samples: Array.isArray(skill.samples) ? skill.samples.map(String).filter(Boolean).slice(0, 10) : [],
    replySteps: Array.isArray(skill.replySteps) ? skill.replySteps.map((step) => ({
      type: step.type === "image" ? "image" : "text",
      content: String(step.content || ""),
      url: String(step.url || ""),
      label: String(step.label || "")
    })).filter((step) => step.content || step.url) : [],
    fallback: String(skill.fallback || ""),
    contactUrl: String(skill.contactUrl || "")
  };

  if (skill.platformKey) normalized.platformKey = String(skill.platformKey);
  if (Array.isArray(skill.platformKeys)) normalized.platformKeys = skill.platformKeys.map(String).filter(Boolean).slice(0, 6);
  if (skill.intentKey) normalized.intentKey = String(skill.intentKey);
  if (Array.isArray(skill.intentKeys)) normalized.intentKeys = skill.intentKeys.map(String).filter(Boolean).slice(0, 8);
  if (Array.isArray(skill.manualOverrides)) normalized.manualOverrides = skill.manualOverrides.slice(0, 12);
  if (Number.isFinite(Number(skill.revisionCount))) normalized.revisionCount = Number(skill.revisionCount);
  if (skill.lastManualOverrideAt) normalized.lastManualOverrideAt = String(skill.lastManualOverrideAt);
  if (skill.lastAutoRevisedAt) normalized.lastAutoRevisedAt = String(skill.lastAutoRevisedAt);
  if (skill.lastOptimizedAt) normalized.lastOptimizedAt = String(skill.lastOptimizedAt);
  return normalized;
}

async function handleReplySkills(req, res) {
  if (req.method === "GET") {
    sendJson(res, 200, readReplySkills());
    return;
  }

  if (req.method === "POST") {
    try {
      const body = await readBody(req);
      const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
      sendJson(res, 200, writeReplySkills(payload));
    } catch (error) {
      sendJson(res, 400, { success: false, message: "Invalid reply skills payload", error: error.message });
    }
    return;
  }

  sendJson(res, 405, { success: false, message: "Method not allowed" });
}

async function handleReplySkillLearn(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }

  try {
    const body = await readBody(req);
    const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
    const data = readReplySkills();
    const skill = normalizeLearnedSkill(payload.skill || payload);
    const existingIndex = data.skills.findIndex((item) => String(item.id) === String(skill.id));
    if (existingIndex >= 0) {
      data.skills[existingIndex] = { ...data.skills[existingIndex], ...skill };
    } else {
      data.skills.unshift(skill);
    }
    sendJson(res, 200, writeReplySkills(data));
  } catch (error) {
    sendJson(res, 400, { success: false, message: "Invalid learned skill payload", error: error.message });
  }
}

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function getPayloadData(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.result !== undefined) return payload.result;
  if (payload.response !== undefined) return payload.response;
  return payload;
}

function extractUploadEndpoint(config) {
  const host = firstNonEmpty(
    config.qnRegionUrl,
    config.qiniuUploadUrl,
    config.qnUploadUrl,
    config.uploadUrl,
    config.action,
    config.host,
    config.endpoint,
    config.ossHost,
    config.domain
  );
  if (!host) return "";
  const text = String(host);
  if (/^https?:\/\//i.test(text)) return text;
  return `https://${text.replace(/^\/+/, "")}`;
}

function buildOssObjectKey(config, fileName) {
  const explicitKey = firstNonEmpty(
    config.key,
    config.objectKey,
    config.fileKey,
    config.path,
    config.filePath,
    config.fullPath
  );
  if (explicitKey) return normalizeOssObjectKey(explicitKey, fileName);
  return joinOssKey(firstNonEmpty(config.dir, config.prefix), fileName || createOssUploadFileName(fileName));
}

function normalizeOssObjectKey(value, fileName) {
  let key = String(value || "")
    .replace(/\$\{fileName\}|\$\{filename\}|\{fileName\}|\{filename\}|%fileName%|%filename%/g, fileName)
    .replace(/^https?:\/\/[^/]+\//i, "")
    .replace(/^\/+/, "");
  if (!key || /\/$/.test(key)) key = joinOssKey(key, fileName);
  return key || fileName;
}

function joinOssKey(prefix, fileName) {
  const cleanFileName = String(fileName || createOssUploadFileName()).replace(/^\/+/, "");
  const cleanPrefix = String(prefix || "").replace(/^\/+|\/+$/g, "");
  return cleanPrefix ? `${cleanPrefix}/${cleanFileName}` : cleanFileName;
}

function createOssUploadFileName(fileName = "", contentType = "") {
  return `${crypto.randomBytes(16).toString("hex")}${getSafeImageExtension(fileName, contentType)}`;
}

function getSafeImageExtension(fileName = "", contentType = "") {
  const match = String(fileName).toLowerCase().match(/\.([a-z0-9]{2,8})$/);
  const ext = match ? `.${match[1]}` : "";
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"].includes(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  const type = String(contentType || "").toLowerCase();
  if (type.includes("gif")) return ".gif";
  if (type.includes("webp")) return ".webp";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (type.includes("bmp")) return ".bmp";
  return ".png";
}

function buildOssFormData(config, objectKey, fileName, contentType, buffer) {
  const form = new FormData();
  const qiniuToken = firstNonEmpty(config.qnToken, config.qiniuToken, config.uploadToken);
  const fieldMap = qiniuToken
    ? {
        key: objectKey,
        token: qiniuToken
      }
    : {
        key: objectKey,
        policy: firstNonEmpty(config.policy, config.Policy),
        signature: firstNonEmpty(config.signature, config.Signature),
        OSSAccessKeyId: firstNonEmpty(config.OSSAccessKeyId, config.accessid, config.accessId, config.AccessKeyId, config.accessKeyId),
        success_action_status: firstNonEmpty(config.success_action_status, config.successActionStatus, "200"),
        callback: config.callback,
        "x-oss-security-token": firstNonEmpty(config.securityToken, config.SecurityToken, config.token, config.stsToken)
      };

  Object.entries(fieldMap).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  });

  const extraFields = config.formData || config.form || config.fields;
  if (extraFields && typeof extraFields === "object") {
    Object.entries(extraFields).forEach(([key, value]) => {
      if (!form.has(key) && value !== undefined && value !== null) form.append(key, value);
    });
  }

  form.append("file", new Blob([buffer], { type: contentType || "application/octet-stream" }), fileName);
  return form;
}

function joinUrl(base, value) {
  const baseText = String(base || "").replace(/\/+$/, "");
  const pathText = String(value || "").replace(/^\/+/, "");
  return pathText ? `${baseText}/${pathText}` : baseText;
}

function extractUploadedUrl(payload, fallbackHost, objectKey) {
  const data = getPayloadData(payload) || payload || {};
  if (typeof data === "string" && (/^https?:\/\//i.test(data) || data.startsWith("//"))) {
    return data.startsWith("//") ? `https:${data}` : data;
  }
  const url = firstNonEmpty(
    data.fileUrl,
    data.url,
    data.imageUrl,
    data.imgUrl,
    data.path,
    data.fullPath,
    data.objectUrl,
    data.Location,
    data.location
  );
  if (url && (/^https?:\/\//i.test(String(url)) || String(url).startsWith("//"))) {
    return String(url).startsWith("//") ? `https:${url}` : String(url);
  }
  const publicHost = firstNonEmpty(data.qnDomain, data.qiniuDomain, data.publicDomain, data.cdnDomain);
  return (publicHost || fallbackHost) && objectKey ? joinUrl(publicHost || fallbackHost, objectKey) : "";
}

async function handleOssUpload(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }

  try {
    const body = await readBody(req);
    const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
    const config = payload.config && typeof payload.config === "object" ? payload.config : {};
    const fileName = String(payload.fileName || `upload-${Date.now()}`);
    const contentType = String(payload.contentType || "application/octet-stream");
    const base64 = String(payload.base64 || "").replace(/^data:[^;]+;base64,/, "");
    if (!base64) {
      sendJson(res, 400, { success: false, message: "File payload is empty" });
      return;
    }

    const buffer = Buffer.from(base64, "base64");
    const endpoint = extractUploadEndpoint(config);
    if (!endpoint) {
      sendJson(res, 400, { success: false, message: "OSS upload endpoint is missing", config: summarizeUploadConfig(config) });
      return;
    }

    const objectKey = payload.objectKey || buildOssObjectKey(config, fileName || createOssUploadFileName(fileName, contentType));
    const form = buildOssFormData(config, objectKey, fileName, contentType, buffer);
    const upstream = await fetchWithTimeout(endpoint, { method: "POST", body: form }, OSS_UPLOAD_TIMEOUT_MS, "OSS upload");
    const text = await upstream.text();
    const parsed = parseMaybeJson(text);
    const url = extractUploadedUrl(parsed, firstNonEmpty(config.qnDomain, config.qiniuDomain, endpoint), objectKey);

    captureApi({
      at: new Date().toISOString(),
      method: req.method,
      url: req.url,
      target: endpoint,
      status: upstream.status,
      requestBody: JSON.stringify({
        fileName,
        contentType,
        bytes: buffer.length,
        objectKey,
        config: summarizeUploadConfig(config)
      }),
      responseContentType: upstream.headers.get("content-type") || "",
      responseBody: trimCaptureText(text, 1200)
    });

    sendJson(res, upstream.ok ? 200 : 502, {
      success: upstream.ok,
      status: upstream.status,
      url,
      objectKey,
      response: trimCaptureText(text, 1200)
    });
  } catch (error) {
    captureApi({
      at: new Date().toISOString(),
      method: req.method,
      url: req.url,
      target: "/local/oss-upload",
      status: 500,
      error: error.message
    });
    sendJson(res, 500, { success: false, message: "OSS upload proxy failed", error: error.message });
  }
}

function parseMaybeJson(text) {
  if (!text) return "";
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function parseRequestPayload(buffer, req) {
  const text = Buffer.isBuffer(buffer) ? buffer.toString("utf8") : String(buffer || "");
  const contentType = String(req.headers["content-type"] || "");
  if (!text) return {};
  if (contentType.includes("application/json")) {
    const parsed = parseMaybeJson(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  }
  const params = new URLSearchParams(text);
  return Object.fromEntries(params.entries());
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function decodeHtmlEntities(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function extractMetaContent(html, ...names) {
  for (const name of names) {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const propertyRegex = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i");
    const reverseRegex = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i");
    const match = html.match(propertyRegex) || html.match(reverseRegex);
    if (match?.[1]) return decodeHtmlEntities(match[1].trim());
  }
  return "";
}

function extractTitle(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  return decodeHtmlEntities(title.replace(/\s+/g, " ").trim());
}

function absolutizeUrl(baseUrl, value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    return new URL(text, baseUrl).toString();
  } catch {
    return "";
  }
}

function normalizePreviewUrl(value) {
  const text = String(value || "").trim();
  if (!/^https?:\/\//i.test(text)) return "";
  try {
    const parsed = new URL(text);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function isVideoContentType(value) {
  return /^video\//i.test(String(value || ""));
}

function isVideoFileUrl(value) {
  try {
    return DIRECT_VIDEO_EXTENSIONS.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

async function readLimitedResponse(response, limit = MAX_LINK_PREVIEW_BYTES) {
  const reader = response.body?.getReader?.();
  if (!reader) return await response.text();
  const chunks = [];
  let total = 0;
  while (total < limit) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    const slice = value.slice(0, Math.max(0, limit - total));
    chunks.push(Buffer.from(slice));
    total += slice.length;
    if (slice.length < value.length) break;
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function handleLinkPreview(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }

  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const url = normalizePreviewUrl(parsed.searchParams.get("url"));
  if (!url) {
    sendJson(res, 400, { success: false, message: "Invalid preview URL" });
    return;
  }

  try {
    const upstream = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 YouChat-Web-LinkPreview/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(8000)
    });
    const contentType = upstream.headers.get("content-type") || "";
    if (isVideoContentType(contentType) || isVideoFileUrl(upstream.url || url)) {
      const finalUrl = upstream.url || url;
      sendJson(res, 200, {
        success: true,
        data: {
          url,
          finalUrl,
          title: path.basename(new URL(finalUrl).pathname) || new URL(finalUrl).hostname,
          description: contentType || "video",
          siteName: new URL(finalUrl).hostname,
          video: finalUrl,
          videoType: contentType || "video",
          contentType,
          loaded: true
        }
      });
      return;
    }

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      const finalUrl = upstream.url || url;
      sendJson(res, 200, {
        success: true,
        data: {
          url,
          finalUrl,
          title: path.basename(new URL(finalUrl).pathname) || new URL(finalUrl).hostname,
          description: contentType || "",
          siteName: new URL(finalUrl).hostname,
          contentType,
          loaded: true
        }
      });
      return;
    }

    const html = await readLimitedResponse(upstream);
    const finalUrl = upstream.url || url;
    const image = extractMetaContent(html, "og:image", "twitter:image", "image");
    const video = extractMetaContent(html, "og:video:secure_url", "og:video:url", "og:video", "twitter:player:stream");
    const player = extractMetaContent(html, "twitter:player", "og:video:iframe");
    const videoType = extractMetaContent(html, "og:video:type", "twitter:player:stream:content_type");
    sendJson(res, 200, {
      success: true,
      data: {
        url,
        finalUrl,
        title: extractMetaContent(html, "og:title", "twitter:title") || extractTitle(html) || new URL(finalUrl).hostname,
        description: extractMetaContent(html, "og:description", "twitter:description", "description"),
        siteName: extractMetaContent(html, "og:site_name", "application-name") || new URL(finalUrl).hostname,
        image: absolutizeUrl(finalUrl, image),
        video: absolutizeUrl(finalUrl, video),
        player: absolutizeUrl(finalUrl, player),
        videoType,
        status: upstream.status,
        contentType,
        loaded: true
      }
    });
  } catch (error) {
    sendJson(res, 502, {
      success: false,
      message: "Link preview request failed",
      url,
      error: error.message
    });
  }
}

function normalizeApiBase(value) {
  const raw = String(value || DEFAULT_API_BASE).trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_API_BASE;
  return (/^https?:\/\//i.test(raw) ? raw : `http://${raw}`).replace(/\/+$/, "");
}

function getSignalRBaseUrl(apiBase) {
  try {
    const url = new URL(normalizeApiBase(apiBase));
    const apiPath = url.pathname.replace(/\/+$/, "");
    if (apiPath.toLowerCase().endsWith("/api")) {
      url.pathname = apiPath.slice(0, -4) || "/";
    }
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return normalizeApiBase(apiBase).replace(/\/api\/?$/i, "").replace(/\/+$/, "");
  }
}

function buildSignalRHubUrl(apiBase, accountId) {
  const userName = encodeURIComponent(String(accountId || "").trim());
  return `${getSignalRBaseUrl(apiBase)}/chathub?mode=client&userName=${userName}`;
}

function withTimeout(promise, timeoutMs, label) {
  let timer = null;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`)), timeoutMs);
    })
  ]).finally(() => clearTimeout(timer));
}

function getSignalRConnectionKey(apiBase, accountId) {
  return `${getSignalRBaseUrl(apiBase)}::${String(accountId || "").trim()}`;
}

async function ensureServerSignalRConnection(apiBase, accountId) {
  const normalizedAccountId = String(accountId || "").trim();
  if (!normalizedAccountId) throw new Error("SignalR accountId is required");

  const key = getSignalRConnectionKey(apiBase, normalizedAccountId);
  const cached = signalRHubConnections.get(key);
  if (cached?.connection?.state === signalR.HubConnectionState.Connected) {
    cached.lastUsedAt = Date.now();
    return cached.connection;
  }
  if (cached?.connecting) return cached.connecting;

  const hubUrl = buildSignalRHubUrl(apiBase, normalizedAccountId);
  const connecting = (async () => {
    if (cached?.connection && cached.connection.state !== signalR.HubConnectionState.Disconnected) {
      try {
        await cached.connection.stop();
      } catch (error) {
        console.warn(`SignalR bridge stop before reconnect failed: ${error.message}`);
      }
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withKeepAliveInterval(SIGNALR_KEEP_ALIVE_MS)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.onclose((error) => {
      const current = signalRHubConnections.get(key);
      if (current?.connection === connection) {
        signalRHubConnections.delete(key);
      }
      if (error) console.warn(`SignalR bridge closed: ${error.message}`);
    });

    await withTimeout(connection.start(), SIGNALR_START_TIMEOUT_MS, "SignalR bridge start");
    await connection.invoke("RegisterUser", normalizedAccountId, false, false, 0);
    signalRHubConnections.set(key, {
      connection,
      connecting: null,
      hubUrl,
      accountId: normalizedAccountId,
      lastUsedAt: Date.now()
    });
    return connection;
  })();

  signalRHubConnections.set(key, {
    connection: cached?.connection || null,
    connecting,
    hubUrl,
    accountId: normalizedAccountId,
    lastUsedAt: Date.now()
  });

  try {
    return await connecting;
  } catch (error) {
    signalRHubConnections.delete(key);
    throw error;
  }
}

async function handleSignalRConsume(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }

  const body = await readBody(req);
  const payload = parseRequestPayload(body, req);
  const apiBase = normalizeApiBase(payload.apiBase || DEFAULT_API_BASE);
  const accountId = String(payload.accountId || "").trim();
  const contactId = Number(payload.contactId || 0);
  const msgId = Number(payload.msgId || 0);

  if (!accountId) {
    sendJson(res, 400, { success: false, message: "SignalR accountId is required" });
    return;
  }
  if (!Number.isFinite(contactId)) {
    sendJson(res, 400, { success: false, message: "SignalR contactId is invalid" });
    return;
  }

  try {
    const connection = await ensureServerSignalRConnection(apiBase, accountId);
    await withTimeout(
      connection.invoke("ConsumeMessage", contactId, Number.isFinite(msgId) ? msgId : 0),
      SIGNALR_START_TIMEOUT_MS,
      "SignalR ConsumeMessage"
    );
    const key = getSignalRConnectionKey(apiBase, accountId);
    const cached = signalRHubConnections.get(key);
    if (cached) cached.lastUsedAt = Date.now();
    sendJson(res, 200, {
      success: true,
      source: "node-signalr",
      apiBase,
      hubUrl: buildSignalRHubUrl(apiBase, accountId),
      accountId,
      contactId,
      msgId: Number.isFinite(msgId) ? msgId : 0
    });
  } catch (error) {
    sendJson(res, 502, {
      success: false,
      message: "SignalR ConsumeMessage failed",
      error: error.message,
      apiBase,
      hubUrl: buildSignalRHubUrl(apiBase, accountId),
      accountId,
      contactId,
      msgId: Number.isFinite(msgId) ? msgId : 0
    });
  }
}

function getTargetBase(reqUrl) {
  const parsed = new URL(reqUrl, `http://localhost:${PORT}`);
  const base = parsed.searchParams.get("__target") || DEFAULT_API_BASE;
  parsed.searchParams.delete("__target");
  return { base: base.replace(/\/+$/, ""), search: parsed.search };
}

function getAiChatCompletionsUrl(baseUrl) {
  const rawBase = String(baseUrl || DEFAULT_AI_BASE).trim().replace(/\/+$/, "");
  if (!rawBase) {
    throw new Error("AI base URL is empty");
  }
  const parsedBase = new URL(rawBase);
  if (/api\.deepseek\.com$/i.test(parsedBase.hostname)) {
    if (/\/v1\/chat\/completions$/i.test(parsedBase.pathname)) return new URL(`${parsedBase.origin}/chat/completions`);
    if (/\/chat\/completions$/i.test(parsedBase.pathname)) return new URL(rawBase);
    if (/\/v1$/i.test(parsedBase.pathname)) return new URL(`${parsedBase.origin}/chat/completions`);
    return new URL(`${rawBase}/chat/completions`);
  }
  if (/\/chat\/completions$/i.test(rawBase)) return new URL(rawBase);
  if (/\/v1$/i.test(rawBase)) return new URL(`${rawBase}/chat/completions`);
  return new URL(`${rawBase}/v1/chat/completions`);
}

function normalizeAiAuthType(value, targetUrl = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (["x-api-key", "x_api_key", "api-key", "apikey"].includes(normalized)) return "x-api-key";
  if (["bearer", "authorization", "authorization-bearer"].includes(normalized)) return "bearer";
  try {
    const hostname = new URL(String(targetUrl || DEFAULT_AI_BASE)).hostname;
    if (/codebuddy/i.test(hostname) || /copilot\.tencent\.com$/i.test(hostname)) return "x-api-key";
  } catch {
    // Ignore invalid target here. URL validation happens before proxying.
  }
  return "bearer";
}

function getAiAuthHeaders(apiKey, authType, targetUrl) {
  if (normalizeAiAuthType(authType, targetUrl) === "x-api-key") {
    return { "X-Api-Key": apiKey };
  }
  return { Authorization: `Bearer ${apiKey}` };
}

async function proxyApi(req, res) {
  const apiPath = req.url.replace(/^\/api/, "");
  const { base, search } = getTargetBase(req.url);
  const cleanedPath = apiPath.split("?")[0] || "/";
  const targetUrl = new URL(`${base}${cleanedPath}${search}`);
  const body = await readBody(req);
  const started = Date.now();

  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;
  delete headers["content-length"];

  const options = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : body
  };

  try {
    const upstream = await fetchWithTimeout(targetUrl, options, API_PROXY_TIMEOUT_MS, "YouChat API proxy");
    const buffer = Buffer.from(await upstream.arrayBuffer());
    const responseHeaders = {};

    upstream.headers.forEach((value, key) => {
      if (!["set-cookie", "content-encoding"].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    responseHeaders["Access-Control-Allow-Origin"] = "*";
    responseHeaders["Access-Control-Allow-Headers"] = "*";
    responseHeaders["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

    res.writeHead(upstream.status, responseHeaders);
    res.end(buffer);

    captureApi({
      at: new Date().toISOString(),
      method: req.method,
      url: req.url,
      target: targetUrl.toString(),
      status: upstream.status,
      ms: Date.now() - started,
      requestHeaders: {
        authorization: headers.authorization ? "<present>" : "",
        contentType: headers["content-type"] || headers["Content-Type"] || ""
      },
      requestBody: decodeCaptureBody(body, headers["content-type"] || headers["Content-Type"] || ""),
      responseContentType: upstream.headers.get("content-type") || "",
      responseBody: decodeCaptureBody(buffer, upstream.headers.get("content-type") || "")
    });
  } catch (error) {
    captureApi({
      at: new Date().toISOString(),
      method: req.method,
      url: req.url,
      target: targetUrl.toString(),
      status: 502,
      ms: Date.now() - started,
      requestBody: decodeCaptureBody(body, headers["content-type"] || headers["Content-Type"] || ""),
      error: error.message
    });
    sendJson(res, 502, {
      success: false,
      message: "Proxy request failed",
      target: targetUrl.toString(),
      error: error.message
    });
  }
}

async function proxyAi(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, {
      success: false,
      message: "AI proxy only supports POST"
    });
    return;
  }

  let incoming;
  try {
    const body = await readBody(req);
    incoming = body.length ? JSON.parse(body.toString("utf8")) : {};
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      message: "Invalid JSON body",
      error: error.message
    });
    return;
  }

  const apiKey = String(incoming.apiKey || "").trim();
  const messages = Array.isArray(incoming.messages) ? incoming.messages : [];
  if (!apiKey) {
    sendJson(res, 400, {
      success: false,
      message: "AI API key is empty"
    });
    return;
  }
  if (!messages.length) {
    sendJson(res, 400, {
      success: false,
      message: "AI messages are empty"
    });
    return;
  }

  let targetUrl;
  try {
    targetUrl = getAiChatCompletionsUrl(incoming.baseUrl);
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      message: "Invalid AI base URL",
      error: error.message
    });
    return;
  }

  const payload = {
    model: String(incoming.model || DEFAULT_AI_MODEL).trim() || DEFAULT_AI_MODEL,
    messages,
    temperature: Number.isFinite(Number(incoming.temperature)) ? Number(incoming.temperature) : 0.35
  };

  if (incoming.max_tokens !== undefined) payload.max_tokens = Number(incoming.max_tokens);
  if (incoming.stream !== undefined) payload.stream = Boolean(incoming.stream);
  if (incoming.reasoning_effort !== undefined) payload.reasoning_effort = incoming.reasoning_effort;
  if (incoming.thinking !== undefined) payload.thinking = incoming.thinking;

  try {
    const authHeaders = getAiAuthHeaders(apiKey, incoming.authType, targetUrl.toString());
    const upstream = await fetchWithTimeout(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders
      },
      body: JSON.stringify(payload)
    }, AI_PROXY_TIMEOUT_MS, "AI proxy");
    const text = await upstream.text();
    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    });
    res.end(text);
  } catch (error) {
    sendJson(res, 502, {
      success: false,
      message: "AI proxy request failed",
      target: targetUrl.toString(),
      error: error.message
    });
  }
}

function serveStatic(req, res) {
  const requestPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(content);
  });
}

async function stopSignalRHubConnections() {
  const connections = [...signalRHubConnections.values()].map((entry) => entry.connection).filter(Boolean);
  signalRHubConnections.clear();
  await Promise.allSettled(connections.map((connection) => connection.stop()));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    });
    res.end();
    return;
  }

  if (req.url.startsWith("/api/")) {
    await proxyApi(req, res);
    return;
  }

  if (req.url.startsWith("/ai/chat/completions")) {
    await proxyAi(req, res);
    return;
  }

  if (req.url.startsWith("/local/reply-skills/learn")) {
    await handleReplySkillLearn(req, res);
    return;
  }

  if (req.url.startsWith("/local/reply-skills")) {
    await handleReplySkills(req, res);
    return;
  }

  if (req.url.startsWith("/local/oss-upload")) {
    await handleOssUpload(req, res);
    return;
  }

  if (req.url.startsWith("/local/link-preview")) {
    await handleLinkPreview(req, res);
    return;
  }

  if (req.url.startsWith("/local/signalr/consume")) {
    await handleSignalRConsume(req, res);
    return;
  }

  if (req.url.startsWith("/health")) {
    sendJson(res, 200, {
      ok: true,
      apiBase: DEFAULT_API_BASE,
      aiBase: DEFAULT_AI_BASE,
      aiModel: DEFAULT_AI_MODEL,
      port: PORT
    });
    return;
  }

  if (req.url.startsWith("/native-icons/braft-icons.woff")) {
    sendClientBraftIcons(res);
    return;
  }

  if (req.url.startsWith("/vendor/signalr.min.js")) {
    sendSignalRBrowserClient(res);
    return;
  }

  if (req.url.startsWith("/static/emojiSource.cdbf96da.png")) {
    sendClientStaticAsset(res, "static\\emojiSource.cdbf96da.png", "image/png");
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`YouChat dev web: http://localhost:${PORT}`);
  console.log(`Proxy target: ${DEFAULT_API_BASE}`);
});

process.on("SIGINT", () => {
  stopSignalRHubConnections().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  stopSignalRHubConnections().finally(() => process.exit(0));
});

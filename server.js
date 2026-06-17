const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const signalR = require("@microsoft/signalr");

const PORT = Number(process.env.PORT || 5177);
const DEFAULT_API_BASE = process.env.YOUCHAT_API_BASE || "http://192.168.9.83:18080/api";
const FNOS_MYSQL_CONNECTION_STRING = process.env.YOUCHAT_MYSQL_CONNECTION_STRING || "Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=w5B22RLPpprsrxdt;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;";
const PUBLIC_DIR = path.join(__dirname, "public");
const CLIENT_WWWROOT = process.env.YOUCHAT_DESKTOP_WWWROOT || "C:\\Program Files\\youchat-desktop\\wwwroot";
const BUNDLED_BRAFT_ICONS_FILE = path.join(PUBLIC_DIR, "native-icons", "braft-icons.woff");
const BUNDLED_EMOJI_SOURCE_FILE = path.join(PUBLIC_DIR, "static", "emojiSource.cdbf96da.png");
const SIGNALR_BROWSER_FILE = path.join(__dirname, "node_modules", "@microsoft", "signalr", "dist", "browser", "signalr.min.js");
const LOG_DIR = path.join(__dirname, "logs");
const DATA_DIR = path.join(__dirname, "data");
const CONFIG_DIR = path.join(__dirname, "config");
const AI_PROVIDERS_FILE = path.join(CONFIG_DIR, "ai-providers.json");
const REPLY_SKILLS_FILE = path.join(DATA_DIR, "reply-skills.json");
const API_CAPTURE_FILE = path.join(LOG_DIR, "api-capture.ndjson");
const MAX_CAPTURE_TEXT = 8000;
const MAX_LINK_PREVIEW_BYTES = 900000;
const API_PROXY_TIMEOUT_MS = 60000;
const OSS_UPLOAD_TIMEOUT_MS = 20000;
const AI_PROXY_TIMEOUT_MS = 90000;
const PROMPTWORKS_TIMEOUT_MS = Math.max(10000, Number(process.env.PROMPTWORKS_TIMEOUT_MS || 60000));
const SIGNALR_START_TIMEOUT_MS = 12000;
const SIGNALR_KEEP_ALIVE_MS = 120000;
const DATABASE_GUARD_ENABLED = process.env.YOUCHAT_DATABASE_GUARD_ENABLED !== "0";
const DATABASE_GUARD_INTERVAL_MS = Math.max(60000, Number(process.env.YOUCHAT_DATABASE_GUARD_INTERVAL_MS || 5 * 60 * 1000));
const DATABASE_GUARD_MIN_HISTORY_COUNT = Number(process.env.YOUCHAT_DATABASE_GUARD_MIN_HISTORY_COUNT || 1000);
const CONTAINER_API_BASE = String(process.env.YOUCHAT_CONTAINER_API_BASE || "").trim();
const CONTAINER_HOST_GATEWAY = String(process.env.YOUCHAT_CONTAINER_HOST_GATEWAY || "host.docker.internal").trim();
const IS_CONTAINER_RUNTIME = fs.existsSync("/.dockerenv") || process.env.YOUCHAT_CONTAINER_NETWORK === "1";
const PROMPTWORKS_API_BASE = process.env.PROMPTWORKS_API_BASE || (IS_CONTAINER_RUNTIME ? "http://host.docker.internal:5188/api/v1" : "http://192.168.9.83:5188/api/v1");
const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|ogv|mov|m4v|m3u8)(?:$|\?)/i;
const signalRHubConnections = new Map();
const databaseGuardState = {
  enabled: DATABASE_GUARD_ENABLED,
  intervalMs: DATABASE_GUARD_INTERVAL_MS,
  intervalMinutes: Math.round(DATABASE_GUARD_INTERVAL_MS / 60000),
  running: false,
  lastReason: "",
  lastCheckedAt: "",
  lastRepairAt: "",
  lastError: "",
  lastHealth: null,
  lastResult: null,
  repairCount: 0
};

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

function readAiProvidersConfig() {
  try {
    const raw = fs.readFileSync(AI_PROVIDERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const AI_PROVIDER_CONFIG = readAiProvidersConfig();
const DEFAULT_AI_PROVIDER = String(AI_PROVIDER_CONFIG.defaultProvider || "sub2").trim() || "sub2";
const AI_PROVIDER_PRESETS = AI_PROVIDER_CONFIG.providers && typeof AI_PROVIDER_CONFIG.providers === "object"
  ? AI_PROVIDER_CONFIG.providers
  : {};
const DEFAULT_AI_PROVIDER_CONFIG = AI_PROVIDER_PRESETS[DEFAULT_AI_PROVIDER] || {};
const DEFAULT_AI_BASE = process.env.YOUCHAT_AI_BASE || DEFAULT_AI_PROVIDER_CONFIG.baseUrl || "https://sub2.sn55.cn/";
const DEFAULT_AI_MODEL = process.env.YOUCHAT_AI_MODEL || DEFAULT_AI_PROVIDER_CONFIG.model || "gpt-5.4-mini";

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
    if (fs.existsSync(BUNDLED_BRAFT_ICONS_FILE)) {
      const buffer = fs.readFileSync(BUNDLED_BRAFT_ICONS_FILE);
      res.writeHead(200, {
        "Content-Type": "font/woff",
        "Cache-Control": "public, max-age=86400"
      });
      res.end(buffer);
      return;
    }

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
  const normalizedRelativePath = String(relativePath || "").replace(/\\/g, "/");
  if (normalizedRelativePath === "static/emojiSource.cdbf96da.png" && fs.existsSync(BUNDLED_EMOJI_SOURCE_FILE)) {
    fs.readFile(BUNDLED_EMOJI_SOURCE_FILE, (error, content) => {
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
    return;
  }

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
  if (Array.isArray(skill.manualOverrides)) normalized.manualOverrides = skill.manualOverrides.slice(0, 24);
  if (skill.learningMode) normalized.learningMode = String(skill.learningMode);
  if (skill.learningBucketKey) normalized.learningBucketKey = String(skill.learningBucketKey);
  if (skill.learningStage) normalized.learningStage = String(skill.learningStage);
  if (skill.trainingStatus) normalized.trainingStatus = String(skill.trainingStatus);
  if (skill.trainingNote) normalized.trainingNote = String(skill.trainingNote);
  if (skill.reviewedAt) normalized.reviewedAt = String(skill.reviewedAt);
  if (skill.updatedAt) normalized.updatedAt = String(skill.updatedAt);
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

function getShanghaiDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

function parseSkillTimestamp(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getSkillCreatedAt(skill) {
  const explicit = parseSkillTimestamp(skill.createdAt || skill.updatedAt || skill.lastManualOverrideAt || skill.lastAutoRevisedAt || skill.lastOptimizedAt);
  if (explicit) return explicit;
  const idMatch = String(skill.id || "").match(/learned-(\d{10,})/);
  if (!idMatch) return null;
  const timestamp = Number(idMatch[1]);
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp);
}

function getSkillActivityDates(skill) {
  const dates = [
    getSkillCreatedAt(skill),
    parseSkillTimestamp(skill.updatedAt),
    parseSkillTimestamp(skill.lastManualOverrideAt),
    parseSkillTimestamp(skill.lastAutoRevisedAt),
    parseSkillTimestamp(skill.lastOptimizedAt),
    ...(Array.isArray(skill.manualOverrides) ? skill.manualOverrides.map((item) => parseSkillTimestamp(item.at)) : [])
  ].filter(Boolean);
  return dates.sort((a, b) => b.getTime() - a.getTime());
}

function getSkillServerText(skill) {
  const steps = Array.isArray(skill.replySteps) ? skill.replySteps : [];
  const text = steps
    .filter((step) => step && step.type !== "image")
    .map((step) => String(step.content || "").trim())
    .filter(Boolean)
    .join("\n\n");
  return text || String(skill.fallback || "").trim();
}

function getSkillServerImageUrls(skill) {
  const steps = Array.isArray(skill.replySteps) ? skill.replySteps : [];
  return steps
    .filter((step) => step && step.type === "image")
    .map((step) => String(step.url || step.content || "").trim())
    .filter(Boolean);
}

function splitSkillListField(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value || "")
    .split(/[\n,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTrainingComparableText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?;；:："'“”‘’（）()【】[\]{}]/g, "")
    .trim();
}

function uniqueTrainingList(values, limit = 12) {
  const seen = new Set();
  const result = [];
  (Array.isArray(values) ? values : []).forEach((value) => {
    const text = String(value || "").trim();
    if (!text) return;
    const key = normalizeTrainingComparableText(text);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });
  return result.slice(0, limit);
}

function getTrainingStageLabel(stage) {
  const map = {
    first_answer: "首次答复",
    customer_followup: "客户追问",
    after_service_reply: "客服补充",
    no_reply_guidance: "未回复引导"
  };
  return map[String(stage || "")] || "";
}

function getSkillOverrideImages(override) {
  return Array.isArray(override?.imageUrls)
    ? override.imageUrls.map((url) => String(url || "").trim()).filter(Boolean)
    : [];
}

function buildSkillManualTrainingSummary(skill) {
  const overrides = Array.isArray(skill.manualOverrides) ? skill.manualOverrides : [];
  const replyMap = new Map();
  const promptValues = [];
  const imageValues = [];
  const stageValues = [];

  overrides.forEach((override) => {
    const count = Math.max(1, Number(override?.count || 1));
    const prompt = String(override?.prompt || "").trim();
    const reply = String(override?.reply || "").trim();
    const images = getSkillOverrideImages(override);
    if (prompt) promptValues.push(prompt);
    images.forEach((url) => imageValues.push(url));
    if (override?.learningStage) stageValues.push(override.learningStage);

    const key = [
      normalizeTrainingComparableText(reply) || "[图片回复]",
      images.map(normalizeTrainingComparableText).join("|"),
      String(override?.platformKey || ""),
      String(override?.intentKey || ""),
      String(override?.learningStage || "")
    ].join("::");
    const existing = replyMap.get(key) || {
      reply,
      imageUrls: [],
      prompts: [],
      count: 0,
      latestAt: "",
      platformKey: String(override?.platformKey || ""),
      intentKey: String(override?.intentKey || ""),
      learningStage: String(override?.learningStage || "")
    };
    existing.count += count;
    existing.imageUrls = uniqueTrainingList([...existing.imageUrls, ...images], 8);
    existing.prompts = uniqueTrainingList([...existing.prompts, prompt], 6);
    if (!existing.reply && reply) existing.reply = reply;
    if (!existing.latestAt || new Date(override?.at || 0) > new Date(existing.latestAt || 0)) {
      existing.latestAt = String(override?.at || "");
    }
    replyMap.set(key, existing);
  });

  const replyVariants = [...replyMap.values()]
    .sort((a, b) => (
      Number(b.count || 0) - Number(a.count || 0) ||
      new Date(b.latestAt || 0).getTime() - new Date(a.latestAt || 0).getTime()
    ))
    .slice(0, 6);
  const totalCount = overrides.reduce((sum, item) => sum + Math.max(1, Number(item?.count || 1)), 0);

  return {
    totalCount,
    rawCount: overrides.length,
    promptVariants: uniqueTrainingList(promptValues, 8),
    replyVariants,
    imageUrls: uniqueTrainingList(imageValues, 12),
    stageLabels: uniqueTrainingList(stageValues.map(getTrainingStageLabel).filter(Boolean), 4)
  };
}

function chooseSkillTrainingProposalText(skill, currentText, manualSummary) {
  const bestVariant = manualSummary?.replyVariants?.find((item) => String(item.reply || "").trim());
  if (bestVariant?.reply && (isTrainingDirtyText(currentText) || String(skill.trainingStatus || "") === "needs_optimization" || skill.enabled === false)) {
    return bestVariant.reply;
  }
  return isTrainingDirtyText(currentText) ? "" : currentText;
}

function chooseSkillTrainingImages(skill, manualSummary) {
  const current = getSkillServerImageUrls(skill);
  if (current.length) return current;
  const variantImages = manualSummary?.replyVariants?.flatMap((item) => item.imageUrls || []) || [];
  return uniqueTrainingList([...(manualSummary?.imageUrls || []), ...variantImages], 12);
}

function detectTrainingPlatformKey(text) {
  const value = String(text || "").toLowerCase();
  if (/\d{8}-\d{4,}/.test(value) || /(拼多多|pdd|pinduoduo|yangkeduo|多多)/i.test(value)) return "pdd";
  if (/(京东|jd|jdmobile)/i.test(value)) return "jd";
  if (/(淘宝|天猫|taobao|tmall|tbopen)/i.test(value)) return "taobao";
  if (/(唯品会|vipshop)/i.test(value)) return "vip";
  if (/(美团|meituan|大众点评)/i.test(value)) return "meituan";
  if (/(饿了么|eleme)/i.test(value)) return "eleme";
  if (/(抖音|douyin|aweme)/i.test(value)) return "douyin";
  if (/(快手|kuaishou|kwai|gifshow)/i.test(value)) return "kuaishou";
  return "";
}

function detectTrainingIntentKey(text) {
  const value = normalizeTrainingComparableText(text);
  if (/(查不到|查不出|没返利|无返利|没成功|订单没有|不提示|没绑定|怎么没绑定)/.test(value)) return "order_missing";
  if (/(还没提示|还没显示|没等到订单|还没跟单|订单还没出|怎么还没出)/.test(value)) return "order_waiting";
  if (/(绑定失败|绑定不了|怎么绑定|未绑定|绑定方法|支付宝账号|绑定支付宝)/.test(value)) return "bind_failed";
  if (/(提现|提取|余额提现|提现入口|提现多久到账|提现审核|提现到支付宝)/.test(value)) return "withdraw_query";
  if (/(什么时候到账|多久到账|待返利|已返利|返利|到账没|到帐没)/.test(value)) return "rebate_status";
  if (/(在线客服|联系客服|人工客服|客服链接|客服在哪)/.test(value)) return "manual_service";
  return "general";
}

function extractTrainingKeywords(text) {
  const normalized = String(text || "").replace(/[，。！？、,.!?]/g, " ").trim();
  const pieces = normalized.split(/\s+/).filter((item) => item.length >= 2);
  const fallback = normalized.length > 12 ? [normalized.slice(0, 12), normalized.slice(-8)] : [normalized];
  return uniqueTrainingList(pieces.length ? pieces : fallback, 8);
}

function buildServerLearningBucketKey(prompt, platformKey = "", intentKey = "", learningStage = "first_answer") {
  const keywords = extractTrainingKeywords(prompt)
    .map(normalizeTrainingComparableText)
    .filter(Boolean)
    .slice(0, 3)
    .join("_");
  return ["learn", platformKey || "all", intentKey || "general", learningStage || "first_answer", keywords || normalizeTrainingComparableText(prompt).slice(0, 18)].join(":");
}

function queueTrainingCandidate(data, sample) {
  const prompt = String(sample.prompt || "").trim();
  const reply = String(sample.reply || "").trim();
  const imageUrls = uniqueTrainingList(sample.imageUrls || [], 8);
  if (prompt.length < 2 || (reply.length < 2 && !imageUrls.length)) return { skipped: true };

  const platformKey = sample.platformKey || detectTrainingPlatformKey(`${prompt}\n${reply}`);
  const intentKey = sample.intentKey || detectTrainingIntentKey(`${prompt}\n${reply}`);
  const learningStage = sample.learningStage || "first_answer";
  const learningBucketKey = buildServerLearningBucketKey(prompt, platformKey, intentKey, learningStage);
  const now = new Date().toISOString();
  const override = {
    at: now,
    prompt,
    reply,
    imageUrls,
    contactId: sample.contactId || "",
    messageKey: sample.messageKey || "",
    platformKey,
    intentKey,
    learningStage
  };

  data.skills = Array.isArray(data.skills) ? data.skills : [];
  let index = data.skills.findIndex((skill) => String(skill.learningBucketKey || "") === learningBucketKey);
  if (index < 0) {
    const promptKey = normalizeTrainingComparableText(prompt);
    index = data.skills.findIndex((skill) => (
      ["learned", "manual"].includes(String(skill.source || "")) &&
      String(skill.platformKey || "") === platformKey &&
      String(skill.intentKey || "") === intentKey &&
      String(skill.learningStage || "") === learningStage &&
      (Array.isArray(skill.samples) ? skill.samples : []).some((item) => normalizeTrainingComparableText(item).includes(promptKey) || promptKey.includes(normalizeTrainingComparableText(item)))
    ));
  }

  const existing = index >= 0 ? data.skills[index] : null;
  const overrides = Array.isArray(existing?.manualOverrides) ? existing.manualOverrides.slice() : [];
  const mergedOverrides = mergeTrainingOverrideList(overrides, override).slice(0, 24);
  const totalCount = mergedOverrides.reduce((sum, item) => sum + Math.max(1, Number(item.count || 1)), 0);
  const steps = [
    reply ? { type: "text", content: reply, url: "", label: "" } : null,
    ...imageUrls.map((url, imageIndex) => ({ type: "image", content: "", url, label: `采样图片 ${imageIndex + 1}` }))
  ].filter(Boolean);

  const nextSkill = {
    ...(existing || {}),
    id: existing?.id || `sampled-${Date.now()}-${crypto.createHash("sha1").update(learningBucketKey).digest("hex").slice(0, 8)}`,
    title: existing?.title || `待训练：${prompt.slice(0, 18)}`,
    source: "learned",
    enabled: existing ? existing.enabled !== false : false,
    allowAutoReply: Boolean(existing?.allowAutoReply),
    noReply: Boolean(existing?.noReply),
    priority: Math.max(Number(existing?.priority || 45), 45),
    hitCount: totalCount,
    platformKey: existing?.platformKey || platformKey,
    intentKey: existing?.intentKey || intentKey,
    learningMode: "review_queue",
    learningBucketKey,
    learningStage,
    trainingStatus: "needs_optimization",
    keywords: uniqueTrainingList([...(existing?.keywords || []), ...extractTrainingKeywords(prompt)], 24),
    samples: uniqueTrainingList([...(existing?.samples || []), prompt, ...mergedOverrides.map((item) => item.prompt)], 14),
    manualOverrides: mergedOverrides,
    lastManualOverrideAt: now,
    revisionCount: Number(existing?.revisionCount || 0) + 1,
    replySteps: Array.isArray(existing?.replySteps) && existing.replySteps.length ? existing.replySteps : steps,
    fallback: existing?.fallback || reply || "",
    updatedAt: now
  };

  if (index >= 0) {
    data.skills[index] = nextSkill;
    return { updated: true };
  }
  data.skills.unshift(nextSkill);
  return { created: true };
}

function mergeTrainingOverrideList(overrides, override) {
  const normalizedPrompt = normalizeTrainingComparableText(override.prompt);
  const normalizedReply = normalizeTrainingComparableText(override.reply);
  const imageKey = (override.imageUrls || []).map(normalizeTrainingComparableText).join("|");
  const duplicateIndex = overrides.findIndex((item) => (
    normalizeTrainingComparableText(item.prompt) === normalizedPrompt &&
    normalizeTrainingComparableText(item.reply) === normalizedReply &&
    getSkillOverrideImages(item).map(normalizeTrainingComparableText).join("|") === imageKey &&
    String(item.platformKey || "") === String(override.platformKey || "") &&
    String(item.intentKey || "") === String(override.intentKey || "") &&
    String(item.learningStage || "") === String(override.learningStage || "")
  ));
  if (duplicateIndex >= 0) {
    overrides[duplicateIndex] = {
      ...overrides[duplicateIndex],
      ...override,
      count: Number(overrides[duplicateIndex].count || 1) + 1
    };
    return overrides;
  }
  return [override, ...overrides];
}

function isTrainingDirtyText(text) {
  const value = String(text || "").trim();
  if (!value) return true;
  if (/^\d{3,}$/.test(value)) return true;
  if (value.length > 700) return true;
  return /(下载链接|文件名称|文件大小|CRC32|MD5|SHA1|SHA256|Kaspersky|\.rar|测试版|http:\/\/4275\.com|巴嘎|454654)/i.test(value);
}

function getSkillTrainingReasons(skill, text, latestDateKey, selectedDateKey) {
  const reasons = [];
  const source = String(skill.source || "");
  const overrides = Array.isArray(skill.manualOverrides) ? skill.manualOverrides : [];
  const todayOverrides = overrides.filter((item) => getShanghaiDateKey(item.at) === selectedDateKey);
  const imageCount = getSkillServerImageUrls(skill).length;
  const manualSummary = buildSkillManualTrainingSummary(skill);

  if (source === "learned") reasons.push({ level: "info", label: "自动学习" });
  if (source === "manual") reasons.push({ level: "ok", label: "手动沉淀" });
  if (skill.learningMode === "review_queue") reasons.push({ level: "warn", label: "待训练候选" });
  if (todayOverrides.length) reasons.push({ level: "warn", label: `今日覆盖 ${todayOverrides.length}` });
  if (manualSummary.totalCount >= 2) reasons.push({ level: "warn", label: `相似样本 ${manualSummary.totalCount}` });
  if (manualSummary.replyVariants.length >= 2) reasons.push({ level: "warn", label: `话术变体 ${manualSummary.replyVariants.length}` });
  if (manualSummary.stageLabels.length) reasons.push({ level: "info", label: manualSummary.stageLabels[0] });
  if (String(latestDateKey) === String(selectedDateKey)) reasons.push({ level: "info", label: "今日变动" });
  if (imageCount || manualSummary.imageUrls.length) reasons.push({ level: "info", label: `${Math.max(imageCount, manualSummary.imageUrls.length)} 张图片` });
  if ((text || !(imageCount || manualSummary.imageUrls.length)) && (isTrainingDirtyText(text) || splitSkillListField(skill.keywords).some(isTrainingDirtyText))) {
    reasons.push({ level: "danger", label: "疑似脏学习" });
  }
  if (text.length > 420) reasons.push({ level: "warn", label: "话术过长" });
  if (skill.trainingStatus === "needs_optimization") reasons.push({ level: "warn", label: "待优化" });
  if (skill.trainingStatus === "approved") reasons.push({ level: "ok", label: "已批准" });
  if (skill.trainingStatus === "optimized") reasons.push({ level: "ok", label: "已优化" });
  if (skill.enabled === false) reasons.push({ level: "muted", label: "已停用" });
  return reasons;
}

function getLatestSkillOverride(skill) {
  const overrides = Array.isArray(skill.manualOverrides) ? skill.manualOverrides : [];
  return [...overrides].sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))[0] || null;
}

function buildSkillTrainingItems(data, options = {}) {
  const selectedDate = options.date || getShanghaiDateKey();
  const scope = options.scope || "today";
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const items = skills.map((skill) => {
    const activityDates = getSkillActivityDates(skill);
    const latestDate = activityDates[0] || null;
    const latestDateKey = latestDate ? getShanghaiDateKey(latestDate) : "";
    const text = getSkillServerText(skill);
    const latestOverride = getLatestSkillOverride(skill);
    const manualSummary = buildSkillManualTrainingSummary(skill);
    const reasons = getSkillTrainingReasons(skill, text, latestDateKey, selectedDate);
    const hasIssue = reasons.some((item) => ["danger", "warn"].includes(item.level));
    const isToday = latestDateKey === selectedDate || (Array.isArray(skill.manualOverrides) && skill.manualOverrides.some((item) => getShanghaiDateKey(item.at) === selectedDate));
    const include = scope === "all" || isToday || hasIssue || skill.trainingStatus === "needs_optimization" || skill.learningMode === "review_queue";
    if (!include) return null;
    return {
      id: String(skill.id || ""),
      title: String(skill.title || "未命名 skill"),
      source: String(skill.source || ""),
      enabled: skill.enabled !== false,
      allowAutoReply: Boolean(skill.allowAutoReply),
      noReply: Boolean(skill.noReply),
      priority: Number(skill.priority || 0),
      hitCount: Number(skill.hitCount || 0),
      revisionCount: Number(skill.revisionCount || 0),
      platformKey: String(skill.platformKey || ""),
      intentKey: String(skill.intentKey || ""),
      learningMode: String(skill.learningMode || ""),
      learningBucketKey: String(skill.learningBucketKey || ""),
      learningStage: String(skill.learningStage || ""),
      trainingStatus: String(skill.trainingStatus || ""),
      reviewedAt: String(skill.reviewedAt || ""),
      latestAt: latestDate ? latestDate.toISOString() : "",
      keywords: Array.isArray(skill.keywords) ? skill.keywords : [],
      samples: Array.isArray(skill.samples) ? skill.samples : [],
      currentText: text,
      proposedText: chooseSkillTrainingProposalText(skill, text, manualSummary),
      imageUrls: chooseSkillTrainingImages(skill, manualSummary),
      storedImageUrls: getSkillServerImageUrls(skill),
      manualOverrideCount: manualSummary.totalCount,
      manualOverrideRawCount: manualSummary.rawCount,
      promptVariants: manualSummary.promptVariants,
      replyVariants: manualSummary.replyVariants,
      stageLabels: manualSummary.stageLabels,
      latestOverride: latestOverride ? {
        at: latestOverride.at || "",
        prompt: latestOverride.prompt || "",
        reply: latestOverride.reply || "",
        imageUrls: Array.isArray(latestOverride.imageUrls) ? latestOverride.imageUrls : [],
        count: Number(latestOverride.count || 1),
        learningStage: String(latestOverride.learningStage || "")
      } : null,
      reasons,
      recommendation: hasIssue
        ? "建议先改写、停用或删除这条学习记录。"
        : "可以批准原样，后续推荐会继续参考。"
    };
  }).filter(Boolean);

  return items.sort((a, b) => {
    const dangerDelta = Number(b.reasons.some((item) => item.level === "danger")) - Number(a.reasons.some((item) => item.level === "danger"));
    if (dangerDelta) return dangerDelta;
    const warnDelta = Number(b.reasons.some((item) => item.level === "warn")) - Number(a.reasons.some((item) => item.level === "warn"));
    if (warnDelta) return warnDelta;
    return new Date(b.latestAt || 0) - new Date(a.latestAt || 0);
  });
}

function summarizeSkillTrainingItems(items, date) {
  const issueCount = items.filter((item) => item.reasons.some((reason) => ["danger", "warn"].includes(reason.level))).length;
  const dirtyCount = items.filter((item) => item.reasons.some((reason) => reason.level === "danger")).length;
  const learnedCount = items.filter((item) => item.source === "learned").length;
  const overrideCount = items.reduce((sum, item) => sum + Number(item.manualOverrideCount || 0), 0);
  const imageCount = items.reduce((sum, item) => sum + (Array.isArray(item.imageUrls) ? item.imageUrls.length : 0), 0);
  const lines = [
    `${date} 共整理 ${items.length} 条待审 skill。`,
    `自动学习 ${learnedCount} 条，学习覆盖 ${overrideCount} 条，带图片 ${imageCount} 条。`,
    issueCount ? `其中 ${issueCount} 条建议人工复核，${dirtyCount} 条疑似脏学习优先处理。` : "当前没有明显异常项，可以逐条批准。"
  ];
  return {
    total: items.length,
    issueCount,
    dirtyCount,
    learnedCount,
    overrideCount,
    imageCount,
    lines
  };
}

function applySkillTrainingPatch(skill, patch = {}, action = "approve") {
  const now = new Date().toISOString();
  const next = { ...skill };
  if (patch.title !== undefined) next.title = String(patch.title || next.title || "未命名 skill").trim();
  if (patch.keywords !== undefined) next.keywords = splitSkillListField(patch.keywords).slice(0, 24);
  if (patch.samples !== undefined) next.samples = splitSkillListField(patch.samples).slice(0, 14);
  if (patch.platformKey !== undefined) next.platformKey = String(patch.platformKey || "").trim();
  if (patch.intentKey !== undefined) next.intentKey = String(patch.intentKey || "").trim();
  if (patch.learningStage !== undefined) next.learningStage = String(patch.learningStage || "").trim();
  if (patch.allowAutoReply !== undefined) next.allowAutoReply = Boolean(patch.allowAutoReply);
  if (patch.noReply !== undefined) next.noReply = Boolean(patch.noReply);
  if (patch.enabled !== undefined) next.enabled = Boolean(patch.enabled);
  if (patch.replyText !== undefined || patch.imageUrls !== undefined) {
    const replyText = String(patch.replyText || "").trim();
    const imageUrls = patch.imageUrls !== undefined
      ? splitSkillListField(patch.imageUrls)
      : getSkillServerImageUrls(skill);
    next.replySteps = [
      replyText ? { type: "text", content: replyText, url: "", label: "" } : null,
      ...imageUrls.map((url, index) => ({ type: "image", content: "", url, label: `skill 图片 ${index + 1}` }))
    ].filter(Boolean);
    next.fallback = replyText;
  }
  if (["approved", "optimized"].includes(action)) {
    next.enabled = patch.enabled !== undefined ? Boolean(patch.enabled) : true;
    next.learningMode = "approved";
  }
  if (action === "needs_optimization" && !next.learningMode) {
    next.learningMode = "review_queue";
  }
  if (action === "optimized") {
    next.revisionCount = Number(next.revisionCount || 0) + 1;
    next.lastOptimizedAt = now;
  }
  next.trainingStatus = action;
  next.reviewedAt = now;
  next.trainingNote = String(patch.note || next.trainingNote || "").trim();
  next.updatedAt = now;
  return next;
}

async function handleSkillTraining(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const data = readReplySkills();

  if (url.pathname === "/local/skill-training/sample") {
    if (req.method !== "POST") {
      sendJson(res, 405, { success: false, message: "Method not allowed" });
      return;
    }
    try {
      const body = await readBody(req);
      const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
      const targetData = payload.dryRun ? JSON.parse(JSON.stringify(data)) : data;
      const result = await sampleManualRepliesForTraining(targetData, payload);
      const next = payload.dryRun ? targetData : writeReplySkills(targetData);
      const date = payload.date || getShanghaiDateKey();
      const scope = payload.scope || "today";
      const items = buildSkillTrainingItems(next, { date, scope });
      sendJson(res, 200, {
        success: true,
        message: "已采样人工回复并加入训练候选",
        sampled: result,
        date,
        scope,
        summary: summarizeSkillTrainingItems(items, date),
        items
      });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message || "闲时采样失败" });
    }
    return;
  }

  if (req.method === "GET") {
    const date = url.searchParams.get("date") || getShanghaiDateKey();
    const scope = url.searchParams.get("scope") || "today";
    const items = buildSkillTrainingItems(data, { date, scope });
    sendJson(res, 200, {
      success: true,
      date,
      scope,
      summary: summarizeSkillTrainingItems(items, date),
      items
    });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }

  try {
    const body = await readBody(req);
    const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
    const action = String(payload.action || "").trim();
    const skillId = String(payload.skillId || "").trim();
    const skillIndex = data.skills.findIndex((skill) => String(skill.id || "") === skillId);
    if (skillIndex < 0) throw new Error("没有找到要训练的 skill");

    if (action === "delete") {
      data.skills.splice(skillIndex, 1);
    } else if (action === "disable") {
      data.skills[skillIndex] = applySkillTrainingPatch(data.skills[skillIndex], { ...(payload.patch || {}), enabled: false }, "disabled");
    } else if (action === "needs-review") {
      data.skills[skillIndex] = applySkillTrainingPatch(data.skills[skillIndex], payload.patch || {}, "needs_optimization");
    } else if (action === "clear-overrides") {
      data.skills[skillIndex] = {
        ...data.skills[skillIndex],
        manualOverrides: [],
        lastManualOverrideAt: null,
        trainingStatus: "overrides_cleared",
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else if (action === "approve") {
      data.skills[skillIndex] = applySkillTrainingPatch(data.skills[skillIndex], payload.patch || {}, "approved");
    } else if (action === "optimize") {
      data.skills[skillIndex] = applySkillTrainingPatch(data.skills[skillIndex], payload.patch || {}, "optimized");
    } else {
      throw new Error("不支持的训练动作");
    }

    const next = writeReplySkills(data);
    const date = payload.date || getShanghaiDateKey();
    const scope = payload.scope || "today";
    const items = buildSkillTrainingItems(next, { date, scope });
    sendJson(res, 200, {
      success: true,
      message: "skill 训练已保存",
      date,
      scope,
      summary: summarizeSkillTrainingItems(items, date),
      items
    });
  } catch (error) {
    sendJson(res, 400, { success: false, message: error.message || "skill 训练失败" });
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

function getPayloadRecords(payload) {
  const data = getPayloadData(payload);
  if (Array.isArray(data)) return data;
  const candidates = [data?.records, data?.rows, data?.list, data?.items, data?.data, data?.result];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested = candidate.records || candidate.rows || candidate.list || candidate.items || candidate.data;
      if (Array.isArray(nested)) return nested;
    }
  }
  return [];
}

function appendFormValue(form, key, value) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((item) => appendFormValue(form, key, item));
    return;
  }
  form.append(key, String(value));
}

function appendDotFormValues(form, prefix, value) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((item) => appendDotFormValues(form, prefix, item));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nestedValue]) => {
      appendDotFormValues(form, prefix ? `${prefix}.${key}` : key, nestedValue);
    });
    return;
  }
  form.append(prefix, String(value));
}

async function postYouChatDotForm(pathname, payload = {}, apiBase = DEFAULT_API_BASE) {
  // YouChat SetOptions binds nested option objects from dotted form fields; JSON can reset database mode.
  const base = String(apiBase || DEFAULT_API_BASE).replace(/\/+$/, "");
  const target = new URL(`${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
  const form = new FormData();
  appendDotFormValues(form, "", payload || {});
  const upstream = await fetchWithTimeout(target, {
    method: "POST",
    body: form
  }, Math.min(API_PROXY_TIMEOUT_MS, 30000), `YouChat dot form ${pathname}`);
  const text = await upstream.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { success: false, message: text };
  }
  if (!upstream.ok || parsed?.success === false) {
    throw new Error(parsed?.message || `HTTP ${upstream.status}`);
  }
  return parsed;
}

async function postYouChatApi(pathname, payload = {}, apiBase = DEFAULT_API_BASE) {
  const base = String(apiBase || DEFAULT_API_BASE).replace(/\/+$/, "");
  const target = new URL(`${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
  const form = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => appendFormValue(form, key, value));
  const upstream = await fetchWithTimeout(target, {
    method: "POST",
    body: form
  }, Math.min(API_PROXY_TIMEOUT_MS, 30000), `YouChat sample ${pathname}`);
  const text = await upstream.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { success: false, message: text };
  }
  if (!upstream.ok || parsed?.success === false) {
    throw new Error(parsed?.message || `HTTP ${upstream.status}`);
  }
  return parsed;
}

async function postYouChatJson(pathname, payload = {}, apiBase = DEFAULT_API_BASE) {
  const base = String(apiBase || DEFAULT_API_BASE).replace(/\/+$/, "");
  const target = new URL(`${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
  const upstream = await fetchWithTimeout(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {})
  }, Math.min(API_PROXY_TIMEOUT_MS, 30000), `YouChat JSON ${pathname}`);
  const text = await upstream.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { success: false, message: text };
  }
  if (!upstream.ok || parsed?.success === false) {
    throw new Error(parsed?.message || `HTTP ${upstream.status}`);
  }
  return parsed;
}

function getYouChatOptionsData(payload) {
  return payload?.data && typeof payload.data === "object" ? payload.data : {};
}

async function getYouChatOptions(apiBase = DEFAULT_API_BASE) {
  const payload = await postYouChatApi("/System/GetOptions", {}, apiBase);
  return getYouChatOptionsData(payload);
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  if (typeof value === "string") {
    if (/^true$/i.test(value)) return true;
    if (/^false$/i.test(value)) return false;
  }
  return fallback;
}

function buildSafeClientOptionsForSave(incoming = {}, current = {}) {
  const currentDatabaseOptions = current.dataBaseOptions || current.DataBaseOptions || {};
  const incomingDatabaseOptions = incoming.dataBaseOptions || incoming.DataBaseOptions || {};
  const currentJobOptions = current.jobOptions || current.JobOptions || {};
  const incomingJobOptions = incoming.jobOptions || incoming.JobOptions || {};

  const dataBaseOptions = {
    ...currentDatabaseOptions,
    ...incomingDatabaseOptions,
    databaseType: 0
  };
  dataBaseOptions.connectionString = String(
    incomingDatabaseOptions.connectionString ||
    currentDatabaseOptions.connectionString ||
    FNOS_MYSQL_CONNECTION_STRING
  ).trim();

  const commonOptions = {
    ...(current.commonOptions || current.CommonOptions || {}),
    ...(incoming.commonOptions || incoming.CommonOptions || {})
  };
  const jobOptions = {
    ...currentJobOptions,
    ...incomingJobOptions,
    autoShutDown: false,
    runTimeoutCheckJob: normalizeBoolean(incomingJobOptions.runTimeoutCheckJob, normalizeBoolean(currentJobOptions.runTimeoutCheckJob, true))
  };
  if (jobOptions.closeTime === undefined || jobOptions.closeTime === null || jobOptions.closeTime === "") jobOptions.closeTime = 20;
  if (jobOptions.timeout === undefined || jobOptions.timeout === null || jobOptions.timeout === "") jobOptions.timeout = 5;
  if (jobOptions.getMsgByDate === undefined || jobOptions.getMsgByDate === null || jobOptions.getMsgByDate === "") jobOptions.getMsgByDate = 2;

  const aiOptions = {
    ...(current.aiOptions || current.AiOptions || {}),
    ...(incoming.aiOptions || incoming.AiOptions || {})
  };

  return {
    dataBaseOptions,
    commonOptions,
    jobOptions,
    aiOptions
  };
}

function summarizeDatabaseGuardState() {
  return {
    enabled: databaseGuardState.enabled,
    intervalMs: databaseGuardState.intervalMs,
    intervalMinutes: databaseGuardState.intervalMinutes,
    running: databaseGuardState.running,
    lastReason: databaseGuardState.lastReason,
    lastCheckedAt: databaseGuardState.lastCheckedAt,
    lastRepairAt: databaseGuardState.lastRepairAt,
    lastError: databaseGuardState.lastError,
    repairCount: databaseGuardState.repairCount
  };
}

function getYouChatDatabaseMode(databaseType) {
  const type = Number(databaseType);
  if (type === 0) return "mysql";
  if (type === 1) return "sqlserver";
  if (type === 2) return "sqlite";
  return "unknown";
}

async function getYouChatContactCount(body = {}, apiBase = DEFAULT_API_BASE) {
  const payload = await postYouChatApi("/Contact/GetContactList", body, apiBase);
  const data = getPayloadData(payload);
  if (data === null || data === undefined) return 0;
  if (typeof data === "number") return data;
  if (typeof data === "string" && /^\d+$/.test(data)) return Number(data);
  if (Number.isFinite(Number(data?.total))) return Number(data.total);
  const records = getPayloadRecords(payload);
  return records.length;
}

async function getFnOSDatabaseHealth(options = {}) {
  const apiBase = options.apiBase || DEFAULT_API_BASE;
  const minHistoryCount = Number(options.minHistoryCount || 1000);
  const summary = {
    apiBase,
    ok: true,
    databaseType: null,
    databaseMode: "unknown",
    connectionStringPresent: false,
    totalContacts: 0,
    historyContacts: 0,
    guestbookContacts: 0,
    currentAccount2: 0,
    checkedAt: new Date().toISOString(),
    errors: []
  };

  try {
    const optionsPayload = await postYouChatApi("/System/GetOptions", {}, apiBase);
    const databaseOptions = optionsPayload?.data?.dataBaseOptions || {};
    summary.databaseType = Number(databaseOptions.databaseType);
    summary.databaseMode = getYouChatDatabaseMode(summary.databaseType);
    summary.connectionStringPresent = Boolean(String(databaseOptions.connectionString || "").trim());
    if (summary.databaseType !== 0) {
      summary.ok = false;
      summary.errors.push("FnOS 服务端当前不是 MySQL 模式。");
    }
  } catch (error) {
    summary.ok = false;
    summary.errors.push(`System/GetOptions 失败：${error.message}`);
  }

  try {
    summary.totalContacts = await getYouChatContactCount({ pageIndex: 1, pageSize: 20 }, apiBase);
    if (summary.totalContacts <= 0) {
      summary.ok = false;
      summary.errors.push("联系人总数为空。");
    }
  } catch (error) {
    summary.ok = false;
    summary.errors.push(`联系人总数检查失败：${error.message}`);
  }

  try {
    summary.historyContacts = await getYouChatContactCount({ pageIndex: 1, pageSize: 20, isHistory: "true" }, apiBase);
    if (summary.historyContacts < minHistoryCount) {
      summary.ok = false;
      summary.errors.push(`历史联系人数量异常：${summary.historyContacts}`);
    }
  } catch (error) {
    summary.ok = false;
    summary.errors.push(`历史联系人检查失败：${error.message}`);
  }

  try {
    summary.guestbookContacts = await getYouChatContactCount({ pageIndex: 1, pageSize: 20, isGuestbook: "true" }, apiBase);
  } catch (error) {
    summary.errors.push(`留言联系人检查失败：${error.message}`);
  }

  try {
    summary.currentAccount2 = await getYouChatContactCount({ pageIndex: 1, pageSize: 20, accountId: 2 }, apiBase);
  } catch (error) {
    summary.errors.push(`当前账号探测失败：${error.message}`);
  }

  return summary;
}

async function restoreFnOSDatabaseToMySQL(options = {}) {
  const apiBase = options.apiBase || DEFAULT_API_BASE;
  const connectionString = String(options.connectionString || FNOS_MYSQL_CONNECTION_STRING).trim();
  if (!connectionString) throw new Error("MySQL 连接串为空");

  const before = await getFnOSDatabaseHealth({ apiBase, minHistoryCount: options.minHistoryCount });
  const connectResult = await postYouChatApi("/System/ConnectDatabase", {
    type: 0,
    connectionString
  }, apiBase);
  if (!connectResult?.data) throw new Error(connectResult?.message || "ConnectDatabase 失败");

  const saveResult = await postYouChatApi("/System/SetConnectionString", {
    type: 0,
    connectionString
  }, apiBase);
  if (!saveResult?.data) throw new Error(saveResult?.message || "SetConnectionString 失败");

  const persisted = await postYouChatApi("/System/GetConnectionString", {}, apiBase);
  const persistedType = Number(persisted?.data?.databaseType);
  const persistedConnection = String(persisted?.data?.connectionString || "");
  if (persistedType !== 0 || !/^Server=mysql/i.test(persistedConnection)) {
    throw new Error(`连接串保存后仍异常：databaseType=${persistedType}`);
  }

  const after = await getFnOSDatabaseHealth({ apiBase, minHistoryCount: options.minHistoryCount });
  if (after.databaseType !== 0) throw new Error("修复后服务端仍未切到 MySQL");

  return {
    before,
    after,
    persistedDatabaseType: persistedType,
    restoredAt: new Date().toISOString()
  };
}

async function saveClientOptionsSafely(payload = {}) {
  const apiBase = payload.apiBase || DEFAULT_API_BASE;
  const current = await getYouChatOptions(apiBase);
  const options = buildSafeClientOptionsForSave(payload, current);
  const saveResult = await postYouChatDotForm("/System/SetOptions", options, apiBase);
  let health = await getFnOSDatabaseHealth({
    apiBase,
    minHistoryCount: DATABASE_GUARD_MIN_HISTORY_COUNT
  });
  let repaired = false;
  let repairResult = null;

  if (!health.ok || Number(health.databaseType) !== 0) {
    repairResult = await restoreFnOSDatabaseToMySQL({
      apiBase,
      minHistoryCount: DATABASE_GUARD_MIN_HISTORY_COUNT
    });
    health = repairResult.after || health;
    repaired = true;
    databaseGuardState.lastResult = repairResult;
    databaseGuardState.lastHealth = health;
    databaseGuardState.lastRepairAt = new Date().toISOString();
    databaseGuardState.repairCount += 1;
  } else {
    databaseGuardState.lastHealth = health;
    databaseGuardState.lastCheckedAt = new Date().toISOString();
  }

  const savedOptions = await getYouChatOptions(apiBase);
  const savedAutoShutDown = normalizeBoolean(savedOptions?.jobOptions?.autoShutDown, true);
  const savedDatabaseType = Number(savedOptions?.dataBaseOptions?.databaseType);
  if (savedDatabaseType !== 0) {
    throw new Error(`系统设置保存后数据库模式异常：databaseType=${savedDatabaseType}`);
  }
  if (savedAutoShutDown !== false) {
    throw new Error("系统设置保存后自动关闭会话仍为开启，已阻止误报保存成功");
  }

  return {
    saveResult,
    options: savedOptions,
    health,
    repaired,
    repairResult
  };
}

async function runDatabaseGuardCheck(reason = "timer") {
  if (!DATABASE_GUARD_ENABLED) return null;
  if (databaseGuardState.running) return null;
  databaseGuardState.running = true;
  databaseGuardState.lastReason = reason;
  databaseGuardState.lastError = "";
  try {
    const health = await getFnOSDatabaseHealth({
      apiBase: DEFAULT_API_BASE,
      minHistoryCount: DATABASE_GUARD_MIN_HISTORY_COUNT
    });
    databaseGuardState.lastHealth = health;
    databaseGuardState.lastCheckedAt = new Date().toISOString();
    if (!health.ok || Number(health.databaseType) !== 0) {
      const result = await restoreFnOSDatabaseToMySQL({
        apiBase: DEFAULT_API_BASE,
        minHistoryCount: DATABASE_GUARD_MIN_HISTORY_COUNT
      });
      databaseGuardState.lastResult = result;
      databaseGuardState.lastHealth = result.after || health;
      databaseGuardState.lastRepairAt = new Date().toISOString();
      databaseGuardState.repairCount += 1;
      console.warn(`[database-guard] repaired database mode after ${reason}`);
      return result;
    }
    return { health };
  } catch (error) {
    databaseGuardState.lastError = error.message || String(error);
    console.warn(`[database-guard] check failed: ${databaseGuardState.lastError}`);
    return null;
  } finally {
    databaseGuardState.running = false;
  }
}

async function handleFnOSDatabase(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === "/local/fnos/health") {
      const health = await getFnOSDatabaseHealth({
        apiBase: url.searchParams.get("apiBase") || DEFAULT_API_BASE
      });
      databaseGuardState.lastHealth = health;
      databaseGuardState.lastCheckedAt = new Date().toISOString();
      sendJson(res, 200, { success: true, health, guard: summarizeDatabaseGuardState() });
      return;
    }

    if (url.pathname === "/local/fnos/guard") {
      if (req.method === "POST") {
        await runDatabaseGuardCheck("manual");
      }
      sendJson(res, 200, {
        success: true,
        guard: summarizeDatabaseGuardState(),
        health: databaseGuardState.lastHealth
      });
      return;
    }

    if (url.pathname === "/local/fnos/restore-mysql") {
      if (req.method !== "POST") {
        sendJson(res, 405, { success: false, message: "Method not allowed" });
        return;
      }
      const body = await readBody(req);
      const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
      const result = await restoreFnOSDatabaseToMySQL(payload);
      databaseGuardState.lastResult = result;
      databaseGuardState.lastHealth = result.after || null;
      databaseGuardState.lastRepairAt = new Date().toISOString();
      databaseGuardState.repairCount += 1;
      sendJson(res, 200, {
        success: true,
        message: "FnOS 数据库已切回 MySQL",
        result,
        guard: summarizeDatabaseGuardState()
      });
      return;
    }

    sendJson(res, 404, { success: false, message: "Unknown FnOS database endpoint" });
  } catch (error) {
    sendJson(res, 400, { success: false, message: error.message || "FnOS 数据库操作失败" });
  }
}

async function handleClientOptionsSave(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }
  try {
    const body = await readBody(req);
    const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
    const result = await saveClientOptionsSafely(payload);
    sendJson(res, 200, {
      success: true,
      message: result.repaired ? "系统设置已保存，并已切回 MySQL" : "系统设置已保存",
      options: result.options,
      health: result.health,
      repaired: result.repaired,
      guard: summarizeDatabaseGuardState()
    });
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      message: error.message || "系统设置保存失败"
    });
  }
}

function getSampleContactId(contact) {
  return firstNonEmpty(contact?.id, contact?.contactId, contact?.contactID, contact?.userId, contact?.customerId, contact?.wxid);
}

function getSampleMessageTime(message) {
  const value = firstNonEmpty(message?.sendTime, message?.createTime, message?.time, message?.timestamp, message?.msgTime, message?.addTime);
  const numberValue = Number(value);
  if (Number.isFinite(numberValue) && numberValue > 0) return numberValue < 100000000000 ? numberValue * 1000 : numberValue;
  const parsed = Date.parse(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSampleMessageText(message) {
  return String(firstNonEmpty(message?.content, message?.msg, message?.message, message?.text, message?.title, "") || "").trim();
}

function getSampleMessageImage(message) {
  const value = firstNonEmpty(message?.img, message?.image, message?.imageUrl, message?.url, message?.picUrl, "");
  const text = String(value || getSampleMessageText(message)).trim();
  return /^https?:\/\//i.test(text) && /\.(png|jpe?g|gif|webp)(?:$|\?)/i.test(text) ? text : "";
}

function getSampleMessageSource(message) {
  const source = firstNonEmpty(message?.source, message?.msgSource, message?.fromType, message?.direction);
  return String(source ?? "");
}

function isSampleIncomingMessage(message) {
  const source = getSampleMessageSource(message);
  if (source === "0" || source === "customer" || source === "incoming") return true;
  return message?.isCustomer === true || message?.direction === "incoming";
}

function isSampleOutgoingManualMessage(message) {
  const source = getSampleMessageSource(message);
  if (source === "2" || source === "service" || source === "outgoing") return true;
  return message?.isCustomerService === true || message?.direction === "outgoing";
}

function isSampleSystemText(text) {
  const raw = String(text || "").trim();
  const value = normalizeTrainingComparableText(text);
  if (!value) return true;
  return (
    /(会话.*结束|接待客服|系统关闭|转接|自动回复|机器人|撤回了一条消息|接入会话|关闭会话|我拍了拍)/.test(value) ||
    /(客服.*接入会话|接入会话|会话.*结束|类型[:：]?\s*系统关闭|系统关闭|关闭会话|转接|撤回了一条消息|我拍了拍)/.test(raw)
  );
}

function isSampleSystemMessage(message, text = getSampleMessageText(message)) {
  const source = getSampleMessageSource(message).toLowerCase();
  const msgType = String(firstNonEmpty(message?.msgType, message?.contentType, message?.type, "") || "").toLowerCase();
  const bizType = String(firstNonEmpty(message?.bizType, message?.businessType, "") || "");
  if (message?.isSystem || message?.systemNotice || source.includes("system")) return true;
  if (msgType === "system" || bizType === "-1") return true;
  return isSampleSystemText(text);
}

function getSampleMessageKey(message, fallback = "") {
  return String(firstNonEmpty(message?.id, message?.msgId, message?.messageId, message?.chatContentId, fallback) || "");
}

async function collectManualReplySamples(options = {}) {
  const contactLimit = Math.max(1, Math.min(Number(options.contactLimit || 18), 80));
  const messageLimit = Math.max(20, Math.min(Number(options.messageLimit || 80), 180));
  const sampleLimit = Math.max(1, Math.min(Number(options.sampleLimit || 80), 500));
  const contactPayloads = [
    { pageIndex: 1, pageSize: contactLimit },
    { pageIndex: 1, pageSize: contactLimit, isHistory: true }
  ];
  const contacts = [];
  const contactSeen = new Set();
  const errors = [];

  for (const payload of contactPayloads) {
    try {
      const result = await postYouChatApi("/Contact/GetContactList", payload, options.apiBase);
      getPayloadRecords(result).forEach((contact) => {
        const contactId = String(getSampleContactId(contact) || "");
        if (!contactId || contactSeen.has(contactId)) return;
        contactSeen.add(contactId);
        contacts.push(contact);
      });
    } catch (error) {
      errors.push(`contact:${error.message}`);
    }
  }

  const samples = [];
  for (const contact of contacts.slice(0, contactLimit)) {
    if (samples.length >= sampleLimit) break;
    const contactId = String(getSampleContactId(contact) || "");
    if (!contactId) continue;
    try {
      const result = await postYouChatApi("/ChatContent/GetList", {
        contactId,
        size: messageLimit,
        current: 1,
        onlyRepointMsg: false
      }, options.apiBase);
      const messages = getPayloadRecords(result)
        .slice()
        .sort((a, b) => getSampleMessageTime(a) - getSampleMessageTime(b));
      let lastIncoming = null;
      let lastOutgoingSeen = false;
      for (const message of messages) {
        if (samples.length >= sampleLimit) break;
        const text = getSampleMessageText(message);
        if (isSampleSystemMessage(message, text)) continue;
        if (isSampleIncomingMessage(message)) {
          lastIncoming = message;
          lastOutgoingSeen = false;
          continue;
        }
        if (!isSampleOutgoingManualMessage(message) || !lastIncoming || lastOutgoingSeen) continue;
        const reply = text;
        const image = getSampleMessageImage(message);
        if (isSampleSystemMessage(message, reply) && !image) continue;
        const prompt = getSampleMessageText(lastIncoming);
        if (prompt.length < 2 || (reply.length < 2 && !image)) continue;
        const incomingIndex = messages.indexOf(lastIncoming);
        const previous = messages.slice(0, incomingIndex).reverse().find((item) => isSampleIncomingMessage(item) || isSampleOutgoingManualMessage(item));
        const learningStage = previous && isSampleOutgoingManualMessage(previous) ? "customer_followup" : "first_answer";
        const sampleText = `${prompt}\n${reply}`;
        const replyAtMs = getSampleMessageTime(message);
        const customerAtMs = getSampleMessageTime(lastIncoming);
        samples.push({
          prompt,
          reply,
          imageUrls: image ? [image] : [],
          contactId,
          messageKey: getSampleMessageKey(message, `${contactId}:${samples.length}`),
          platformKey: detectTrainingPlatformKey(sampleText),
          intentKey: detectTrainingIntentKey(sampleText),
          learningStage,
          customerAt: customerAtMs ? new Date(customerAtMs).toISOString() : "",
          replyAt: replyAtMs ? new Date(replyAtMs).toISOString() : ""
        });
        lastOutgoingSeen = true;
      }
    } catch (error) {
      errors.push(`contact ${contactId}:${error.message}`);
    }
  }

  return {
    contacts,
    samples,
    errors: errors.slice(0, 12)
  };
}

async function sampleManualRepliesForTraining(data, options = {}) {
  const collected = await collectManualReplySamples(options);
  let sampledPairs = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const sample of collected.samples) {
    const queued = queueTrainingCandidate(data, sample);
    sampledPairs += 1;
    if (queued.created) created += 1;
    else if (queued.updated) updated += 1;
    else skipped += 1;
  }

  return {
    contacts: collected.contacts.length,
    sampledPairs,
    created,
    updated,
    skipped,
    errors: collected.errors.slice(0, 8)
  };
}

function normalizePromptWorksApiBase(value = "") {
  const raw = String(value || PROMPTWORKS_API_BASE).trim().replace(/\/+$/, "");
  if (!raw) return PROMPTWORKS_API_BASE;
  if (/\/api\/v1$/i.test(raw)) return raw;
  return `${raw}/api/v1`;
}

async function promptWorksRequest(pathname, options = {}) {
  const apiBase = normalizePromptWorksApiBase(options.apiBase);
  const target = new URL(`${apiBase}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  };
  if (options.body !== undefined) fetchOptions.body = JSON.stringify(options.body);
  const upstream = await fetchWithTimeout(target, fetchOptions, PROMPTWORKS_TIMEOUT_MS, `PromptWorks ${pathname}`);
  const text = await upstream.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!upstream.ok) {
    const message = typeof parsed === "object" && parsed ? getMessage(parsed) : String(parsed || "");
    throw new Error(message || `PromptWorks HTTP ${upstream.status}`);
  }
  return parsed;
}

function getPromptWorksList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.value)) return payload.value;
  return [];
}

function buildPromptWorksTrainingPromptContent() {
  return [
    "你是悠聊客服回复训练助手。",
    "请根据客户消息、平台、意图、会话阶段和可参考的历史人工回复，生成一条更适合当前客户的客服回复。",
    "要求：",
    "1. 回复要口语化、短句清晰，避免生硬模板腔。",
    "2. 需要解决问题时优先给出具体处理步骤，不要过早引导第三方客服。",
    "3. 如涉及敏感词，尽量使用自然替代表达，但含义不能变。",
    "4. 如果客户消息属于系统提示、提现成功通知等无需回复场景，请输出“无需回复”。",
    "5. 如果参考回复包含图片，请在文字中说明需要配合发送对应图片，但不要伪造图片链接。",
    "",
    "客户消息：{customer_message}",
    "平台：{platform_key}",
    "意图：{intent_key}",
    "会话阶段：{learning_stage}",
    "历史人工回复：{manual_reply}",
    "参考图片：{image_urls}",
    "",
    "请输出最终建议回复："
  ].join("\n");
}

function buildPromptWorksTrainingCases(samples, limit = 80) {
  const seen = new Set();
  const cases = [];
  for (const sample of samples) {
    const customerMessage = String(sample.prompt || "").trim();
    const manualReply = String(sample.reply || "").trim();
    const key = normalizeTrainingComparableText(`${customerMessage}\n${manualReply}\n${sample.platformKey}\n${sample.intentKey}\n${sample.learningStage}`);
    if (!customerMessage || (!manualReply && !sample.imageUrls?.length) || seen.has(key)) continue;
    seen.add(key);
    cases.push({
      customer_message: customerMessage,
      manual_reply: manualReply,
      platform_key: sample.platformKey || "unknown",
      intent_key: sample.intentKey || "general",
      learning_stage: sample.learningStage || "first_answer",
      image_urls: Array.isArray(sample.imageUrls) ? sample.imageUrls.join("\n") : "",
      contact_id: sample.contactId || "",
      message_key: sample.messageKey || "",
      customer_at: sample.customerAt || "",
      reply_at: sample.replyAt || ""
    });
    if (cases.length >= limit) break;
  }
  return cases;
}

function summarizePromptWorksCases(cases) {
  const byIntent = {};
  const byPlatform = {};
  const byStage = {};
  cases.forEach((item) => {
    byIntent[item.intent_key || "general"] = (byIntent[item.intent_key || "general"] || 0) + 1;
    byPlatform[item.platform_key || "unknown"] = (byPlatform[item.platform_key || "unknown"] || 0) + 1;
    byStage[item.learning_stage || "first_answer"] = (byStage[item.learning_stage || "first_answer"] || 0) + 1;
  });
  return {
    total: cases.length,
    byIntent,
    byPlatform,
    byStage
  };
}

function normalizePromptWorksTaskName(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const meaningful = text.replace(/[\s\d:._-]/g, "");
  if (!meaningful || /^\?+$/.test(meaningful)) return "";
  return text.slice(0, 120);
}

async function findOrCreatePromptWorksTrainingPrompt(options = {}) {
  const apiBase = options.apiBase;
  const promptName = String(options.promptName || "悠聊客服回复训练").trim();
  const version = String(options.version || `import-${getShanghaiDateKey()}`).trim();
  const existing = getPromptWorksList(await promptWorksRequest(`/prompts/?limit=200&q=${encodeURIComponent(promptName)}`, { apiBase }));
  const prompt = existing.find((item) => String(item.name || "") === promptName);
  if (prompt?.id) {
    const versions = Array.isArray(prompt.versions) ? prompt.versions : [];
    const existingVersion = versions.find((item) => String(item.version || "") === version);
    if (existingVersion?.id) return { prompt, version: existingVersion, created: false };
    const updated = await promptWorksRequest(`/prompts/${prompt.id}`, {
      apiBase,
      method: "PUT",
      body: {
        version,
        content: buildPromptWorksTrainingPromptContent()
      }
    });
    return { prompt: updated, version: updated?.current_version || updated?.currentVersion || null, created: false, versionCreated: true };
  }

  const created = await promptWorksRequest("/prompts/", {
    apiBase,
    method: "POST",
    body: {
      name: promptName,
      description: "从悠聊真实客服会话导入的客户问题与人工回复样本，用于评估和优化客服话术。",
      author: "YouChat Web",
      class_name: "悠聊客服训练",
      class_description: "由悠聊 Web 从真实数据库/接口抽样生成的客服训练 Prompt。",
      version,
      content: buildPromptWorksTrainingPromptContent(),
      tag_ids: []
    }
  });
  return { prompt: created, version: created?.current_version || created?.currentVersion || null, created: true };
}

async function getPromptWorksDefaultModel(apiBase) {
  const providers = getPromptWorksList(await promptWorksRequest("/llm-providers/", { apiBase }));
  for (const provider of providers) {
    const models = Array.isArray(provider.models) ? provider.models : [];
    const defaultName = String(provider.default_model_name || "").trim();
    const model = models.find((item) => String(item.name || "") === defaultName) || models[0];
    if (provider?.id && model?.name) {
      return {
        providerId: Number(provider.id),
        providerKey: String(provider.provider_key || provider.providerName || provider.provider_name || "").trim(),
        modelId: model.id ? Number(model.id) : null,
        modelName: String(model.name)
      };
    }
  }
  throw new Error("PromptWorks 还没有可用模型，请先在模型管理里配置 sub2/DeepSeek 等模型。");
}

async function createPromptWorksTrainingTask({ apiBase, promptVersionId, cases, model, taskName }) {
  const task = await promptWorksRequest("/prompt-test/tasks", {
    apiBase,
    method: "POST",
    body: {
      name: taskName,
      description: `从悠聊真实会话导入 ${cases.length} 条人工回复样本，用于训练/评估客服回复。`,
      prompt_version_id: promptVersionId,
      config: {
        source: "youchat-web",
        importedAt: new Date().toISOString(),
        sampleCount: cases.length,
        mode: "manual_reply_training"
      },
      units: [
        {
          name: `人工回复样本 ${getShanghaiDateKey()}`,
          description: "客户消息 + 历史人工回复变量集。",
          model_name: model.modelName,
          llm_provider_id: model.providerId,
          prompt_version_id: promptVersionId,
          temperature: 0.35,
          rounds: 1,
          prompt_template: null,
          variables: {
            cases
          },
          expectations: {
            target: "回复应贴近人工高质量客服处理方式，并识别无需回复场景。"
          },
          tags: ["youchat", "manual-reply", "training"],
          extra: {
            provider_key: model.providerKey || "",
            llm_model_id: model.modelId,
            source: "youchat-web"
          }
        }
      ],
      auto_execute: false
    }
  });
  return task;
}

async function importYouChatRepliesToPromptWorks(options = {}) {
  const dryRun = options.dryRun !== false;
  const apiBase = normalizePromptWorksApiBase(options.promptWorksApiBase || options.promptworksApiBase || PROMPTWORKS_API_BASE);
  const sampleLimit = Math.max(1, Math.min(Number(options.sampleLimit || 80), 500));
  const collected = await collectManualReplySamples({
    ...options,
    sampleLimit
  });
  const cases = buildPromptWorksTrainingCases(collected.samples, sampleLimit);
  const summary = summarizePromptWorksCases(cases);
  const preview = cases.slice(0, Math.min(Number(options.previewLimit || 8), 20));
  if (dryRun) {
    return {
      dryRun: true,
      apiBase,
      sampledContacts: collected.contacts.length,
      sampledPairs: collected.samples.length,
      summary,
      preview,
      errors: collected.errors
    };
  }
  if (!cases.length) throw new Error("没有采集到可导入 PromptWorks 的人工回复样本。");
  const promptResult = await findOrCreatePromptWorksTrainingPrompt({
    apiBase,
    promptName: options.promptName,
    version: options.version || `import-${getShanghaiDateKey()}-${Date.now().toString().slice(-5)}`
  });
  const promptVersionId = Number(promptResult.version?.id || promptResult.prompt?.current_version?.id || promptResult.prompt?.currentVersion?.id);
  if (!promptVersionId) throw new Error("PromptWorks Prompt 创建成功但没有拿到版本 ID。");
  const model = await getPromptWorksDefaultModel(apiBase);
  const taskName = normalizePromptWorksTaskName(options.taskName) || `悠聊人工回复训练 ${getShanghaiDateKey()} ${new Date().toTimeString().slice(0, 5)}`;
  const task = await createPromptWorksTrainingTask({
    apiBase,
    promptVersionId,
    cases,
    model,
    taskName
  });
  return {
    dryRun: false,
    apiBase,
    sampledContacts: collected.contacts.length,
    sampledPairs: collected.samples.length,
    summary,
    preview,
    prompt: {
      id: promptResult.prompt?.id,
      name: promptResult.prompt?.name,
      versionId: promptVersionId,
      created: Boolean(promptResult.created),
      versionCreated: Boolean(promptResult.versionCreated)
    },
    model,
    task: {
      id: task?.id,
      name: task?.name,
      status: task?.status,
      unitCount: Array.isArray(task?.units) ? task.units.length : 0
    },
    errors: collected.errors
  };
}

async function handlePromptWorksImportTraining(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, message: "Method not allowed" });
    return;
  }
  try {
    const body = await readBody(req);
    const payload = body.length ? JSON.parse(body.toString("utf8")) : {};
    const result = await importYouChatRepliesToPromptWorks(payload);
    sendJson(res, 200, {
      success: true,
      message: result.dryRun ? "已预览可导入 PromptWorks 的真实人工回复样本。" : "已把真实人工回复样本导入 PromptWorks。",
      result
    });
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      message: error.message || "导入 PromptWorks 失败"
    });
  }
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

function getMessage(payload) {
  if (!payload || typeof payload !== "object") return "";
  return payload.message || payload.msg || payload.error || payload.error_msg || "";
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

function getContainerReachableApiBase(apiBase) {
  const normalized = normalizeApiBase(apiBase);
  const explicit = normalizeOptionalApiBase(CONTAINER_API_BASE);
  if (explicit) return explicit;
  if (!IS_CONTAINER_RUNTIME || !CONTAINER_HOST_GATEWAY) return normalized;

  try {
    const url = new URL(normalized);
    if (shouldUseContainerHostGateway(url)) {
      url.hostname = CONTAINER_HOST_GATEWAY;
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    // Keep the original base if it cannot be parsed.
  }
  return normalized;
}

function normalizeOptionalApiBase(value) {
  const raw = String(value || "").trim();
  return raw ? normalizeApiBase(raw) : "";
}

function shouldUseContainerHostGateway(url) {
  const host = String(url.hostname || "").toLowerCase();
  if (!host || host === "localhost" || host === "127.0.0.1" || host === CONTAINER_HOST_GATEWAY.toLowerCase()) {
    return false;
  }
  if (/^(10|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host)) return true;
  return false;
}

function getApiBaseCandidates(apiBase) {
  const normalized = normalizeApiBase(apiBase);
  const reachable = getContainerReachableApiBase(normalized);
  return [...new Set([reachable, normalized].filter(Boolean))];
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

  const attempts = [];
  for (const candidateBase of getApiBaseCandidates(apiBase)) {
    try {
      const connection = await ensureServerSignalRConnection(candidateBase, accountId);
      await withTimeout(
        connection.invoke("ConsumeMessage", contactId, Number.isFinite(msgId) ? msgId : 0),
        SIGNALR_START_TIMEOUT_MS,
        "SignalR ConsumeMessage"
      );
      const key = getSignalRConnectionKey(candidateBase, accountId);
      const cached = signalRHubConnections.get(key);
      if (cached) cached.lastUsedAt = Date.now();
      sendJson(res, 200, {
        success: true,
        source: "node-signalr",
        apiBase,
        resolvedApiBase: candidateBase,
        hubUrl: buildSignalRHubUrl(candidateBase, accountId),
        accountId,
        contactId,
        msgId: Number.isFinite(msgId) ? msgId : 0,
        failedAttempts: attempts
      });
      return;
    } catch (error) {
      attempts.push({
        apiBase: candidateBase,
        hubUrl: buildSignalRHubUrl(candidateBase, accountId),
        error: error.message
      });
    }
  }

  sendJson(res, 502, {
    success: false,
    message: "SignalR ConsumeMessage failed",
    error: attempts.map((item) => `${item.apiBase}: ${item.error}`).join("; "),
    apiBase,
    hubUrl: buildSignalRHubUrl(apiBase, accountId),
    accountId,
    contactId,
    msgId: Number.isFinite(msgId) ? msgId : 0,
    attempts
  });
}

function getTargetBase(reqUrl) {
  const parsed = new URL(reqUrl, `http://localhost:${PORT}`);
  const base = parsed.searchParams.get("__target") || DEFAULT_API_BASE;
  parsed.searchParams.delete("__target");
  return { base: base.replace(/\/+$/, ""), search: parsed.search };
}

const PROXY_STRIPPED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "expect",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]);

function sanitizeProxyRequestHeaders(requestHeaders) {
  const headers = { ...requestHeaders };
  Object.keys(headers).forEach((key) => {
    if (PROXY_STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      delete headers[key];
    }
  });
  return headers;
}

function getAiChatCompletionsUrl(baseUrl) {
  const rawBase = String(baseUrl || DEFAULT_AI_BASE).trim().replace(/\/+$/, "");
  if (!rawBase) {
    throw new Error("AI base URL is empty");
  }
  const parsedBase = new URL(rawBase);
  if (/copilot\.tencent\.com$/i.test(parsedBase.hostname)) {
    if (/\/v2\/chat\/completions$/i.test(parsedBase.pathname)) return new URL(rawBase);
    if (/\/v2$/i.test(parsedBase.pathname)) return new URL(`${rawBase}/chat/completions`);
    return new URL(`${parsedBase.origin}/v2/chat/completions`);
  }
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

function normalizeAiBaseUrlForModels(value = "") {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : "";
}

function getAiModelsUrl(baseUrl) {
  const rawBase = normalizeAiBaseUrlForModels(baseUrl || DEFAULT_AI_BASE);
  if (!rawBase) throw new Error("AI base URL is empty");
  const parsedBase = new URL(rawBase);
  if (/copilot\.tencent\.com$/i.test(parsedBase.hostname)) {
    if (/\/v2\/models$/i.test(parsedBase.pathname)) return new URL(rawBase);
    if (/\/v2$/i.test(parsedBase.pathname)) return new URL(`${rawBase}/models`);
    return new URL(`${parsedBase.origin}/v2/models`);
  }
  if (/api\.deepseek\.com$/i.test(parsedBase.hostname)) {
    if (/\/models$/i.test(parsedBase.pathname)) return new URL(rawBase);
    if (/\/v1$/i.test(parsedBase.pathname)) return new URL(`${parsedBase.origin}/models`);
    return new URL(`${parsedBase.origin}/models`);
  }
  if (/\/models$/i.test(rawBase)) return new URL(rawBase);
  if (/\/v1$/i.test(rawBase)) return new URL(`${rawBase}/models`);
  return new URL(`${rawBase}/v1/models`);
}

function getProviderPresetById(providerId = "") {
  const key = String(providerId || "").trim();
  return (key && AI_PROVIDER_PRESETS[key]) || null;
}

function findProviderByBaseUrl(baseUrl = "") {
  const normalized = normalizeAiBaseUrlForModels(baseUrl);
  if (!normalized) return null;
  return Object.entries(AI_PROVIDER_PRESETS).find(([, preset]) => (
    normalizeAiBaseUrlForModels(preset?.baseUrl) === normalized
  )) || null;
}

function getFallbackAiModels({ providerId = "", baseUrl = "" } = {}) {
  const preset = getProviderPresetById(providerId) || findProviderByBaseUrl(baseUrl)?.[1] || {};
  const options = Array.isArray(preset.modelOptions) ? preset.modelOptions : [];
  const deduped = [];
  options.forEach((item) => {
    const model = String(item || "").trim();
    if (model && !deduped.includes(model)) deduped.push(model);
  });
  if (!deduped.length && preset.model) deduped.push(String(preset.model));
  return deduped;
}

async function probeCodeBuddyModels({ apiKey, authType, baseUrl, providerId }) {
  const fallbackModels = getFallbackAiModels({ providerId, baseUrl });
  const target = getAiChatCompletionsUrl(baseUrl).toString();
  const models = [];
  const warnings = [];

  for (const model of fallbackModels) {
    try {
      const upstream = await fetchWithTimeout(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAiAuthHeaders(apiKey, authType, target)
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "ping" }],
          stream: true,
          max_tokens: 8
        })
      }, Math.min(AI_PROXY_TIMEOUT_MS, 30000), `CodeBuddy model probe: ${model}`);
      const text = await upstream.text();
      if (upstream.ok && /data:\s*\{/.test(text)) {
        models.push(model);
      } else {
        warnings.push(`${model}: ${trimCaptureText(text, 180) || `HTTP ${upstream.status}`}`);
      }
    } catch (error) {
      warnings.push(`${model}: ${error.message}`);
    }
  }

  return {
    target,
    models,
    fallbackModels,
    warning: warnings.join(" | ")
  };
}

function extractModelIds(payload) {
  if (!payload) return [];
  const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const ids = [];
  list.forEach((item) => {
    const model = String(item?.id || item?.model || item?.name || "").trim();
    if (model && !ids.includes(model)) ids.push(model);
  });
  return ids;
}

function handleAiProvidersConfig(_req, res) {
  sendJson(res, 200, {
    success: true,
    defaultProvider: DEFAULT_AI_PROVIDER,
    providers: AI_PROVIDER_PRESETS
  });
}

function getAiAuthHeaders(apiKey, authType, targetUrl) {
  if (normalizeAiAuthType(authType, targetUrl) === "x-api-key") {
    return { "X-Api-Key": apiKey };
  }
  return { Authorization: `Bearer ${apiKey}` };
}

function isCodeBuddyTarget(targetUrl) {
  try {
    const hostname = new URL(String(targetUrl || "")).hostname;
    return /copilot\.tencent\.com$/i.test(hostname) || /codebuddy/i.test(hostname);
  } catch {
    return false;
  }
}

function convertCodeBuddyStreamToJson(text, model = "") {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const chunks = [];
  let done = false;
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (!payload) continue;
    if (payload === "[DONE]") {
      done = true;
      continue;
    }
    try {
      const parsed = JSON.parse(payload);
      const content = parsed?.choices?.[0]?.delta?.content ?? parsed?.choices?.[0]?.message?.content ?? "";
      if (content) chunks.push(content);
    } catch {
      // Ignore malformed stream fragments and keep parsing.
    }
  }
  const message = chunks.join("");
  return {
    id: `codebuddy-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: model || "codebuddy",
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: message },
        finish_reason: done ? "stop" : "unknown"
      }
    ]
  };
}

async function proxyApi(req, res) {
  const apiPath = req.url.replace(/^\/api/, "");
  const { base, search } = getTargetBase(req.url);
  const cleanedPath = apiPath.split("?")[0] || "/";
  const baseCandidates = getApiBaseCandidates(base);
  const body = await readBody(req);
  const started = Date.now();

  const headers = sanitizeProxyRequestHeaders(req.headers);

  const options = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : body
  };

  const failedAttempts = [];
  try {
    let upstream = null;
    let targetUrl = null;
    for (const candidateBase of baseCandidates) {
      targetUrl = new URL(`${candidateBase}${cleanedPath}${search}`);
      try {
        upstream = await fetchWithTimeout(targetUrl, options, API_PROXY_TIMEOUT_MS, "YouChat API proxy");
        break;
      } catch (error) {
        failedAttempts.push({
          target: targetUrl.toString(),
          error: error.cause?.message || error.message
        });
      }
    }
    if (!upstream || !targetUrl) {
      throw new Error(failedAttempts.map((item) => `${item.target}: ${item.error}`).join("; ") || "YouChat API proxy failed");
    }
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
      failedAttempts,
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
      target: baseCandidates.map((candidateBase) => `${candidateBase}${cleanedPath}${search}`).join(" | "),
      status: 502,
      ms: Date.now() - started,
      failedAttempts,
      requestBody: decodeCaptureBody(body, headers["content-type"] || headers["Content-Type"] || ""),
      error: error.cause?.message || error.message
    });
    sendJson(res, 502, {
      success: false,
      message: "Proxy request failed",
      target: baseCandidates.map((candidateBase) => `${candidateBase}${cleanedPath}${search}`),
      error: error.cause?.message || error.message,
      failedAttempts
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
  if (isCodeBuddyTarget(targetUrl.toString())) payload.stream = true;

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
    const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
    if (isCodeBuddyTarget(targetUrl.toString()) && /text\/event-stream|stream/i.test(contentType)) {
      const converted = convertCodeBuddyStreamToJson(text, payload.model);
      res.writeHead(upstream.status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
      });
      res.end(JSON.stringify(converted));
      return;
    }
    res.writeHead(upstream.status, {
      "Content-Type": contentType,
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

async function handleAiModels(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, {
      success: false,
      message: "AI models endpoint only supports POST"
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

  const providerId = String(incoming.providerId || "").trim();
  const apiKey = String(incoming.apiKey || "").trim();
  const baseUrl = String(incoming.baseUrl || "").trim();
  const authType = normalizeAiAuthType(incoming.authType, baseUrl);
  const fallbackModels = getFallbackAiModels({ providerId, baseUrl });

  if (!apiKey) {
    sendJson(res, 200, {
      success: true,
      providerId,
      baseUrl,
      source: fallbackModels.length ? "fallback-no-key" : "empty-no-key",
      models: fallbackModels
    });
    return;
  }

  let targetUrl;
  try {
    targetUrl = getAiModelsUrl(baseUrl);
  } catch (error) {
    sendJson(res, 200, {
      success: true,
      providerId,
      baseUrl,
      source: fallbackModels.length ? "fallback-invalid-url" : "empty-invalid-url",
      models: fallbackModels,
      warning: error.message
    });
    return;
  }

  if (providerId === "codebuddy" || isCodeBuddyTarget(baseUrl)) {
    try {
      const probe = await probeCodeBuddyModels({ apiKey, authType, baseUrl, providerId });
      sendJson(res, 200, {
        success: true,
        providerId,
        baseUrl,
        target: probe.target,
        source: probe.models.length ? "probe" : "fallback-probe",
        models: probe.models.length ? probe.models : probe.fallbackModels,
        warning: probe.models.length ? "" : probe.warning
      });
    } catch (error) {
      sendJson(res, 200, {
        success: true,
        providerId,
        baseUrl,
        source: fallbackModels.length ? "fallback-probe-error" : "empty-probe-error",
        models: fallbackModels,
        warning: error.message
      });
    }
    return;
  }

  try {
    const upstream = await fetchWithTimeout(targetUrl, {
      method: "GET",
      headers: {
        ...getAiAuthHeaders(apiKey, authType, targetUrl.toString())
      }
    }, Math.min(AI_PROXY_TIMEOUT_MS, 30000), "AI models");
    const text = await upstream.text();
    const parsed = parseMaybeJson(text);
    const models = extractModelIds(parsed);
    if (!upstream.ok || !models.length) {
      sendJson(res, 200, {
        success: true,
        providerId,
        baseUrl,
        target: targetUrl.toString(),
        source: fallbackModels.length ? "fallback-upstream" : "empty-upstream",
        models: fallbackModels,
        warning: models.length ? "" : getMessage(parsed) || `HTTP ${upstream.status}`
      });
      return;
    }
    sendJson(res, 200, {
      success: true,
      providerId,
      baseUrl,
      target: targetUrl.toString(),
      source: "upstream",
      models
    });
  } catch (error) {
    sendJson(res, 200, {
      success: true,
      providerId,
      baseUrl,
      source: fallbackModels.length ? "fallback-error" : "empty-error",
      models: fallbackModels,
      warning: error.message
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

  if (req.url.startsWith("/ai/models")) {
    await handleAiModels(req, res);
    return;
  }

  if (req.url.startsWith("/ai/providers")) {
    handleAiProvidersConfig(req, res);
    return;
  }

  if (req.url.startsWith("/local/reply-skills/learn")) {
    await handleReplySkillLearn(req, res);
    return;
  }

  if (req.url.startsWith("/local/fnos/")) {
    await handleFnOSDatabase(req, res);
    return;
  }

  if (req.url.startsWith("/local/client-options/save")) {
    await handleClientOptionsSave(req, res);
    return;
  }

  if (req.url.startsWith("/local/skill-training")) {
    await handleSkillTraining(req, res);
    return;
  }

  if (req.url.startsWith("/local/promptworks/import-training")) {
    await handlePromptWorksImportTraining(req, res);
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
      aiProvider: DEFAULT_AI_PROVIDER,
      promptWorksApiBase: PROMPTWORKS_API_BASE,
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

function startDatabaseGuard() {
  if (!DATABASE_GUARD_ENABLED) {
    console.log("Database guard: disabled");
    return;
  }
  console.log(`Database guard: checking every ${Math.round(DATABASE_GUARD_INTERVAL_MS / 60000)} minute(s)`);
  setTimeout(() => runDatabaseGuardCheck("startup"), 15000);
  setInterval(() => runDatabaseGuardCheck("timer"), DATABASE_GUARD_INTERVAL_MS);
}

server.listen(PORT, () => {
  console.log(`YouChat dev web: http://localhost:${PORT}`);
  console.log(`Proxy target: ${DEFAULT_API_BASE}`);
  startDatabaseGuard();
});

process.on("SIGINT", () => {
  stopSignalRHubConnections().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  stopSignalRHubConnections().finally(() => process.exit(0));
});

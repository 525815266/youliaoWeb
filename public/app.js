const DEFAULT_API_BASE = "http://192.168.9.83:18080/api";
const LEGACY_DEFAULT_API_BASES = new Set([
  "https://im.52youzai.com/api",
  "http://127.0.0.1:8080/api",
  "http://localhost:8080/api"
]);
const DEFAULT_AI_BASE_URL = "https://sub2.sn55.cn/";
// AI keys never live in frontend source (this repo is public). The real keys
// stay in gitignored config/ai-providers.json and are injected server-side by
// proxyAi/handleAiModels when the browser sends an empty key. Leave blank.
const DEFAULT_AI_API_KEY = "";
const DEFAULT_AI_MODEL = "gpt-5.4-mini";
const DEFAULT_AI_TEMPERATURE = 0.35;
const DEFAULT_AI_AUTH_TYPE = "bearer";
const AI_PROVIDER_STORAGE_KEY = "youchat.ai.provider";
const AI_PROVIDER_SETTINGS_STORAGE_KEY = "youchat.ai.providers";
const DEFAULT_AI_PROVIDER = "sub2";
const API_REQUEST_TIMEOUT_MS = 45000;
const IMAGE_UPLOAD_TIMEOUT_MS = 20000;
const LOCAL_IMAGE_UPLOAD_TIMEOUT_MS = 12000;
const MAX_UPLOAD_IMAGE_EDGE = 1600;
const MAX_UPLOAD_IMAGE_BYTES = 900 * 1024;
const IMAGE_UPLOAD_JPEG_QUALITY = 0.86;
const POST_SEND_REFRESH_DELAY_MS = 80;
const SIGNALR_KEEP_ALIVE_MS = 120000;
const SIGNALR_START_TIMEOUT_MS = 12000;
const AI_PRESETS = {
  sub2: {
    label: "sub2 中转",
    baseUrl: DEFAULT_AI_BASE_URL,
    apiKey: DEFAULT_AI_API_KEY,
    model: DEFAULT_AI_MODEL,
    authType: "bearer",
    temperature: DEFAULT_AI_TEMPERATURE,
    modelOptions: ["gpt-5.4-mini", "gpt-4.1", "gpt-4o-mini"]
  },
  deepseek: {
    label: "DeepSeek 官方",
    baseUrl: "https://api.deepseek.com",
    apiKey: "",
    model: "deepseek-v4-flash",
    authType: "bearer",
    temperature: DEFAULT_AI_TEMPERATURE,
    modelOptions: ["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat", "deepseek-reasoner"]
  },
  codebuddy: {
    label: "CodeBuddy",
    baseUrl: "https://copilot.tencent.com/v2",
    apiKey: "",
    model: "deepseek-v3.1",
    authType: "x-api-key",
    temperature: DEFAULT_AI_TEMPERATURE,
    modelOptions: ["deepseek-v3.1", "deepseek-r1"]
  }
};
const ONLINE_SERVICE_URL = "https://work.weixin.qq.com/kfid/kfcac6535078c49e290";

const ORDER_DEVICE_TYPES = [
  { value: 0, label: "个微" },
  { value: 1, label: "企微" },
  { value: 2, label: "公众号" },
  { value: 3, label: "新公众号" }
];

const ORDER_TYPES = [
  { value: 0, label: "淘宝" },
  { value: 1, label: "京东" },
  { value: 2, label: "拼多多" },
  { value: 3, label: "唯品会" },
  { value: 4, label: "美团" },
  { value: 5, label: "饿了么" },
  { value: 11, label: "抖音" },
  { value: 12, label: "快手" }
];

const SKILL_CATEGORY_CURRENT = "__current__";
const SKILL_CATEGORY_ALL = "__all__";
const SKILL_CATEGORY_UNCATEGORIZED = "__uncategorized__";
const SKILL_PLATFORM_DEFS = [
  {
    key: "taobao",
    label: "淘宝/天猫",
    aliases: ["淘宝", "天猫", "taobao", "tmall", "alicdn", "tbopen"],
    orderPatterns: [/^\d{16,20}$/]
  },
  {
    key: "jd",
    label: "京东",
    aliases: ["京东", "jd", "jdmobile", "openapp.jdmobile"],
    orderPatterns: [/^\d{10,20}$/]
  },
  {
    key: "pdd",
    label: "拼多多",
    aliases: ["拼多多", "pdd", "多多", "yangkeduo", "pinduoduo"],
    orderPatterns: [/^\d{8}-\d{4,}$/]
  },
  {
    key: "vip",
    label: "唯品会",
    aliases: ["唯品会", "vipshop", "vip.com"],
    orderPatterns: []
  },
  {
    key: "meituan",
    label: "美团",
    aliases: ["美团", "meituan", "大众点评"],
    orderPatterns: []
  },
  {
    key: "eleme",
    label: "饿了么",
    aliases: ["饿了么", "eleme", "ele.me"],
    orderPatterns: []
  },
  {
    key: "douyin",
    label: "抖音",
    aliases: ["抖音", "抖店", "抖音小店", "douyin", "iesdouyin", "aweme"],
    orderPatterns: [/^5\d{18}$/]
  },
  {
    key: "kuaishou",
    label: "快手",
    aliases: ["快手", "kuaishou", "kwai", "gifshow"],
    orderPatterns: []
  }
];
const SKILL_INTENT_DEFS = [
  {
    key: "order_missing",
    label: "订单查不到",
    keywords: ["查不到", "查不出", "没返利", "无返利", "没成功", "订单没有", "不提示", "没绑定", "怎么没绑定"]
  },
  {
    key: "order_waiting",
    label: "下单后没提示",
    keywords: ["还没提示", "怎么还没提示", "还没显示", "怎么还没显示", "没等到订单", "还没跟单", "查了没有", "订单还没出", "怎么还没出"]
  },
  {
    key: "bind_failed",
    label: "绑定失败",
    keywords: ["绑定失败", "绑定不了", "怎么绑定", "未绑定", "绑定方法", "支付宝账号", "绑定支付宝"]
  },
  {
    key: "withdraw_query",
    label: "提现相关",
    keywords: ["提现", "提取", "怎么提现", "可以提现吗", "余额提现", "提现入口", "提现多久到账", "提现审核", "提现到支付宝"]
  },
  {
    key: "rebate_status",
    label: "返利状态",
    keywords: ["什么时候到账", "多久到账", "待返利", "已返利", "返利", "到账没", "到帐没"]
  },
  {
    key: "manual_service",
    label: "转人工",
    keywords: ["在线客服", "联系客服", "人工客服", "客服链接", "客服在哪"]
  },
  {
    key: "general",
    label: "通用",
    keywords: []
  }
];
const ORDER_TYPE_PLATFORM_KEYS = {
  0: "taobao",
  1: "jd",
  2: "pdd",
  3: "vip",
  4: "meituan",
  5: "eleme",
  11: "douyin",
  12: "kuaishou"
};
const SKILL_PLATFORM_LOOKUP = new Map(SKILL_PLATFORM_DEFS.map((item) => [item.key, item]));
const SKILL_INTENT_LOOKUP = new Map(SKILL_INTENT_DEFS.map((item) => [item.key, item]));

const DEFAULT_FAQ_CATEGORIES = [
  { value: "", label: "常用" },
  { value: "", label: "订单问题" },
  { value: "", label: "邀请问题" },
  { value: "", label: "老用户留存" }
];

const FRIEND_STATUS_OPTIONS = [
  { value: "", label: "未处理" },
  { value: "1", label: "已通过" },
  { value: "2", label: "已忽略" },
  { value: "3", label: "未通过" },
  { value: "4", label: "添加失败" }
];

const FRIEND_SOURCE_OPTIONS = [
  { value: "", label: "全部来源" },
  { value: "1", label: "QQ号搜索" },
  { value: "3", label: "搜索微信号" },
  { value: "17", label: "微信卡片" },
  { value: "14", label: "群聊" },
  { value: "30", label: "扫描二维码" }
];
const FRIEND_ALL_SOURCE_VALUES = FRIEND_SOURCE_OPTIONS.map((item) => item.value).filter(Boolean);
const FRIEND_AGGREGATE_SOURCE_PAGE_SIZE = 50;

const KNOWN_SITE_LOGOS = [
  { name: "小红书", label: "小红书", domains: ["xiaohongshu.com", "xhslink.com"], logoUrl: "https://www.xiaohongshu.com/favicon.ico", bg: "#ff2442", fg: "#ffffff" },
  { name: "快手", label: "快手", domains: ["kuaishou.com", "gifshow.com", "ksurl.cn", "kwai.com"], logoUrl: "https://www.kuaishou.com/favicon.ico", bg: "#ff5c00", fg: "#ffffff" },
  { name: "1688", label: "1688", domains: ["1688.com"], logoUrl: "https://www.1688.com/favicon.ico", bg: "#ff6a00", fg: "#ffffff" },
  { name: "得物", label: "得物", domains: ["dewu.com", "poizon.com"], logoUrl: "https://www.dewu.com/favicon.ico", bg: "#111827", fg: "#ffffff" },
  { name: "淘宝", label: "淘宝", domains: ["taobao.com"], logoUrl: "https://www.taobao.com/favicon.ico", bg: "#ff5000", fg: "#ffffff" },
  { name: "天猫", label: "天猫", domains: ["tmall.com"], logoUrl: "https://www.tmall.com/favicon.ico", bg: "#dd2727", fg: "#ffffff" },
  { name: "京东", label: "京东", domains: ["jd.com", "jd.hk"], logoUrl: "https://www.jd.com/favicon.ico", bg: "#e1251b", fg: "#ffffff" },
  { name: "拼多多", label: "拼多多", domains: ["pinduoduo.com", "yangkeduo.com"], logoUrl: "https://www.pinduoduo.com/favicon.ico", bg: "#e02e24", fg: "#ffffff" },
  { name: "抖音", label: "抖音", domains: ["douyin.com", "iesdouyin.com"], logoUrl: "https://www.douyin.com/favicon.ico", bg: "#111111", fg: "#ffffff" },
  { name: "Bilibili", label: "B站", domains: ["bilibili.com", "b23.tv"], logoUrl: "https://www.bilibili.com/favicon.ico", bg: "#00a1d6", fg: "#ffffff" },
  { name: "微博", label: "微博", domains: ["weibo.com", "weibo.cn"], logoUrl: "https://weibo.com/favicon.ico", bg: "#ff8200", fg: "#ffffff" },
  { name: "知乎", label: "知乎", domains: ["zhihu.com"], logoUrl: "https://www.zhihu.com/favicon.ico", bg: "#0066ff", fg: "#ffffff" },
  { name: "美团", label: "美团", domains: ["meituan.com", "dianping.com"], logoUrl: "https://www.meituan.com/favicon.ico", bg: "#ffd100", fg: "#222222" },
  { name: "饿了么", label: "饿了么", domains: ["ele.me", "eleme.cn"], logoUrl: "https://www.ele.me/favicon.ico", bg: "#0089dc", fg: "#ffffff" }
];
const knownSiteLogoCache = {};
const APP_DEEP_LINK_PROFILES = [
  { name: "微视", label: "微视", schemes: ["weishi"], bg: "#1677ff", fg: "#ffffff", mediaKind: "video", status: "视频深链" },
  { name: "微信", label: "微信", schemes: ["weixin", "wx"], bg: "#21bf60", fg: "#ffffff", status: "应用深链" },
  { name: "企业微信", label: "企微", schemes: ["wxwork"], bg: "#168df2", fg: "#ffffff", status: "应用深链" },
  { name: "小红书", label: "小红书", schemes: ["xhsdiscover", "xhs"], bg: "#ff2442", fg: "#ffffff", status: "应用深链" },
  { name: "快手", label: "快手", schemes: ["kwai", "kuaishou"], bg: "#ff5c00", fg: "#ffffff", mediaKind: "video", status: "视频深链" },
  { name: "抖音", label: "抖音", schemes: ["snssdk1128", "aweme"], bg: "#111111", fg: "#ffffff", mediaKind: "video", status: "视频深链" },
  { name: "淘宝", label: "淘宝", schemes: ["tbopen", "taobao"], bg: "#ff5000", fg: "#ffffff", status: "应用深链" },
  { name: "天猫", label: "天猫", schemes: ["tmall"], bg: "#dd2727", fg: "#ffffff", status: "应用深链" },
  { name: "京东", label: "京东", schemes: ["openapp.jdmobile", "jdlogin"], bg: "#e1251b", fg: "#ffffff", status: "应用深链" },
  { name: "拼多多", label: "拼多多", schemes: ["pinduoduo"], bg: "#e02e24", fg: "#ffffff", status: "应用深链" },
  { name: "得物", label: "得物", schemes: ["dewuapp"], bg: "#111827", fg: "#ffffff", status: "应用深链" },
  { name: "美团", label: "美团", schemes: ["imeituan"], bg: "#ffd100", fg: "#222222", status: "应用深链" },
  { name: "饿了么", label: "饿了么", schemes: ["eleme"], bg: "#0089dc", fg: "#ffffff", status: "应用深链" }
];

const MESSAGE_PAGE_SIZE = 30;
const CONTACT_LIST_PAGE_SIZE = 80;
const CONTACT_LIST_AUTOLOAD_THRESHOLD = 140;
const CONTACT_LIST_HISTORY_AUTOLOAD_THRESHOLD = 220;
const HISTORY_PAGE_SIZE = 20;
const DETAIL_PAGE_SIZE = 20;
const READ_STATE_STORAGE_KEY = "youchat.readContactState";
const CLEARED_CONTACTS_STORAGE_KEY = "youchat.clearedContactState";
const CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY = "youchat.contactListAccountIds";
const CLIENT_PAUSED_STORAGE_KEY = "youchat.client.paused";
const SEND_MODE_STORAGE_KEY = "youchat.composer.sendMode";
const INSIGHT_DISMISS_STORAGE_KEY = "youchat.ai.insightDismissals";
const READ_STATE_GRACE_MS = 30000;
const CLEAR_LIST_GRACE_MS = 30000;
const APPLIED_SUGGESTION_TTL_MS = 10 * 60 * 1000;
const INSIGHT_DISMISS_TTL_MS = 3 * 24 * 60 * 60 * 1000;
const WITHDRAW_REFUND_LOOKBACK_MS = 3 * 24 * 60 * 60 * 1000;
const WITHDRAW_REFUND_MIN_COUNT = 3;
const WITHDRAW_REFUND_SCAN_PAGE_SIZE = 50;
const WITHDRAW_REFUND_MAX_SCAN_PAGES = 6;
const WITHDRAW_REFUND_CACHE_MS = 90 * 1000;
const CONTACT_LIST_ACCOUNT_ID_PATTERN = /^[1-9]\d{0,9}$/;
const GLOBAL_SEARCH_PAGE_SIZE = 20;
const CLIENT_NOTICE_PAGE_SIZE = 20;
const DATABASE_DELETE_CONFIRM_TEXT = "我已知晓删除的聊天记录无法恢复";
const CLIENT_OPTIONS_SAVE_ENDPOINT = "/local/client-options/save";
const DATABASE_GUARD_STATUS_ENDPOINT = "/local/fnos/guard";
const CONTACT_AVATAR_FIELDS = [
  "avatar",
  "headImg",
  "headImgUrl",
  "headimgurl",
  "headimg",
  "headUrl",
  "avatarUrl",
  "userAvatar",
  "photo",
  "portrait",
  "faceUrl"
];
const EMOJI_DEFS = [
  { token: "[微笑]", label: "微笑", style: "smiley_0", x: -37.125, y: -37.125 },
  { token: "[撇嘴]", label: "撇嘴", style: "smiley_1", x: -185.625, y: -167.063 },
  { token: "[色]", label: "色", style: "smiley_2", x: -74.25, y: -55.688 },
  { token: "[发呆]", label: "发呆", style: "smiley_3", x: -92.813, y: -74.25 },
  { token: "[得意]", label: "得意", style: "smiley_4", x: -129.938, y: 0 },
  { token: "[流泪]", label: "流泪", style: "smiley_5", x: -55.688, y: -129.938 },
  { token: "[害羞]", label: "害羞", style: "smiley_6", x: -148.5, y: -55.688 },
  { token: "[闭嘴]", label: "闭嘴", style: "smiley_7", x: -92.813, y: -148.5 },
  { token: "[睡]", label: "睡", style: "smiley_8", x: -167.063, y: -55.688 },
  { token: "[大哭]", label: "大哭", style: "smiley_9", x: -37.125, y: -167.063 },
  { token: "[尴尬]", label: "尴尬", style: "smiley_10", x: -55.688, y: -18.563 },
  { token: "[发怒]", label: "发怒", style: "smiley_11", x: -55.688, y: -37.125 },
  { token: "[调皮]", label: "调皮", style: "smiley_12", x: 0, y: -55.688 },
  { token: "[呲牙]", label: "呲牙", style: "smiley_13", x: -18.563, y: -55.688 },
  { token: "[惊讶]", label: "惊讶", style: "smiley_14", x: -37.125, y: -55.688 },
  { token: "[难过]", label: "难过", style: "smiley_15", x: -55.688, y: -55.688 },
  { token: "[冷汗]", label: "冷汗", style: "smiley_17", x: -74.25, y: 0 },
  { token: "[抓狂]", label: "抓狂", style: "smiley_18", x: -74.25, y: -18.563 },
  { token: "[吐]", label: "吐", style: "smiley_19", x: -74.25, y: -37.125 },
  { token: "[偷笑]", label: "偷笑", style: "smiley_20", x: 0, y: -74.25 },
  { token: "[愉快]", label: "愉快", style: "smiley_21", x: -18.563, y: -74.25 },
  { token: "[白眼]", label: "白眼", style: "smiley_22", x: -37.125, y: -74.25 },
  { token: "[傲慢]", label: "傲慢", style: "smiley_23", x: -55.688, y: -74.25 },
  { token: "[困]", label: "困", style: "smiley_25", x: -74.25, y: -74.25 },
  { token: "[流汗]", label: "流汗", style: "smiley_27", x: -92.813, y: -18.563 },
  { token: "[憨笑]", label: "憨笑", style: "smiley_28", x: -92.813, y: -37.125 },
  { token: "[悠闲]", label: "悠闲", style: "smiley_29", x: -92.813, y: -55.688 },
  { token: "[奋斗]", label: "奋斗", style: "smiley_30", x: 0, y: -92.813 },
  { token: "[咒骂]", label: "咒骂", style: "smiley_31", x: -18.563, y: -92.813 },
  { token: "[疑问]", label: "疑问", style: "smiley_32", x: -111.375, y: -55.688 },
  { token: "[嘘]", label: "嘘", style: "smiley_33", x: -18.563, y: -111.375 },
  { token: "[晕]", label: "晕", style: "smiley_34", x: -37.125, y: -111.375 },
  { token: "[衰]", label: "衰", style: "smiley_36", x: -55.688, y: -111.375 },
  { token: "[骷髅]", label: "骷髅", style: "smiley_37", x: -74.25, y: -111.375 },
  { token: "[敲打]", label: "敲打", style: "smiley_38", x: -92.813, y: -111.375 },
  { token: "[再见]", label: "再见", style: "smiley_39", x: -111.375, y: -111.375 },
  { token: "[擦汗]", label: "擦汗", style: "smiley_40", x: -129.938, y: -18.563 },
  { token: "[抠鼻]", label: "抠鼻", style: "smiley_41", x: -129.938, y: -37.125 },
  { token: "[鼓掌]", label: "鼓掌", style: "smiley_42", x: -129.938, y: -55.688 },
  { token: "[坏笑]", label: "坏笑", style: "smiley_44", x: -129.938, y: -74.25 },
  { token: "[左哼哼]", label: "左哼哼", style: "smiley_45", x: -129.938, y: -92.813 },
  { token: "[鄙视]", label: "鄙视", style: "smiley_48", x: -18.563, y: -129.938 },
  { token: "[委屈]", label: "委屈", style: "smiley_49", x: -37.125, y: -129.938 },
  { token: "[快哭了]", label: "快哭了", style: "smiley_50", x: -74.25, y: -129.938 },
  { token: "[阴险]", label: "阴险", style: "smiley_51", x: -92.813, y: -129.938 },
  { token: "[亲亲]", label: "亲亲", style: "smiley_52", x: -111.375, y: -129.938 },
  { token: "[可怜]", label: "可怜", style: "smiley_54", x: -129.938, y: -129.938 },
  { token: "[西瓜]", label: "西瓜", style: "smiley_56", x: -148.5, y: -18.563 },
  { token: "[啤酒]", label: "啤酒", style: "smiley_57", x: -148.5, y: -37.125 },
  { token: "[咖啡]", label: "咖啡", style: "smiley_60", x: -148.5, y: -74.25 },
  { token: "[饭]", label: "饭", style: "smiley_61", x: -148.5, y: -92.813 },
  { token: "[猪头]", label: "猪头", style: "smiley_62", x: -148.5, y: -111.375 },
  { token: "[玫瑰]", label: "玫瑰", style: "smiley_63", x: -148.5, y: -129.938 },
  { token: "[嘴唇]", label: "嘴唇", style: "smiley_65", x: -18.563, y: -148.5 },
  { token: "[爱心]", label: "爱心", style: "smiley_66", x: -37.125, y: -148.5 },
  { token: "[心碎]", label: "心碎", style: "smiley_67", x: -55.688, y: -148.5 },
  { token: "[蛋糕]", label: "蛋糕", style: "smiley_68", x: -74.25, y: -148.5 },
  { token: "[炸弹]", label: "炸弹", style: "smiley_70", x: -111.375, y: -148.5 },
  { token: "[便便]", label: "便便", style: "smiley_74", x: -129.938, y: -148.5 },
  { token: "[月亮]", label: "月亮", style: "smiley_75", x: -148.5, y: -148.5 },
  { token: "[拥抱]", label: "拥抱", style: "smiley_78", x: -167.063, y: -18.563 },
  { token: "[强]", label: "强", style: "smiley_79", x: -167.063, y: -37.125 },
  { token: "[弱]", label: "弱", style: "smiley_80", x: -167.063, y: -74.25 },
  { token: "[握手]", label: "握手", style: "smiley_81", x: -167.063, y: -92.813 },
  { token: "[胜利]", label: "胜利", style: "smiley_82", x: -167.063, y: -111.375 },
  { token: "[抱拳]", label: "抱拳", style: "smiley_83", x: -167.063, y: -129.938 },
  { token: "[勾引]", label: "勾引", style: "smiley_84", x: -167.063, y: -148.5 },
  { token: "[OK]", label: "OK", style: "smiley_89", x: -18.563, y: -167.063 },
  { token: "[跳跳]", label: "跳跳", style: "smiley_92", x: -55.688, y: -167.063 },
  { token: "[发抖]", label: "发抖", style: "smiley_93", x: -74.25, y: -167.063 },
  { token: "[怄火]", label: "怄火", style: "smiley_94", x: -92.813, y: -167.063 },
  { token: "[转圈]", label: "转圈", style: "smiley_95", x: -111.375, y: -167.063 },
  { token: "[嘿哈]", label: "嘿哈", style: "e2_04", x: -129.938, y: -111.375 },
  { token: "[奸笑]", label: "奸笑", style: "e2_02", x: -18.563, y: 0 },
  { token: "[捂脸]", label: "捂脸", style: "e2_05", x: 0, y: -18.563 },
  { token: "[机智]", label: "机智", style: "e2_06", x: -18.563, y: -18.563 },
  { token: "[耶]", label: "耶", style: "e2_11", x: -37.125, y: -18.563 },
  { token: "[红包]", label: "红包", style: "e2_09", x: -37.125, y: 0 },
  { token: "[皱眉]", label: "皱眉", style: "e2_12", x: 0, y: -37.125 },
  { token: "[鸡]", label: "鸡", style: "e2_14", x: -18.563, y: -37.125 },
  { token: "[笑脸]", label: "笑脸", style: "u1F604", x: -185.625, y: -37.125 },
  { token: "[生病]", label: "生病", style: "u1F637", x: -55.688, y: 0 },
  { token: "[破涕为笑]", label: "破涕为笑", style: "u1F602", x: -185.625, y: -18.563 },
  { token: "[吐舌]", label: "吐舌", style: "u1F61D", x: -185.625, y: -92.813 },
  { token: "[脸红]", label: "脸红", style: "u1F633", x: -185.625, y: -129.938 },
  { token: "[恐惧]", label: "恐惧", style: "u1F631", x: -185.625, y: -111.375 },
  { token: "[失望]", label: "失望", style: "u1F614", x: -185.625, y: -74.25 },
  { token: "[无语]", label: "无语", style: "u1F612", x: -185.625, y: -55.688 },
  { token: "[鬼魂]", label: "鬼魂", style: "u1F47B", x: -167.063, y: -167.063 },
  { token: "[合十]", label: "合十", style: "u1F64F", x: -185.625, y: -148.5 },
  { token: "[庆祝]", label: "庆祝", style: "u1F389", x: -148.5, y: -167.063 },
  { token: "[礼物]", label: "礼物", style: "u1F381", x: -129.938, y: -167.063 },
  { token: "[吃瓜]", label: "吃瓜", style: "smiley_313", x: -37.125, y: -92.813 },
  { token: "[加油]", label: "加油", style: "smiley_314", x: -55.688, y: -92.813 },
  { token: "[汗]", label: "汗", style: "smiley_315", x: -74.25, y: -92.813 },
  { token: "[天啊]", label: "天啊", style: "smiley_316", x: -92.813, y: -92.813 },
  { token: "[社会社会]", label: "社会社会", style: "smiley_318", x: -111.375, y: -18.563 },
  { token: "[旺柴]", label: "旺柴", style: "smiley_319", x: -111.375, y: -37.125 },
  { token: "[好的]", label: "好的", style: "smiley_320", x: -111.375, y: -74.25 },
  { token: "[打脸]", label: "打脸", style: "smiley_321", x: -111.375, y: -92.813 }
];
const EMOJI_SHORTCUTS = EMOJI_DEFS.map((item) => item.token);
const EMOJI_LOOKUP = new Map(EMOJI_DEFS.map((item) => [item.token, item]));
const EMOJI_TOKEN_PATTERN = new RegExp(`(${EMOJI_DEFS.map((item) => escapeRegex(item.token)).join("|")})`, "g");
const MOBILE_WORKBENCH_QUERY = "(max-width: 760px)";

const state = {
  apiBase: loadStoredApiBase(),
  token: localStorage.getItem("youchat.token") || sessionStorage.getItem("u-token") || "",
  account: localStorage.getItem("youchat.account") || "Boom666",
  accountId: localStorage.getItem("youchat.accountId") || "",
  contactListAccountIds: loadContactListAccountIds(),
  accountIdResolved: false,
  remember: localStorage.getItem("youchat.remember") !== "false",
  aiEnabled: localStorage.getItem("youchat.ai.enabled") !== "false",
  aiProvider: normalizeAiProviderId(localStorage.getItem(AI_PROVIDER_STORAGE_KEY) || DEFAULT_AI_PROVIDER),
  aiProvidersConfig: loadAiProviderSettings(),
  aiServerKeyProviders: {},
  aiBaseUrl: "",
  aiApiKey: "",
  aiModel: "",
  aiAuthType: DEFAULT_AI_AUTH_TYPE,
  aiTemperature: DEFAULT_AI_TEMPERATURE,
  aiModelOptions: [],
  aiFetchingModels: false,
  aiGenerating: false,
  aiSuggestion: null,
  aiSuggestions: [],
  aiSuggestionToneIndex: 0,
  aiOptimizeTimer: null,
  aiOptimizeKey: "",
  aiOptimizeAbort: null,
  aiAutoSuggestTimer: null,
  aiAutoSuggestInFlightKey: "",
  lastAutoAiSuggestionKey: "",
  lastSuggestionUsed: false,
  lastAppliedSuggestionFingerprint: "",
  lastAppliedSuggestionSkillId: "",
  lastAppliedSuggestionPromptKey: "",
  lastAppliedSuggestionContactId: "",
  lastAppliedSuggestionAt: 0,
  lastAppliedSuggestionPlatformKey: "",
  lastAppliedSuggestionIntentKey: "",
  lastSkillPromptKey: "",
  replySkills: [],
  replySkillsLoading: false,
  skillKeyword: "",
  skillCategory: SKILL_CATEGORY_CURRENT,
  skillAutoReply: localStorage.getItem("youchat.skill.autoReply") === "true",
  skillAutoLearn: localStorage.getItem("youchat.skill.autoLearn") !== "false",
  skillAutoSending: false,
  sendingMessage: false,
  sendingStage: "",
  sendMode: normalizeSendMode(localStorage.getItem(SEND_MODE_STORAGE_KEY)),
  lastSkillAutoReplyKey: "",
  emojiOpen: false,
  recentEmojis: loadRecentEmojis(),
  draftImages: [],
  redPackTemplates: [],
  redPackTemplatesLoading: false,
  activeModal: null,
  listTab: "current",
  activeTool: "user",
  mobilePanel: "list",
  contacts: [],
  contactListPage: 1,
  contactListHasMore: false,
  contactListLoading: false,
  contactListAutoLoading: false,
  contactListKeyboardActive: false,
  clearedListUntil: {},
  clearedContactState: loadClearedContactState(),
  messages: [],
  messagePage: 1,
  messageHasMore: false,
  messageLoading: false,
  messageAutoLoading: false,
  messagesFromPreview: false,
  faqs: [],
  faqCategories: [],
  faqCategory: "",
  faqKeyword: "",
  faqPage: 1,
  faqTotal: 0,
  faqLoading: false,
  orders: [],
  orderDeviceType: 0,
  orderType: 0,
  orderKeyword: "",
  orderTotal: 0,
  orderPage: 1,
  orderContactId: null,
  hideRebate: false,
  contactInfo: null,
  contactInfoContactId: null,
  accountDetails: [],
  accountDetailsUserName: "",
  accountDetailTotal: 0,
  accountDetailPage: 1,
  historyMessages: [],
  historyContactId: null,
  historyPage: 1,
  historyTotal: 0,
  historyHasMore: false,
  historyLoading: false,
  historyAutoLoading: false,
  linkPreviewCache: {},
  activeLinkPreview: null,
  withdrawRisk: {
    contactId: "",
    loading: false,
    signal: null,
    dismissOpen: false,
    checkedAt: 0,
    error: ""
  },
  contactInsights: {},
  insightDismissals: loadInsightDismissals(),
  clientPaused: localStorage.getItem(CLIENT_PAUSED_STORAGE_KEY) === "true",
  clientOptions: null,
  clientOptionsLoading: false,
  redPointConfig: null,
  redPointConfigLoading: false,
  redPointConfigError: "",
  globalSearch: {
    keyword: "",
    contacts: "",
    robots: "",
    startTime: "",
    endTime: "",
    page: 1,
    total: 0,
    records: [],
    loading: false,
    error: ""
  },
  clientStats: {
    startTime: "",
    endTime: "",
    data: null,
    records: [],
    loading: false,
    error: ""
  },
  clientNotice: {
    page: 1,
    total: 0,
    unread: 0,
    msgType: "",
    warnType: "",
    eventType: "",
    startTime: "",
    endTime: "",
    records: [],
    events: [],
    loading: false,
    error: ""
  },
  databaseDelete: {
    startTime: "",
    endTime: "",
    confirmText: "",
    deleting: false
  },
  databaseRepair: {
    health: null,
    guard: null,
    loading: false,
    repairing: false,
    error: ""
  },
  activeContact: null,
  contextMenu: null,
  totalContacts: 0,
  listCounts: { current: 0, guestbook: 0, history: 0 },
  listServerCounts: { current: 0, guestbook: 0, history: 0 },
  listCountSources: { current: "", guestbook: "", history: "" },
  listUnreadCounts: { current: 0, guestbook: 0, history: 0 },
  pendingUnreadJumpTab: "",
  friendRequests: [],
  friendRequestTotal: 0,
  friendRequestBadgeTotal: 0,
  friendRequestPage: 1,
  friendRequestStatus: "",
  friendRequestKeyword: "",
  friendRequestRobot: "",
  friendRequestSource: "",
  friendSourceCounts: {},
  friendRequestDeviceType: 1,
  friendRequestLoading: false,
  friendRequestDialogOpen: false,
  apiStatus: "未连接",
  signalRConnection: null,
  signalRConnecting: null,
  signalRStatus: "idle",
  signalRUrl: "",
  readContactState: loadReadContactState(),
  logLines: []
};

const el = {};
let refreshTimer = null;
let scrollRequestId = 0;
let withdrawRiskScanTimer = null;
let withdrawRiskScanToken = 0;
let aiSettingsSnapshot = null;
const scrollRequestIds = new WeakMap();

function $(id) {
  return document.getElementById(id);
}

function boot() {
  [
    "loginView",
    "workbenchView",
    "loginForm",
    "username",
    "password",
    "serverAddress",
    "serverPort",
    "rememberAccount",
    "connectButton",
    "togglePassword",
    "backStep",
    "versionNote",
    "returnLogin",
    "clientBackendButton",
    "clientGlobalSearchButton",
    "clientStatsButton",
    "clientNoticeButton",
    "clientNoticeBadge",
    "clientSettingsButton",
    "clientSettingsMenu",
    "clientPauseMenuText",
    "aiSettingsButton",
    "aiSettingsOverlay",
    "aiSettingsPanel",
    "closeAiSettings",
    "aiEnabled",
    "skillAutoReply",
    "skillAutoLearn",
    "aiProvider",
    "aiBaseUrl",
    "aiApiKey",
    "aiModel",
    "aiModelCustom",
    "fetchAiModels",
    "aiAuthType",
    "aiTemperature",
    "resetAiSettings",
    "connectionState",
    "operatorName",
    "conversationCount",
    "friendRequests",
    "friendRequestBadge",
    "refreshContacts",
    "search",
    "contactList",
    "activeAvatar",
    "activeTitle",
    "activeMeta",
    "mobileBackToList",
    "mobileOpenTools",
    "mobileBackToChat",
    "toolDrawerScrim",
    "messageList",
    "replyText",
    "refreshMessages",
    "aiSuggestionCard",
    "aiSuggestionTitle",
    "aiSuggestionText",
    "applyAiSuggestion",
    "sendAiSuggestion",
    "refreshAiSuggestion",
    "closeAiSuggestion",
    "draftImageTray",
    "sendMode",
    "sendText",
    "useAi",
    "aiSuggest",
    "optimizeDraft",
    "optimizeDraftInline",
    "emojiTool",
    "superCommandTool",
    "imageTool",
    "redPackTool",
    "screenshotTool",
    "saveSkillTool",
    "transferAiComposer",
    "imageFileInput",
    "emojiPopover",
    "quickReplyTool",
    "orderTool",
    "skillReplyTool",
    "withdrawRiskSignal",
    "redOnly",
    "accessIn",
    "transferAi",
    "toolContent",
    "toolModalOverlay",
    "toolModalPanel",
    "toolModalTitle",
    "toolModalBody",
    "toolModalClose",
    "toolModalCancel",
    "toolModalConfirm",
    "linkPreviewOverlay",
    "linkPreviewPanel",
    "linkPreviewTitle",
    "linkPreviewSubtitle",
    "linkPreviewBody",
    "linkPreviewOpen",
    "linkPreviewCopy",
    "linkPreviewClose",
    "toastHost"
  ].forEach((id) => {
    el[id] = $(id);
  });

  hydrateLoginFields();
  applyAiProviderState();
  hydrateAiSettingsFields();
  hydrateComposerFields();
  bindEvents();
  renderAll();
  loadReplySkills();
  loadAiProviderPresetsFromServer();
}

function bindEvents() {
  el.loginForm.addEventListener("submit", connect);
  el.togglePassword.addEventListener("click", togglePassword);
  el.backStep.addEventListener("click", () => toast("当前先按客户端连接页处理，场景选择页后续可补。"));
  el.versionNote.addEventListener("click", () => toast("Web 二开版已改为读取真实悠聊接口数据。"));
  el.returnLogin.addEventListener("click", showLogin);
  el.clientBackendButton.addEventListener("click", openStatsBackend);
  el.clientGlobalSearchButton.addEventListener("click", showGlobalSearchModal);
  el.clientStatsButton.addEventListener("click", showClientStatsModal);
  el.clientNoticeButton.addEventListener("click", showClientNoticeModal);
  el.clientSettingsButton.addEventListener("click", toggleClientSettingsMenu);
  el.clientSettingsMenu.addEventListener("click", handleClientSettingsMenuClick);
  el.aiSettingsButton.addEventListener("click", showAiSettings);
  el.closeAiSettings.addEventListener("click", hideAiSettings);
  el.aiSettingsOverlay.addEventListener("click", (event) => {
    if (event.target === el.aiSettingsOverlay) hideAiSettings();
  });
  el.aiSettingsPanel.addEventListener("submit", saveAiSettings);
  el.aiSettingsPanel.addEventListener("click", handleAiPresetClick);
  el.aiProvider.addEventListener("change", handleAiProviderChange);
  el.fetchAiModels.addEventListener("click", fetchAiModelsForActiveProvider);
  el.resetAiSettings.addEventListener("click", resetAiSettings);
  el.friendRequests.addEventListener("click", showFriendRequestsDialog);
  el.refreshContacts.addEventListener("click", loadContacts);
  el.refreshMessages.addEventListener("click", () => loadMessages(1, "replace", { keepPosition: true }));
  el.search.addEventListener("input", debounce(loadContacts, 350));
  el.sendText.addEventListener("click", sendText);
  el.useAi.addEventListener("click", () => useAiSuggestion());
  el.applyAiSuggestion.addEventListener("click", () => useAiSuggestion());
  el.sendAiSuggestion.addEventListener("click", sendCurrentSuggestion);
  el.refreshAiSuggestion.addEventListener("click", refreshAiSuggestion);
  el.closeAiSuggestion.addEventListener("click", clearAiSuggestion);
  el.aiSuggestionCard.addEventListener("click", handleAiSuggestionClick);
  el.draftImageTray.addEventListener("click", handleDraftImageClick);
  el.aiSuggest.addEventListener("click", generateAiWithRelay);
  el.optimizeDraft?.addEventListener("click", requestDraftOptimizeFromComposer);
  el.optimizeDraftInline?.addEventListener("click", requestDraftOptimizeFromComposer);
  el.withdrawRiskSignal?.addEventListener("click", handleWithdrawRiskSignalClick);
  el.replyText.addEventListener("input", handleReplyInput);
  el.replyText.addEventListener("keydown", handleReplyKeydown);
  el.replyText.addEventListener("paste", handleReplyPaste);
  el.replyText.addEventListener("dragover", handleReplyDragOver);
  el.replyText.addEventListener("drop", handleReplyDrop);
  el.replyText.addEventListener("click", handleDraftImageClick);
  el.sendMode.addEventListener("change", handleSendModeChange);
  el.emojiTool.addEventListener("click", toggleEmojiPopover);
  el.emojiPopover.addEventListener("click", handleEmojiPick);
  el.superCommandTool.addEventListener("click", showSuperCommandModal);
  el.imageTool.addEventListener("click", pickImageFile);
  el.imageFileInput.addEventListener("change", handleImageFileSelected);
  el.redPackTool.addEventListener("click", showRedPackModal);
  el.screenshotTool.addEventListener("click", captureScreenshot);
  el.saveSkillTool.addEventListener("click", showSaveSkillModal);
  el.transferAiComposer.addEventListener("click", transferAi);
  el.toolModalOverlay.addEventListener("click", (event) => {
    if (event.target === el.toolModalOverlay) closeToolModal();
  });
  el.toolModalClose.addEventListener("click", closeToolModal);
  el.toolModalCancel.addEventListener("click", closeToolModal);
  el.toolModalConfirm.addEventListener("click", confirmToolModal);
  el.toolModalBody.addEventListener("click", handleToolModalBodyClick);
  el.toolModalBody.addEventListener("input", handleToolModalBodyInput);
  el.toolModalBody.addEventListener("change", handleToolModalBodyChange);
  el.toolModalBody.addEventListener("keydown", handleToolModalBodyKeydown);
  el.linkPreviewOverlay.addEventListener("click", (event) => {
    if (event.target === el.linkPreviewOverlay) closeLinkPreview();
  });
  el.linkPreviewClose.addEventListener("click", closeLinkPreview);
  el.linkPreviewOpen.addEventListener("click", openActiveLinkPreview);
  el.linkPreviewCopy.addEventListener("click", copyActiveLinkPreviewUrl);
  el.quickReplyTool.addEventListener("click", () => setToolTab("quick"));
  el.orderTool.addEventListener("click", () => setToolTab("order"));
  el.skillReplyTool.addEventListener("click", () => setToolTab("skill"));
  el.redOnly.addEventListener("change", () => {
    state.messageHasMore = false;
    loadMessages(1, "replace", {
      forceBottom: true,
      redOnly: el.redOnly.checked
    });
  });
  el.accessIn.addEventListener("click", accessIn);
  el.transferAi.addEventListener("click", transferAi);
  el.mobileBackToList?.addEventListener("click", () => setMobilePanel("list"));
  el.mobileOpenTools?.addEventListener("click", () => {
    if (isMobileWorkbench()) setMobilePanel("tool");
    else toggleToolDrawer();
  });
  el.mobileBackToChat?.addEventListener("click", () => {
    if (isMobileWorkbench()) setMobilePanel("chat");
    else toggleToolDrawer(false);
  });
  el.toolDrawerScrim?.addEventListener("click", () => toggleToolDrawer(false));
  el.toolContent.addEventListener("click", handleToolClick);
  el.toolContent.addEventListener("keydown", handleToolKeydown);
  el.messageList.addEventListener("click", handleMessageListClick);
  el.messageList.addEventListener("scroll", handleMessageListScroll);
  el.contactList.addEventListener("focusin", () => {
    state.contactListKeyboardActive = true;
  });
  el.contactList.addEventListener("mousedown", () => {
    state.contactListKeyboardActive = true;
  });
  el.contactList.addEventListener("click", handleContactListClick);
  el.contactList.addEventListener("keydown", handleContactListKeydown);
  el.contactList.addEventListener("contextmenu", handleContactContextMenu);
  el.contactList.addEventListener("scroll", () => {
    closeContextMenu();
    handleContactListScroll();
  });
  document.addEventListener("error", handleAvatarImageError, true);
  document.addEventListener("click", closeContextMenu);
  document.addEventListener("click", handleContactListFocusOutside);
  document.addEventListener("click", closeClientSettingsMenuOnOutside);
  document.addEventListener("click", closeEmojiOnOutside);
  window.addEventListener("resize", () => {
    closeContextMenu();
    closeEmojiPopover();
    updateMobilePanelState();
  });
  document.addEventListener("keydown", (event) => {
    if (handleGlobalContactListKeydown(event)) return;
    if (event.key === "Escape") {
      closeContextMenu();
      closeClientSettingsMenu();
      closeEmojiPopover();
      closeToolModal();
      closeLinkPreview();
      hideAiSettings();
    }
  });

  document.querySelectorAll("[data-tool-tab]").forEach((button) => {
    button.addEventListener("click", () => setToolTab(button.dataset.toolTab));
  });

  document.querySelectorAll("[data-list-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextTab = button.dataset.listTab;
      const hasUnread = getListUnreadCount(nextTab) > 0;
      const sameTab = nextTab === state.listTab;
      if (sameTab && hasUnread) {
        await jumpToUnreadInActiveList(nextTab);
        return;
      }
      state.listTab = nextTab;
      state.contactListPage = 1;
      state.contactListHasMore = false;
      state.contactListAutoLoading = false;
      state.pendingUnreadJumpTab = hasUnread ? nextTab : "";
      renderConversationTabs();
      await loadContacts();
      if (hasUnread) await jumpToUnreadInActiveList(nextTab);
    });
  });
}

function hydrateLoginFields() {
  const parsed = parseApiBase(state.apiBase);
  el.serverAddress.value = parsed.isFull ? parsed.address : (parsed.host || "192.168.9.83");
  el.serverPort.value = parsed.isFull ? "" : (parsed.port || "18080");
  el.username.value = state.account || "Boom666";
  el.rememberAccount.checked = state.remember;
}

function hydrateAiSettingsFields() {
  el.aiEnabled.checked = state.aiEnabled;
  el.skillAutoReply.checked = state.skillAutoReply;
  el.skillAutoLearn.checked = state.skillAutoLearn;
  if (el.aiProvider) el.aiProvider.value = state.aiProvider;
  el.aiBaseUrl.value = state.aiBaseUrl;
  el.aiApiKey.value = state.aiApiKey;
  syncAiModelSelect();
  el.aiAuthType.value = state.aiAuthType;
  el.aiTemperature.value = state.aiTemperature;
  updateAiButtonState();
}

function hydrateComposerFields() {
  if (el.sendMode) el.sendMode.value = state.sendMode;
  updateComposerStatus();
}

function updateComposerStatus() {
  const shortcut = state.sendMode === "ctrl-enter" ? "Ctrl+Enter 发送，Enter 换行" : "Enter 发送，Ctrl+Enter 换行";
  const detail = state.draftImages.length ? `已附加 ${state.draftImages.length} 张图，${shortcut}` : shortcut;
  if (el.sendMode) el.sendMode.value = state.sendMode;
  const status = document.querySelector(".composer-status");
  if (status) status.textContent = state.sendingMessage && state.sendingStage
    ? state.sendingStage
    : `文字和图片会按接口能力分开发送，${detail}`;
}

function updateSendControls() {
  const sending = Boolean(state.sendingMessage);
  if (el.sendText) {
    el.sendText.disabled = sending;
    el.sendText.textContent = sending ? "发送中..." : "发送";
  }
  if (el.sendAiSuggestion) el.sendAiSuggestion.disabled = sending || !state.aiSuggestion || Boolean(state.aiSuggestion.noReply);
  if (el.applyAiSuggestion) el.applyAiSuggestion.disabled = sending || !state.aiSuggestion || Boolean(state.aiSuggestion.noReply);
}

function setSendingStage(stage) {
  state.sendingStage = stage || "";
  updateComposerStatus();
}

async function withSendingLock(task) {
  if (state.sendingMessage) {
    toast("消息正在提交，请不要重复点击。", true);
    return null;
  }
  state.sendingMessage = true;
  state.sendingStage = "正在准备发送...";
  updateSendControls();
  updateComposerStatus();
  try {
    return await task();
  } finally {
    state.sendingMessage = false;
    state.sendingStage = "";
    updateSendControls();
    updateComposerStatus();
    renderAiSuggestionCard();
    if (state.activeTool === "skill") renderToolContent();
  }
}

function showAiSettings() {
  aiSettingsSnapshot = {
    aiProvider: state.aiProvider,
    aiBaseUrl: state.aiBaseUrl,
    aiApiKey: state.aiApiKey,
    aiModel: state.aiModel,
    aiAuthType: state.aiAuthType,
    aiTemperature: state.aiTemperature,
    aiModelOptions: [...(state.aiModelOptions || [])],
    aiProvidersConfig: JSON.parse(JSON.stringify(state.aiProvidersConfig || {}))
  };
  hydrateAiSettingsFields();
  el.aiSettingsOverlay.classList.remove("is-hidden");
  window.setTimeout(() => (el.aiProvider || el.aiBaseUrl).focus(), 0);
}

function hideAiSettings() {
  if (aiSettingsSnapshot) {
    state.aiProvider = aiSettingsSnapshot.aiProvider;
    state.aiBaseUrl = aiSettingsSnapshot.aiBaseUrl;
    state.aiApiKey = aiSettingsSnapshot.aiApiKey;
    state.aiModel = aiSettingsSnapshot.aiModel;
    state.aiAuthType = aiSettingsSnapshot.aiAuthType;
    state.aiTemperature = aiSettingsSnapshot.aiTemperature;
    state.aiModelOptions = [...(aiSettingsSnapshot.aiModelOptions || [])];
    state.aiProvidersConfig = JSON.parse(JSON.stringify(aiSettingsSnapshot.aiProvidersConfig || {}));
    aiSettingsSnapshot = null;
  }
  el.aiSettingsOverlay.classList.add("is-hidden");
}

function toggleClientSettingsMenu(event) {
  event.stopPropagation();
  const open = el.clientSettingsMenu.classList.contains("is-hidden");
  if (open) {
    el.clientSettingsMenu.classList.remove("is-hidden");
    el.clientSettingsButton.setAttribute("aria-expanded", "true");
  } else {
    closeClientSettingsMenu();
  }
}

function closeClientSettingsMenu() {
  if (!el.clientSettingsMenu) return;
  el.clientSettingsMenu.classList.add("is-hidden");
  el.clientSettingsButton?.setAttribute("aria-expanded", "false");
}

function closeClientSettingsMenuOnOutside(event) {
  if (!el.clientSettingsMenu || el.clientSettingsMenu.classList.contains("is-hidden")) return;
  if (el.clientSettingsMenu.contains(event.target) || el.clientSettingsButton.contains(event.target)) return;
  closeClientSettingsMenu();
}

function handleClientSettingsMenuClick(event) {
  const target = event.target.closest("[data-client-menu]");
  if (!target) return;
  event.stopPropagation();
  closeClientSettingsMenu();

  const action = target.dataset.clientMenu;
  if (action === "settings") {
    showClientOptionsModal();
  } else if (action === "database") {
    showDatabaseModal();
  } else if (action === "skill-training") {
    window.open("/skill-training.html", "_blank", "noopener,noreferrer");
  } else if (action === "pause") {
    toggleClientPause();
  } else if (action === "logout") {
    stopSignalRConnection().catch((error) => log("SignalR logout stop failed", { error: error.message }));
    showLogin();
    toast("已退出当前 Web 工作台。");
  } else if (action === "close") {
    closeWorkbenchWindow();
  }
}

function toggleClientPause() {
  state.clientPaused = !state.clientPaused;
  localStorage.setItem(CLIENT_PAUSED_STORAGE_KEY, String(state.clientPaused));
  if (state.clientPaused) {
    stopAutoRefresh();
    stopSignalRConnection().catch((error) => log("SignalR pause stop failed", { error: error.message }));
    toast("已挂起：自动刷新已暂停。");
  } else {
    startAutoRefresh();
    ensureSignalRConnection().catch((error) => log("SignalR resume failed", { error: error.message }));
    toast("已恢复：自动刷新重新开启。");
  }
  updateClientChromeState();
  updateConnectionState(false);
}

function closeWorkbenchWindow() {
  toast("网页端无法像 Electron 一样强制关闭程序，已尝试关闭当前标签页。");
  window.close();
}

function updateClientChromeState() {
  if (el.clientPauseMenuText) {
    el.clientPauseMenuText.textContent = state.clientPaused ? "恢复" : "挂起";
  }
  if (el.clientSettingsButton) {
    el.clientSettingsButton.classList.toggle("is-paused", state.clientPaused);
  }
}

const CLIENT_OPTION_SKIP = Symbol("client-option-skip");
const CLIENT_SWITCH_TYPE_OPTIONS = [
  { value: 0, label: "显示昵称" },
  { value: 1, label: "显示备注" },
  { value: 2, label: "备注（昵称）" }
];
const CLIENT_DATABASE_TYPE_OPTIONS = [
  { value: 0, label: "自定义数据库" },
  { value: 2, label: "跟随服务端" }
];
const RED_POINT_CONFIG_GROUPS = [
  {
    title: "订单",
    items: [
      ["firstOrder", "首次下单"],
      ["orderSuccess", "下单成功"],
      ["orderNo", "订单号"],
      ["orderInvalid", "订单失效"],
      ["orderBindError", "订单绑定失败"],
      ["orderRefund", "订单维权"],
      ["orderSettle", "订单结算"],
      ["orderReward", "订单奖励"]
    ]
  },
  {
    title: "查券 / 提现",
    items: [
      ["queryCoupon", "查券"],
      ["querySuccess", "查券成功"],
      ["queryError", "查券异常"],
      ["takeBalSuccess", "提现成功"],
      ["takeBalError", "提现失败"],
      ["takeBalCheck", "提现审核"],
      ["firstTakeBal", "首次提现"],
      ["mdExchange", "兑换免单"]
    ]
  },
  {
    title: "指令 / 消息",
    items: [
      ["callKefu", "呼叫客服"],
      ["superCmd", "超级指令"],
      ["otherCmd", "其他指令"],
      ["aiQA", "智能回复"],
      ["voice", "语音"],
      ["redPack", "红包"],
      ["transfer", "转账"],
      ["unsolicitedMsg", "后台主动发送的消息"]
    ]
  },
  {
    title: "消息提示",
    items: [
      ["redPackCard", "红包卡片"],
      ["addFriend", "好友添加"],
      ["groupCard", "群卡片"],
      ["guidePlaceOrder", "催查券/催下单"],
      ["firstQuery", "首次查询"],
      ["firstQueryReward", "首次查询奖励"],
      ["notPromot", "未参加推广"],
      ["unknowMsg", "系统无法识别的消息"]
    ]
  },
  {
    title: "其他",
    items: [
      ["firstOrderReward", "首单奖励"],
      ["signInSuccess", "签到成功"],
      ["signInError", "签到失败"],
      ["shoppingGuide", "购物导购"]
    ]
  }
];
const RED_POINT_KEYWORD_FIELDS = [
  ["fuzzyList", "模糊关键词"],
  ["preciseList", "精准关键词"],
  ["fuzzyMiniTitleList", "小程序标题模糊"],
  ["preciseMiniTitleList", "小程序标题精准"],
  ["fuzzyCardTitleList", "卡片标题模糊"],
  ["preciseCardTitleList", "卡片标题精准"],
  ["fuzzyCardContentList", "卡片内容模糊"],
  ["preciseCardContentList", "卡片内容精准"]
];

async function showClientOptionsModal() {
  state.clientOptionsLoading = true;
  state.clientOptions = null;
  state.redPointConfigLoading = true;
  state.redPointConfig = null;
  state.redPointConfigError = "";
  openToolModal({
    type: "client-options",
    size: "settings",
    title: "系统设置",
    confirmText: "保存",
    body: renderClientOptionsModal(),
    onConfirm: saveClientOptionsFromModal
  });

  const [optionsResult, redPointResult] = await Promise.allSettled([
    api("/System/GetOptions", {}),
    fetchRedPointConfig()
  ]);

  if (optionsResult.status === "fulfilled") {
    const payload = optionsResult.value;
    state.clientOptions = getData(payload) || payload || {};
    log("client options", summarize(state.clientOptions));
  } else {
    state.clientOptions = { __error: optionsResult.reason?.message || String(optionsResult.reason) };
  }

  if (redPointResult.status === "fulfilled") {
    state.redPointConfig = redPointResult.value;
    log("red point config", summarize(state.redPointConfig));
  } else {
    state.redPointConfigError = redPointResult.reason?.message || String(redPointResult.reason);
  }

  state.clientOptionsLoading = false;
  state.redPointConfigLoading = false;
  if (state.activeModal?.type === "client-options") {
    el.toolModalBody.innerHTML = renderClientOptionsModal();
  }
}

async function fetchRedPointConfig() {
  const [accountResult, contactResult] = await Promise.allSettled([
    api("/Account/GetRedPointConfig", {}, { method: "GET" }),
    api("/Contact/GetRedPointConfig", {}, { method: "GET" })
  ]);

  if (accountResult.status !== "fulfilled") {
    throw accountResult.reason;
  }

  const settings = extractRedPointSettings(accountResult.value);
  const msgTypes = contactResult.status === "fulfilled"
    ? extractRedPointMsgTypes(contactResult.value)
    : [];
  return {
    settings,
    msgTypes,
    contactConfigError: contactResult.status === "rejected" ? contactResult.reason?.message || String(contactResult.reason) : ""
  };
}

function extractRedPointSettings(payload) {
  let data = getData(payload) || payload || {};
  if (data && typeof data === "object" && !Array.isArray(data) && data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    data = data.data;
  }
  return data && typeof data === "object" && !Array.isArray(data) ? data : {};
}

function extractRedPointMsgTypes(payload) {
  const data = getData(payload);
  if (Array.isArray(data)) return data;
  return getRecords(payload);
}

function renderClientOptionsModal() {
  if (state.clientOptionsLoading) {
    return '<div class="client-modal-loading">正在读取 /System/GetOptions...</div>';
  }
  if (state.clientOptions?.__error) {
    return `
      <div class="client-modal-error">
        <strong>设置读取失败</strong>
        <p>${escapeHtml(state.clientOptions.__error)}</p>
      </div>
      <p class="modal-hint">这里直接调用原生接口 /System/GetOptions，接口恢复后再打开即可看到真实配置。</p>
    `;
  }

  const options = state.clientOptions || {};
  const commonOptions = getClientOptionGroup(options, "commonOptions");
  const jobOptions = getClientOptionGroup(options, "jobOptions");
  const aiOptions = getClientOptionGroup(options, "aiOptions");
  const dataBaseOptions = getClientOptionGroup(options, "dataBaseOptions");
  return `
    <div class="client-settings-shell">
      <section class="client-settings-sheet">
        <div class="client-settings-panel">
          ${renderClientRadioSetting({
            label: "会话显示",
            namespace: "commonOptions",
            key: "switchType",
            value: firstValue(commonOptions.switchType, 0),
            options: CLIENT_SWITCH_TYPE_OPTIONS
          })}
          ${renderClientToggleSetting({
            label: "系统提示音",
            hint: "有新消息时播放提示音。",
            namespace: "commonOptions",
            key: "audioNotice",
            checked: Boolean(commonOptions.audioNotice)
          })}
          ${renderClientToggleSetting({
            label: "系统消息弹窗",
            hint: "收到系统提醒时显示弹窗。",
            namespace: "commonOptions",
            key: "alertSysNotice",
            checked: Boolean(commonOptions.alertSysNotice)
          })}
        </div>

        ${renderRedPointConfigSection()}

        <div class="client-settings-divider">
          <span>定时任务</span>
        </div>

        <div class="client-settings-panel">
          ${renderClientToggleSetting({
            label: "开启任务",
            hint: "启用超时检测和自动任务。",
            namespace: "jobOptions",
            key: "runTimeoutCheckJob",
            checked: Boolean(jobOptions.runTimeoutCheckJob)
          })}
          ${renderClientToggleSetting({
            label: "是否开启自动邀评",
            namespace: "jobOptions",
            key: "autoInviteScore",
            checked: Boolean(jobOptions.autoInviteScore)
          })}
          ${renderClientToggleSetting({
            label: "是否开启留言分发",
            namespace: "jobOptions",
            key: "autoLeaveMsg",
            checked: Boolean(jobOptions.autoLeaveMsg)
          })}
          ${renderClientToggleSetting({
            label: "自动关闭会话",
            hint: "已锁定关闭，避免服务端自动关闭当前会话。",
            namespace: "jobOptions",
            key: "autoShutDown",
            checked: false,
            disabled: true,
            locked: true
          })}
          <div class="client-settings-number-list">
            ${renderClientNumberSetting({
              label: "自动关闭时间(分钟)",
              namespace: "jobOptions",
              key: "closeTime",
              value: firstValue(jobOptions.closeTime, 20),
              min: 0
            })}
            ${renderClientNumberSetting({
              label: "回复超时判定时间(分钟)",
              namespace: "jobOptions",
              key: "timeout",
              value: firstValue(jobOptions.timeout, 5),
              min: 0
            })}
            ${renderClientNumberSetting({
              label: "获取多少小时前的聊天记录",
              namespace: "jobOptions",
              key: "getMsgByDate",
              value: firstValue(jobOptions.getMsgByDate, 2),
              min: 0
            })}
          </div>
        </div>

        <details class="client-settings-advanced">
          <summary>高级配置</summary>
          <div class="client-settings-advanced-grid">
            <section class="client-settings-block compact">
              <h4>常规补充</h4>
              ${renderEditableOptionFields(commonOptions, "commonOptions", {
                exclude: ["audioNotice", "alertSysNotice", "switchType"]
              })}
            </section>
            <section class="client-settings-block compact">
              <h4>任务补充</h4>
              ${renderEditableOptionFields(jobOptions, "jobOptions", {
                exclude: ["runTimeoutCheckJob", "autoInviteScore", "autoLeaveMsg", "autoShutDown", "closeTime", "timeout", "getMsgByDate"]
              })}
            </section>
          </div>
        </details>

        <details class="client-settings-advanced">
          <summary>服务端 AI 与数据库</summary>
          <p class="modal-hint">这里是悠聊服务端原生配置，不会覆盖右上角单独的 Web AI 推荐设置。</p>
          <div class="client-settings-advanced-grid">
            <section class="client-settings-block compact">
              <h4>服务端 AI</h4>
              ${renderEditableOptionFields(aiOptions, "aiOptions")}
            </section>
            <section class="client-settings-block compact">
              <h4>数据库</h4>
              ${renderClientRadioSetting({
                label: "数据库模式",
                namespace: "dataBaseOptions",
                key: "databaseType",
                value: firstValue(dataBaseOptions.databaseType, 0),
                options: CLIENT_DATABASE_TYPE_OPTIONS,
                compact: true
              })}
              ${renderEditableOptionFields(dataBaseOptions, "dataBaseOptions", { exclude: ["databaseType"] })}
            </section>
          </div>
        </details>

        <details class="client-settings-advanced">
          <summary>原始配置 JSON</summary>
          <div class="raw-json-box embedded">
            <pre>${escapeHtml(JSON.stringify(options, null, 2))}</pre>
          </div>
        </details>
      </section>
    </div>
  `;
}

function renderRedPointConfigSection() {
  const loading = state.redPointConfigLoading;
  const error = state.redPointConfigError;
  const config = state.redPointConfig?.settings || {};
  const msgTypes = state.redPointConfig?.msgTypes || [];
  const enabledCount = RED_POINT_CONFIG_GROUPS
    .flatMap((group) => group.items)
    .filter(([key]) => Boolean(config[key])).length;
  const totalCount = RED_POINT_CONFIG_GROUPS.flatMap((group) => group.items).length;
  const keywordRows = RED_POINT_KEYWORD_FIELDS
    .map(([key, label]) => [label, normalizeConfigList(config[key])])
    .filter(([, values]) => values.length);

  return `
    <div class="client-settings-divider">
      <span>显示红点</span>
    </div>
    <section class="client-settings-panel red-point-config-panel">
      <div class="red-point-config-head">
        <div>
          <strong>悠聊红点配置</strong>
          <span>勾选类型命中后，消息会在悠聊中显示红点；聊天区勾选“只显示红点消息”时直接按该配置请求服务端。</span>
        </div>
        <em>${loading ? "读取中" : error ? "读取失败" : `已开启 ${enabledCount}/${totalCount}`}</em>
      </div>
      ${loading ? '<div class="client-modal-loading compact">正在读取 /Account/GetRedPointConfig...</div>' : ""}
      ${error ? `<div class="client-modal-error compact"><strong>红点配置读取失败</strong><p>${escapeHtml(error)}</p></div>` : ""}
      ${!loading && !error ? `
        <div class="red-point-group-grid">
          ${RED_POINT_CONFIG_GROUPS.map((group) => renderRedPointConfigGroup(group, config)).join("")}
        </div>
        <div class="red-point-meta">
          <span>msgType: ${msgTypes.length ? escapeHtml(msgTypes.join(" / ")) : "无"}</span>
          ${state.redPointConfig?.contactConfigError ? `<span>Contact 配置读取失败: ${escapeHtml(state.redPointConfig.contactConfigError)}</span>` : ""}
        </div>
        ${keywordRows.length ? `
          <div class="red-point-keywords">
            ${keywordRows.map(([label, values]) => `
              <div>
                <strong>${escapeHtml(label)}</strong>
                <p>${values.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p>
              </div>
            `).join("")}
          </div>
        ` : ""}
      ` : ""}
      <p class="modal-hint">当前只读取原生红点配置。服务端文档只暴露 GetRedPointConfig，未确认保存接口前不在 Web 里伪造修改。</p>
    </section>
  `;
}

function renderRedPointConfigGroup(group, config) {
  return `
    <div class="red-point-config-group">
      <h4>${escapeHtml(group.title)}</h4>
      <div class="red-point-chip-list">
        ${group.items.map(([key, label]) => {
          const checked = Boolean(config[key]);
          return `
            <label class="red-point-chip ${checked ? "is-on" : "is-off"}" title="${escapeAttr(key)}">
              <input type="checkbox" disabled ${checked ? "checked" : ""}>
              <span>${escapeHtml(label)}</span>
            </label>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function normalizeConfigList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  return splitListValue(value).map((item) => String(item || "").trim()).filter(Boolean);
}

function getClientOptionGroup(options, namespace) {
  return options?.[namespace] || options?.[toPascalCase(namespace)] || {};
}

function renderClientRadioSetting({ label, namespace, key, value, options, compact = false }) {
  const inputName = `client-option-${namespace}-${key}`;
  return `
    <div class="client-setting-row ${compact ? "compact" : ""}">
      <div class="client-setting-copy">
        <strong>${escapeHtml(label)}</strong>
      </div>
      <div class="client-radio-group" role="radiogroup" aria-label="${escapeAttr(label)}">
        ${options.map((item) => `
          <label class="client-radio-item">
            <input
              type="radio"
              name="${escapeAttr(inputName)}"
              data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}"
              data-client-option-value="${escapeAttr(item.value)}"
              ${Number(value) === Number(item.value) ? "checked" : ""}
            >
            <span>${escapeHtml(item.label)}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function renderClientToggleSetting({ label, hint = "", namespace, key, checked, disabled = false, locked = false }) {
  return `
    <label class="client-setting-row is-inline ${locked ? "is-locked" : ""}">
      <div class="client-setting-copy">
        <strong>${escapeHtml(label)}</strong>
        ${hint ? `<span>${escapeHtml(hint)}</span>` : ""}
      </div>
      <span class="client-toggle">
        <input type="checkbox" data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        <i aria-hidden="true"></i>
      </span>
    </label>
  `;
}

function renderClientNumberSetting({ label, namespace, key, value, min = 0 }) {
  return `
    <label class="client-setting-number">
      <span>${escapeHtml(label)}</span>
      <input
        type="number"
        min="${escapeAttr(min)}"
        step="1"
        data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}"
        value="${escapeAttr(value)}"
      >
    </label>
  `;
}

function renderEditableOptionFields(group, namespace, options = {}) {
  const exclude = new Set((options.exclude || []).map(String));
  const entries = Object.entries(group || {})
    .filter(([, value]) => isEditablePrimitive(value))
    .filter(([key]) => !exclude.has(String(key)));
  if (!entries.length) return '<p class="empty-state compact">当前没有额外可编辑字段。</p>';
  return `
    <div class="client-option-fields">
      ${entries.slice(0, 24).map(([key, value]) => `
        <label class="modal-field compact-field">
          <span>${escapeHtml(key)}</span>
          ${typeof value === "boolean"
            ? `<select data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}"><option value="true" ${value ? "selected" : ""}>true</option><option value="false" ${!value ? "selected" : ""}>false</option></select>`
            : `<input data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}" value="${escapeAttr(value ?? "")}" />`}
        </label>
      `).join("")}
    </div>
  `;
}

function isEditablePrimitive(value) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

async function saveClientOptionsFromModal() {
  const original = state.clientOptions || {};
  if (!Object.keys(original).length || original.__error) {
    toast("没有可保存的客户端设置。", true);
    return false;
  }

  const next = clonePlainObject(original);
  el.toolModalBody.querySelectorAll("[data-client-option]").forEach((input) => {
    const nextValue = readClientOptionInputValue(input);
    if (nextValue === CLIENT_OPTION_SKIP) return;
    const [namespace, key] = String(input.dataset.clientOption || "").split(".");
    if (!namespace || !key) return;
    const sourceGroup = original[namespace] || original[toPascalCase(namespace)] || {};
    const targetGroup = next[namespace] || next[toPascalCase(namespace)] || {};
    targetGroup[key] = castLike(nextValue, sourceGroup[key]);
    if (next[namespace]) next[namespace] = targetGroup;
    else next[toPascalCase(namespace)] = targetGroup;
  });

  try {
    const payload = normalizeClientOptionsForSave(next);
    const response = await fetch(CLIENT_OPTIONS_SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        apiBase: state.apiBase
      })
    });
    const result = await response.json();
    if (!response.ok || result.success === false) {
      throw new Error(getMessage(result) || `HTTP ${response.status}`);
    }
    state.clientOptions = result.options || payload;
    if (result.health) state.databaseRepair.health = result.health;
    toast(result.repaired ? "系统设置已保存，并已把数据库切回 MySQL。" : "系统设置已保存，数据库仍为 MySQL。");
    closeToolModal();
    return true;
  } catch (error) {
    toast(`保存系统设置失败：${error.message}`, true);
    return false;
  }
}

function normalizeClientOptionsForSave(options = {}) {
  const dataBaseOptions = {
    ...(options.dataBaseOptions || options.DataBaseOptions || {})
  };
  const commonOptions = {
    ...(options.commonOptions || options.CommonOptions || {})
  };
  const jobOptions = {
    ...(options.jobOptions || options.JobOptions || {})
  };
  const aiOptions = {
    ...(options.aiOptions || options.AiOptions || {})
  };

  dataBaseOptions.databaseType = 0;
  if (!String(dataBaseOptions.connectionString || "").trim()) {
    dataBaseOptions.connectionString = state.databaseRepair.health?.connectionString || "";
  }
  jobOptions.autoShutDown = false;
  if (jobOptions.closeTime === undefined || jobOptions.closeTime === null || jobOptions.closeTime === "") {
    jobOptions.closeTime = 20;
  }
  if (jobOptions.runTimeoutCheckJob === undefined || jobOptions.runTimeoutCheckJob === null) {
    jobOptions.runTimeoutCheckJob = true;
  }

  return {
    dataBaseOptions,
    commonOptions,
    jobOptions,
    aiOptions
  };
}

function readClientOptionInputValue(input) {
  if (!input) return CLIENT_OPTION_SKIP;
  if (input.matches('input[type="radio"]')) {
    return input.checked ? (input.dataset.clientOptionValue ?? input.value) : CLIENT_OPTION_SKIP;
  }
  if (input.matches('input[type="checkbox"]')) {
    return Boolean(input.checked);
  }
  return input.value;
}

function showDatabaseModal() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  state.databaseDelete = {
    startTime: state.databaseDelete.startTime || toDateInputValue(start),
    endTime: state.databaseDelete.endTime || toDateInputValue(now),
    confirmText: "",
    deleting: false
  };
  openToolModal({
    type: "database",
    title: "数据库管理",
    confirmText: "确定",
    body: renderDatabaseModal(),
    onConfirm: deleteChatRecordsFromModal
  });
  updateDatabaseDeleteConfirmState();
  loadDatabaseRepairStatus({ silent: true });
}

function renderDatabaseModal() {
  const confirmLength = String(state.databaseDelete.confirmText || "").length;
  return `
    <section class="database-delete-panel">
      <nav class="database-delete-tabs" aria-label="数据库管理功能">
        <button type="button" class="is-active">数据库修复</button>
        <button type="button">删除聊天记录</button>
      </nav>
      ${renderDatabaseRepairPanel()}
      <div class="database-delete-form">
        <label class="modal-field database-date-range">
          <span><i>*</i> 选择日期：</span>
          <div class="date-range-control">
            <input id="databaseDeleteStart" type="date" value="${escapeAttr(state.databaseDelete.startTime)}" />
            <b aria-hidden="true">→</b>
            <input id="databaseDeleteEnd" type="date" value="${escapeAttr(state.databaseDelete.endTime)}" />
          </div>
          <small>*选择要删除的聊天记录日期范围</small>
        </label>
        <label class="modal-field database-confirm-field">
          <span><i>*</i> 确认删除：</span>
          <div class="confirm-input-wrap">
            <input id="databaseDeleteConfirm" maxlength="50" value="${escapeAttr(state.databaseDelete.confirmText)}" placeholder="请输入确认信息" />
            <em>${confirmLength} / 50</em>
          </div>
          <small>*请输入：${escapeHtml(DATABASE_DELETE_CONFIRM_TEXT)}</small>
        </label>
      </div>
    </section>
  `;
}

function syncDatabaseDeleteFields() {
  state.databaseDelete.startTime = $("databaseDeleteStart")?.value || "";
  state.databaseDelete.endTime = $("databaseDeleteEnd")?.value || "";
  state.databaseDelete.confirmText = $("databaseDeleteConfirm")?.value || "";
}

function updateDatabaseDeleteConfirmState() {
  if (!state.activeModal || state.activeModal.type !== "database") return;
  syncDatabaseDeleteFields();
  const hasValidRange = isValidDatabaseDeleteRange(state.databaseDelete.startTime, state.databaseDelete.endTime);
  const valid = Boolean(
    state.databaseDelete.startTime &&
    state.databaseDelete.endTime &&
    hasValidRange &&
    state.databaseDelete.confirmText === DATABASE_DELETE_CONFIRM_TEXT &&
    !state.databaseDelete.deleting
  );
  el.toolModalConfirm.disabled = !valid;
  el.toolModalConfirm.textContent = state.databaseDelete.deleting ? "删除中..." : "确定";
  const counter = el.toolModalBody.querySelector(".confirm-input-wrap em");
  if (counter) counter.textContent = `${state.databaseDelete.confirmText.length} / 50`;
}

async function deleteChatRecordsFromModal() {
  syncDatabaseDeleteFields();
  if (!state.databaseDelete.startTime || !state.databaseDelete.endTime) {
    toast("请选择要删除的聊天记录日期范围。", true);
    return false;
  }
  if (!isValidDatabaseDeleteRange(state.databaseDelete.startTime, state.databaseDelete.endTime)) {
    toast("开始日期不能晚于结束日期。", true);
    return false;
  }
  const startTime = toLocalDateTimeString(state.databaseDelete.startTime, false);
  const endTime = toLocalDateTimeString(state.databaseDelete.endTime, true);
  if (state.databaseDelete.confirmText !== DATABASE_DELETE_CONFIRM_TEXT) {
    toast("确认信息不正确，无法删除聊天记录。", true);
    return false;
  }

  state.databaseDelete.deleting = true;
  updateDatabaseDeleteConfirmState();
  try {
    await api("/ChatContent/Delete", {
      startTime,
      endTime
    });
    toast("删除聊天记录请求已提交。");
    closeToolModal();
    await Promise.allSettled([
      loadMessages(1, "replace", { forceBottom: true }),
      state.activeTool === "history" ? loadHistoryMessages(1, "replace", { forceBottom: true }) : Promise.resolve()
    ]);
    return true;
  } catch (error) {
    toast(`删除聊天记录失败：${error.message}`, true);
    return false;
  } finally {
    state.databaseDelete.deleting = false;
    updateDatabaseDeleteConfirmState();
  }
}

function isValidDatabaseDeleteRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start.getTime() <= end.getTime();
}

function toLocalDateTimeString(dateText, endOfDay = false) {
  const suffix = endOfDay ? "23:59:59" : "00:00:00";
  return `${dateText} ${suffix}`;
}

function openStatsBackend() {
  const backendUrl = getStatsBackendUrl();
  window.open(backendUrl, "_blank", "noopener,noreferrer");
  toast("已打开原生统计后台页面。");
}

function getStatsBackendUrl() {
  try {
    const url = new URL(state.apiBase);
    url.pathname = "/abnormal";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "/abnormal";
  }
}

function showGlobalSearchModal() {
  const now = new Date();
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  state.globalSearch = {
    ...state.globalSearch,
    startTime: state.globalSearch.startTime || toDateTimeLocal(start),
    endTime: state.globalSearch.endTime || toDateTimeLocal(now),
    page: 1,
    error: ""
  };
  openToolModal({
    type: "global-search",
    size: "xl",
    title: "聊天记录全局搜索",
    confirmText: "查询",
    body: renderGlobalSearchModal(),
    onConfirm: () => runGlobalSearch(1)
  });
  if (!state.globalSearch.records.length) runGlobalSearch(1, { keepModalOpen: true });
}

async function runGlobalSearch(page = state.globalSearch.page, options = {}) {
  syncGlobalSearchFields();
  state.globalSearch.page = page;
  state.globalSearch.loading = true;
  state.globalSearch.error = "";
  renderActiveModalBody();

  try {
    const payload = await api("/ChatContent/SearchList", {
      contacts: splitListValue(state.globalSearch.contacts),
      robots: splitListValue(state.globalSearch.robots),
      keyWord: state.globalSearch.keyword,
      startTime: fromDateTimeLocal(state.globalSearch.startTime),
      endTime: fromDateTimeLocal(state.globalSearch.endTime),
      index: page,
      size: GLOBAL_SEARCH_PAGE_SIZE
    });
    state.globalSearch.records = getRecordsDeep(payload).map(normalizeGlobalSearchRecord);
    state.globalSearch.total = getTotalDeep(payload);
    state.globalSearch.page = page;
  } catch (error) {
    state.globalSearch.records = [];
    state.globalSearch.total = 0;
    state.globalSearch.error = error.message;
  } finally {
    state.globalSearch.loading = false;
    renderActiveModalBody();
    if (!options.keepModalOpen && !state.globalSearch.error) {
      toast("全局聊天记录查询完成。");
    }
  }
  return false;
}

function renderGlobalSearchModal() {
  const search = state.globalSearch;
  const totalText = search.loading ? "查询中" : search.total ? `共 ${search.total} 条` : "无结果";
  return `
    <div class="global-search-layout">
      <div class="global-search-filters">
        <label class="modal-field">
          <span>关键字</span>
          <input id="globalSearchKeyword" value="${escapeAttr(search.keyword)}" placeholder="消息内容、昵称、订单号" />
        </label>
        <label class="modal-field">
          <span>用户昵称 / ID / 备注</span>
          <input id="globalSearchContacts" value="${escapeAttr(search.contacts)}" placeholder="多个用逗号或空格分隔" />
        </label>
        <label class="modal-field">
          <span>机器人 ID</span>
          <input id="globalSearchRobots" value="${escapeAttr(search.robots)}" placeholder="多个用逗号或空格分隔" />
        </label>
        <label class="modal-field">
          <span>开始时间</span>
          <input id="globalSearchStart" type="datetime-local" value="${escapeAttr(search.startTime)}" />
        </label>
        <label class="modal-field">
          <span>结束时间</span>
          <input id="globalSearchEnd" type="datetime-local" value="${escapeAttr(search.endTime)}" />
        </label>
        <div class="modal-inline-actions">
          <button type="button" class="light-button" data-client-modal-action="global-reset">重置</button>
          <button type="button" class="send-button" data-client-modal-action="global-search">查询</button>
        </div>
      </div>
      <div class="client-table-headline">
        <strong>搜索结果</strong>
        <span>${escapeHtml(totalText)}</span>
      </div>
      ${search.error ? `<div class="client-modal-error compact"><strong>查询失败</strong><p>${escapeHtml(search.error)}</p></div>` : ""}
      <div class="client-table-wrap">
        <table class="client-data-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>所属机器人</th>
              <th>来源</th>
              <th>消息内容</th>
              <th>发送时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${search.records.length ? search.records.map(renderGlobalSearchRow).join("") : `<tr><td colspan="6" class="empty-state">${search.loading ? "正在查询真实聊天记录..." : "暂无聊天记录结果。"}</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="pager-row">
        <button class="mini-action" type="button" data-client-modal-action="global-prev" ${search.page <= 1 || search.loading ? "disabled" : ""}>上一页</button>
        <span>第 ${search.page} 页</span>
        <button class="mini-action" type="button" data-client-modal-action="global-next" ${!hasNextGlobalSearchPage() || search.loading ? "disabled" : ""}>下一页</button>
      </div>
    </div>
  `;
}

function renderGlobalSearchRow(row) {
  return `
    <tr>
      <td><strong>${escapeHtml(row.userName || "-")}</strong>${row.contactId ? `<small>${copyButton(row.contactId)}</small>` : ""}</td>
      <td>${escapeHtml(row.robotName || "-")}${row.robotId ? `<small>${copyButton(row.robotId)}</small>` : ""}</td>
      <td>${escapeHtml(row.source || "-")}</td>
      <td class="client-message-cell">${renderSearchContent(row.content)}</td>
      <td>${escapeHtml(row.time || "-")}</td>
      <td>
        <button class="mini-action" type="button" data-copy="${escapeAttr(row.content)}">复制</button>
      </td>
    </tr>
  `;
}

function normalizeGlobalSearchRecord(item, index = 0) {
  const contact = item.contact || {};
  const robot = item.robot || {};
  const contactId = firstValue(item.contactId, item.chatId, contact.id, contact.contactId, "");
  return {
    ...item,
    id: firstValue(item.id, item.msgId, item.messageId, `search-${index}`),
    contactId,
    userName: firstValue(item.userNick, item.nickName, item.contactName, item.userName, contact.userNick, contact.userName, contact.remark, "-"),
    robotName: firstValue(item.robotName, robot.robotRemark, robot.robotName, item.accountName, "-"),
    robotId: firstValue(item.robotId, item.robotUniqueId, robot.robotId, robot.robotUniqueId, ""),
    source: firstValue(item.sourceName, item.source, item.msgTypeName, contentTypeName(item.contentType), messageDirectionName(item), "-"),
    content: getMessageContentText(item) || firstValue(item.message, item.text, item.content, ""),
    time: formatFullTime(firstValue(item.sendTime, item.createTime, item.createDate, item.time, item.msgTime, ""))
  };
}

function hasNextGlobalSearchPage() {
  const search = state.globalSearch;
  return search.records.length >= GLOBAL_SEARCH_PAGE_SIZE && (!search.total || search.page * GLOBAL_SEARCH_PAGE_SIZE < search.total);
}

function syncGlobalSearchFields() {
  state.globalSearch.keyword = $("globalSearchKeyword")?.value.trim() || state.globalSearch.keyword || "";
  state.globalSearch.contacts = $("globalSearchContacts")?.value.trim() || state.globalSearch.contacts || "";
  state.globalSearch.robots = $("globalSearchRobots")?.value.trim() || state.globalSearch.robots || "";
  state.globalSearch.startTime = $("globalSearchStart")?.value || state.globalSearch.startTime || "";
  state.globalSearch.endTime = $("globalSearchEnd")?.value || state.globalSearch.endTime || "";
}

function resetGlobalSearchFilters() {
  state.globalSearch = {
    ...state.globalSearch,
    keyword: "",
    contacts: "",
    robots: "",
    startTime: "",
    endTime: "",
    page: 1,
    total: 0,
    records: [],
    error: ""
  };
  showGlobalSearchModal();
}

function showClientStatsModal() {
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  state.clientStats = {
    ...state.clientStats,
    startTime: state.clientStats.startTime || toDateTimeLocal(start),
    endTime: state.clientStats.endTime || toDateTimeLocal(now),
    error: ""
  };
  openToolModal({
    type: "client-stats",
    size: "large",
    title: "消息统计面板",
    confirmText: "刷新",
    body: renderClientStatsModal(),
    onConfirm: refreshClientStats
  });
  if (!state.clientStats.data) refreshClientStats({ keepModalOpen: true });
}

async function refreshClientStats(options = {}) {
  syncClientStatsFields();
  state.clientStats.loading = true;
  state.clientStats.error = "";
  renderActiveModalBody();
  try {
    const payload = await api("/Summary/RealTimeSummary", {
      startTime: fromDateTimeLocal(state.clientStats.startTime),
      endTime: fromDateTimeLocal(state.clientStats.endTime)
    });
    const statsData = unwrapPayloadData(payload);
    state.clientStats.data = statsData || payload || {};
    state.clientStats.records = normalizeStatsRecords(statsData);
  } catch (error) {
    state.clientStats.data = null;
    state.clientStats.records = [];
    state.clientStats.error = error.message;
  } finally {
    state.clientStats.loading = false;
    renderActiveModalBody();
    if (!options.keepModalOpen && !state.clientStats.error) toast("消息统计已刷新。");
  }
  return false;
}

function renderClientStatsModal() {
  const stats = state.clientStats;
  const metrics = extractStatsMetrics(stats.data);
  return `
    <div class="client-stats-layout">
      <div class="client-stats-filters">
        <label class="modal-field">
          <span>开始时间</span>
          <input id="clientStatsStart" type="datetime-local" value="${escapeAttr(stats.startTime)}" />
        </label>
        <label class="modal-field">
          <span>结束时间</span>
          <input id="clientStatsEnd" type="datetime-local" value="${escapeAttr(stats.endTime)}" />
        </label>
        <button type="button" class="send-button" data-client-modal-action="stats-refresh">刷新</button>
      </div>
      ${stats.error ? `<div class="client-modal-error compact"><strong>统计读取失败</strong><p>${escapeHtml(stats.error)}</p></div>` : ""}
      <div class="stats-metric-grid">
        ${metrics.length ? metrics.map((metric) => `
          <article class="stats-metric">
            <span>${escapeHtml(metric.label)}</span>
            <strong>${escapeHtml(metric.value)}</strong>
          </article>
        `).join("") : `<p class="empty-state compact">${stats.loading ? "正在读取真实统计..." : "接口未返回可展示指标。"}</p>`}
      </div>
      <div class="stats-chart">
        ${renderStatsChart(stats.records)}
      </div>
      <details class="raw-json-box">
        <summary>查看接口原始返回</summary>
        <pre>${escapeHtml(JSON.stringify(stats.data || {}, null, 2))}</pre>
      </details>
    </div>
  `;
}

function syncClientStatsFields() {
  state.clientStats.startTime = $("clientStatsStart")?.value || state.clientStats.startTime || "";
  state.clientStats.endTime = $("clientStatsEnd")?.value || state.clientStats.endTime || "";
}

function normalizeStatsRecords(data) {
  const records = findFirstArray(unwrapPayloadData(data)) || [];
  return records.map((item, index) => {
    const raw = item && typeof item === "object" ? item : { value: item };
    return {
      label: firstValue(raw.it, raw.time, raw.date, raw.hour, raw.name, raw.title, `${index + 1}`),
      value: toNumber(firstValue(raw.count, raw.total, raw.value, raw.num, 0)),
      raw
    };
  });
}

function extractStatsMetrics(data) {
  const records = normalizeStatsRecords(data);
  if (records.length) {
    const sums = records.reduce((acc, item) => {
      const raw = item.raw || {};
      acc.count += toNumber(raw.count);
      acc.fromUser += toNumber(raw.fromUser);
      acc.fromUserRedpointCount += toNumber(raw.fromUserRedpointCount);
      acc.fromRobot += toNumber(raw.fromRobot);
      acc.fromKefu += toNumber(raw.fromKefu);
      acc.contactCount += toNumber(raw.contactCount);
      acc.maxContactCount = Math.max(acc.maxContactCount, toNumber(raw.contactCount));
      return acc;
    }, {
      count: 0,
      fromUser: 0,
      fromUserRedpointCount: 0,
      fromRobot: 0,
      fromKefu: 0,
      contactCount: 0,
      maxContactCount: 0
    });
    return [
      { label: "消息总量", value: formatStatValue(sums.count) },
      { label: "用户普通消息", value: formatStatValue(sums.fromUser) },
      { label: "用户红点消息", value: formatStatValue(sums.fromUserRedpointCount) },
      { label: "机器人消息", value: formatStatValue(sums.fromRobot) },
      { label: "客服回复", value: formatStatValue(sums.fromKefu) },
      { label: "触达客户", value: formatStatValue(sums.contactCount) },
      { label: "峰值客户", value: formatStatValue(sums.maxContactCount) },
      { label: "时间分段", value: formatStatValue(records.length) }
    ];
  }

  const unwrapped = unwrapPayloadData(data);
  if (!unwrapped || typeof unwrapped !== "object" || Array.isArray(unwrapped)) return [];
  const labels = {
    count: "消息总量",
    fromUser: "用户普通消息",
    fromUserRedpointCount: "用户红点消息",
    fromRobot: "机器人消息",
    fromKefu: "客服回复",
    contactCount: "触达客户",
    userMsgCount: "用户普通消息",
    userRedMsgCount: "用户红点消息",
    robotMsgCount: "机器人消息",
    accountReplyCount: "客服回复",
    userCount: "用户总数",
    total: "总数"
  };
  return Object.entries(unwrapped)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined && !Number.isNaN(Number(value)))
    .slice(0, 8)
    .map(([key, value]) => ({
      label: labels[key] || humanizeKey(key),
      value: formatStatValue(value)
    }));
}

function renderStatsChart(records) {
  const points = (records || [])
    .filter((item) => Number.isFinite(Number(item.value)))
    .map((item) => ({ ...item, value: Number(item.value) }))
    .slice(-36);
  if (!points.length) return '<div class="empty-state compact">暂无可绘制趋势数据。</div>';
  const width = 760;
  const height = 210;
  const padding = { top: 18, right: 22, bottom: 34, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const max = Math.max(...points.map((item) => Number(item.value)), 1);
  const step = points.length > 1 ? chartWidth / (points.length - 1) : chartWidth;
  const coords = points.map((item, index) => {
    const x = Math.round(padding.left + index * step);
    const y = Math.round(padding.top + chartHeight - (Number(item.value) / max) * chartHeight);
    return { x, y, item };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding.left},${padding.top + chartHeight} ${line} ${padding.left + chartWidth},${padding.top + chartHeight}`;
  const labelIndexes = uniqueNumbers([0, Math.floor((points.length - 1) / 2), points.length - 1]);
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = Math.round(padding.top + chartHeight - ratio * chartHeight);
    const value = Math.round(max * ratio);
    return `
      <line x1="${padding.left}" y1="${y}" x2="${padding.left + chartWidth}" y2="${y}" stroke="#e3ebf5" stroke-width="1"></line>
      <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" fill="#7a8798" font-size="10">${escapeHtml(value)}</text>
    `;
  }).join("");
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="消息统计趋势">
      <rect x="0" y="0" width="${width}" height="${height}" fill="transparent"></rect>
      ${gridLines}
      <polygon points="${escapeAttr(area)}" fill="rgba(22, 141, 242, 0.1)"></polygon>
      <polyline points="${escapeAttr(line)}" fill="none" stroke="#168df2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${coords.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#0d63c7"><title>${escapeHtml(point.item.label)}：${escapeHtml(point.item.value)}</title></circle>`).join("")}
      ${labelIndexes.map((index) => {
        const point = coords[index];
        return `<text x="${point.x}" y="${height - 10}" text-anchor="${index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}" fill="#68758a" font-size="10">${escapeHtml(point.item.label)}</text>`;
      }).join("")}
    </svg>
  `;
}

function showClientNoticeModal() {
  openToolModal({
    type: "client-notice",
    size: "wide",
    title: "通知",
    confirmText: "刷新",
    body: renderClientNoticeModal(),
    onConfirm: () => loadClientNotices(1)
  });
  loadClientNotices(1, { keepModalOpen: true });
  loadClientNoticeEvents();
}

async function loadClientNoticeEvents() {
  try {
    const payload = await api("/Notice/GetEvents", {
      warnType: state.clientNotice.warnType
    });
    state.clientNotice.events = getRecordsDeep(payload);
    if (state.activeModal?.type === "client-notice") renderActiveModalBody();
  } catch (error) {
    log("notice events failed", { error: error.message });
  }
}

async function loadClientNotices(page = state.clientNotice.page, options = {}) {
  syncClientNoticeFields();
  state.clientNotice.page = page;
  state.clientNotice.loading = true;
  state.clientNotice.error = "";
  renderActiveModalBody();
  try {
    const payload = await api("/Notice/GetList", {
      msgType: state.clientNotice.msgType,
      warnType: state.clientNotice.warnType,
      eventType: state.clientNotice.eventType,
      startTime: fromDateTimeLocal(state.clientNotice.startTime),
      endTime: fromDateTimeLocal(state.clientNotice.endTime),
      accountId: state.accountId || "",
      robotId: "",
      index: page,
      size: CLIENT_NOTICE_PAGE_SIZE
    });
    state.clientNotice.records = getRecordsDeep(payload).map(normalizeNoticeRecord);
    state.clientNotice.total = getTotalDeep(payload);
    state.clientNotice.unread = estimateNoticeUnread(payload, state.clientNotice.records);
    renderClientNoticeBadge();
  } catch (error) {
    state.clientNotice.records = [];
    state.clientNotice.total = 0;
    state.clientNotice.error = error.message;
  } finally {
    state.clientNotice.loading = false;
    renderActiveModalBody();
    if (!options.keepModalOpen && !state.clientNotice.error) toast("通知已刷新。");
  }
  return false;
}

async function loadClientNoticeBadge() {
  try {
    const payload = await api("/Notice/GetList", {
      index: 1,
      size: 1
    });
    const total = getTotalDeep(payload);
    state.clientNotice.unread = total;
    renderClientNoticeBadge();
  } catch (error) {
    log("notice badge failed", { error: error.message });
  }
}

function renderClientNoticeModal() {
  const notice = state.clientNotice;
  const totalText = notice.loading ? "加载中" : notice.total ? `共 ${notice.total} 条` : "暂无通知";
  const eventOptions = normalizeNoticeEvents(notice.events);
  return `
    <div class="client-notice-layout">
      <div class="client-notice-filters">
        <label class="modal-field">
          <span>消息类型</span>
          <input id="clientNoticeMsgType" value="${escapeAttr(notice.msgType)}" placeholder="留空为全部" />
        </label>
        ${renderNoticeFilterField("clientNoticeWarnType", "预警类型", notice.warnType, "warnType")}
        ${eventOptions.length ? `
          <label class="modal-field">
            <span>事件类型</span>
            <select id="clientNoticeEventType">
              <option value="">全部事件</option>
              ${eventOptions.map((event) => `<option value="${escapeAttr(event.value)}" ${String(notice.eventType) === String(event.value) ? "selected" : ""}>${escapeHtml(event.label)}</option>`).join("")}
            </select>
          </label>
        ` : renderNoticeFilterField("clientNoticeEventType", "事件类型", notice.eventType, "eventType")}
        <label class="modal-field">
          <span>开始时间</span>
          <input id="clientNoticeStart" type="datetime-local" value="${escapeAttr(notice.startTime)}" />
        </label>
        <label class="modal-field">
          <span>结束时间</span>
          <input id="clientNoticeEnd" type="datetime-local" value="${escapeAttr(notice.endTime)}" />
        </label>
        <button type="button" class="send-button" data-client-modal-action="notice-search">查询</button>
      </div>
      <div class="client-table-headline">
        <strong>通知列表</strong>
        <span>${escapeHtml(totalText)}</span>
      </div>
      ${notice.error ? `<div class="client-modal-error compact"><strong>通知读取失败</strong><p>${escapeHtml(notice.error)}</p></div>` : ""}
      <div class="notice-list">
        ${notice.records.length ? notice.records.map(renderNoticeRow).join("") : `<p class="empty-state">${notice.loading ? "正在读取真实通知..." : "暂无通知数据。"}</p>`}
      </div>
      <div class="pager-row">
        <button class="mini-action" type="button" data-client-modal-action="notice-prev" ${notice.page <= 1 || notice.loading ? "disabled" : ""}>上一页</button>
        <span>第 ${notice.page} 页</span>
        <button class="mini-action" type="button" data-client-modal-action="notice-next" ${!hasNextNoticePage() || notice.loading ? "disabled" : ""}>下一页</button>
      </div>
    </div>
  `;
}

function renderNoticeRow(item) {
  return `
    <article class="notice-row ${item.consumed ? "is-read" : ""}">
      <span class="notice-dot" aria-hidden="true"></span>
      <div class="notice-main">
        <strong>${escapeHtml(item.title || item.eventName || "通知")}</strong>
        <p>${escapeHtml(item.content || "-")}</p>
        <small>${escapeHtml([item.warnTypeName, item.robotName, item.time].filter(Boolean).join(" / "))}</small>
      </div>
      <div class="notice-actions">
        <button class="mini-action" type="button" data-copy="${escapeAttr(item.content)}">复制</button>
        <button class="mini-action" type="button" data-client-modal-action="notice-consume" data-notice-id="${escapeAttr(item.id)}" ${item.consumed ? "disabled" : ""}>已读</button>
      </div>
    </article>
  `;
}

function normalizeNoticeRecord(item, index = 0) {
  const consumedValue = firstValue(item.isRead, item.consumed, item.isConsumed, item.status === 1 ? true : "");
  return {
    ...item,
    id: firstValue(item.noticeId, item.id, item.warnId, `notice-${index}`),
    title: firstValue(item.title, item.eventName, item.warnName, item.msgTypeName, "通知"),
    content: firstValue(item.content, item.msg, item.message, item.remark, item.description, ""),
    warnTypeName: firstValue(item.warnTypeName, item.warnType, item.eventTypeName, item.eventType, ""),
    eventName: firstValue(item.eventName, item.eventTypeName, ""),
    robotName: firstValue(item.robotName, item.robotRemark, ""),
    time: formatFullTime(firstValue(item.createTime, item.createdAt, item.time, item.noticeTime, item.noticeDate, "")),
    consumed: consumedValue === true || consumedValue === 1 || consumedValue === "1" || consumedValue === "true"
  };
}

function hasNextNoticePage() {
  const notice = state.clientNotice;
  return notice.records.length >= CLIENT_NOTICE_PAGE_SIZE && (!notice.total || notice.page * CLIENT_NOTICE_PAGE_SIZE < notice.total);
}

function syncClientNoticeFields() {
  state.clientNotice.msgType = $("clientNoticeMsgType")?.value.trim() || state.clientNotice.msgType || "";
  state.clientNotice.warnType = $("clientNoticeWarnType")?.value.trim() || state.clientNotice.warnType || "";
  state.clientNotice.eventType = $("clientNoticeEventType")?.value.trim() || state.clientNotice.eventType || "";
  state.clientNotice.startTime = $("clientNoticeStart")?.value || state.clientNotice.startTime || "";
  state.clientNotice.endTime = $("clientNoticeEnd")?.value || state.clientNotice.endTime || "";
}

async function consumeClientNotice(id) {
  if (!id) return;
  try {
    await api("/Notice/ConsumeNotice", { noticeId: id });
    state.clientNotice.records = state.clientNotice.records.map((item) => (
      String(item.id) === String(id) ? { ...item, consumed: true } : item
    ));
    state.clientNotice.unread = Math.max(0, Number(state.clientNotice.unread || 0) - 1);
    renderClientNoticeBadge();
    renderActiveModalBody();
    toast("通知已标记已读。");
  } catch (error) {
    toast(`通知已读失败：${error.message}`, true);
  }
}

function renderClientNoticeBadge() {
  if (!el.clientNoticeBadge) return;
  const count = Number(state.clientNotice.unread || 0);
  el.clientNoticeBadge.textContent = count > 99 ? "99+" : String(count);
  el.clientNoticeBadge.dataset.empty = count ? "false" : "true";
}

function saveAiSettings(event) {
  event.preventDefault();
  state.aiEnabled = el.aiEnabled.checked;
  state.skillAutoReply = el.skillAutoReply.checked;
  state.skillAutoLearn = el.skillAutoLearn.checked;
  state.aiProvider = normalizeAiProviderId(el.aiProvider?.value || state.aiProvider);
  state.aiBaseUrl = normalizeAiBaseUrl(el.aiBaseUrl.value);
  state.aiApiKey = el.aiApiKey.value.trim();
  state.aiModel = normalizeAiModel(getAiModelFieldValue());
  state.aiAuthType = normalizeAiAuthType(el.aiAuthType.value);
  state.aiTemperature = clampAiTemperature(el.aiTemperature.value);
  persistActiveAiProviderDraft();
  persistAiSettings();
  aiSettingsSnapshot = null;
  hydrateAiSettingsFields();
  hideAiSettings();
  toast("AI 设置已保存。");
}

function resetAiSettings() {
  state.aiEnabled = true;
  state.skillAutoReply = false;
  state.skillAutoLearn = true;
  state.aiProvidersConfig = loadAiProviderSettings(true);
  applyAiProviderState(state.aiProvider);
  persistAiSettings();
  hydrateAiSettingsFields();
  toast("AI 设置已恢复默认。");
}

function handleAiPresetClick(event) {
  const target = event.target.closest("[data-ai-preset]");
  if (!target) return;
  const providerId = normalizeAiProviderId(target.dataset.aiPreset);
  if (!AI_PRESETS[providerId]) return;
  persistActiveAiProviderDraft();
  state.aiProvider = providerId;
  applyAiProviderState(providerId);
  hydrateAiSettingsFields();
  if (providerId === "deepseek") {
    toast("已填入 DeepSeek 官方端点和模型，请填写 DeepSeek 平台的 API Key。");
  } else if (providerId === "codebuddy") {
    toast("已切换 CodeBuddy：请填写访问密钥、确认平台给出的 API 端点和模型。");
  } else {
    toast("已填入 sub2 中转端点和模型。");
  }
}

function persistAiSettings() {
  localStorage.setItem("youchat.ai.enabled", String(state.aiEnabled));
  localStorage.setItem("youchat.skill.autoReply", String(state.skillAutoReply));
  localStorage.setItem("youchat.skill.autoLearn", String(state.skillAutoLearn));
  localStorage.setItem(AI_PROVIDER_STORAGE_KEY, state.aiProvider);
  localStorage.setItem(AI_PROVIDER_SETTINGS_STORAGE_KEY, JSON.stringify(state.aiProvidersConfig));
  updateAiButtonState();
}

async function loadAiProviderPresetsFromServer() {
  try {
    const response = await fetch("/ai/providers", { cache: "no-store" });
    const payload = parsePayload(await response.text());
    if (!response.ok || payload?.success === false) {
      throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    }
    const providers = payload?.providers;
    if (providers && typeof providers === "object") {
      const serverKeyFlags = {};
      Object.entries(providers).forEach(([providerId, preset]) => {
        if (!AI_PRESETS[providerId] || !preset || typeof preset !== "object") return;
        // Never take a key from the wire; only learn whether the server has one.
        const { hasKey, apiKey, ...presetRest } = preset;
        serverKeyFlags[providerId] = Boolean(hasKey);
        AI_PRESETS[providerId] = {
          ...AI_PRESETS[providerId],
          ...presetRest
        };
      });
      state.aiServerKeyProviders = serverKeyFlags;
      state.aiProvidersConfig = hydrateAiProviderConfigMap(state.aiProvidersConfig || {});
      state.aiProvider = normalizeAiProviderId(payload?.defaultProvider || state.aiProvider);
      applyAiProviderState(state.aiProvider);
      hydrateAiSettingsFields();
    }
  } catch (error) {
    log("load ai providers", { error: error.message });
  }
}

function normalizeAiBaseUrl(value) {
  const trimmed = String(value || "").trim() || DEFAULT_AI_BASE_URL;
  return trimmed.replace(/\/+$/, "/");
}

function normalizeAiProviderId(value) {
  const key = String(value || DEFAULT_AI_PROVIDER).trim().toLowerCase();
  return AI_PRESETS[key] ? key : DEFAULT_AI_PROVIDER;
}

// True when the server has a key configured for this provider (learned from
// /ai/providers hasKey flags). Lets AI run without the browser ever holding
// the key: proxyAi injects it server-side when we send an empty apiKey.
function aiProviderHasServerKey(providerId = state.aiProvider) {
  const key = normalizeAiProviderId(providerId);
  return Boolean(state.aiServerKeyProviders && state.aiServerKeyProviders[key]);
}

// AI is usable when the agent typed a key OR the server holds one for the
// active provider. Guards call this instead of checking state.aiApiKey.
function hasUsableAiKey() {
  return Boolean(String(state.aiApiKey || "").trim()) || aiProviderHasServerKey(state.aiProvider);
}

function normalizeAiModel(value) {
  const model = String(value || "").trim();
  return !model || model === "gpt-4o-mini" ? DEFAULT_AI_MODEL : model;
}

function normalizeAiAuthType(value) {
  const normalized = String(value || DEFAULT_AI_AUTH_TYPE).trim().toLowerCase();
  return normalized === "x-api-key" ? "x-api-key" : DEFAULT_AI_AUTH_TYPE;
}

function cloneAiPresetConfig(providerId) {
  const preset = AI_PRESETS[normalizeAiProviderId(providerId)] || AI_PRESETS[DEFAULT_AI_PROVIDER];
  return {
    label: preset.label,
    baseUrl: normalizeAiBaseUrl(preset.baseUrl || DEFAULT_AI_BASE_URL),
    apiKey: String(preset.apiKey || ""),
    model: normalizeAiModel(preset.model || DEFAULT_AI_MODEL),
    authType: normalizeAiAuthType(preset.authType || DEFAULT_AI_AUTH_TYPE),
    temperature: clampAiTemperature(preset.temperature ?? DEFAULT_AI_TEMPERATURE),
    modelOptions: normalizeAiModelOptions(preset.modelOptions || [preset.model || DEFAULT_AI_MODEL], preset.model || DEFAULT_AI_MODEL)
  };
}

function normalizeAiModelOptions(options, currentModel = "") {
  const list = [];
  const source = Array.isArray(options) ? options : [];
  source.forEach((item) => {
    const model = String(item || "").trim();
    if (model && !list.includes(model)) list.push(model);
  });
  const current = String(currentModel || "").trim();
  if (current && !list.includes(current)) list.unshift(current);
  return list;
}

function loadAiProviderSettings(forceReset = false) {
  if (!forceReset) {
    try {
      const raw = localStorage.getItem(AI_PROVIDER_SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return hydrateAiProviderConfigMap(parsed);
        }
      }
    } catch {
      // Ignore broken local storage and fall back to defaults.
    }

    const legacyBaseUrl = localStorage.getItem("youchat.ai.baseUrl");
    const legacyApiKey = localStorage.getItem("youchat.ai.apiKey");
    const legacyModel = localStorage.getItem("youchat.ai.model");
    const legacyAuthType = localStorage.getItem("youchat.ai.authType");
    const legacyTemperature = localStorage.getItem("youchat.ai.temperature");
    if (legacyBaseUrl || legacyApiKey || legacyModel || legacyAuthType || legacyTemperature) {
      const migrated = hydrateAiProviderConfigMap({
        sub2: {
          baseUrl: legacyBaseUrl || DEFAULT_AI_BASE_URL,
          apiKey: legacyApiKey || DEFAULT_AI_API_KEY,
          model: legacyModel || DEFAULT_AI_MODEL,
          authType: legacyAuthType || DEFAULT_AI_AUTH_TYPE,
          temperature: legacyTemperature ?? DEFAULT_AI_TEMPERATURE
        }
      });
      localStorage.removeItem("youchat.ai.baseUrl");
      localStorage.removeItem("youchat.ai.apiKey");
      localStorage.removeItem("youchat.ai.model");
      localStorage.removeItem("youchat.ai.authType");
      localStorage.removeItem("youchat.ai.temperature");
      localStorage.setItem(AI_PROVIDER_SETTINGS_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  }
  return hydrateAiProviderConfigMap({});
}

function hydrateAiProviderConfigMap(source = {}) {
  const config = {};
  Object.keys(AI_PRESETS).forEach((providerId) => {
    const preset = cloneAiPresetConfig(providerId);
    const stored = source && typeof source === "object" ? source[providerId] : null;
    const storedModel = String(stored?.model || "").trim();
    config[providerId] = {
      label: preset.label,
      baseUrl: normalizeAiBaseUrl(stored?.baseUrl || preset.baseUrl),
      apiKey: String(stored?.apiKey ?? preset.apiKey ?? ""),
      model: normalizeAiModel(storedModel || preset.model),
      authType: normalizeAiAuthType(stored?.authType || preset.authType),
      temperature: clampAiTemperature(stored?.temperature ?? preset.temperature),
      modelOptions: normalizeAiModelOptions(stored?.modelOptions || preset.modelOptions, storedModel || preset.model)
    };
  });
  return config;
}

function getActiveAiProviderConfig(providerId = state.aiProvider) {
  const key = normalizeAiProviderId(providerId);
  if (!state.aiProvidersConfig || typeof state.aiProvidersConfig !== "object") {
    state.aiProvidersConfig = hydrateAiProviderConfigMap({});
  }
  if (!state.aiProvidersConfig[key]) {
    state.aiProvidersConfig[key] = cloneAiPresetConfig(key);
  }
  return state.aiProvidersConfig[key];
}

function applyAiProviderState(providerId = state.aiProvider) {
  const key = normalizeAiProviderId(providerId);
  const config = getActiveAiProviderConfig(key);
  state.aiProvider = key;
  state.aiBaseUrl = normalizeAiBaseUrl(config.baseUrl);
  state.aiApiKey = String(config.apiKey || "");
  state.aiModel = normalizeAiModel(config.model);
  state.aiAuthType = normalizeAiAuthType(config.authType);
  state.aiTemperature = clampAiTemperature(config.temperature);
  state.aiModelOptions = normalizeAiModelOptions(config.modelOptions, state.aiModel);
}

function persistActiveAiProviderDraft() {
  const key = normalizeAiProviderId(state.aiProvider);
  const config = getActiveAiProviderConfig(key);
  config.baseUrl = normalizeAiBaseUrl(state.aiBaseUrl);
  config.apiKey = String(state.aiApiKey || "");
  config.model = normalizeAiModel(state.aiModel);
  config.authType = normalizeAiAuthType(state.aiAuthType);
  config.temperature = clampAiTemperature(state.aiTemperature);
  config.modelOptions = normalizeAiModelOptions(config.modelOptions, config.model);
  state.aiProvidersConfig[key] = config;
}

function syncAiModelSelect() {
  if (!el.aiModel) return;
  const options = normalizeAiModelOptions(state.aiModelOptions, state.aiModel);
  state.aiModelOptions = options;
  if (!options.length) {
    el.aiModel.innerHTML = `<option value="${escapeAttr(state.aiModel || DEFAULT_AI_MODEL)}">${escapeHtml(state.aiModel || DEFAULT_AI_MODEL)}</option>`;
    el.aiModel.value = state.aiModel || DEFAULT_AI_MODEL;
    if (el.aiModelCustom) el.aiModelCustom.value = "";
    return;
  }
  el.aiModel.innerHTML = options.map((model) => (
    `<option value="${escapeAttr(model)}"${model === state.aiModel ? " selected" : ""}>${escapeHtml(model)}</option>`
  )).join("");
  if (options.includes(state.aiModel)) {
    el.aiModel.value = state.aiModel;
    if (el.aiModelCustom) el.aiModelCustom.value = "";
  } else {
    if (options.length) el.aiModel.value = options[0];
    if (el.aiModelCustom) el.aiModelCustom.value = state.aiModel;
  }
}

function getAiModelFieldValue() {
  const custom = String(el.aiModelCustom?.value || "").trim();
  if (custom) return custom;
  return String(el.aiModel?.value || state.aiModel || DEFAULT_AI_MODEL).trim();
}

function syncAiSettingsDraftFromFields() {
  state.aiProvider = normalizeAiProviderId(el.aiProvider?.value || state.aiProvider);
  state.aiBaseUrl = normalizeAiBaseUrl(el.aiBaseUrl?.value || state.aiBaseUrl);
  state.aiApiKey = String(el.aiApiKey?.value || state.aiApiKey || "").trim();
  state.aiModel = normalizeAiModel(getAiModelFieldValue());
  state.aiAuthType = normalizeAiAuthType(el.aiAuthType?.value || state.aiAuthType);
  state.aiTemperature = clampAiTemperature(el.aiTemperature?.value ?? state.aiTemperature);
}

function handleAiProviderChange(event) {
  syncAiSettingsDraftFromFields();
  persistActiveAiProviderDraft();
  state.aiProvider = normalizeAiProviderId(event.target.value);
  applyAiProviderState(state.aiProvider);
  hydrateAiSettingsFields();
}

async function fetchAiModelsForActiveProvider() {
  if (state.aiFetchingModels) return;
  state.aiProvider = normalizeAiProviderId(el.aiProvider?.value || state.aiProvider);
  state.aiBaseUrl = normalizeAiBaseUrl(el.aiBaseUrl.value);
  state.aiApiKey = el.aiApiKey.value.trim();
  state.aiAuthType = normalizeAiAuthType(el.aiAuthType.value);
  state.aiModel = normalizeAiModel(getAiModelFieldValue());
  state.aiFetchingModels = true;
  updateAiButtonState();
  try {
    const response = await fetch("/ai/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: state.aiProvider,
        baseUrl: state.aiBaseUrl,
        apiKey: state.aiApiKey,
        authType: state.aiAuthType
      })
    });
    const payload = parsePayload(await response.text());
    const models = Array.isArray(payload?.models) ? payload.models : [];
    if (!response.ok) throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    if (!models.length) throw new Error(payload?.warning || "链幏鍙栧埌妯″瀷鍒楄〃");
    state.aiModelOptions = normalizeAiModelOptions(models, state.aiModel);
    if (!state.aiModelOptions.includes(state.aiModel)) state.aiModel = state.aiModelOptions[0] || state.aiModel;
    persistActiveAiProviderDraft();
    syncAiModelSelect();
    toast(payload?.source === "upstream" ? "妯″瀷鍒楄〃宸叉洿鏂?" : "宸蹭娇鐢ㄥ凡楠岃瘉妯″瀷鍒楄〃");
  } catch (error) {
    toast(`鑾峰彇妯″瀷澶辫触锛?{error.message}`, true);
  } finally {
    state.aiFetchingModels = false;
    updateAiButtonState();
  }
}

function getAiRelayBasePayload(temperature = state.aiTemperature) {
  return {
    providerId: state.aiProvider,
    baseUrl: state.aiBaseUrl,
    apiKey: state.aiApiKey,
    model: state.aiModel,
    authType: state.aiAuthType,
    temperature: clampAiTemperature(temperature)
  };
}

function normalizeSendMode(value) {
  return value === "ctrl-enter" ? "ctrl-enter" : "enter";
}

function clampAiTemperature(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return DEFAULT_AI_TEMPERATURE;
  return Math.min(2, Math.max(0, number));
}

function updateAiButtonState() {
  if (el.aiSuggest) {
    el.aiSuggest.disabled = state.aiGenerating || !state.aiEnabled;
    el.aiSuggest.textContent = state.aiGenerating ? "AI 生成中" : "AI 推荐";
    el.aiSuggest.title = state.aiEnabled ? "" : "AI 推荐已在设置中关闭";
  }
  [el.optimizeDraft, el.optimizeDraftInline].filter(Boolean).forEach((button) => {
    button.disabled = state.aiGenerating || !state.aiEnabled || !hasUsableAiKey();
    button.textContent = state.aiGenerating ? "优化中" : "优化文案";
    button.title = state.aiEnabled ? "把当前输入优化成更贴心、耐心、容易理解的回复" : "AI 已在设置中关闭";
  });
  if (el.fetchAiModels) {
    el.fetchAiModels.disabled = state.aiFetchingModels;
    el.fetchAiModels.textContent = state.aiFetchingModels ? "获取中" : "获取模型";
  }
  if (el.refreshAiSuggestion) {
    el.refreshAiSuggestion.disabled = state.aiGenerating || !state.aiEnabled || !state.aiSuggestion;
    el.refreshAiSuggestion.textContent = state.aiGenerating ? "生成中" : "换一换";
  }
  renderAiSuggestionCard();
}

Object.assign(AI_PRESETS.sub2, cloneAiPresetConfig("sub2"));
Object.assign(AI_PRESETS.deepseek, cloneAiPresetConfig("deepseek"));
Object.assign(AI_PRESETS.codebuddy, cloneAiPresetConfig("codebuddy"));

function loadStoredApiBase() {
  const stored = localStorage.getItem("youchat.apiBase");
  if (!stored) return DEFAULT_API_BASE;
  const normalized = normalizeApiBase(stored);
  if (LEGACY_DEFAULT_API_BASES.has(normalized)) {
    localStorage.setItem("youchat.apiBase", DEFAULT_API_BASE);
    return DEFAULT_API_BASE;
  }
  return normalized;
}

function parseApiBase(value) {
  const normalized = normalizeApiBase(value || DEFAULT_API_BASE);
  try {
    const url = new URL(normalized);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const isFull = url.protocol === "https:" || path !== "/api";
    return {
      address: normalized,
      host: url.hostname,
      port: url.port || (url.protocol === "https:" ? "443" : "80"),
      isFull
    };
  } catch {
    return { address: DEFAULT_API_BASE, host: "192.168.9.83", port: "18080", isFull: false };
  }
}

function buildApiBase() {
  const address = el.serverAddress.value.trim() || DEFAULT_API_BASE;
  const port = el.serverPort.value.trim();
  return normalizeApiBaseFromFields(address, port);
}

function normalizeApiBaseFromFields(address, port) {
  const raw = String(address || DEFAULT_API_BASE).trim();
  if (/^https?:\/\//i.test(raw)) return normalizeApiBase(raw);
  if (raw.includes("/")) return normalizeApiBase(`http://${raw}`);
  const hostMatch = raw.match(/^([^:]+):(\d+)$/);
  const host = hostMatch ? hostMatch[1] : raw;
  const resolvedPort = port || (hostMatch ? hostMatch[2] : "18080");
  return normalizeApiBase(`http://${host}:${resolvedPort}/api`);
}

function normalizeApiBase(value) {
  const raw = String(value || DEFAULT_API_BASE).trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_API_BASE;
  return (/^https?:\/\//i.test(raw) ? raw : `http://${raw}`).replace(/\/+$/, "");
}

function getSignalRBaseUrl() {
  try {
    const url = new URL(state.apiBase || DEFAULT_API_BASE);
    const apiPath = url.pathname.replace(/\/+$/, "");
    if (apiPath.toLowerCase().endsWith("/api")) {
      url.pathname = apiPath.slice(0, -4) || "/";
    }
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return String(state.apiBase || DEFAULT_API_BASE).replace(/\/api\/?$/i, "").replace(/\/+$/, "");
  }
}

function getSignalRAccountId() {
  return String(firstValue(getContactListAccountId(), state.accountId, state.account, "") || "").trim();
}

function buildSignalRUrl() {
  const base = getSignalRBaseUrl();
  const userName = encodeURIComponent(getSignalRAccountId());
  return `${base}/chathub?mode=client&userName=${userName}`;
}

function isSignalRConnected() {
  return Boolean(state.signalRConnection && state.signalRConnection.state === "Connected");
}

async function ensureSignalRConnection() {
  if (!window.signalR?.HubConnectionBuilder) {
    throw new Error("SignalR browser client is not loaded");
  }
  if (window.location.protocol === "https:" && /^http:\/\//i.test(getSignalRBaseUrl())) {
    throw new Error("HTTPS 页面已禁用浏览器直连 HTTP SignalR，请使用本地 SignalR 桥");
  }
  const accountId = getSignalRAccountId();
  if (!accountId) {
    throw new Error("missing account id for SignalR registration");
  }
  const targetUrl = buildSignalRUrl();
  if (isSignalRConnected() && state.signalRUrl === targetUrl) {
    return state.signalRConnection;
  }
  if (state.signalRConnecting) return state.signalRConnecting;

  state.signalRConnecting = (async () => {
    if (state.signalRConnection && state.signalRConnection.state !== "Disconnected") {
      try {
        await state.signalRConnection.stop();
      } catch (error) {
        log("SignalR stop before reconnect failed", { error: error.message });
      }
    }

    const builder = new window.signalR.HubConnectionBuilder()
      .withUrl(targetUrl)
      .withKeepAliveInterval(SIGNALR_KEEP_ALIVE_MS)
      .withAutomaticReconnect();
    if (window.signalR.LogLevel) builder.configureLogging(window.signalR.LogLevel.Warning);
    const connection = builder.build();
    connection.onclose((error) => {
      state.signalRStatus = "closed";
      log("SignalR closed", { error: error?.message || "" });
    });
    connection.onreconnected((connectionId) => {
      state.signalRStatus = "connected";
      log("SignalR reconnected", { connectionId });
      registerSignalRUser(connection).catch((error) => log("SignalR register after reconnect failed", { error: error.message }));
    });

    state.signalRStatus = "connecting";
    await withTimeout(connection.start(), SIGNALR_START_TIMEOUT_MS, "SignalR start");
    state.signalRConnection = connection;
    state.signalRUrl = targetUrl;
    await registerSignalRUser(connection);
    state.signalRStatus = "connected";
    log("SignalR connected", { url: targetUrl, accountId });
    return connection;
  })();

  try {
    return await state.signalRConnecting;
  } finally {
    state.signalRConnecting = null;
  }
}

async function registerSignalRUser(connection = state.signalRConnection) {
  if (!connection || connection.state !== "Connected") return;
  const accountId = getSignalRAccountId();
  if (!accountId) return;
  await connection.invoke("RegisterUser", accountId, false, false, 0);
  log("SignalR user registered", { accountId, mode: 0 });
}

async function stopSignalRConnection() {
  state.signalRConnecting = null;
  const connection = state.signalRConnection;
  state.signalRConnection = null;
  state.signalRUrl = "";
  if (!connection) return;
  try {
    if (connection.state === "Connected") {
      const accountId = getSignalRAccountId();
      if (accountId) {
        try {
          await connection.invoke("UnRegisterUser", accountId);
        } catch (error) {
          log("SignalR unregister failed", { error: error.message });
        }
      }
    }
    await connection.stop();
  } catch (error) {
    log("SignalR stop failed", { error: error.message });
  } finally {
    state.signalRStatus = "idle";
  }
}

function withTimeout(promise, timeoutMs, label) {
  let timer = null;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`)), timeoutMs);
    })
  ]).finally(() => window.clearTimeout(timer));
}

function persistLoginConfig() {
  state.apiBase = buildApiBase().replace(/\/+$/, "");
  const previousAccount = state.account;
  state.account = el.username.value.trim();
  state.remember = el.rememberAccount.checked;
  localStorage.setItem("youchat.apiBase", state.apiBase);
  localStorage.setItem("youchat.remember", String(state.remember));

  if (previousAccount && previousAccount !== state.account) {
    state.accountId = "";
    state.accountIdResolved = false;
    state.contactListAccountIds = [];
    localStorage.removeItem("youchat.accountId");
    localStorage.removeItem(CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY);
  }

  if (state.remember) {
    localStorage.setItem("youchat.account", state.account);
  } else {
    localStorage.removeItem("youchat.account");
  }

  if (state.token) {
    localStorage.setItem("youchat.token", state.token);
    sessionStorage.setItem("u-token", state.token);
  }
}

async function connect(event) {
  event.preventDefault();
  persistLoginConfig();
  setConnectLoading(true);

  try {
    const options = await api("/System/GetOptions", {});
    state.apiStatus = "已连接";
    log("system options", summarize(options));

    await loginIfPossible();
    state.accountIdResolved = false;
    await ensureContactListAccountId();
    ensureSignalRConnection().catch((error) => log("SignalR connect failed", { error: error.message, url: buildSignalRUrl() }));
    showWorkbench();
    await Promise.all([loadContacts(), loadFaq(), loadFriendRequestBadgeTotals(), loadClientNoticeBadge()]);
    await Promise.all([loadMessages(1, "replace", { forceBottom: true }), loadContactInfo(), loadToolDataForActiveTab()]);
    startAutoRefresh();
    toast("已连接真实接口，当前页面不再使用假数据。");
  } catch (error) {
    state.apiStatus = "连接失败";
    updateConnectionState(true);
    toast(`连接失败：${error.message}`, true);
    log("connect error", { error: error.message, apiBase: state.apiBase });
  } finally {
    setConnectLoading(false);
  }
}

function setConnectLoading(loading) {
  el.connectButton.disabled = loading;
  el.connectButton.textContent = loading ? "连接中" : "连接";
}

async function loginIfPossible() {
  const userName = el.username.value.trim();
  const userPsw = el.password.value.trim();
  if (!userName || !userPsw) return;

  const payload = await api("/System/LogIn", { userName, userPsw });
  const data = getData(payload);
  const token = data?.token || data?.accessToken || data?.access_token || data?.Authorization || payload?.token;
  if (token) {
    state.token = token;
    persistLoginConfig();
  }

  updateAccountIdentity(payload);

  if (payload?.message) {
    log("login message", { message: payload.message, data });
  }
}

function updateAccountIdentity(payload) {
  const data = getData(payload) || {};
  const account = data.account || payload?.account || {};
  const accountId = firstValue(
    account.id,
    account.accId,
    data.accId,
    data.id
  );

  if (accountId) {
    state.accountId = String(accountId);
    state.accountIdResolved = false;
    localStorage.setItem("youchat.accountId", state.accountId);
  }
}

function showWorkbench() {
  el.loginView.classList.add("is-hidden");
  el.workbenchView.classList.remove("is-hidden");
  el.operatorName.textContent = `客服 ${state.account || "未登录"}`;
  updateConnectionState(false);
  updateClientChromeState();
  updateMobilePanelState();
}

function showLogin() {
  stopAutoRefresh();
  stopSignalRConnection().catch((error) => log("SignalR stop on login view failed", { error: error.message }));
  el.workbenchView.classList.add("is-hidden");
  el.loginView.classList.remove("is-hidden");
  setMobilePanel("list");
}

function updateConnectionState(failed) {
  el.connectionState.textContent = state.clientPaused && state.apiStatus === "已连接" ? "已挂起" : state.apiStatus;
  el.connectionState.classList.toggle("offline", Boolean(failed));
  el.connectionState.classList.toggle("paused", Boolean(state.clientPaused && !failed));
  updateClientChromeState();
}

function togglePassword() {
  const isPassword = el.password.type === "password";
  el.password.type = isPassword ? "text" : "password";
  el.togglePassword.classList.toggle("is-visible", isPassword);
  el.togglePassword.title = isPassword ? "隐藏密码" : "显示密码";
  el.togglePassword.setAttribute("aria-label", isPassword ? "隐藏密码" : "显示密码");
}

function renderAll() {
  renderContacts();
  renderConversationTabs();
  renderFriendRequestBadge();
  renderActive();
  renderMessages();
  renderToolContent();
  renderWithdrawRiskSignal();
  updateMobilePanelState();
}

function isMobileWorkbench() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(MOBILE_WORKBENCH_QUERY).matches;
  }
  return window.innerWidth <= 760;
}

const TABLET_WORKBENCH_QUERY = "(min-width: 761px) and (max-width: 1120px)";

function isTabletWorkbench() {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(TABLET_WORKBENCH_QUERY).matches;
  }
  return window.innerWidth > 760 && window.innerWidth <= 1120;
}

// 平板/窄笔记本(761-1120px)下工具栏是右侧抽屉，用 data-tool-drawer 开合。
function toggleToolDrawer(open) {
  if (!el.workbenchView) return;
  const next = open === undefined
    ? el.workbenchView.dataset.toolDrawer !== "open"
    : Boolean(open);
  el.workbenchView.dataset.toolDrawer = next ? "open" : "closed";
}

function setMobilePanel(panel) {
  state.mobilePanel = ["list", "chat", "tool"].includes(panel) ? panel : "list";
  updateMobilePanelState();
}

function updateMobilePanelState() {
  if (!el.workbenchView) return;
  const panel = ["list", "chat", "tool"].includes(state.mobilePanel) ? state.mobilePanel : "list";
  el.workbenchView.dataset.mobilePanel = panel;
}

function renderFriendRequestBadge() {
  if (!el.friendRequestBadge) return;
  const count = Number(state.friendRequestBadgeTotal || state.friendSourceCounts.all || state.friendRequestTotal || 0);
  el.friendRequestBadge.textContent = count > 99 ? "99+" : String(count);
  el.friendRequestBadge.dataset.empty = count ? "false" : "true";
}

function renderConversationTabs() {
  document.querySelectorAll("[data-list-tab]").forEach((button) => {
    const tab = button.dataset.listTab;
    const labels = { current: "当前", guestbook: "留言", history: "历史" };
    const count = getConversationTabCount(tab);
    const unread = getListUnreadCount(tab);
    button.classList.toggle("is-active", tab === state.listTab);
    button.classList.toggle("has-unread", unread > 0);
    button.setAttribute("aria-label", `${labels[tab] || tab}${count ? ` ${count}` : ""}${unread ? `，${unread} 条未读` : ""}`);
    button.title = "";
    button.innerHTML = `
      <span>${labels[tab] || tab}</span>
      <em>(${formatTabCount(count)})</em>
      ${unread ? `<i>${unread > 99 ? "99+" : unread}</i>` : ""}
    `;
  });
}

function getConversationTabCount(tab) {
  const total = Number(state.listCounts[tab] || 0);
  if (tab === "history") {
    const serverCount = Number(state.listServerCounts.history || 0);
    if (serverCount || state.listCountSources.history === "server") return serverCount;
  }
  return total;
}

function formatTabCount(value) {
  const count = Number(value || 0);
  return count > 9999 ? "9999+" : String(count);
}

function apiPath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/api${normalized}?__target=${encodeURIComponent(state.apiBase)}`;
}

async function fetchWithTimeout(resource, options = {}, timeoutMs = API_REQUEST_TIMEOUT_MS, label = "request") {
  const controller = new AbortController();
  const externalSignal = options.signal;
  let timedOut = false;
  const timer = window.setTimeout(() => {
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
    window.clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener("abort", abortFromExternal);
  }
}

async function api(path, data = {}, options = {}) {
  const method = options.method || "POST";
  const headers = {};
  if (state.token) headers.Authorization = state.token;
  if (options.headers) Object.assign(headers, options.headers);

  let body;
  if (options.asJson) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  } else {
    body = toFormData(data);
  }

  const started = Date.now();
  const response = await fetchWithTimeout(apiPath(path), {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method) ? undefined : body
  }, options.timeoutMs || API_REQUEST_TIMEOUT_MS, `${method} ${path}`);
  const text = await response.text();
  const payload = parsePayload(text);

  log(`${method} ${path}`, {
    status: response.status,
    ms: Date.now() - started,
    request: data,
    response: summarize(payload)
  });

  if (!response.ok) {
    throw new Error(getMessage(payload) || `HTTP ${response.status}`);
  }

  if (payload && payload.success === false) {
    throw new Error(getMessage(payload) || "接口返回失败");
  }

  return payload;
}

function toFormData(data) {
  const form = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") form.append(key, item);
      });
      return;
    }
    form.append(key, typeof value === "object" ? JSON.stringify(value) : value);
  });
  return form;
}

function parsePayload(text) {
  if (!text) return null;
  try {
    return JSON.parse(preserveLongIntegers(text));
  } catch {
    return text;
  }
}

function preserveLongIntegers(text) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length;) {
    const char = text[index];

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      index += 1;
      continue;
    }

    if (char === "\"") {
      inString = true;
      result += char;
      index += 1;
      continue;
    }

    if (char === "-" || (char >= "0" && char <= "9")) {
      const previous = previousNonWhitespace(text, index - 1);
      const match = text.slice(index).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
      if (match && [":", ",", "["].includes(previous)) {
        const token = match[0];
        const integerPart = token.replace(/^-/, "").split(/[.eE]/)[0];
        const next = nextNonWhitespace(text, index + token.length);
        if (!/[.eE]/.test(token) && integerPart.length >= 16 && [",", "}", "]"].includes(next)) {
          result += `"${token}"`;
          index += token.length;
          continue;
        }
      }
    }

    result += char;
    index += 1;
  }

  return result;
}

function previousNonWhitespace(text, index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    if (!/\s/.test(text[cursor])) return text[cursor];
  }
  return "";
}

function nextNonWhitespace(text, index) {
  for (let cursor = index; cursor < text.length; cursor += 1) {
    if (!/\s/.test(text[cursor])) return text[cursor];
  }
  return "";
}

function getMessage(payload) {
  if (!payload) return "";
  return payload.message || payload.msg || payload.error || "";
}

function getData(payload) {
  if (!payload) return null;
  if (payload.data !== undefined) return payload.data;
  if (payload.result !== undefined) return payload.result;
  if (payload.response !== undefined) return payload.response;
  return payload;
}

function getRecords(payload) {
  const data = getData(payload);
  if (!data || data === 0) return [];
  if (Array.isArray(data)) return data;
  const candidates = [data.records, data.rows, data.list, data.items, data.data, data.result];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested = candidate.records || candidate.rows || candidate.list || candidate.items || candidate.data;
      if (Array.isArray(nested)) return nested;
    }
  }
  return [];
}

function getTotal(payload) {
  const data = getData(payload);
  return Number(data?.total || data?.count || getRecords(payload).length || 0);
}

function getExplicitTotal(payload) {
  const data = getData(payload);
  const value = data?.total ?? data?.count ?? payload?.total ?? payload?.count;
  return value === undefined || value === null || value === "" ? null : Number(value);
}

function hasZeroDataPayload(payload) {
  return getData(payload) === 0;
}

function summarize(payload) {
  const text = JSON.stringify(payload);
  if (!text || text.length < 900) return payload;
  return `${text.slice(0, 900)}...`;
}

function getContactListAccountId() {
  return getContactListAccountCandidates()[0] || "";
}

async function getBulkAccessAccountId(contact = state.activeContact) {
  const contactAccountId = firstValue(contact?.accountId, contact?.accId, contact?.csAccountId, contact?.account?.id);
  const candidates = uniqueContactListAccountIds([
    getContactListAccountId(),
    await ensureContactListAccountId(),
    state.accountIdResolved ? state.accountId : "",
    contactAccountId
  ], state.account, { strictShortId: true });
  return candidates[0] || "";
}

function getContactListAccountCandidates() {
  const verified = Array.isArray(state.contactListAccountIds) ? state.contactListAccountIds : [];
  return uniqueContactListAccountIds([
    state.accountIdResolved ? state.accountId : "",
    ...verified,
    verified.includes(String(state.accountId || "")) ? state.accountId : ""
  ], state.account, { strictShortId: true });
}

function buildContactListParams(tab = state.listTab, options = {}) {
  const keyword = options.keyWord ?? options.searchStr ?? el.search?.value?.trim() ?? "";
  const params = {
    pageIndex: options.pageIndex || 1,
    pageSize: options.pageSize || CONTACT_LIST_PAGE_SIZE,
    id: options.id !== undefined ? options.id : 0,
    isGuestbook: false,
    isHistory: false
  };
  if (keyword) params.keyWord = keyword;
  if (tab === "guestbook") params.isGuestbook = true;
  if (tab === "history") params.isHistory = true;
  if (tab === "current" && !options.omitAccountId) {
    const accountId = options.accountIdOverride !== undefined
      ? options.accountIdOverride
      : getContactListAccountId();
    if (accountId) params.accountId = accountId;
  }
  return params;
}

async function ensureContactListAccountId() {
  const resolvedAccountId = uniqueContactListAccountIds([state.accountId], state.account, { strictShortId: true })[0] || "";
  if (state.accountIdResolved && resolvedAccountId) return resolvedAccountId;
  const storedCandidate = getContactListAccountId();
  try {
    const payload = await api("/Senstive/GetAccountList", {}, { method: "GET" });
    const accounts = getRecords(payload);
    const matched = accounts.find((account) => (
      String(account.userName || account.accountName || account.nickName || "") === String(state.account)
    )) || accounts[0];
    rememberContactListAccountIds(accounts, matched);
    const accountId = getContactListAccountCandidates()[0];
    if (accountId) {
      state.accountId = String(accountId);
      state.accountIdResolved = true;
      localStorage.setItem("youchat.accountId", state.accountId);
      return state.accountId;
    }
  } catch (error) {
    log("account list probe failed", { error: error.message });
  }

  if (storedCandidate) return storedCandidate;
  return "";
}

async function fetchContactListWithFallback(tab = state.listTab, options = {}) {
  if (tab !== "current" || options.omitAccountId) {
    return fetchContactListPayload(tab, {
      ...options,
      omitAccountId: tab === "current" ? true : options.omitAccountId
    }, {
      source: tab === "current" ? "global-filtered" : "server"
    });
  }

  let globalResult = null;
  const candidates = getContactListAccountCandidates();
  try {
    globalResult = await fetchContactListPayload(tab, {
      ...options,
      omitAccountId: true
    }, {
      source: "global-filtered"
    });
    if (!candidates.length && isUsefulContactListResult(globalResult)) {
      return globalResult;
    }
  } catch (error) {
    log("contact list client-compatible request failed", { error: error.message });
  }

  const emptyAccountResults = [];
  for (const accountId of candidates) {
    try {
      const result = await fetchContactListPayload(tab, {
        ...options,
        accountIdOverride: accountId
      }, {
        source: "account",
        accountIdUsed: accountId
      });
      if (isUsefulContactListResult(result)) return result;
      emptyAccountResults.push(result);
    } catch (error) {
      log("contact list account filter failed", { accountId, error: error.message });
    }
  }

  if (globalResult && (isUsefulContactListResult(globalResult) || isExplicitEmptyContactListResult(globalResult) || globalResult.isZeroData)) {
    return {
      ...globalResult,
      source: candidates.length ? "global-fallback" : "global",
      emptyAccountResults
    };
  }

  if (emptyAccountResults.length) {
    return {
      ...emptyAccountResults[0],
      source: "account-empty"
    };
  }
  throw new Error("当前会话列表接口未返回可用数据");
}

async function fetchContactListPayload(tab, options = {}, metadata = {}) {
  const params = buildContactListParams(tab, options);
  const payload = await api("/Contact/GetContactList", params);
  const rawContacts = getRecords(payload).map(normalizeContact).map(applyReadStateToContact);
  const isGlobalCurrent = tab === "current" && String(metadata.source || "").startsWith("global");
  const contacts = sortContacts(isGlobalCurrent ? filterCurrentConversationContacts(rawContacts) : rawContacts);
  const explicitTotal = isGlobalCurrent ? contacts.length : getExplicitTotal(payload);
  return {
    payload,
    params,
    contacts,
    rawContacts,
    explicitTotal,
    total: isGlobalCurrent ? contacts.length : getContactListPayloadTotal(payload, contacts),
    isZeroData: hasZeroDataPayload(payload),
    source: metadata.source || "server",
    accountIdUsed: metadata.accountIdUsed || params.accountId || ""
  };
}

function getContactListPayloadTotal(payload, contacts = getRecords(payload)) {
  const explicitTotal = getExplicitTotal(payload);
  if (explicitTotal !== null) return Math.max(0, Number(explicitTotal || 0));
  return hasZeroDataPayload(payload) ? 0 : contacts.length;
}

function isUsefulContactListResult(result) {
  return Boolean(result?.contacts?.length) || Number(result?.explicitTotal || 0) > 0;
}

function isExplicitEmptyContactListResult(result) {
  return result?.explicitTotal === 0 && !result?.isZeroData;
}

function isCurrentConversationContact(contact) {
  if (!contact) return false;
  const conversationId = Number(contact.conversationId || contact.conversation?.id || 0);
  const accountId = Number(contact.accountId || contact.accId || contact.csAccountId || contact.conversation?.accountId || 0);
  return conversationId > 0 && accountId > 0;
}

function filterCurrentConversationContacts(contacts) {
  return (contacts || []).filter(isCurrentConversationContact);
}

function mergeContacts(existingContacts, nextContacts) {
  const merged = new Map();
  [...(existingContacts || []), ...(nextContacts || [])].forEach((contact, index) => {
    const key = String(getContactId(contact) || `contact-${index}`);
    const previous = merged.get(key);
    merged.set(key, previous ? { ...previous, ...contact } : contact);
  });
  return sortContacts([...merged.values()]);
}

function getContactListHasMore({ mode, contacts, pageSize, total, previousHasMore, previousCount, nextCount }) {
  return getPagedHasMore({
    mode,
    records: contacts,
    pageSize,
    total,
    previousHasMore,
    previousCount,
    nextCount
  });
}

function shouldPreserveEmptyContactResult(result, contacts, options = {}) {
  const hasSearch = Boolean(el.search?.value?.trim());
  const existingLooksCurrent = state.contacts.length > 0 && state.contacts.every(isCurrentConversationContact);
  return state.listTab === "current"
    && !hasSearch
    && !options.allowEmpty
    && existingLooksCurrent
    && contacts.length === 0
    && (result?.isZeroData || result?.source === "account-empty");
}

async function loadContactCounts() {
  await ensureContactListAccountId();
  const tabs = ["current", "guestbook", "history"];
  const results = await Promise.allSettled(tabs.map((tab) => (
    fetchContactListWithFallback(tab, { pageSize: 20, keyWord: "" })
  )));

  results.forEach((result, index) => {
    const tab = tabs[index];
    if (result.status !== "fulfilled") {
      if (tab === "current" && state.contacts.length) {
        state.listCounts.current = Math.max(Number(state.listCounts.current || 0), state.contacts.length);
        state.listCountSources.current = "stale";
      }
      log("contact count load failed", { tab, error: result.reason?.message || String(result.reason) });
      return;
    }
    const data = result.value;
    if (tab !== "history" && shouldKeepListLocallyCleared(tab)) {
      state.listServerCounts[tab] = 0;
      state.listCounts[tab] = tab === state.listTab ? state.contacts.length : 0;
      state.listCountSources[tab] = "local-cleared";
      return;
    }
    const existingLooksCurrent = state.contacts.length > 0 && state.contacts.every(isCurrentConversationContact);
    if (tab === "current" && existingLooksCurrent && (data.source === "account-empty" || data.isZeroData)) {
      state.listCounts.current = Math.max(Number(state.listCounts.current || 0), state.contacts.length);
      state.listServerCounts.current = Math.max(Number(state.listServerCounts.current || 0), state.contacts.length);
      state.listCountSources.current = "stale";
      return;
    }
    const normalizedTotal = Math.max(0, Number(data.total || 0));
    state.listServerCounts[tab] = normalizedTotal;
    state.listCountSources[tab] = data.source || "server";
    state.listCounts[tab] = normalizedTotal;
  });
  renderConversationTabs();
}

async function loadContacts(options = {}) {
  state.contactListLoading = true;
  try {
    await ensureContactListAccountId();
    const mode = options.mode || "replace";
    const page = Number(options.page || (mode === "append" ? (state.contactListPage || 1) + 1 : 1)) || 1;
    const previousHasMore = state.contactListHasMore;
    const previousCount = state.contacts.length;
    const selectedId = getContactId(state.activeContact);
    const previousContactScrollTop = el.contactList.scrollTop;
    const previousContactScrollHeight = el.contactList.scrollHeight;
    const previousContactWasNearBottom = isNearBottom(el.contactList, CONTACT_LIST_AUTOLOAD_THRESHOLD);
    const previousToolScrollTop = el.toolContent.scrollTop;
    const previousHistoryList = el.toolContent.querySelector("[data-history-list]");
    const previousHistoryScrollTop = previousHistoryList?.scrollTop || 0;
    const previousHistoryWasNearBottom = isNearBottom(previousHistoryList);
    const preserveScroll = Boolean(options.preserveScroll);
    const result = await fetchContactListWithFallback(state.listTab, {
      pageIndex: page,
      pageSize: options.pageSize || CONTACT_LIST_PAGE_SIZE,
      keyWord: options.keyWord,
      searchStr: options.searchStr,
      omitAccountId: options.omitAccountId,
      accountIdOverride: options.accountIdOverride
    });
    let contacts = result.contacts;
    const serverTotal = Math.max(0, Number(result.total || 0));
    state.listServerCounts[state.listTab] = serverTotal;
    state.listCountSources[state.listTab] = result.source || "server";
    let locallyFiltered = false;
    if (state.listTab !== "history") {
      const beforeFilterCount = contacts.length;
      contacts = filterLocallyClearedContacts(state.listTab, contacts);
      locallyFiltered = contacts.length !== beforeFilterCount || shouldKeepListLocallyCleared(state.listTab);
    }

    if (shouldPreserveEmptyContactResult(result, contacts, options)) {
      state.listCountSources.current = "stale";
      state.listUnreadCounts.current = sumContactUnread(state.contacts);
      state.contactListHasMore = false;
      renderConversationTabs();
      renderContacts();
      log("preserved current contacts after ambiguous empty response", {
        source: result.source,
        accountId: result.accountIdUsed,
        fallbackError: result.fallbackError || "",
        previousCount: state.contacts.length
      });
      return;
    }

    const nextContacts = mode === "append"
      ? mergeContacts(state.contacts, contacts)
      : mode === "merge"
      ? mergeContacts(contacts, state.contacts)
      : contacts;
    state.contacts = nextContacts;
    state.contactListPage = mode === "merge" ? Math.max(state.contactListPage || 1, page) : page;
    state.contactListHasMore = getContactListHasMore({
      mode,
      contacts,
      pageSize: options.pageSize || CONTACT_LIST_PAGE_SIZE,
      total: serverTotal,
      previousHasMore,
      previousCount,
      nextCount: nextContacts.length
    });
    state.totalContacts = state.listTab === "history"
      ? Math.max(nextContacts.length, serverTotal)
      : locallyFiltered
      ? nextContacts.length
      : Math.max(nextContacts.length, serverTotal);
    state.listCounts[state.listTab] = state.totalContacts || state.contacts.length;
    state.listUnreadCounts[state.listTab] = sumContactUnread(state.contacts);
    const previousActiveAvatar = getContactAvatar(state.activeContact);
    state.activeContact = state.contacts.find((contact) => String(getContactId(contact)) === String(selectedId)) || state.contacts[0] || null;
    const activeChanged = String(selectedId || "") !== String(getContactId(state.activeContact) || "");
    const activeAvatarChanged = !activeChanged && previousActiveAvatar !== getContactAvatar(state.activeContact);
    renderConversationTabs();
    renderContacts();
    renderActive();
    if (activeChanged || !state.messages.length) {
      renderMessagesFromContactPreview();
    } else if (activeAvatarChanged) {
      renderMessagesPreservingScroll();
    }
    renderToolContent();
    if (!options.skipCounts) {
      loadContactCounts().catch((error) => log("contact counts failed", { error: error.message }));
    }
    if (mode === "append") {
      restoreScrollTop(el.contactList, previousContactScrollTop);
    } else if (preserveScroll) {
      el.contactList.scrollTop = previousContactScrollTop;
      el.toolContent.scrollTop = previousToolScrollTop;
      const nextHistoryList = el.toolContent.querySelector("[data-history-list]");
      if (nextHistoryList) {
        if (previousHistoryWasNearBottom) {
          scrollElementToBottom(nextHistoryList, { watchImages: true });
        } else {
          nextHistoryList.scrollTop = previousHistoryScrollTop;
        }
      }
    }
    if (mode !== "append") {
      scheduleContactListViewportFill();
    }
  } catch (error) {
    if (options.preserveScroll && state.contacts.length) {
      state.listCountSources[state.listTab] = "stale";
      renderConversationTabs();
      renderContacts();
      log("contact refresh preserved existing list after failure", { error: error.message });
      return;
    }
    state.contacts = [];
    state.contactListPage = 1;
    state.contactListHasMore = false;
    state.activeContact = null;
    state.messages = [];
    renderAll();
    toast(`会话接口失败：${error.message}`, true);
  } finally {
    state.contactListLoading = false;
  }
}

async function showFriendRequestsDialog() {
  state.friendRequestDialogOpen = true;
  await loadFriendRequests(1);
  renderFriendRequestsDialog();
}

async function loadFriendRequests(page = state.friendRequestPage) {
  state.friendRequestLoading = true;
  state.friendRequestPage = page;
  try {
    const result = state.friendRequestSource
      ? await loadFriendRequestsBySource(state.friendRequestSource, page, 10)
      : await loadAllFriendRequestSources(page, 10);
    state.friendRequests = result.records;
    state.friendRequestTotal = result.total;
    if (result.sourceCounts) state.friendSourceCounts = result.sourceCounts;
    if (!state.friendRequestSource) {
      state.friendRequestBadgeTotal = Number(result.sourceCounts?.all ?? result.total ?? 0);
    }
    if (state.friendRequestSource) {
      state.friendSourceCounts = {
        ...state.friendSourceCounts,
        [state.friendRequestSource]: result.total
      };
      state.friendRequestBadgeTotal = Number(state.friendSourceCounts.all || state.friendRequestBadgeTotal || result.total || 0);
    }
    renderFriendRequestBadge();
  } catch (error) {
    state.friendRequests = [];
    state.friendRequestTotal = 0;
    toast(`好友请求接口失败：${error.message}`, true);
  } finally {
    state.friendRequestLoading = false;
  }
}

async function loadFriendRequestBadgeTotals() {
  try {
    const results = await Promise.allSettled(
      FRIEND_ALL_SOURCE_VALUES.map((source) => loadFriendRequestsBySource(source, 1, 1, {
        keyword: "",
        robot: "",
        status: "",
        deviceType: state.friendRequestDeviceType
      }))
    );
    const sourceCounts = {};
    let total = 0;
    results.forEach((result, index) => {
      const source = FRIEND_ALL_SOURCE_VALUES[index];
      if (result.status !== "fulfilled") {
        log("friend badge source load failed", { source, error: result.reason?.message || String(result.reason) });
        return;
      }
      const count = Number(result.value.total || 0);
      sourceCounts[source] = count;
      total += count;
    });
    sourceCounts.all = total;
    state.friendSourceCounts = {
      ...state.friendSourceCounts,
      ...sourceCounts
    };
    state.friendRequestBadgeTotal = total;
    if (!state.friendRequestSource && !state.friendRequestDialogOpen) {
      state.friendRequestTotal = total;
    }
    renderFriendRequestBadge();
  } catch (error) {
    log("friend request badge load failed", { error: error.message });
  }
}

async function loadFriendRequestsBySource(source, page = 1, size = 10, overrides = {}) {
  const scene = source ? Number(source) : "";
  const keyword = overrides.keyword ?? state.friendRequestKeyword;
  const robot = overrides.robot ?? state.friendRequestRobot;
  const deviceType = overrides.deviceType ?? state.friendRequestDeviceType;
  const statusValue = overrides.status ?? state.friendRequestStatus;
  const status = statusValue ? Number(statusValue) : 0;
  const payload = await api("/Contact/GetNewFirend", {
    nickName: keyword,
    robotName: robot,
    deviceTypeValue: deviceType,
    scene,
    scenes: scene || "",
    status,
    index: page,
    current: page,
    size
  });
  return {
    records: getRecords(payload).map(normalizeFriendRequest),
    total: getTotal(payload)
  };
}

async function loadAllFriendRequestSources(page = 1, size = 10) {
  const sourcePageSize = Math.max(size, FRIEND_AGGREGATE_SOURCE_PAGE_SIZE);
  const targetEnd = Math.max(page * size, size);
  const results = await Promise.allSettled(
    FRIEND_ALL_SOURCE_VALUES.map((source) => loadFriendRequestsFromSourceWindow(source, targetEnd, sourcePageSize))
  );
  const records = [];
  let total = 0;
  const sourceCounts = {};

  results.forEach((result, index) => {
    const source = FRIEND_ALL_SOURCE_VALUES[index];
    if (result.status !== "fulfilled") {
      log("friend source load failed", { source, error: result.reason?.message || String(result.reason) });
      return;
    }
    records.push(...result.value.records);
    sourceCounts[source] = Number(result.value.total || 0);
    total += sourceCounts[source];
  });
  sourceCounts.all = total;

  const merged = mergeFriendRequests(records);
  const start = Math.max(0, (page - 1) * size);
  const sliced = merged.slice(start, start + size);
  return {
    records: sliced,
    total: Math.max(total, merged.length),
    sourceCounts
  };
}

async function loadFriendRequestsFromSourceWindow(source, targetEnd, pageSize) {
  const records = [];
  let total = 0;
  const maxPages = Math.max(1, Math.ceil(Math.max(targetEnd, pageSize) / pageSize));

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await loadFriendRequestsBySource(source, page, pageSize);
    total = Number(result.total || total || 0);
    records.push(...result.records);
    const mergedCount = mergeFriendRequests(records).length;
    if (mergedCount >= targetEnd) break;
    if (result.records.length < pageSize) break;
    if (total && records.length >= total) break;
  }

  return {
    records,
    total
  };
}

function mergeFriendRequests(records) {
  const map = new Map();
  records.filter(Boolean).forEach((record) => {
    const key = String(record.id || `${record.robotId || ""}:${record.wxid || ""}:${record.source || ""}`);
    const existing = map.get(key);
    if (!existing || getTimeValue(record.rawReqTime || record.requestTime) >= getTimeValue(existing.rawReqTime || existing.requestTime)) {
      map.set(key, { ...(existing || {}), ...record });
    }
  });
  return [...map.values()].sort((a, b) => getTimeValue(b.rawReqTime || b.requestTime) - getTimeValue(a.rawReqTime || a.requestTime));
}

function normalizeFriendRequest(item, index = 0) {
  return {
    ...item,
    id: firstValue(item.id, item.friendId, item.reqId, item.requestId, `friend-${index}`),
    avatar: item.headImg || item.avatar || item.headImgUrl || "",
    nickName: item.nickName || item.nickname || item.userName || item.wxid || "-",
    wxid: item.wxid || item.userName || "",
    source: item.sceneName || getFriendSourceName(item.scene),
    scene: item.scene,
    requestTime: formatUnixOrDate(item.reqTime || item.requestTime || item.createTime || item.createDate),
    rawReqTime: item.reqTime || item.requestTime || item.createTime || item.createDate,
    robotName: item.deviceRemark || item.deviceName || item.robotName || item.robotRemark || "-",
    robotId: firstValue(item.deviceUniqueId, item.deviceId, item.robotId, item.robotUniqueId, ""),
    deviceTypeValue: Number(firstValue(item.deviceTypeValue, item.deviceType, state.friendRequestDeviceType, 1)),
    status: item.status ?? 0,
    reqMsg: item.reqMsg || item.verifyMsg || ""
  };
}

function getFriendSourceName(scene) {
  const option = FRIEND_SOURCE_OPTIONS.find((item) => String(item.value) === String(scene));
  return option?.label || (scene ? `来源 ${scene}` : "-");
}

function renderFriendRequestsDialog() {
  if (!state.friendRequestDialogOpen) return;
  const overlay = getOrCreateFriendDialog();
  const totalPages = Math.max(1, Math.ceil((state.friendRequestTotal || state.friendRequests.length || 0) / 10));
  overlay.innerHTML = `
    <section class="friend-dialog" role="dialog" aria-modal="true" aria-label="好友请求">
      <header>
        <strong>好友请求</strong>
        <button type="button" class="settings-close" data-friend-action="close" aria-label="关闭"><i class="native-icon bfi-close" aria-hidden="true"></i></button>
      </header>
      <div class="friend-filters">
        <div class="friend-device-tabs">
          <button type="button" data-friend-device="1" class="${state.friendRequestDeviceType === 1 ? "is-active" : ""}">个微</button>
          <button type="button" data-friend-device="2" class="${state.friendRequestDeviceType === 2 ? "is-active" : ""}">企微</button>
        </div>
        <select data-friend-status>
          ${FRIEND_STATUS_OPTIONS.map((item) => `<option value="${escapeAttr(item.value)}" ${String(item.value) === String(state.friendRequestStatus) ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
        </select>
        <div class="friend-source-tags">
          ${FRIEND_SOURCE_OPTIONS.map((item) => `<button type="button" data-friend-source="${escapeAttr(item.value)}" class="${String(item.value) === String(state.friendRequestSource) ? "is-active" : ""}">${escapeHtml(item.label)}${renderFriendSourceCount(item.value)}</button>`).join("")}
        </div>
        <input data-friend-keyword value="${escapeAttr(state.friendRequestKeyword)}" placeholder="请输入昵称" />
        <input data-friend-robot value="${escapeAttr(state.friendRequestRobot)}" placeholder="搜索机器人" />
        <button type="button" class="send-button friend-search-button" data-friend-action="search">查询</button>
      </div>
      <div class="friend-table-wrap">
        <table class="friend-table">
          <thead>
            <tr>
              <th>头像</th>
              <th>微信昵称</th>
              <th>来源</th>
              <th>请求时间</th>
              <th>机器人信息</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${state.friendRequests.length ? state.friendRequests.map(renderFriendRequestRow).join("") : `<tr><td colspan="6" class="empty-state">${state.friendRequestLoading ? "加载中..." : "暂无好友请求数据。"}</td></tr>`}
          </tbody>
        </table>
      </div>
      <footer class="friend-pager">
        <button type="button" class="mini-action" data-friend-action="prev" ${state.friendRequestPage <= 1 ? "disabled" : ""}>上一页</button>
        <span>第 ${state.friendRequestPage} / ${totalPages} 页</span>
        <button type="button" class="mini-action" data-friend-action="next" ${state.friendRequestPage >= totalPages ? "disabled" : ""}>下一页</button>
      </footer>
    </section>
  `;
  overlay.classList.remove("is-hidden");
}

function renderFriendSourceCount(source) {
  const key = source || "all";
  const count = Number(state.friendSourceCounts[key] || 0);
  if (!count) return "";
  return `<i>${count > 99 ? "99+" : count}</i>`;
}

function renderFriendRequestRow(item) {
  const avatar = item.avatar
    ? `<img class="friend-avatar" src="${escapeAttr(getDisplayMediaUrl(item.avatar))}" alt="">`
    : `<span class="friend-avatar">${escapeHtml(getInitial(item.nickName))}</span>`;
  const canOperate = Number(item.status || 0) === 0 || state.friendRequestStatus === "";
  return `
    <tr>
      <td>${avatar}</td>
      <td><strong>${escapeHtml(item.nickName)}</strong>${item.wxid ? `<span>${copyButton(item.wxid)}</span>` : ""}${item.reqMsg ? `<small>${escapeHtml(item.reqMsg)}</small>` : ""}</td>
      <td>${escapeHtml(item.source)}</td>
      <td>${escapeHtml(item.requestTime || "-")}</td>
      <td>${escapeHtml(item.robotName)}${item.robotId ? `<span>${copyButton(item.robotId)}</span>` : ""}</td>
      <td>
        <button class="mini-action" type="button" data-friend-action="accept" data-friend-id="${escapeAttr(item.id)}" data-device-type="${escapeAttr(item.deviceTypeValue)}" ${canOperate ? "" : "disabled"}>通过</button>
        <button class="mini-action" type="button" data-friend-action="ignore" data-friend-id="${escapeAttr(item.id)}" data-device-type="${escapeAttr(item.deviceTypeValue)}" ${canOperate ? "" : "disabled"}>忽略</button>
      </td>
    </tr>
  `;
}

function getOrCreateFriendDialog() {
  let overlay = document.getElementById("friendRequestOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "friendRequestOverlay";
  overlay.className = "friend-overlay is-hidden";
  overlay.addEventListener("click", handleFriendDialogClick);
  overlay.addEventListener("change", handleFriendDialogChange);
  overlay.addEventListener("keydown", handleFriendDialogKeydown);
  document.body.appendChild(overlay);
  return overlay;
}

function handleFriendDialogClick(event) {
  const overlay = document.getElementById("friendRequestOverlay");
  if (event.target === overlay) {
    closeFriendRequestsDialog();
    return;
  }

  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    copyToClipboard(copyTarget.dataset.copy || "");
    return;
  }

  const deviceTarget = event.target.closest("[data-friend-device]");
  if (deviceTarget) {
    state.friendRequestDeviceType = Number(deviceTarget.dataset.friendDevice);
    loadFriendRequests(1).then(renderFriendRequestsDialog);
    return;
  }

  const sourceTarget = event.target.closest("[data-friend-source]");
  if (sourceTarget) {
    state.friendRequestSource = sourceTarget.dataset.friendSource;
    loadFriendRequests(1).then(renderFriendRequestsDialog);
    return;
  }

  const actionTarget = event.target.closest("[data-friend-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.friendAction;
  if (action === "close") {
    closeFriendRequestsDialog();
  } else if (action === "search") {
    updateFriendRequestFilters();
    loadFriendRequests(1).then(renderFriendRequestsDialog);
  } else if (action === "prev") {
    loadFriendRequests(Math.max(1, state.friendRequestPage - 1)).then(renderFriendRequestsDialog);
  } else if (action === "next") {
    loadFriendRequests(state.friendRequestPage + 1).then(renderFriendRequestsDialog);
  } else if (action === "accept" || action === "ignore") {
    handleFriendRequestDecision(action, actionTarget.dataset.friendId, Number(actionTarget.dataset.deviceType));
  }
}

function handleFriendDialogChange(event) {
  if (event.target.matches("[data-friend-status]")) {
    state.friendRequestStatus = event.target.value;
    loadFriendRequests(1).then(renderFriendRequestsDialog);
  }
}

function handleFriendDialogKeydown(event) {
  if (event.key === "Escape") {
    closeFriendRequestsDialog();
    return;
  }
  if (event.key === "Enter" && (event.target.matches("[data-friend-keyword]") || event.target.matches("[data-friend-robot]"))) {
    updateFriendRequestFilters();
    loadFriendRequests(1).then(renderFriendRequestsDialog);
  }
}

function updateFriendRequestFilters() {
  const overlay = document.getElementById("friendRequestOverlay");
  state.friendRequestKeyword = overlay?.querySelector("[data-friend-keyword]")?.value.trim() || "";
  state.friendRequestRobot = overlay?.querySelector("[data-friend-robot]")?.value.trim() || "";
}

async function handleFriendRequestDecision(action, id, deviceTypeValue) {
  if (!id) return;
  try {
    await api(action === "accept" ? "/Contact/NewFirendAccept" : "/Contact/NewFirendIgnor", {
      deviceTypeValue,
      id
    });
    toast(action === "accept" ? "已通过好友申请。" : "已忽略好友申请。");
    await loadFriendRequests(state.friendRequestPage);
    renderFriendRequestsDialog();
  } catch (error) {
    toast(`${action === "accept" ? "通过" : "忽略"}好友请求失败：${error.message}`, true);
  }
}

function closeFriendRequestsDialog() {
  state.friendRequestDialogOpen = false;
  const overlay = document.getElementById("friendRequestOverlay");
  overlay?.classList.add("is-hidden");
}

function getContactUnreadCount(contact) {
  return [
    contact?.unread,
    contact?.unRead,
    contact?.redDot,
    contact?.unReadCount,
    contact?.redPoint,
    contact?.redpoint
  ].reduce((max, value) => {
    const count = Number(value || 0);
    return Number.isFinite(count) ? Math.max(max, count) : max;
  }, 0);
}

function sumContactUnread(contacts) {
  return contacts.reduce((sum, contact) => sum + getContactUnreadCount(contact), 0);
}

function getListUnreadCount(tab = state.listTab) {
  const stored = Number(state.listUnreadCounts[tab] || 0);
  if (tab === state.listTab) return Math.max(stored, sumContactUnread(state.contacts));
  return stored;
}

function getFirstUnreadContact(contacts = state.contacts) {
  return contacts.find((contact) => getContactUnreadCount(contact) > 0) || null;
}

function loadClearedContactState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLEARED_CONTACTS_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistClearedContactState() {
  const now = Date.now();
  const entries = Object.entries(state.clearedContactState || {})
    .filter(([, value]) => Number(value?.expiresAt || 0) > now)
    .slice(-600);
  state.clearedContactState = Object.fromEntries(entries);
  localStorage.setItem(CLEARED_CONTACTS_STORAGE_KEY, JSON.stringify(state.clearedContactState));
}

function loadContactListAccountIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? uniqueContactListAccountIds(parsed, "", { strictShortId: true }) : [];
  } catch {
    return [];
  }
}

function persistContactListAccountIds() {
  state.contactListAccountIds = uniqueContactListAccountIds(state.contactListAccountIds || [], state.account, { strictShortId: true });
  localStorage.setItem(CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY, JSON.stringify(state.contactListAccountIds));
}

function rememberContactListAccountIds(accounts, preferredAccount = null) {
  const accountItems = Array.isArray(accounts) ? accounts : [];
  const preferredIds = preferredAccount ? extractContactListAccountIds(preferredAccount) : [];
  const matched = accountItems.find((account) => (
    String(account.userName || account.accountName || account.nickName || "") === String(state.account)
  ));
  const matchedIds = matched && matched !== preferredAccount ? extractContactListAccountIds(matched) : [];
  const allIds = accountItems.flatMap(extractContactListAccountIds);
  state.contactListAccountIds = uniqueContactListAccountIds([
    ...preferredIds,
    ...matchedIds,
    ...state.contactListAccountIds,
    ...allIds
  ], state.account);
  persistContactListAccountIds();
}

function extractContactListAccountIds(account) {
  const shortAccountId = String(account?.accountId ?? "").trim();
  return uniqueContactListAccountIds([
    account?.id,
    account?.accId,
    CONTACT_LIST_ACCOUNT_ID_PATTERN.test(shortAccountId) ? shortAccountId : ""
  ], state.account, { strictShortId: true });
}

function uniqueContactListAccountIds(values, currentAccount = "", options = {}) {
  const strictShortId = Boolean(options.strictShortId);
  const seen = new Set();
  return (values || [])
    .map((value) => String(value ?? "").trim())
    .filter((value) => value && value !== "0" && value !== String(currentAccount || ""))
    .filter((value) => !strictShortId || CONTACT_LIST_ACCOUNT_ID_PATTERN.test(value))
    .filter((value) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .slice(0, 12);
}

function rememberAccountIdFromContacts(contacts) {
  if (state.accountIdResolved && state.accountId) return;
  const contact = contacts.find((item) => (
    item?.accountId || item?.accId || item?.csAccountId || item?.account?.id
  ));
  const accountId = firstValue(contact?.accountId, contact?.accId, contact?.csAccountId, contact?.account?.id);
  if (!accountId || accountId === state.account) return;
  state.accountId = String(accountId);
  state.accountIdResolved = true;
  localStorage.setItem("youchat.accountId", state.accountId);
}

function mergeContactsById(...groups) {
  const map = new Map();
  groups.flat().filter(Boolean).forEach((contact) => {
    const key = String(getContactId(contact) || contact.userName || contact.userNick || Math.random());
    const existing = map.get(key);
    if (!existing || Number(contact.sortTime || 0) >= Number(existing.sortTime || 0)) {
      map.set(key, { ...(existing || {}), ...contact });
    }
  });
  return [...map.values()];
}

function shouldKeepListLocallyCleared(tab = state.listTab) {
  return tab !== "history" && Number(state.clearedListUntil?.[tab] || 0) > Date.now();
}

function getClearedContactKey(tab, contact) {
  const contactId = getContactId(contact);
  return contactId ? `${tab}:${contactId}` : "";
}

function filterLocallyClearedContacts(tab, contacts) {
  if (tab === "history" || !contacts.length) return contacts;
  const now = Date.now();
  let changed = false;
  const filtered = contacts.filter((contact) => {
    const key = getClearedContactKey(tab, contact);
    const marker = key ? state.clearedContactState[key] : null;
    if (!marker) return true;
    if (Number(marker.expiresAt || 0) <= now) {
      delete state.clearedContactState[key];
      changed = true;
      return true;
    }
    return Number(contact.sortTime || 0) > Number(marker.clearedAt || 0);
  });
  if (changed) persistClearedContactState();
  return filtered;
}

function archiveAndClearCurrentList() {
  const tab = state.listTab;
  const now = Date.now();
  if (state.contacts.length) {
    state.contacts.forEach((contact) => {
      const key = getClearedContactKey(tab, contact);
      if (!key) return;
      state.clearedContactState[key] = {
        clearedAt: now,
        expiresAt: now + CLEAR_LIST_GRACE_MS,
        sortTime: Number(contact.sortTime || 0)
      };
    });
    persistClearedContactState();
  }

  state.clearedListUntil[tab] = now + CLEAR_LIST_GRACE_MS;
  state.contacts = [];
  state.activeContact = null;
  state.totalContacts = 0;
  state.listCounts[tab] = 0;
  state.listUnreadCounts[tab] = 0;
  state.listCounts.history = Number(state.listServerCounts.history || 0);
  resetContactScopedState();
  state.messages = [];
  state.messagesFromPreview = false;
  renderAll();
}

function touchActiveContact(lastContent, options = {}) {
  const contactId = getContactId(state.activeContact);
  if (!contactId) return;
  const sortTime = options.sortTime || Date.now();
  const patch = {
    lastContent: lastContent || state.activeContact.lastContent || "",
    sortTime,
    time: formatTime(sortTime),
    updateTime: sortTime,
    lastTime: sortTime
  };
  state.contacts = sortContacts(state.contacts.map((contact) => (
    String(getContactId(contact)) === String(contactId) ? { ...contact, ...patch } : contact
  )));
  const nextActive = state.contacts.find((contact) => String(getContactId(contact)) === String(contactId));
  if (nextActive) state.activeContact = nextActive;
  renderConversationTabs();
  renderContacts();
  renderActive();
}

function normalizeContact(item, index) {
  const id = item.id || item.contactId || item.userId || item.contactID || `contact-${index}`;
  const robot = item.robot || {};
  const robotType = firstValue(item.robotType, robot.robotType, item.deviceTypeValue, item.deviceType, item.accountType, item.contactType);
  const robotName = firstDisplayValue(item.robotName, robot.robotRemark, robot.robotName, item.robotRemark);
  const records = Array.isArray(item.records)
    ? item.records.map((record, recordIndex) => normalizeMessage({ contactId: id, ...record }, recordIndex))
    : [];
  const latestRecordTime = records.reduce((max, record) => Math.max(max, Number(record.sortTime || 0)), 0);
  const lastIncomingTimeFromRecords = records.reduce((max, record) => {
    if (!record || record.direction === "outgoing" || record.direction === "ai") return max;
    return Math.max(max, Number(record.sortTime || 0));
  }, 0);
  const rawTime = firstValue(
    item.updateTime,
    item.lastTime,
    item.lastMsgTime,
    item.lastMsgDate,
    item.responseTime,
    item.responseDate,
    item.endTime,
    item.endDate,
    item.createTime,
    item.createDate,
    item.time,
    0
  );
  const sortTime = Math.max(getTimeValue(rawTime), latestRecordTime);
  return {
    ...item,
    id,
    records,
    userNick: firstDisplayValue(item.userNick, item.nickName, item.userRemark, item.userName, item.name) || `客户 ${id}`,
    accountName: firstDisplayValue(item.accountName, item.account?.userName),
    robotName,
    robotType,
    lastContent: item.lastContent || item.content || item.lastMsg || item.message || records[records.length - 1]?.content || "",
    unread: item.unRead ?? item.redDot ?? item.unReadCount ?? item.unread ?? 0,
    time: formatTime(sortTime || rawTime),
    sortTime,
    lastIncomingTime: Math.max(
      lastIncomingTimeFromRecords,
      getTimeValue(firstValue(item.lastReceiveTime, item.receiveTime, item.lastUserMsgTime, item.lastReceiveDate, 0))
    ),
    isTodo: Boolean(item.isTodo),
    avatar: getAvatarFromRecord(item),
    tags: [
      item.isTodo ? "待办" : "",
      item.isNotice ? "通知" : "",
      robotName
    ].filter(Boolean)
  };
}

function sortContacts(contacts) {
  return [...contacts].sort((a, b) => {
    const todoDelta = Number(Boolean(b.isTodo)) - Number(Boolean(a.isTodo));
    if (todoDelta) return todoDelta;
    return Number(b.sortTime || 0) - Number(a.sortTime || 0);
  });
}

function getContactRobotType(contact) {
  const robot = contact?.robot || {};
  return firstValue(
    contact?.robotType,
    robot.robotType,
    contact?.deviceTypeValue,
    contact?.deviceType,
    contact?.accountType,
    contact?.contactType,
    contact?.type
  );
}

function getContactTypeLabel(contact) {
  const rawType = getContactRobotType(contact);
  const numericType = Number(rawType);
  if (numericType === 6) return "公众号";
  if (numericType === 2 || numericType === 9) return "企微";
  const typeText = firstDisplayValue(contact?.robotTypeName, contact?.contactTypeName, contact?.accountTypeName, robotTypeName(rawType));
  if (typeText.includes("公众号")) return "公众号";
  if (typeText.includes("企微")) return "企微";
  return "个微";
}

function getContactTypeClass(contact) {
  const label = getContactTypeLabel(contact);
  if (label === "公众号") return "is-public";
  if (label === "企微") return "is-work";
  return "is-personal";
}

function renderContactTypeBadge(contact, className = "") {
  const label = getContactTypeLabel(contact);
  const extraClass = className ? ` ${escapeAttr(className)}` : "";
  return `<span class="contact-type-badge ${escapeAttr(getContactTypeClass(contact))}${extraClass}">${escapeHtml(label)}</span>`;
}

function getContactListDetail(contact) {
  const displayName = getContactDisplayName(contact);
  const detail = [
    contact?.userRemark,
    contact?.robotName,
    getContactUserName(contact)
  ].find((value) => {
    const text = cleanDisplayText(value);
    return text && !isSameDisplayText(text, displayName);
  });
  return firstDisplayValue(detail, "悠聊客户");
}

function getContactRobotName(contact) {
  const robot = contact?.robot || {};
  return firstDisplayValue(
    robot.robotName,
    contact?.robotName,
    contact?.accountName,
    robot.robotRemark,
    contact?.robotRemark
  );
}

function getContactRobotRemark(contact) {
  const robot = contact?.robot || {};
  return firstDisplayValue(
    robot.robotRemark,
    contact?.robotRemark,
    contact?.robotRemarkName,
    contact?.deviceRemark,
    contact?.remarkName
  );
}

function getContactRobotTypeText(contact) {
  const rawType = getContactRobotType(contact);
  return firstDisplayValue(
    contact?.robotTypeName,
    contact?.contactTypeName,
    contact?.accountTypeName,
    robotTypeName(rawType)
  );
}

function getActiveRobotMetaText(contact) {
  const robotName = getContactRobotName(contact) || "-";
  const robotType = getContactRobotTypeText(contact);
  const robotRemark = getContactRobotRemark(contact) || "-";
  const typeText = robotType && robotType !== "-" ? `（${robotType}）` : "";
  return `所属机器人：${robotName}${typeText}  备注：${robotRemark}`;
}

function renderContacts() {
  const count = state.totalContacts || state.contacts.length;
  el.conversationCount.textContent = `${count} 个客户`;
  el.contactList.tabIndex = 0;

  if (!state.contacts.length) {
    el.contactList.innerHTML = '<div class="empty-state" style="padding:16px">暂无真实会话数据。请确认服务器地址、端口和数据库连接。</div>';
    return;
  }

  el.contactList.innerHTML = state.contacts.map((contact) => {
    const active = state.activeContact && String(getContactId(state.activeContact)) === String(getContactId(contact));
    const unread = getContactUnreadCount(contact);
    const isPinned = Boolean(contact.isTodo);
    const contactId = getContactId(contact);
    const hoverActions = getContactHoverActions(contact, contactId);
    const avatar = renderContactAvatar(contact);
    const displayName = getContactDisplayName(contact);
    const detail = getContactListDetail(contact);
    const insight = getContactInsight(contact);
    const urgencyClass = getContactUrgencyClass(insight);
    return `
      <div class="contact-card ${active ? "is-active" : ""} ${isPinned ? "is-pinned" : ""} ${unread ? "has-unread" : ""} ${urgencyClass}" data-contact-id="${escapeAttr(contactId)}" role="button" tabindex="0">
        ${avatar}
        <span class="contact-main">
          <span class="contact-title-row">
            <strong>${escapeHtml(displayName)}</strong>
            ${renderContactTypeBadge(contact)}
          </span>
          <span class="contact-detail">${escapeHtml(detail)}</span>
        </span>
        <span class="contact-side">
          <span class="contact-time">${escapeHtml(contact.time || "")}</span>
          <span class="contact-status-stack">
            ${renderContactUrgencyPill(insight)}
            ${unread ? `<span class="unread-badge">${unread > 99 ? "99+" : unread}</span>` : ""}
          </span>
        </span>
        <span class="contact-last">${escapeHtml(contact.lastContent || "暂无最新消息")}</span>
        ${isPinned ? '<span class="pin-corner" title="待办置顶"></span>' : ""}
        ${hoverActions}
      </div>
    `;
  }).join("");
}

function getContactInsight(contact) {
  const contactId = String(getContactId(contact) || "");
  const cached = contactId ? state.contactInsights[contactId] : null;
  if (cached) return applyInsightDismissal(cached, contact);
  return buildContactInsightFromPreview(contact);
}

function buildContactInsightFromPreview(contact) {
  const contactId = String(getContactId(contact) || "");
  const messages = [];
  if (Array.isArray(contact?.records)) messages.push(...contact.records);
  if (!messages.length && contact?.lastContent) {
    const content = String(contact.lastContent || "");
    messages.push({
      contactId,
      id: `last-${contactId}`,
      direction: isLikelySystemInsightText(content) ? "system" : "incoming",
      isSystemNotice: isLikelySystemInsightText(content),
      content,
      sortTime: Number(contact.sortTime || Date.now()),
      time: contact.time || ""
    });
  }
  return applyInsightDismissal(buildWithdrawInsightSignal(messages, contact), contact);
}

function isLikelySystemInsightText(text) {
  const normalized = normalizeWithdrawText(text);
  return /(提现|提取)/.test(normalized) && /(退货|退款|换货|维权|售后)/.test(normalized);
}

function getContactUrgencyScore(insight) {
  if (!insight || insight.kind === "safe" || insight.dismissed) return 0;
  if (insight.kind === "withdraw_refund_block") return Math.max(66, Number(insight.probability || 0));
  if (insight.kind === "customer_urgency") return Math.max(42, Number(insight.probability || insight.emotion?.score || 0));
  return Number(insight.probability || 0);
}

function getContactUrgencyClass(insight) {
  const score = getContactUrgencyScore(insight);
  if (score >= 82) return "has-ai-urgency is-urgency-danger";
  if (score >= 64) return "has-ai-urgency is-urgency-warn";
  if (score >= 38) return "has-ai-urgency is-urgency-notice";
  return "has-ai-urgency is-urgency-ok";
}

function renderContactUrgencyPill(insight) {
  const score = getContactUrgencyScore(insight);
  const text = score >= 82 ? "紧急" : score >= 64 ? "紧张" : score >= 38 ? "关注" : "平稳";
  const title = getWithdrawRiskSignalText(insight);
  return `<span class="contact-urgency-pill" title="${escapeAttr(title)}">${escapeHtml(text)}</span>`;
}

function getContactHoverActions(contact, contactId = getContactId(contact)) {
  if (state.listTab === "guestbook") {
    return `
      <span class="contact-hover-actions">
        <button type="button" data-contact-action="access" data-contact-id="${escapeAttr(contactId)}" title="接入" aria-label="接入"><i class="native-icon client-icon-enter" aria-hidden="true"></i></button>
        <button type="button" data-contact-action="close" data-contact-id="${escapeAttr(contactId)}" title="关闭" aria-label="关闭"><i class="native-icon bfi-close" aria-hidden="true"></i></button>
      </span>
    `;
  }

  if (state.listTab === "history") {
    return `
      <span class="contact-hover-actions single">
        <button type="button" data-contact-action="access-history" data-contact-id="${escapeAttr(contactId)}" title="接入" aria-label="接入"><i class="native-icon client-icon-enter" aria-hidden="true"></i></button>
      </span>
    `;
  }

  return `
    <span class="contact-hover-actions single">
      <button type="button" data-contact-action="close" data-contact-id="${escapeAttr(contactId)}" title="关闭" aria-label="关闭"><i class="native-icon bfi-close" aria-hidden="true"></i></button>
    </span>
  `;
}

function renderMessagesFromContactPreview() {
  state.messages = state.activeContact?.records?.length ? mergeMessages([...state.activeContact.records]) : [];
  state.messagePage = 1;
  state.messageHasMore = false;
  state.messageLoading = false;
  state.messagesFromPreview = true;
  renderMessages();
  scheduleWithdrawRiskScan({ deep: false, source: "contact-preview" });
}

function loadReadContactState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(READ_STATE_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistReadContactState() {
  const now = Date.now();
  const entries = Object.entries(state.readContactState || {})
    .filter(([, value]) => Number(value?.expiresAt || 0) > now)
    .sort((a, b) => Number(b[1]?.readAt || 0) - Number(a[1]?.readAt || 0))
    .slice(0, 500);
  state.readContactState = Object.fromEntries(entries);
  localStorage.setItem(READ_STATE_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

function getContactReadKey(contact) {
  const contactId = getContactId(contact);
  return contactId ? String(contactId) : "";
}

function applyReadStateToContact(contact) {
  const key = getContactReadKey(contact);
  const readState = key ? state.readContactState[key] : null;
  if (!readState) return contact;

  const contactSortTime = Number(contact.sortTime || 0);
  const readAt = Number(readState.readAt || 0);
  const expiresAt = Number(readState.expiresAt || 0);
  const lastIncomingTime = Number(contact.lastIncomingTime || 0);
  const lastIncomingReadTime = Number(readState.lastIncomingTime || 0);
  if (!expiresAt || expiresAt <= Date.now()) return contact;
  const shouldKeepRead = readAt && (
    !lastIncomingTime ||
    lastIncomingTime <= readAt ||
    lastIncomingTime <= lastIncomingReadTime ||
    contactSortTime <= readAt
  );
  if (!shouldKeepRead) return contact;

  return {
    ...contact,
    unRead: 0,
    redDot: 0,
    unReadCount: 0,
    unread: 0
  };
}

function clearContactReadStateLocally(contact) {
  const key = getContactReadKey(contact);
  if (!key) return false;

  const readAt = Date.now();
  const lastIncomingTime = getContactLastIncomingTime(contact);
  state.readContactState[key] = {
    readAt,
    sortTime: Math.max(Number(contact?.sortTime || 0), readAt),
    lastIncomingTime,
    expiresAt: readAt + READ_STATE_GRACE_MS
  };
  persistReadContactState();

  state.contacts = state.contacts.map((item) => (
    String(getContactId(item)) === key ? applyReadStateToContact({ ...item, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 }) : item
  ));
  if (state.activeContact && String(getContactId(state.activeContact)) === key) {
    state.activeContact = applyReadStateToContact({ ...state.activeContact, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 });
  }
  state.listUnreadCounts[state.listTab] = sumContactUnread(state.contacts);
  renderConversationTabs();
  return true;
}

function markContactRead(contact, options = {}) {
  const key = getContactReadKey(contact);
  if (!key) return;

  if (options.sync) {
    confirmContactReadInBackground(contact, options);
    return;
  }

  clearContactReadStateLocally(contact);
}

function confirmContactReadInBackground(contact, options = {}) {
  const contactId = getContactId(contact);
  return confirmContactRead(contact, options).catch((error) => {
    log("consume message sync failed", {
      contactId,
      error: error.message
    });
    if (!options.silent) toast("红点同步到客户端失败，已保留未读标记。", true);
    return null;
  });
}

function markVisibleContactsRead() {
  const readAt = Date.now();
  state.contacts = state.contacts.map((contact) => {
    const key = getContactReadKey(contact);
    if (!key) return contact;
    state.readContactState[key] = {
      readAt,
      sortTime: Math.max(Number(contact.sortTime || 0), readAt),
      lastIncomingTime: getContactLastIncomingTime(contact),
      expiresAt: readAt + READ_STATE_GRACE_MS
    };
    return applyReadStateToContact({ ...contact, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 });
  });
  if (state.activeContact) {
    state.activeContact = applyReadStateToContact({ ...state.activeContact, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 });
  }
  persistReadContactState();
  state.listUnreadCounts[state.listTab] = sumContactUnread(state.contacts);
  renderConversationTabs();
}

async function syncConsumedMessages(contact, options = {}) {
  const contactId = getContactId(contact);
  if (!contactId) return;

  const messageIds = getConsumableMessageIds(contact);
  const targets = options.includeMessageIds ? [...new Set([0, ...messageIds])] : [0];
  let result = null;
  const errors = [];
  for (const msgId of targets) {
    try {
      result = await consumeMessageWithFallback(contactId, msgId);
    } catch (error) {
      errors.push({ msgId, error: error.message });
      if (msgId === 0 && !result) throw error;
    }
  }
  log("consume message synced", {
    contactId,
    msgIds: targets,
    source: result?.source,
    failedFallbacks: result?.failedFallbacks,
    consumeErrors: errors
  });
  return result;
}

async function confirmContactRead(contact, options = {}) {
  const contactId = getContactId(contact);
  if (!contactId) return null;

  const result = await syncConsumedMessages(contact);
  const verifiedContact = await verifyContactReadOnServer(contact, options);
  if (!verifiedContact) {
    throw new Error("server read state could not be verified");
  }
  if (verifiedContact && getContactUnreadCount(verifiedContact) > 0) {
    throw new Error(`server still reports ${getContactUnreadCount(verifiedContact)} unread message(s)`);
  }

  if (verifiedContact) {
    const readPatch = getVerifiedReadPatch(verifiedContact);
    state.contacts = state.contacts.map((item) => (
      String(getContactId(item)) === String(contactId) ? { ...item, ...readPatch } : item
    ));
    if (String(getContactId(state.activeContact) || "") === String(contactId)) {
      state.activeContact = { ...state.activeContact, ...readPatch };
    }
  }
  clearContactReadStateLocally({ ...contact, ...getVerifiedReadPatch(verifiedContact) });
  clearLocalMessageRedPoints(contactId);
  renderContacts();
  log("contact read confirmed", {
    contactId,
    source: result?.source || "",
    resolvedApiBase: result?.resolvedApiBase || "",
    verifiedUnread: verifiedContact ? getContactUnreadCount(verifiedContact) : null
  });
  return { result, verifiedContact };
}

function getVerifiedReadPatch(contact) {
  return {
    unread: Number(contact?.unread || 0),
    unRead: Number(contact?.unRead || 0),
    redDot: Number(contact?.redDot || 0),
    unReadCount: Number(contact?.unReadCount || 0),
    redPoint: Number(contact?.redPoint || 0),
    redpoint: Number(contact?.redpoint || 0)
  };
}

async function verifyContactReadOnServer(contact, options = {}) {
  const contactId = getContactId(contact);
  if (!contactId) return null;

  try {
    const params = buildContactListParams(state.listTab, {
      pageIndex: 1,
      pageSize: 1,
      id: contactId,
      keyWord: "",
      searchStr: "",
      accountIdOverride: getAccountId(contact)
    });
    const payload = await api("/Contact/GetContactList", params, {
      timeoutMs: options.timeoutMs || API_REQUEST_TIMEOUT_MS
    });
    let verifiedContact = getRecords(payload)
      .map(normalizeContact)
      .find((item) => String(getContactId(item)) === String(contactId)) || null;
    if (!verifiedContact && state.listTab !== "current") {
      const currentPayload = await api("/Contact/GetContactList", buildContactListParams("current", {
        pageIndex: 1,
        pageSize: 1,
        id: contactId,
        keyWord: "",
        searchStr: "",
        accountIdOverride: getAccountId(contact)
      }), {
        timeoutMs: options.timeoutMs || API_REQUEST_TIMEOUT_MS
      });
      verifiedContact = getRecords(currentPayload)
        .map(normalizeContact)
        .find((item) => String(getContactId(item)) === String(contactId)) || null;
    }
    if (!verifiedContact) return null;
    return verifiedContact;
  } catch (error) {
    log("contact read verification failed", {
      contactId,
      error: error.message
    });
    return null;
  }
}

async function syncAllConsumedMessages() {
  const result = await consumeMessageWithFallback(0, 0);
  state.contacts.forEach((contact) => refreshLocalReadState(getContactId(contact)));
  log("consume all messages synced", {
    contactId: 0,
    msgId: 0,
    source: result.source,
    failedFallbacks: result.failedFallbacks
  });
}

async function syncConsumedMessageIds(contact) {
  const contactId = getContactId(contact);
  if (!contactId) return;

  await consumeMessageWithFallback(contactId, 0);
  refreshLocalReadState(contactId);
}

function getContactLastIncomingTime(contact) {
  const records = Array.isArray(contact?.records) ? contact.records : [];
  const latestIncomingRecordTime = records.reduce((max, record) => {
    if (!record || record.direction === "outgoing" || record.direction === "ai") return max;
    return Math.max(max, Number(record.sortTime || 0));
  }, 0);
  return Math.max(
    latestIncomingRecordTime,
    Number(contact?.lastIncomingTime || 0),
    Number(contact?.latestIncomingTime || 0)
  );
}

function refreshLocalReadState(contactId) {
  const key = String(contactId || "");
  if (!key || !state.readContactState[key]) return;
  const contact = state.contacts.find((item) => String(getContactId(item)) === key) || state.activeContact;
  if (!contact) return;
  const now = Date.now();
  state.readContactState[key] = {
    ...state.readContactState[key],
    readAt: now,
    sortTime: Math.max(Number(contact.sortTime || 0), now),
    lastIncomingTime: getContactLastIncomingTime(contact),
    expiresAt: now + READ_STATE_GRACE_MS
  };
  persistReadContactState();
}

async function consumeMessageWithFallback(contactId, msgId = 0) {
  const attempts = [
    { source: "node-signalr", run: consumeMessageViaLocalSignalR },
    { source: "browser-signalr", run: consumeMessageViaSignalR },
    { source: "http", run: consumeMessageViaHttp }
  ];
  const errors = [];
  for (const attempt of attempts) {
    try {
      const result = await attempt.run(contactId, msgId);
      if (errors.length) {
        log("consume message fallback used", {
          contactId,
          msgId,
          source: result.source || attempt.source,
          previousErrors: errors
        });
      }
      return {
        ...(result || {}),
        source: result?.source || attempt.source,
        failedFallbacks: errors.length
      };
    } catch (error) {
      errors.push({ source: attempt.source, error: error.message });
    }
  }
  throw new Error(errors.map((item) => `${item.source}: ${item.error}`).join("; ") || "会话红点同步失败");
}

async function consumeMessageViaLocalSignalR(contactId, msgId = 0) {
  const accountId = getSignalRAccountId();
  if (!accountId) throw new Error("missing account id for local SignalR bridge");
  const response = await fetchWithTimeout("/local/signalr/consume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiBase: state.apiBase,
      accountId,
      contactId: Number(contactId || 0),
      msgId: Number(msgId || 0)
    })
  }, SIGNALR_START_TIMEOUT_MS + 3000, "local SignalR consume");
  const payload = parsePayload(await response.text());
  if (!response.ok || payload?.success === false) {
    throw new Error(getMessage(payload) || payload?.error || `HTTP ${response.status}`);
  }
  return {
    source: payload?.source || "node-signalr",
    resolvedApiBase: payload?.resolvedApiBase || "",
    failedAttempts: payload?.failedAttempts || [],
    contactId,
    msgId
  };
}

async function consumeMessageViaSignalR(contactId, msgId = 0) {
  const connection = await ensureSignalRConnection();
  await connection.invoke("ConsumeMessage", Number(contactId || 0), Number(msgId || 0));
  return { source: "signalr", contactId, msgId };
}

async function consumeMessageViaHttp(contactId, msgId = 0) {
  await api("/ChatContent/ConsumeMessage", {
    contactId,
    msgId
  });
  return { source: "http", contactId, msgId };
}

function getConsumableMessageIds(contact) {
  const candidates = [
    ...(Array.isArray(contact?.records) ? contact.records : []),
    ...state.messages
  ].filter(isConsumableRedPointMessage);

  return [...new Set(candidates.flatMap(getConsumableMessageIdCandidates).filter(Boolean))].slice(-30);
}

function clearLocalMessageRedPoints(contactId) {
  const key = String(contactId || "");
  const now = Date.now();
  const clearMessage = (message) => {
    if (!message) return message;
    return {
      ...message,
      isRedPoint: false,
      isRedpoint: false,
      redPoint: 0,
      redpoint: 0,
      consumeTime: message.consumeTime || now
    };
  };
  if (String(getContactId(state.activeContact) || "") === key) {
    state.messages = state.messages.map(clearMessage);
    state.activeContact = {
      ...state.activeContact,
      records: Array.isArray(state.activeContact?.records) ? state.activeContact.records.map(clearMessage) : state.activeContact?.records
    };
  }
  state.contacts = state.contacts.map((contact) => (
    String(getContactId(contact)) === key
      ? {
        ...contact,
        records: Array.isArray(contact.records) ? contact.records.map(clearMessage) : contact.records
      }
      : contact
  ));
}

function isConsumableRedPointMessage(message) {
  if (!message) return false;
  const redPoint = Boolean(message.isRedPoint || message.isRedpoint || message.redPoint || message.redpoint);
  if (!redPoint) return false;
  const consumeTime = Number(message.consumeTime || message.consumedTime || message.readTime || 0);
  return !consumeTime;
}

function getConsumableMessageIdCandidates(message) {
  const values = [
    message?.msgId,
    message?.messageId,
    message?.chatContentId,
    message?.contentId,
    message?.rawId,
    message?.id
  ];
  return values.filter((value) => {
    const text = String(value || "");
    return text && !text.startsWith("message-") && /^\d+$/.test(text);
  });
}

async function selectContactById(id, options = {}) {
  const nextContact = state.contacts.find((contact) => String(getContactId(contact)) === String(id));
  if (!nextContact) return;
  const jumpUnread = Boolean(options.jumpUnread);

  if (String(getContactId(state.activeContact)) === String(id)) {
    if (isMobileWorkbench()) setMobilePanel("chat");
    if (jumpUnread) {
      const jumped = await jumpToUnreadInLoadedMessages();
      confirmContactReadInBackground(nextContact);
      renderContacts();
      if (!jumped) scheduleMessageListBottom({ force: true, watchImages: true });
    } else {
      confirmContactReadInBackground(nextContact);
      renderContacts();
      scheduleMessageListBottom({ force: true, watchImages: true });
    }
    return;
  }

  state.activeContact = nextContact;
  if (isMobileWorkbench()) setMobilePanel("chat");
  resetContactScopedState();
  renderMessagesFromContactPreview();
  renderContacts();
  renderActive();
  renderToolContent();

  await Promise.all([
    loadMessages(1, "replace", jumpUnread ? { jumpUnread: true } : { forceBottom: true }),
    loadContactInfo(),
    loadToolDataForActiveTab()
  ]);
  confirmContactReadInBackground(state.activeContact);
  scheduleAutoAiSuggestion({ source: "select-contact", delay: 300 });
  if (!jumpUnread) scheduleMessageListBottom({ force: true, watchImages: true });
}

function hasUnreadMessageAnchor() {
  return Boolean(el.messageList?.querySelector("[data-red-point='true']"));
}

function scrollToFirstUnreadMessage() {
  const target = el.messageList?.querySelector("[data-red-point='true']");
  if (!target) return false;
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "center", inline: "nearest" });
    target.classList.add("is-jump-highlight");
    window.setTimeout(() => target.classList.remove("is-jump-highlight"), 1200);
  });
  return true;
}

async function jumpToUnreadInActiveList(tab = state.listTab) {
  if (tab !== state.listTab) return false;
  state.pendingUnreadJumpTab = tab;
  const contact = await findUnreadContactInActiveList(tab);
  if (!contact || tab !== state.listTab) {
    state.pendingUnreadJumpTab = "";
    return false;
  }
  const contactId = getContactId(contact);
  const card = el.contactList.querySelector(`[data-contact-id="${CSS.escape(String(contactId))}"]`);
  card?.scrollIntoView({ block: "nearest" });
  card?.focus({ preventScroll: true });
  await selectContactById(contactId, { jumpUnread: true });
  state.pendingUnreadJumpTab = "";
  return true;
}

async function findUnreadContactInActiveList(tab = state.listTab) {
  let contact = getFirstUnreadContact(state.contacts);
  let attempts = 0;
  while (!contact && state.listTab === tab && state.contactListHasMore && attempts < 6) {
    attempts += 1;
    state.contactListAutoLoading = true;
    try {
      await loadContacts({
        mode: "append",
        page: (state.contactListPage || 1) + 1,
        preserveScroll: true,
        skipCounts: true
      });
    } finally {
      state.contactListAutoLoading = false;
    }
    contact = getFirstUnreadContact(state.contacts);
  }
  return contact;
}

async function jumpToUnreadInLoadedMessages() {
  if (!state.messagesFromPreview && scrollToFirstUnreadMessage()) return true;
  if (!state.activeContact) return false;
  if (state.messagesFromPreview || !state.messages.length) {
    await loadMessages(1, "replace", { jumpUnread: true });
    if (scrollToFirstUnreadMessage()) return true;
  }
  let attempts = 0;
  while (!hasUnreadMessageAnchor() && state.messageHasMore && attempts < 5) {
    attempts += 1;
    await loadMessages((state.messagePage || 1) + 1, "append", { jumpUnread: true });
    if (scrollToFirstUnreadMessage()) return true;
  }
  return false;
}

function resetContactScopedState() {
  state.contactInfo = null;
  state.contactInfoContactId = null;
  state.orders = [];
  state.orderTotal = 0;
  state.orderPage = 1;
  state.accountDetails = [];
  state.accountDetailsUserName = "";
  state.accountDetailTotal = 0;
  state.accountDetailPage = 1;
  state.historyMessages = [];
  state.historyContactId = null;
  state.historyPage = 1;
  state.historyTotal = 0;
  state.historyHasMore = false;
  state.historyLoading = false;
  state.historyAutoLoading = false;
  state.aiSuggestion = null;
  state.aiSuggestions = [];
  if (state.aiAutoSuggestTimer) window.clearTimeout(state.aiAutoSuggestTimer);
  state.aiAutoSuggestTimer = null;
  state.aiAutoSuggestInFlightKey = "";
  state.lastAutoAiSuggestionKey = "";
  state.lastSuggestionUsed = false;
  clearAppliedSuggestionContext();
  state.lastSkillPromptKey = "";
  state.lastSkillAutoReplyKey = "";
  state.withdrawRisk = {
    contactId: "",
    loading: false,
    signal: null,
    dismissOpen: false,
    checkedAt: 0,
    error: ""
  };
  if (withdrawRiskScanTimer) window.clearTimeout(withdrawRiskScanTimer);
  withdrawRiskScanTimer = null;
  renderWithdrawRiskSignal();
}

function handleContactListFocusOutside(event) {
  if (el.contactList?.contains(event.target)) return;
  if (event.target?.closest?.("[data-list-tab]")) return;
  state.contactListKeyboardActive = false;
}

function isEditableKeyTarget(target) {
  if (!target) return false;
  const tagName = String(target.tagName || "").toUpperCase();
  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tagName) || Boolean(target.isContentEditable);
}

function handleGlobalContactListKeydown(event) {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return false;
  if (isEditableKeyTarget(event.target)) return false;
  const activeElement = document.activeElement;
  const isListFocused = Boolean(activeElement && el.contactList?.contains(activeElement));
  if (!state.contactListKeyboardActive && !isListFocused) return false;
  event.preventDefault();
  state.contactListKeyboardActive = true;
  selectAdjacentContact(event.key === "ArrowDown" ? 1 : -1);
  return true;
}

async function handleContactListClick(event) {
  const actionTarget = event.target.closest("[data-contact-action]");
  if (actionTarget) {
    event.stopPropagation();
    const contact = state.contacts.find((item) => String(getContactId(item)) === String(actionTarget.dataset.contactId));
    handleContactAction(actionTarget.dataset.contactAction, contact);
    return;
  }

  const card = event.target.closest("[data-contact-id]");
  if (!card) return;
  state.contactListKeyboardActive = true;
  card.focus({ preventScroll: true });
  await selectContactById(card.dataset.contactId);
  focusContactCard(card.dataset.contactId, { preventScroll: true });
}

function handleContactListKeydown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    event.stopPropagation();
    selectAdjacentContact(event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-contact-id]");
  if (!card) return;
  event.preventDefault();
  selectContactById(card.dataset.contactId);
}

function selectAdjacentContact(delta) {
  if (!state.contacts.length) return;
  const activeId = String(getContactId(state.activeContact) || "");
  const currentIndex = Math.max(0, state.contacts.findIndex((contact) => String(getContactId(contact)) === activeId));
  const nextIndex = Math.min(state.contacts.length - 1, Math.max(0, currentIndex + delta));
  const next = state.contacts[nextIndex];
  if (!next) return;
  selectContactById(getContactId(next)).then(() => {
    focusContactCard(getContactId(next), { scroll: true });
  });
}

function focusContactCard(contactId, options = {}) {
  const card = el.contactList?.querySelector(`[data-contact-id="${CSS.escape(String(contactId || ""))}"]`);
  if (!card) return;
  card.focus({ preventScroll: options.preventScroll === true });
  if (options.scroll) card.scrollIntoView({ block: "nearest" });
}

function getInitial(name) {
  return String(name || "客").trim().slice(0, 1) || "客";
}

function getAvatarFromRecord(record) {
  if (!record || typeof record !== "object") return "";
  for (const field of CONTACT_AVATAR_FIELDS) {
    const value = record[field];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return normalizeImageUrl(value);
    }
  }
  return "";
}

function getContactDisplayName(contact, info = getActiveContactInfo(contact)) {
  return firstDisplayValue(
    contact?.userNick,
    contact?.nickName,
    info?.nickName,
    info?.userNick,
    contact?.userRemark,
    info?.userRemark,
    contact?.remark,
    info?.remark,
    contact?.userName,
    info?.userName,
    "客户"
  );
}

function getContactAvatar(contact, info = getActiveContactInfo(contact)) {
  return firstValue(getAvatarFromRecord(info), getAvatarFromRecord(contact), "");
}

function renderContactAvatar(contact, options = {}) {
  const avatar = getContactAvatar(contact, options.info);
  const tagName = avatar ? "img" : "span";
  const id = options.id ? ` id="${escapeAttr(options.id)}"` : "";
  const className = options.className || "";
  const classes = ["contact-photo", className].filter(Boolean).join(" ");
  const fallbackClasses = ["contact-avatar", className].filter(Boolean).join(" ");
  const fallbackText = options.fallbackText !== undefined
    ? options.fallbackText
    : getInitial(options.fallbackName || getContactDisplayName(contact, options.info));
  if (tagName === "img") {
    return `<img${id} class="${escapeAttr(classes)}" src="${escapeAttr(avatar)}" alt="" data-avatar-fallback="${escapeAttr(fallbackText)}" data-avatar-class="${escapeAttr(fallbackClasses)}">`;
  }
  return `<span${id} class="${escapeAttr(fallbackClasses)}">${escapeHtml(fallbackText)}</span>`;
}

function handleAvatarImageError(event) {
  const image = event.target;
  const hasFallback = image instanceof HTMLImageElement
    && Object.prototype.hasOwnProperty.call(image.dataset, "avatarFallback");
  if (!hasFallback) return;
  const fallback = document.createElement("span");
  fallback.className = image.dataset.avatarClass || image.className.replace("contact-photo", "contact-avatar");
  fallback.textContent = image.dataset.avatarFallback;
  if (image.id) fallback.id = image.id;
  image.replaceWith(fallback);
  if (fallback.id === "activeAvatar") el.activeAvatar = fallback;
}

function syncActiveContactFromInfo(info) {
  const contactId = getContactId(state.activeContact);
  if (!contactId || !info) return false;
  const avatar = getContactAvatar(state.activeContact, info);
  if (!avatar || avatar === state.activeContact.avatar) return false;

  const patch = { avatar };
  state.activeContact = { ...state.activeContact, ...patch };
  state.contacts = state.contacts.map((contact) => (
    String(getContactId(contact)) === String(contactId) ? { ...contact, ...patch } : contact
  ));
  return true;
}

function getContactId(contact) {
  return contact && (contact.id || contact.contactId || contact.userId || contact.contactID);
}

function getContactUserName(contact) {
  return firstDisplayValue(contact?.userName, contact?.wxid, contact?.userIdStr, contact?.userId);
}

function getAccountId(contact = state.activeContact) {
  return firstValue(
    contact?.accountId,
    contact?.accId,
    contact?.csAccountId,
    contact?.account?.id,
    getContactListAccountId(),
    state.accountId,
    state.account
  );
}

function getActiveContactInfo(contact = state.activeContact) {
  const info = state.contactInfo;
  if (!contact || !info) return null;
  const contactId = String(getContactId(contact) || "");
  const infoContactId = String(info.chatId || info.contactId || state.contactInfoContactId || "");
  if (contactId && infoContactId && contactId !== infoContactId) return null;
  return info;
}

function getContactUserId(contact, info = getActiveContactInfo(contact)) {
  return firstDisplayValue(
    contact?.userIdStr,
    info?.userIdStr,
    contact?.idStr,
    info?.idStr,
    contact?.userId,
    info?.userId,
    info?.id
  );
}

function getContactRemark(contact, info = getActiveContactInfo(contact)) {
  return firstDisplayValue(
    info?.remark,
    info?.userRemark,
    info?.memo,
    info?.remarks,
    contact?.remark,
    contact?.userRemark,
    contact?.memo,
    contact?.remarks
  );
}

function renderActive() {
  const contact = state.activeContact;
  if (!contact) {
    el.activeAvatar.outerHTML = '<span id="activeAvatar" class="contact-avatar active-photo active-contact-avatar active-avatar-empty" aria-hidden="true"></span>';
    el.activeAvatar = $("activeAvatar");
    el.activeTitle.textContent = "请选择会话";
    el.activeMeta.textContent = "连接服务后选择左侧客户开始处理";
    return;
  }

  renderActiveAvatar(contact);
  const displayName = getContactDisplayName(contact);
  const rawRemark = getContactRemark(contact);
  const remark = isSameDisplayText(rawRemark, displayName) ? "" : rawRemark;
  const displayRemark = remark ? `<span class="active-remark">（${escapeHtml(remark)}）</span>` : "";
  el.activeTitle.innerHTML = `<span class="active-name-text">${escapeHtml(displayName)}</span>${displayRemark}${renderContactTypeBadge(contact, "active-type-badge")}`;
  el.activeMeta.textContent = getActiveRobotMetaText(contact);
}

function renderActiveAvatar(contact) {
  const html = renderContactAvatar(contact, {
    id: "activeAvatar",
    className: "active-photo active-contact-avatar",
    fallbackText: ""
  });
  if (el.activeAvatar.outerHTML !== html) {
    el.activeAvatar.outerHTML = html;
    el.activeAvatar = $("activeAvatar");
  }
}

async function loadMessages(page = 1, mode = "replace", options = {}) {
  const contact = state.activeContact;
  const contactId = getContactId(contact);
  if (!contactId) {
    state.messages = [];
    state.messagePage = 1;
    state.messageHasMore = false;
    renderMessages("none");
    return;
  }

  const previousScrollHeight = el.messageList.scrollHeight;
  const previousScrollTop = el.messageList.scrollTop;
  const wasNearBottom = isNearBottom(el.messageList);
  const previousHasMore = state.messageHasMore;
  const forceBottom = Boolean(options.forceBottom);
  const keepPosition = Boolean(options.keepPosition);
  const jumpUnread = Boolean(options.jumpUnread);
  const redOnly = Boolean(options.redOnly ?? el.redOnly?.checked);
  state.messageLoading = true;
  if (mode === "append" || (!state.messages.length && mode !== "merge")) renderMessages("none");

  try {
    const result = await fetchMessagePage(contact, page, MESSAGE_PAGE_SIZE, {
      endTime: page > 1 ? getMessageCursorTime(state.messages[0]) : "",
      redOnly
    });
    if (String(getContactId(state.activeContact) || "") !== String(contactId)) {
      state.messageLoading = false;
      return;
    }
    const records = result.records;
    const total = result.total;
    const previousCount = state.messages.length;
    let nextMessagesFromPreview = false;

    if (records.length) {
      const shouldMerge = mode === "append" || mode === "merge";
      const nextMessages = mergeMessages(shouldMerge ? [...state.messages, ...records] : records);
      state.messages = nextMessages;
      state.messagePage = mode === "merge" ? Math.max(state.messagePage || 1, page) : page;
      state.messageHasMore = getPagedHasMore({
        mode,
        records,
        pageSize: MESSAGE_PAGE_SIZE,
        total,
        previousHasMore,
        previousCount,
        nextCount: nextMessages.length
      });
    } else if (page === 1) {
      if (redOnly) {
        state.messages = [];
        nextMessagesFromPreview = false;
        if (mode !== "merge") state.messagePage = 1;
        state.messageHasMore = false;
      } else {
        const previewRecords = mergeMessages(state.activeContact?.records || []);
        state.messages = mode === "merge" && state.messages.length ? mergeMessages([...state.messages, ...previewRecords]) : previewRecords;
        nextMessagesFromPreview = true;
        if (mode !== "merge") state.messagePage = 1;
        state.messageHasMore = mode === "merge" ? previousHasMore : false;
      }
    } else {
      state.messageHasMore = false;
    }
    state.messagesFromPreview = nextMessagesFromPreview;

    state.messageLoading = false;
    const shouldScrollBottom = !jumpUnread && (forceBottom || (mode === "replace" && (!keepPosition || wasNearBottom)));
    renderMessages(shouldScrollBottom ? "bottom" : "none");
    if (mode === "append") {
      if (!jumpUnread || !scrollToFirstUnreadMessage()) {
        restorePrependScroll(el.messageList, previousScrollHeight, previousScrollTop, { watchImages: true });
      }
    } else if (mode === "merge") {
      if (jumpUnread && scrollToFirstUnreadMessage()) {
        // Unread jump owns this scroll request.
      } else if (wasNearBottom) {
        scrollElementToBottom(el.messageList, { watchImages: true });
      } else {
        restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
      }
    } else if (keepPosition && !shouldScrollBottom) {
      restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
    } else if (jumpUnread) {
      scrollToFirstUnreadMessage();
    }
    if ((mode === "replace" || mode === "merge") && records.length) {
      maybeBuildSkillSuggestion({ autoReply: mode === "merge" }).catch((error) => log("skill suggestion failed", { error: error.message }));
      scheduleAutoAiSuggestion({ source: `messages:${mode}` });
    }
    scheduleWithdrawRiskScan({ deep: mode !== "append", source: `messages:${mode}` });
  } catch (error) {
    if (page === 1) {
      if (redOnly) {
        state.messages = [];
        state.messagesFromPreview = false;
      } else {
        const previewRecords = mergeMessages(state.activeContact?.records || []);
        state.messages = mode === "merge" && state.messages.length ? mergeMessages([...state.messages, ...previewRecords]) : previewRecords;
        state.messagesFromPreview = true;
      }
    }
    state.messageLoading = false;
    state.messageHasMore = mode === "merge" ? previousHasMore : false;
    const shouldScrollBottom = !jumpUnread && (forceBottom || (mode === "replace" && (!keepPosition || wasNearBottom)));
    renderMessages(shouldScrollBottom ? "bottom" : "none");
    if (keepPosition && !shouldScrollBottom) {
      restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
    } else if (jumpUnread) {
      scrollToFirstUnreadMessage();
    }
    scheduleWithdrawRiskScan({ deep: false, source: `messages:error:${mode}` });
    toast(`聊天记录接口失败：${error.message}`, true);
  }
}

async function fetchMessagePage(contact, page, size, options = {}) {
  const contactId = getContactId(contact);
  const endTime = options.endTime || "";
  const redOnly = Boolean(options.redOnly);
  const liveListParams = {
    contactId,
    size,
    onlyRepointMsg: redOnly,
    endTime
  };
  const endpointAttempts = [
    {
      path: "/ChatContent/GetList",
      data: liveListParams
    },
    {
      path: "/ChatContent/GetList",
      data: {
        contactId,
        endTime,
        current: page,
        size,
        onlyRepointMsg: redOnly
      }
    },
    {
      path: "/ChatContent/GetList",
      data: {
        contactId,
        endTime,
        current: page,
        size,
        ...(redOnly ? { withConfig: true } : {})
      }
    },
    {
      path: "/ChatContent/GetChatContentList",
      data: {
        contactId,
        endTime,
        current: page,
        size,
        onlyRepointMsg: redOnly
      }
    }
  ];

  let lastResult = null;
  let lastError = null;
  for (const attempt of endpointAttempts) {
    try {
      const payload = await api(attempt.path, attempt.data);
      const records = getRecords(payload).map((item, index) => normalizeMessage(item, index));
      const result = {
        payload,
        records,
        total: getExplicitTotal(payload)
      };
      if (records.length) return result;
      lastResult = result;
    } catch (error) {
      lastError = error;
    }
  }

  if (contact?.conversationId) {
    try {
      const payload = await api("/ChatContent/GetChatContentList", {
        contactId,
        endTime,
        current: page,
        size,
        contentid: "",
        keyWord: "",
        onlyRepointMsg: redOnly
      });
      return {
        payload,
        records: getRecords(payload).map((item, index) => normalizeMessage(item, index)),
        total: getExplicitTotal(payload)
      };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResult) return lastResult;
  throw lastError || new Error("聊天记录接口没有返回数据");
}

function normalizeMessage(item, index) {
  const source = String(item.msgSource ?? item.source ?? item.from ?? "");
  const outgoing = source === "1" || source === "2" || source.includes("Kefu") || item.isSelf || item.sendType === 1;
  const ai = source === "3" || source.includes("AI");
  const contentText = getMessageContentText(item);
  const systemNotice = isSystemNoticeMessage(item, contentText, source);
  const timeRaw = item.sendTime || item.createDate || item.createTime || item.time || item.id || item.msgId;
  const stableId = firstValue(
    item.msgId,
    item.messageId,
    item.chatContentId,
    item.contentId,
    item.id,
    `message-${index}`
  );
  return {
    ...item,
    id: stableId,
    rawId: item.id,
    messageKey: buildMessageKey(item, index, stableId),
    direction: systemNotice ? "system" : ai ? "ai" : outgoing ? "outgoing" : "incoming",
    isSystemNotice: systemNotice,
    sender: item.senderName || item.accountName || item.displayName || getMessageSenderName(source, outgoing),
    time: formatTime(timeRaw),
    sortTime: getTimeValue(timeRaw),
    contentType: Number(item.contentType || 0),
    content: contentText,
    cardTitle: firstValue(item.cardTitle, item.miniProTitle, item.title, item.name, ""),
    cardDesc: firstValue(item.cardDesc, item.miniProDesc, item.description, item.desc, ""),
    cardImg: firstValue(item.cardImg, item.miniProImg, item.miniImgUrl, item.miniProCover, item.imageUrl, item.img, item.icon, ""),
    cardUrl: firstValue(item.cardUrl, item.miniProUrl, item.url, item.link, ""),
    miniImgUrl: firstValue(item.miniImgUrl, item.miniImgURL, item.miniProImg, item.miniProCover, "")
  };
}

function getMessageContentText(item = {}) {
  return firstValue(
    item.content,
    item.msg,
    item.message,
    item.text,
    item.talkContent,
    item.cardTitle,
    item.miniProTitle,
    item.cardDesc,
    item.miniProName,
    ""
  );
}

function isSystemNoticeMessage(item, content, source) {
  if (item.bizType === -1 || item.bizType === "-1") return true;
  if (item.isSystem || item.systemNotice || item.msgType === "system") return true;
  const text = String(content || "");
  if (String(source).toLowerCase().includes("system")) return true;
  return /会话\s*（?\d*）?\s*结束|类型：系统关闭|系统关闭|接待客服|我拍了拍/.test(text);
}

function getMessageSenderName(source, outgoing) {
  if (source === "1") return state.activeContact?.robotName || state.activeContact?.robot?.robotRemark || state.activeContact?.robot?.robotName || "机器人";
  if (source === "2") return state.account || "客服";
  if (outgoing) return state.account || "客服";
  return state.activeContact?.userNick || state.activeContact?.userRemark || "客户";
}

function mergeMessages(messages) {
  const seen = new Map();
  messages.forEach((message, index) => {
    const key = getMessageKey(message, index);
    seen.set(key, message);
  });
  return [...seen.values()].sort((a, b) => {
    const delta = Number(a.sortTime || 0) - Number(b.sortTime || 0);
    if (delta) return delta;
    return getMessageKey(a, 0).localeCompare(getMessageKey(b, 0));
  });
}

function getMessageKey(message, index) {
  return String(message.messageKey || buildMessageKey(message, index, message.id));
}

function getMessageCursorTime(message) {
  return firstValue(
    message?.sendTime,
    message?.sortTime,
    message?.createDate,
    message?.createTime,
    message?.time,
    ""
  );
}

function isNearBottom(element, threshold = 60) {
  if (!element) return true;
  return element.scrollHeight - element.clientHeight - element.scrollTop <= threshold;
}

function createScrollGuard(element, options = {}) {
  if (!element) return () => false;
  const token = ++scrollRequestId;
  scrollRequestIds.set(element, token);
  const startedNearBottom = isNearBottom(element);
  const force = Boolean(options.force);
  return () => (
    scrollRequestIds.get(element) === token &&
    (force || !options.onlyIfStillNearBottom || isNearBottom(element) || startedNearBottom)
  );
}

function getPagedHasMore({ mode, records, pageSize, total, previousHasMore, previousCount, nextCount }) {
  const recordCount = records.length;
  const explicitTotal = Number(total);
  const loadedMore = nextCount > previousCount;

  if (mode === "merge" && recordCount === 0) {
    return previousHasMore;
  }

  if (Number.isFinite(explicitTotal) && explicitTotal > 0 && nextCount < explicitTotal) {
    return true;
  }

  if (mode === "replace") {
    return recordCount >= pageSize;
  }

  if (mode === "merge") {
    return previousHasMore || (recordCount >= pageSize && loadedMore);
  }

  if (!loadedMore && recordCount >= pageSize) {
    return previousHasMore;
  }

  return recordCount >= pageSize && loadedMore;
}

function scrollElementToBottom(element, options = {}) {
  if (!element) return;
  const guard = createScrollGuard(element);
  const force = Boolean(options.force);
  let lastAppliedTop = element.scrollTop;
  const apply = () => {
    element.scrollTop = element.scrollHeight;
    lastAppliedTop = element.scrollTop;
  };
  const canApply = () => (
    guard() &&
    (force || isNearBottom(element, 140) || Math.abs(element.scrollTop - lastAppliedTop) <= 2)
  );
  apply();
  requestAnimationFrame(() => {
    if (canApply()) apply();
    requestAnimationFrame(() => {
      if (canApply()) apply();
    });
  });

  if (!options.watchImages) return;
  element.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    const reapply = () => {
      if (canApply()) apply();
    };
    image.addEventListener("load", reapply, { once: true });
    image.addEventListener("error", reapply, { once: true });
  });
}

function scheduleMessageListBottom(options = {}) {
  scrollElementToBottom(el.messageList, options);
}

function restorePrependScroll(element, previousScrollHeight, previousScrollTop, options = {}) {
  if (!element) return;
  const guard = createScrollGuard(element);
  const force = Boolean(options.force);
  let lastAppliedTop = previousScrollTop;
  const apply = () => {
    element.scrollTop = Math.max(0, element.scrollHeight - previousScrollHeight + previousScrollTop);
    lastAppliedTop = element.scrollTop;
  };
  const canApply = () => (
    guard() &&
    (force || Math.abs(element.scrollTop - lastAppliedTop) <= 2)
  );
  apply();
  requestAnimationFrame(() => {
    if (canApply()) apply();
  });

  if (!options.watchImages) return;
  element.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    const reapply = () => {
      if (canApply()) apply();
    };
    image.addEventListener("load", reapply, { once: true });
    image.addEventListener("error", reapply, { once: true });
  });
}

function restoreScrollTop(element, previousScrollTop, options = {}) {
  if (!element) return;
  const guard = createScrollGuard(element);
  const force = Boolean(options.force);
  let lastAppliedTop = previousScrollTop;
  const apply = () => {
    element.scrollTop = Math.max(0, previousScrollTop);
    lastAppliedTop = element.scrollTop;
  };
  const canApply = () => (
    guard() &&
    (force || Math.abs(element.scrollTop - lastAppliedTop) <= 2)
  );
  apply();
  requestAnimationFrame(() => {
    if (canApply()) apply();
  });

  if (!options.watchImages) return;
  element.querySelectorAll("img").forEach((image) => {
    if (image.complete) return;
    const reapply = () => {
      if (canApply()) apply();
    };
    image.addEventListener("load", reapply, { once: true });
    image.addEventListener("error", reapply, { once: true });
  });
}

function renderMessagesPreservingScroll() {
  const previousScrollTop = el.messageList.scrollTop;
  renderMessages("none");
  restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
}

function buildMessageKey(message, index, stableId = "") {
  const primary = firstValue(
    message.msgId,
    message.messageId,
    message.chatContentId,
    message.contentId
  );
  if (primary) return `mid:${primary}`;

  return [
    "body",
    message.contactId || getContactId(state.activeContact) || "",
    message.source ?? message.msgSource ?? message.from ?? "",
    message.contentType ?? "",
    message.sendTime || message.sortTime || message.createDate || message.createTime || message.time || "",
    message.content || message.msg || message.message || message.text || message.talkContent || "",
    stableId || index
  ].map((part) => String(part)).join("|");
}

function renderMessages(scrollMode = "none") {
  const redOnly = Boolean(el.redOnly?.checked);
  if (!state.messages.length) {
    const emptyText = redOnly
      ? "当前会话没有服务端红点配置命中的消息。"
      : "当前会话暂无真实聊天记录，或接口返回为空。";
    el.messageList.innerHTML = `
      <div class="message-load-row">
        <button class="mini-action" type="button" data-action="load-more-messages" ${state.messageHasMore ? "" : "disabled"}>${state.messageLoading ? "加载中..." : "加载更多"}</button>
      </div>
      <div class="empty-state">${emptyText}</div>
    `;
    return;
  }

  const messages = state.messages;
  const filterSummary = redOnly
    ? `<div class="message-filter-summary">已按悠聊红点配置加载 ${messages.length} 条</div>`
    : "";
  el.messageList.innerHTML = [
    `<div class="message-load-row"><button class="mini-action" type="button" data-action="load-more-messages" ${state.messageHasMore && !state.messageLoading ? "" : "disabled"}>${state.messageLoading ? "加载中..." : state.messageHasMore ? "加载更多" : "没有更早记录"}</button></div>`,
    filterSummary,
    '<div class="day-divider">聊天记录</div>',
    ...messages.map((message) => renderMessageBubble(message))
  ].join("");

  if (scrollMode === "bottom") {
    scrollElementToBottom(el.messageList, { force: true, watchImages: true });
  }
  hydrateVisibleLinkCards(el.messageList);
}

function renderMessageBubble(message, options = {}) {
  if (message.isSystemNotice || message.direction === "system") {
    return renderSystemNotice(message);
  }
  const isOutgoing = message.direction === "outgoing" || message.direction === "ai";
  const avatar = renderMessageAvatar(message, isOutgoing);
  const classes = ["message", message.direction || "incoming", options.compact ? "is-compact" : ""].filter(Boolean).join(" ");
  const isRichCard = shouldRenderRichMessageCard(message);
  const body = `
    <div class="message-body">
      <div class="message-meta">
        <span class="message-sender">${escapeHtml(message.sender || "")}</span>
        <time>${escapeHtml(message.time || "")}</time>
      </div>
      <div class="message-content${isRichCard ? " has-rich-card" : ""}">${renderMessageContent(message)}</div>
    </div>
  `;
  return `
    <article class="${escapeAttr(classes)}" data-red-point="${message.isRedPoint || message.isRedpoint ? "true" : "false"}">
      ${isOutgoing ? `${body}${avatar}` : `${avatar}${body}`}
    </article>
  `;
}

function renderSystemNotice(message) {
  return `
    <article class="message-system">
      <span>${escapeHtml(message.content || "系统提示")}</span>
      ${message.time ? `<time>${escapeHtml(message.time)}</time>` : ""}
    </article>
  `;
}

function renderMessageAvatar(message, isOutgoing) {
  if (!isOutgoing) return renderContactAvatar(state.activeContact);
  const avatarText = message.direction === "ai" ? "AI" : "服";
  return `<span class="contact-avatar">${escapeHtml(avatarText)}</span>`;
}

function renderMessageContent(message) {
  const content = message.content || "";
  if (message.contentType === 1 || isImageUrl(content)) {
    const imageUrl = normalizeImageUrl(content);
    const displayImageUrl = getDisplayMediaUrl(imageUrl);
    return `<button class="message-image-button" type="button" data-image-preview="${escapeAttr(imageUrl)}" aria-label="预览聊天图片"><img class="message-image" src="${escapeAttr(displayImageUrl)}" alt="聊天图片"></button>`;
  }
  const fileCard = buildMessageFileCard(message);
  if (fileCard) return renderMessageFileCard(fileCard);
  const miniCard = buildMessageMiniProgramCard(message);
  if (miniCard) return renderMessageMiniProgramCard(miniCard);
  const linkCard = buildMessageLinkCard(message);
  if (linkCard) return renderMessageLinkCard(linkCard, message);
  return linkifyMessageText(content);
}

function shouldRenderRichMessageCard(message) {
  return Boolean(
    buildMessageFileCard(message) ||
    buildMessageMiniProgramCard(message) ||
    buildMessageLinkCard(message)
  );
}

function shouldRenderMessageLinkCard(message) {
  const content = message.content || "";
  if (message.contentType === 1 || isImageUrl(content)) return false;
  return Boolean(buildMessageLinkCard(message));
}

function buildMessageLinkCard(message) {
  if (buildMessageFileCard(message) || buildMessageMiniProgramCard(message)) return null;
  const deepLinkCard = buildAppDeepLinkCard(message);
  if (deepLinkCard) return deepLinkCard;
  const nativeUrl = firstValue(
    message.cardUrl,
    message.url
  );
  const contentUrl = extractFirstUrl(message.content);
  const canPromoteContentUrl = [5, 49].includes(Number(message.contentType)) || isStandaloneUrlMessage(message.content, contentUrl);
  const directUrl = nativeUrl || (canPromoteContentUrl ? contentUrl : "");
  const hasCardFields = Boolean(message.cardTitle || message.cardDesc || message.cardImg || directUrl || [5, 7, 49].includes(Number(message.contentType)));
  if (!hasCardFields) return null;
  const url = directUrl ? normalizeLinkUrl(directUrl) : "";
  if (directUrl && !url) return null;
  const cached = state.linkPreviewCache[url] || {};
  const previewUrl = firstValue(cached.video, cached.player, cached.videoSecureUrl, "");
  const knownSite = getKnownSiteMeta(url);
  const knownSiteLogo = knownSite ? firstValue(knownSite.logoUrl, getKnownSiteLogoDataUrl(knownSite), "") : "";
  const generatedKnownSiteLogo = knownSite ? getKnownSiteLogoDataUrl(knownSite) : "";
  return {
    url,
    title: firstValue(message.cardTitle, cached.title, getUrlHost(url), "链接卡片"),
    desc: firstValue(message.cardDesc, cached.description, ""),
    image: firstValue(message.cardImg, cached.image, knownSiteLogo, ""),
    imageKind: firstValue(message.cardImg, cached.image, "") ? "image" : knownSiteLogo ? "site-logo" : "",
    imageFallback: generatedKnownSiteLogo,
    video: previewUrl,
    videoType: firstValue(cached.videoType, cached.contentType, ""),
    siteName: firstValue(message.displayName, cached.siteName, knownSite?.name, getUrlHost(url), ""),
    siteBrand: knownSite?.name || "",
    contentType: message.contentType
  };
}

function buildAppDeepLinkCard(message) {
  const rawDeepLink = extractFirstAppDeepLink(firstValue(message.cardUrl, message.url, message.content, ""));
  if (!rawDeepLink) return null;
  const parsed = parseAppDeepLink(rawDeepLink);
  if (!parsed) return null;
  const profile = getAppDeepLinkProfile(parsed.scheme);
  const nested = getDeepLinkNestedData(parsed);
  const embeddedUrl = getDeepLinkEmbeddedUrl(rawDeepLink, parsed);
  const cached = state.linkPreviewCache[embeddedUrl] || {};
  const knownSite = getKnownSiteMeta(embeddedUrl) || null;
  const title = firstValue(
    message.cardTitle,
    nested.title,
    nested.video_title,
    nested.nickname,
    cached.title,
    parsed.params.title,
    parsed.params.title_id,
    parsed.params.topic,
    knownSite?.name,
    profile?.mediaKind === "video" ? `${profile.name}视频` : `${profile?.name || parsed.scheme}链接`
  );
  const desc = firstValue(
    message.cardDesc,
    nested.video_des,
    nested.desc,
    nested.description,
    cached.description,
    parsed.params.desc,
    parsed.params.description,
    parsed.params.video_des,
    embeddedUrl ? getUrlHost(embeddedUrl) : "来自客户端分享的应用深链，已折叠显示"
  );
  const image = firstValue(
    message.cardImg,
    nested.cover,
    nested.cover_url,
    nested.pic_url,
    nested.thumb_url,
    cached.image,
    parsed.params.cover,
    parsed.params.cover_url,
    parsed.params.thumb_url,
    parsed.params.pic_url,
    knownSite?.logoUrl,
    getAppDeepLinkLogoDataUrl(profile, parsed.scheme),
    ""
  );
  const generatedLogo = getAppDeepLinkLogoDataUrl(profile, parsed.scheme);
  return {
    url: embeddedUrl,
    rawUrl: rawDeepLink,
    title,
    desc,
    image,
    imageKind: firstValue(message.cardImg, nested.cover, nested.cover_url, nested.pic_url, nested.thumb_url, cached.image, parsed.params.cover, parsed.params.cover_url, parsed.params.thumb_url, parsed.params.pic_url, "") ? "image" : "site-logo",
    imageFallback: generatedLogo,
    video: firstValue(cached.video, cached.player, cached.videoSecureUrl, ""),
    videoType: firstValue(cached.videoType, cached.contentType, ""),
    siteName: profile?.name || knownSite?.name || parsed.scheme,
    siteBrand: profile?.name || knownSite?.name || parsed.scheme,
    status: profile?.status || "应用深链",
    isDeepLink: true,
    contentType: message.contentType
  };
}

function renderMessageLinkCard(card, message) {
  const hasImage = Boolean(card.image);
  const previewUrl = card.url || "";
  const status = card.status || (card.url && state.linkPreviewCache[card.url]?.loading ? "正在获取预览" : card.video ? "可预览视频" : "网页预览");
  const host = getUrlHost(card.url) || getDeepLinkDisplayHost(card.rawUrl);
  const fallbackText = (host || "LINK").slice(0, 4).toUpperCase();
  const cardAttrs = card.url
    ? ` data-link-card="${escapeAttr(card.url)}" data-message-id="${escapeAttr(message.id || "")}"`
    : ` data-message-id="${escapeAttr(message.id || "")}"`;
  return `
    <article class="message-link-card ${card.isDeepLink ? "is-deep-link" : "is-web-card"}"${cardAttrs}>
      ${previewUrl ? `<button class="link-card-detail" type="button" data-link-preview="${escapeAttr(previewUrl)}">详情</button>` : ""}
      <div class="link-card-main">
        <div class="link-card-copy">
          <strong>${escapeHtml(card.title || getUrlHost(card.url) || "链接卡片")}</strong>
          ${card.desc ? `<p>${escapeHtml(card.desc)}</p>` : previewUrl ? `<p>${escapeHtml(previewUrl)}</p>` : card.rawUrl ? `<p>${escapeHtml(card.rawUrl)}</p>` : ""}
          <span>${escapeHtml(card.siteName || host || status)}</span>
        </div>
        <div class="link-card-thumb ${hasImage ? "" : "is-empty"} ${card.imageKind === "site-logo" ? "is-site-logo" : ""}">
          ${hasImage ? `<img src="${escapeAttr(getDisplayMediaUrl(card.image))}" alt="${escapeAttr(card.siteBrand || card.siteName || "网站")}"${card.imageFallback ? ` onerror="this.onerror=null;this.src='${escapeAttr(card.imageFallback)}';"` : ""}>` : `<span>${escapeHtml(fallbackText)}</span>`}
        </div>
      </div>
      <div class="link-card-actions">
        <span>${escapeHtml(status)}</span>
        ${card.url ? `<button class="mini-action ghost" type="button" data-open-link="${escapeAttr(card.url)}">打开</button>` : ""}
        ${card.rawUrl || card.url ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.rawUrl || card.url)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : ""}
      </div>
    </article>
  `;
}

function buildMessageMiniProgramCard(message) {
  const parsedContent = parseMessagePayload(message.content);
  const parsedExt = parseMessagePayload(message.ext);
  const isMini = Number(message.contentType) === 6 || Boolean(message.miniProTitle || message.miniProName || message.miniProImg || message.miniImgUrl || message.miniProUrl);
  if (!isMini) return null;
  const title = firstValue(
    message.miniProTitle,
    parsedContent.miniProTitle,
    parsedContent.title,
    parsedContent.Title,
    parsedExt.miniProTitle,
    parsedExt.title,
    parsedExt.Title,
    message.cardTitle,
    message.cardDesc,
    "小程序"
  );
  const appName = firstValue(
    message.miniProName,
    parsedContent.miniProName,
    parsedContent.appName,
    parsedContent.AppName,
    parsedContent.source,
    parsedContent.displayName,
    parsedExt.miniProName,
    parsedExt.appName,
    parsedExt.AppName,
    parsedExt.source,
    parsedExt.displayName,
    message.displayName,
    "小程序"
  );
  const desc = firstValue(message.miniProDesc, parsedContent.description, parsedContent.desc, parsedContent.des, parsedExt.description, parsedExt.desc, parsedExt.des, message.cardDesc, title);
  const image = firstValue(
    message.miniProImg,
    message.miniImgUrl,
    message.miniProCover,
    parsedContent.miniProImg,
    parsedContent.miniImgUrl,
    parsedContent.image,
    parsedContent.thumbUrl,
    parsedContent.cover,
    parsedContent.icon,
    parsedExt.miniProImg,
    parsedExt.miniImgUrl,
    parsedExt.image,
    parsedExt.thumbUrl,
    parsedExt.cover,
    parsedExt.icon,
    message.cardImg,
    ""
  );
  const appIcon = firstValue(message.miniProIcon, message.miniProLogo, parsedContent.appIcon, parsedContent.iconUrl, parsedContent.icon, parsedExt.appIcon, parsedExt.iconUrl, parsedExt.icon, "");
  const url = normalizeLinkUrl(firstValue(message.miniProUrl, parsedContent.url, parsedExt.url, message.cardUrl, ""));
  const pagePath = firstValue(message.pagePath, message.miniProPagePath, parsedContent.pagePath, parsedContent.path, parsedExt.pagePath, parsedExt.path, "");
  const appId = firstValue(message.miniProAppId, parsedContent.appId, parsedContent.appid, parsedExt.appId, parsedExt.appid, "");
  const ghId = firstValue(message.miniProGhId, parsedContent.ghId, parsedContent.username, parsedExt.ghId, parsedExt.username, "");
  const placeholder = getMiniProgramPlaceholderDataUrl(appName, title);
  return {
    title,
    appName,
    desc,
    image: image || placeholder,
    imageFallback: placeholder,
    imagePlaceholder: !image,
    appIcon,
    url,
    pagePath,
    appId,
    ghId
  };
}

function renderMessageMiniProgramCard(card) {
  return `
    <article class="message-mini-card">
      <div class="mini-card-app">
        ${card.appIcon ? `<img src="${escapeAttr(getDisplayMediaUrl(card.appIcon))}" alt="">` : '<span class="mini-card-app-mark" aria-hidden="true"></span>'}
        <span>${escapeHtml(card.appName || "小程序")}</span>
      </div>
      <strong class="mini-card-heading">${escapeHtml(card.title || card.desc || "小程序")}</strong>
      <div class="mini-card-cover${card.imagePlaceholder ? " is-placeholder" : ""}">
        <img src="${escapeAttr(getDisplayMediaUrl(card.image))}" alt=""${card.imageFallback ? ` onerror="this.onerror=null;this.src='${escapeAttr(card.imageFallback)}';"` : ""}>
      </div>
      <div class="mini-card-footer">
        <span class="mini-card-mark" aria-hidden="true"></span>
        <span>小程序</span>
        ${card.url ? `<button class="mini-action ghost" type="button" data-open-link="${escapeAttr(card.url)}">打开</button>` : ""}
        ${card.url ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.url)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : ""}
        ${!card.url && card.pagePath ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.pagePath)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : ""}
      </div>
    </article>
  `;
}

function getMiniProgramPlaceholderDataUrl(appName = "小程序", title = "") {
  const label = String(appName || "小程序").slice(0, 6);
  const headline = String(title || "小程序").slice(0, 12);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
      <defs>
        <linearGradient id="mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#eefbf4"/>
          <stop offset="1" stop-color="#eaf3ff"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" rx="8" fill="url(#mini-bg)"/>
      <rect x="42" y="36" width="396" height="198" rx="10" fill="#ffffff" stroke="#d7e3ef"/>
      <circle cx="240" cy="112" r="34" fill="#22c55e"/>
      <circle cx="225" cy="108" r="8" fill="#ffffff"/>
      <circle cx="255" cy="108" r="8" fill="#ffffff"/>
      <path d="M224 132c12 10 24 10 36 0" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="7"/>
      <text x="240" y="176" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif" font-size="28" font-weight="700" fill="#1f2937">${escapeSvgText(headline)}</text>
      <text x="240" y="209" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif" font-size="17" fill="#68758a">${escapeSvgText(label)}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildMessageFileCard(message) {
  const parsed = parseMessagePayload(message.content);
  const fileUrl = firstValue(
    message.fileUrl,
    message.url,
    message.cardUrl,
    parsed.fileUrl,
    parsed.FileUrl,
    parsed.url,
    parsed.Url,
    parsed.cdnattachurl,
    parsed.CdnAttachUrl,
    ""
  );
  const normalizedUrl = normalizeLinkUrl(fileUrl);
  const title = firstValue(
    message.fileName,
    message.fileTitle,
    message.displayName,
    parsed.fileName,
    parsed.FileName,
    parsed.title,
    parsed.Title,
    message.cardTitle,
    getFileNameFromUrl(normalizedUrl),
    ""
  );
  const extension = getFileExtension(firstValue(title, normalizedUrl, message.content));
  const isFile = Number(message.contentType) === 8 || Boolean(message.fileName || message.fileUrl || message.fileSize || title && extension && normalizedUrl && isDocumentExtension(extension));
  if (!isFile) return null;
  const size = formatFileSize(firstValue(
    message.fileSize,
    parsed.fileSize,
    parsed.FileSize,
    parsed.size,
    parsed.Size,
    parsed.totalLen,
    parsed.TotalLen,
    parsed.totallen,
    ""
  ));
  const source = firstValue(message.displayName, parsed.appName, parsed.AppName, parsed.source, parsed.Source, "微信电脑版");
  return {
    title: title || "文件",
    extension: extension || "file",
    size,
    source,
    url: normalizedUrl,
    raw: message.content
  };
}

function renderMessageFileCard(card) {
  const icon = getFileIconMeta(card.extension);
  return `
    <article class="message-file-card">
      <div class="file-card-main">
        <div class="file-card-copy">
          <strong title="${escapeAttr(card.title)}">${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.size || "文件")}</span>
        </div>
        <span class="file-card-icon ${escapeAttr(icon.className)}">${escapeHtml(icon.label)}</span>
      </div>
      <div class="file-card-footer">
        <span class="file-card-source-icon" aria-hidden="true"></span>
        <span>${escapeHtml(card.source || "文件消息")}</span>
        ${card.url ? `<button class="mini-action ghost" type="button" data-open-link="${escapeAttr(card.url)}">打开</button>` : ""}
        ${card.url ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.url)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.title)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>`}
      </div>
    </article>
  `;
}

function parseMessagePayload(content) {
  const text = String(content || "").trim();
  if (!text) return {};
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  if (!text.includes("<")) return {};
  const getXmlValue = (name) => {
    const match = text.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
    return match ? cleanXmlValue(match[1]) : "";
  };
  return {
    title: getXmlValue("title"),
    description: getXmlValue("des") || getXmlValue("desc"),
    appName: getXmlValue("sourcedisplayname") || getXmlValue("appname"),
    url: getXmlValue("url"),
    appId: getXmlValue("appid"),
    ghId: getXmlValue("ghid"),
    username: getXmlValue("username"),
    pagePath: getXmlValue("pagepath") || getXmlValue("path"),
    appIcon: getXmlValue("appicon") || getXmlValue("iconurl"),
    miniImgUrl: getXmlValue("miniimgurl") || getXmlValue("cover") || getXmlValue("hdheadimg"),
    fileName: getXmlValue("filename") || getXmlValue("title"),
    fileSize: getXmlValue("totallen") || getXmlValue("filesize"),
    fileUrl: getXmlValue("cdnattachurl") || getXmlValue("url"),
    thumbUrl: getXmlValue("thumburl") || getXmlValue("cdnthumburl")
  };
}

function cleanXmlValue(value) {
  return decodeHtmlEntities(String(value || "").trim().replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, "$1").trim());
}

function extractFirstAppDeepLink(text) {
  const matches = String(text || "").match(/[a-z][a-z0-9+.-]*:\/\/[^\s<>"']+/gi) || [];
  const match = matches.find((url) => {
    const scheme = getUrlScheme(url);
    return scheme && !["http", "https"].includes(scheme);
  });
  return match ? trimTrailingUrlPunctuation(match) : "";
}

function parseAppDeepLink(value) {
  const raw = String(value || "").trim();
  const scheme = getUrlScheme(raw);
  if (!scheme || ["http", "https"].includes(scheme)) return null;
  const queryIndex = raw.indexOf("?");
  const queryText = queryIndex >= 0 ? raw.slice(queryIndex + 1) : "";
  const params = {};
  if (queryText) {
    new URLSearchParams(queryText).forEach((value, key) => {
      params[key] = decodeUrlValue(value);
    });
  }
  return { raw, scheme, params };
}

function getDeepLinkNestedData(parsed) {
  const keys = ["feed_info", "feedInfo", "data", "extra", "params", "info", "share_info", "shareInfo"];
  for (const key of keys) {
    const value = parsed?.params?.[key];
    const data = parseNestedObject(value);
    if (Object.keys(data).length) return data;
  }
  return {};
}

function parseNestedObject(value) {
  const text = decodeUrlValue(value).trim();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function getUrlScheme(value) {
  const match = String(value || "").trim().match(/^([a-z][a-z0-9+.-]*):\/\//i);
  return match ? match[1].toLowerCase() : "";
}

function decodeUrlValue(value) {
  let text = String(value || "");
  for (let index = 0; index < 2; index += 1) {
    try {
      const decoded = decodeURIComponent(text);
      if (decoded === text) break;
      text = decoded;
    } catch {
      break;
    }
  }
  return text;
}

function loadRecentEmojis() {
  try {
    const raw = localStorage.getItem("youchat.recentEmojis");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecentEmojis(tokens) {
  const unique = [...new Set(tokens)];
  const trimmed = unique.slice(0, 8);
  localStorage.setItem("youchat.recentEmojis", JSON.stringify(trimmed));
  state.recentEmojis = trimmed;
}

function recordRecentEmoji(token) {
  const next = [token, ...state.recentEmojis.filter((t) => t !== token)];
  saveRecentEmojis(next);
}

function getReplyTextContent() {
  const node = el.replyText;
  if (!node) return "";
  return extractTextFromNode(node);
}

function extractTextFromNode(node) {
  let text = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === "BR") {
        text += "\n";
      } else if (child.classList?.contains("emoji-inline")) {
        text += child.dataset.token || "";
      } else if (child.classList?.contains("inline-draft-image")) {
        text += "[图片]";
      } else if (child.tagName === "DIV" || child.tagName === "P") {
        text += extractTextFromNode(child);
      } else {
        text += extractTextFromNode(child);
      }
    }
  });
  return text;
}

function parseComposerBlocks() {
  const node = el.replyText;
  if (!node) return { blocks: [], images: [] };
  const blocks = [];
  const images = [];
  let currentText = "";
  const flushText = () => {
    if (currentText) {
      blocks.push({ type: "text", content: currentText });
      currentText = "";
    }
  };
  const walk = (parent) => {
    parent.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        currentText += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "BR") {
          currentText += "\n";
        } else if (child.classList?.contains("emoji-inline")) {
          currentText += child.dataset.token || "";
        } else if (child.classList?.contains("inline-draft-image")) {
          flushText();
          const imageId = child.dataset.imageId;
          const image = state.draftImages.find((img) => img.id === imageId);
          if (image) {
            blocks.push({ type: "image", imageId, image });
            images.push(image);
          }
        } else {
          walk(child);
        }
      }
    });
  };
  walk(node);
  flushText();
  return { blocks, images };
}

function setReplyTextContent(html) {
  if (el.replyText) el.replyText.innerHTML = html || "";
}

function insertInlineImagesAtCursor(files) {
  const node = el.replyText;
  if (!node) return;
  node.focus();
  const selection = window.getSelection();
  let range;
  if (selection.rangeCount && node.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    range = selection.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
  }
  files.forEach((file) => {
    const img = createInlineImageElement(file);
    if (!img || !img.nodeType) return;
    range.insertNode(img);
    range.setStartAfter(img);
    range.setEndAfter(img);
  });
  selection.removeAllRanges();
  selection.addRange(range);
}

function createInlineImageElement(file) {
  const info = addInlineDraftImage(file);
  if (!info) return document.createTextNode("");
  const span = document.createElement("span");
  span.className = "inline-draft-image";
  span.contentEditable = "false";
  span.dataset.inlineImage = "true";
  span.dataset.imageId = info.id;
  span.dataset.objectUrl = info.objectUrl;
  const img = document.createElement("img");
  img.src = info.objectUrl;
  img.alt = file.name || "图片";
  img.draggable = false;
  span.appendChild(img);
  return span;
}

function insertEmojiAtCursor(token) {
  const node = el.replyText;
  if (!node) return;
  node.focus();
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    node.appendChild(createEmojiElement(token));
    return;
  }
  const range = selection.getRangeAt(0);
  if (!node.contains(range.commonAncestorContainer)) {
    node.appendChild(createEmojiElement(token));
    return;
  }
  range.deleteContents();
  const emojiEl = createEmojiElement(token);
  range.insertNode(emojiEl);
  range.setStartAfter(emojiEl);
  range.setEndAfter(emojiEl);
  selection.removeAllRanges();
  selection.addRange(range);
}

function createEmojiElement(token) {
  const span = document.createElement("span");
  span.className = "emoji-inline";
  span.dataset.token = token;
  span.contentEditable = "false";
  const emoji = EMOJI_LOOKUP.get(token);
  if (emoji) {
    span.style.cssText = `display:inline-block;width:20px;height:20px;overflow:hidden;background-image:url('/static/emojiSource.cdbf96da.png');background-repeat:no-repeat;background-size:203.625px 185.0625px;background-position:${emoji.x}px ${emoji.y}px;vertical-align:text-bottom;`;
  }
  return span;
}

function insertTextAtCursor(input, text) {
  if (input.isContentEditable) {
    input.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      input.appendChild(document.createTextNode(text));
      return;
    }
    const range = selection.getRangeAt(0);
    if (!input.contains(range.commonAncestorContainer)) {
      input.appendChild(document.createTextNode(text));
      return;
    }
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }
  const value = input.value || "";
  const start = input.selectionStart ?? value.length;
  const end = input.selectionEnd ?? value.length;
  input.value = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const next = start + String(text).length;
  input.focus();
  input.setSelectionRange(next, next);
}

function getDeepLinkEmbeddedUrl(rawDeepLink, parsed = parseAppDeepLink(rawDeepLink)) {
  const nested = getDeepLinkNestedData(parsed);
  const candidates = [
    parsed?.params?.url,
    parsed?.params?.target_url,
    parsed?.params?.link,
    parsed?.params?.web_url,
    parsed?.params?.share_url,
    parsed?.params?.h5_url,
    parsed?.params?.page_url,
    parsed?.params?.jump_url,
    nested.url,
    nested.target_url,
    nested.link,
    nested.web_url,
    nested.share_url,
    nested.h5_url,
    nested.page_url
  ];
  for (const candidate of candidates) {
    const url = normalizeLinkUrl(candidate);
    if (url) return url;
  }

  const text = decodeUrlValue(rawDeepLink);
  const embedded = extractFirstWebUrl(text);
  return embedded ? normalizeLinkUrl(embedded) : "";
}

function getAppDeepLinkProfile(scheme) {
  const normalized = String(scheme || "").toLowerCase();
  return APP_DEEP_LINK_PROFILES.find((profile) => profile.schemes.includes(normalized)) || {
    name: normalized || "应用",
    label: normalized ? normalized.slice(0, 4).toUpperCase() : "APP",
    bg: "#64748b",
    fg: "#ffffff",
    status: "应用深链"
  };
}

function getAppDeepLinkLogoDataUrl(profile, scheme = "") {
  const site = profile || getAppDeepLinkProfile(scheme);
  const cacheKey = `deep:${site.name || scheme}`;
  if (knownSiteLogoCache[cacheKey]) return knownSiteLogoCache[cacheKey];
  const label = String(site.label || site.name || scheme || "APP").slice(0, 4);
  const fontSize = label.length >= 4 ? 18 : label.length >= 3 ? 22 : 24;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="22" fill="${site.bg || "#64748b"}"/>
      <text x="72" y="78" text-anchor="middle" dominant-baseline="middle"
        font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif"
        font-size="${fontSize}" font-weight="700" fill="${site.fg || "#ffffff"}">${escapeSvgText(label)}</text>
    </svg>
  `.trim();
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  knownSiteLogoCache[cacheKey] = dataUrl;
  return dataUrl;
}

function getDeepLinkDisplayHost(rawDeepLink) {
  const scheme = getUrlScheme(rawDeepLink);
  return getAppDeepLinkProfile(scheme)?.name || scheme || "";
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function getFileNameFromUrl(url) {
  if (!url) return "";
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "");
  } catch {
    return "";
  }
}

function getFileExtension(value) {
  const text = String(value || "");
  const match = text.match(/\.([a-z0-9]{1,8})(?:$|[?#\s"])/i) || text.match(/\.([a-z0-9]{1,8})$/i);
  return match ? match[1].toLowerCase() : "";
}

function isDocumentExtension(extension) {
  return ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "zip", "rar", "7z", "txt", "csv"].includes(String(extension || "").toLowerCase());
}

function formatFileSize(value) {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string" && /[kmgt]?b$/i.test(value.trim())) return value.trim();
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return String(value || "");
  const units = ["B", "K", "M", "G"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const precision = size >= 10 || unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(precision)}${units[unitIndex]}`;
}

function getFileIconMeta(extension) {
  const ext = String(extension || "").toLowerCase();
  if (["doc", "docx"].includes(ext)) return { label: "W", className: "is-word" };
  if (["xls", "xlsx", "csv"].includes(ext)) return { label: "X", className: "is-excel" };
  if (["ppt", "pptx"].includes(ext)) return { label: "P", className: "is-powerpoint" };
  if (ext === "pdf") return { label: "PDF", className: "is-pdf" };
  if (["zip", "rar", "7z"].includes(ext)) return { label: "ZIP", className: "is-archive" };
  return { label: (ext || "FILE").slice(0, 4).toUpperCase(), className: "is-generic" };
}

function getKnownSiteMeta(url) {
  let hostname = "";
  try {
    hostname = new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
  return KNOWN_SITE_LOGOS.find((site) => site.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) || null;
}

function getKnownSiteLogoDataUrl(site) {
  if (!site?.name) return "";
  if (knownSiteLogoCache[site.name]) return knownSiteLogoCache[site.name];
  const fontSize = site.label.length >= 4 ? 18 : site.label.length >= 3 ? 22 : 24;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" rx="22" fill="${site.bg}"/>
      <text x="72" y="78" text-anchor="middle" dominant-baseline="middle"
        font-family="Microsoft YaHei, PingFang SC, Arial, sans-serif"
        font-size="${fontSize}" font-weight="700" fill="${site.fg}">${escapeSvgText(site.label)}</text>
    </svg>
  `.trim();
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  knownSiteLogoCache[site.name] = dataUrl;
  return dataUrl;
}

function escapeSvgText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractFirstUrl(text) {
  const match = extractFirstWebUrl(text);
  return match ? trimTrailingUrlPunctuation(match) : "";
}

function extractUrls(text) {
  const matches = extractWebUrls(text);
  return [...new Set(matches.map(trimTrailingUrlPunctuation).map(normalizeLinkUrl).filter(Boolean))];
}

function extractFirstWebUrl(text) {
  return extractWebUrls(text)[0] || "";
}

function extractWebUrls(text) {
  return String(text || "").match(/https?:\/\/[^\s<>"']+|\/\/[^\s<>"']+/gi) || [];
}

function trimTrailingUrlPunctuation(url) {
  return String(url || "").replace(/[),.;\uFF0C\u3002\uFF1B\u3001]+$/g, "");
}

function isStandaloneUrlMessage(content, url) {
  const raw = String(content || "").trim();
  const normalizedUrl = normalizeLinkUrl(url);
  if (!raw || !normalizedUrl) return false;
  return normalizeLinkUrl(trimTrailingUrlPunctuation(raw)) === normalizedUrl;
}

function normalizeLinkUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const withProtocol = text.startsWith("//") ? `https:${text}` : text;
  if (!/^https?:\/\//i.test(withProtocol)) return "";
  try {
    return new URL(withProtocol).toString();
  } catch {
    return "";
  }
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderEmojiGlyph(token, options = {}) {
  const emoji = EMOJI_LOOKUP.get(token);
  if (!emoji) {
    return options.fallback === false ? "" : `<span class="emoji-fallback">${escapeHtml(token)}</span>`;
  }
  const className = ["client-emoji-icon", options.className || ""].filter(Boolean).join(" ");
  const sizeStyle = options.size ? `--emoji-size:${Number(options.size)}px;` : "";
  return `<span class="${escapeAttr(className)}" style="${sizeStyle}--emoji-x:${emoji.x}px;--emoji-y:${emoji.y}px;" data-emoji-token="${escapeAttr(token)}" aria-hidden="true"></span>`;
}

function renderInlineTextWithEmojiAndLinks(content) {
  const text = String(content || "");
  if (!text) return "";
  const matches = [];

  extractUrls(text).forEach((url) => {
    const raw = trimTrailingUrlPunctuation(url);
    if (!raw) return;
    let start = text.indexOf(raw);
    while (start !== -1) {
      matches.push({
        start,
        end: start + raw.length,
        type: "url",
        raw
      });
      start = text.indexOf(raw, start + raw.length);
    }
  });

  let emojiMatch;
  while ((emojiMatch = EMOJI_TOKEN_PATTERN.exec(text))) {
    matches.push({
      start: emojiMatch.index,
      end: emojiMatch.index + emojiMatch[0].length,
      type: "emoji",
      raw: emojiMatch[0]
    });
  }
  EMOJI_TOKEN_PATTERN.lastIndex = 0;

  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  let cursor = 0;
  let html = "";
  for (const match of matches) {
    if (match.start < cursor) continue;
    html += escapeHtml(text.slice(cursor, match.start));
    if (match.type === "url") {
      const normalized = normalizeLinkUrl(match.raw);
      const label = escapeHtml(match.raw);
      html += normalized
        ? `<button class="inline-link-button" type="button" data-link-preview="${escapeAttr(normalized)}">${label}</button>`
        : label;
    } else if (match.type === "emoji") {
      html += renderEmojiGlyph(match.raw, { className: "message-emoji-icon", size: 20 });
    }
    cursor = match.end;
  }
  html += escapeHtml(text.slice(cursor));
  return html;
}

function getUrlHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function linkifyMessageText(content) {
  return renderInlineTextWithEmojiAndLinks(content);
}

function hydrateVisibleLinkCards(root) {
  if (!root) return;
  root.querySelectorAll("[data-link-card]").forEach((node) => {
    const url = node.dataset.linkCard || "";
    if (!url || state.linkPreviewCache[url]?.loaded || state.linkPreviewCache[url]?.loading || state.linkPreviewCache[url]?.failed) return;
    loadLinkPreviewMeta(url).catch((error) => {
      state.linkPreviewCache[url] = { ...(state.linkPreviewCache[url] || {}), failed: true, loading: false, error: error.message };
      log("link preview failed", { url, error: error.message });
    });
  });
}

async function loadLinkPreviewMeta(url) {
  state.linkPreviewCache[url] = { ...(state.linkPreviewCache[url] || {}), loading: true };
  const response = await fetch(`/local/link-preview?url=${encodeURIComponent(url)}`);
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `HTTP ${response.status}`);
  }
  state.linkPreviewCache[url] = { ...payload.data, loading: false, loaded: true };
  refreshRenderedLinkCard(url);
  if (state.activeLinkPreview?.url === url) renderActiveLinkPreview();
}

function refreshRenderedLinkCard(url) {
  const rerender = (messages, root) => {
    if (!root) return;
    const message = messages.find((item) => getMessagePreviewUrl(item) === url);
    if (!message) return;
    root.querySelectorAll("[data-link-card]").forEach((node) => {
      if (node.dataset.linkCard !== url) return;
      const card = buildMessageLinkCard(message);
      if (card) node.outerHTML = renderMessageLinkCard(card, message);
    });
  };
  rerender(state.messages, el.messageList);
  rerender(state.historyMessages, el.toolContent);
}

function getMessagePreviewUrl(message) {
  const card = buildMessageLinkCard(message);
  return card?.url || normalizeLinkUrl(firstValue(message.cardUrl, message.miniProUrl, extractFirstUrl(message.content)));
}

function showLinkPreview(url) {
  const normalizedUrl = normalizeLinkUrl(url);
  if (!normalizedUrl) {
    toast("链接地址无效。", true);
    return;
  }
  state.activeLinkPreview = { url: normalizedUrl };
  const needsMeta = !state.linkPreviewCache[normalizedUrl]?.loaded && !state.linkPreviewCache[normalizedUrl]?.loading;
  if (needsMeta) {
    state.linkPreviewCache[normalizedUrl] = { ...(state.linkPreviewCache[normalizedUrl] || {}), loading: true };
  }
  renderActiveLinkPreview();
  el.linkPreviewOverlay.classList.remove("is-hidden");
  if (needsMeta) {
    loadLinkPreviewMeta(normalizedUrl).catch((error) => {
      state.linkPreviewCache[normalizedUrl] = { ...(state.linkPreviewCache[normalizedUrl] || {}), failed: true, loading: false, error: error.message };
      renderActiveLinkPreview();
    });
  }
}

function showImagePreview(url) {
  const imageUrl = normalizePreviewImageUrl(url);
  if (!imageUrl) {
    toast("图片地址无效。", true);
    return;
  }
  state.activeLinkPreview = { url: imageUrl, type: "image" };
  renderActiveLinkPreview();
  el.linkPreviewOverlay.classList.remove("is-hidden");
}

function renderActiveLinkPreview() {
  const activePreview = state.activeLinkPreview || {};
  const url = activePreview.url || "";
  const isImagePreview = activePreview.type === "image";
  el.linkPreviewPanel.classList.toggle("is-image-preview", isImagePreview);
  el.linkPreviewOpen.textContent = isImagePreview ? "打开原图" : "打开网页";
  const meta = state.linkPreviewCache[url] || {};
  const title = meta.title || getUrlHost(url) || "链接详情";
  el.linkPreviewTitle.textContent = title;
  el.linkPreviewSubtitle.textContent = meta.description || url;
  el.linkPreviewOpen.dataset.openLink = url;
  el.linkPreviewCopy.dataset.copyUrl = url;
  el.linkPreviewOpen.disabled = false;
  if (isImagePreview) {
    const canOpenExternal = Boolean(normalizeLinkUrl(url));
    el.linkPreviewTitle.textContent = "图片预览";
    el.linkPreviewSubtitle.textContent = url;
    el.linkPreviewOpen.disabled = !canOpenExternal;
    el.linkPreviewBody.innerHTML = `
      <div class="link-preview-image-wrap">
        <img class="link-preview-image" src="${escapeAttr(getDisplayMediaUrl(url))}" alt="聊天图片预览">
      </div>
    `;
    return;
  }
  const videoUrl = getDirectPreviewVideoUrl(meta);
  const playerUrl = getPreviewPlayerUrl(meta);
  const imageUrl = meta.image ? getDisplayMediaUrl(meta.image) : "";
  if (videoUrl) {
    el.linkPreviewBody.innerHTML = `
      <video class="link-preview-video" src="${escapeAttr(getDisplayMediaUrl(videoUrl))}" controls playsinline poster="${escapeAttr(imageUrl)}"></video>
    `;
    return;
  }
  const embeddablePlayerUrl = getPreviewFrameUrl(playerUrl);
  if (playerUrl && !embeddablePlayerUrl) {
    el.linkPreviewBody.innerHTML = '<div class="empty-state">HTTPS blocked an embedded HTTP preview. Use Open Page to view it separately.</div>';
    return;
  }
  if (embeddablePlayerUrl) {
    el.linkPreviewBody.innerHTML = `
      <iframe class="link-preview-frame" src="${escapeAttr(embeddablePlayerUrl)}" title="${escapeAttr(title)}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allow="fullscreen; autoplay; encrypted-media; picture-in-picture"></iframe>
      <div class="link-preview-fallback">
        <span>${escapeHtml(meta.loading ? "正在获取视频预览..." : "如果预览为空白，说明目标网页禁止嵌入。")}</span>
      </div>
    `;
    return;
  }
  const embeddableUrl = getPreviewFrameUrl(url);
  if (url && !embeddableUrl) {
    el.linkPreviewBody.innerHTML = '<div class="empty-state">HTTPS blocked an embedded HTTP page preview. Use Open Page to view it separately.</div>';
    return;
  }
  if (embeddableUrl) {
    el.linkPreviewBody.innerHTML = `
      <iframe class="link-preview-frame" src="${escapeAttr(embeddableUrl)}" title="${escapeAttr(title)}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
      <div class="link-preview-fallback">
        <span>${escapeHtml(meta.loading ? "正在获取网页预览..." : meta.failed ? "网页可能禁止嵌入，仍可打开原网页。" : "如果页面为空白，说明目标网页禁止嵌入。")}</span>
      </div>
    `;
    return;
  }
  el.linkPreviewBody.innerHTML = '<div class="empty-state">暂无可预览链接。</div>';
}

function getDirectPreviewVideoUrl(meta = {}) {
  const directUrl = normalizeLinkUrl(firstValue(meta.video, meta.videoSecureUrl, meta.stream, ""));
  if (!directUrl) return "";
  if (isVideoContentType(firstValue(meta.videoType, meta.contentType, "")) || isVideoUrl(directUrl)) return directUrl;
  return "";
}

function getPreviewPlayerUrl(meta = {}) {
  const playerUrl = normalizeLinkUrl(firstValue(meta.player, ""));
  if (playerUrl) return playerUrl;
  const videoUrl = normalizeLinkUrl(firstValue(meta.video, meta.videoSecureUrl, ""));
  if (videoUrl && !getDirectPreviewVideoUrl(meta)) return videoUrl;
  return "";
}

function isVideoContentType(value) {
  return /^video\//i.test(String(value || ""));
}

function isVideoUrl(value) {
  try {
    const pathname = new URL(value).pathname;
    return /\.(mp4|webm|ogg|ogv|mov|m4v|m3u8)(?:$|\?)/i.test(pathname);
  } catch {
    return false;
  }
}

function closeLinkPreview() {
  state.activeLinkPreview = null;
  el.linkPreviewOverlay.classList.add("is-hidden");
  el.linkPreviewPanel.classList.remove("is-image-preview");
  el.linkPreviewOpen.disabled = false;
  el.linkPreviewBody.innerHTML = "";
}

function openActiveLinkPreview() {
  const url = state.activeLinkPreview?.url || el.linkPreviewOpen.dataset.openLink || "";
  openExternalLink(url);
}

function copyActiveLinkPreviewUrl() {
  const url = state.activeLinkPreview?.url || el.linkPreviewCopy.dataset.copyUrl || "";
  copyToClipboard(url);
}

function openExternalLink(url) {
  const normalizedUrl = normalizeLinkUrl(url);
  if (!normalizedUrl) {
    toast("链接地址无效。", true);
    return;
  }
  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}

function handlePreviewClickTarget(event) {
  const imageTarget = event.target.closest("[data-image-preview]");
  if (imageTarget) {
    event.preventDefault();
    showImagePreview(imageTarget.dataset.imagePreview || "");
    return true;
  }

  const previewTarget = event.target.closest("[data-link-preview]");
  if (previewTarget) {
    event.preventDefault();
    showLinkPreview(previewTarget.dataset.linkPreview || "");
    return true;
  }

  const openTarget = event.target.closest("[data-open-link]");
  if (openTarget) {
    event.preventDefault();
    openExternalLink(openTarget.dataset.openLink || "");
    return true;
  }

  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    event.preventDefault();
    copyToClipboard(copyTarget.dataset.copy || "");
    return true;
  }

  return false;
}

function handleMessageListClick(event) {
  if (handlePreviewClickTarget(event)) return;

  const target = event.target.closest("[data-action]");
  if (!target || target.dataset.action !== "load-more-messages") return;
  if (!state.messageHasMore || state.messageLoading) return;
  loadMessages(state.messagePage + 1, "append");
}

function handleMessageListScroll() {
  if (state.messageAutoLoading || state.messageLoading || !state.messageHasMore) return;
  if (el.messageList.scrollTop > 40) return;
  state.messageAutoLoading = true;
  loadMessages(state.messagePage + 1, "append").finally(() => {
    state.messageAutoLoading = false;
  });
}

function getContactListAutoLoadThreshold() {
  return state.listTab === "history" ? CONTACT_LIST_HISTORY_AUTOLOAD_THRESHOLD : CONTACT_LIST_AUTOLOAD_THRESHOLD;
}

function scheduleContactListViewportFill() {
  requestAnimationFrame(() => {
    if (state.contactListAutoLoading || state.contactListLoading || !state.contactListHasMore) return;
    if (!el.contactList) return;
    if (el.contactList.scrollHeight > el.contactList.clientHeight + 12) return;
    state.contactListAutoLoading = true;
    loadContacts({
      mode: "append",
      page: (state.contactListPage || 1) + 1,
      preserveScroll: true,
      skipCounts: true
    }).finally(() => {
      state.contactListAutoLoading = false;
      if (state.contactListHasMore && el.contactList && el.contactList.scrollHeight <= el.contactList.clientHeight + 12) {
        scheduleContactListViewportFill();
      }
    });
  });
}

function handleContactListScroll() {
  if (state.contactListAutoLoading || state.contactListLoading || !state.contactListHasMore) return;
  if (!isNearBottom(el.contactList, getContactListAutoLoadThreshold())) return;
  state.contactListAutoLoading = true;
  loadContacts({
    mode: "append",
    page: (state.contactListPage || 1) + 1,
    preserveScroll: true,
    skipCounts: true
  }).finally(() => {
    state.contactListAutoLoading = false;
  });
}

function handleReplyInput() {
  syncInlineDraftImages();
  triggerDraftAiOptimize();
}

function syncInlineDraftImages() {
  const node = el.replyText;
  if (!node) return;
  const inlineIds = new Set();
  node.querySelectorAll(".inline-draft-image").forEach((el2) => {
    if (el2.dataset.imageId) inlineIds.add(el2.dataset.imageId);
  });
  const removed = state.draftImages.filter((img) => img.inline && !inlineIds.has(img.id));
  if (!removed.length) return;
  removed.forEach((img) => { if (img.url) URL.revokeObjectURL(img.url); });
  state.draftImages = state.draftImages.filter((img) => !img.inline || inlineIds.has(img.id));
  renderDraftImages();
}

function handleReplyKeydown(event) {
  if (event.key !== "Enter" || event.isComposing) return;
  const shouldSend = state.sendMode === "ctrl-enter" ? event.ctrlKey || event.metaKey : !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey;
  const shouldInsertLine = state.sendMode === "enter" ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey && !event.altKey;
  if (shouldSend) {
    event.preventDefault();
    sendText();
    return;
  }
  if (shouldInsertLine && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    insertTextAtCursor(el.replyText, "\n");
  }
}

function handleSendModeChange(event) {
  state.sendMode = normalizeSendMode(event.target.value);
  localStorage.setItem(SEND_MODE_STORAGE_KEY, state.sendMode);
  updateComposerStatus();
}

function handleReplyPaste(event) {
  const plainText = event.clipboardData?.getData("text/plain")?.trim() || "";
  const htmlText = event.clipboardData?.getData("text/html")?.trim() || "";
  const files = getClipboardImageFiles(event.clipboardData);
  const hasImageFiles = files.length > 0;
  const hasTextPayload = Boolean(plainText || htmlText);
  const isOnlyImageLabel = /^\[图片\]$/.test(plainText);
  const containsImageLabel = plainText.includes("[图片]");

  if (hasImageFiles) {
    event.preventDefault();
    if (hasTextPayload && !isOnlyImageLabel) {
      const cleanedText = containsImageLabel ? plainText.replace(/\[图片\]/g, "").trim() : plainText;
      if (cleanedText) {
        insertTextAtCursor(el.replyText, cleanedText);
      }
    }
    insertInlineImagesAtCursor(files);
    return;
  }

  if (isOnlyImageLabel) {
    event.preventDefault();
  }
}

function getClipboardImageFiles(clipboardData) {
  const seen = new Set();
  const files = [];
  const addFile = (file) => {
    if (!file?.type?.startsWith("image/")) return;
    const key = [file.type, file.size, file.lastModified].join(":");
    if (seen.has(key)) return;
    seen.add(key);
    files.push(file);
  };

  [...(clipboardData?.files || [])].forEach(addFile);
  [...(clipboardData?.items || [])].forEach((item, index) => {
    if (item.kind !== "file" || !item.type.startsWith("image/")) return;
    const file = item.getAsFile();
    if (!file) return;
    const namedFile = file.name ? file : new File([file], `pasted-image-${index + 1}.png`, {
      type: file.type || "image/png",
      lastModified: Date.now()
    });
    addFile(namedFile);
  });
  return files;
}

function handleReplyDragOver(event) {
  if (![...(event.dataTransfer?.items || [])].some((item) => item.kind === "file" && item.type.startsWith("image/"))) return;
  event.preventDefault();
}

function handleReplyDrop(event) {
  const files = [...(event.dataTransfer?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  event.preventDefault();
  insertInlineImagesAtCursor(files);
}

function triggerHistoryAutoLoad() {
  if (state.historyAutoLoading || state.historyLoading || !state.historyHasMore) return;
  state.historyAutoLoading = true;
  loadHistoryMessages(state.historyPage + 1, "append").finally(() => {
    state.historyAutoLoading = false;
  });
}

async function sendText() {
  return withSendingLock(async () => {
    const { blocks, images } = parseComposerBlocks();
    const contactId = getContactId(state.activeContact);
    const latestBeforeSend = getLatestActionableInboundMessage();
    const matchedSkillBeforeSend = resolveManualReplySkillTarget(latestBeforeSend);
    const hasContent = blocks.some((b) => b.type === "text" && b.content.trim()) || images.length;
    if (!contactId || !hasContent) {
      toast("请先选择会话，并输入回复内容或粘贴图片。", true);
      return;
    }

    let textSubmitted = false;
    const submittedImageIds = new Set();
    try {
      const imageUrlMap = new Map();
      for (const [index, image] of images.entries()) {
        setSendingStage(`正在上传第 ${index + 1}/${images.length} 张图片...`);
        const imageUrl = image.uploadUrl || await uploadChatImage(image.file);
        image.uploadUrl = imageUrl;
        imageUrlMap.set(image.id, imageUrl);
      }
      for (const block of blocks) {
        if (block.type === "text" && block.content.trim()) {
          setSendingStage("正在提交文字消息...");
          await sendChatContent({ content: block.content.trim(), contentType: 0 });
          textSubmitted = true;
        } else if (block.type === "image") {
          const imageUrl = imageUrlMap.get(block.imageId);
          if (imageUrl) {
            setSendingStage("正在提交图片消息...");
            await sendChatContent({
              content: imageUrl,
              contentType: block.image.file?.type === "image/gif" ? 4 : 1
            });
            submittedImageIds.add(block.imageId);
          }
        }
      }
      const allImageUrls = images.map((img) => imageUrlMap.get(img.id)).filter(Boolean);
      const allText = blocks.filter((b) => b.type === "text").map((b) => b.content).join("\n").trim();
      setReplyTextContent("");
      clearDraftImages();
      clearAiSuggestion();
      touchActiveContact(allText || (allImageUrls.length ? "[image]" : ""));
      markContactRead(state.activeContact);
      schedulePostSendMaintenance({
        contact: state.activeContact,
        text: allText,
        imageUrls: allImageUrls,
        matchedSkill: matchedSkillBeforeSend
      });
      toast(allImageUrls.length ? "文字和图片已提交到悠聊服务。" : "消息已提交到悠聊服务。");
    } catch (error) {
      if (textSubmitted) setReplyTextContent("");
      if (submittedImageIds.size) {
        state.draftImages = state.draftImages.filter((image) => !submittedImageIds.has(image.id));
        if (el.replyText) {
          el.replyText.querySelectorAll(".inline-draft-image").forEach((imgEl) => {
            if (submittedImageIds.has(imgEl.dataset.imageId)) imgEl.remove();
          });
        }
        renderDraftImages();
      }
      toast(`发送失败：${error.message}`, true);
    }
  });
}

function schedulePostSendMaintenance({ contact, text = "", imageUrls = [], matchedSkill = null } = {}) {
  const contactId = getContactId(contact);
  window.setTimeout(async () => {
    try {
      await learnFromManualReply(text, imageUrls, { matchedSkill });
    } catch (error) {
      log("background reply learning failed", { contactId, error: error.message });
    }

    try {
      if (contactId && String(getContactId(state.activeContact) || "") === String(contactId)) {
        await loadMessages(1, "replace", { forceBottom: true });
        await syncConsumedMessages(contact || state.activeContact);
      }
      await loadContacts({ preserveScroll: true, skipCounts: true });
    } catch (error) {
      log("background post-send refresh failed", { contactId, error: error.message });
    }
  }, POST_SEND_REFRESH_DELAY_MS);
}

function resolveManualReplySkillTarget(latest = getLatestActionableInboundMessage()) {
  if (state.lastSuggestionUsed && state.aiSuggestion?.skillId && isAppliedSuggestionContextValid(latest, state.aiSuggestion)) {
    return state.aiSuggestion;
  }
  if (state.lastAppliedSuggestionSkillId && isAppliedSuggestionContextValid(latest)) {
    return {
      skillId: state.lastAppliedSuggestionSkillId,
      platformKey: state.lastAppliedSuggestionPlatformKey || state.aiSuggestion?.platformKey || "",
      intentKey: state.lastAppliedSuggestionIntentKey || state.aiSuggestion?.intentKey || "",
      promptKey: state.lastAppliedSuggestionPromptKey || ""
    };
  }
  return buildSkillSuggestion();
}

async function sendChatContent({ content, contentType = 0 }) {
  const contactId = getContactId(state.activeContact);
  if (!contactId || !content) throw new Error("缺少会话或消息内容");
  return api("/ChatContent/SendMsg", {
    contactId,
    content,
    accountId: getAccountId(state.activeContact),
    contentType
  });
}

function assertActiveContact() {
  const contactId = getContactId(state.activeContact);
  if (!contactId) throw new Error("请先选择会话");
  return contactId;
}

function toggleEmojiPopover(event) {
  event.stopPropagation();
  state.emojiOpen = !state.emojiOpen;
  renderEmojiPopover();
}

function closeEmojiPopover() {
  state.emojiOpen = false;
  renderEmojiPopover();
}

function closeEmojiOnOutside(event) {
  if (!state.emojiOpen) return;
  if (el.emojiPopover.contains(event.target) || el.emojiTool.contains(event.target)) return;
  closeEmojiPopover();
}

function renderEmojiPopover() {
  if (!el.emojiPopover) return;
  el.emojiPopover.classList.toggle("is-hidden", !state.emojiOpen);
  if (!state.emojiOpen) return;
  const recent = state.recentEmojis || [];
  const recentButtons = recent.length
    ? recent.map((token) => {
        const emoji = EMOJI_LOOKUP.get(token);
        if (!emoji) return "";
        return `<button type="button" data-emoji="${escapeAttr(token)}" title="${escapeAttr(emoji.label)}" aria-label="${escapeAttr(emoji.label)}">${renderEmojiGlyph(token, { className: "emoji-popover-icon", size: 20 })}</button>`;
      }).join("")
    : "";
  const allButtons = EMOJI_DEFS.map((emoji) => `
    <button type="button" data-emoji="${escapeAttr(emoji.token)}" title="${escapeAttr(emoji.label)}" aria-label="${escapeAttr(emoji.label)}">
      ${renderEmojiGlyph(emoji.token, { className: "emoji-popover-icon", size: 20 })}
    </button>
  `).join("");
  const recentSection = recent.length
    ? `<div class="emoji-recent-label">最近使用</div><div class="emoji-recent-row">${recentButtons}</div>`
    : "";
  el.emojiPopover.innerHTML = `${recentSection}${allButtons}`;
  positionEmojiPopover();
}

function positionEmojiPopover() {
  const btn = el.emojiTool;
  const popover = el.emojiPopover;
  if (!btn || !popover) return;
  const btnRect = btn.getBoundingClientRect();
  const popoverWidth = 360;
  const popoverHeight = Math.min(320, popover.scrollHeight || 320);
  let left = btnRect.left;
  let top = btnRect.bottom + 8;
  if (left + popoverWidth > window.innerWidth - 12) {
    left = window.innerWidth - popoverWidth - 12;
  }
  if (left < 12) left = 12;
  if (top + popoverHeight > window.innerHeight - 12) {
    top = btnRect.top - popoverHeight - 8;
  }
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function handleEmojiPick(event) {
  const button = event.target.closest("[data-emoji]");
  if (!button) return;
  const token = button.dataset.emoji;
  insertEmojiAtCursor(token);
  recordRecentEmoji(token);
  closeEmojiPopover();
}

function showSuperCommandModal() {
  if (!ensureActiveContactForTool()) return;
  openToolModal({
    type: "super-command",
    title: "发送指令",
    confirmText: "发送",
    body: `
      <label class="modal-field">
        <span>指令内容</span>
        <textarea id="superCommandInput" rows="5" placeholder="请输入需要发送给客户的指令"></textarea>
      </label>
      <p class="modal-hint">该按钮调用悠聊真实接口 /ChatContent/SendSuperCmd。</p>
    `,
    onConfirm: sendSuperCommandFromModal
  });
  window.setTimeout(() => $("superCommandInput")?.focus(), 0);
}

async function sendSuperCommandFromModal() {
  const content = $("superCommandInput")?.value.trim();
  if (!content) {
    toast("请输入指令内容。", true);
    return false;
  }
  try {
    await sendSuperCommand(content);
    toast("指令已提交到悠聊服务。");
    closeToolModal();
    await loadMessages(1, "replace", { forceBottom: true });
    return true;
  } catch (error) {
    toast(`发送指令失败：${error.message}`, true);
    return false;
  }
}

async function sendSuperCommand(content) {
  const contactId = assertActiveContact();
  return api("/ChatContent/SendSuperCmd", {
    contactId,
    content,
    accountId: getAccountId(state.activeContact)
  });
}

function pickImageFile() {
  if (!ensureActiveContactForTool()) return;
  el.imageFileInput.value = "";
  el.imageFileInput.click();
}

async function handleImageFileSelected() {
  const files = [...(el.imageFileInput.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  try {
    insertInlineImagesAtCursor(files);
  } catch (error) {
    toast(`添加图片失败：${error.message}`, true);
  } finally {
    el.imageFileInput.value = "";
  }
}

async function sendImageFile(file, options = {}) {
  assertActiveContact();
  if (!file.type.startsWith("image/")) throw new Error("请选择图片文件");
  const imageUrl = await uploadChatImage(file);
  setSendingStage("正在提交图片消息...");
  await sendChatContent({ content: imageUrl, contentType: file.type === "image/gif" ? 4 : 1 });
  if (!options.silent) {
    touchActiveContact("[image]");
    markContactRead(state.activeContact);
    schedulePostSendMaintenance({
      contact: state.activeContact,
      text: "",
      imageUrls: [imageUrl]
    });
    toast("图片已提交到悠聊服务。");
  }
  return imageUrl;
}

function addDraftImages(files, source = "图片") {
  const imageFiles = [...files].filter((file) => file && file.type.startsWith("image/"));
  if (!imageFiles.length) {
    toast("没有识别到可发送的图片。", true);
    return;
  }

  const slots = Math.max(0, 9 - state.draftImages.length);
  const accepted = imageFiles.slice(0, slots);
  const skipped = imageFiles.length - accepted.length;
  accepted.forEach((file) => {
    state.draftImages.push({
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      name: file.name || `${source}.png`,
      url: URL.createObjectURL(file)
    });
  });
  renderDraftImages();
  triggerDraftAiOptimize();
  toast(`${source}已加入待发送${accepted.length > 1 ? `（${accepted.length} 张）` : ""}${skipped ? `，已达到 9 张上限` : ""}。`);
}

function addInlineDraftImage(file) {
  const slots = Math.max(0, 9 - state.draftImages.length);
  if (slots <= 0) {
    toast("已达到 9 张图片上限。", true);
    return null;
  }
  const id = `inline-draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const objectUrl = URL.createObjectURL(file);
  state.draftImages.push({ id, file, name: file.name || "图片", url: objectUrl, inline: true });
  return { id, objectUrl };
}

function removeDraftImage(id) {
  const removed = state.draftImages.find((image) => image.id === id);
  if (removed?.url) URL.revokeObjectURL(removed.url);
  state.draftImages = state.draftImages.filter((image) => image.id !== id);
  if (el.replyText) {
    el.replyText.querySelectorAll(`[data-image-id="${CSS.escape(id)}"]`).forEach((el2) => el2.remove());
  }
  renderDraftImages();
  triggerDraftAiOptimize();
}

function clearDraftImages() {
  state.draftImages.forEach((image) => {
    if (image.url) URL.revokeObjectURL(image.url);
  });
  state.draftImages = [];
  if (el.replyText) {
    el.replyText.querySelectorAll(".inline-draft-image").forEach((el2) => el2.remove());
  }
  renderDraftImages();
}

function renderDraftImages() {
  if (!el.draftImageTray) return;
  const trayImages = state.draftImages.filter((img) => !img.inline);
  const hasTrayImages = Boolean(trayImages.length);
  const hasAnyImages = Boolean(state.draftImages.length);
  el.draftImageTray.classList.toggle("is-hidden", !hasTrayImages);
  el.draftImageTray.closest(".composer")?.classList.toggle("has-draft-images", hasTrayImages);
  el.draftImageTray.innerHTML = [
    ...trayImages.map((image, index) => `
    <figure class="draft-image" title="${escapeAttr(image.name)}">
      <img src="${escapeAttr(image.url)}" alt="待发送图片 ${index + 1}">
      <button type="button" data-remove-draft-image="${escapeAttr(image.id)}" aria-label="移除图片"><i class="native-icon bfi-close" aria-hidden="true"></i></button>
    </figure>
  `),
    hasTrayImages ? `<span class="draft-image-count">共 ${state.draftImages.length} 个图片</span>` : ""
  ].join("");
  updateComposerStatus();
}

function handleDraftImageClick(event) {
  const removeTarget = event.target.closest("[data-remove-draft-image]");
  if (removeTarget) {
    removeDraftImage(removeTarget.dataset.removeDraftImage);
    return;
  }
  const inlineTarget = event.target.closest(".inline-draft-image");
  if (inlineTarget) {
    const imageId = inlineTarget.dataset.imageId;
    const image = state.draftImages.find((img) => img.id === imageId);
    if (image?.url) {
      showImagePreview(image.url);
    }
    return;
  }
}

async function uploadDraftImagesForSkill() {
  const images = [...state.draftImages];
  if (!images.length) return [];
  assertActiveContact();
  const steps = [];
  for (const [index, image] of images.entries()) {
    const imageUrl = image.skillUrl || await uploadChatImage(image.file);
    image.skillUrl = imageUrl;
    steps.push({
      type: "image",
      url: imageUrl,
      label: image.name || `skill 图片 ${index + 1}`
    });
    await delay(120);
  }
  return steps;
}

async function prepareImageForUpload(file) {
  if (!file || !file.type?.startsWith("image/")) throw new Error("请选择图片文件");
  if (file.optimizedUploadFile) return file.optimizedUploadFile;
  const type = String(file.type || "").toLowerCase();
  if (type.includes("gif") || type.includes("svg")) return file;
  if (file.size && file.size <= MAX_UPLOAD_IMAGE_BYTES && !type.includes("png")) return file;

  let bitmap = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch (error) {
    log("image decode for compression failed", { name: file.name, size: file.size, error: error.message });
    return file;
  }

  const width = bitmap.width || 0;
  const height = bitmap.height || 0;
  const maxEdge = Math.max(width, height);
  if (!width || !height || (maxEdge <= MAX_UPLOAD_IMAGE_EDGE && file.size <= MAX_UPLOAD_IMAGE_BYTES)) {
    bitmap.close?.();
    return file;
  }

  const scale = Math.min(1, MAX_UPLOAD_IMAGE_EDGE / maxEdge);
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", IMAGE_UPLOAD_JPEG_QUALITY));
  if (!blob || blob.size >= file.size) return file;
  const optimized = new File([blob], replaceImageExtension(file.name || "image.png", ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now()
  });
  file.optimizedUploadFile = optimized;
  log("image optimized before upload", {
    name: file.name,
    fromBytes: file.size,
    toBytes: optimized.size,
    width,
    height,
    targetWidth,
    targetHeight
  });
  return optimized;
}

function replaceImageExtension(fileName = "image.png", extension = ".jpg") {
  const base = String(fileName || "image").replace(/\.[a-z0-9]{2,8}$/i, "") || "image";
  return `${base}${extension}`;
}

async function uploadChatImage(file) {
  const contactId = assertActiveContact();
  const uploadFile = await prepareImageForUpload(file);
  const uploadFileName = createOssUploadFileName(uploadFile);
  setSendingStage("正在获取图片上传配置...");
  const payload = await api("/ChatContent/GetOssConfig", {
    contactId,
    fileName: uploadFileName
  });
  const config = getData(payload) || {};
  log("oss config", summarize(config));

  const directUrl = extractUploadedFileUrl(config);
  if (directUrl && !extractUploadEndpoint(config)) return directUrl;

  const endpoint = extractUploadEndpoint(config);
  if (!endpoint) {
    throw new Error("已拿到上传配置，但未识别到 OSS 上传地址，请继续抓包确认 GetOssConfig 返回结构");
  }

  const objectKey = buildOssObjectKey(config, uploadFileName);
  const localPayload = { config, objectKey, file: uploadFile, fileName: uploadFileName };
  try {
    setSendingStage("正在通过本地代理上传图片...");
    return await uploadImageViaLocalProxy(localPayload);
  } catch (proxyError) {
    log("local oss upload failed, retry via browser", { error: proxyError.message, objectKey });
  }

  try {
    setSendingStage("正在通过浏览器直传图片...");
    const uploadForm = buildOssUploadForm(config, objectKey, uploadFile, uploadFileName);
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      body: uploadForm
    }, IMAGE_UPLOAD_TIMEOUT_MS, "image upload");
    const text = await response.text();
    log("oss upload response", { status: response.status, response: text.slice(0, 600) });
    if (!response.ok) throw new Error(`OSS 上传失败 HTTP ${response.status}`);

    const uploadedUrl = extractUploadedFileUrl(parsePayload(text)) ||
      extractUploadedFileUrl(config, objectKey) ||
      joinUrl(endpoint, objectKey);
    if (!uploadedUrl) throw new Error("OSS 上传完成，但未生成图片地址");
    return uploadedUrl;
  } catch (error) {
    throw new Error(`图片上传失败：${error.message}`);
  }
}

async function uploadImageViaLocalProxy({ config, objectKey, file, fileName }) {
  const payload = {
    config,
    objectKey,
    fileName: fileName || file.name,
    contentType: file.type,
    base64: await fileToBase64(file)
  };
  const response = await fetchWithTimeout("/local/oss-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }, LOCAL_IMAGE_UPLOAD_TIMEOUT_MS, "local image upload");
  const text = await response.text();
  const result = parsePayload(text) || {};
  log("local oss upload", summarize(result));
  if (!response.ok || result.success === false || !result.url) {
    const detail = result.error && result.error !== result.message
      ? `${getMessage(result) || "图片上传代理失败"}：${result.error}`
      : getMessage(result);
    throw new Error(detail || "图片上传代理未返回图片地址");
  }
  return result.url;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || "").split(",").pop() || "");
    reader.onerror = () => reject(reader.error || new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

function extractUploadEndpoint(config) {
  const host = firstValue(
    config.qnRegionUrl,
    config.qiniuUploadUrl,
    config.qnUploadUrl,
    config.uploadUrl,
    config.action,
    config.host,
    config.url,
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
  const explicitKey = firstValue(
    config.key,
    config.objectKey,
    config.fileKey,
    config.path,
    config.filePath,
    config.fullPath
  );
  if (explicitKey) return normalizeOssObjectKey(explicitKey, fileName);
  return joinOssKey(firstValue(config.dir, config.prefix), fileName);
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
  const cleanFileName = String(fileName || createOssUploadFileName({ name: "image.png", type: "image/png" })).replace(/^\/+/, "");
  const cleanPrefix = String(prefix || "").replace(/^\/+|\/+$/g, "");
  return cleanPrefix ? `${cleanPrefix}/${cleanFileName}` : cleanFileName;
}

function createOssUploadFileName(file = {}) {
  return `${randomHex(32)}${getSafeImageExtension(file.name, file.type)}`;
}

function randomHex(length) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
  }
  let value = "";
  while (value.length < length) value += Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
  return value.slice(0, length);
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

function buildOssUploadForm(config, objectKey, file, fileName = "") {
  const form = new FormData();
  const qiniuToken = firstValue(config.qnToken, config.qiniuToken, config.uploadToken);
  const fieldMap = qiniuToken
    ? {
        key: objectKey,
        token: qiniuToken
      }
    : {
        key: objectKey,
        policy: firstValue(config.policy, config.Policy),
        signature: firstValue(config.signature, config.Signature),
        OSSAccessKeyId: firstValue(config.OSSAccessKeyId, config.accessid, config.accessId, config.AccessKeyId, config.accessKeyId),
        success_action_status: firstValue(config.success_action_status, config.successActionStatus, "200"),
        callback: config.callback,
        "x-oss-security-token": firstValue(config.securityToken, config.SecurityToken, config.token, config.stsToken)
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

  form.append("file", file, fileName || file.name);
  return form;
}

function extractUploadedFileUrl(payload, objectKey = "") {
  const data = getData(payload) || payload || {};
  if (typeof data === "string") return /^https?:\/\//i.test(data) || data.startsWith("//") ? normalizeImageUrl(data) : "";
  const url = firstValue(
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
  if (url && (/^https?:\/\//i.test(String(url)) || String(url).startsWith("//"))) return normalizeImageUrl(url);
  const host = firstValue(data.qnDomain, data.qiniuDomain, data.publicDomain, data.cdnDomain) || extractUploadEndpoint(data);
  const key = objectKey || firstValue(data.key, data.objectKey, data.fileKey, data.path);
  return host && key ? joinUrl(host, key) : "";
}

function joinUrl(base, pathValue) {
  const baseText = String(base || "").replace(/\/+$/, "");
  const pathText = String(pathValue || "").replace(/^\/+/, "");
  return pathText ? `${baseText}/${pathText}` : baseText;
}

async function showRedPackModal() {
  if (!ensureActiveContactForTool()) return;
  await loadRedPackTemplates();
  const options = state.redPackTemplates.length
    ? state.redPackTemplates.map((template, index) => `<option value="${index}">${escapeHtml(template.templateName || template.name || `模板 ${index + 1}`)}</option>`).join("")
    : '<option value="">未读取到红包模板</option>';
  openToolModal({
    type: "red-pack",
    title: "发送红包",
    confirmText: "发送",
    body: `
      <label class="modal-field">
        <span>红包模板</span>
        <select id="redPackTemplate" ${state.redPackTemplates.length ? "" : "disabled"}>${options}</select>
      </label>
      <label class="modal-field">
        <span>金额</span>
        <input id="redPackMoney" type="number" min="0.01" step="0.01" placeholder="请输入红包金额" />
      </label>
      <p class="modal-hint">该按钮调用悠聊真实接口 /ChatContent/GetRedPacks 与 /ChatContent/SendRedPacks。</p>
    `,
    onConfirm: sendRedPackFromModal
  });
  window.setTimeout(() => $("redPackMoney")?.focus(), 0);
}

async function loadRedPackTemplates() {
  state.redPackTemplatesLoading = true;
  try {
    const payload = await api("/ChatContent/GetRedPacks", {});
    state.redPackTemplates = getRecords(payload).map(normalizeRedPackTemplate);
    if (!state.redPackTemplates.length) {
      const data = getData(payload);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        state.redPackTemplates = [normalizeRedPackTemplate(data)];
      }
    }
  } catch (error) {
    state.redPackTemplates = [];
    toast(`红包模板读取失败：${error.message}`, true);
  } finally {
    state.redPackTemplatesLoading = false;
  }
}

function normalizeRedPackTemplate(item, index = 0) {
  return {
    ...item,
    templateId: firstValue(item.templateId, item.id, item.redPackId, item.value, index),
    templateName: firstValue(item.templateName, item.name, item.title, item.label, `模板 ${index + 1}`),
    cardTitle: firstValue(item.cardTitle, item.title, item.name, ""),
    cardImg: firstValue(item.cardImg, item.img, item.imageUrl, item.icon, ""),
    cardDesc: firstValue(item.cardDesc, item.desc, item.description, item.remark, "")
  };
}

async function sendRedPackFromModal() {
  const templateIndex = $("redPackTemplate")?.value;
  const template = state.redPackTemplates[Number(templateIndex)];
  const money = Number($("redPackMoney")?.value);
  if (!template) {
    toast("请先选择红包模板。", true);
    return false;
  }
  if (!Number.isFinite(money) || money <= 0) {
    toast("请输入正确的红包金额。", true);
    return false;
  }

  try {
    await sendRedPack(template, money);
    toast("红包已提交到悠聊服务。");
    closeToolModal();
    await loadMessages(1, "replace", { forceBottom: true });
    return true;
  } catch (error) {
    toast(`发送红包失败：${error.message}`, true);
    return false;
  }
}

async function sendRedPack(template, money) {
  const contactId = assertActiveContact();
  return api("/ChatContent/SendRedPacks", {
    contactId,
    money,
    templateId: template.templateId,
    templateName: template.templateName,
    cardTitle: template.cardTitle,
    cardImg: template.cardImg,
    cardDesc: template.cardDesc
  });
}

async function captureScreenshot() {
  if (!ensureActiveContactForTool()) return;
  if (!navigator.mediaDevices?.getDisplayMedia) {
    toast("当前浏览器不支持屏幕截图捕获，请用选择图片发送。", true);
    return;
  }

  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const blob = await captureFrameFromStream(stream);
    const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
    await sendImageFile(file);
  } catch (error) {
    toast(`截图发送失败：${error.message}`, true);
  } finally {
    if (stream) stream.getTracks().forEach((track) => track.stop());
  }
}

function captureFrameFromStream(stream) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.srcObject = stream;
    video.onloadedmetadata = async () => {
      try {
        await video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("截图生成失败")), "image/png");
      } catch (error) {
        reject(error);
      }
    };
    video.onerror = () => reject(new Error("屏幕流读取失败"));
  });
}

function showSaveSkillModal() {
  const sourceText = getComposerSkillSourceText();
  const draftImageCount = state.draftImages.length;
  openToolModal({
    type: "save-skill",
    title: "保存 skill 回复",
    confirmText: "保存",
    body: `
      <label class="modal-field">
        <span>触发关键词</span>
        <input id="saveSkillKeywords" value="${escapeAttr(extractLearningKeywords(sourceText.prompt).join(" "))}" placeholder="多个关键词用空格分隔" />
      </label>
      <label class="modal-field">
        <span>回复内容</span>
        <textarea id="saveSkillContent" rows="6" placeholder="请输入要沉淀的回复话术">${escapeHtml(sourceText.reply)}</textarea>
      </label>
      <p class="modal-hint">保存后会进入 skill 回复库，后续 AI/skill 推荐会自动使用。${draftImageCount ? `当前草稿里的 ${draftImageCount} 张图片也会上传并保存到这条 skill。` : ""}</p>
    `,
    onConfirm: saveSkillFromModal
  });
  window.setTimeout(() => $("saveSkillContent")?.focus(), 0);
}

function getComposerSkillSourceText() {
  const latest = getLatestActionableInboundMessage();
  const prompt = String(latest?.content || "").trim();
  const suggestionText = state.aiSuggestion && !state.aiSuggestion.noReply ? getSuggestionTextForComposer(state.aiSuggestion) : "";
  return {
    prompt,
    reply: getReplyTextContent().trim() || suggestionText
  };
}

async function saveSkillFromModal() {
  const keywords = String($("saveSkillKeywords")?.value || "").split(/\s+/).map((item) => item.trim()).filter(Boolean);
  const content = $("saveSkillContent")?.value.trim();
  if (!keywords.length) {
    toast("请输入触发关键词。", true);
    return false;
  }
  if (!content) {
    toast("请输入回复内容。", true);
    return false;
  }

  try {
    const imageSteps = await uploadDraftImagesForSkill();
    const skill = {
      title: `手动沉淀：${keywords[0].slice(0, 18)}`,
      source: "manual",
      enabled: true,
      allowAutoReply: false,
      noReply: false,
      priority: 60,
      keywords,
      samples: keywords,
      replySteps: [
        { type: "text", content },
        ...imageSteps
      ],
      fallback: content
    };
    const response = await fetch("/local/reply-skills/learn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    if (Array.isArray(payload.skills)) state.replySkills = payload.skills;
    closeToolModal();
    if (state.activeTool === "skill") renderToolContent();
    toast(imageSteps.length ? `已保存到 skill 回复库，并写入 ${imageSteps.length} 张图片。` : "已保存到 skill 回复库。");
    return true;
  } catch (error) {
    toast(`保存 skill 失败：${error.message}`, true);
    return false;
  }
}

function ensureActiveContactForTool() {
  if (getContactId(state.activeContact)) return true;
  toast("请先选择会话。", true);
  return false;
}

function openToolModal(config) {
  state.activeModal = config;
  el.toolModalTitle.textContent = config.title || "";
  el.toolModalBody.innerHTML = config.body || "";
  el.toolModalConfirm.textContent = config.confirmText || "确定";
  el.toolModalConfirm.disabled = Boolean(config.confirmDisabled);
  el.toolModalCancel.classList.toggle("is-hidden", config.hideCancel === true);
  el.toolModalConfirm.classList.toggle("is-hidden", config.hideConfirm === true);
  el.toolModalPanel.classList.remove("tool-modal-wide", "tool-modal-large", "tool-modal-xl", "tool-modal-settings");
  if (config.size === "wide") el.toolModalPanel.classList.add("tool-modal-wide");
  if (config.size === "large") el.toolModalPanel.classList.add("tool-modal-large");
  if (config.size === "xl") el.toolModalPanel.classList.add("tool-modal-xl");
  if (config.size === "settings") el.toolModalPanel.classList.add("tool-modal-settings");
  el.toolModalOverlay.classList.remove("is-hidden");
}

function closeToolModal() {
  state.activeModal = null;
  el.toolModalOverlay.classList.add("is-hidden");
  el.toolModalBody.innerHTML = "";
  el.toolModalConfirm.disabled = false;
  el.toolModalConfirm.textContent = "确定";
  el.toolModalCancel.classList.remove("is-hidden");
  el.toolModalConfirm.classList.remove("is-hidden");
}

async function confirmToolModal() {
  const modal = state.activeModal;
  if (!modal?.onConfirm) return closeToolModal();
  el.toolModalConfirm.disabled = true;
  try {
    await modal.onConfirm();
  } finally {
    if (state.activeModal?.type === "database") updateDatabaseDeleteConfirmState();
    else el.toolModalConfirm.disabled = false;
  }
}

function renderActiveModalBody() {
  const modal = state.activeModal;
  if (!modal) return;
  if (modal.type === "global-search") {
    el.toolModalBody.innerHTML = renderGlobalSearchModal();
  } else if (modal.type === "client-stats") {
    el.toolModalBody.innerHTML = renderClientStatsModal();
  } else if (modal.type === "client-notice") {
    el.toolModalBody.innerHTML = renderClientNoticeModal();
  } else if (modal.type === "client-options") {
    el.toolModalBody.innerHTML = renderClientOptionsModal();
  } else if (modal.type === "database") {
    el.toolModalBody.innerHTML = renderDatabaseModal();
  }
}

function handleToolModalBodyClick(event) {
  if (handlePreviewClickTarget(event)) return;

  const target = event.target.closest("[data-client-modal-action]");
  if (!target) return;

  const action = target.dataset.clientModalAction;
  if (action === "global-search") {
    runGlobalSearch(1);
  } else if (action === "global-reset") {
    resetGlobalSearchFilters();
  } else if (action === "global-prev") {
    runGlobalSearch(Math.max(1, state.globalSearch.page - 1));
  } else if (action === "global-next") {
    if (hasNextGlobalSearchPage()) runGlobalSearch(state.globalSearch.page + 1);
  } else if (action === "stats-refresh") {
    refreshClientStats();
  } else if (action === "notice-search") {
    loadClientNotices(1);
  } else if (action === "notice-prev") {
    loadClientNotices(Math.max(1, state.clientNotice.page - 1));
  } else if (action === "notice-next") {
    if (hasNextNoticePage()) loadClientNotices(state.clientNotice.page + 1);
  } else if (action === "notice-consume") {
    consumeClientNotice(target.dataset.noticeId || "");
  } else if (action === "database-health") {
    loadDatabaseRepairStatus({ silent: false });
  } else if (action === "database-repair") {
    repairDatabaseFromModal();
  }
}

function handleToolModalBodyInput(event) {
  if (state.activeModal?.type === "database" && event.target.matches("#databaseDeleteStart, #databaseDeleteEnd, #databaseDeleteConfirm")) {
    updateDatabaseDeleteConfirmState();
  }
}

function handleToolModalBodyChange(event) {
  if (state.activeModal?.type === "client-notice" && event.target.matches("#clientNoticeWarnType")) {
    syncClientNoticeFields();
    loadClientNoticeEvents();
  } else if (state.activeModal?.type === "database" && event.target.matches("#databaseDeleteStart, #databaseDeleteEnd, #databaseDeleteConfirm")) {
    updateDatabaseDeleteConfirmState();
  }
}

function handleToolModalBodyKeydown(event) {
  if (event.key !== "Enter" || event.target.matches("textarea")) return;
  if (state.activeModal?.type === "global-search") {
    event.preventDefault();
    runGlobalSearch(1);
  } else if (state.activeModal?.type === "client-stats") {
    event.preventDefault();
    refreshClientStats();
  } else if (state.activeModal?.type === "client-notice") {
    event.preventDefault();
    loadClientNotices(1);
  }
}

async function sendSuggestionSteps(suggestion) {
  return withSendingLock(async () => {
    const steps = getSuggestionStepsForSend(suggestion).filter((step) => step.content || step.url);
    if (!steps.length) {
      toast("推荐内容为空。", true);
      return;
    }

    try {
      for (const step of steps) {
        if (step.type === "image") {
          await sendChatContent({ content: absolutizeLocalUrl(step.url || step.content), contentType: 1 });
        } else {
          await sendChatContent({ content: step.content, contentType: 0 });
        }
        await delay(250);
      }
      state.lastSuggestionUsed = true;
      rememberAppliedSuggestionContext(suggestion, { steps });
      await learnFromSentSuggestion(suggestion, steps);
      touchActiveContact(getSuggestionTextForComposer(suggestion).slice(0, 80) || "[suggestion]");
      await loadMessages(1, "replace", { forceBottom: true });
      toast("skill 推荐已发送。");
    } catch (error) {
      toast(`推荐发送失败：${error.message}`, true);
    }
  });
}

function getSuggestionStepsForSend(suggestion) {
  const baseSteps = getSuggestionSteps(suggestion);
  if (!suggestion?.skillId && suggestion?.type !== "skill") return baseSteps;
  const seedRoot = `${suggestion?.skillId || "skill"}:${Date.now()}:${Math.random()}`;
  return baseSteps.map((step, index) => {
    if (step.type === "image") return { ...step };
    return {
      ...step,
      content: rewriteSkillSendText(step.content || "", `${seedRoot}:${index}`)
    };
  });
}

function rewriteSkillSendText(text, seed = "") {
  let next = String(text || "").trim();
  if (!next) return "";
  const replacements = [
    { pattern: /返利/g, variants: ["反L", "饭力", "返点", "回馈"] },
    { pattern: /返佣/g, variants: ["反Y", "返点", "回馈"] },
    { pattern: /红包/g, variants: ["红宝", "鸿包", "红补", "优惠包"] }
  ];
  replacements.forEach((item, index) => {
    next = next.replace(item.pattern, () => pickSkillVariant(item.variants, `${seed}:${index}`));
  });
  return applySkillToneVariant(next, seed);
}

function pickSkillVariant(list, seed = "") {
  const values = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!values.length) return "";
  const hash = Array.from(String(seed)).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return values[Math.abs(hash) % values.length];
}

function applySkillToneVariant(text, seed = "") {
  let next = String(text || "").trim();
  if (!next) return "";
  const prefix = pickSkillVariant(["", "亲，", "你好，", "这边看了下，", "先和您说一下，"], `${seed}:prefix`);
  const suffix = pickSkillVariant(["", "，您先看下哈。", "，您按这个处理就行。", "，麻烦您先这样操作。", "，有问题我再继续帮您看。"], `${seed}:suffix`);
  if (prefix && !/^(亲，|你好，|这边看了下，|先和您说一下，)/.test(next)) next = `${prefix}${next}`;
  if (suffix && !/[。！？]$/.test(next)) next = `${next}${suffix}`;
  return next;
}

async function learnFromSentSuggestion(suggestion, steps = []) {
  if (!state.skillAutoLearn || !suggestion) return;
  const latest = getLatestActionableInboundMessage();
  if (!latest || latest.isSystemNotice || latest.direction !== "incoming") return;
  const prompt = String(latest.content || "").trim();
  if (prompt.length < 2) return;
  const reply = steps
    .filter((step) => step.type !== "image")
    .map((step) => String(step.content || "").trim())
    .filter(Boolean)
    .join("\n\n");
  const images = steps
    .filter((step) => step.type === "image")
    .map((step) => normalizeImageUrl(step.url || step.content || ""))
    .filter(Boolean);
  if (!reply && !images.length) return;
  const matchedSkill = suggestion.skillId ? getSkillById(suggestion.skillId) : null;
  const promptPlatformKey = detectPlatformOrderNo(prompt).platformKey || detectOrderPlatformFromState() || "";
  const platformKey = promptPlatformKey || suggestion.platformKey || "";
  const intentKey = suggestion.intentKey || detectSkillIntentKey(prompt) || "";
  if (matchedSkill && !matchedSkill.noReply) {
    await learnMatchedSkillOverride(matchedSkill, {
      prompt,
      reply,
      images,
      steps,
      latest,
      platformKey,
      intentKey
    });
    return;
  }
  await learnFromManualReply(reply, images, {
    matchedSkill: suggestion.skillId ? { skillId: suggestion.skillId, platformKey, intentKey } : null
  });
}

function absolutizeLocalUrl(url) {
  const text = String(url || "");
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return new URL(text, window.location.origin).toString();
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function generateAi() {
  await generateAiWithRelay();
}

async function generateAiWithRelay() {
  await requestAiRelaySuggestions({ silent: false, source: "manual" });
}

async function requestAiRelaySuggestions(options = {}) {
  const silent = Boolean(options.silent);
  if (!state.aiEnabled) {
    if (!silent) toast("AI 推荐已关闭，请在右上角 AI 设置中启用。", true);
    return;
  }

  if (!hasUsableAiKey()) {
    if (!silent) {
      showAiSettings();
      toast("请先填写 AI API 密钥。", true);
    }
    return;
  }

  const context = buildAiConversationContext();
  if (!context) {
    if (!silent) toast("当前没有可用于生成推荐的真实聊天上下文。", true);
    return;
  }

  const skillSuggestion = buildSkillSuggestion();

  state.aiGenerating = true;
  updateAiButtonState();

  try {
    const payload = {
      ...getAiRelayBasePayload(),
      messages: [
        {
          role: "system",
          content: [
            "你是客服辅助回复助手，只根据给定的真实聊天上下文给客服生成 1 到 3 条可直接发送的中文候选回复。",
            "优先参考给定的本地 skill 知识库和快捷回复；只有无法命中时才自行组织安抚话术。",
            "不要编造订单、返利、余额、用户编号或后台状态。",
            "如果上下文不足以判断事实，明确建议客服继续核实，不要假装已经查询到。",
            `真的无法解决时，可以引导客户发送“客服”或打开在线客服链接：${ONLINE_SERVICE_URL}。`,
            "每条回复要短、自然、有安抚感，不要输出分析过程。",
            "请优先返回 JSON 数组字符串，例如 [\"候选1\",\"候选2\",\"候选3\"]；如果不能返回 JSON，就用 1. 2. 3. 分行输出。"
          ].join("\n")
        },
        {
          role: "user",
          content: buildAiConversationContextWithReferences(context, skillSuggestion)
        }
      ]
    };

    const started = Date.now();
    const response = await fetch("/ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    const parsed = parsePayload(text);

    log("AI relay chat/completions", {
      status: response.status,
      ms: Date.now() - started,
      baseUrl: state.aiBaseUrl,
      model: state.aiModel,
      response: summarize(maskAiPayload(parsed))
    });

    if (!response.ok) {
      throw new Error(getMessage(parsed) || `HTTP ${response.status}`);
    }

    const suggestions = extractAiReplies(parsed);
    if (!suggestions.length) throw new Error("AI 中转接口未返回推荐内容");
    const fallbackSuggestions = suggestions.length >= 2 ? suggestions : buildLocalSuggestionVariants(suggestions[0]);
    appendAiSuggestions(fallbackSuggestions.map((reply, index) => ({
      type: "ai",
      title: index === 0 ? "AI 推荐" : `AI 推荐 ${index + 1}`,
      content: reply,
      steps: [{ type: "text", content: reply }]
    })).slice(0, 3), { silent });
  } catch (error) {
    if (silent) {
      log("auto ai suggestion failed", { error: error.message, source: options.source || "" });
    } else {
      toast(`AI 推荐失败：${error.message}`, true);
    }
  } finally {
    state.aiGenerating = false;
    updateAiButtonState();
  }
}

function getSuggestionTone(index = state.aiSuggestionToneIndex) {
  const tones = [
    {
      name: "自然安抚",
      instruction: "语气自然亲切，先安抚再给出下一步，适合客户着急时直接发送。"
    },
    {
      name: "简短直接",
      instruction: "语气简短明确，少客套，直接说明处理方式和需要客户配合的动作。"
    },
    {
      name: "耐心解释",
      instruction: "语气更耐心，把原因讲清楚，但不要变长篇，适合客户反复追问时使用。"
    },
    {
      name: "轻柔口语",
      instruction: "语气更口语、更像人工客服，保持礼貌，不要夸张热情。"
    }
  ];
  return tones[Math.abs(Number(index) || 0) % tones.length];
}

async function requestAiChatReplies({ systemLines, userContent, temperature, signal } = {}) {
  if (!state.aiEnabled) throw new Error("AI 推荐已关闭，请在右上角 AI 设置中启用。");
  if (!hasUsableAiKey()) throw new Error("请先填写 AI API 密钥。");
  const response = await fetch("/ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...getAiRelayBasePayload(temperature ?? state.aiTemperature),
      messages: [
        {
          role: "system",
          content: [
            ...(systemLines || []),
            "优先返回 JSON 数组字符串，例如 [\"候选1\",\"候选2\",\"候选3\"]；如果不能返回 JSON，就用 1. 2. 3. 分行输出。"
          ].join("\n")
        },
        {
          role: "user",
          content: userContent || ""
        }
      ]
    }),
    signal
  });
  const text = await response.text();
  const parsed = parsePayload(text);
  if (!response.ok) throw new Error(getMessage(parsed) || `HTTP ${response.status}`);
  return extractAiReplies(parsed);
}

async function refreshAiSuggestion() {
  if (!state.aiSuggestion) {
    await requestAiRelaySuggestions({ silent: false, source: "refresh-empty", toneIndex: ++state.aiSuggestionToneIndex });
    return;
  }
  const baseSuggestion = state.aiSuggestion;
  const text = getSuggestionTextForComposer(baseSuggestion) || formatSuggestionText(baseSuggestion);
  const toneIndex = ++state.aiSuggestionToneIndex;
  const tone = getSuggestionTone(toneIndex);
  const context = buildAiConversationContext();
  if (!context && !text) {
    toast("当前没有可换写的推荐内容。", true);
    return;
  }

  state.aiGenerating = true;
  updateAiButtonState();
  try {
    const replies = await requestAiChatReplies({
      temperature: Math.min(1.1, Number(state.aiTemperature || 0.35) + 0.25),
      systemLines: [
        "你是客服推荐话术改写助手。基于真实上下文和原推荐，换一种语气与说法，输出 1 到 3 条可直接发送的中文候选。",
        "不要编造订单、返利、余额、用户编号或后台状态。",
        "不要重复原文句式；保留原本事实和处理动作。",
        `本轮语气：${tone.name}。${tone.instruction}`,
        "每条候选要短、自然、有人工客服感，不要输出分析过程。"
      ],
      userContent: [
        "真实上下文：",
        context || "-",
        "",
        "原推荐：",
        text || "-",
        baseSuggestion.keepDraftImages ? "客服输入框内还有草稿图片，请保留图片发送意图，只改写文字。" : "",
        "",
        "请换一种说法，返回 1 到 3 条候选。"
      ].filter(Boolean).join("\n")
    });
    const filtered = replies.filter((item) => normalizeForMatch(item) !== normalizeForMatch(text));
    const variants = filtered.length >= 2 ? filtered : buildLocalSuggestionVariants(filtered[0] || text);
    appendAiSuggestions(variants.map((reply, index) => ({
      type: baseSuggestion.type === "optimize" ? "optimize" : "ai",
      title: `${tone.name}${index ? ` ${index + 1}` : ""}`,
      label: tone.name,
      skillId: baseSuggestion.skillId || "",
      content: reply,
      steps: [{ type: "text", content: reply }],
      keepDraftImages: Boolean(baseSuggestion.keepDraftImages)
    })).slice(0, 3), { silent: true });
    toast(`已换成「${tone.name}」说法。`);
  } catch (error) {
    toast(`换一换失败：${error.message}`, true);
  } finally {
    state.aiGenerating = false;
    updateAiButtonState();
  }
}

function scheduleAutoAiSuggestion(options = {}) {
  if (state.aiAutoSuggestTimer) window.clearTimeout(state.aiAutoSuggestTimer);
  if (!state.aiEnabled || !hasUsableAiKey() || !getContactId(state.activeContact)) return;
  const latest = getLatestAutoSuggestionMessage();
  if (!latest) return;
  const key = buildAutoSuggestionKey(latest);
  if (!key || key === state.lastAutoAiSuggestionKey || key === state.aiAutoSuggestInFlightKey) return;
  state.aiAutoSuggestTimer = window.setTimeout(() => {
    generateAutoAiSuggestion(key, options).catch((error) => {
      log("auto ai suggestion failed", { error: error.message, source: options.source || "" });
    });
  }, options.delay ?? 650);
}

async function generateAutoAiSuggestion(expectedKey, options = {}) {
  const latest = getLatestAutoSuggestionMessage();
  const key = buildAutoSuggestionKey(latest);
  if (!key || key !== expectedKey) return;
  if (key === state.lastAutoAiSuggestionKey || key === state.aiAutoSuggestInFlightKey) return;
  if (state.aiGenerating) return;

  state.aiAutoSuggestInFlightKey = key;
  try {
    const skillSuggestion = await maybeBuildSkillSuggestion({ autoReply: true });
    if (!skillSuggestion) {
      await requestAiRelaySuggestions({ silent: true, source: options.source || "auto" });
    }
    state.lastAutoAiSuggestionKey = key;
  } finally {
    if (state.aiAutoSuggestInFlightKey === key) state.aiAutoSuggestInFlightKey = "";
  }
}

function getLatestAutoSuggestionMessage() {
  return getLatestUnansweredInboundMessage();
}

function buildAutoSuggestionKey(message) {
  if (!message) return "";
  const contactId = getContactId(state.activeContact);
  if (!contactId) return "";
  const index = state.messages.indexOf(message);
  return [
    contactId,
    getMessageKey(message, index < 0 ? 0 : index),
    normalizeForMatch(message.content || "").slice(0, 120)
  ].join("::");
}

function isCurrentAutoSuggestionKey(expectedKey) {
  if (!expectedKey) return true;
  return buildAutoSuggestionKey(getLatestAutoSuggestionMessage()) === expectedKey;
}

function buildAiConversationContext() {
  const contact = state.activeContact || {};
  const info = getActiveContactInfo(contact) || {};
  const userId = getContactUserId(contact, info) || "";
  const remark = getContactRemark(contact, info) || "";
  const rows = state.messages
    .filter((item) => item && item.direction !== "ai" && item.direction !== "system" && !item.isSystemNotice && item.content)
    .slice(-12)
    .map((item) => {
      const role = item.direction === "outgoing" ? "客服" : "客户";
      const sender = item.sender ? `/${item.sender}` : "";
      return `${role}${sender}: ${String(item.content).trim()}`;
    })
    .filter(Boolean);

  if (!rows.length) return "";
  const withdrawInsightText = getWithdrawRiskSignalText(state.withdrawRisk.signal);

  return [
    withdrawInsightText ? `AI感知提示：${withdrawInsightText}` : "",
    `当前客户昵称：${contact.userNick || "-"}`,
    `客户微信ID：${contact.userName || "-"}`,
    `客户用户ID：${userId || "-"}`,
    `客户备注：${remark || "-"}`,
    "",
    "最近聊天记录：",
    rows.join("\n"),
    "",
    "可参考的 skill：",
    getSkillPromptContext(),
    "",
    "可参考的快捷回复：",
    getFaqPromptContext(),
    "",
    "请给客服一条推荐回复。"
  ].join("\n");
}

function getSkillPromptContext() {
  const skills = state.replySkills.filter((skill) => skill.enabled !== false && !skill.noReply).slice(0, 8);
  if (!skills.length) return "暂无";
  return skills.map((skill) => {
    const keywords = (skill.keywords || []).slice(0, 8).join("、");
    const reply = getSkillText(skill).slice(0, 220);
    return `- ${skill.title}｜关键词：${keywords}｜话术：${reply}`;
  }).join("\n");
}

function getFaqPromptContext() {
  if (!state.faqs.length) return "暂无";
  return state.faqs.slice(0, 8).map((faq) => `- ${faq.title}：${faq.content}`.slice(0, 240)).join("\n");
}

function buildRecentConversationBrief(limit = 8) {
  return state.messages
    .filter((item) => item && item.direction !== "system" && !item.isSystemNotice && item.content)
    .slice(-limit)
    .map((item) => `${item.direction === "outgoing" ? "客服" : "客户"}：${item.content}`)
    .join("\n");
}

function triggerDraftAiOptimize() {
  if (state.aiOptimizeTimer) window.clearTimeout(state.aiOptimizeTimer);
  const draftText = getReplyTextContent().trim() || "";
  if (!draftText || draftText.length < 4 || !state.aiEnabled) return;
  state.aiOptimizeTimer = window.setTimeout(() => optimizeDraftReply().catch((error) => {
    log("draft optimize failed", { error: error.message });
  }), 900);
}

function requestDraftOptimizeFromComposer() {
  const draftText = getReplyTextContent().trim();
  if (!draftText) {
    toast("先输入要优化的回复内容。", true);
    el.replyText?.focus();
    return;
  }
  if (draftText.length < 4) {
    toast("内容太短，稍微多写一点再优化会更准。", true);
    el.replyText?.focus();
    return;
  }
  if (!state.aiEnabled) {
    toast("AI 推荐已关闭，请先在右上角 AI 设置中开启。", true);
    return;
  }
  if (!hasUsableAiKey()) {
    toast("AI 密钥未配置，无法优化文案。", true);
    return;
  }
  optimizeDraftReply({ manual: true, force: true }).catch((error) => {
    toast(`文案优化失败：${error.message}`, true);
  });
}

async function optimizeDraftReply(options = {}) {
  const draftText = getReplyTextContent().trim();
  if (!draftText || draftText.length < 4 || !state.aiEnabled || !hasUsableAiKey()) return;
  const latest = getLatestActionableInboundMessage();
  const key = [
    getContactId(state.activeContact),
    latest ? getMessageKey(latest, 0) : "",
    draftText,
    state.draftImages.map((image) => image.name).join("|")
  ].join("::");
  if (!options.force && (key === state.aiOptimizeKey || state.aiGenerating)) return;
  state.aiOptimizeKey = key;

  if (state.aiOptimizeAbort) state.aiOptimizeAbort.abort();
  state.aiOptimizeAbort = new AbortController();

  const context = buildDraftOptimizeContext(draftText);
  state.aiGenerating = true;
  if (options.manual) {
    state.aiSuggestion = {
      type: "optimize",
      title: "文字优化",
      label: "正在优化",
      content: "正在把当前输入优化成更贴心、耐心、容易理解的回复...",
      loading: true,
      steps: [{ type: "text", content: "正在把当前输入优化成更贴心、耐心、容易理解的回复..." }],
      keepDraftImages: true
    };
    state.aiSuggestions = [state.aiSuggestion];
    state.lastSuggestionUsed = false;
    renderAiSuggestionCard();
  }
  updateAiButtonState();

  try {
    const payload = {
      ...getAiRelayBasePayload(Math.min(0.6, Number(state.aiTemperature || 0.35) + 0.1)),
      messages: [
        {
          role: "system",
          content: [
            "你是客服输入优化助手。只优化客服已经输入的文字，不处理图片，不新增未确认的订单/返利/后台事实。",
            "输出 1 到 3 条可直接发送的中文候选，语气贴心、耐心、安抚、让普通人容易听懂；不要情绪过激，不要责备客户，不要输出分析过程。",
            "如果原文里有生硬、催促、责怪、容易误解的表达，要改成更温和但不拖泥带水的说法。",
            "如原文已经合适，也给出轻微润色版本。"
          ].join("\n")
        },
        {
          role: "user",
          content: context
        }
      ]
    };

    const response = await fetch("/ai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: state.aiOptimizeAbort.signal
    });
    const text = await response.text();
    const parsed = parsePayload(text);
    if (!response.ok) throw new Error(getMessage(parsed) || `HTTP ${response.status}`);
    const suggestions = extractAiReplies(parsed).filter((item) => normalizeForMatch(item) !== normalizeForMatch(draftText));
    if (!suggestions.length) return;
    const fallbackSuggestions = suggestions.length >= 2
      ? suggestions
      : buildLocalSuggestionVariants(suggestions[0]).filter((item) => normalizeForMatch(item) !== normalizeForMatch(draftText));
    appendAiSuggestions(fallbackSuggestions.map((reply, index) => ({
      type: "optimize",
      title: "文字优化",
      label: index === 0 ? "贴心优化" : `贴心优化 ${index + 1}`,
      content: reply,
      steps: [{ type: "text", content: reply }],
      keepDraftImages: true
    })).slice(0, 3), { silent: !options.manual });
    if (options.manual) toast("已生成优化文案，可选择采用或发送。");
  } catch (error) {
    if (error.name !== "AbortError") log("draft optimize failed", { error: error.message });
    if (options.manual && error.name !== "AbortError") {
      clearAiSuggestion();
      throw error;
    }
  } finally {
    state.aiGenerating = false;
    updateAiButtonState();
  }
}

function buildDraftOptimizeContext(draftText) {
  const latest = getLatestActionableInboundMessage();
  const recent = buildRecentConversationBrief(8);
  return [
    `客户最新问题：${latest?.content || "-"}`,
    "",
    "最近上下文：",
    recent || "-",
    "",
    `客服当前输入：${draftText}`,
    state.draftImages.length ? `客服还准备发送 ${state.draftImages.length} 张图片，图片不需要优化，也不要改写成文字。` : "",
    "",
    "请返回 1 到 3 条优化后的文字候选。"
  ].filter(Boolean).join("\n");
}

function extractAiReply(payload) {
  return extractAiReplies(payload)[0] || "";
}

function extractAiReplies(payload) {
  const data = getData(payload);
  const direct = typeof data === "string" ? data : data?.content || data?.answer || data?.reply || "";
  const choices = Array.isArray(data?.choices) ? data.choices : Array.isArray(payload?.choices) ? payload.choices : [];
  const candidates = [
    ...choices.map((choice) => choice?.message?.content || choice?.delta?.content || ""),
    direct
  ].flatMap(splitAiReplyOptions)
    .map((item) => String(item || "").replace(/^建议回复[:：]?\s*/, "").trim())
    .filter(Boolean);
  return [...new Set(candidates)].slice(0, 3);
}

function splitAiReplyOptions(value) {
  const text = String(value || "").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map((item) => typeof item === "string" ? item : item?.text || item?.content || item?.reply || "");
    if (Array.isArray(parsed?.options)) return parsed.options.map((item) => typeof item === "string" ? item : item?.text || item?.content || item?.reply || "");
    if (Array.isArray(parsed?.replies)) return parsed.replies.map((item) => typeof item === "string" ? item : item?.text || item?.content || item?.reply || "");
  } catch {
    // Plain text responses are normal.
  }

  const normalized = text.replace(/\r\n/g, "\n");
  const numbered = normalized.split(/\n\s*(?:[1-3][\.、)]|方案[一二三123][:：])\s*/).map((item) => item.trim()).filter(Boolean);
  if (numbered.length > 1) return numbered;
  const separated = normalized.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  return separated.length > 1 ? separated : [normalized];
}

function buildLocalSuggestionVariants(reply) {
  const base = String(reply || "").trim();
  if (!base) return [];
  const variants = [base];
  const normalized = base.replace(/\s+/g, " ");
  if (normalized.length > 42) {
    variants.push(normalized.slice(0, 42).replace(/[，。；、\s]+$/, "") + "，我这边先帮您看一下。");
  }
  if (!/(别着急|稍等|我这边|帮您|抱歉|理解)/.test(base)) {
    variants.push(`亲，先别着急，${normalized}`);
  }
  [
    "好的，我这边先帮您核实一下，稍等我一下。",
    "亲，您先别着急，我这边看一下具体情况再回复您。"
  ].forEach((item) => {
    if (variants.length < 3 && normalizeForMatch(item) !== normalizeForMatch(base)) variants.push(item);
  });
  return [...new Set(variants)].slice(0, 3);
}

async function loadReplySkills() {
  state.replySkillsLoading = true;
  if (state.activeTool === "skill") renderToolContent();
  try {
    const response = await fetch("/local/reply-skills", { cache: "no-store" });
    const payload = await response.json();
    state.replySkills = Array.isArray(payload.skills) ? payload.skills : [];
    log("reply skills loaded", { count: state.replySkills.length });
  } catch (error) {
    state.replySkills = [];
    toast(`skill 回复库加载失败：${error.message}`, true);
  } finally {
    state.replySkillsLoading = false;
    if (state.activeTool === "skill") renderToolContent();
  }
}

async function saveReplySkills() {
  const response = await fetch("/local/reply-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ version: 1, skills: state.replySkills })
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "保存 skill 回复库失败");
  }
  state.replySkills = Array.isArray(payload.skills) ? payload.skills : state.replySkills;
}

function buildSkillSuggestion() {
  const match = matchReplySkill();
  if (!match) return null;
  const skill = match.skill;
  const latest = match.latest || getLatestActionableInboundMessage();
  const contextText = latest ? getSkillMatchText(latest) : "";
  const replyProfile = skill.noReply
    ? null
    : getSkillReplyProfile(skill, {
      prompt: contextText,
      contextText,
      platformKey: match.platformKey || skill.platformKey || "",
      intentKey: match.intentKey || skill.intentKey || "",
      preferLearned: true
    });
  if (skill.noReply) {
    return {
      type: "skill",
      title: `skill：${skill.title}`,
      skillId: skill.id,
      noReply: true,
      reason: skill.fallback || "这类消息通常不需要回复。",
      score: match.score,
      promptKey: latest ? getMessageKey(latest, 0) : "",
      contextText,
      platformKey: match.platformKey || skill.platformKey || "",
      intentKey: match.intentKey || skill.intentKey || "",
      matchedOrderNo: match.matchedOrderNo || "",
      matchKeywords: match.matchKeywords || []
    };
  }

  return {
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    allowAutoReply: skill.allowAutoReply !== false,
    content: replyProfile?.text || getSkillText(skill),
    steps: replyProfile?.steps || getSkillSteps(skill),
    score: match.score,
    contactUrl: skill.contactUrl || ONLINE_SERVICE_URL,
    promptKey: latest ? getMessageKey(latest, 0) : "",
    contextText,
    platformKey: match.platformKey || skill.platformKey || "",
    intentKey: match.intentKey || skill.intentKey || "",
    matchedOrderNo: match.matchedOrderNo || "",
    matchKeywords: match.matchKeywords || [],
    learnedFromOverride: Boolean(replyProfile?.usingOverride),
    overrideCount: replyProfile?.overrideCount || 0,
    imageCount: replyProfile?.imageCount || 0
  };
}

function matchReplySkill() {
  const latest = getLatestSkillTriggerMessage();
  if (!latest) return null;
  return matchReplySkillForMessage(latest, {
    onlyNoReply: latest.isSystemNotice || latest.direction === "system" || isNoReplyCandidate(latest)
  });
}

function matchReplySkillForMessage(latest, options = {}) {
  const context = getSkillMatchText(latest);
  const normalized = normalizeForMatch(context);
  const contextMeta = collectSkillContextMeta(latest, context);
  const matches = state.replySkills
    .filter((skill) => skill.enabled !== false && (!options.onlyNoReply || skill.noReply))
    .map((skill) => ({
      skill,
      ...scoreReplySkill(skill, normalized, latest, contextMeta)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.skill.priority || 0) - Number(a.skill.priority || 0));
  return matches[0] ? { ...matches[0], latest } : null;
}

function scoreReplySkill(skill, normalizedContext, triggerMessage, contextMeta = collectSkillContextMeta(triggerMessage, normalizedContext)) {
  const negatives = Array.isArray(skill.negativeKeywords) ? skill.negativeKeywords : [];
  if (negatives.some((keyword) => keyword && normalizedContext.includes(normalizeForMatch(keyword)))) {
    return { score: 0, platformKey: "", intentKey: "", matchedOrderNo: "", matchKeywords: [] };
  }

  const keywords = Array.isArray(skill.keywords) ? skill.keywords : [];
  const samples = Array.isArray(skill.samples) ? skill.samples : [];
  const matchKeywords = [];
  let score = Number(skill.priority || 0) / 10;
  let hits = 0;

  keywords.forEach((keyword) => {
    const normalized = normalizeForMatch(keyword);
    if (!normalized) return;
    if (normalizedContext.includes(normalized)) {
      hits += 1;
      score += Math.min(20, normalized.length * 1.5);
      if (!matchKeywords.includes(keyword)) matchKeywords.push(keyword);
    }
  });

  samples.forEach((sample) => {
    const normalized = normalizeForMatch(sample);
    if (!normalized) return;
    if (normalizedContext.includes(normalized)) {
      score += 8;
      if (!matchKeywords.includes(sample)) matchKeywords.push(sample);
    }
  });

  const resolvedPlatformKey = resolveSkillPlatformKey(skill, contextMeta);
  const resolvedIntentKey = resolveSkillIntentKey(skill, contextMeta);

  if (skill.systemOnly && !triggerMessage?.isSystemNotice) {
    return { score: 0, platformKey: resolvedPlatformKey, intentKey: resolvedIntentKey, matchedOrderNo: contextMeta.orderNo || "", matchKeywords };
  }

  if (resolvedPlatformKey) {
    if (skill.platformKey && skill.platformKey === resolvedPlatformKey) {
      score += 26;
      hits += 1;
    } else if (Array.isArray(skill.platformKeys) && skill.platformKeys.includes(resolvedPlatformKey)) {
      score += 20;
      hits += 1;
    } else if (!skill.platformKey && !Array.isArray(skill.platformKeys)) {
      score += 4;
    } else {
      score = Math.max(0, score - 18);
    }
  }

  if (resolvedIntentKey) {
    if (skill.intentKey && skill.intentKey === resolvedIntentKey) {
      score += 22;
      hits += 1;
    } else if (Array.isArray(skill.intentKeys) && skill.intentKeys.includes(resolvedIntentKey)) {
      score += 16;
      hits += 1;
    } else if (!skill.intentKey && !Array.isArray(skill.intentKeys)) {
      score += 3;
    } else {
      score = Math.max(0, score - 12);
    }
  }

  if (contextMeta.orderNo) {
    const skillHaystack = normalizeForMatch([
      skill.title,
      skill.platformKey,
      skill.intentKey,
      ...(skill.keywords || []),
      ...(skill.samples || [])
    ].join(" "));
    if (skillHaystack.includes(normalizeForMatch(contextMeta.orderNo))) {
      score += 18;
      hits += 1;
      if (!matchKeywords.includes(contextMeta.orderNo)) matchKeywords.push(contextMeta.orderNo);
    }
  }

  const matchedOverride = getPreferredSkillOverride(skill, {
    prompt: contextMeta.text,
    contextText: contextMeta.text,
    platformKey: resolvedPlatformKey,
    intentKey: resolvedIntentKey
  });
  if (matchedOverride) {
    const overrideScore = scoreSkillOverride(matchedOverride, {
      prompt: contextMeta.text,
      contextText: contextMeta.text,
      platformKey: resolvedPlatformKey,
      intentKey: resolvedIntentKey
    });
    if (overrideScore > 0) {
      score += Math.min(44, Math.round(overrideScore * 0.55));
      hits += 1;
      const learnedKeyword = compactInlineText(matchedOverride.reply || matchedOverride.prompt || "", 18);
      if (learnedKeyword && !matchKeywords.includes(learnedKeyword)) matchKeywords.push(learnedKeyword);
    }
  }

  return {
    score: hits ? score : 0,
    platformKey: resolvedPlatformKey,
    intentKey: resolvedIntentKey,
    matchedOrderNo: contextMeta.orderNo || "",
    matchKeywords
  };
}

function normalizeForMatch(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

function normalizeOrderNo(value) {
  return String(value || "").trim().replace(/[^\dA-Za-z-]/g, "");
}

function getOrderPlatformKey(orderType) {
  return ORDER_TYPE_PLATFORM_KEYS[Number(orderType)] || "";
}

function detectPlatformKeyFromOrderName(value) {
  const normalized = normalizeForMatch(value);
  if (!normalized) return "";
  return SKILL_PLATFORM_DEFS.find((platform) => (
    platform.aliases.some((alias) => normalized.includes(normalizeForMatch(alias)))
  ))?.key || "";
}

function getOrderRecordPlatformKey(order) {
  if (!order) return "";
  return String(order.platformKey || "")
    || getOrderPlatformKey(order.orderType ?? order.type)
    || detectPlatformKeyFromOrderName([
      order.platformName,
      order.platform,
      order.source,
      order.appName,
      order.shopType,
      order.orderSource,
      order.title,
      order.remark
    ].filter(Boolean).join(" "));
}

function getOrderRecordNumbers(order) {
  if (!order || typeof order !== "object") return [];
  const direct = [
    order.orderNo,
    order.parentOrderNo,
    order.orderId,
    order.parentOrderId,
    order.tradeId,
    order.tradeNo,
    order.tradeParentId,
    order.tradeParentNo,
    order.orderSn,
    order.orderSN,
    order.outOrderNo,
    order.bizOrderNo,
    order.id
  ];
  const byKey = Object.entries(order)
    .filter(([key, value]) => /order|trade|sn|no/i.test(key) && ["string", "number"].includes(typeof value))
    .map(([, value]) => value);
  return [...new Set([...direct, ...byKey]
    .map(normalizeOrderNo)
    .filter((item) => item && item !== "订单"))];
}

function detectOrderPlatformFromRecords(orderNo) {
  const target = normalizeOrderNo(orderNo);
  if (!target || !Array.isArray(state.orders)) return "";
  for (const order of state.orders) {
    const numbers = getOrderRecordNumbers(order);
    if (!numbers.some((item) => item === target || item.includes(target) || target.includes(item))) continue;
    const platformKey = getOrderRecordPlatformKey(order);
    if (platformKey) return platformKey;
  }
  return "";
}

function getPlatformDefByKey(key) {
  return key ? SKILL_PLATFORM_LOOKUP.get(String(key)) || null : null;
}

function getIntentDefByKey(key) {
  return key ? SKILL_INTENT_LOOKUP.get(String(key)) || null : null;
}

function getPlatformLabelByKey(key) {
  return getPlatformDefByKey(key)?.label || "";
}

function getIntentLabelByKey(key) {
  return getIntentDefByKey(key)?.label || "";
}

function getSkillPlatformKeys(skill) {
  const direct = skill?.platformKey ? [String(skill.platformKey)] : [];
  const extra = Array.isArray(skill?.platformKeys) ? skill.platformKeys.map(String) : [];
  return [...new Set([...direct, ...extra].filter(Boolean))];
}

function getSkillIntentKeys(skill) {
  const direct = skill?.intentKey ? [String(skill.intentKey)] : [];
  const extra = Array.isArray(skill?.intentKeys) ? skill.intentKeys.map(String) : [];
  return [...new Set([...direct, ...extra].filter(Boolean))];
}

function getSkillCategoryToken(skill) {
  const platformKey = getSkillPlatformKeys(skill)[0];
  if (platformKey) return `platform:${platformKey}`;
  const intentKey = getSkillIntentKeys(skill)[0];
  if (intentKey) return `intent:${intentKey}`;
  return SKILL_CATEGORY_UNCATEGORIZED;
}

function collectSkillContextMeta(triggerMessage, contextText = "") {
  const text = String(contextText || getSkillMatchText(triggerMessage) || "");
  const orderNo = detectPlatformOrderNo(text);
  const orderPlatformKey = orderNo.platformKey || detectOrderPlatformFromState();
  const intentKey = detectSkillIntentKey(text);
  return {
    text,
    normalizedText: normalizeForMatch(text),
    orderNo: orderNo.orderNo || "",
    platformKey: orderPlatformKey || "",
    intentKey: intentKey || "",
    orderSource: orderNo.source || ""
  };
}

function detectPlatformOrderNo(text) {
  const rawText = String(text || "");
  const candidates = rawText.match(/[A-Za-z0-9-]{8,24}/g) || [];
  const explicitPlatformKey = detectPlatformKeyFromText(rawText);
  const statePlatformKey = detectOrderPlatformFromState();
  for (const candidate of candidates) {
    const orderNo = normalizeOrderNo(candidate);
    if (!orderNo) continue;
    const recordPlatformKey = detectOrderPlatformFromRecords(orderNo);
    const platformKey = inferOrderPlatformKey(orderNo, {
      explicitPlatformKey,
      recordPlatformKey,
      statePlatformKey
    });
    if (platformKey) {
      const source = explicitPlatformKey ? "message-platform" : recordPlatformKey ? "order-record" : statePlatformKey ? "order-state" : "message";
      return { orderNo, platformKey, source };
    }
  }
  return { orderNo: "", platformKey: "", source: "" };
}

function inferOrderPlatformKey(orderNo, options = {}) {
  const normalized = normalizeOrderNo(orderNo);
  if (!normalized) return "";
  if (/^\d{8}-\d{4,}$/.test(normalized)) return "pdd";

  const explicitPlatformKey = options.explicitPlatformKey || "";
  if (explicitPlatformKey && isOrderNoCompatibleWithPlatform(normalized, explicitPlatformKey, { allowGeneric: true })) {
    return explicitPlatformKey;
  }

  const recordPlatformKey = options.recordPlatformKey || "";
  if (recordPlatformKey && isOrderNoCompatibleWithPlatform(normalized, recordPlatformKey, { allowGeneric: true })) {
    return recordPlatformKey;
  }

  // Douyin Shop order ids often use 19 digits starting with 5, so check before generic/default numeric rules.
  if (/^5\d{18}$/.test(normalized)) return "douyin";

  const statePlatformKey = options.statePlatformKey || "";
  if (statePlatformKey && isOrderNoCompatibleWithPlatform(normalized, statePlatformKey, { allowGeneric: true })) {
    return statePlatformKey;
  }

  for (const platform of SKILL_PLATFORM_DEFS) {
    if ((platform.orderPatterns || []).some((pattern) => pattern.test(normalized))) {
      return platform.key;
    }
  }
  return "";
}

function isOrderNoCompatibleWithPlatform(orderNo, platformKey, options = {}) {
  const normalized = normalizeOrderNo(orderNo);
  const platform = getPlatformDefByKey(platformKey);
  if (!normalized || !platform) return false;
  if ((platform.orderPatterns || []).some((pattern) => pattern.test(normalized))) return true;
  if (!options.allowGeneric) return false;
  if (platformKey === "pdd") return /^\d{8}-\d{4,}$/.test(normalized);
  return /^\d{10,24}$/.test(normalized);
}

function detectPlatformKeyFromText(text) {
  return detectPlatformKeyFromOrderName(text);
}

function detectOrderPlatformFromState() {
  const firstOrder = Array.isArray(state.orders) ? state.orders[0] : null;
  const byRecord = getOrderRecordPlatformKey(firstOrder);
  if (byRecord) return byRecord;

  const fromFilter = getOrderPlatformKey(state.orderType);
  const hasOrderContext = state.activeTool === "order" && (state.orderKeyword || state.orderTotal || (Array.isArray(state.orders) && state.orders.length));
  return hasOrderContext ? fromFilter : "";
}

function detectSkillIntentKey(text) {
  const normalized = normalizeForMatch(text);
  if (!normalized) return "";
  if (isPureOrderNumberText(text)) return "order_waiting";
  const ranked = SKILL_INTENT_DEFS
    .map((intent) => ({
      key: intent.key,
      score: (intent.keywords || []).reduce((sum, keyword) => {
        const next = normalizeForMatch(keyword);
        return next && normalized.includes(next) ? sum + Math.max(2, next.length) : sum;
      }, 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.key || (getOrderNumbersFromText(text).length ? "order_waiting" : "");
}

function resolveSkillPlatformKey(skill, contextMeta) {
  const skillKeys = getSkillPlatformKeys(skill);
  if (skillKeys.length === 1) return skillKeys[0];
  if (contextMeta?.platformKey && skillKeys.includes(contextMeta.platformKey)) return contextMeta.platformKey;
  if (contextMeta?.platformKey) return contextMeta.platformKey;

  const haystack = normalizeForMatch([
    skill?.title,
    ...(skill?.keywords || []),
    ...(skill?.samples || [])
  ].join(" "));
  return SKILL_PLATFORM_DEFS.find((platform) => (
    platform.aliases.some((alias) => haystack.includes(normalizeForMatch(alias)))
  ))?.key || "";
}

function resolveSkillIntentKey(skill, contextMeta) {
  const skillKeys = getSkillIntentKeys(skill);
  if (skillKeys.length === 1) return skillKeys[0];
  if (contextMeta?.intentKey && skillKeys.includes(contextMeta.intentKey)) return contextMeta.intentKey;
  if (contextMeta?.intentKey) return contextMeta.intentKey;

  const haystack = normalizeForMatch([
    skill?.title,
    ...(skill?.keywords || []),
    ...(skill?.samples || [])
  ].join(" "));
  const ranked = SKILL_INTENT_DEFS
    .map((intent) => ({
      key: intent.key,
      score: (intent.keywords || []).reduce((sum, keyword) => {
        const next = normalizeForMatch(keyword);
        return next && haystack.includes(next) ? sum + Math.max(1, Math.ceil(next.length / 2)) : sum;
      }, 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.key || "";
}

function getSkillMatchText(latest) {
  const latestKey = getMessageKey(latest, 0);
  const messages = [];
  for (let index = state.messages.length - 1; index >= 0; index -= 1) {
    const message = state.messages[index];
    const isLatest = getMessageKey(message, index) === latestKey;
    if (!message || message.direction === "ai") continue;
    if ((message.direction === "system" || message.isSystemNotice) && !isLatest) continue;
    messages.unshift(message);
    if (isLatest || messages.length >= 6) break;
  }
  return messages
    .slice(-6)
    .map((message) => message.content || "")
    .join("\n");
}

function getSkillSteps(skill) {
  const sourceSteps = Array.isArray(skill?.steps) && skill.steps.length
    ? skill.steps
    : Array.isArray(skill?.replySteps) && skill.replySteps.length
      ? skill.replySteps
      : [];
  if (sourceSteps.length) {
    return sourceSteps.map((step) => ({
      type: step.type === "image" ? "image" : "text",
      content: step.content || "",
      url: step.url || "",
      label: step.label || ""
    }));
  }
  return skill?.fallback ? [{ type: "text", content: skill.fallback }] : [];
}

function getSkillOverrideCount(skill) {
  return Array.isArray(skill?.manualOverrides)
    ? skill.manualOverrides.reduce((sum, item) => sum + Number(item.count || 1), 0)
    : 0;
}

function buildSkillOverrideSteps(override) {
  if (!override) return [];
  const text = String(override.reply || "").trim();
  const imageUrls = Array.isArray(override.imageUrls) ? override.imageUrls : [];
  return [
    text ? { type: "text", content: text } : null,
    ...imageUrls.map((url, index) => ({
      type: "image",
      url: normalizeImageUrl(url),
      label: `学习图片 ${index + 1}`
    }))
  ].filter(Boolean);
}

function scoreSkillOverride(override, options = {}) {
  if (!override) return 0;
  const promptText = String(options.prompt || options.contextText || "").trim();
  const promptNormalized = normalizeForMatch(promptText);
  const overridePromptNormalized = normalizeForMatch(override.prompt || "");
  const overrideReplyNormalized = normalizeForMatch(override.reply || "");
  let score = Math.min(36, Number(override.count || 1) * 10);

  if (promptNormalized && overridePromptNormalized) {
    if (promptNormalized.includes(overridePromptNormalized) || overridePromptNormalized.includes(promptNormalized)) {
      score += 42;
    }
    const promptKeywords = extractLearningKeywords(promptText).map(normalizeForMatch).filter(Boolean);
    const overrideKeywords = extractLearningKeywords(override.prompt || "").map(normalizeForMatch).filter(Boolean);
    const overlap = promptKeywords.filter((keyword) => overrideKeywords.includes(keyword));
    score += overlap.length * 10;
    if (overrideReplyNormalized && promptKeywords.some((keyword) => overrideReplyNormalized.includes(keyword))) {
      score += 8;
    }
  }

  const age = Date.now() - new Date(override.at || 0).getTime();
  if (Number.isFinite(age) && age >= 0) {
    if (age < 7 * 24 * 60 * 60 * 1000) score += 8;
    else if (age < 30 * 24 * 60 * 60 * 1000) score += 4;
  }

  if (String(override.reply || "").trim()) score += 6;
  if (Array.isArray(override.imageUrls) && override.imageUrls.length) score += Math.min(8, override.imageUrls.length * 3);
  return score;
}

function getPreferredSkillOverride(skill, options = {}) {
  const overrides = Array.isArray(skill?.manualOverrides) ? skill.manualOverrides : [];
  if (!overrides.length) return null;
  const promptText = String(options.prompt || options.contextText || "").trim();
  const ranked = overrides
    .map((override, index) => ({
      ...override,
      __matchScore: scoreSkillOverride(override, options),
      __index: index
    }))
    .sort((a, b) => (
      b.__matchScore - a.__matchScore ||
      Number(b.count || 1) - Number(a.count || 1) ||
      new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime() ||
      a.__index - b.__index
    ));
  const best = ranked[0];
  if (!best) return null;
  if (!promptText) {
    return Number(best.count || 1) >= 3 ? best : null;
  }
  return best.__matchScore >= 22 ? best : null;
}

function getSkillReplyProfile(skill, options = {}) {
  const override = getPreferredSkillOverride(skill, options);
  const overrideCount = getSkillOverrideCount(skill);
  const overrideConfidence = Number(override?.count || 0);
  const shouldUseOverride = Boolean(
    override &&
    (
      options.forceLearned ||
      override.approved === true ||
      override.trainingStatus === "approved" ||
      skill.useManualOverrides === true
    )
  );
  const steps = shouldUseOverride
    ? normalizeSkillReplySteps(buildSkillOverrideSteps(override))
    : getSkillSteps(skill);
  const text = steps
    .filter((step) => step.type !== "image")
    .map((step) => step.content || "")
    .filter(Boolean)
    .join("\n\n");
  return {
    steps,
    text,
    override,
    overrideCount,
    usingOverride: shouldUseOverride,
    imageCount: steps.filter((step) => step.type === "image" && (step.url || step.content)).length
  };
}

function getSkillText(skill) {
  return getSkillReplyProfile(skill, { preferLearned: true }).text;
}

function getSkillImageSteps(skillOrSuggestion) {
  return getSkillSteps(skillOrSuggestion)
    .filter((step) => step.type === "image")
    .map((step) => ({
      ...step,
      url: normalizeImageUrl(step.url || step.content || "")
    }))
    .filter((step) => step.url);
}

function renderSkillImageStrip(skillOrSuggestion, options = {}) {
  const images = getSkillImageSteps(skillOrSuggestion);
  if (!images.length) return "";
  const limit = options.limit || 4;
  const visibleImages = images.slice(0, limit);
  const hiddenCount = Math.max(0, images.length - visibleImages.length);
  return `
    <div class="skill-image-strip" aria-label="skill 图片">
      ${visibleImages.map((step, index) => {
        const imageUrl = normalizeImageUrl(step.url || step.content);
        const displayImageUrl = getDisplayMediaUrl(imageUrl);
        return `
          <button class="skill-image-thumb" type="button" data-image-preview="${escapeAttr(imageUrl)}" title="${escapeAttr(step.label || `skill 图片 ${index + 1}`)}">
            <img src="${escapeAttr(displayImageUrl)}" alt="${escapeAttr(step.label || `skill 图片 ${index + 1}`)}">
          </button>
        `;
      }).join("")}
      ${hiddenCount ? `<span class="skill-image-more">+${hiddenCount}</span>` : ""}
    </div>
  `;
}

function getLatestInboundMessage() {
  return [...state.messages].reverse().find((message) => message.direction === "incoming" || message.isSystemNotice) || null;
}

function getLatestActionableInboundMessage() {
  return [...state.messages].reverse().find((message) => (
    message &&
    message.direction === "incoming" &&
    !message.isSystemNotice &&
    !isNoReplyCandidate(message)
  )) || null;
}

function isLikelyOrderNumberText(value) {
  const text = normalizeOrderNo(value);
  return /^\d{8}-\d{4,}$/.test(text) || /^\d{10,24}$/.test(text) || /^5\d{18}$/.test(text);
}

function getOrderNumbersFromText(text) {
  return [...new Set((String(text || "").match(/[A-Za-z0-9-]{8,24}/g) || [])
    .map(normalizeOrderNo)
    .filter(isLikelyOrderNumberText))];
}

function stripOrderNumbersFromText(text) {
  let value = String(text || "");
  getOrderNumbersFromText(value).forEach((orderNo) => {
    value = value.replaceAll(orderNo, " ");
  });
  return value.replace(/[^\p{Script=Han}A-Za-z]+/gu, "").trim();
}

function isPureOrderNumberText(text) {
  const orderNos = getOrderNumbersFromText(text);
  return Boolean(orderNos.length) && stripOrderNumbersFromText(text).length === 0;
}

function hasOrderLearningSignal(text) {
  return getOrderNumbersFromText(text).length > 0 || /(订单|单号|下单|跟单|提示|回馈|返利|饭粒|红包|鸿包)/.test(String(text || ""));
}

function isAdLikeLearningText(text) {
  return /(加微|加v|微信[:：]?|VX|QQ|兼职|刷单|贷款|办卡|推广|引流|合作|代理|招商|招聘|博彩|棋牌|私聊|私信|进群|群发|http[s]?:\/\/|www\.)/i.test(String(text || ""));
}

function isLowValueLearningReply(text) {
  const raw = String(text || "").trim();
  const value = normalizeForMatch(raw);
  if (!value || value.length <= 2) return true;
  return /^(好的|收到|嗯嗯|可以|谢谢|不客气|您好|你好|稍等|稍等一下|我看看|看一下|已处理|没事|可以的|ok)$/i.test(raw);
}

function shouldSkipManualLearning(prompt, reply, images = []) {
  const text = `${prompt}\n${reply}`;
  if (!hasOrderLearningSignal(text) && isAdLikeLearningText(prompt)) return true;
  if (!hasOrderLearningSignal(text) && !images.length && isLowValueLearningReply(reply)) return true;
  if (!hasOrderLearningSignal(text) && !detectPlatformKeyFromText(text) && !detectSkillIntentKey(text) && String(reply || "").trim().length < 12) return true;
  return false;
}

function getLatestUnansweredInboundMessage() {
  for (let index = state.messages.length - 1; index >= 0; index -= 1) {
    const message = state.messages[index];
    if (!message) continue;
    if (isAutoReplyHandledBoundary(message)) return null;
    if (message.direction === "incoming" && !message.isSystemNotice) {
      return isNoReplyCandidate(message) ? null : message;
    }
  }
  return null;
}

function isAutoReplyHandledBoundary(message) {
  if (!message) return false;
  if (message.direction === "outgoing" || message.direction === "ai") return true;
  if (message.isSystemNotice || message.direction === "system") return true;
  return false;
}

function getLatestSkillTriggerMessage() {
  for (let index = state.messages.length - 1; index >= 0; index -= 1) {
    const message = state.messages[index];
    if (!message || message.direction === "ai") continue;
    if (message.isSystemNotice || message.direction === "system") return message;
    if (isNoReplyCandidate(message)) return message;
    if (message.direction === "incoming") return message;
    if (isSkillSystemTrigger(message)) return message;
    if (message.direction === "outgoing") return null;
  }
  return null;
}

function isNoReplyCandidate(message) {
  const text = normalizeForMatch(message?.content || "");
  if (!text) return true;
  if (message?.bizType === 19 || message?.bizType === "19") return true;
  if (isOrderLookupResultText(text)) return true;
  if (/(提现|提取).{0,8}(成功|已提交|已经处理|等待处理|同步处理|到账)/.test(text)) return true;
  if (/(成功|已经处理|等待处理|同步处理).{0,8}(提现|提取)/.test(text)) return true;
  return false;
}

function isOrderLookupResultText(text) {
  const normalized = String(text || "");
  if (!normalized) return false;
  const hasQuestionOrProblem = /(查不到|查不出|没返|无返|没成功|不提示|失败|为什么|怎么|没有|没绑定|未绑定|吗|么|\?)/.test(normalized);
  if (hasQuestionOrProblem) return false;
  if (/发[【\[]?订单[】\]]?查看/.test(normalized)) return true;
  if (/(正品行货|商品详情)/.test(normalized) && /(订单|查看)/.test(normalized)) return true;
  if (/订单.{0,10}(成功|已生成|已提交|已绑定|已跟单|已记录|已查询)/.test(normalized)) return true;
  if (/(成功|已生成|已提交|已绑定|已跟单|已记录|已查询).{0,10}订单/.test(normalized)) return true;
  return false;
}

function isSkillSystemTrigger(message) {
  const text = normalizeForMatch(message?.content || "");
  if (!text) return false;
  const bizType = Number(message?.bizType);
  if ([11, 18, 21].includes(bizType) && /(绑定失败|未绑定|绑定方法|出错|失败|查不到|无返利|没返利)/.test(text)) return true;
  return Boolean(message?.isRedPoint || message?.isRedpoint) && /(绑定失败|未绑定|绑定方法|查不到|无返利|没返利|没成功|没绑定)/.test(text);
}

async function maybeBuildSkillSuggestion(options = {}) {
  if (!state.replySkills.length) await loadReplySkills();
  if (options.autoReply && !isCurrentAutoSuggestionKey(options.expectedKey)) return null;
  const suggestion = buildSkillSuggestion();
  if (!suggestion) return null;
  if (options.autoReply && !isCurrentAutoSuggestionKey(options.expectedKey)) return null;
  if (!options.autoReply && suggestion.promptKey && state.lastSkillPromptKey === suggestion.promptKey) return suggestion;
  state.lastSkillPromptKey = suggestion.promptKey || "";
  appendAiSuggestion(suggestion);
  if (
    options.autoReply &&
    state.skillAutoReply &&
    !state.skillAutoSending &&
    !suggestion.noReply &&
    canAutoReplySkill(suggestion)
  ) {
    await autoReplyWithSuggestion(suggestion);
  }
  return suggestion;
}

function canAutoReplySkill(suggestion) {
  const latest = getLatestSkillTriggerMessage();
  if (!latest) return false;
  if (latest.isSystemNotice || latest.direction === "system" || isNoReplyCandidate(latest)) return false;
  const unanswered = getLatestUnansweredInboundMessage();
  if (!unanswered || getMessageKey(unanswered, 0) !== getMessageKey(latest, 0)) return false;
  if (suggestion.allowAutoReply === false) return false;
  const key = `${getContactId(state.activeContact)}:${suggestion.skillId}:${getMessageKey(latest, 0)}`;
  if (state.lastSkillAutoReplyKey === key) return false;
  state.lastSkillAutoReplyKey = key;
  return true;
}

async function autoReplyWithSuggestion(suggestion) {
  state.skillAutoSending = true;
  try {
    await sendSuggestionSteps(suggestion);
  } finally {
    state.skillAutoSending = false;
  }
}

function canLearnAsMatchedSkill(skill, latest, prompt, contextMeta, matchedOption = {}) {
  if (!skill || skill.noReply) return false;
  const latestKey = latest ? getMessageKey(latest, 0) : "";
  const matchedPromptKey = String(matchedOption?.promptKey || "");
  if (matchedPromptKey && latestKey && matchedPromptKey !== latestKey) return false;

  const platformKeys = getSkillPlatformKeys(skill);
  if (contextMeta.platformKey && platformKeys.length && !platformKeys.includes(contextMeta.platformKey)) return false;

  const intentKeys = getSkillIntentKeys(skill);
  if (contextMeta.intentKey && intentKeys.length && !intentKeys.includes(contextMeta.intentKey)) return false;

  if (matchedOption?.skillId && isAppliedSuggestionContextValid(latest, matchedOption)) return true;

  const contextText = getSkillMatchText(latest) || prompt;
  const match = scoreReplySkill(skill, normalizeForMatch(contextText), latest, contextMeta);
  return Number(match.score || 0) >= 18;
}

function getLearningStageForMessage(latest) {
  if (!latest) return "first_answer";
  const latestKey = getMessageKey(latest, 0);
  const latestIndex = state.messages.findIndex((message, index) => getMessageKey(message, index) === latestKey);
  if (latestIndex <= 0) return "first_answer";
  const previousAction = state.messages
    .slice(0, latestIndex)
    .reverse()
    .find((message) => message && ["incoming", "outgoing"].includes(message.direction) && !message.isSystemNotice);
  if (previousAction?.direction === "outgoing") return "customer_followup";
  return "first_answer";
}

function buildLearningBucketKey(prompt, contextMeta = {}, learningStage = "") {
  const keywords = extractLearningKeywords(prompt, { ...contextMeta, learningStage })
    .map(normalizeForMatch)
    .filter(Boolean)
    .slice(0, 4);
  return [
    "learn",
    contextMeta.platformKey || "all",
    contextMeta.intentKey || "general",
    learningStage || "first_answer",
    keywords.slice(0, 3).join("_") || normalizeForMatch(prompt).slice(0, 18)
  ].join(":");
}

function findLearnedSkillForBucket(prompt, contextMeta = {}, learningStage = "") {
  const bucketKey = buildLearningBucketKey(prompt, contextMeta, learningStage);
  const exact = state.replySkills.find((skill) => String(skill.learningBucketKey || "") === bucketKey);
  if (exact) return exact;
  if (isPureOrderNumberText(prompt)) return null;
  const fallback = findLearnedSkillForPrompt(prompt);
  if (!fallback) return null;
  if (contextMeta.platformKey && getSkillPlatformKeys(fallback).length && !getSkillPlatformKeys(fallback).includes(contextMeta.platformKey)) return null;
  if (contextMeta.intentKey && getSkillIntentKeys(fallback).length && !getSkillIntentKeys(fallback).includes(contextMeta.intentKey)) return null;
  if (fallback.learningStage && learningStage && fallback.learningStage !== learningStage) return null;
  return fallback;
}

function buildSemanticLearningKeywords(contextMeta = {}, learningStage = "") {
  return uniqueSkillStrings([
    contextMeta.platformKey ? `${getPlatformLabelByKey(contextMeta.platformKey)}订单` : "订单号",
    contextMeta.intentKey ? getIntentLabelByKey(contextMeta.intentKey) : "订单未提示",
    learningStage === "customer_followup" ? "客户追问" : "首次答复",
    "客户发订单号"
  ], 8);
}

function sanitizeLearningKeywords(values, contextMeta = {}, sourceText = "") {
  const raw = Array.isArray(values) ? values : [values];
  const flat = raw.flatMap((value) => String(value || "").split(/[\n,，、\s]+/));
  const filtered = flat
    .map((item) => item.trim())
    .filter((item) => item && !isLikelyOrderNumberText(item) && !isAdLikeLearningText(item));
  const semantic = getOrderNumbersFromText(sourceText).length
    ? buildSemanticLearningKeywords(contextMeta, contextMeta.learningStage)
    : [];
  return uniqueSkillStrings([...filtered, ...semantic], 20);
}

function uniqueSkillStrings(values, limit = 24) {
  const seen = new Set();
  const result = [];
  (Array.isArray(values) ? values : []).forEach((value) => {
    const text = String(value || "").trim();
    if (!text) return;
    const key = normalizeForMatch(text);
    if (seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });
  return result.slice(0, limit);
}

function mergeManualTrainingOverride(overrides = [], override) {
  const normalizedPrompt = normalizeForMatch(override.prompt);
  const normalizedReply = normalizeForMatch(override.reply);
  const imageKey = (override.imageUrls || []).map((url) => normalizeImageUrl(url)).filter(Boolean).join("|");
  const duplicateIndex = overrides.findIndex((item) => (
    normalizeForMatch(item.prompt) === normalizedPrompt &&
    normalizeForMatch(item.reply) === normalizedReply &&
    (Array.isArray(item.imageUrls) ? item.imageUrls.map((url) => normalizeImageUrl(url)).filter(Boolean).join("|") : "") === imageKey &&
    String(item.platformKey || "") === String(override.platformKey || "") &&
    String(item.intentKey || "") === String(override.intentKey || "") &&
    String(item.learningStage || "") === String(override.learningStage || "")
  ));
  if (duplicateIndex >= 0) {
    return overrides.map((item, index) => index === duplicateIndex
      ? { ...item, ...override, count: Number(item.count || 1) + 1 }
      : item);
  }
  return [{ ...override, count: 1 }, ...overrides];
}

function getManualOverrideTotalCount(overrides = []) {
  return overrides.reduce((sum, item) => sum + Math.max(1, Number(item.count || 1)), 0);
}

async function learnFromManualReply(content, imageUrls = [], options = {}) {
  if (!state.skillAutoLearn) return;
  const latest = getLatestActionableInboundMessage();
  if (!latest || latest.isSystemNotice || latest.direction !== "incoming") return;
  const prompt = String(latest.content || "").trim();
  const reply = String(content || "").trim();
  const images = imageUrls.map(String).filter(Boolean);
  if (prompt.length < 2 || (reply.length < 2 && !images.length)) return;
  if (shouldSkipManualLearning(prompt, reply, images)) return;
  const steps = [
    reply ? { type: "text", content: reply } : null,
    ...images.map((url, index) => ({ type: "image", url, label: `人工回复图片 ${index + 1}` }))
  ].filter(Boolean);
  if (isCurrentReplyEffectivelySameAsAppliedSuggestion(reply, images)) return;

  const matchedSkillId = options.matchedSkill?.skillId;
  const matchedSkill = matchedSkillId ? getSkillById(matchedSkillId) : null;
  const contextMeta = collectSkillContextMeta(latest, prompt);
  const detectedPlatformKey = contextMeta.platformKey || detectOrderPlatformFromState() || options.matchedSkill?.platformKey || "";
  const detectedIntentKey = contextMeta.intentKey || options.matchedSkill?.intentKey || "";
  if (canLearnAsMatchedSkill(matchedSkill, latest, prompt, {
    ...contextMeta,
    platformKey: detectedPlatformKey,
    intentKey: detectedIntentKey
  }, options.matchedSkill)) {
    await learnMatchedSkillOverride(matchedSkill, {
      prompt,
      reply,
      images,
      steps,
      latest,
      platformKey: detectedPlatformKey,
      intentKey: detectedIntentKey
    });
    return;
  }

  const learningStage = getLearningStageForMessage(latest);
  const learningBucketKey = buildLearningBucketKey(prompt, {
    ...contextMeta,
    platformKey: detectedPlatformKey,
    intentKey: detectedIntentKey
  }, learningStage);
  const existing = findLearnedSkillForBucket(prompt, {
    ...contextMeta,
    platformKey: detectedPlatformKey,
    intentKey: detectedIntentKey
  }, learningStage);
  const override = {
    at: new Date().toISOString(),
    prompt,
    reply,
    imageUrls: images,
    contactId: getContactId(state.activeContact),
    messageKey: getMessageKey(latest, 0),
    platformKey: detectedPlatformKey,
    intentKey: detectedIntentKey,
    learningStage
  };
  const overrides = mergeManualTrainingOverride(Array.isArray(existing?.manualOverrides) ? existing.manualOverrides : [], override).slice(0, 24);
  const nextHitCount = getManualOverrideTotalCount(overrides);
  const hasStableBase = Array.isArray(existing?.replySteps) && existing.replySteps.length;

  const skill = {
    id: existing?.id || `learned-${Date.now()}`,
    title: existing?.title || `自动学习：${prompt.slice(0, 18)}`,
    source: "learned",
    enabled: existing ? existing.enabled !== false : false,
    allowAutoReply: Boolean(existing?.allowAutoReply),
    noReply: false,
    priority: Math.max(Number(existing?.priority || 45), 45),
    hitCount: nextHitCount,
    platformKey: existing?.platformKey || detectedPlatformKey,
    intentKey: existing?.intentKey || detectedIntentKey,
    learningMode: "review_queue",
    learningBucketKey,
    learningStage,
    trainingStatus: "needs_optimization",
    keywords: sanitizeLearningKeywords([
      ...(existing?.keywords || []),
      ...extractLearningKeywords(prompt, {
        ...contextMeta,
        platformKey: detectedPlatformKey,
        intentKey: detectedIntentKey,
        learningStage
      })
    ], {
      ...contextMeta,
      platformKey: detectedPlatformKey,
      intentKey: detectedIntentKey,
      learningStage
    }, prompt),
    samples: uniqueSkillStrings([...(existing?.samples || []), prompt, ...overrides.map((item) => item.prompt)], 14),
    manualOverrides: overrides,
    lastManualOverrideAt: override.at,
    revisionCount: Number(existing?.revisionCount || 0) + 1,
    replySteps: hasStableBase ? existing.replySteps : steps,
    fallback: existing?.fallback || reply || ""
  };

  try {
    const response = await fetch("/local/reply-skills/learn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill })
    });
    const payload = await response.json();
    if (response.ok && Array.isArray(payload.skills)) {
      state.replySkills = payload.skills;
      log("reply skill queued for training", { prompt, reply, images, hitCount: nextHitCount, learningBucketKey, learningStage });
    }
  } catch (error) {
    log("reply skill learn failed", { error: error.message, prompt });
  }
}

async function learnMatchedSkillOverride(skill, { prompt, reply, images, steps, latest, platformKey = "", intentKey = "" }) {
  const overrides = Array.isArray(skill.manualOverrides) ? [...skill.manualOverrides] : [];
  const latestKey = latest ? getMessageKey(latest, 0) : "";
  const learningStage = getLearningStageForMessage(latest);
  const imageKey = images.map((url) => normalizeImageUrl(url)).filter(Boolean).join("|");
  const duplicateIndex = overrides.findIndex((item) => (
    normalizeForMatch(item.prompt) === normalizeForMatch(prompt) &&
    normalizeForMatch(item.reply) === normalizeForMatch(reply) &&
    (Array.isArray(item.imageUrls) ? item.imageUrls.map((url) => normalizeImageUrl(url)).filter(Boolean).join("|") : "") === imageKey &&
    String(item.platformKey || "") === String(platformKey || "") &&
    String(item.intentKey || "") === String(intentKey || "") &&
    String(item.learningStage || "") === String(learningStage || "")
  ));
  const override = {
    at: new Date().toISOString(),
    prompt,
    reply,
    imageUrls: images,
    contactId: getContactId(state.activeContact),
    messageKey: latestKey,
    platformKey,
    intentKey,
    learningStage
  };

  if (duplicateIndex >= 0) {
    overrides[duplicateIndex] = {
      ...overrides[duplicateIndex],
      ...override,
      count: Number(overrides[duplicateIndex].count || 1) + 1
    };
  } else {
    overrides.unshift({ ...override, count: 1 });
  }

  const totalOverrideCount = overrides.reduce((sum, item) => sum + Number(item.count || 1), 0);
  const nextSkill = {
    ...skill,
    manualOverrides: overrides.slice(0, 24),
    lastManualOverrideAt: override.at,
    samples: [...new Set([...(skill.samples || []), prompt])].slice(0, 14),
    keywords: [...new Set([...(skill.keywords || []), ...extractLearningKeywords(prompt)])].slice(0, 24),
    revisionCount: Number(skill.revisionCount || 0) + 1,
    platformKey: skill.platformKey || platformKey,
    intentKey: skill.intentKey || intentKey,
    learningMode: "review_queue",
    learningStage: skill.learningStage || learningStage,
    trainingStatus: "needs_optimization"
  };

  try {
    await replaceReplySkill(nextSkill);
    log("matched reply skill learned", {
      skillId: skill.id,
      prompt,
      reply,
      images,
      overrideCount: totalOverrideCount,
      autoRevised: false
    });
    if (state.activeTool === "skill") renderToolContent();
  } catch (error) {
    log("matched reply skill learn failed", { error: error.message, skillId: skill.id, prompt });
  }
}

function findLearnedSkillForPrompt(prompt) {
  const platformKey = detectPlatformOrderNo(prompt).platformKey || detectOrderPlatformFromState() || "";
  const intentKey = detectSkillIntentKey(prompt) || "";
  const keywords = extractLearningKeywords(prompt).map(normalizeForMatch).filter(Boolean);
  if (!keywords.length) return null;
  const candidates = state.replySkills
    .filter((skill) => {
      if (!["learned", "manual"].includes(String(skill.source || ""))) return false;
      if (platformKey && getSkillPlatformKeys(skill).length && !getSkillPlatformKeys(skill).includes(platformKey)) return false;
      if (intentKey && getSkillIntentKeys(skill).length && !getSkillIntentKeys(skill).includes(intentKey)) return false;
      return true;
    })
    .map((skill) => {
      const haystack = normalizeForMatch([
        skill.title,
        ...(skill.keywords || []),
        ...(skill.samples || []),
        ...(Array.isArray(skill.manualOverrides) ? skill.manualOverrides.map((item) => item.prompt || "") : [])
      ].join("\n"));
      const keywordHits = keywords.filter((keyword) => keyword && haystack.includes(keyword)).length;
      let score = keywordHits * 16;
      if (platformKey && getSkillPlatformKeys(skill).includes(platformKey)) score += 24;
      if (intentKey && getSkillIntentKeys(skill).includes(intentKey)) score += 18;
      score += Math.min(18, getSkillOverrideCount(skill) * 3);
      return { skill, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.skill.priority || 0) - Number(a.skill.priority || 0));
  return candidates[0]?.skill || null;
}

function extractLearningKeywords(text, contextMeta = {}) {
  const normalized = String(text || "").replace(/[，。！？、,.!?]/g, " ").trim();
  const pieces = normalized.split(/\s+/).filter((item) => item.length >= 2 && !isLikelyOrderNumberText(item));
  if (getOrderNumbersFromText(text).length) {
    return buildSemanticLearningKeywords(contextMeta, contextMeta.learningStage);
  }
  const fallback = normalized.length > 12 ? [normalized.slice(0, 12), normalized.slice(-8)] : [normalized];
  return uniqueSkillStrings(pieces.length ? pieces : fallback.filter((item) => !isLikelyOrderNumberText(item)), 8);
}

function compactInlineText(value, max = 60) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function isCurrentReplyEffectivelySameAsAppliedSuggestion(reply, images = []) {
  if (!state.lastAppliedSuggestionFingerprint) return false;
  const currentFingerprint = buildSuggestionFingerprint({
    steps: [
      reply ? { type: "text", content: reply } : null,
      ...images.map((url) => ({ type: "image", url }))
    ].filter(Boolean)
  });
  return Boolean(currentFingerprint) && currentFingerprint === state.lastAppliedSuggestionFingerprint;
}

function maskAiPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const clone = JSON.parse(JSON.stringify(payload));
  if (clone.apiKey) clone.apiKey = maskSecret(clone.apiKey);
  if (clone.key) clone.key = maskSecret(clone.key);
  return clone;
}

function maskSecret(value) {
  const text = String(value || "");
  if (text.length <= 12) return "***";
  return `${text.slice(0, 6)}...${text.slice(-4)}`;
}

function appendAiSuggestion(content) {
  appendAiSuggestions([normalizeSuggestion(content)]);
}

function appendAiSuggestions(contents, options = {}) {
  const suggestions = contents.map(normalizeSuggestion).filter((suggestion) => getSuggestionTextForComposer(suggestion) || suggestion.noReply);
  const suggestion = suggestions[0];
  if (!suggestion) return;
  state.aiSuggestions = suggestions.slice(0, 3);
  state.aiSuggestion = suggestion;
  state.lastSuggestionUsed = false;
  renderAiSuggestionCard();
  if (!options.silent) {
    toast(suggestion.noReply ? "已识别为无需回复的消息。" : "已生成推荐回复，可点击采用或发送。");
  }
  if (state.activeTool === "skill") renderToolContent();
}

function normalizeSuggestion(content) {
  return typeof content === "object"
    ? content
    : {
      type: "ai",
      title: "AI 推荐",
      content: String(content || "").trim(),
      steps: [{ type: "text", content: String(content || "").trim() }]
    };
}

function buildSuggestionFingerprint(source) {
  const steps = getSuggestionSteps(source).map((step) => ({
    type: step.type === "image" ? "image" : "text",
    value: step.type === "image"
      ? normalizeImageUrl(step.url || step.content || "")
      : String(step.content || "").trim()
  })).filter((step) => step.value);
  if (!steps.length) return "";
  return steps.map((step) => `${step.type}:${step.value}`).join("|");
}

function rememberAppliedSuggestionContext(suggestion, fingerprintSource = suggestion) {
  const latest = getLatestSkillTriggerMessage() || getLatestActionableInboundMessage();
  const promptKey = String(suggestion?.promptKey || (latest ? getMessageKey(latest, 0) : "") || "");
  const contextText = suggestion?.contextText || (latest ? getSkillMatchText(latest) : "");
  const contextMeta = collectSkillContextMeta(latest, contextText);
  state.lastAppliedSuggestionFingerprint = buildSuggestionFingerprint(fingerprintSource || suggestion);
  state.lastAppliedSuggestionSkillId = String(suggestion?.skillId || "");
  state.lastAppliedSuggestionPromptKey = promptKey;
  state.lastAppliedSuggestionContactId = String(getContactId(state.activeContact) || "");
  state.lastAppliedSuggestionAt = Date.now();
  state.lastAppliedSuggestionPlatformKey = suggestion?.platformKey || contextMeta.platformKey || "";
  state.lastAppliedSuggestionIntentKey = suggestion?.intentKey || contextMeta.intentKey || "";
}

function clearAppliedSuggestionContext() {
  state.lastAppliedSuggestionFingerprint = "";
  state.lastAppliedSuggestionSkillId = "";
  state.lastAppliedSuggestionPromptKey = "";
  state.lastAppliedSuggestionContactId = "";
  state.lastAppliedSuggestionAt = 0;
  state.lastAppliedSuggestionPlatformKey = "";
  state.lastAppliedSuggestionIntentKey = "";
}

function isAppliedSuggestionContextValid(latest, suggestion = null) {
  if (!latest) return false;
  const skillId = String(suggestion?.skillId || state.lastAppliedSuggestionSkillId || "");
  if (!skillId) return false;

  const activeContactId = String(getContactId(state.activeContact) || "");
  const appliedContactId = String(state.lastAppliedSuggestionContactId || "");
  if (appliedContactId && activeContactId && appliedContactId !== activeContactId) return false;

  const appliedAt = Number(state.lastAppliedSuggestionAt || 0);
  if (appliedAt && Date.now() - appliedAt > APPLIED_SUGGESTION_TTL_MS) return false;

  const latestKey = latest ? getMessageKey(latest, 0) : "";
  const promptKey = String(suggestion?.promptKey || state.lastAppliedSuggestionPromptKey || "");
  if (promptKey && latestKey && promptKey !== latestKey) return false;

  const contextText = suggestion?.contextText || getSkillMatchText(latest);
  const contextMeta = collectSkillContextMeta(latest, contextText);
  const platformKey = suggestion?.platformKey || state.lastAppliedSuggestionPlatformKey || "";
  const intentKey = suggestion?.intentKey || state.lastAppliedSuggestionIntentKey || "";
  if (platformKey && contextMeta.platformKey && platformKey !== contextMeta.platformKey) return false;
  if (intentKey && contextMeta.intentKey && intentKey !== contextMeta.intentKey) return false;

  return true;
}

function useAiSuggestion(suggestion = state.aiSuggestion) {
  if (!suggestion) {
    toast("还没有 AI 推荐内容。", true);
    return;
  }
  if (suggestion.noReply) {
    toast("这条推荐判断为无需回复。", true);
    return;
  }
  if (suggestion.loading) {
    toast("文案还在优化中，稍等一下。", true);
    return;
  }
  const text = getSuggestionTextForComposer(suggestion);
  setReplyTextContent(escapeHtml(text.replace(/^建议回复：?/, "")));
  state.lastSuggestionUsed = true;
  rememberAppliedSuggestionContext(suggestion, {
    steps: getSuggestionSteps(suggestion).filter((step) => step.type !== "image")
  });
  el.replyText.focus();
}

function clearAiSuggestion() {
  state.aiSuggestion = null;
  state.aiSuggestions = [];
  state.lastSuggestionUsed = false;
  clearAppliedSuggestionContext();
  renderAiSuggestionCard();
}

function getSuggestionTextForComposer(suggestion) {
  const steps = getSuggestionSteps(suggestion).filter((step) => step.type !== "image");
  return steps.map((step) => step.content || "").filter(Boolean).join("\n\n");
}

async function sendCurrentSuggestion() {
  const suggestion = state.aiSuggestion;
  if (!suggestion) {
    toast("还没有可发送的推荐。", true);
    return;
  }
  if (suggestion.noReply) {
    toast("这条消息识别为无需回复，不会自动发送。", true);
    return;
  }
  if (suggestion.loading) {
    toast("文案还在优化中，稍等一下。", true);
    return;
  }
  if (suggestion.keepDraftImages) {
    useAiSuggestion(suggestion);
    await sendText();
    return;
  }
  await sendSuggestionSteps(suggestion);
}

function renderAiSuggestionCard() {
  if (!el.aiSuggestionCard) return;
  const shouldKeepMessageBottom = isNearBottom(el.messageList);
  const suggestions = state.aiSuggestions.length ? state.aiSuggestions : state.aiSuggestion ? [state.aiSuggestion] : [];
  const hasSuggestion = Boolean(suggestions.length);
  const sendDisabled = state.sendingMessage || !hasSuggestion || Boolean(state.aiSuggestion?.noReply) || Boolean(state.aiSuggestion?.loading);
  el.aiSuggestionCard.classList.toggle("is-hidden", !hasSuggestion);
  el.aiSuggestionCard.classList.toggle("is-single", suggestions.length === 1);
  el.aiSuggestionCard.classList.toggle("is-multiple", suggestions.length > 1);
  el.aiSuggestionCard.classList.toggle("is-no-reply", Boolean(state.aiSuggestion?.noReply));
  el.aiSuggestionCard.classList.toggle("is-optimize", state.aiSuggestion?.type === "optimize");
  el.aiSuggestionCard.classList.toggle("is-loading", Boolean(state.aiSuggestion?.loading));
  el.useAi.disabled = !hasSuggestion;
  el.sendAiSuggestion.disabled = sendDisabled;
  el.applyAiSuggestion.disabled = sendDisabled;
  if (el.refreshAiSuggestion) {
    el.refreshAiSuggestion.disabled = state.aiGenerating || !state.aiEnabled || !hasSuggestion;
    el.refreshAiSuggestion.textContent = state.aiGenerating ? "生成中" : "换一换";
  }
  if (hasSuggestion) {
    const disabled = state.sendingMessage || Boolean(state.aiSuggestion.noReply) || Boolean(state.aiSuggestion.loading);
    el.useAi.disabled = disabled;
    el.sendAiSuggestion.disabled = disabled;
    el.applyAiSuggestion.disabled = disabled;
    el.aiSuggestionTitle.textContent = getSuggestionPanelTitle(state.aiSuggestion);
    el.aiSuggestionText.innerHTML = suggestions.map((suggestion, index) => `
      <article class="ai-suggestion-option ${suggestion === state.aiSuggestion ? "is-active" : ""} ${suggestion.noReply ? "is-no-reply" : ""} ${suggestion.loading ? "is-loading" : ""}" data-suggestion-index="${index}">
        <span class="ai-suggestion-index">${index + 1}</span>
        <div class="ai-suggestion-copy">
          <p>${escapeHtml(formatSuggestionText(suggestion))}</p>
        </div>
        <div class="ai-suggestion-row-actions">
          ${suggestion.type === "optimize" && suggestion.skillId ? `<button class="mini-action primary" type="button" data-suggestion-action="update-skill" data-suggestion-index="${index}">更新skill</button>` : ""}
          <button class="mini-action" type="button" data-suggestion-action="apply" data-suggestion-index="${index}" ${suggestion.noReply || suggestion.loading ? "disabled" : ""}>采用</button>
          <button class="mini-action" type="button" data-suggestion-action="send" data-suggestion-index="${index}" ${suggestion.noReply || suggestion.loading ? "disabled" : ""}>发送</button>
        </div>
      </article>
    `).join("");
  }
  if (shouldKeepMessageBottom) {
    requestAnimationFrame(() => scheduleMessageListBottom());
  }
}

function scheduleWithdrawRiskScan(options = {}) {
  const contactId = String(getContactId(state.activeContact) || "");
  if (!contactId) {
    state.withdrawRisk = {
      contactId: "",
      loading: false,
      signal: null,
      checkedAt: 0,
      error: ""
    };
    renderWithdrawRiskSignal();
    return;
  }

  const canUseCached = !options.deep
    && state.withdrawRisk.contactId === contactId
    && state.withdrawRisk.checkedAt
    && Date.now() - Number(state.withdrawRisk.checkedAt) < WITHDRAW_REFUND_CACHE_MS;
  if (canUseCached) {
    renderWithdrawRiskSignal();
    return;
  }

  if (withdrawRiskScanTimer) window.clearTimeout(withdrawRiskScanTimer);
  state.withdrawRisk = {
    ...state.withdrawRisk,
    contactId,
    loading: true,
    error: ""
  };
  renderWithdrawRiskSignal();

  withdrawRiskScanTimer = window.setTimeout(() => {
    runWithdrawRiskScan(options).catch((error) => {
      const activeId = String(getContactId(state.activeContact) || "");
      if (activeId !== contactId) return;
      state.withdrawRisk = {
        contactId,
        loading: false,
        signal: buildWithdrawSafeSignal({ error: error.message }),
        checkedAt: Date.now(),
        error: error.message
      };
      renderWithdrawRiskSignal();
      log("withdraw risk scan failed", { source: options.source || "", error: error.message });
    });
  }, options.delay ?? 220);
}

async function runWithdrawRiskScan(options = {}) {
  const contact = state.activeContact;
  const contactId = String(getContactId(contact) || "");
  if (!contactId) return;
  const token = ++withdrawRiskScanToken;
  const messages = await collectWithdrawRiskMessages(contact, options);
  if (token !== withdrawRiskScanToken) return;
  if (String(getContactId(state.activeContact) || "") !== contactId) return;
  const signal = applyInsightDismissal(buildWithdrawInsightSignal(messages, contact), contact);
  state.contactInsights[contactId] = signal;
  state.withdrawRisk = {
    contactId,
    loading: false,
    signal,
    dismissOpen: false,
    checkedAt: Date.now(),
    error: ""
  };
  renderWithdrawRiskSignal();
  renderContacts();
}

async function collectWithdrawRiskMessages(contact, options = {}) {
  const contactId = String(getContactId(contact) || "");
  const cutoff = Date.now() - WITHDRAW_REFUND_LOOKBACK_MS;
  const messages = [];
  const addMessages = (items = []) => {
    items.filter(Boolean).forEach((item) => messages.push(item));
  };

  addMessages(state.messages);
  if (String(state.historyContactId || "") === contactId) addMessages(state.historyMessages);
  if (Array.isArray(contact?.records)) addMessages(contact.records);

  if (!options.deep) return mergeMessages(messages);

  let cursor = "";
  for (let page = 1; page <= WITHDRAW_REFUND_MAX_SCAN_PAGES; page += 1) {
    let result;
    try {
      result = await fetchMessagePage(contact, page, WITHDRAW_REFUND_SCAN_PAGE_SIZE, { endTime: cursor });
    } catch (error) {
      if (messages.length) {
        log("withdraw risk scan fallback to loaded messages", { page, error: error.message });
        break;
      }
      throw error;
    }
    const records = result.records || [];
    if (!records.length) break;
    addMessages(records);

    const merged = mergeMessages(records);
    const oldest = merged[0];
    cursor = getMessageCursorTime(oldest);
    const oldestTime = getMessageTimeValue(oldest);
    if (!cursor) break;
    if (oldestTime && oldestTime < cutoff) break;
    if (records.length < WITHDRAW_REFUND_SCAN_PAGE_SIZE) break;
  }

  return mergeMessages(messages);
}

function buildWithdrawInsightSignal(messages = [], contact = state.activeContact) {
  const merged = mergeMessages(messages).filter((message) => getMessageTimeValue(message) > 0);
  const lastSuccessAt = getLastWithdrawSuccessTime(merged);
  const cutoff = Math.max(Date.now() - WITHDRAW_REFUND_LOOKBACK_MS, lastSuccessAt || 0);
  const windowMessages = merged.filter((message) => getMessageTimeValue(message) >= cutoff);
  const failures = windowMessages.filter(isWithdrawRefundBlockMessage);
  const failureCount = failures.length;
  const customerQuestions = windowMessages.filter(isWithdrawQuestionMessage);
  const emotion = analyzeCustomerUrgency(windowMessages);
  const resolution = detectInsightResolution(windowMessages);
  const latestSignalAt = Math.max(
    failures.reduce((max, message) => Math.max(max, getMessageTimeValue(message)), 0),
    customerQuestions.reduce((max, message) => Math.max(max, getMessageTimeValue(message)), 0),
    emotion.lastAt || 0
  );
  if (resolution && latestSignalAt && resolution.time >= latestSignalAt) {
    return buildWithdrawSafeSignal({
      emotion: { score: 0, reasons: [] },
      lastSuccessAt,
      resolvedText: "客户已回复理解，感知已缓和"
    });
  }

  if (failureCount >= WITHDRAW_REFUND_MIN_COUNT) {
    const probability = calculateWithdrawRiskProbability({
      failureCount,
      customerQuestionCount: customerQuestions.length,
      emotionScore: emotion.score,
      firstAt: getMessageTimeValue(failures[0]),
      lastAt: getMessageTimeValue(failures[failures.length - 1]),
      lastSuccessAt
    });
    const severity = probability >= 82 ? "danger" : probability >= 64 ? "warn" : "notice";
    return {
      kind: "withdraw_refund_block",
      severity,
      probability,
      count: failureCount,
      questionCount: customerQuestions.length,
      emotion,
      firstAt: getMessageTimeValue(failures[0]),
      lastAt: getMessageTimeValue(failures[failures.length - 1]),
      lastSuccessAt,
      windowDays: 3,
      sampleText: compactInlineText(failures[failures.length - 1]?.content || "", 90),
      copyText: buildWithdrawRiskCopy({
        contact,
        count: failureCount,
        questionCount: customerQuestions.length,
        probability,
        emotion,
        firstAt: getMessageTimeValue(failures[0]),
        lastAt: getMessageTimeValue(failures[failures.length - 1]),
        lastSuccessAt
      })
    };
  }

  if (emotion.score >= 42) {
    return {
      kind: "customer_urgency",
      severity: emotion.score >= 70 ? "warn" : "notice",
      probability: Math.min(78, Math.max(46, emotion.score)),
      count: failureCount,
      questionCount: customerQuestions.length,
      emotion,
      lastAt: emotion.lastAt || getMessageTimeValue(customerQuestions[customerQuestions.length - 1]),
      windowDays: 3,
      copyText: `客户可能有急躁追问，建议先安抚，再核实订单或提现状态。命中线索：${emotion.reasons.join("、") || "追问较多"}`
    };
  }

  return buildWithdrawSafeSignal({ emotion, lastSuccessAt });
}

function buildWithdrawSafeSignal(options = {}) {
  return {
    kind: "safe",
    severity: "ok",
    probability: 0,
    count: 0,
    questionCount: 0,
    emotion: options.emotion || { score: 0, reasons: [] },
    lastSuccessAt: options.lastSuccessAt || 0,
    error: options.error || "",
    resolvedText: options.resolvedText || "",
    copyText: options.error
      ? `AI感知扫描失败：${options.error}`
      : options.resolvedText || "AI感知：暂无异常感知，按客户当前需求正常接待即可。"
  };
}

function loadInsightDismissals() {
  try {
    const parsed = JSON.parse(localStorage.getItem(INSIGHT_DISMISS_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistInsightDismissals() {
  const now = Date.now();
  const entries = Object.entries(state.insightDismissals || {})
    .filter(([, value]) => Number(value?.expiresAt || 0) > now)
    .slice(-500);
  state.insightDismissals = Object.fromEntries(entries);
  localStorage.setItem(INSIGHT_DISMISS_STORAGE_KEY, JSON.stringify(state.insightDismissals));
}

function getInsightDismissKey(contact = state.activeContact) {
  const contactId = getContactId(contact);
  return contactId ? String(contactId) : "";
}

function getInsightSignalTime(signal) {
  return Math.max(
    Number(signal?.lastAt || 0),
    Number(signal?.firstAt || 0),
    Number(signal?.emotion?.lastAt || 0),
    0
  );
}

function applyInsightDismissal(signal, contact = state.activeContact) {
  if (!signal || signal.kind === "safe") return signal;
  const key = getInsightDismissKey(contact);
  const dismissal = key ? state.insightDismissals[key] : null;
  if (!dismissal) return signal;
  if (Number(dismissal.expiresAt || 0) <= Date.now()) {
    delete state.insightDismissals[key];
    persistInsightDismissals();
    return signal;
  }
  const signalTime = getInsightSignalTime(signal);
  if (signalTime && signalTime > Number(dismissal.dismissedAt || 0)) return signal;
  return buildDismissedInsightSignal(dismissal, signal);
}

function buildDismissedInsightSignal(dismissal = {}, original = null) {
  const resolved = dismissal.action === "resolved";
  return {
    kind: "safe",
    severity: "ok",
    probability: 0,
    count: 0,
    questionCount: 0,
    emotion: { score: 0, reasons: [] },
    dismissed: true,
    dismissedAction: dismissal.action || "",
    originalKind: original?.kind || dismissal.kind || "",
    resolvedText: resolved ? "本次感知已标记解决" : "本次感知已忽略",
    copyText: resolved ? "AI感知：本次风险已标记解决。" : "AI感知：本次风险已忽略。"
  };
}

function setActiveInsightDismissal(action) {
  const contact = state.activeContact;
  const contactId = getInsightDismissKey(contact);
  const signal = state.withdrawRisk.signal;
  if (!contactId || !signal || signal.kind === "safe") return;
  const dismissedAt = Date.now();
  state.insightDismissals[contactId] = {
    action,
    kind: signal.kind,
    dismissedAt,
    signalTime: getInsightSignalTime(signal),
    expiresAt: dismissedAt + INSIGHT_DISMISS_TTL_MS
  };
  persistInsightDismissals();
  const nextSignal = buildDismissedInsightSignal(state.insightDismissals[contactId], signal);
  state.withdrawRisk = {
    ...state.withdrawRisk,
    signal: nextSignal,
    dismissOpen: false,
    checkedAt: Date.now()
  };
  state.contactInsights[contactId] = nextSignal;
  renderWithdrawRiskSignal();
  renderContacts();
  toast(action === "resolved" ? "已标记为解决，紧急度已降低。" : "已忽略本次感知，紧急度已降低。");
}

function getLastWithdrawSuccessTime(messages = []) {
  return messages.reduce((latest, message) => {
    if (!isWithdrawSuccessMessage(message)) return latest;
    return Math.max(latest, getMessageTimeValue(message));
  }, 0);
}

function isWithdrawRefundBlockMessage(message) {
  if (message?.direction === "incoming" && !message?.isSystemNotice) return false;
  const text = normalizeWithdrawText(message?.content || "");
  if (!text) return false;
  const hasWithdraw = /(提现|提取|提出来|提不了|微信提现)/.test(text);
  const hasRefundIssue = /(退货|退款|换货|维权|售后)/.test(text);
  const hasBlock = /(暂缓|阻止|不能|无法|存在|申请中|未完成|卡住|解除|完成后|12h|12小时)/.test(text);
  return hasWithdraw && hasRefundIssue && hasBlock;
}

function isWithdrawSuccessMessage(message) {
  const text = normalizeWithdrawText(message?.content || "");
  if (!text) return false;
  if (isWithdrawRefundBlockMessage(message)) return false;
  return /(提现|提取|转出).{0,12}(成功|到账|打款|已完成|完成|已处理)|(?:成功|到账|打款|已完成|完成|已处理).{0,12}(提现|提取|转出)/.test(text);
}

function isWithdrawQuestionMessage(message) {
  if (!message || message.direction === "outgoing" || message.direction === "ai") return false;
  const text = normalizeWithdrawText(message.content || "");
  if (!text) return false;
  return /(提现|提取|钱|余额|账户|到账|维权|退款|退货).{0,16}(为什么|为啥|咋|怎么|什么情况|啥情况|不行|不了|失败|还没|一直|又|多久|问号|\?)|(?:为什么|为啥|咋|怎么|什么情况|啥情况|不行|不了|失败|还没|一直|又|多久|\?).{0,16}(提现|提取|钱|余额|到账|维权|退款|退货)/.test(text);
}

function analyzeCustomerUrgency(messages = []) {
  let score = 0;
  let lastAt = 0;
  const reasons = new Set();
  const inbound = messages.filter((message) => message && message.direction === "incoming" && !message.isSystemNotice);
  inbound.forEach((message) => {
    const text = normalizeWithdrawText(message.content || "");
    if (!text) return;
    let hit = false;
    if (/(急|赶紧|快点|马上|立刻|等不及|着急)/.test(text)) {
      score += 24;
      reasons.add("急躁催促");
      hit = true;
    }
    if (/(怎么回事|什么情况|为啥|为什么|咋回事|咋还|到底|搞什么|无语)/.test(text)) {
      score += 18;
      reasons.add("疑问追问");
      hit = true;
    }
    if (/(一直|又|多次|几天|好几天|反复|还不行|还是不行|还没好)/.test(text)) {
      score += 16;
      reasons.add("反复遇到");
      hit = true;
    }
    if (/(投诉|生气|骗人|不处理|没人管)/.test(text)) {
      score += 30;
      reasons.add("投诉倾向");
      hit = true;
    }
    if (/[?？]{2,}|[!！]{2,}/.test(String(message.content || ""))) {
      score += 12;
      reasons.add("连续标点");
      hit = true;
    }
    if (hit) lastAt = Math.max(lastAt, getMessageTimeValue(message));
  });

  return {
    score: Math.min(100, score),
    lastAt,
    reasons: [...reasons].slice(0, 4)
  };
}

function detectInsightResolution(messages = []) {
  const ordered = mergeMessages(messages).filter((message) => getMessageTimeValue(message) > 0);
  let lastSoothingAt = 0;
  for (const message of ordered) {
    const time = getMessageTimeValue(message);
    if (isSoothingOutgoingMessage(message)) {
      lastSoothingAt = Math.max(lastSoothingAt, time);
      continue;
    }
    if (lastSoothingAt && time >= lastSoothingAt && isCustomerReliefMessage(message)) {
      return { time, message };
    }
  }
  return null;
}

function isSoothingOutgoingMessage(message) {
  if (!message || (message.direction !== "outgoing" && message.direction !== "ai")) return false;
  const text = normalizeWithdrawText(message.content || "");
  if (!text) return false;
  return /(别急|别着急|不要着急|稍等|我帮|帮你|帮您|核实|处理|看一下|查一下|放心|理解|抱歉|不好意思|辛苦|给你看|给您看)/.test(text);
}

function isCustomerReliefMessage(message) {
  if (!message || message.direction !== "incoming" || message.isSystemNotice) return false;
  const text = normalizeWithdrawText(message.content || "");
  if (!text) return false;
  if (/(为什么|为啥|怎么|咋|什么情况|不行|不了|失败|还没|一直|\?|？|急|投诉|骗人)/.test(text)) return false;
  return /^(好|好的|行|可以|嗯|恩|哦|OK|ok|知道了|明白了|理解|谢谢|感谢|辛苦了|麻烦了|收到|那行|可以的)$/.test(text)
    || /(谢谢|感谢|辛苦|明白|理解|知道了|好的|可以了|行了)/.test(text);
}

function calculateWithdrawRiskProbability(input = {}) {
  const countScore = Math.min(48, Number(input.failureCount || 0) * 16);
  const questionScore = Math.min(20, Number(input.customerQuestionCount || 0) * 8);
  const emotionScore = Math.min(18, Math.round(Number(input.emotionScore || 0) * 0.22));
  const span = Number(input.lastAt || 0) - Number(input.firstAt || 0);
  const spanScore = span > 18 * 60 * 60 * 1000 ? 8 : span > 3 * 60 * 60 * 1000 ? 4 : 0;
  const recentScore = Date.now() - Number(input.lastAt || 0) < 24 * 60 * 60 * 1000 ? 6 : 0;
  const resetPenalty = input.lastSuccessAt && Number(input.lastSuccessAt) > Number(input.firstAt || 0) ? 10 : 0;
  return Math.max(0, Math.min(96, 28 + countScore + questionScore + emotionScore + spanScore + recentScore - resetPenalty));
}

function normalizeWithdrawText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "")
    .replace(/提[现現]/g, "提现")
    .replace(/维[权權]/g, "维权")
    .replace(/退[款款讯]/g, "退款");
}

function getMessageTimeValue(message) {
  return getTimeValue(message?.sortTime || message?.sendTime || message?.createDate || message?.createTime || message?.time || message?.id || "");
}

function buildWithdrawRiskCopy(input = {}) {
  const lines = [
    "AI感知：用户可能遇到订单维权/退款结案状态未同步，导致提现反复被暂缓。",
    `近3天命中次数：${input.count || 0} 次`,
    `客户追问线索：${input.questionCount || 0} 条`,
    `成立概率：${input.probability || 0}%`
  ];
  if (input.emotion?.reasons?.length) lines.push(`情绪线索：${input.emotion.reasons.join("、")}`);
  if (input.firstAt) lines.push(`首次命中：${formatTime(input.firstAt)}`);
  if (input.lastAt) lines.push(`最近命中：${formatTime(input.lastAt)}`);
  if (input.lastSuccessAt) lines.push(`最近成功提现后重新计数：${formatTime(input.lastSuccessAt)}`);
  const userName = getContactDisplayName(input.contact || state.activeContact);
  if (userName) lines.unshift(`客户：${userName}`);
  return lines.join("\n");
}

function renderWithdrawRiskSignal() {
  if (!el.withdrawRiskSignal) return;
  const contactId = String(getContactId(state.activeContact) || "");
  if (!contactId) {
    el.withdrawRiskSignal.className = "withdraw-risk-signal is-hidden";
    el.withdrawRiskSignal.innerHTML = "";
    return;
  }

  const insight = state.withdrawRisk.signal;
  if (state.withdrawRisk.loading && !insight) {
    el.withdrawRiskSignal.className = "withdraw-risk-signal is-loading";
    el.withdrawRiskSignal.innerHTML = '<strong>AI感知</strong><span>正在扫描提现/维权与客户情绪...</span>';
    return;
  }

  if (!insight) {
    el.withdrawRiskSignal.className = "withdraw-risk-signal is-hidden";
    el.withdrawRiskSignal.innerHTML = "";
    return;
  }

  const severityClass = `is-${insight.severity || "ok"}`;
  const text = getWithdrawRiskSignalText(insight);
  const canOpenOrders = insight.kind === "withdraw_refund_block";
  const canDismiss = insight.kind !== "safe" && !insight.dismissed;
  el.withdrawRiskSignal.className = `withdraw-risk-signal ${severityClass}`;
  el.withdrawRiskSignal.innerHTML = `
    <strong>AI感知</strong>
    <span title="${escapeAttr(text)}">${escapeHtml(text)}</span>
    ${canOpenOrders ? '<button type="button" data-withdraw-risk-action="orders">查订单</button>' : ""}
    ${canDismiss ? '<button type="button" data-withdraw-risk-action="dismiss-toggle">消除</button>' : ""}
    ${canDismiss && state.withdrawRisk.dismissOpen ? `
      <span class="withdraw-dismiss-actions">
        <button type="button" data-withdraw-risk-action="dismiss-ignore">忽略</button>
        <button type="button" data-withdraw-risk-action="dismiss-resolved">已解决</button>
      </span>
    ` : ""}
  `;
}

function getWithdrawRiskSignalText(insight) {
  if (!insight) return "";
  if (insight.kind === "withdraw_refund_block") {
    const emotion = insight.emotion?.reasons?.length ? `，${insight.emotion.reasons.join("、")}` : "";
    return `用户近3天提现被维权/退款拦截 ${insight.count} 次，疑似订单结案未同步，概率 ${insight.probability}%${emotion}`;
  }
  if (insight.kind === "customer_urgency") {
    const reason = insight.emotion?.reasons?.join("、") || "多次追问";
    return `客户可能有急躁情绪，${reason}，建议先安抚再核实`;
  }
  if (insight.error) return `扫描失败：${insight.error}`;
  if (insight.resolvedText) return insight.resolvedText;
  return "暂无异常感知，正常接待即可";
}

function handleWithdrawRiskSignalClick(event) {
  const actionTarget = event.target.closest("[data-withdraw-risk-action]");
  const action = actionTarget?.dataset.withdrawRiskAction || "";
  if (action === "dismiss-toggle") {
    state.withdrawRisk.dismissOpen = !state.withdrawRisk.dismissOpen;
    renderWithdrawRiskSignal();
    return;
  }
  if (action === "dismiss-ignore") {
    setActiveInsightDismissal("ignored");
    return;
  }
  if (action === "dismiss-resolved") {
    setActiveInsightDismissal("resolved");
    return;
  }
  if (action === "orders") {
    state.orderKeyword = "";
    setToolTab("order");
    loadOrders(1);
  }
}

function getSuggestionPanelTitle(suggestion) {
  if (!suggestion) return "AI 推荐";
  if (suggestion.type === "optimize") return "文字优化";
  if (suggestion.type === "skill") return "skill 回复";
  return "AI 推荐";
}

function handleAiSuggestionClick(event) {
  const target = event.target.closest("[data-suggestion-action]");
  if (!target) {
    const option = event.target.closest("[data-suggestion-index]");
    if (option) {
      state.aiSuggestion = state.aiSuggestions[Number(option.dataset.suggestionIndex)] || state.aiSuggestion;
      renderAiSuggestionCard();
    }
    return;
  }
  const suggestion = state.aiSuggestions[Number(target.dataset.suggestionIndex)] || state.aiSuggestion;
  state.aiSuggestion = suggestion;
  renderAiSuggestionCard();
  if (target.dataset.suggestionAction === "apply") {
    useAiSuggestion(suggestion);
  } else if (target.dataset.suggestionAction === "send") {
    if (suggestion.keepDraftImages) {
      useAiSuggestion(suggestion);
      sendText();
    } else {
      sendSuggestionSteps(suggestion);
    }
  } else if (target.dataset.suggestionAction === "update-skill") {
    updateSkillFromSuggestion(suggestion);
  }
}

function formatSuggestionText(suggestion) {
  if (!suggestion) return "";
  if (suggestion.noReply) return suggestion.reason || "这类消息不需要回复。";
  const steps = getSuggestionSteps(suggestion);
  if (!steps.length) return suggestion.content || "";
  if (steps.length === 1 && steps[0].type !== "image") return steps[0].content || suggestion.content || "";
  return steps.map((step, index) => {
    if (step.type === "image") return `${index + 1}. [图片] ${step.label || step.url || ""}`;
    return `${index + 1}. ${step.content || ""}`;
  }).join("\n");
}

function getSuggestionSteps(suggestion) {
  if (!suggestion) return [];
  if (Array.isArray(suggestion.steps)) return suggestion.steps;
  if (Array.isArray(suggestion.replySteps)) return suggestion.replySteps;
  return suggestion.content ? [{ type: "text", content: suggestion.content }] : [];
}

async function loadFaq() {
  state.faqKeyword = state.faqKeyword ?? "";
  state.faqLoading = true;
  if (state.activeTool === "quick") renderToolContent();
  try {
    if (!state.faqCategories.length) {
      await loadFaqCategories();
    }
    const selectedCategory = getActiveFaqCategory();
    const payload = await api("/Faq/GetPageList", {
      talkTypeId: selectedCategory?.value || "",
      current: state.faqPage,
      size: 30,
      keyWord: state.faqKeyword
    });
    state.faqs = getRecords(payload).map(normalizeFaq);
    state.faqTotal = getTotal(payload);
    if (state.activeTool === "quick") renderToolContent();
  } catch (error) {
    state.faqs = [];
    state.faqTotal = 0;
    if (state.activeTool === "quick") renderToolContent();
    toast(`快捷回复接口失败：${error.message}`, true);
  } finally {
    state.faqLoading = false;
    if (state.activeTool === "quick") renderToolContent();
  }
}

async function loadFaqCategories() {
  const payload = await api("/Faq/GetTypeList", {});
  const records = getRecords(payload).map((item, index) => ({
    value: firstValue(item.idStr, item.id, item.talkTypeId, item.value, ""),
    label: item.name || item.typeName || item.label || `分类 ${index + 1}`
  })).filter((item) => item.value);

  state.faqCategories = records.length ? records : [...DEFAULT_FAQ_CATEGORIES];
  if (!state.faqCategory || !state.faqCategories.some((item) => String(item.value) === String(state.faqCategory))) {
    state.faqCategory = state.faqCategories[0]?.value || "";
  }
}

function getFaqCategories() {
  return state.faqCategories.length ? state.faqCategories : DEFAULT_FAQ_CATEGORIES;
}

function getActiveFaqCategory() {
  return getFaqCategories().find((item) => String(item.value) === String(state.faqCategory)) || getFaqCategories()[0] || null;
}

function normalizeFaq(item, index) {
  return {
    ...item,
    id: item.id || item.talkId || `faq-${index}`,
    title: item.talkTitle || item.title || item.name || item.question || "快捷回复",
    content: item.talkContent || item.content || item.answer || item.reply || item.text || ""
  };
}

async function loadOrders(page = 1) {
  const userName = getContactUserName(state.activeContact);
  if (!userName) {
    state.orders = [];
    state.orderTotal = 0;
    state.orderPage = 1;
    renderToolContent();
    return;
  }

  try {
    const payload = await api("/Order/GetPageList", {
      userName,
      orderType: state.orderType,
      orderDeviceType: state.orderDeviceType,
      current: page,
      size: 10,
      keyword: state.orderKeyword,
      contactId: getContactId(state.activeContact)
    });
    state.orders = getRecords(payload).map(normalizeOrder);
    state.orderTotal = getTotal(payload);
    state.orderPage = page;
    renderToolContent();
  } catch (error) {
    state.orders = [];
    state.orderTotal = 0;
    renderToolContent();
    toast(`订单接口失败：${error.message}`, true);
  }
}

async function loadContactInfo() {
  const contactId = getContactId(state.activeContact);
  if (!contactId) {
    state.contactInfo = null;
    state.contactInfoContactId = null;
    renderToolContent();
    return;
  }

  try {
    const payload = await api("/Contact/GetContactInfo", { contactId });
    state.contactInfo = getData(payload) || null;
    state.contactInfoContactId = contactId;
    const avatarChanged = syncActiveContactFromInfo(state.contactInfo);
    if (avatarChanged) {
      renderContacts();
      renderMessagesPreservingScroll();
    }
    renderActive();
    renderToolContent();
  } catch (error) {
    state.contactInfo = null;
    state.contactInfoContactId = null;
    renderActive();
    renderToolContent();
    toast(`用户信息接口失败：${error.message}`, true);
  }
}

async function loadAccountDetails(page = 1) {
  const userName = getContactUserName(state.activeContact);
  if (!userName) {
    state.accountDetails = [];
    state.accountDetailsUserName = "";
    state.accountDetailTotal = 0;
    state.accountDetailPage = 1;
    renderToolContent();
    return;
  }

  try {
    const payload = await api("/Order/GetAccDetailPageList", {
      userName,
      current: page,
      size: DETAIL_PAGE_SIZE
    });
    state.accountDetails = getRecords(payload).map(normalizeAccountDetail);
    state.accountDetailsUserName = userName;
    state.accountDetailTotal = getTotal(payload);
    state.accountDetailPage = page;
    renderToolContent();
  } catch (error) {
    state.accountDetails = [];
    state.accountDetailsUserName = userName;
    state.accountDetailTotal = 0;
    renderToolContent();
    toast(`账户明细接口失败：${error.message}`, true);
  }
}

async function loadHistoryMessages(page = 1, mode = "replace", options = {}) {
  const contact = state.activeContact;
  const contactId = getContactId(contact);
  if (!contactId) {
    state.historyMessages = [];
    state.historyContactId = null;
    state.historyPage = 1;
    state.historyTotal = 0;
    state.historyHasMore = false;
    renderToolContent();
    return;
  }

  const historyList = el.toolContent.querySelector("[data-history-list]");
  const previousScrollHeight = historyList?.scrollHeight || 0;
  const previousScrollTop = historyList?.scrollTop || 0;
  const wasNearBottom = isNearBottom(historyList);
  const previousHasMore = state.historyHasMore;
  const forceBottom = Boolean(options.forceBottom);
  const keepPosition = Boolean(options.keepPosition);
  state.historyLoading = true;
  if (mode === "replace" && !state.historyMessages.length) renderToolContent();

  try {
    const result = await fetchMessagePage(contact, page, HISTORY_PAGE_SIZE, {
      endTime: page > 1 ? getMessageCursorTime(state.historyMessages[0]) : ""
    });
    if (String(getContactId(state.activeContact) || "") !== String(contactId)) {
      state.historyLoading = false;
      return;
    }
    const records = result.records;
    const previousCount = state.historyMessages.length;
    const shouldMerge = mode === "append" || mode === "merge";
    const nextMessages = shouldMerge ? mergeMessages([...state.historyMessages, ...records]) : mergeMessages(records);
    state.historyMessages = nextMessages;
    state.historyContactId = contactId;
    state.historyPage = mode === "merge" ? Math.max(state.historyPage || 1, page) : page;
    state.historyTotal = result.total || 0;
    state.historyHasMore = getPagedHasMore({
      mode,
      records,
      pageSize: HISTORY_PAGE_SIZE,
      total: result.total,
      previousHasMore,
      previousCount,
      nextCount: nextMessages.length
    });
  } catch (error) {
    if (page === 1 && mode !== "merge") {
      state.historyMessages = [];
      state.historyContactId = contactId;
      state.historyTotal = 0;
    }
    state.historyHasMore = mode === "merge" ? previousHasMore : false;
    toast(`聊天记录接口失败：${error.message}`, true);
  } finally {
    state.historyLoading = false;
    renderToolContent();
    scheduleWithdrawRiskScan({ deep: false, source: `history:${mode}` });
    const nextHistoryList = el.toolContent.querySelector("[data-history-list]");
    if (nextHistoryList) {
      if (mode === "append") {
        restorePrependScroll(nextHistoryList, previousScrollHeight, previousScrollTop, { watchImages: true });
      } else if (mode === "merge") {
        if (wasNearBottom) {
          scrollElementToBottom(nextHistoryList, { force: true, watchImages: true });
        } else {
          restoreScrollTop(nextHistoryList, previousScrollTop, { watchImages: true });
        }
      } else if (forceBottom || (!keepPosition && wasNearBottom)) {
        scrollElementToBottom(nextHistoryList, { force: true, watchImages: true });
      } else {
        restoreScrollTop(nextHistoryList, previousScrollTop, { watchImages: true });
      }
      bindHistoryAutoLoad();
    }
  }
}

function normalizeOrder(item) {
  const rawOrderNo = item.parentOrderNo || item.orderNo || item.orderId || item.id || "订单";
  const platformKey = getOrderPlatformKey(item.orderType ?? item.type)
    || detectPlatformKeyFromOrderName([item.platformName, item.platform, item.source, item.appName, item.shopType, item.orderSource, item.title, item.remark].filter(Boolean).join(" "))
    || inferOrderPlatformKey(rawOrderNo, { statePlatformKey: getOrderPlatformKey(state.orderType) })
    || getOrderPlatformKey(state.orderType);
  return {
    ...item,
    orderNo: rawOrderNo,
    status: [item.statusStr, item.reStatusStr].filter(Boolean).join("/") || item.statusName || item.status || "未知",
    amount: item.payment ?? item.amount ?? item.orderAmount ?? item.price ?? "-",
    income: item.commission ?? item.income ?? item.commissionAmount ?? "-",
    commissionRate: item.commissionRate ?? item.rate ?? "-",
    buyerRebate: item.reUserBal ?? item.rebate ?? item.rebateAmount ?? item.backAmount ?? "-",
    profit: item.profit ?? item.profitAmount ?? "-",
    title: item.title || item.goodsName || item.remark || "",
    imageUrl: item.imageUrl || item.img || "",
    platformKey,
    platformName: orderTypeLabel(item.orderType ?? item.type ?? state.orderType),
    createdAt: formatUnixOrDate(item.createdt || item.createTime || item.createdAt || item.orderTime),
    paidAt: formatUnixOrDate(item.paydt || item.payTime || item.paymentTime),
    flowAt: formatUnixOrDate(item.accountdt || item.unfreezeTime || item.refundFinishTime || item.refundCreateTime),
    note: item.statusStr || item.remark || item.note || ""
  };
}

function normalizeAccountDetail(item) {
  return {
    ...item,
    id: item.id || "",
    balance: item.newBal ?? item.balance ?? item.amount ?? 0,
    integral: item.newInte ?? item.integral ?? 0,
    typeName: item.typeName || item.detailTypeName || item.remark || "-",
    date: formatDateOnly(item.createTime || item.createdAt || item.time || item.date)
  };
}

function usesInternalToolScroll(tab = state.activeTool) {
  return tab === "history" || tab === "skill" || tab === "quick";
}

function setToolTab(tab) {
  state.activeTool = tab;
  if (isMobileWorkbench()) setMobilePanel("tool");
  else if (isTabletWorkbench()) toggleToolDrawer(true);
  document.querySelectorAll("[data-tool-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.toolTab === tab);
  });
  const usesInternalScroll = usesInternalToolScroll(tab);
  el.toolContent?.classList.toggle("is-history-tool", tab === "history");
  el.toolContent?.classList.toggle("is-compact-tool", !usesInternalScroll);
  el.toolContent?.classList.toggle("is-skill-tool", tab === "skill");
  el.toolContent?.classList.toggle("is-quick-tool", tab === "quick");
  renderToolContent();
  if (
    tab === "history" &&
    state.historyMessages.length &&
    String(state.historyContactId || "") === String(getContactId(state.activeContact) || "")
  ) {
    scrollElementToBottom(el.toolContent.querySelector("[data-history-list]"), { force: true, watchImages: true });
  }
  loadToolDataForActiveTab();
}

function loadToolDataForActiveTab() {
  const tab = state.activeTool;
  if (tab === "user" && getContactId(state.activeContact) !== state.contactInfoContactId) {
    return loadContactInfo();
  }
  if (tab === "quick") {
    return loadFaq();
  }
  if (tab === "skill") {
    return state.replySkills.length ? Promise.resolve() : loadReplySkills();
  }
  if (tab === "order" && getContactUserName(state.activeContact)) {
    return loadOrders(state.orderPage || 1);
  }
  if (tab === "detail" && getContactUserName(state.activeContact) !== state.accountDetailsUserName) {
    return loadAccountDetails(1);
  }
  if (tab === "history" && String(state.historyContactId || "") !== String(getContactId(state.activeContact) || "")) {
    return loadHistoryMessages(1, "replace", { forceBottom: true });
  }
  return Promise.resolve();
}

function getToolScrollSelector(tab = state.activeTool) {
  if (tab === "skill") return ".skill-panel-scroll";
  if (tab === "quick") return ".quick-list";
  if (tab === "history") return "[data-history-list]";
  return "";
}

function captureToolScrollSnapshot() {
  if (!el.toolContent) return null;
  const selector = getToolScrollSelector();
  const node = selector ? el.toolContent.querySelector(selector) : el.toolContent;
  return {
    tab: state.activeTool,
    contactId: String(getContactId(state.activeContact) || ""),
    selector,
    scrollTop: node?.scrollTop || 0
  };
}

function restoreToolScrollSnapshot(snapshot) {
  if (!snapshot) return;
  if (snapshot.tab !== state.activeTool) return;
  if (snapshot.contactId !== String(getContactId(state.activeContact) || "")) return;
  const node = snapshot.selector ? el.toolContent.querySelector(snapshot.selector) : el.toolContent;
  if (!node || snapshot.scrollTop <= 0) return;
  restoreScrollTop(node, snapshot.scrollTop, { force: true, watchImages: true });
}

function renderToolContent() {
  const contact = state.activeContact;
  const scrollSnapshot = captureToolScrollSnapshot();
  const finishRender = () => restoreToolScrollSnapshot(scrollSnapshot);
  const usesInternalScroll = usesInternalToolScroll(state.activeTool);
  el.toolContent.classList.toggle("is-history-tool", state.activeTool === "history");
  el.toolContent.classList.toggle("is-compact-tool", !usesInternalScroll);
  el.toolContent.classList.toggle("is-skill-tool", state.activeTool === "skill");
  el.toolContent.classList.toggle("is-quick-tool", state.activeTool === "quick");
  if (!contact) {
    el.toolContent.innerHTML = '<div class="empty-state">请选择会话后查看右侧工具。</div>';
    finishRender();
    return;
  }

  if (state.activeTool === "user") {
    const rawInfo = getActiveContactInfo(contact) || {};
    const info = mergeUserInfo(contact, rawInfo);
    const robot = contact.robot || {};
    const userLongId = getContactUserId(contact, rawInfo);
    const parentId = firstValue(rawInfo.parentIdStr, rawInfo.parentUserIdStr, rawInfo.parentId, rawInfo.parentUserId, "-");
    const unionUserId = firstValue(rawInfo.unionUserIdStr, rawInfo.unionUserId, "--");
    const remark = getContactRemark(contact, rawInfo);
    el.toolContent.innerHTML = `
      <section class="tool-section">
        <h3><span>用户信息</span><button class="mini-action" type="button" data-action="refresh-user">刷新</button></h3>
        <div class="tool-section-body">
          ${kv("昵称", info.nickName || info.userNick || contact.userNick)}
          ${kv("用户ID", userLongId, true)}
          ${kv("微信ID", info.userName || contact.userName, true)}
          ${kv("会话ID", getContactId(contact), true)}
          ${kv("上级ID", parentId, true)}
          ${kv("会员类型", info.userTypeName || "-")}
          ${kv("会员标签", formatTags(info.tags || info.sysTags))}
          ${kv("余额", formatMoney(info.balance))}
          ${kv("积分", info.integral ?? "-")}
          ${kv("有效订单数", info.validOrderCount ?? "-")}
          ${kv("备注", remark || "-")}
          ${kv("标签", formatTags(info.sysTags || info.tags))}
        </div>
      </section>
      <section class="tool-section">
        <h3><span>机器人信息</span><button class="mini-action" type="button" data-action="refresh-user">刷新</button></h3>
        <div class="tool-section-body">
          ${kv("id", robot.robotUniqueIdStr || robot.robotUniqueId || contact.robotUniqueIdStr || contact.robotUniqueId, true)}
          ${kv("wxid", robot.robotId || contact.robotId, true)}
          ${kv("昵称", robot.robotRemark || robot.robotName || contact.robotName)}
          ${kv("备注", robot.robotRemark || "-")}
          ${kv("类型", robotTypeName(robot.robotType ?? contact.robotType))}
        </div>
      </section>
      <section class="tool-section">
        <h3><span>多端用户信息</span><button class="mini-action" type="button" data-action="refresh-user">刷新</button></h3>
        <div class="tool-section-body">
          ${kv("个微用户ID", userLongId, true)}
          ${kv("企微用户ID", firstValue(rawInfo.workWxUserIdStr, rawInfo.workWxUserId, "--"), true)}
          ${kv("多端用户ID", unionUserId, true)}
        </div>
      </section>
    `;
    finishRender();
    return;
  }

  if (state.activeTool === "quick") {
    el.toolContent.innerHTML = renderQuickReplyPanel();
    finishRender();
    return;
  }

  if (state.activeTool === "skill") {
    el.toolContent.innerHTML = renderSkillReplyPanel();
    finishRender();
    return;
  }

  if (state.activeTool === "order") {
    el.toolContent.innerHTML = `
      <section class="tool-section order-section">
        <h3><span>订单</span><button class="mini-action" type="button" data-action="refresh-order">刷新</button></h3>
        ${renderOrderFilters()}
        ${renderOrders()}
      </section>
    `;
    finishRender();
    return;
  }

  if (state.activeTool === "detail") {
    el.toolContent.innerHTML = `
      <section class="tool-section flat-section">
        <h3>账户流水 <button class="mini-action" type="button" data-action="refresh-details">刷新</button></h3>
        ${renderAccountDetails()}
      </section>
    `;
    finishRender();
    return;
  }

  el.toolContent.innerHTML = renderHistoryPanel();
  bindHistoryAutoLoad();
  hydrateVisibleLinkCards(el.toolContent);
  finishRender();
}

function renderQuickReplyPanel() {
  const categories = getFaqCategories();
  const activeCategory = getActiveFaqCategory();
  const totalText = state.faqLoading ? "加载中" : state.faqTotal ? `共 ${state.faqTotal} 条` : "暂无数据";
  return `
    <section class="tool-section quick-section">
      <h3><span>快捷回复</span><button class="mini-action" type="button" data-action="refresh-faq">刷新</button></h3>
      <div class="quick-search">
        <input data-faq-keyword value="${escapeAttr(state.faqKeyword)}" placeholder="搜索快捷回复" />
        <button type="button" class="icon-search-button" data-action="search-faq" title="搜索快捷回复" aria-label="搜索快捷回复"><i class="native-icon bfi-search" aria-hidden="true"></i></button>
      </div>
      <div class="quick-tabs" role="group" aria-label="快捷回复分类">
        ${categories.map((item) => `
          <button class="${String(state.faqCategory) === String(item.value) ? "is-active" : ""}" type="button" data-faq-category="${escapeAttr(item.value)}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="quick-summary">${escapeHtml(activeCategory?.label || "快捷回复")} / ${escapeHtml(totalText)}</div>
      <div class="quick-list">
        ${state.faqs.length ? state.faqs.map((faq, index) => `
          <article class="quick-row">
            <span class="quick-index">${index + 1}</span>
            <button class="quick-copy" type="button" data-copy="${escapeAttr(faq.content)}" title="复制快捷回复" aria-label="复制快捷回复"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>
            <div class="quick-main">
              <strong>${escapeHtml(faq.title)}</strong>
              <p>${escapeHtml(faq.content)}</p>
            </div>
            <div class="quick-actions">
              <button class="mini-action" type="button" data-quick-send="${escapeAttr(faq.content)}">发送</button>
              <button class="mini-action" type="button" data-quick-fill="${escapeAttr(faq.content)}">编辑</button>
            </div>
          </article>
        `).join("") : `<p class="empty-state">${state.faqLoading ? "快捷回复加载中..." : "当前分类没有返回快捷回复。"}</p>`}
      </div>
    </section>
  `;
}

function renderSkillReplyPanel() {
  const suggestion = buildSkillSuggestion();
  const groups = filterReplySkills(suggestion);
  const autoText = state.skillAutoReply ? "自动回复已开" : "仅推荐";
  const learnText = state.skillAutoLearn ? "自动学习已开" : "自动学习已关";
  const matchText = suggestion?.skillId
    ? suggestion.noReply ? "命中无需回复 skill" : "命中可回复 skill"
    : "未命中";
  return `
    <section class="tool-section skill-section">
      <h3>
        <span>skill 回复</span>
        <div class="skill-head-actions">
          <button class="mini-action" type="button" data-action="refresh-skills">刷新</button>
          <button class="mini-action" type="button" data-action="trim-skill-learning">清理学习</button>
        </div>
      </h3>
      <div class="skill-controls">
        <label><input type="checkbox" data-action="toggle-skill-auto" ${state.skillAutoReply ? "checked" : ""}> 自动回复</label>
        <label><input type="checkbox" data-action="toggle-skill-learn" ${state.skillAutoLearn ? "checked" : ""}> 自动学习</label>
      </div>
      <div class="quick-search">
        <input data-skill-keyword value="${escapeAttr(state.skillKeyword)}" placeholder="搜索技能、关键词、话术" />
        <button type="button" class="icon-search-button" data-action="search-skills" title="搜索 skill" aria-label="搜索 skill"><i class="native-icon bfi-search" aria-hidden="true"></i></button>
      </div>
      <div class="skill-summary">
        <span>${escapeHtml(autoText)} / ${escapeHtml(learnText)}</span>
        <span>${escapeHtml(matchText)} / ${state.replySkillsLoading ? "加载中" : `${state.replySkills.length} 个 skill`}</span>
      </div>
      <div class="skill-panel-scroll">
        <div class="skill-tabs" role="group" aria-label="skill 分类">
          ${buildSkillCategoryTabs(suggestion).map((item) => `
            <button class="${item.value === state.skillCategory ? "is-active" : ""}" type="button" data-skill-category="${escapeAttr(item.value)}">
              ${escapeHtml(item.label)}
            </button>
          `).join("")}
        </div>
        ${renderSkillMatchHint(suggestion)}
        ${groups.length ? groups.map((group) => renderSkillGroup(group, suggestion)).join("") : '<p class="empty-state skill-empty">没有匹配的 skill。</p>'}
      </div>
    </section>
  `;
}

function renderDatabaseRepairPanel() {
  const health = state.databaseRepair.health || null;
  const guard = state.databaseRepair.guard || null;
  const mode = health?.databaseMode || "未知";
  const ok = Boolean(health?.ok);
  const guardText = guard?.enabled
    ? `自动守护中，每 ${formatDatabaseMetric(guard.intervalMinutes)} 分钟检查一次`
    : "自动守护未开启";
  const guardMeta = [
    guard?.lastCheckedAt ? `上次检查 ${formatShortDateTime(guard.lastCheckedAt)}` : "",
    guard?.lastRepairAt ? `上次修复 ${formatShortDateTime(guard.lastRepairAt)}` : "",
    guard?.lastError ? `最近错误 ${guard.lastError}` : ""
  ].filter(Boolean).join(" · ");
  const statusClass = state.databaseRepair.error ? "danger" : ok ? "ok" : health ? "warn" : "muted";
  const statusText = state.databaseRepair.loading
    ? "检查中"
    : state.databaseRepair.repairing
      ? "修复中"
      : state.databaseRepair.error
        ? "检查失败"
        : ok
          ? "MySQL 正常"
          : health
            ? "需要修复"
            : "未检查";
  const errors = state.databaseRepair.error
    ? [state.databaseRepair.error]
    : Array.isArray(health?.errors) ? health.errors : [];
  return `
    <section class="database-repair-panel">
      <div class="database-repair-head">
        <div>
          <strong>飞牛数据库状态</strong>
          <span>当前 Web 和官方客户端数据异常时，优先确认这里是否仍是 MySQL。</span>
        </div>
        <span class="database-status-pill ${statusClass}">${escapeHtml(statusText)}</span>
      </div>
      <div class="database-status-grid">
        <div><span>数据库</span><strong>${escapeHtml(mode)}</strong></div>
        <div><span>联系人</span><strong>${formatDatabaseMetric(health?.totalContacts)}</strong></div>
        <div><span>历史</span><strong>${formatDatabaseMetric(health?.historyContacts)}</strong></div>
        <div><span>当前探测</span><strong>${formatDatabaseMetric(health?.currentAccount2)}</strong></div>
      </div>
      <div class="database-guard-line">
        <strong>${escapeHtml(guardText)}</strong>
        ${guardMeta ? `<span>${escapeHtml(guardMeta)}</span>` : ""}
      </div>
      ${errors.length ? `<div class="database-repair-errors">${errors.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>` : ""}
      <div class="database-repair-actions">
        <button class="mini-action" type="button" data-client-modal-action="database-health" ${state.databaseRepair.loading || state.databaseRepair.repairing ? "disabled" : ""}>刷新状态</button>
        <button class="mini-action primary" type="button" data-client-modal-action="database-repair" ${state.databaseRepair.repairing ? "disabled" : ""}>一键切回 MySQL</button>
      </div>
    </section>
  `;
}

function formatDatabaseMetric(value) {
  if (value === undefined || value === null || value === "") return "-";
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toLocaleString("zh-CN") : String(value);
}

function formatShortDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function loadDatabaseRepairStatus(options = {}) {
  if (state.databaseRepair.loading || state.databaseRepair.repairing) return;
  state.databaseRepair.loading = true;
  state.databaseRepair.error = "";
  if (state.activeModal?.type === "database") renderActiveModalBody();
  try {
    const response = await fetch("/local/fnos/health", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    state.databaseRepair.health = payload.health || null;
    state.databaseRepair.guard = payload.guard || null;
    if (!options.silent) {
      const healthy = Boolean(state.databaseRepair.health?.ok);
      toast(healthy ? "数据库当前为 MySQL，状态正常。" : "数据库状态异常，可以点击一键修复。", !healthy);
    }
  } catch (error) {
    state.databaseRepair.error = error.message;
    if (!options.silent) toast(`数据库状态检查失败：${error.message}`, true);
  } finally {
    state.databaseRepair.loading = false;
    if (state.activeModal?.type === "database") {
      renderActiveModalBody();
      updateDatabaseDeleteConfirmState();
    }
  }
}

async function repairDatabaseFromModal() {
  if (state.databaseRepair.repairing) return;
  const ok = window.confirm("确定要把飞牛悠聊服务端切回 MySQL 吗？修复期间可能会短暂影响接口读取。");
  if (!ok) return;
  state.databaseRepair.repairing = true;
  state.databaseRepair.error = "";
  renderActiveModalBody();
  try {
    const response = await fetch("/local/fnos/restore-mysql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    state.databaseRepair.health = payload.result?.after || null;
    state.databaseRepair.guard = payload.guard || state.databaseRepair.guard;
    toast("数据库已切回 MySQL，正在刷新会话数量。");
    await Promise.allSettled([
      loadContactCounts(),
      loadContacts(1, { keepPosition: true })
    ]);
  } catch (error) {
    state.databaseRepair.error = error.message;
    toast(`数据库修复失败：${error.message}`, true);
  } finally {
    state.databaseRepair.repairing = false;
    if (state.activeModal?.type === "database") {
      renderActiveModalBody();
      updateDatabaseDeleteConfirmState();
    }
  }
}

function filterReplySkills(suggestion = null) {
  const keyword = normalizeForMatch(state.skillKeyword);
  const matchedId = suggestion?.skillId ? String(suggestion.skillId) : "";
  const ranked = [...state.replySkills]
    .filter((skill) => {
      if (!keyword) return true;
      if (matchedId && String(skill.id) === matchedId) return true;
      return normalizeForMatch([
        skill.title,
        ...(skill.keywords || []),
        ...(skill.samples || []),
        getSkillText(skill)
      ].join(" ")).includes(keyword);
    })
    .map((skill) => ({
      skill,
      sortScore: buildSkillGroupScore(skill, suggestion)
    }))
    .sort((a, b) => {
      const aMatched = matchedId && String(a.skill.id) === matchedId;
      const bMatched = matchedId && String(b.skill.id) === matchedId;
      if (aMatched !== bMatched) return aMatched ? -1 : 1;
      const scoreDelta = Number(b.sortScore || 0) - Number(a.sortScore || 0);
      if (scoreDelta) return scoreDelta;
      return Number(b.skill.priority || 0) - Number(a.skill.priority || 0);
    });
  const scoped = ranked.filter(({ skill }) => shouldKeepSkillInActiveCategory(skill, suggestion));
  if (state.skillCategory === SKILL_CATEGORY_CURRENT) {
    return scoped.length
      ? [{ key: SKILL_CATEGORY_CURRENT, label: "当前匹配", skills: scoped.map((item) => item.skill) }]
      : [];
  }

  const grouped = [];
  const byCategory = new Map();
  scoped.forEach(({ skill }) => {
    const key = getSkillCategoryToken(skill);
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(skill);
  });

  const orderedKeys = [
    ...SKILL_PLATFORM_DEFS.map((platform) => `platform:${platform.key}`),
    ...SKILL_INTENT_DEFS.map((intent) => `intent:${intent.key}`),
    SKILL_CATEGORY_UNCATEGORIZED
  ];

  orderedKeys.forEach((key) => {
    const skills = byCategory.get(key);
    if (!skills?.length) return;
    grouped.push({
      key,
      label: getSkillCategoryMeta(key, suggestion).label,
      skills
    });
  });
  return grouped;
}

function buildSkillCategoryTabs(suggestion = null) {
  const items = [
    { value: SKILL_CATEGORY_CURRENT, label: "当前匹配" },
    { value: SKILL_CATEGORY_ALL, label: "全部" }
  ];
  SKILL_PLATFORM_DEFS.forEach((platform) => {
    items.push({ value: `platform:${platform.key}`, label: platform.label });
  });
  SKILL_INTENT_DEFS.forEach((intent) => {
    items.push({ value: `intent:${intent.key}`, label: intent.label });
  });
  items.push({ value: SKILL_CATEGORY_UNCATEGORIZED, label: "其他" });
  return items.filter((item, index, array) => array.findIndex((entry) => entry.value === item.value) === index);
}

function getSkillCategoryMeta(value, suggestion = null) {
  if (value === SKILL_CATEGORY_CURRENT) {
    if (suggestion?.platformKey || suggestion?.intentKey) {
      const tags = [getPlatformLabelByKey(suggestion.platformKey), getIntentLabelByKey(suggestion.intentKey)].filter(Boolean).join(" / ");
      return { label: "当前匹配", description: tags || "按当前上下文相似度排序" };
    }
    return { label: "当前匹配", description: "按当前上下文相似度排序" };
  }
  if (value === SKILL_CATEGORY_ALL) return { label: "全部", description: "浏览全部 skill" };
  if (value === SKILL_CATEGORY_UNCATEGORIZED) return { label: "其他", description: "暂未归类的 skill" };
  if (String(value).startsWith("platform:")) {
    const key = String(value).split(":")[1];
    return { label: getPlatformLabelByKey(key) || "平台", description: "按订单平台归类" };
  }
  if (String(value).startsWith("intent:")) {
    const key = String(value).split(":")[1];
    return { label: getIntentLabelByKey(key) || "意图", description: "按客户问题类型归类" };
  }
  return { label: "skill", description: "" };
}

function shouldKeepSkillInActiveCategory(skill, suggestion = null) {
  const category = state.skillCategory;
  if (category === SKILL_CATEGORY_ALL) return true;
  if (category === SKILL_CATEGORY_CURRENT) {
    if (!suggestion?.skillId) return false;
    const targetPlatform = suggestion.platformKey || "";
    const targetIntent = suggestion.intentKey || "";
    if (String(skill.id) === String(suggestion.skillId)) return true;
    if (targetPlatform && getSkillPlatformKeys(skill).includes(targetPlatform)) return true;
    if (targetIntent && getSkillIntentKeys(skill).includes(targetIntent)) return true;
    return false;
  }
  if (category === SKILL_CATEGORY_UNCATEGORIZED) {
    return getSkillCategoryToken(skill) === SKILL_CATEGORY_UNCATEGORIZED;
  }
  return getSkillCategoryToken(skill) === category;
}

function buildSkillGroupScore(skill, suggestion = null) {
  let score = Number(skill.priority || 0);
  if (suggestion?.skillId && String(skill.id) === String(suggestion.skillId)) score += 1000;
  if (suggestion?.platformKey && getSkillPlatformKeys(skill).includes(suggestion.platformKey)) score += 180;
  if (suggestion?.intentKey && getSkillIntentKeys(skill).includes(suggestion.intentKey)) score += 120;
  const overrideCount = Array.isArray(skill.manualOverrides)
    ? skill.manualOverrides.reduce((sum, item) => sum + Number(item.count || 1), 0)
    : 0;
  score += Math.min(80, overrideCount * 5);
  score += Math.min(40, Number(skill.hitCount || 0));
  return score;
}

function renderSkillGroup(group, suggestion = null) {
  return `
    <section class="skill-group">
      <header class="skill-group-header">
        <strong>${escapeHtml(group.label)}</strong>
        <span>${group.skills.length} 条</span>
      </header>
      <div class="skill-list ${suggestion?.skillId ? "has-active-match" : ""}">
        ${group.skills.map((skill, index) => renderSkillRow(skill, index, suggestion)).join("")}
      </div>
    </section>
  `;
}

function renderSkillMatchHint(suggestion) {
  if (!suggestion) {
    return '<div class="skill-inline-hint muted"><strong>当前未命中 skill</strong><span>AI 会结合快捷回复兜底</span></div>';
  }
  const tags = [
    suggestion.noReply ? "无需回复" : suggestion.allowAutoReply ? "可自动回复" : "建议回复",
    suggestion.platformKey ? getPlatformLabelByKey(suggestion.platformKey) : "",
    suggestion.intentKey ? getIntentLabelByKey(suggestion.intentKey) : "",
    suggestion.learnedFromOverride ? `已学习 ${suggestion.overrideCount || 1} 次` : "",
    suggestion.imageCount ? `带 ${suggestion.imageCount} 图` : ""
  ].filter(Boolean);
  return `
    <div class="skill-inline-hint ${suggestion.noReply ? "muted" : "is-hit"}">
      <strong>${escapeHtml(suggestion.noReply ? "命中无需回复" : "已命中 skill")}</strong>
      <span>${tags.map(escapeHtml).join(" / ") || escapeHtml(suggestion.title || "")}</span>
    </div>
  `;
}

function renderSkillMatchCard(suggestion) {
  const metaTags = [
    suggestion.noReply ? "无需回复" : suggestion.allowAutoReply ? "可自动回复" : "建议回复",
    suggestion.platformKey ? getPlatformLabelByKey(suggestion.platformKey) : "",
    suggestion.intentKey ? getIntentLabelByKey(suggestion.intentKey) : "",
    suggestion.learnedFromOverride ? `已学习 ${suggestion.overrideCount || 1} 次` : "",
    suggestion.imageCount ? `带 ${suggestion.imageCount} 图` : ""
  ].filter(Boolean);
  return `
    <div class="skill-match-card ${suggestion.noReply ? "no-reply" : ""}">
      <div class="skill-match-top">
        <div class="skill-match-head">
          <strong>${escapeHtml(suggestion.title || "skill 命中")}</strong>
          ${metaTags.length ? `<div class="skill-match-tags">${metaTags.map((item) => `<span class="skill-meta-tag">${escapeHtml(item)}</span>`).join("")}</div>` : ""}
        </div>
        <div class="skill-match-actions">
          <button class="mini-action" type="button" data-action="optimize-skill-match" ${suggestion.noReply ? "disabled" : ""}>优化</button>
          <button class="mini-action" type="button" data-action="apply-skill-match" ${suggestion.noReply ? "disabled" : ""}>采用</button>
          <button class="mini-action" type="button" data-action="send-skill-match" ${suggestion.noReply ? "disabled" : ""}>发送</button>
        </div>
      </div>
      <p>${escapeHtml(formatSuggestionText(suggestion))}</p>
      ${renderSkillImageStrip(suggestion, { limit: 3 })}
    </div>
  `;
}

function renderSkillRow(skill, index, suggestion = null) {
  const status = skill.noReply ? "无需回复" : skill.allowAutoReply ? "可自动" : "推荐";
  const replyProfile = skill.noReply
    ? {
      text: skill.fallback || "无需回复",
      steps: getSkillSteps(skill),
      override: null,
      overrideCount: getSkillOverrideCount(skill),
      usingOverride: false,
      imageCount: getSkillImageSteps(skill).length
    }
    : getSkillReplyProfile(skill, {
      prompt: suggestion?.contextText || "",
      contextText: suggestion?.contextText || "",
      platformKey: suggestion?.platformKey || "",
      intentKey: suggestion?.intentKey || "",
      preferLearned: Boolean(suggestion?.skillId)
    });
  const content = skill.noReply ? (skill.fallback || "无需回复") : replyProfile.text;
  const imageCount = replyProfile.imageCount;
  const isMatched = suggestion?.skillId && String(skill.id) === String(suggestion.skillId);
  const isDimmed = suggestion?.skillId && !isMatched;
  const overrideCount = replyProfile.overrideCount;
  const platformLabel = getPlatformLabelByKey(getSkillPlatformKeys(skill)[0]);
  const intentLabel = getIntentLabelByKey(getSkillIntentKeys(skill)[0]);
  const metaTags = [
    platformLabel,
    intentLabel,
    skill.source === "learned" ? "已学习" : "",
    replyProfile.usingOverride ? "学习版" : "",
    skill.noReply ? "无需回复" : ""
  ].filter(Boolean);
  const keywords = (skill.keywords || []).slice(0, 6);
  const footChips = [
    imageCount ? `带 ${imageCount} 图` : "",
    overrideCount ? `已纠正 ${overrideCount} 次` : "",
    skill.hitCount ? `命中 ${skill.hitCount} 次` : "",
    skill.revisionCount ? `修订 ${skill.revisionCount} 次` : ""
  ].filter(Boolean);
  const keywordLine = keywords.length ? `关键词：${keywords.join(" / ")}` : "";
  const learningNote = replyProfile.override
    ? `最近学习：${compactInlineText(replyProfile.override.reply || replyProfile.override.prompt || "", 46)}`
    : "";
  const learningState = Array.isArray(skill.manualOverrides) && skill.manualOverrides.length
    ? `学习覆盖 ${skill.manualOverrides.length} 条`
    : "基线话术";
  return `
    <article class="skill-row ${skill.enabled === false ? "is-disabled" : ""} ${isMatched ? "is-matched" : ""} ${isDimmed ? "is-dimmed" : ""}">
      <div class="skill-row-aside">
        <span class="quick-index">${isMatched ? "中" : index + 1}</span>
        <button class="quick-copy" type="button" data-copy="${escapeAttr(content)}" title="复制 skill" aria-label="复制 skill"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>
      </div>
      <div class="skill-row-main">
        <div class="skill-row-head">
          <div class="skill-row-title">
            <div class="skill-row-titleline">
              <strong>${escapeHtml(skill.title || "未命名 skill")}</strong>
              <em>${escapeHtml(status)}</em>
            </div>
            ${metaTags.length ? `<div class="skill-meta-tags">${metaTags.map((item) => `<span class="skill-meta-tag">${escapeHtml(item)}</span>`).join("")}</div>` : ""}
          </div>
          <div class="skill-row-actions">
            <button class="mini-action" type="button" data-skill-apply="${escapeAttr(skill.id)}" ${skill.noReply || state.sendingMessage ? "disabled" : ""}>采用</button>
            <button class="mini-action" type="button" data-skill-send="${escapeAttr(skill.id)}" ${skill.noReply || state.sendingMessage ? "disabled" : ""}>发送</button>
            <button class="mini-action" type="button" data-skill-optimize="${escapeAttr(skill.id)}" ${skill.noReply || state.sendingMessage ? "disabled" : ""}>优化</button>
            <button class="mini-action ghost" type="button" data-skill-reset-learning="${escapeAttr(skill.id)}">恢复</button>
          </div>
        </div>
        <p class="skill-row-preview">${escapeHtml(content || "暂无话术")}</p>
        ${renderSkillImageStrip(replyProfile)}
        <div class="skill-row-foot">
          <div class="skill-row-hints">
            ${footChips.length ? `<div class="skill-hint-chips">${footChips.map((item) => `<span class="skill-foot-chip">${escapeHtml(item)}</span>`).join("")}</div>` : ""}
            <small class="skill-learning-state">${escapeHtml(learningState)}</small>
            ${keywordLine ? `<small class="skill-keywords">${escapeHtml(keywordLine)}</small>` : ""}
            ${learningNote ? `<small class="skill-learning-note">${escapeHtml(learningNote)}</small>` : ""}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderHistoryPanel() {
  const totalText = state.historyTotal ? `共 ${state.historyTotal} 条` : "";
  const sourceText = state.activeContact?.conversationId ? "会话分页记录" : "联系人历史记录";
  return `
    <section class="tool-section history-section">
      <h3><span>聊天记录</span><button class="mini-action" type="button" data-action="refresh-history">刷新</button></h3>
      <div class="history-summary">
        <span>${escapeHtml(sourceText)}</span>
        <span>${escapeHtml(totalText)}</span>
      </div>
      <div class="history-chat-list" data-history-list>
        <div class="message-load-row history-load-row">
          <button class="mini-action" type="button" data-action="more-history" ${state.historyHasMore && !state.historyLoading ? "" : "disabled"}>${state.historyLoading ? "加载中..." : state.historyHasMore ? "加载更多" : "没有更多"}</button>
        </div>
        ${state.historyMessages.length ? state.historyMessages.map((message) => renderMessageBubble(message, { compact: true })).join("") : '<p class="empty-state">当前会话暂无聊天记录。</p>'}
      </div>
    </section>
  `;
}

function bindHistoryAutoLoad() {
  const list = el.toolContent.querySelector("[data-history-list]");
  if (!list || list.dataset.boundHistoryScroll) return;
  list.dataset.boundHistoryScroll = "true";
  list.addEventListener("scroll", () => {
    if (list.scrollTop > 40) return;
    triggerHistoryAutoLoad();
  });
  list.addEventListener("wheel", (event) => {
    if (event.deltaY >= 0 || list.scrollTop > 2) return;
    triggerHistoryAutoLoad();
  });
}

function kv(label, value, copyable = false) {
  const display = value === undefined || value === null || value === "" ? "-" : value;
  return `
    <div class="kv-row">
      <span>${escapeHtml(label)}</span>
      <span class="kv-value">${copyable ? copyButton(display) : escapeHtml(display)}</span>
    </div>
  `;
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function cleanDisplayText(value) {
  if (value === undefined || value === null) return "";
  const text = String(value).trim();
  if (!text) return "";
  const lowered = text.toLowerCase();
  if (lowered === "null" || lowered === "undefined" || lowered === "nan") return "";
  return text;
}

function firstDisplayValue(...values) {
  for (const value of values) {
    const text = cleanDisplayText(value);
    if (text) return text;
  }
  return "";
}

function isSameDisplayText(left, right) {
  const leftText = cleanDisplayText(left);
  const rightText = cleanDisplayText(right);
  return Boolean(leftText && rightText && leftText === rightText);
}

function unwrapPayloadData(payload) {
  let value = payload;
  const seen = new Set();
  while (value && typeof value === "object" && !Array.isArray(value) && !seen.has(value)) {
    seen.add(value);
    if (value.data !== undefined && Object.keys(value).some((key) => ["success", "message", "msg", "code", "status"].includes(key))) {
      value = value.data;
      continue;
    }
    break;
  }
  return value;
}

function findFirstArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return null;
  const direct = [value.records, value.rows, value.list, value.items, value.data, value.result].find(Array.isArray);
  if (direct) return direct;
  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) return nested;
    if (nested && typeof nested === "object") {
      const found = findFirstArray(nested);
      if (found) return found;
    }
  }
  return null;
}

function getRecordsDeep(payload) {
  return findFirstArray(unwrapPayloadData(payload)) || [];
}

function toNumber(value, fallback = 0) {
  if (value && typeof value === "object" && "value" in value) return toNumber(value.value, fallback);
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getTotalDeep(payload) {
  const candidates = [];
  let cursor = payload;
  const seen = new Set();
  while (cursor && typeof cursor === "object" && !Array.isArray(cursor) && !seen.has(cursor)) {
    seen.add(cursor);
    candidates.push(cursor.total, cursor.count, cursor.totalCount, cursor.totalNum, cursor.allCount);
    cursor = cursor.data !== undefined ? cursor.data : cursor.result;
  }
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== "") return toNumber(candidate);
  }
  return getRecordsDeep(payload).length;
}

function renderNoticeFilterField(id, label, value, placeholder) {
  return `
    <label class="modal-field">
      <span>${escapeHtml(label)}</span>
      <input id="${escapeAttr(id)}" value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder)}" />
    </label>
  `;
}

function normalizeNoticeEvents(events = []) {
  return (events || []).map((item, index) => {
    if (item === null || item === undefined || item === "") return null;
    if (typeof item !== "object") {
      return { value: String(item), label: String(item) };
    }
    const value = firstValue(item.value, item.key, item.id, item.eventType, item.warnEvent, item.code, index);
    const label = firstValue(item.label, item.name, item.title, item.eventName, item.warnEventStr, item.text, value);
    return { value: String(value), label: String(label) };
  }).filter(Boolean);
}

function uniqueNumbers(values = []) {
  return [...new Set(values.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value >= 0))];
}

function estimateNoticeUnread(payload, records = []) {
  const unread = firstValue(
    payload?.unread,
    payload?.unreadCount,
    payload?.data?.unread,
    payload?.data?.unreadCount,
    payload?.data?.totalUnread,
    payload?.data?.total?.unread
  );
  if (unread !== undefined) return toNumber(unread);
  const currentUnread = records.filter((item) => !item.consumed).length;
  if (currentUnread) return currentUnread;
  return getTotalDeep(payload);
}

function clonePlainObject(value) {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch {
    return {};
  }
}

function toPascalCase(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function castLike(value, reference) {
  if (typeof reference === "boolean") return value === true || value === "true";
  if (typeof reference === "number") {
    const number = Number(value);
    return Number.isNaN(number) ? reference : number;
  }
  if (reference === null && value === "") return null;
  return value;
}

function splitListValue(value) {
  return String(value || "")
    .split(/[\s,，;；]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateTimeLocal(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toDateInputValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function fromDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function formatFullTime(value) {
  if (!value) return "";
  let date;
  if (typeof value === "number") {
    date = new Date(value < 100000000000 ? value * 1000 : value);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function humanizeKey(key) {
  const text = String(key || "");
  const zh = {
    userCount: "用户总数",
    messageCount: "消息数",
    robotCount: "机器人数",
    replyCount: "回复数"
  };
  if (zh[text]) return zh[text];
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatStatValue(value) {
  const number = Number(value);
  if (!Number.isNaN(number)) return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/\.?0+$/, "");
  return String(value ?? "-");
}

function contentTypeName(value) {
  const map = {
    0: "文本",
    1: "图片",
    2: "语音",
    3: "视频",
    4: "动图",
    5: "链接",
    6: "小程序",
    7: "文件"
  };
  return value === undefined || value === null || value === "" ? "" : (map[value] || String(value));
}

function messageDirectionName(item = {}) {
  const outgoing = Boolean(item.isSend || item.isSelf || item.isCustomerService || item.direction === "outgoing");
  return outgoing ? "客服回复" : "用户消息";
}

function renderSearchContent(text) {
  const value = String(text || "");
  if (!value) return "-";
  return linkifyMessageText(value);
}

function mergeUserInfo(contact, info) {
  return {
    ...(contact || {}),
    ...(info || {}),
    userNick: info?.nickName || contact?.userNick || contact?.nickName,
    userName: info?.userName || contact?.userName,
    userRemark: info?.remark || info?.userRemark || contact?.userRemark
  };
}

function formatTags(value) {
  if (!value) return "-";
  if (Array.isArray(value)) return value.length ? value.join("、") : "-";
  if (typeof value === "string") return value || "-";
  return JSON.stringify(value);
}

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return number.toFixed(2).replace(/\.00$/, "");
}

function robotTypeName(value) {
  const map = {
    0: "微信PC版",
    1: "微信手机版",
    2: "企微PC版",
    6: "公众号",
    9: "企微手机版"
  };
  return map[value] || (value === undefined || value === null ? "-" : String(value));
}

function orderTypeLabel(value) {
  return ORDER_TYPES.find((item) => Number(item.value) === Number(value))?.label || String(value ?? "-");
}

function orderDeviceLabel(value) {
  return ORDER_DEVICE_TYPES.find((item) => Number(item.value) === Number(value))?.label || String(value ?? "-");
}

function copyButton(value, className = "") {
  const text = String(value ?? "-");
  const extraClass = className ? ` ${escapeAttr(className)}` : "";
  return `<button class="copy-value${extraClass}" type="button" data-copy="${escapeAttr(text)}" title="点击复制">${escapeHtml(text)}<i class="native-icon bfi-copy" aria-hidden="true"></i></button>`;
}

function copyMoney(value, className = "money-hot") {
  return copyButton(formatCurrency(value), className);
}

function formatCurrency(value) {
  const formatted = formatMoney(value);
  return formatted === "-" ? "-" : `￥${formatted}`;
}

function formatRate(value) {
  if (value === undefined || value === null || value === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return `${value}%`;
  return `${number.toFixed(2).replace(/\.?0+$/, "")}%`;
}

function renderOrderFilters() {
  return `
    <div class="order-filters">
      <div class="order-device-tabs" role="group" aria-label="订单接入端">
        ${ORDER_DEVICE_TYPES.map((item) => `
          <button class="${Number(state.orderDeviceType) === item.value ? "is-active" : ""}" type="button" data-order-device="${item.value}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
      <label class="rebate-toggle">
        <span>隐藏返利信息</span>
        <input type="checkbox" data-action="toggle-rebate" ${state.hideRebate ? "checked" : ""} />
      </label>
      <div class="order-type-grid" role="group" aria-label="订单平台">
        ${ORDER_TYPES.map((item) => `
          <button class="${Number(state.orderType) === item.value ? "is-active" : ""}" type="button" data-order-type="${item.value}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="order-search">
        <input data-order-keyword value="${escapeAttr(state.orderKeyword)}" placeholder="请输入订单编号" />
        <button type="button" class="icon-search-button" data-action="search-order" title="搜索订单" aria-label="搜索订单"><i class="native-icon bfi-search" aria-hidden="true"></i></button>
      </div>
    </div>
  `;
}

function renderOrders() {
  const totalText = state.orderTotal ? `共 ${state.orderTotal} 条` : "无订单";
  if (!state.orders.length) {
    return `
      <div class="order-summary">
        <span>${escapeHtml(orderDeviceLabel(state.orderDeviceType))} / ${escapeHtml(orderTypeLabel(state.orderType))}</span>
        <span>${escapeHtml(totalText)}</span>
      </div>
      <div class="tool-section-body">
        <p class="empty-state">当前筛选没有返回订单数据。</p>
      </div>
    `;
  }

  return `
    <div class="order-summary">
      <span>${escapeHtml(orderDeviceLabel(state.orderDeviceType))} / ${escapeHtml(orderTypeLabel(state.orderType))}</span>
      <span>${escapeHtml(totalText)}</span>
    </div>
    <div class="order-list">
      ${state.orders.map(renderOrderCard).join("")}
    </div>
    <div class="pager-row">
      <button class="mini-action" type="button" data-action="prev-orders" ${state.orderPage <= 1 ? "disabled" : ""}>上一页</button>
      <span>第 ${state.orderPage} 页</span>
      <button class="mini-action" type="button" data-action="next-orders" ${hasNextOrderPage() ? "" : "disabled"}>下一页</button>
    </div>
  `;
}

function hasNextOrderPage() {
  return state.orders.length >= 10 && (!state.orderTotal || state.orderPage * 10 < state.orderTotal);
}

function renderOrderCard(order) {
  const title = order.title || "接口未返回商品标题";
  return `
    <article class="order-card">
      <div class="order-row">
        ${order.imageUrl ? `<img class="order-image" src="${escapeAttr(getDisplayMediaUrl(order.imageUrl))}" alt="">` : `<span class="order-image order-image-fallback">${escapeHtml(order.platformName.slice(0, 1))}</span>`}
        <div class="order-main">
          <h4 title="${escapeAttr(title)}">${escapeHtml(title)}</h4>
          <p class="order-pay">付款金额：${copyMoney(order.amount, "money-pay")}</p>
          <div class="order-fields">
            <span>订单编号：</span>${copyButton(order.orderNo, "order-link")}
            <span>订单状态：</span><span>${escapeHtml(order.status)}</span>
            <span>创建时间：</span><span>${escapeHtml(order.createdAt || "-")}</span>
            <span>付款时间：</span><span>${escapeHtml(order.paidAt || "-")}</span>
          </div>
          ${state.hideRebate ? "" : `
            <div class="rebate-info">
              <span>收入：${copyMoney(order.income, "money-pay")}</span>
              <span>提成：${copyButton(formatRate(order.commissionRate), "money-pay")}</span>
              <span>买家：${copyMoney(order.buyerRebate, "money-pay")}</span>
              <span>利润：${copyMoney(order.profit, "money-profit")}</span>
            </div>
          `}
        </div>
      </div>
    </article>
  `;
}

function renderAccountDetails() {
  if (!state.accountDetails.length) {
    return '<div class="tool-section-body"><p class="empty-state">当前用户没有返回账户流水。</p></div>';
  }

  const totalText = state.accountDetailTotal ? `共 ${state.accountDetailTotal} 条` : "";
  return `
    <div class="detail-summary">
      <span>${escapeHtml(getContactUserName(state.activeContact) || "")}</span>
      <span>${escapeHtml(totalText)}</span>
    </div>
    <div class="detail-table-wrap">
      <table class="detail-table">
        <thead>
          <tr>
            <th>余额</th>
            <th>积分</th>
            <th>明细类型</th>
            <th>日期</th>
          </tr>
        </thead>
        <tbody>
          ${state.accountDetails.map((row) => `
            <tr>
              <td>${copyButton(formatMoney(row.balance))}</td>
              <td>${copyButton(row.integral)}</td>
              <td>${copyButton(row.typeName)}</td>
              <td>${copyButton(row.date)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <div class="pager-row">
      <button class="mini-action" type="button" data-action="prev-details" ${state.accountDetailPage <= 1 ? "disabled" : ""}>上一页</button>
      <span>第 ${state.accountDetailPage} 页</span>
      <button class="mini-action" type="button" data-action="next-details" ${state.accountDetails.length < 20 ? "disabled" : ""}>下一页</button>
    </div>
  `;
}

function handleToolClick(event) {
  if (handlePreviewClickTarget(event)) return;

  const quickSendTarget = event.target.closest("[data-quick-send]");
  if (quickSendTarget) {
    setReplyTextContent(escapeHtml(quickSendTarget.dataset.quickSend || ""));
    sendText();
    return;
  }

  const quickFillTarget = event.target.closest("[data-quick-fill]");
  if (quickFillTarget) {
    setReplyTextContent(escapeHtml(quickFillTarget.dataset.quickFill || ""));
    el.replyText.focus();
    return;
  }

  const skillApplyTarget = event.target.closest("[data-skill-apply]");
  if (skillApplyTarget) {
    applySkillById(skillApplyTarget.dataset.skillApply);
    return;
  }

  const skillSendTarget = event.target.closest("[data-skill-send]");
  if (skillSendTarget) {
    sendSkillById(skillSendTarget.dataset.skillSend);
    return;
  }

  const skillOptimizeTarget = event.target.closest("[data-skill-optimize]");
  if (skillOptimizeTarget) {
    optimizeSkillById(skillOptimizeTarget.dataset.skillOptimize);
    return;
  }

  const skillResetLearningTarget = event.target.closest("[data-skill-reset-learning]");
  if (skillResetLearningTarget) {
    resetSkillLearningById(skillResetLearningTarget.dataset.skillResetLearning);
    return;
  }

  const faqCategoryTarget = event.target.closest("[data-faq-category]");
  if (faqCategoryTarget) {
    updateFaqKeyword();
    state.faqCategory = faqCategoryTarget.dataset.faqCategory;
    state.faqPage = 1;
    loadFaq();
    return;
  }

  const skillCategoryTarget = event.target.closest("[data-skill-category]");
  if (skillCategoryTarget) {
    state.skillCategory = skillCategoryTarget.dataset.skillCategory || SKILL_CATEGORY_CURRENT;
    renderToolContent();
    return;
  }

  const deviceTarget = event.target.closest("[data-order-device]");
  if (deviceTarget) {
    updateOrderKeyword();
    state.orderDeviceType = Number(deviceTarget.dataset.orderDevice);
    loadOrders(1);
    return;
  }

  const typeTarget = event.target.closest("[data-order-type]");
  if (typeTarget) {
    updateOrderKeyword();
    state.orderType = Number(typeTarget.dataset.orderType);
    loadOrders(1);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  if (action === "refresh-user") {
    loadContactInfo();
  } else if (action === "refresh-faq") {
    updateFaqKeyword();
    loadFaq();
  } else if (action === "search-faq") {
    updateFaqKeyword();
    state.faqPage = 1;
    loadFaq();
  } else if (action === "refresh-order") {
    updateOrderKeyword();
    loadOrders(state.orderPage);
  } else if (action === "search-order") {
    updateOrderKeyword();
    loadOrders(1);
  } else if (action === "toggle-rebate") {
    state.hideRebate = actionTarget.checked;
    renderToolContent();
  } else if (action === "refresh-details") {
    loadAccountDetails(state.accountDetailPage);
  } else if (action === "prev-orders") {
    loadOrders(Math.max(1, state.orderPage - 1));
  } else if (action === "next-orders") {
    if (hasNextOrderPage()) loadOrders(state.orderPage + 1);
  } else if (action === "prev-details") {
    loadAccountDetails(Math.max(1, state.accountDetailPage - 1));
  } else if (action === "next-details") {
    loadAccountDetails(state.accountDetailPage + 1);
  } else if (action === "refresh-history") {
    loadHistoryMessages(1, "replace", { keepPosition: true });
  } else if (action === "more-history") {
    if (state.historyHasMore) loadHistoryMessages(state.historyPage + 1, "append");
  } else if (action === "refresh-skills") {
    loadReplySkills();
  } else if (action === "trim-skill-learning") {
    trimSkillLearningNoise();
  } else if (action === "search-skills") {
    updateSkillKeyword();
    renderToolContent();
  } else if (action === "toggle-skill-auto") {
    state.skillAutoReply = actionTarget.checked;
    localStorage.setItem("youchat.skill.autoReply", String(state.skillAutoReply));
    renderToolContent();
  } else if (action === "toggle-skill-learn") {
    state.skillAutoLearn = actionTarget.checked;
    localStorage.setItem("youchat.skill.autoLearn", String(state.skillAutoLearn));
    renderToolContent();
  } else if (action === "apply-skill-match") {
    const suggestion = buildSkillSuggestion();
    if (suggestion) {
      appendAiSuggestion(suggestion);
      useAiSuggestion();
    }
  } else if (action === "send-skill-match") {
    const suggestion = buildSkillSuggestion();
    if (suggestion) sendSuggestionSteps(suggestion);
  } else if (action === "optimize-skill-match") {
    const suggestion = buildSkillSuggestion();
    if (suggestion?.skillId) optimizeSkillById(suggestion.skillId);
  }
}

function handleToolKeydown(event) {
  if (event.key !== "Enter") return;
  if (event.target.matches("[data-order-keyword]")) {
    updateOrderKeyword();
    loadOrders(1);
  }
  if (event.target.matches("[data-faq-keyword]")) {
    updateFaqKeyword();
    state.faqPage = 1;
    loadFaq();
  }
  if (event.target.matches("[data-skill-keyword]")) {
    updateSkillKeyword();
    renderToolContent();
  }
}

function updateOrderKeyword() {
  const input = el.toolContent.querySelector("[data-order-keyword]");
  state.orderKeyword = input?.value.trim() || "";
}

function updateFaqKeyword() {
  const input = el.toolContent.querySelector("[data-faq-keyword]");
  state.faqKeyword = input?.value.trim() || "";
}

function updateSkillKeyword() {
  const input = el.toolContent.querySelector("[data-skill-keyword]");
  state.skillKeyword = input?.value.trim() || "";
}

function getSkillById(id) {
  return state.replySkills.find((skill) => String(skill.id) === String(id));
}

async function replaceReplySkill(nextSkill) {
  const id = String(nextSkill?.id || "");
  if (!id) throw new Error("缺少 skill id");
  const index = state.replySkills.findIndex((skill) => String(skill.id) === id);
  if (index < 0) throw new Error("没有找到要更新的 skill");
  const merged = {
    ...state.replySkills[index],
    ...nextSkill,
    updatedAt: new Date().toISOString()
  };
  state.replySkills = [
    ...state.replySkills.slice(0, index),
    merged,
    ...state.replySkills.slice(index + 1)
  ];
  await saveReplySkills();
  return getSkillById(id) || merged;
}

function normalizeSkillReplySteps(steps = []) {
  const textSteps = [];
  const imageSteps = [];
  const seenImages = new Set();
  steps.forEach((step) => {
    if (!step) return;
    if (step.type === "image") {
      const url = normalizeImageUrl(step.url || step.content || "");
      if (!url || seenImages.has(url)) return;
      seenImages.add(url);
      imageSteps.push({
        type: "image",
        url,
        label: step.label || "skill 图片"
      });
      return;
    }
    const content = String(step.content || "").trim();
    if (!content) return;
    textSteps.push({ type: "text", content });
  });
  return [...textSteps, ...imageSteps].slice(0, 8);
}

function mergeTextWithExistingSkillImages(textSteps, skill, options = {}) {
  const normalizedSteps = normalizeSkillReplySteps(textSteps);
  if (options.replaceImages) return normalizedSteps;
  const hasExplicitImages = normalizedSteps.some((step) => step.type === "image");
  if (hasExplicitImages) return normalizedSteps;
  const baseImageSteps = getSkillSteps(skill).filter((step) => step.type === "image");
  return normalizeSkillReplySteps([...normalizedSteps, ...baseImageSteps]);
}

async function updateSkillFromSuggestion(suggestion) {
  const skill = getSkillById(suggestion?.skillId);
  if (!skill) {
    toast("没有找到要更新的 skill。", true);
    return;
  }
  if (skill.noReply) {
    toast("无需回复类 skill 不需要更新话术。", true);
    return;
  }
  const text = getSuggestionTextForComposer(suggestion).trim();
  if (!text) {
    toast("优化候选为空，不能更新 skill。", true);
    return;
  }

  try {
    const imageSteps = await uploadDraftImagesForSkill();
    await replaceReplySkill({
      ...skill,
      replySteps: mergeTextWithExistingSkillImages([
        { type: "text", content: text },
        ...imageSteps
      ], skill, { replaceImages: true }),
      fallback: text,
      revisionCount: Number(skill.revisionCount || 0) + 1,
      lastOptimizedAt: new Date().toISOString()
    });
    state.lastSuggestionUsed = true;
    if (state.activeTool === "skill") renderToolContent();
    toast(imageSteps.length ? `已把优化后的话术和 ${imageSteps.length} 张图片更新到当前 skill。` : "已把优化后的话术更新到当前 skill。");
  } catch (error) {
    toast(`更新 skill 失败：${error.message}`, true);
  }
}

async function resetSkillLearningById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  if (!Array.isArray(skill.manualOverrides) || !skill.manualOverrides.length) {
    toast("这个 skill 目前没有学习覆盖。");
    return;
  }
  try {
    await replaceReplySkill({
      ...skill,
      manualOverrides: [],
      lastManualOverrideAt: null
    });
    if (state.activeTool === "skill") renderToolContent();
    toast("已恢复为 skill 基线话术。");
  } catch (error) {
    toast(`恢复 skill 失败：${error.message}`, true);
  }
}

async function trimSkillLearningNoise() {
  const dirtySkills = state.replySkills.filter((skill) => Array.isArray(skill.manualOverrides) && skill.manualOverrides.some((item) => isSkillOverrideNoisy(item)));
  if (!dirtySkills.length) {
    toast("当前没有识别到明显的学习噪音。");
    return;
  }
  try {
    for (const skill of dirtySkills) {
      const nextOverrides = (skill.manualOverrides || []).filter((item) => !isSkillOverrideNoisy(item));
      await replaceReplySkill({
        ...skill,
        manualOverrides: nextOverrides
      });
    }
    if (state.activeTool === "skill") renderToolContent();
    toast(`已清理 ${dirtySkills.length} 个 skill 的异常学习记录。`);
  } catch (error) {
    toast(`清理学习记录失败：${error.message}`, true);
  }
}

function isSkillOverrideNoisy(override) {
  const reply = String(override?.reply || "").trim();
  const imageCount = Array.isArray(override?.imageUrls) ? override.imageUrls.filter(Boolean).length : 0;
  if (imageCount > 0 && reply.length <= 2) return true;
  if (reply.length > 260) return true;
  if (/https?:\/\/\S+/i.test(reply) && reply.length > 120) return true;
  return false;
}

function applySkillById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  const contextText = getCurrentSkillContextText();
  const replyProfile = getSkillReplyProfile(skill, {
    prompt: contextText,
    contextText,
    preferLearned: true
  });
  appendAiSuggestion({
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    content: replyProfile.text,
    steps: replyProfile.steps,
    learnedFromOverride: replyProfile.usingOverride,
    overrideCount: replyProfile.overrideCount,
    imageCount: replyProfile.imageCount
  });
  useAiSuggestion();
}

function sendSkillById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  const contextText = getCurrentSkillContextText();
  const replyProfile = getSkillReplyProfile(skill, {
    prompt: contextText,
    contextText,
    preferLearned: true
  });
  sendSuggestionSteps({
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    content: replyProfile.text,
    steps: replyProfile.steps,
    learnedFromOverride: replyProfile.usingOverride,
    overrideCount: replyProfile.overrideCount,
    imageCount: replyProfile.imageCount
  });
}

function getCurrentSkillContextText() {
  const latest = getLatestSkillTriggerMessage() || getLatestActionableInboundMessage();
  return latest ? getSkillMatchText(latest) : "";
}

async function optimizeSkillById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  if (skill.noReply) {
    toast("无需回复类 skill 不需要优化发送话术。", true);
    return;
  }
  if (!state.aiEnabled) {
    toast("AI 推荐已关闭，请在右上角 AI 设置中启用。", true);
    return;
  }
  if (!hasUsableAiKey()) {
    showAiSettings();
    toast("请先填写 AI API 密钥。", true);
    return;
  }

  const contextText = getCurrentSkillContextText();
  const skillText = getSkillReplyProfile(skill, {
    prompt: contextText,
    contextText,
    preferLearned: true
  }).text;
  if (!skillText) {
    toast("这条 skill 没有可优化的话术。", true);
    return;
  }

  const draftText = getReplyTextContent().trim() || "";
  const latest = getLatestActionableInboundMessage();
  const imageSummary = state.draftImages.length
    ? `客服准备附带 ${state.draftImages.length} 张图片，图片保持原图发送，只根据图片存在这一事实调整文字。`
    : "客服当前没有草稿图片。";
  const tone = getSuggestionTone(++state.aiSuggestionToneIndex);

  state.aiGenerating = true;
  updateAiButtonState();
  try {
    const replies = await requestAiChatReplies({
      temperature: Math.min(0.95, Number(state.aiTemperature || 0.35) + 0.18),
      systemLines: [
        "你是客服 skill 话术优化助手。根据客服给出的 skill 话术、补充意图、真实聊天上下文和图片数量，输出 1 到 3 条更适合当前会话的中文候选回复。",
        "只优化文字，不处理图片，不把图片内容编造成事实。",
        "不要编造订单、返利、余额、用户编号或后台状态。",
        "如果事实不足，保留核实口径，不要假装已经查到。",
        `本轮语气：${tone.name}。${tone.instruction}`,
        "候选要可直接发给客户，短、清楚、有人工客服感，不要输出分析过程。"
      ],
      userContent: [
        `skill 标题：${skill.title || "未命名 skill"}`,
        `skill 关键词：${(skill.keywords || []).join("、") || "-"}`,
        "",
        "原 skill 话术：",
        skillText,
        "",
        "客服补充意图或准备发送的文字：",
        draftText || "-",
        "",
        imageSummary,
        "",
        `客户最新问题：${latest?.content || "-"}`,
        "",
        "最近上下文：",
        buildRecentConversationBrief(10) || "-",
        "",
        "请输出 1 到 3 条优化后的候选。"
      ].join("\n")
    });
    const fallbackSuggestions = replies.length >= 2 ? replies : buildLocalSuggestionVariants(replies[0] || skillText);
    appendAiSuggestions(fallbackSuggestions.map((reply, index) => ({
      type: "optimize",
      title: `skill 优化${index ? ` ${index + 1}` : ""}`,
      label: `skill 优化 · ${tone.name}`,
      skillId: skill.id,
      content: reply,
      steps: [{ type: "text", content: reply }],
      keepDraftImages: Boolean(state.draftImages.length)
    })).slice(0, 3), { silent: true });
    toast("已按当前输入和图片生成 skill 优化候选。");
  } catch (error) {
    toast(`skill 优化失败：${error.message}`, true);
  } finally {
    state.aiGenerating = false;
    updateAiButtonState();
  }
}

async function copyToClipboard(text) {
  if (!text || text === "-") return;
  try {
    await navigator.clipboard.writeText(text);
    toast(`已复制：${text}`);
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    toast(`已复制：${text}`);
  }
}

async function accessIn() {
  return accessContact(state.activeContact);
}

async function accessContact(contact) {
  const contactId = getContactId(contact);
  if (!contactId) {
    toast("请先选择会话。", true);
    return;
  }
  try {
    await api("/Conversation/AccessIn", {
      contactId,
      accountId: getAccountId(contact)
    });
    toast("已提交人工接入请求。");
    await loadContacts({ preserveScroll: true });
  } catch (error) {
    toast(`人工接入失败：${error.message}`, true);
  }
}

async function accessHistoryContact(contact) {
  const contactId = getContactId(contact);
  if (!contactId) {
    toast("请先选择历史会话。", true);
    return;
  }

  try {
    await api("/Conversation/AccessIn", {
      contactId,
      accountId: getAccountId(contact)
    });
    toast("已接入历史会话，正在切换到当前。");
    state.listTab = "current";
    state.activeContact = { ...contact, isHistory: false, isGuestbook: false };
    resetContactScopedState();
    renderConversationTabs();
    renderMessagesFromContactPreview();
    renderActive();
    await loadContacts({ preserveScroll: false });
    const liveContact = state.contacts.find((item) => String(getContactId(item)) === String(contactId));
    if (liveContact) {
      await selectContactById(contactId);
      return;
    }
    state.contacts = sortContacts([{ ...contact, isHistory: false, isGuestbook: false }, ...state.contacts]);
    state.activeContact = state.contacts.find((item) => String(getContactId(item)) === String(contactId)) || state.activeContact;
    state.totalContacts = Math.max(Number(state.totalContacts || 0), state.contacts.length);
    state.listCounts.current = Math.max(Number(state.listCounts.current || 0), state.totalContacts || state.contacts.length);
    renderConversationTabs();
    renderContacts();
    renderActive();
    await loadMessages(1, "replace", { forceBottom: true });
    loadToolDataForActiveTab().catch((error) => log("tool reload after history access failed", { error: error.message }));
  } catch (error) {
    toast(`历史会话接入失败：${error.message}`, true);
  }
}

async function transferAi() {
  const contactId = getContactId(state.activeContact);
  if (!contactId) {
    toast("请先选择会话。", true);
    return;
  }
  try {
    await api("/Conversation/TransferToAI", { contactId });
    toast("已提交转 AI 请求。");
  } catch (error) {
    toast(`转 AI 失败：${error.message}`, true);
  }
}

function handleContactContextMenu(event) {
  const card = event.target.closest("[data-contact-id]");
  if (!card) return;
  event.preventDefault();
  const contact = state.contacts.find((item) => String(getContactId(item)) === String(card.dataset.contactId));
  if (!contact) return;
  state.contextMenu = {
    contactId: getContactId(contact),
    x: event.clientX,
    y: event.clientY
  };
  renderContextMenu();
}

function renderContextMenu() {
  removeContextMenuNode();
  const contact = state.contacts.find((item) => String(getContactId(item)) === String(state.contextMenu?.contactId));
  if (!contact) return;

  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.style.left = "0px";
  menu.style.top = "0px";
  menu.style.visibility = "hidden";

  const items = getContextMenuItems(contact);
  menu.innerHTML = items.map((item) => `
    <button type="button" data-context-action="${escapeAttr(item.action)}">
      ${escapeHtml(item.label)}
    </button>
  `).join("");

  menu.addEventListener("click", (event) => {
    event.stopPropagation();
    const target = event.target.closest("[data-context-action]");
    if (!target) return;
    handleContactAction(target.dataset.contextAction, contact);
    closeContextMenu();
  });

  document.body.appendChild(menu);
  positionContextMenu(menu);
}

function positionContextMenu(menu) {
  if (!menu || !state.contextMenu) return;
  const edgeGap = 8;
  const pointerGap = 6;
  const minScrollableHeight = 96;
  const viewportBounds = {
    left: edgeGap,
    top: edgeGap,
    right: window.innerWidth - edgeGap,
    bottom: window.innerHeight - edgeGap
  };
  const listRect = el.contactList?.getBoundingClientRect();
  const verticalBounds = listRect
    ? {
        top: Math.max(viewportBounds.top, listRect.top + 4),
        bottom: Math.min(viewportBounds.bottom, listRect.bottom - 4)
      }
    : viewportBounds;
  if (verticalBounds.bottom - verticalBounds.top < minScrollableHeight) {
    verticalBounds.top = viewportBounds.top;
    verticalBounds.bottom = viewportBounds.bottom;
  }

  menu.style.maxHeight = "";
  menu.style.overflowY = "";
  const measuredRect = menu.getBoundingClientRect();
  const menuWidth = Math.ceil(measuredRect.width);
  let menuHeight = Math.ceil(measuredRect.height);
  const x = Number(state.contextMenu.x) || 0;
  const y = Number(state.contextMenu.y) || 0;
  let left = x;
  if (left + menuWidth > viewportBounds.right) left = viewportBounds.right - menuWidth;
  left = Math.max(viewportBounds.left, left);

  const spaceBelow = verticalBounds.bottom - y - pointerGap;
  const spaceAbove = y - verticalBounds.top - pointerGap;
  let top = y + pointerGap;
  let placement = "bottom";

  if (menuHeight > spaceBelow && spaceAbove > spaceBelow) {
    placement = "top";
    top = y - menuHeight - pointerGap;
  }

  const maxAvailableHeight = Math.max(spaceAbove, spaceBelow, minScrollableHeight);
  if (menuHeight > maxAvailableHeight) {
    menuHeight = Math.max(minScrollableHeight, Math.floor(maxAvailableHeight));
    menu.style.maxHeight = `${menuHeight}px`;
    menu.style.overflowY = "auto";
    if (placement === "top") top = y - menuHeight - pointerGap;
  }

  top = Math.min(top, verticalBounds.bottom - menuHeight);
  top = Math.max(verticalBounds.top, top);
  menu.dataset.placement = placement;
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;
  menu.style.visibility = "";
}

function getContextMenuItems(contact) {
  if (contact.isTodo) {
    return [
      { action: "untodo", label: "取消待办" },
      { action: "mute", label: "添加免打扰" }
    ];
  }

  if (state.listTab === "guestbook") {
    return [
      { action: "todo", label: "设为待办" },
      { action: "mute", label: "添加免打扰" },
      { action: "clear-list", label: "清空列表" },
      { action: "access-all", label: "全部接入" }
    ];
  }

  return [
    { action: "todo", label: "设为待办" },
    { action: "release", label: "解除" },
    { action: "release-all", label: "解除全部" },
    { action: "close-ad", label: "关闭（广告）" },
    { action: "close-useless", label: "关闭（无用信息）" },
    { action: "mute", label: "添加免打扰" },
    { action: "clear-list", label: "清空列表" },
    { action: "read-all", label: "全部已读" }
  ];
}

function closeContextMenu() {
  removeContextMenuNode();
  state.contextMenu = null;
}

function removeContextMenuNode() {
  document.querySelectorAll(".context-menu").forEach((node) => node.remove());
}

function handleContactAction(action, contact) {
  if (!contact) return;
  if (action === "access-history") {
    accessHistoryContact(contact);
    return;
  }
  if (action === "access") {
    accessContact(contact);
    return;
  }
  if (action === "read-all") {
    markVisibleContactsRead();
    renderContacts();
    syncAllConsumedMessages()
      .then(() => toast("已同步全部已读。"))
      .catch((error) => {
        log("consume all sync failed", { error: error.message });
        toast(`角标已清除，全部已读同步失败：${error.message}`, true);
      });
    return;
  }
  runContactAction(action, contact);
}

async function runContactAction(action, contact) {
  const contactId = getContactId(contact);

  try {
    if (action === "todo" || action === "untodo") {
      await api("/Contact/SetTodo", { id: contactId });
      state.contacts = sortContacts(state.contacts.map((item) => (
        String(getContactId(item)) === String(contactId) ? { ...item, isTodo: !Boolean(item.isTodo) } : item
      )));
      if (state.activeContact && String(getContactId(state.activeContact)) === String(contactId)) {
        state.activeContact = { ...state.activeContact, isTodo: !Boolean(state.activeContact.isTodo) };
      }
      renderContacts();
      toast(action === "todo" ? "已设为待办。" : "已取消待办。");
      return;
    }

    if (action === "mute") {
      const nextIsNotice = contact?.isNotice ? 0 : 1;
      await api("/Contact/UpdateContactIsNotice", {
        contactId,
        isNotice: nextIsNotice
      });
      state.contacts = state.contacts.map((item) => (
        String(getContactId(item)) === String(contactId) ? { ...item, isNotice: Boolean(nextIsNotice) } : item
      ));
      if (state.activeContact && String(getContactId(state.activeContact)) === String(contactId)) {
        state.activeContact = { ...state.activeContact, isNotice: Boolean(nextIsNotice) };
      }
      renderContacts();
      toast(nextIsNotice ? "已添加免打扰。" : "已解除免打扰。");
      return;
    }

    if (action === "access-all") {
      const accountId = await getBulkAccessAccountId(contact);
      if (!accountId) {
        throw new Error("未识别到有效客服账号，无法执行全部接入");
      }
      await api("/Conversation/AccessInAll", { accountId });
      toast("已提交全部接入请求。");
      await loadContacts({ preserveScroll: true });
      return;
    }

    if (action === "clear-list") {
      await api("/Conversation/ShutDownAll", {
        accountId: state.listTab === "guestbook" ? "" : getContactListAccountId(),
        endType: 1
      });
      toast("已提交清空列表请求。");
      archiveAndClearCurrentList();
      loadContactCounts().catch((error) => log("contact counts failed", { error: error.message }));
      return;
    }

    if (action === "release") {
      await api("/Conversation/UnBound", { contactId });
      removeContactLocally(contactId);
      toast("已解除客服账号绑定。");
      await loadContacts({ preserveScroll: true });
      return;
    }

    if (action === "release-all") {
      await api("/Conversation/UnBoundAll", { accountId: getAccountId(contact) });
      state.contacts = [];
      state.activeContact = null;
      resetContactScopedState();
      renderAll();
      toast("已提交解除全部请求。");
      await loadContacts({ preserveScroll: false });
      return;
    }

    if (action === "close" || action === "close-ad" || action === "close-useless") {
      const endType = action === "close-ad" ? 5 : action === "close-useless" ? 6 : 1;
      await api("/Conversation/ShutDown", {
        contactId,
        accountId: getAccountId(contact),
        endType
      });
      removeContactLocally(contactId);
      if (action === "close-useless") {
        syncConsumedMessages(contact).catch((error) => log("close consume sync failed", { contactId, error: error.message }));
      }
      toast(action === "close-ad" ? "已按广告关闭。" : action === "close-useless" ? "已按无用信息关闭。" : "已关闭会话。");
      await loadContacts({ preserveScroll: true });
      return;
    }
  } catch (error) {
    toast(`操作失败：${error.message}`, true);
  }
}

function removeContactLocally(contactId) {
  const removedIndex = state.contacts.findIndex((item) => String(getContactId(item)) === String(contactId));
  state.contacts = state.contacts.filter((item) => String(getContactId(item)) !== String(contactId));
  if (String(getContactId(state.activeContact)) === String(contactId)) {
    state.activeContact = state.contacts[Math.max(0, removedIndex)] || state.contacts[state.contacts.length - 1] || null;
    resetContactScopedState();
    renderMessagesFromContactPreview();
    loadToolDataForActiveTab();
  }
  renderContacts();
  renderActive();
}

function startAutoRefresh() {
  stopAutoRefresh();
  if (state.clientPaused) {
    updateConnectionState(false);
    return;
  }
  refreshTimer = window.setInterval(async () => {
    if (document.hidden) return;
    try {
      await loadContacts({ preserveScroll: true, mode: state.contactListPage > 1 ? "merge" : "replace" });
      await loadMessages(1, "merge");
      if (state.activeTool === "order") await loadOrders(state.orderPage);
      if (state.activeTool === "user") await loadContactInfo();
      if (state.activeTool === "detail") await loadAccountDetails(state.accountDetailPage);
      if (state.activeTool === "history") await loadHistoryMessages(1, "merge");
      await loadFriendRequestBadgeTotals();
      await loadClientNoticeBadge();
    } catch (error) {
      log("auto refresh error", { error: error.message });
    }
  }, 10000);
}

function stopAutoRefresh() {
  if (refreshTimer) window.clearInterval(refreshTimer);
  refreshTimer = null;
}

function formatTime(value) {
  if (!value) return "";
  let date;
  if (typeof value === "number") {
    date = new Date(value < 100000000000 ? value * 1000 : value);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getTimeValue(value) {
  if (!value) return 0;
  if (typeof value === "number") return value < 100000000000 ? value * 1000 : value;
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0 && String(value).length <= 16) {
    return numeric < 100000000000 ? numeric * 1000 : numeric;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDateOnly(value) {
  if (!value) return "";
  let date;
  if (typeof value === "number") {
    date = new Date(value < 100000000000 ? value * 1000 : value);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function formatUnixOrDate(value) {
  if (!value) return "";
  const number = Number(value);
  if (!Number.isNaN(number) && number > 0 && String(value).length <= 13) {
    return new Date(number < 100000000000 ? number * 1000 : number).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return formatTime(value);
}

function normalizeImageUrl(value) {
  const url = String(value || "");
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function isHttpsPage() {
  return typeof window !== "undefined" && window.location?.protocol === "https:";
}

function getDisplayMediaUrl(value) {
  const url = normalizeImageUrl(value).trim();
  if (!url) return "";
  if (/^(data:|blob:)/i.test(url)) return url;
  if (/^https:\/\//i.test(url)) return url;
  if (/^http:\/\//i.test(url)) {
    return isHttpsPage() ? `/local/media-proxy?url=${encodeURIComponent(url)}` : url;
  }
  if (/^(\/(?!\/)|\.{1,2}\/)/.test(url)) {
    try {
      return new URL(url, window.location.href).toString();
    } catch {
      return "";
    }
  }
  return url;
}

function canEmbedInHttps(value) {
  const url = String(value || "").trim();
  return !isHttpsPage() || !/^http:\/\//i.test(url);
}

function getPreviewFrameUrl(value) {
  const url = normalizeLinkUrl(value);
  return canEmbedInHttps(url) ? url : "";
}

function normalizePreviewImageUrl(value) {
  const url = getDisplayMediaUrl(value).trim();
  if (/^https?:\/\//i.test(url) || /^blob:/i.test(url) || /^data:image\//i.test(url)) return url;
  if (/^\/local\/media-proxy\?/i.test(url)) return url;
  if (/^(\/(?!\/)|\.{1,2}\/)/.test(url)) {
    try {
      return new URL(url, window.location.href).toString();
    } catch {
      return "";
    }
  }
  return "";
}

function isImageUrl(value) {
  return /^https?:\/\/.+\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(String(value || "")) || String(value || "").startsWith("//");
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function log(title, payload) {
  const line = `[${new Date().toLocaleTimeString()}] ${title}\n${JSON.stringify(payload, null, 2)}`;
  state.logLines.unshift(line);
  state.logLines = state.logLines.slice(0, 20);
}

function toast(message, danger = false) {
  const node = document.createElement("div");
  node.className = `toast${danger ? " error" : ""}`;
  node.textContent = message;
  // 错误用 assertive(role=alert) 让读屏软件立即播报；错误停留更久，且点击可提前关闭
  node.setAttribute("role", danger ? "alert" : "status");
  node.title = "点击关闭";
  node.style.cursor = "pointer";
  node.addEventListener("click", () => node.remove());
  el.toastHost.appendChild(node);
  setTimeout(() => node.remove(), danger ? 6000 : 3600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

document.addEventListener("DOMContentLoaded", boot);

function getLearnedSkillPromptContext() {
  const currentMatch = buildSkillSuggestion();
  const ranked = [...state.replySkills]
    .filter((skill) => skill.enabled !== false && !skill.noReply)
    .sort((a, b) => buildSkillGroupScore(b, currentMatch) - buildSkillGroupScore(a, currentMatch))
    .slice(0, 6);
  if (!ranked.length) return "none";
  return ranked.map((skill) => {
    const overrides = Array.isArray(skill.manualOverrides) ? skill.manualOverrides.slice(0, 2) : [];
    const learnedText = overrides
      .map((item) => String(item.reply || "").trim())
      .filter(Boolean)
      .join(" / ");
    return `- ${skill.title}: ${learnedText || getSkillText(skill).slice(0, 160)}`;
  }).join("\n");
}

function buildAiConversationContextWithReferences(context, skillSuggestion = null) {
  return [
    context,
    "",
    skillSuggestion && !skillSuggestion.noReply
      ? `Matched skill: ${(skillSuggestion.title || "skill")} | ${formatSuggestionText(skillSuggestion)}`
      : "Matched skill: none",
    "",
    "Learned manual reply patterns:",
    getLearnedSkillPromptContext(),
    "",
    "Quick reply references:",
    getFaqPromptContext()
  ].join("\n");
}

function mergeAiSuggestions(skillSuggestion, aiReplies = []) {
  const merged = [];
  const seen = new Set();
  const push = (suggestion) => {
    if (!suggestion) return;
    const normalized = normalizeSuggestion(suggestion);
    const key = buildSuggestionFingerprint(normalized)
      || normalizeForMatch(getSuggestionTextForComposer(normalized) || formatSuggestionText(normalized));
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(normalized);
  };

  if (skillSuggestion && !skillSuggestion.noReply) push(skillSuggestion);

  state.faqs.slice(0, 2).forEach((faq, index) => {
    const normalizedFaq = normalizeFaq(faq, index);
    const content = String(normalizedFaq?.content || "").trim();
    if (!content) return;
    push({
      type: "quick",
      title: normalizedFaq.title || "Quick Reply",
      content,
      steps: [{ type: "text", content }]
    });
  });

  aiReplies.forEach((reply, index) => {
    const text = String(reply || "").trim();
    if (!text) return;
    push({
      type: "ai",
      title: index === 0 ? "AI Suggestion" : `AI Suggestion ${index + 1}`,
      content: text,
      steps: [{ type: "text", content: text }]
    });
  });

  return merged.slice(0, 3);
}

async function requestAiRelaySuggestions(options = {}) {
  const silent = Boolean(options.silent);
  if (!state.aiEnabled) {
    if (!silent) toast("AI recommendation is disabled.", true);
    return;
  }
  if (!hasUsableAiKey()) {
    if (!silent) {
      showAiSettings();
      toast("Please fill in the AI API key first.", true);
    }
    return;
  }
  if (options.expectedKey && !isCurrentAutoSuggestionKey(options.expectedKey)) return;

  const context = buildAiConversationContext();
  if (!context) {
    if (!silent) toast("No real chat context is available for AI suggestions.", true);
    return;
  }
  if (options.expectedKey && !isCurrentAutoSuggestionKey(options.expectedKey)) return;

  const skillSuggestion = buildSkillSuggestion();
  state.aiGenerating = true;
  updateAiButtonState();

  try {
    const payload = {
      ...getAiRelayBasePayload(),
      messages: [
        {
          role: "system",
          content: [
            "You are a customer-service reply assistant.",
            "Use the real conversation, matched skill, quick replies, and learned manual reply patterns together.",
            "Generate 1 to 3 short Chinese replies that can be sent directly.",
            "Do not invent order facts, rebates, balances, user ids, or backend states.",
            `If the issue truly cannot be resolved, you may guide the customer to send 客服 or open ${ONLINE_SERVICE_URL}.`,
            "Prefer JSON array output such as [\"reply 1\", \"reply 2\", \"reply 3\"]."
          ].join("\n")
        },
        {
          role: "user",
          content: buildAiConversationContextWithReferences(context, skillSuggestion)
        }
      ]
    };

    const started = Date.now();
    const response = await fetch("/ai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    const parsed = parsePayload(text);

    log("AI relay chat/completions", {
      status: response.status,
      ms: Date.now() - started,
      baseUrl: state.aiBaseUrl,
      model: state.aiModel,
      response: summarize(maskAiPayload(parsed))
    });

    if (!response.ok) throw new Error(getMessage(parsed) || `HTTP ${response.status}`);

    const suggestions = extractAiReplies(parsed);
    if (!suggestions.length) throw new Error("AI did not return suggestion content");
    if (options.expectedKey && !isCurrentAutoSuggestionKey(options.expectedKey)) return;
    const fallbackSuggestions = suggestions.length >= 2 ? suggestions : buildLocalSuggestionVariants(suggestions[0]);
    appendAiSuggestions(mergeAiSuggestions(skillSuggestion, fallbackSuggestions), { silent });
  } catch (error) {
    if (skillSuggestion && (!options.expectedKey || isCurrentAutoSuggestionKey(options.expectedKey))) appendAiSuggestions([skillSuggestion], { silent: true });
    if (silent) {
      log("auto ai suggestion failed", { error: error.message, source: options.source || "" });
    } else {
      toast(`AI suggestion failed: ${error.message}`, true);
    }
  } finally {
    state.aiGenerating = false;
    updateAiButtonState();
  }
}

async function generateAutoAiSuggestion(expectedKey, options = {}) {
  const latest = getLatestAutoSuggestionMessage();
  const key = buildAutoSuggestionKey(latest);
  if (!key || key !== expectedKey) return;
  if (key === state.lastAutoAiSuggestionKey || key === state.aiAutoSuggestInFlightKey) return;
  if (state.aiGenerating) return;

  state.aiAutoSuggestInFlightKey = key;
  try {
    const skillSuggestion = await maybeBuildSkillSuggestion({ autoReply: true, expectedKey: key });
    if (!isCurrentAutoSuggestionKey(key)) return;
    await requestAiRelaySuggestions({ silent: true, source: options.source || "auto", expectedKey: key });
    if (!isCurrentAutoSuggestionKey(key)) return;
    state.lastAutoAiSuggestionKey = key;
    if (skillSuggestion && !state.aiSuggestion) appendAiSuggestion(skillSuggestion);
  } finally {
    if (state.aiAutoSuggestInFlightKey === key) state.aiAutoSuggestInFlightKey = "";
  }
}

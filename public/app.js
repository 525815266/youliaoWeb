const DEFAULT_API_BASE = "http://192.168.9.83:18080/api";
const LEGACY_DEFAULT_API_BASES = new Set([
  "https://im.52youzai.com/api",
  "http://127.0.0.1:8080/api",
  "http://localhost:8080/api"
]);
const DEFAULT_AI_BASE_URL = "https://sub2.sn55.cn/";
const DEFAULT_AI_API_KEY = "sk-b9d9c696d71c86d875a0379dcbc0eca8e5863884022405bb031d95341951485b";
const DEFAULT_AI_MODEL = "gpt-5.4-mini";
const DEFAULT_AI_TEMPERATURE = 0.35;
const AI_PRESETS = {
  sub2: {
    label: "sub2 中转",
    baseUrl: DEFAULT_AI_BASE_URL,
    model: DEFAULT_AI_MODEL
  },
  deepseek: {
    label: "DeepSeek 官方",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash"
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

const MESSAGE_PAGE_SIZE = 30;
const HISTORY_PAGE_SIZE = 20;
const DETAIL_PAGE_SIZE = 20;
const READ_STATE_STORAGE_KEY = "youchat.readContactState";
const CLEARED_CONTACTS_STORAGE_KEY = "youchat.clearedContactState";
const CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY = "youchat.contactListAccountIds";
const CLIENT_PAUSED_STORAGE_KEY = "youchat.client.paused";
const CLEAR_LIST_GRACE_MS = 30000;
const CONTACT_LIST_ACCOUNT_ID_PATTERN = /^[1-9]\d{0,9}$/;
const GLOBAL_SEARCH_PAGE_SIZE = 20;
const CLIENT_NOTICE_PAGE_SIZE = 20;
const DB_TYPE_OPTIONS = [
  { value: "0", label: "MySql" },
  { value: "1", label: "SqlServer" },
  { value: "2", label: "Sqlite" },
  { value: "3", label: "Oracle" },
  { value: "4", label: "PostgreSQL" },
  { value: "5", label: "达梦" },
  { value: "8", label: "MySqlConnector" },
  { value: "13", label: "ClickHouse" }
];
const EMOJI_SHORTCUTS = [
  "[微笑]",
  "[撇嘴]",
  "[色]",
  "[发呆]",
  "[得意]",
  "[流泪]",
  "[害羞]",
  "[闭嘴]",
  "[睡]",
  "[大哭]",
  "[尴尬]",
  "[发怒]",
  "[调皮]",
  "[呲牙]",
  "[惊讶]",
  "[难过]",
  "[酷]",
  "[冷汗]",
  "[抓狂]",
  "[吐]",
  "[偷笑]",
  "[愉快]",
  "[白眼]",
  "[傲慢]",
  "[饥饿]",
  "[困]",
  "[惊恐]",
  "[流汗]",
  "[憨笑]",
  "[悠闲]",
  "[奋斗]",
  "[疑问]",
  "[嘘]",
  "[晕]",
  "[红包]",
  "[福]",
  "[强]",
  "[OK]"
];

const state = {
  apiBase: loadStoredApiBase(),
  token: localStorage.getItem("youchat.token") || sessionStorage.getItem("u-token") || "",
  account: localStorage.getItem("youchat.account") || "Boom666",
  accountId: localStorage.getItem("youchat.accountId") || "",
  contactListAccountIds: loadContactListAccountIds(),
  accountIdResolved: false,
  remember: localStorage.getItem("youchat.remember") !== "false",
  aiEnabled: localStorage.getItem("youchat.ai.enabled") !== "false",
  aiBaseUrl: localStorage.getItem("youchat.ai.baseUrl") || DEFAULT_AI_BASE_URL,
  aiApiKey: localStorage.getItem("youchat.ai.apiKey") || DEFAULT_AI_API_KEY,
  aiModel: normalizeAiModel(localStorage.getItem("youchat.ai.model") || DEFAULT_AI_MODEL),
  aiTemperature: clampAiTemperature(localStorage.getItem("youchat.ai.temperature") || DEFAULT_AI_TEMPERATURE),
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
  lastSkillPromptKey: "",
  replySkills: [],
  replySkillsLoading: false,
  skillKeyword: "",
  skillAutoReply: localStorage.getItem("youchat.skill.autoReply") === "true",
  skillAutoLearn: localStorage.getItem("youchat.skill.autoLearn") !== "false",
  skillAutoSending: false,
  lastSkillAutoReplyKey: "",
  emojiOpen: false,
  draftImages: [],
  redPackTemplates: [],
  redPackTemplatesLoading: false,
  activeModal: null,
  listTab: "current",
  activeTool: "user",
  contacts: [],
  clearedListUntil: {},
  clearedContactState: loadClearedContactState(),
  messages: [],
  messagePage: 1,
  messageHasMore: false,
  messageLoading: false,
  messageAutoLoading: false,
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
  clientPaused: localStorage.getItem(CLIENT_PAUSED_STORAGE_KEY) === "true",
  clientOptions: null,
  clientOptionsLoading: false,
  clientConnectionString: "",
  clientDbType: "",
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
  activeContact: null,
  contextMenu: null,
  totalContacts: 0,
  listCounts: { current: 0, guestbook: 0, history: 0 },
  listServerCounts: { current: 0, guestbook: 0, history: 0 },
  listCountSources: { current: "", guestbook: "", history: "" },
  listUnreadCounts: { current: 0, guestbook: 0, history: 0 },
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
  readContactState: loadReadContactState(),
  logLines: []
};

const el = {};
let refreshTimer = null;
let scrollRequestId = 0;
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
    "aiBaseUrl",
    "aiApiKey",
    "aiModel",
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
    "sendText",
    "useAi",
    "aiSuggest",
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
  hydrateAiSettingsFields();
  bindEvents();
  renderAll();
  loadReplySkills();
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
  el.replyText.addEventListener("input", handleReplyInput);
  el.replyText.addEventListener("paste", handleReplyPaste);
  el.replyText.addEventListener("dragover", handleReplyDragOver);
  el.replyText.addEventListener("drop", handleReplyDrop);
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
  el.redOnly.addEventListener("change", renderMessages);
  el.accessIn.addEventListener("click", accessIn);
  el.transferAi.addEventListener("click", transferAi);
  el.toolContent.addEventListener("click", handleToolClick);
  el.toolContent.addEventListener("keydown", handleToolKeydown);
  el.messageList.addEventListener("click", handleMessageListClick);
  el.messageList.addEventListener("scroll", handleMessageListScroll);
  el.contactList.addEventListener("click", handleContactListClick);
  el.contactList.addEventListener("keydown", handleContactListKeydown);
  el.contactList.addEventListener("contextmenu", handleContactContextMenu);
  document.addEventListener("click", closeContextMenu);
  document.addEventListener("click", closeClientSettingsMenuOnOutside);
  document.addEventListener("click", closeEmojiOnOutside);
  document.addEventListener("keydown", (event) => {
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
      state.listTab = button.dataset.listTab;
      renderConversationTabs();
      await loadContacts();
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
  el.aiBaseUrl.value = state.aiBaseUrl;
  el.aiApiKey.value = state.aiApiKey;
  el.aiModel.value = state.aiModel;
  el.aiTemperature.value = state.aiTemperature;
  updateAiButtonState();
}

function showAiSettings() {
  hydrateAiSettingsFields();
  el.aiSettingsOverlay.classList.remove("is-hidden");
  window.setTimeout(() => el.aiBaseUrl.focus(), 0);
}

function hideAiSettings() {
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
  } else if (action === "pause") {
    toggleClientPause();
  } else if (action === "logout") {
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
    toast("已挂起：自动刷新已暂停。");
  } else {
    startAutoRefresh();
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

async function showClientOptionsModal() {
  state.clientOptionsLoading = true;
  state.clientOptions = null;
  openToolModal({
    type: "client-options",
    size: "wide",
    title: "客户端设置",
    confirmText: "保存",
    body: renderClientOptionsModal(),
    onConfirm: saveClientOptionsFromModal
  });

  try {
    const payload = await api("/System/GetOptions", {});
    state.clientOptions = getData(payload) || payload || {};
    log("client options", summarize(state.clientOptions));
  } catch (error) {
    state.clientOptions = { __error: error.message };
  } finally {
    state.clientOptionsLoading = false;
    if (state.activeModal?.type === "client-options") {
      el.toolModalBody.innerHTML = renderClientOptionsModal();
    }
  }
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
      <p class="modal-hint">这里调用原生接口 /System/GetOptions。接口恢复后再打开即可看到真实配置。</p>
    `;
  }

  const options = state.clientOptions || {};
  return `
    <div class="client-settings-grid">
      <section class="client-settings-block">
        <h4>常规设置</h4>
        ${renderEditableOptionFields(options.commonOptions || options.CommonOptions || options.common || {}, "commonOptions")}
      </section>
      <section class="client-settings-block">
        <h4>任务设置</h4>
        ${renderEditableOptionFields(options.jobOptions || options.JobOptions || options.job || {}, "jobOptions")}
      </section>
      <section class="client-settings-block">
        <h4>服务端 AI 设置</h4>
        <p class="modal-hint">这是悠聊服务端配置，和右上角单独的 Web AI 推荐设置互不覆盖。</p>
        ${renderEditableOptionFields(options.aiOptions || options.AiOptions || options.ai || {}, "aiOptions")}
      </section>
      <section class="client-settings-block">
        <h4>数据库设置</h4>
        ${renderEditableOptionFields(options.dataBaseOptions || options.DataBaseOptions || options.databaseOptions || {}, "dataBaseOptions")}
      </section>
    </div>
    <details class="raw-json-box">
      <summary>查看原始配置 JSON</summary>
      <pre>${escapeHtml(JSON.stringify(options, null, 2))}</pre>
    </details>
  `;
}

function renderEditableOptionFields(group, namespace) {
  const entries = Object.entries(group || {}).filter(([, value]) => isEditablePrimitive(value));
  if (!entries.length) return '<p class="empty-state compact">接口未返回可直接编辑的字段。</p>';
  return `
    <div class="client-option-fields">
      ${entries.slice(0, 24).map(([key, value]) => `
        <label class="modal-field compact-field">
          <span>${escapeHtml(key)}</span>
          ${typeof value === "boolean"
            ? `<select data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}"><option value="true" ${value ? "selected" : ""}>true</option><option value="false" ${!value ? "selected" : ""}>false</option></select>`
            : `<input data-client-option="${escapeAttr(namespace)}.${escapeAttr(key)}" value="${escapeAttr(value)}" />`}
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
    const [namespace, key] = String(input.dataset.clientOption || "").split(".");
    if (!namespace || !key) return;
    const sourceGroup = original[namespace] || original[toPascalCase(namespace)] || {};
    const targetGroup = next[namespace] || next[toPascalCase(namespace)] || {};
    targetGroup[key] = castLike(input.value, sourceGroup[key]);
    if (next[namespace]) next[namespace] = targetGroup;
    else next[toPascalCase(namespace)] = targetGroup;
  });

  try {
    await api("/System/SetOptions", {
      dataBaseOptions: next.dataBaseOptions || next.DataBaseOptions || {},
      commonOptions: next.commonOptions || next.CommonOptions || {},
      jobOptions: next.jobOptions || next.JobOptions || {},
      aiOptions: next.aiOptions || next.AiOptions || {}
    }, { asJson: true });
    state.clientOptions = next;
    toast("客户端设置已提交到 /System/SetOptions。");
    closeToolModal();
    return true;
  } catch (error) {
    toast(`保存客户端设置失败：${error.message}`, true);
    return false;
  }
}

async function showDatabaseModal() {
  state.clientConnectionString = "";
  state.clientDbType = "";
  openToolModal({
    type: "database",
    title: "数据库管理",
    confirmText: "保存连接",
    body: '<div class="client-modal-loading">正在读取 /System/GetConnectionString...</div>',
    onConfirm: saveDatabaseConnectionFromModal
  });

  try {
    const payload = await api("/System/GetConnectionString", {});
    const data = getData(payload);
    const connection = typeof data === "string"
      ? data
      : firstValue(data?.connectionString, data?.ConnectionString, data?.connStr, payload?.connectionString, "");
    state.clientConnectionString = String(connection || "");
    state.clientDbType = normalizeDbType(firstValue(
      data?.databaseType,
      data?.DatabaseType,
      data?.dbType,
      data?.DbType,
      data?.type,
      payload?.databaseType,
      payload?.dbType,
      ""
    ));
  } catch (error) {
    state.clientConnectionString = "";
    state.clientDbType = "";
    log("database connection load failed", { error: error.message });
    toast(`数据库连接读取失败：${error.message}`, true);
  } finally {
    if (state.activeModal?.type === "database") {
      el.toolModalBody.innerHTML = renderDatabaseModal();
    }
  }
}

function renderDatabaseModal() {
  return `
    <label class="modal-field">
      <span>数据库类型</span>
      <select id="clientDbType">
        ${DB_TYPE_OPTIONS.map((type) => `
          <option value="${escapeAttr(type.value)}" ${normalizeDbType(state.clientDbType) === type.value ? "selected" : ""}>${escapeHtml(`${type.label} (${type.value})`)}</option>
        `).join("")}
      </select>
    </label>
    <label class="modal-field">
      <span>连接字符串</span>
      <textarea id="clientConnectionString" rows="7" placeholder="接口未返回连接字符串">${escapeHtml(state.clientConnectionString)}</textarea>
    </label>
    <p class="modal-hint">该区域调用原生接口 /System/GetConnectionString 与 /System/SetConnectionString。修改前请确认服务端数据库备份。</p>
  `;
}

async function saveDatabaseConnectionFromModal() {
  const connectionString = $("clientConnectionString")?.value.trim() || "";
  const dbType = normalizeDbType($("clientDbType")?.value || state.clientDbType || "0");
  if (!connectionString) {
    toast("请输入数据库连接字符串。", true);
    return false;
  }

  try {
    await api("/System/SetConnectionString", {
      connectionString,
      databaseType: dbType,
      DbType: dbType,
      type: dbType
    });
    state.clientConnectionString = connectionString;
    state.clientDbType = dbType;
    toast("数据库连接已提交。");
    closeToolModal();
    return true;
  } catch (error) {
    toast(`保存数据库连接失败：${error.message}`, true);
    return false;
  }
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
  state.aiBaseUrl = normalizeAiBaseUrl(el.aiBaseUrl.value);
  state.aiApiKey = el.aiApiKey.value.trim();
  state.aiModel = normalizeAiModel(el.aiModel.value);
  state.aiTemperature = clampAiTemperature(el.aiTemperature.value);
  persistAiSettings();
  hydrateAiSettingsFields();
  hideAiSettings();
  toast("AI 设置已保存。");
}

function resetAiSettings() {
  state.aiEnabled = true;
  state.skillAutoReply = false;
  state.skillAutoLearn = true;
  state.aiBaseUrl = DEFAULT_AI_BASE_URL;
  state.aiApiKey = DEFAULT_AI_API_KEY;
  state.aiModel = DEFAULT_AI_MODEL;
  state.aiTemperature = DEFAULT_AI_TEMPERATURE;
  persistAiSettings();
  hydrateAiSettingsFields();
  toast("AI 设置已恢复默认。");
}

function handleAiPresetClick(event) {
  const target = event.target.closest("[data-ai-preset]");
  if (!target) return;
  const preset = AI_PRESETS[target.dataset.aiPreset];
  if (!preset) return;
  el.aiBaseUrl.value = preset.baseUrl;
  el.aiModel.value = preset.model;
  if (target.dataset.aiPreset === "deepseek") {
    toast("已填入 DeepSeek 官方端点和模型，请填写 DeepSeek 平台的 API Key。");
  } else {
    toast("已填入 sub2 中转端点和模型。");
  }
}

function persistAiSettings() {
  localStorage.setItem("youchat.ai.enabled", String(state.aiEnabled));
  localStorage.setItem("youchat.skill.autoReply", String(state.skillAutoReply));
  localStorage.setItem("youchat.skill.autoLearn", String(state.skillAutoLearn));
  localStorage.setItem("youchat.ai.baseUrl", state.aiBaseUrl);
  localStorage.setItem("youchat.ai.apiKey", state.aiApiKey);
  localStorage.setItem("youchat.ai.model", state.aiModel);
  localStorage.setItem("youchat.ai.temperature", String(state.aiTemperature));
  updateAiButtonState();
}

function normalizeAiBaseUrl(value) {
  const trimmed = String(value || "").trim() || DEFAULT_AI_BASE_URL;
  return trimmed.replace(/\/+$/, "/");
}

function normalizeAiModel(value) {
  const model = String(value || "").trim();
  return !model || model === "gpt-4o-mini" ? DEFAULT_AI_MODEL : model;
}

function clampAiTemperature(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return DEFAULT_AI_TEMPERATURE;
  return Math.min(2, Math.max(0, number));
}

function updateAiButtonState() {
  if (!el.aiSuggest) return;
  el.aiSuggest.disabled = state.aiGenerating || !state.aiEnabled;
  el.aiSuggest.textContent = state.aiGenerating ? "AI 生成中" : "AI 推荐";
  el.aiSuggest.title = state.aiEnabled ? "" : "AI 推荐已在设置中关闭";
  if (el.refreshAiSuggestion) {
    el.refreshAiSuggestion.disabled = state.aiGenerating || !state.aiEnabled || !state.aiSuggestion;
    el.refreshAiSuggestion.textContent = state.aiGenerating ? "生成中" : "换一换";
  }
  renderAiSuggestionCard();
}

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
}

function showLogin() {
  stopAutoRefresh();
  el.workbenchView.classList.add("is-hidden");
  el.loginView.classList.remove("is-hidden");
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
    const unread = Number(state.listUnreadCounts[tab] || 0);
    button.classList.toggle("is-active", tab === state.listTab);
    button.classList.toggle("has-unread", unread > 0);
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
  const response = await fetch(apiPath(path), {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method) ? undefined : body
  });
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
    pageSize: options.pageSize || 20
  };
  if (options.id !== undefined) params.id = options.id;
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
  if (state.accountIdResolved && state.accountId) return state.accountId;
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
  if (!candidates.length) {
    try {
      globalResult = await fetchContactListPayload(tab, {
        ...options,
        omitAccountId: true
      }, {
        source: "global-filtered"
      });
      if (isUsefulContactListResult(globalResult)) {
        return globalResult;
      }
    } catch (error) {
      log("contact list client-compatible request failed", { error: error.message });
    }
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
      if (isUsefulContactListResult(result) || isExplicitEmptyContactListResult(result) || result.isZeroData) return result;
      emptyAccountResults.push(result);
    } catch (error) {
      log("contact list account filter failed", { accountId, error: error.message });
    }
  }

  if (globalResult) {
    return {
      ...globalResult,
      source: candidates.length ? "global-empty" : "global",
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
  try {
    await ensureContactListAccountId();
    const selectedId = getContactId(state.activeContact);
    const previousContactScrollTop = el.contactList.scrollTop;
    const previousToolScrollTop = el.toolContent.scrollTop;
    const previousHistoryList = el.toolContent.querySelector("[data-history-list]");
    const previousHistoryScrollTop = previousHistoryList?.scrollTop || 0;
    const previousHistoryWasNearBottom = isNearBottom(previousHistoryList);
    const preserveScroll = Boolean(options.preserveScroll);
    const result = await fetchContactListWithFallback(state.listTab);
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

    state.contacts = contacts;
    state.totalContacts = state.listTab === "history"
      ? Math.max(contacts.length, serverTotal)
      : locallyFiltered
      ? contacts.length
      : Math.max(contacts.length, serverTotal);
    state.listCounts[state.listTab] = state.totalContacts || state.contacts.length;
    state.listUnreadCounts[state.listTab] = sumContactUnread(state.contacts);
    state.activeContact = state.contacts.find((contact) => String(getContactId(contact)) === String(selectedId)) || state.contacts[0] || null;
    const activeChanged = String(selectedId || "") !== String(getContactId(state.activeContact) || "");
    renderConversationTabs();
    renderContacts();
    renderActive();
    if (activeChanged || !state.messages.length) renderMessagesFromContactPreview();
    renderToolContent();
    if (!options.skipCounts) {
      loadContactCounts().catch((error) => log("contact counts failed", { error: error.message }));
    }
    if (preserveScroll) {
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
  } catch (error) {
    if (options.preserveScroll && state.contacts.length) {
      state.listCountSources[state.listTab] = "stale";
      renderConversationTabs();
      renderContacts();
      log("contact refresh preserved existing list after failure", { error: error.message });
      return;
    }
    state.contacts = [];
    state.activeContact = null;
    state.messages = [];
    renderAll();
    toast(`会话接口失败：${error.message}`, true);
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
    ? `<img class="friend-avatar" src="${escapeAttr(normalizeImageUrl(item.avatar))}" alt="">`
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

function sumContactUnread(contacts) {
  return contacts.reduce((sum, contact) => sum + Number(contact.unread || contact.unRead || contact.redDot || contact.unReadCount || 0), 0);
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
  const records = Array.isArray(item.records)
    ? item.records.map((record, recordIndex) => normalizeMessage({ contactId: id, ...record }, recordIndex))
    : [];
  const latestRecordTime = records.reduce((max, record) => Math.max(max, Number(record.sortTime || 0)), 0);
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
    userNick: item.userNick || item.nickName || item.userRemark || item.userName || item.name || `客户 ${id}`,
    accountName: item.accountName || item.account?.userName || "",
    robotName: item.robotName || robot.robotRemark || robot.robotName || item.robotRemark || "",
    lastContent: item.lastContent || item.content || item.lastMsg || item.message || records[records.length - 1]?.content || "",
    unread: item.unRead ?? item.redDot ?? item.unReadCount ?? item.unread ?? 0,
    time: formatTime(sortTime || rawTime),
    sortTime,
    isTodo: Boolean(item.isTodo),
    avatar: item.avatar || item.headImgUrl || item.headimgurl || item.headUrl || "",
    tags: [
      item.isTodo ? "待办" : "",
      item.isNotice ? "通知" : "",
      robot.robotRemark || robot.robotName || ""
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
    const unread = Number(contact.unread || 0);
    const isPinned = Boolean(contact.isTodo);
    const contactId = getContactId(contact);
    const hoverActions = getContactHoverActions(contact, contactId);
    const avatar = contact.avatar
      ? `<img class="contact-photo" src="${escapeAttr(normalizeImageUrl(contact.avatar))}" alt="">`
      : `<span class="contact-avatar">${escapeHtml(getInitial(contact.userNick))}</span>`;
    return `
      <div class="contact-card ${active ? "is-active" : ""} ${isPinned ? "is-pinned" : ""} ${unread ? "has-unread" : ""}" data-contact-id="${escapeAttr(contactId)}" role="button" tabindex="0">
        ${avatar}
        <span class="contact-main">
          <strong>${escapeHtml(contact.userNick)}</strong>
          <span>${escapeHtml(contact.userRemark || contact.robotName || contact.userName || "悠聊客户")}</span>
        </span>
        <span class="contact-side">
          <span>${escapeHtml(contact.time || "")}</span>
          ${unread ? `<span class="unread-badge">${unread}</span>` : ""}
        </span>
        <span class="contact-last">${escapeHtml(contact.lastContent || "暂无最新消息")}</span>
        ${isPinned ? '<span class="pin-corner" title="待办置顶"></span>' : ""}
        ${hoverActions}
      </div>
    `;
  }).join("");
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
  renderMessages();
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
  const entries = Object.entries(state.readContactState || {})
    .sort((a, b) => Number(b[1]?.readAt || 0) - Number(a[1]?.readAt || 0))
    .slice(0, 500);
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
  const readSortTime = Number(readState.sortTime || 0);
  const shouldKeepRead = readAt && (!contactSortTime || contactSortTime <= readSortTime || contactSortTime <= readAt);
  if (!shouldKeepRead) return contact;

  return {
    ...contact,
    unRead: 0,
    redDot: 0,
    unReadCount: 0,
    unread: 0
  };
}

function markContactRead(contact, options = {}) {
  const key = getContactReadKey(contact);
  if (!key) return;

  const readAt = Date.now();
  const sortTime = Math.max(Number(contact?.sortTime || 0), readAt);
  state.readContactState[key] = { readAt, sortTime };
  persistReadContactState();

  state.contacts = state.contacts.map((item) => (
    String(getContactId(item)) === key ? applyReadStateToContact({ ...item, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 }) : item
  ));
  if (state.activeContact && String(getContactId(state.activeContact)) === key) {
    state.activeContact = applyReadStateToContact({ ...state.activeContact, unread: 0, unRead: 0, redDot: 0, unReadCount: 0 });
  }
  state.listUnreadCounts[state.listTab] = sumContactUnread(state.contacts);
  renderConversationTabs();

  if (options.sync) {
    syncConsumedMessages(contact).catch((error) => {
      log("consume message sync failed", {
        contactId: key,
        error: error.message
      });
    });
  }
}

function markVisibleContactsRead() {
  const readAt = Date.now();
  state.contacts = state.contacts.map((contact) => {
    const key = getContactReadKey(contact);
    if (!key) return contact;
    state.readContactState[key] = {
      readAt,
      sortTime: Math.max(Number(contact.sortTime || 0), readAt)
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

async function syncConsumedMessages(contact) {
  const contactId = getContactId(contact);
  if (!contactId) return;

  await api("/ChatContent/ConsumeMessage", {
    contactId,
    msgId: 0
  });
  log("consume message synced", {
    contactId,
    msgId: 0,
    source: "electron-compatible"
  });
}

async function syncAllConsumedMessages() {
  await api("/ChatContent/ConsumeMessage", {
    contactId: 0,
    msgId: 0
  });
  log("consume all messages synced", {
    contactId: 0,
    msgId: 0,
    source: "electron-compatible"
  });
}

async function syncConsumedMessageIds(contact) {
  const contactId = getContactId(contact);
  if (!contactId) return;

  const candidates = [
    ...(Array.isArray(contact?.records) ? contact.records : []),
    ...state.messages
  ].filter((message) => (
    message && (message.direction === "incoming" || message.isRedPoint || message.isRedpoint)
  ));

  const messageIds = [...new Set(candidates.map(getConsumableMessageId).filter(Boolean))].slice(-10);
  if (!messageIds.length) {
    log("consume message skipped", {
      contactId,
      reason: "no message id in current contact records"
    });
    return;
  }

  await Promise.allSettled(messageIds.map((msgId) => api("/ChatContent/ConsumeMessage", {
    contactId,
    msgId
  })));
}

function getConsumableMessageId(message) {
  const value = firstValue(
    message?.msgId,
    message?.messageId,
    message?.chatContentId,
    message?.contentId,
    message?.rawId,
    message?.id
  );
  return String(value || "").startsWith("message-") ? "" : value;
}

async function selectContactById(id) {
  const nextContact = state.contacts.find((contact) => String(getContactId(contact)) === String(id));
  if (!nextContact) return;
  const shouldJumpToUnread = Number(nextContact.unread || nextContact.unRead || nextContact.redDot || nextContact.unReadCount || 0) > 0;

  if (String(getContactId(state.activeContact)) === String(id)) {
    markContactRead(nextContact);
    renderContacts();
    if (shouldJumpToUnread && hasUnreadMessageAnchor()) {
      scrollToFirstUnreadMessage();
    } else {
      scheduleMessageListBottom({ watchImages: true });
    }
    syncConsumedMessages(nextContact).catch((error) => {
      log("consume message sync failed", {
        contactId: getContactId(nextContact),
        error: error.message
      });
    });
    return;
  }

  state.activeContact = nextContact;
  resetContactScopedState();
  renderMessagesFromContactPreview();
  markContactRead(nextContact);
  renderContacts();
  renderActive();
  renderToolContent();

  await Promise.all([
    loadMessages(1, "replace", { forceBottom: true }),
    loadContactInfo(),
    loadToolDataForActiveTab()
  ]);
  scheduleAutoAiSuggestion({ source: "select-contact", delay: 300 });
  if (shouldJumpToUnread && hasUnreadMessageAnchor()) {
    scrollToFirstUnreadMessage();
  } else {
    scheduleMessageListBottom({ watchImages: true });
  }
  syncConsumedMessages(state.activeContact).catch((error) => {
    log("consume message sync failed", {
      contactId: getContactId(state.activeContact),
      error: error.message
    });
  });
}

function hasUnreadMessageAnchor() {
  return Boolean(el.messageList.querySelector("[data-red-point='true']"));
}

function scrollToFirstUnreadMessage() {
  requestAnimationFrame(() => {
    const target = el.messageList.querySelector("[data-red-point='true']");
    if (!target) return;
    target.scrollIntoView({ block: "center" });
    target.classList.add("is-jump-highlight");
    window.setTimeout(() => target.classList.remove("is-jump-highlight"), 1200);
  });
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
  state.lastSkillPromptKey = "";
  state.lastSkillAutoReplyKey = "";
}

function handleContactListClick(event) {
  const actionTarget = event.target.closest("[data-contact-action]");
  if (actionTarget) {
    event.stopPropagation();
    const contact = state.contacts.find((item) => String(getContactId(item)) === String(actionTarget.dataset.contactId));
    handleContactAction(actionTarget.dataset.contactAction, contact);
    return;
  }

  const card = event.target.closest("[data-contact-id]");
  if (!card) return;
  selectContactById(card.dataset.contactId);
}

function handleContactListKeydown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
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
    const card = el.contactList.querySelector(`[data-contact-id="${CSS.escape(String(getContactId(next)))}"]`);
    card?.focus();
    card?.scrollIntoView({ block: "nearest" });
  });
}

function getInitial(name) {
  return String(name || "客").trim().slice(0, 1) || "客";
}

function getContactId(contact) {
  return contact && (contact.id || contact.contactId || contact.userId || contact.contactID);
}

function getContactUserName(contact) {
  return firstValue(contact?.userName, contact?.wxid, contact?.userIdStr, contact?.userId, "");
}

function getAccountId(contact = state.activeContact) {
  return firstValue(
    state.accountId,
    contact?.accountId,
    contact?.accId,
    contact?.csAccountId,
    contact?.account?.id,
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
  return firstValue(
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
  return firstValue(
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
    el.activeAvatar.outerHTML = '<span id="activeAvatar" class="contact-avatar">客</span>';
    el.activeAvatar = $("activeAvatar");
    el.activeTitle.textContent = "请选择会话";
    el.activeMeta.textContent = "连接服务后选择左侧客户开始处理";
    return;
  }

  renderActiveAvatar(contact);
  el.activeTitle.textContent = contact.userNick || "客户";
  const userId = getContactUserId(contact) || "-";
  const remark = getContactRemark(contact);
  const displayRemark = remark ? `（${remark}）` : "";
  el.activeTitle.innerHTML = `${escapeHtml(contact.userNick || "客户")}${displayRemark ? `<span class="active-remark">${escapeHtml(displayRemark)}</span>` : ""}`;
  el.activeMeta.textContent = [
    `微信号 ${contact.userName || "-"}`,
    `用户ID ${userId}`
  ].filter(Boolean).join("，");
}

function renderActiveAvatar(contact) {
  const html = contact.avatar
    ? `<img id="activeAvatar" class="contact-photo active-photo" src="${escapeAttr(normalizeImageUrl(contact.avatar))}" alt="">`
    : `<span id="activeAvatar" class="contact-avatar">${escapeHtml(getInitial(contact.userNick))}</span>`;
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
  state.messageLoading = true;
  if (mode === "append" || (!state.messages.length && mode !== "merge")) renderMessages("none");

  try {
    const result = await fetchMessagePage(contact, page, MESSAGE_PAGE_SIZE, {
      endTime: page > 1 ? getMessageCursorTime(state.messages[0]) : ""
    });
    if (String(getContactId(state.activeContact) || "") !== String(contactId)) {
      state.messageLoading = false;
      return;
    }
    const records = result.records;
    const total = result.total;
    const previousCount = state.messages.length;

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
      const previewRecords = mergeMessages(state.activeContact?.records || []);
      state.messages = mode === "merge" && state.messages.length ? mergeMessages([...state.messages, ...previewRecords]) : previewRecords;
      if (mode !== "merge") state.messagePage = 1;
      state.messageHasMore = mode === "merge" ? previousHasMore : false;
    } else {
      state.messageHasMore = false;
    }

    state.messageLoading = false;
    const shouldScrollBottom = forceBottom || (mode === "replace" && (!keepPosition || wasNearBottom));
    renderMessages(shouldScrollBottom ? "bottom" : "none");
    if (mode === "append") {
      restorePrependScroll(el.messageList, previousScrollHeight, previousScrollTop, { watchImages: true });
    } else if (mode === "merge") {
      if (wasNearBottom) {
        scrollElementToBottom(el.messageList, { watchImages: true });
      } else {
        restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
      }
    } else if (keepPosition && !shouldScrollBottom) {
      restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
    }
    if ((mode === "replace" || mode === "merge") && records.length) {
      maybeBuildSkillSuggestion({ autoReply: mode === "merge" }).catch((error) => log("skill suggestion failed", { error: error.message }));
      scheduleAutoAiSuggestion({ source: `messages:${mode}` });
    }
  } catch (error) {
    if (page === 1) {
      const previewRecords = mergeMessages(state.activeContact?.records || []);
      state.messages = mode === "merge" && state.messages.length ? mergeMessages([...state.messages, ...previewRecords]) : previewRecords;
    }
    state.messageLoading = false;
    state.messageHasMore = mode === "merge" ? previousHasMore : false;
    const shouldScrollBottom = forceBottom || (mode === "replace" && (!keepPosition || wasNearBottom));
    renderMessages(shouldScrollBottom ? "bottom" : "none");
    if (keepPosition && !shouldScrollBottom) {
      restoreScrollTop(el.messageList, previousScrollTop, { watchImages: true });
    }
    toast(`聊天记录接口失败：${error.message}`, true);
  }
}

async function fetchMessagePage(contact, page, size, options = {}) {
  const contactId = getContactId(contact);
  const endTime = options.endTime || "";
  const liveListParams = {
    contactId,
    size,
    onlyRepointMsg: false,
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
        withConfig: false
      }
    },
    {
      path: "/ChatContent/GetList",
      data: {
        contactId,
        endTime,
        current: page,
        size
      }
    },
    {
      path: "/ChatContent/GetChatContentList",
      data: {
        contactId,
        endTime,
        current: page,
        size,
        onlyRepointMsg: false
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
        onlyRepointMsg: false
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
    cardImg: firstValue(item.cardImg, item.miniProImg, item.imageUrl, item.img, item.icon, ""),
    cardUrl: firstValue(item.cardUrl, item.miniProUrl, item.url, item.link, "")
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
  if (!state.messages.length) {
    el.messageList.innerHTML = `
      <div class="message-load-row">
        <button class="mini-action" type="button" data-action="load-more-messages" ${state.messageHasMore ? "" : "disabled"}>${state.messageLoading ? "加载中..." : "加载更多"}</button>
      </div>
      <div class="empty-state">当前会话暂无真实聊天记录，或接口返回为空。</div>
    `;
    return;
  }

  const redOnly = el.redOnly.checked;
  const messages = redOnly ? state.messages.filter((message) => message.isRedPoint || message.direction === "incoming") : state.messages;
  const filterSummary = redOnly
    ? `<div class="message-filter-summary">已加载 ${state.messages.length} 条，当前红点筛选显示 ${messages.length} 条</div>`
    : "";
  const filteredEmpty = redOnly && !messages.length
    ? '<div class="empty-state">已加载真实聊天记录，但当前没有符合红点筛选的消息。</div>'
    : "";

  el.messageList.innerHTML = [
    `<div class="message-load-row"><button class="mini-action" type="button" data-action="load-more-messages" ${state.messageHasMore && !state.messageLoading ? "" : "disabled"}>${state.messageLoading ? "加载中..." : state.messageHasMore ? "加载更多" : "没有更早记录"}</button></div>`,
    filterSummary,
    '<div class="day-divider">聊天记录</div>',
    filteredEmpty,
    ...messages.map((message) => renderMessageBubble(message))
  ].join("");

  if (scrollMode === "bottom") {
    scrollElementToBottom(el.messageList, { watchImages: true });
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
  if (!isOutgoing && state.activeContact?.avatar) {
    return `<img class="contact-photo" src="${escapeAttr(normalizeImageUrl(state.activeContact.avatar))}" alt="">`;
  }
  const avatarText = message.direction === "ai" ? "AI" : isOutgoing ? "服" : getInitial(state.activeContact?.userNick);
  return `<span class="contact-avatar">${escapeHtml(avatarText)}</span>`;
}

function renderMessageContent(message) {
  const content = message.content || "";
  if (message.contentType === 1 || isImageUrl(content)) {
    return `<img class="message-image" src="${escapeAttr(normalizeImageUrl(content))}" alt="聊天图片">`;
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

function renderMessageLinkCard(card, message) {
  const hasImage = Boolean(card.image);
  const status = card.url && state.linkPreviewCache[card.url]?.loading ? "正在获取预览" : card.video ? "可预览视频" : "网页预览";
  const host = getUrlHost(card.url);
  const fallbackText = (host || "LINK").slice(0, 4).toUpperCase();
  const cardAttrs = card.url
    ? ` data-link-card="${escapeAttr(card.url)}" data-message-id="${escapeAttr(message.id || "")}"`
    : ` data-message-id="${escapeAttr(message.id || "")}"`;
  return `
    <article class="message-link-card is-web-card"${cardAttrs}>
      ${card.url ? `<button class="link-card-detail" type="button" data-link-preview="${escapeAttr(card.url)}">详情</button>` : ""}
      <div class="link-card-main">
        <div class="link-card-copy">
          <strong>${escapeHtml(card.title || getUrlHost(card.url) || "链接卡片")}</strong>
          ${card.desc ? `<p>${escapeHtml(card.desc)}</p>` : card.url ? `<p>${escapeHtml(card.url)}</p>` : ""}
          <span>${escapeHtml(card.siteName || host || status)}</span>
        </div>
        <div class="link-card-thumb ${hasImage ? "" : "is-empty"} ${card.imageKind === "site-logo" ? "is-site-logo" : ""}">
          ${hasImage ? `<img src="${escapeAttr(normalizeImageUrl(card.image))}" alt="${escapeAttr(card.siteBrand || card.siteName || "网站")}"${card.imageFallback ? ` onerror="this.onerror=null;this.src='${escapeAttr(card.imageFallback)}';"` : ""}>` : `<span>${escapeHtml(fallbackText)}</span>`}
        </div>
      </div>
      <div class="link-card-actions">
        <span>${escapeHtml(status)}</span>
        ${card.url ? `<button class="mini-action ghost" type="button" data-open-link="${escapeAttr(card.url)}">打开</button>` : ""}
        ${card.url ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.url)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : ""}
      </div>
    </article>
  `;
}

function buildMessageMiniProgramCard(message) {
  const parsed = parseMessagePayload(message.content);
  const isMini = Number(message.contentType) === 6 || Boolean(message.miniProTitle || message.miniProName || message.miniProImg || message.miniProUrl);
  if (!isMini) return null;
  const title = firstValue(message.miniProTitle, parsed.title, parsed.Title, message.cardTitle, "小程序");
  const appName = firstValue(message.miniProName, parsed.appName, parsed.AppName, parsed.source, "小程序");
  const desc = firstValue(message.miniProDesc, parsed.description, parsed.desc, parsed.des, message.cardDesc, title);
  const image = firstValue(message.miniProImg, parsed.image, parsed.thumbUrl, parsed.icon, message.cardImg, "");
  const url = normalizeLinkUrl(firstValue(message.miniProUrl, parsed.url, parsed.pagePath, message.cardUrl, ""));
  return { title, appName, desc, image, url };
}

function renderMessageMiniProgramCard(card) {
  return `
    <article class="message-mini-card">
      <div class="mini-card-title">
        <strong>${escapeHtml(card.title || "小程序")}</strong>
        ${card.url ? `<button class="link-card-detail" type="button" data-open-link="${escapeAttr(card.url)}">打开</button>` : ""}
      </div>
      <div class="mini-card-main">
        <span>${escapeHtml(card.desc || card.title || "小程序消息")}</span>
        ${card.image ? `<img class="mini-card-image" src="${escapeAttr(normalizeImageUrl(card.image))}" alt="">` : '<span class="mini-card-icon" aria-hidden="true"></span>'}
      </div>
      <div class="mini-card-footer">
        <span class="mini-card-mark" aria-hidden="true"></span>
        <span>${escapeHtml(card.appName || "小程序")}</span>
        ${card.url ? `<button class="mini-action ghost" type="button" data-copy="${escapeAttr(card.url)}"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>` : ""}
      </div>
    </article>
  `;
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
    return match ? decodeHtmlEntities(match[1].trim()) : "";
  };
  return {
    title: getXmlValue("title"),
    description: getXmlValue("des") || getXmlValue("desc"),
    appName: getXmlValue("sourcedisplayname") || getXmlValue("appname"),
    url: getXmlValue("url"),
    fileName: getXmlValue("filename") || getXmlValue("title"),
    fileSize: getXmlValue("totallen") || getXmlValue("filesize"),
    fileUrl: getXmlValue("cdnattachurl") || getXmlValue("url"),
    thumbUrl: getXmlValue("thumburl") || getXmlValue("cdnthumburl")
  };
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
  const match = String(text || "").match(/https?:\/\/[^\s<>"']+/i) || String(text || "").match(/\/\/[^\s<>"']+/i);
  return match ? trimTrailingUrlPunctuation(match[0]) : "";
}

function extractUrls(text) {
  const matches = String(text || "").match(/https?:\/\/[^\s<>"']+|\/\/[^\s<>"']+/gi) || [];
  return [...new Set(matches.map(trimTrailingUrlPunctuation).map(normalizeLinkUrl).filter(Boolean))];
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

function getUrlHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function linkifyMessageText(content) {
  const text = String(content || "");
  const urls = extractUrls(text);
  if (!urls.length) return escapeHtml(text);
  let html = escapeHtml(text);
  urls.forEach((url) => {
    const escaped = escapeHtml(url);
    html = html.replaceAll(escaped, `<button class="inline-link-button" type="button" data-link-preview="${escapeAttr(url)}">${escaped}</button>`);
  });
  return html;
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
    const message = messages.find((item) => normalizeLinkUrl(firstValue(item.cardUrl, item.miniProUrl, extractFirstUrl(item.content))) === url);
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

function renderActiveLinkPreview() {
  const url = state.activeLinkPreview?.url || "";
  const meta = state.linkPreviewCache[url] || {};
  const title = meta.title || getUrlHost(url) || "链接详情";
  el.linkPreviewTitle.textContent = title;
  el.linkPreviewSubtitle.textContent = meta.description || url;
  el.linkPreviewOpen.dataset.openLink = url;
  el.linkPreviewCopy.dataset.copyUrl = url;
  const videoUrl = getDirectPreviewVideoUrl(meta);
  const playerUrl = getPreviewPlayerUrl(meta);
  const imageUrl = meta.image ? normalizeImageUrl(meta.image) : "";
  if (videoUrl) {
    el.linkPreviewBody.innerHTML = `
      <video class="link-preview-video" src="${escapeAttr(videoUrl)}" controls playsinline poster="${escapeAttr(imageUrl)}"></video>
    `;
    return;
  }
  if (playerUrl) {
    el.linkPreviewBody.innerHTML = `
      <iframe class="link-preview-frame" src="${escapeAttr(playerUrl)}" title="${escapeAttr(title)}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allow="fullscreen; autoplay; encrypted-media; picture-in-picture"></iframe>
      <div class="link-preview-fallback">
        <span>${escapeHtml(meta.loading ? "正在获取视频预览..." : "如果预览为空白，说明目标网页禁止嵌入。")}</span>
      </div>
    `;
    return;
  }
  if (url) {
    el.linkPreviewBody.innerHTML = `
      <iframe class="link-preview-frame" src="${escapeAttr(url)}" title="${escapeAttr(title)}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
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

function handleMessageListClick(event) {
  const previewTarget = event.target.closest("[data-link-preview]");
  if (previewTarget) {
    event.preventDefault();
    showLinkPreview(previewTarget.dataset.linkPreview || "");
    return;
  }

  const openTarget = event.target.closest("[data-open-link]");
  if (openTarget) {
    event.preventDefault();
    openExternalLink(openTarget.dataset.openLink || "");
    return;
  }

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

function handleReplyInput() {
  triggerDraftAiOptimize();
}

function handleReplyPaste(event) {
  const files = [...(event.clipboardData?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  event.preventDefault();
  addDraftImages(files, "粘贴图片");
}

function handleReplyDragOver(event) {
  if (![...(event.dataTransfer?.items || [])].some((item) => item.kind === "file" && item.type.startsWith("image/"))) return;
  event.preventDefault();
}

function handleReplyDrop(event) {
  const files = [...(event.dataTransfer?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  event.preventDefault();
  addDraftImages(files, "拖入图片");
}

function triggerHistoryAutoLoad() {
  if (state.historyAutoLoading || state.historyLoading || !state.historyHasMore) return;
  state.historyAutoLoading = true;
  loadHistoryMessages(state.historyPage + 1, "append").finally(() => {
    state.historyAutoLoading = false;
  });
}

async function sendText() {
  const content = el.replyText.value.trim();
  const contactId = getContactId(state.activeContact);
  const images = [...state.draftImages];
  const matchedSkillBeforeSend = !state.lastSuggestionUsed ? buildSkillSuggestion() : null;
  if (!contactId || (!content && !images.length)) {
    toast("请先选择会话，并输入回复内容或粘贴图片。", true);
    return;
  }

  try {
    const sentImageUrls = [];
    if (content) {
      await sendChatContent({ content, contentType: 0 });
    }
    for (const image of images) {
      const imageUrl = await sendImageFile(image.file, { silent: true });
      sentImageUrls.push(imageUrl);
      await delay(180);
    }
    await learnFromManualReply(content, sentImageUrls, { matchedSkill: matchedSkillBeforeSend });
    el.replyText.value = "";
    clearDraftImages();
    clearAiSuggestion();
    touchActiveContact(content || (sentImageUrls.length ? "[image]" : ""));
    await loadMessages(1, "replace", { forceBottom: true });
    toast(images.length ? "文字和图片已提交到悠聊服务。" : "消息已提交到悠聊服务。");
  } catch (error) {
    toast(`发送失败：${error.message}`, true);
  }
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
  el.emojiPopover.innerHTML = EMOJI_SHORTCUTS.map((emoji) => `
    <button type="button" data-emoji="${escapeAttr(emoji)}" title="${escapeAttr(emoji)}">
      ${escapeHtml(emoji.replace(/^\[|\]$/g, ""))}
    </button>
  `).join("");
}

function handleEmojiPick(event) {
  const button = event.target.closest("[data-emoji]");
  if (!button) return;
  insertTextAtCursor(el.replyText, button.dataset.emoji);
  closeEmojiPopover();
}

function insertTextAtCursor(input, text) {
  const value = input.value || "";
  const start = input.selectionStart ?? value.length;
  const end = input.selectionEnd ?? value.length;
  input.value = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const next = start + String(text).length;
  input.focus();
  input.setSelectionRange(next, next);
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
    addDraftImages(files, "选择图片");
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
  await sendChatContent({ content: imageUrl, contentType: file.type === "image/gif" ? 4 : 1 });
  if (!options.silent) {
    touchActiveContact("[image]");
    await loadMessages(1, "replace", { forceBottom: true });
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

function removeDraftImage(id) {
  const removed = state.draftImages.find((image) => image.id === id);
  if (removed?.url) URL.revokeObjectURL(removed.url);
  state.draftImages = state.draftImages.filter((image) => image.id !== id);
  renderDraftImages();
  triggerDraftAiOptimize();
}

function clearDraftImages() {
  state.draftImages.forEach((image) => {
    if (image.url) URL.revokeObjectURL(image.url);
  });
  state.draftImages = [];
  renderDraftImages();
}

function renderDraftImages() {
  if (!el.draftImageTray) return;
  const hasDraftImages = Boolean(state.draftImages.length);
  el.draftImageTray.classList.toggle("is-hidden", !hasDraftImages);
  el.draftImageTray.closest(".composer")?.classList.toggle("has-draft-images", hasDraftImages);
  el.draftImageTray.innerHTML = state.draftImages.map((image, index) => `
    <figure class="draft-image" title="${escapeAttr(image.name)}">
      <img src="${escapeAttr(image.url)}" alt="待发送图片 ${index + 1}">
      <button type="button" data-remove-draft-image="${escapeAttr(image.id)}" aria-label="移除图片"><i class="native-icon bfi-close" aria-hidden="true"></i></button>
    </figure>
  `).join("");
}

function handleDraftImageClick(event) {
  const target = event.target.closest("[data-remove-draft-image]");
  if (!target) return;
  removeDraftImage(target.dataset.removeDraftImage);
}

async function uploadChatImage(file) {
  const contactId = assertActiveContact();
  const payload = await api("/ChatContent/GetOssConfig", {
    contactId,
    fileName: file.name
  });
  const config = getData(payload) || {};
  log("oss config", summarize(config));

  const directUrl = extractUploadedFileUrl(config);
  if (directUrl && !extractUploadEndpoint(config)) return directUrl;

  const endpoint = extractUploadEndpoint(config);
  if (!endpoint) {
    throw new Error("已拿到上传配置，但未识别到 OSS 上传地址，请继续抓包确认 GetOssConfig 返回结构");
  }

  const objectKey = buildOssObjectKey(config, file.name);
  try {
    const uploadForm = buildOssUploadForm(config, objectKey, file);
    const response = await fetch(endpoint, {
      method: "POST",
      body: uploadForm
    });
    const text = await response.text();
    log("oss upload response", { status: response.status, response: text.slice(0, 600) });
    if (!response.ok) throw new Error(`OSS 上传失败 HTTP ${response.status}`);

    return extractUploadedFileUrl(parsePayload(text)) ||
      extractUploadedFileUrl(config, objectKey) ||
      joinUrl(endpoint, objectKey);
  } catch (error) {
    log("oss browser upload failed, retry via local proxy", { error: error.message });
    return uploadImageViaLocalProxy({ config, objectKey, file });
  }
}

async function uploadImageViaLocalProxy({ config, objectKey, file }) {
  const payload = {
    config,
    objectKey,
    fileName: file.name,
    contentType: file.type,
    base64: await fileToBase64(file)
  };
  const response = await fetch("/local/oss-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  log("local oss upload", summarize(result));
  if (!response.ok || result.success === false || !result.url) {
    throw new Error(getMessage(result) || "图片上传代理未返回图片地址");
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
  return firstValue(
    config.key,
    config.objectKey,
    config.fileKey,
    config.path,
    config.filePath,
    config.fullPath,
    config.dir ? `${String(config.dir).replace(/\/?$/, "/")}${fileName}` : "",
    config.prefix ? `${String(config.prefix).replace(/\/?$/, "/")}${fileName}` : ""
  ) || fileName;
}

function buildOssUploadForm(config, objectKey, file) {
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

  form.append("file", file, file.name);
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
      <p class="modal-hint">保存后会进入 skill 回复库，后续 AI/skill 推荐会自动使用。</p>
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
    reply: el.replyText.value.trim() || suggestionText
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

  const skill = {
    title: `手动沉淀：${keywords[0].slice(0, 18)}`,
    source: "manual",
    enabled: true,
    allowAutoReply: false,
    noReply: false,
    priority: 60,
    keywords,
    samples: keywords,
    replySteps: [{ type: "text", content }],
    fallback: content
  };

  try {
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
    toast("已保存到 skill 回复库。");
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
  el.toolModalConfirm.classList.toggle("is-hidden", config.hideConfirm === true);
  el.toolModalPanel.classList.remove("tool-modal-wide", "tool-modal-large", "tool-modal-xl");
  if (config.size === "wide") el.toolModalPanel.classList.add("tool-modal-wide");
  if (config.size === "large") el.toolModalPanel.classList.add("tool-modal-large");
  if (config.size === "xl") el.toolModalPanel.classList.add("tool-modal-xl");
  el.toolModalOverlay.classList.remove("is-hidden");
}

function closeToolModal() {
  state.activeModal = null;
  el.toolModalOverlay.classList.add("is-hidden");
  el.toolModalBody.innerHTML = "";
}

async function confirmToolModal() {
  const modal = state.activeModal;
  if (!modal?.onConfirm) return closeToolModal();
  el.toolModalConfirm.disabled = true;
  try {
    await modal.onConfirm();
  } finally {
    el.toolModalConfirm.disabled = false;
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
  const previewTarget = event.target.closest("[data-link-preview]");
  if (previewTarget) {
    event.preventDefault();
    showLinkPreview(previewTarget.dataset.linkPreview || "");
    return;
  }

  const openTarget = event.target.closest("[data-open-link]");
  if (openTarget) {
    event.preventDefault();
    openExternalLink(openTarget.dataset.openLink || "");
    return;
  }

  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    copyToClipboard(copyTarget.dataset.copy || "");
    return;
  }

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
  }
}

function handleToolModalBodyChange(event) {
  if (state.activeModal?.type === "client-notice" && event.target.matches("#clientNoticeWarnType")) {
    syncClientNoticeFields();
    loadClientNoticeEvents();
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
  const steps = getSuggestionSteps(suggestion).filter((step) => step.content || step.url);
  if (!steps.length) {
    toast("推荐内容为空。", true);
    return;
  }

  try {
    for (const step of steps) {
      if (step.type === "image") {
        await sendChatContent({ content: absolutizeLocalUrl(step.url), contentType: 1 });
      } else {
        await sendChatContent({ content: step.content, contentType: 0 });
      }
      await delay(250);
    }
    state.lastSuggestionUsed = true;
    touchActiveContact(getSuggestionTextForComposer(suggestion).slice(0, 80) || "[suggestion]");
    await loadMessages(1, "replace", { forceBottom: true });
    toast("skill 推荐已发送。");
  } catch (error) {
    toast(`推荐发送失败：${error.message}`, true);
  }
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

  if (!state.aiApiKey) {
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
  if (skillSuggestion) {
    appendAiSuggestions([skillSuggestion], { silent });
    return;
  }

  state.aiGenerating = true;
  updateAiButtonState();

  try {
    const payload = {
      baseUrl: state.aiBaseUrl,
      apiKey: state.aiApiKey,
      model: state.aiModel,
      temperature: state.aiTemperature,
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
          content: context
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
  if (!state.aiApiKey) throw new Error("请先填写 AI API 密钥。");
  const response = await fetch("/ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baseUrl: state.aiBaseUrl,
      apiKey: state.aiApiKey,
      model: state.aiModel,
      temperature: clampAiTemperature(temperature ?? state.aiTemperature),
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
  if (!state.aiEnabled || !state.aiApiKey || !getContactId(state.activeContact)) return;
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
  return getLatestActionableInboundMessage();
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

  return [
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
  const draftText = el.replyText?.value.trim() || "";
  if (!draftText || draftText.length < 4 || !state.aiEnabled) return;
  state.aiOptimizeTimer = window.setTimeout(() => optimizeDraftReply().catch((error) => {
    log("draft optimize failed", { error: error.message });
  }), 900);
}

async function optimizeDraftReply() {
  const draftText = el.replyText.value.trim();
  if (!draftText || draftText.length < 4 || !state.aiEnabled || !state.aiApiKey) return;
  const latest = getLatestActionableInboundMessage();
  const key = [
    getContactId(state.activeContact),
    getMessageKey(latest, 0),
    draftText,
    state.draftImages.map((image) => image.name).join("|")
  ].join("::");
  if (key === state.aiOptimizeKey || state.aiGenerating) return;
  state.aiOptimizeKey = key;

  if (state.aiOptimizeAbort) state.aiOptimizeAbort.abort();
  state.aiOptimizeAbort = new AbortController();

  const context = buildDraftOptimizeContext(draftText);
  state.aiGenerating = true;
  updateAiButtonState();

  try {
    const payload = {
      baseUrl: state.aiBaseUrl,
      apiKey: state.aiApiKey,
      model: state.aiModel,
      temperature: Math.min(0.6, Number(state.aiTemperature || 0.35) + 0.1),
      messages: [
        {
          role: "system",
          content: [
            "你是客服输入优化助手。只优化客服已经输入的文字，不处理图片，不新增未确认的订单/返利/后台事实。",
            "输出 1 到 3 条可直接发送的中文候选，语气自然、简短、安抚；不要输出分析过程。",
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
      label: index === 0 ? "可优化为" : `可优化为 ${index + 1}`,
      content: reply,
      steps: [{ type: "text", content: reply }],
      keepDraftImages: true
    })).slice(0, 3), { silent: true });
  } catch (error) {
    if (error.name !== "AbortError") log("draft optimize failed", { error: error.message });
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
  if (skill.noReply) {
    return {
      type: "skill",
      title: `skill：${skill.title}`,
      skillId: skill.id,
      noReply: true,
      reason: skill.fallback || "这类消息通常不需要回复。",
      score: match.score,
      promptKey: latest ? getMessageKey(latest, 0) : ""
    };
  }

  return {
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    allowAutoReply: skill.allowAutoReply !== false,
    content: getSkillText(skill),
    steps: getSkillSteps(skill),
    score: match.score,
    contactUrl: skill.contactUrl || ONLINE_SERVICE_URL,
    promptKey: latest ? getMessageKey(latest, 0) : ""
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
  const matches = state.replySkills
    .filter((skill) => skill.enabled !== false && (!options.onlyNoReply || skill.noReply))
    .map((skill) => ({ skill, score: scoreReplySkill(skill, normalized, latest) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.skill.priority || 0) - Number(a.skill.priority || 0));
  return matches[0] ? { ...matches[0], latest } : null;
}

function scoreReplySkill(skill, normalizedContext, triggerMessage) {
  const negatives = Array.isArray(skill.negativeKeywords) ? skill.negativeKeywords : [];
  if (negatives.some((keyword) => keyword && normalizedContext.includes(normalizeForMatch(keyword)))) return 0;

  const keywords = Array.isArray(skill.keywords) ? skill.keywords : [];
  const samples = Array.isArray(skill.samples) ? skill.samples : [];
  let score = Number(skill.priority || 0) / 10;
  let hits = 0;

  keywords.forEach((keyword) => {
    const normalized = normalizeForMatch(keyword);
    if (!normalized) return;
    if (normalizedContext.includes(normalized)) {
      hits += 1;
      score += Math.min(20, normalized.length * 1.5);
    }
  });

  samples.forEach((sample) => {
    const normalized = normalizeForMatch(sample);
    if (!normalized) return;
    if (normalizedContext.includes(normalized)) score += 8;
  });

  if (skill.systemOnly && !triggerMessage?.isSystemNotice) return 0;
  return hits ? score : 0;
}

function normalizeForMatch(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
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
  if (Array.isArray(skill.replySteps) && skill.replySteps.length) {
    return skill.replySteps.map((step) => ({
      type: step.type === "image" ? "image" : "text",
      content: step.content || "",
      url: step.url || "",
      label: step.label || ""
    }));
  }
  return skill.fallback ? [{ type: "text", content: skill.fallback }] : [];
}

function getSkillText(skill) {
  return getSkillSteps(skill)
    .filter((step) => step.type !== "image")
    .map((step) => step.content || "")
    .filter(Boolean)
    .join("\n\n");
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
  if (/(提现|提取).{0,8}(成功|已提交|已经处理|等待处理|同步处理|到账)/.test(text)) return true;
  if (/(成功|已经处理|等待处理|同步处理).{0,8}(提现|提取)/.test(text)) return true;
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
  const suggestion = buildSkillSuggestion();
  if (!suggestion) return null;
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

async function learnFromManualReply(content, imageUrls = [], options = {}) {
  if (!state.skillAutoLearn || state.lastSuggestionUsed) return;
  const latest = getLatestActionableInboundMessage();
  if (!latest || latest.isSystemNotice || latest.direction !== "incoming") return;
  const prompt = String(latest.content || "").trim();
  const reply = String(content || "").trim();
  const images = imageUrls.map(String).filter(Boolean);
  if (prompt.length < 2 || (reply.length < 2 && !images.length)) return;
  const steps = [
    reply ? { type: "text", content: reply } : null,
    ...images.map((url, index) => ({ type: "image", url, label: `人工回复图片 ${index + 1}` }))
  ].filter(Boolean);

  const matchedSkillId = options.matchedSkill?.skillId;
  const matchedSkill = matchedSkillId ? getSkillById(matchedSkillId) : null;
  if (matchedSkill && !matchedSkill.noReply) {
    await learnMatchedSkillOverride(matchedSkill, { prompt, reply, images, steps, latest });
    return;
  }

  const existing = findLearnedSkillForPrompt(prompt);
  const nextHitCount = Number(existing?.hitCount || existing?.learnCount || 0) + 1;

  const skill = {
    id: existing?.id,
    title: existing?.title || `自动学习：${prompt.slice(0, 18)}`,
    source: "learned",
    enabled: true,
    allowAutoReply: existing?.allowAutoReply || nextHitCount >= 3,
    noReply: false,
    priority: Math.max(Number(existing?.priority || 45), nextHitCount >= 3 ? 70 : 45),
    hitCount: nextHitCount,
    keywords: [...new Set([...(existing?.keywords || []), ...extractLearningKeywords(prompt)])].slice(0, 20),
    samples: [...new Set([...(existing?.samples || []), prompt])].slice(0, 10),
    replySteps: steps,
    fallback: reply || existing?.fallback || ""
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
      log("reply skill learned", { prompt, reply, images, hitCount: nextHitCount });
    }
  } catch (error) {
    log("reply skill learn failed", { error: error.message, prompt });
  }
}

async function learnMatchedSkillOverride(skill, { prompt, reply, images, steps, latest }) {
  const overrides = Array.isArray(skill.manualOverrides) ? [...skill.manualOverrides] : [];
  const latestKey = latest ? getMessageKey(latest, 0) : "";
  const duplicateIndex = overrides.findIndex((item) => (
    normalizeForMatch(item.prompt) === normalizeForMatch(prompt) &&
    normalizeForMatch(item.reply) === normalizeForMatch(reply)
  ));
  const override = {
    at: new Date().toISOString(),
    prompt,
    reply,
    imageUrls: images,
    contactId: getContactId(state.activeContact),
    messageKey: latestKey
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
    manualOverrides: overrides.slice(0, 12),
    lastManualOverrideAt: override.at,
    samples: [...new Set([...(skill.samples || []), prompt])].slice(0, 14),
    keywords: [...new Set([...(skill.keywords || []), ...extractLearningKeywords(prompt)])].slice(0, 24),
    revisionCount: Number(skill.revisionCount || 0) + 1
  };

  if (totalOverrideCount >= 3) {
    nextSkill.replySteps = mergeTextWithExistingSkillImages(steps, skill);
    nextSkill.fallback = reply || skill.fallback || "";
    nextSkill.priority = Math.max(Number(skill.priority || 50), 75);
    nextSkill.allowAutoReply = skill.allowAutoReply !== false;
    nextSkill.lastAutoRevisedAt = override.at;
  }

  try {
    await replaceReplySkill(nextSkill);
    log("matched reply skill learned", {
      skillId: skill.id,
      prompt,
      reply,
      images,
      overrideCount: totalOverrideCount,
      autoRevised: totalOverrideCount >= 3
    });
    if (state.activeTool === "skill") renderToolContent();
  } catch (error) {
    log("matched reply skill learn failed", { error: error.message, skillId: skill.id, prompt });
  }
}

function findLearnedSkillForPrompt(prompt) {
  const keywords = extractLearningKeywords(prompt).map(normalizeForMatch).filter(Boolean);
  if (!keywords.length) return null;
  return state.replySkills.find((skill) => {
    if (!["learned", "manual"].includes(String(skill.source || ""))) return false;
    const haystack = normalizeForMatch([
      skill.title,
      ...(skill.keywords || []),
      ...(skill.samples || [])
    ].join("\n"));
    return keywords.some((keyword) => keyword && haystack.includes(keyword));
  }) || null;
}

function extractLearningKeywords(text) {
  const normalized = String(text || "").replace(/[，。！？、,.!?]/g, " ").trim();
  const pieces = normalized.split(/\s+/).filter((item) => item.length >= 2);
  const fallback = normalized.length > 12 ? [normalized.slice(0, 12), normalized.slice(-8)] : [normalized];
  return [...new Set(pieces.length ? pieces : fallback)].slice(0, 8);
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

function useAiSuggestion(suggestion = state.aiSuggestion) {
  if (!suggestion) {
    toast("还没有 AI 推荐内容。", true);
    return;
  }
  if (suggestion.noReply) {
    toast("这条推荐判断为无需回复。", true);
    return;
  }
  const text = getSuggestionTextForComposer(suggestion);
  el.replyText.value = text.replace(/^建议回复：?/, "");
  state.lastSuggestionUsed = true;
  el.replyText.focus();
}

function clearAiSuggestion() {
  state.aiSuggestion = null;
  state.aiSuggestions = [];
  state.lastSuggestionUsed = false;
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
  el.aiSuggestionCard.classList.toggle("is-hidden", !hasSuggestion);
  el.aiSuggestionCard.classList.toggle("is-no-reply", Boolean(state.aiSuggestion?.noReply));
  el.useAi.disabled = !hasSuggestion;
  el.sendAiSuggestion.disabled = !hasSuggestion;
  el.applyAiSuggestion.disabled = !hasSuggestion;
  if (el.refreshAiSuggestion) {
    el.refreshAiSuggestion.disabled = state.aiGenerating || !state.aiEnabled || !hasSuggestion;
    el.refreshAiSuggestion.textContent = state.aiGenerating ? "生成中" : "换一换";
  }
  if (hasSuggestion) {
    const disabled = Boolean(state.aiSuggestion.noReply);
    el.useAi.disabled = disabled;
    el.sendAiSuggestion.disabled = disabled;
    el.applyAiSuggestion.disabled = disabled;
    el.aiSuggestionTitle.textContent = getSuggestionPanelTitle(state.aiSuggestion);
    el.aiSuggestionText.innerHTML = suggestions.map((suggestion, index) => `
      <article class="ai-suggestion-option ${suggestion === state.aiSuggestion ? "is-active" : ""} ${suggestion.noReply ? "is-no-reply" : ""}" data-suggestion-index="${index}">
        <span class="ai-suggestion-index">${index + 1}.</span>
        <p>${escapeHtml(formatSuggestionText(suggestion))}</p>
        <div class="ai-suggestion-row-actions">
          ${suggestion.type === "optimize" && suggestion.skillId ? `<button class="mini-action primary" type="button" data-suggestion-action="update-skill" data-suggestion-index="${index}">更新skill</button>` : ""}
          <button class="mini-action" type="button" data-suggestion-action="apply" data-suggestion-index="${index}" ${suggestion.noReply ? "disabled" : ""}>采用</button>
          <button class="mini-action" type="button" data-suggestion-action="send" data-suggestion-index="${index}" ${suggestion.noReply ? "disabled" : ""}>发送</button>
        </div>
      </article>
    `).join("");
  }
  if (shouldKeepMessageBottom) {
    requestAnimationFrame(() => scheduleMessageListBottom());
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
    const nextHistoryList = el.toolContent.querySelector("[data-history-list]");
    if (nextHistoryList) {
      if (mode === "append") {
        restorePrependScroll(nextHistoryList, previousScrollHeight, previousScrollTop, { watchImages: true });
      } else if (mode === "merge") {
        if (wasNearBottom) {
          scrollElementToBottom(nextHistoryList, { watchImages: true });
        } else {
          restoreScrollTop(nextHistoryList, previousScrollTop, { watchImages: true });
        }
      } else if (forceBottom || (!keepPosition && wasNearBottom)) {
        scrollElementToBottom(nextHistoryList, { watchImages: true });
      } else {
        restoreScrollTop(nextHistoryList, previousScrollTop, { watchImages: true });
      }
      bindHistoryAutoLoad();
    }
  }
}

function normalizeOrder(item) {
  return {
    ...item,
    orderNo: item.parentOrderNo || item.orderNo || item.orderId || item.id || "订单",
    status: [item.statusStr, item.reStatusStr].filter(Boolean).join("/") || item.statusName || item.status || "未知",
    amount: item.payment ?? item.amount ?? item.orderAmount ?? item.price ?? "-",
    income: item.commission ?? item.income ?? item.commissionAmount ?? "-",
    commissionRate: item.commissionRate ?? item.rate ?? "-",
    buyerRebate: item.reUserBal ?? item.rebate ?? item.rebateAmount ?? item.backAmount ?? "-",
    profit: item.profit ?? item.profitAmount ?? "-",
    title: item.title || item.goodsName || item.remark || "",
    imageUrl: item.imageUrl || item.img || "",
    platformName: orderTypeLabel(state.orderType),
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

function setToolTab(tab) {
  state.activeTool = tab;
  document.querySelectorAll("[data-tool-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.toolTab === tab);
  });
  renderToolContent();
  if (
    tab === "history" &&
    state.historyMessages.length &&
    String(state.historyContactId || "") === String(getContactId(state.activeContact) || "")
  ) {
    scrollElementToBottom(el.toolContent.querySelector("[data-history-list]"), { watchImages: true });
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

function renderToolContent() {
  const contact = state.activeContact;
  if (!contact) {
    el.toolContent.innerHTML = '<div class="empty-state">请选择会话后查看右侧工具。</div>';
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
    return;
  }

  if (state.activeTool === "quick") {
    el.toolContent.innerHTML = renderQuickReplyPanel();
    return;
  }

  if (state.activeTool === "skill") {
    el.toolContent.innerHTML = renderSkillReplyPanel();
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
    return;
  }

  if (state.activeTool === "detail") {
    el.toolContent.innerHTML = `
      <section class="tool-section flat-section">
        <h3>账户流水 <button class="mini-action" type="button" data-action="refresh-details">刷新</button></h3>
        ${renderAccountDetails()}
      </section>
    `;
    return;
  }

  el.toolContent.innerHTML = renderHistoryPanel();
  bindHistoryAutoLoad();
  hydrateVisibleLinkCards(el.toolContent);
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
  const skills = filterReplySkills(suggestion);
  const autoText = state.skillAutoReply ? "自动回复已开" : "仅推荐";
  const learnText = state.skillAutoLearn ? "自动学习已开" : "自动学习已关";
  const matchText = suggestion?.skillId
    ? suggestion.noReply ? "命中无需回复 skill" : "命中可回复 skill"
    : "未命中";
  return `
    <section class="tool-section skill-section">
      <h3>
        <span>skill 回复</span>
        <button class="mini-action" type="button" data-action="refresh-skills">刷新</button>
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
      ${suggestion ? renderSkillMatchCard(suggestion) : '<div class="skill-match-card muted">当前上下文暂未命中 skill，会交给 AI 结合快捷回复兜底。</div>'}
      <div class="quick-list skill-list ${suggestion?.skillId ? "has-active-match" : ""}">
        ${skills.length ? skills.map((skill, index) => renderSkillRow(skill, index, suggestion)).join("") : '<p class="empty-state">没有匹配的 skill。</p>'}
      </div>
    </section>
  `;
}

function filterReplySkills(suggestion = null) {
  const keyword = normalizeForMatch(state.skillKeyword);
  const matchedId = suggestion?.skillId ? String(suggestion.skillId) : "";
  const skills = [...state.replySkills]
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
    .sort((a, b) => {
      const aMatched = matchedId && String(a.id) === matchedId;
      const bMatched = matchedId && String(b.id) === matchedId;
      if (aMatched !== bMatched) return aMatched ? -1 : 1;
      return Number(b.priority || 0) - Number(a.priority || 0);
    });
  return skills;
}

function renderSkillMatchCard(suggestion) {
  return `
    <div class="skill-match-card ${suggestion.noReply ? "no-reply" : ""}">
      <strong>${escapeHtml(suggestion.title || "skill 命中")}</strong>
      <p>${escapeHtml(formatSuggestionText(suggestion))}</p>
      <div class="skill-match-actions">
        <button class="mini-action" type="button" data-action="optimize-skill-match" ${suggestion.noReply ? "disabled" : ""}>优化</button>
        <button class="mini-action" type="button" data-action="apply-skill-match" ${suggestion.noReply ? "disabled" : ""}>采用</button>
        <button class="mini-action" type="button" data-action="send-skill-match" ${suggestion.noReply ? "disabled" : ""}>发送</button>
      </div>
    </div>
  `;
}

function renderSkillRow(skill, index, suggestion = null) {
  const status = skill.noReply ? "无需回复" : skill.allowAutoReply ? "可自动" : "推荐";
  const keywords = (skill.keywords || []).slice(0, 8).join("、") || "-";
  const content = skill.noReply ? (skill.fallback || "无需回复") : getSkillText(skill);
  const isMatched = suggestion?.skillId && String(skill.id) === String(suggestion.skillId);
  const isDimmed = suggestion?.skillId && !isMatched;
  const overrideCount = Array.isArray(skill.manualOverrides)
    ? skill.manualOverrides.reduce((sum, item) => sum + Number(item.count || 1), 0)
    : 0;
  return `
    <article class="quick-row skill-row ${skill.enabled === false ? "is-disabled" : ""} ${isMatched ? "is-matched" : ""} ${isDimmed ? "is-dimmed" : ""}">
      <span class="quick-index">${isMatched ? "中" : index + 1}</span>
      <button class="quick-copy" type="button" data-copy="${escapeAttr(content)}" title="复制 skill" aria-label="复制 skill"><i class="native-icon bfi-copy" aria-hidden="true"></i></button>
      <div class="quick-main">
        <strong>${escapeHtml(skill.title || "未命名 skill")} <em>${escapeHtml(status)}</em></strong>
        <p>${escapeHtml(content || "暂无话术")}</p>
        <small>关键词：${escapeHtml(keywords)}${overrideCount ? ` / 人工纠正 ${overrideCount} 次` : ""}</small>
      </div>
      <div class="quick-actions">
        <button class="mini-action" type="button" data-skill-apply="${escapeAttr(skill.id)}" ${skill.noReply ? "disabled" : ""}>采用</button>
        <button class="mini-action" type="button" data-skill-send="${escapeAttr(skill.id)}" ${skill.noReply ? "disabled" : ""}>发送</button>
        <button class="mini-action" type="button" data-skill-optimize="${escapeAttr(skill.id)}" ${skill.noReply ? "disabled" : ""}>优化</button>
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

function normalizeDbType(value) {
  const text = String(value ?? "").trim();
  if (!text) return "0";
  const lower = text.toLowerCase();
  const named = DB_TYPE_OPTIONS.find((item) => item.label.toLowerCase() === lower);
  if (named) return named.value;
  return text;
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
        ${order.imageUrl ? `<img class="order-image" src="${escapeAttr(normalizeImageUrl(order.imageUrl))}" alt="">` : `<span class="order-image order-image-fallback">${escapeHtml(order.platformName.slice(0, 1))}</span>`}
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
  const previewTarget = event.target.closest("[data-link-preview]");
  if (previewTarget) {
    event.preventDefault();
    showLinkPreview(previewTarget.dataset.linkPreview || "");
    return;
  }

  const openTarget = event.target.closest("[data-open-link]");
  if (openTarget) {
    event.preventDefault();
    openExternalLink(openTarget.dataset.openLink || "");
    return;
  }

  const copyTarget = event.target.closest("[data-copy]");
  if (copyTarget) {
    copyToClipboard(copyTarget.dataset.copy || "");
    return;
  }

  const quickSendTarget = event.target.closest("[data-quick-send]");
  if (quickSendTarget) {
    el.replyText.value = quickSendTarget.dataset.quickSend || "";
    sendText();
    return;
  }

  const quickFillTarget = event.target.closest("[data-quick-fill]");
  if (quickFillTarget) {
    el.replyText.value = quickFillTarget.dataset.quickFill || "";
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

  const faqCategoryTarget = event.target.closest("[data-faq-category]");
  if (faqCategoryTarget) {
    updateFaqKeyword();
    state.faqCategory = faqCategoryTarget.dataset.faqCategory;
    state.faqPage = 1;
    loadFaq();
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

function mergeTextWithExistingSkillImages(textSteps, skill) {
  const existingImageSteps = getSkillSteps(skill).filter((step) => step.type === "image");
  const nextTextSteps = textSteps
    .filter((step) => step.type !== "image" && String(step.content || "").trim())
    .map((step) => ({ type: "text", content: String(step.content || "").trim() }));
  const nextImageSteps = textSteps
    .filter((step) => step.type === "image" && (step.url || step.content))
    .map((step) => ({
      type: "image",
      url: step.url || step.content || "",
      label: step.label || "人工回复图片"
    }));
  return [...nextTextSteps, ...nextImageSteps, ...existingImageSteps].slice(0, 8);
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
    await replaceReplySkill({
      ...skill,
      replySteps: mergeTextWithExistingSkillImages([{ type: "text", content: text }], skill),
      fallback: text,
      revisionCount: Number(skill.revisionCount || 0) + 1,
      lastOptimizedAt: new Date().toISOString()
    });
    state.lastSuggestionUsed = true;
    if (state.activeTool === "skill") renderToolContent();
    toast("已把优化后的话术更新到当前 skill。");
  } catch (error) {
    toast(`更新 skill 失败：${error.message}`, true);
  }
}

function applySkillById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  appendAiSuggestion({
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    content: getSkillText(skill),
    steps: getSkillSteps(skill)
  });
  useAiSuggestion();
}

function sendSkillById(id) {
  const skill = getSkillById(id);
  if (!skill) return;
  sendSuggestionSteps({
    type: "skill",
    title: `skill：${skill.title}`,
    skillId: skill.id,
    content: getSkillText(skill),
    steps: getSkillSteps(skill)
  });
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
  if (!state.aiApiKey) {
    showAiSettings();
    toast("请先填写 AI API 密钥。", true);
    return;
  }

  const skillText = getSkillText(skill);
  if (!skillText) {
    toast("这条 skill 没有可优化的话术。", true);
    return;
  }

  const draftText = el.replyText?.value.trim() || "";
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
  menu.style.left = `${state.contextMenu.x}px`;
  menu.style.top = `${state.contextMenu.y}px`;

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
      await api("/Conversation/AccessInAll", { accountId: getAccountId(contact) });
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
      await loadContacts({ preserveScroll: true });
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
  el.toastHost.appendChild(node);
  setTimeout(() => node.remove(), 3600);
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

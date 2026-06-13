const DEFAULT_AI_BASE_URL = "https://sub2.sn55.cn/";
const DEFAULT_AI_API_KEY = "sk-b9d9c696d71c86d875a0379dcbc0eca8e5863884022405bb031d95341951485b";
const DEFAULT_AI_MODEL = "gpt-5.4-mini";
const DEFAULT_AI_PROVIDER = "sub2";
const AI_PROVIDER_STORAGE_KEY = "youchat.ai.provider";
const AI_PROVIDER_SETTINGS_STORAGE_KEY = "youchat.ai.providers";
const AI_PRESETS = {
  sub2: {
    label: "sub2 中转",
    baseUrl: DEFAULT_AI_BASE_URL,
    apiKey: DEFAULT_AI_API_KEY,
    model: DEFAULT_AI_MODEL,
    authType: "bearer",
    temperature: 0.35
  },
  deepseek: {
    label: "DeepSeek 官方",
    baseUrl: "https://api.deepseek.com",
    apiKey: "",
    model: "deepseek-v4-flash",
    authType: "bearer",
    temperature: 0.35
  },
  codebuddy: {
    label: "CodeBuddy",
    baseUrl: "https://copilot.tencent.com/v2",
    apiKey: "ck_foknyust454w.9e9umAeuAKEGdz0QlSEtyCl8U4AsQUVEp3OUnARhXw0",
    model: "deepseek-v3.1",
    authType: "x-api-key",
    temperature: 0.35
  }
};

const COMPLETED_TRAINING_STATUSES = new Set(["approved", "optimized", "disabled", "overrides_cleared"]);

const state = {
  date: getTodayKey(),
  scope: "today",
  onlyIssues: true,
  currentIndex: 0,
  items: [],
  summary: null,
  loading: false,
  aiBusy: false
};

const el = {};

function $(id) {
  return document.getElementById(id);
}

function init() {
  ["toastHost", "trainingDate", "onlyIssues", "summaryGrid", "summaryLines", "trainingCount", "trainingList", "refreshTraining", "sampleTraining"].forEach((id) => {
    el[id] = $(id);
  });
  el.trainingDate.value = state.date;
  el.onlyIssues.checked = state.onlyIssues;
  bindEvents();
  loadTraining();
}

function bindEvents() {
  el.refreshTraining.addEventListener("click", () => loadTraining({ preserveIndex: true }));
  el.sampleTraining.addEventListener("click", sampleTrainingReplies);
  el.trainingDate.addEventListener("change", () => {
    state.date = el.trainingDate.value || getTodayKey();
    state.currentIndex = 0;
    loadTraining();
  });
  el.onlyIssues.addEventListener("change", () => {
    state.onlyIssues = el.onlyIssues.checked;
    state.currentIndex = 0;
    renderTraining();
  });
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scope = button.dataset.scope || "today";
      state.currentIndex = 0;
      document.querySelectorAll("[data-scope]").forEach((item) => item.classList.toggle("is-active", item === button));
      loadTraining();
    });
  });
  el.trainingList.addEventListener("click", handleTrainingClick);
  document.addEventListener("keydown", handleTrainingKeydown);
}

async function loadTraining(options = {}) {
  const previousId = getVisibleItems()[state.currentIndex]?.id || "";
  state.loading = true;
  renderTraining();
  try {
    const response = await fetch(`/local/skill-training?date=${encodeURIComponent(state.date)}&scope=${encodeURIComponent(state.scope)}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(payload.message || `HTTP ${response.status}`);
    state.items = Array.isArray(payload.items) ? payload.items : [];
    state.summary = payload.summary || null;
    if (options.preserveIndex && previousId) {
      const nextIndex = getVisibleItems().findIndex((item) => String(item.id) === String(previousId));
      state.currentIndex = nextIndex >= 0 ? nextIndex : Math.min(state.currentIndex, Math.max(0, getVisibleItems().length - 1));
    }
    toast("已整理 skill 训练项。");
  } catch (error) {
    toast(`训练数据加载失败：${error.message}`, true);
    state.items = [];
    state.summary = null;
  } finally {
    state.loading = false;
    renderTraining();
  }
}

async function sampleTrainingReplies() {
  const previousId = getVisibleItems()[state.currentIndex]?.id || "";
  el.sampleTraining.disabled = true;
  el.sampleTraining.textContent = "采样中";
  try {
    const response = await fetch("/local/skill-training/sample", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: state.date,
        scope: state.scope,
        contactLimit: 18,
        messageLimit: 80
      })
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(payload.message || `HTTP ${response.status}`);
    state.items = Array.isArray(payload.items) ? payload.items : [];
    state.summary = payload.summary || state.summary;
    const nextIndex = getVisibleItems().findIndex((item) => String(item.id) === String(previousId));
    state.currentIndex = nextIndex >= 0 ? nextIndex : Math.min(state.currentIndex, Math.max(0, getVisibleItems().length - 1));
    renderTraining();
    const sampled = payload.sampled || {};
    toast(`已采样 ${sampled.sampledPairs || 0} 组人工回复，新增 ${sampled.created || 0} 条，更新 ${sampled.updated || 0} 条。`);
  } catch (error) {
    toast(`闲时采样失败：${error.message}`, true);
  } finally {
    el.sampleTraining.disabled = false;
    el.sampleTraining.textContent = "闲时采样";
  }
}

function renderTraining() {
  renderSummary();
  const items = getVisibleItems();
  clampCurrentIndex(items);
  el.trainingCount.textContent = state.loading
    ? "加载中"
    : items.length
      ? `第 ${state.currentIndex + 1} / ${items.length} 条`
      : "0 条";

  if (state.loading) {
    el.trainingList.innerHTML = renderSkeleton();
    return;
  }

  if (!items.length) {
    el.trainingList.innerHTML = '<div class="training-empty">当前没有需要复核的 skill。切到“全部”可以查看已批准或较早的学习记录。</div>';
    return;
  }

  const item = items[state.currentIndex];
  el.trainingList.innerHTML = `
    <div class="training-queue">
      <div class="training-queue-bar">
        <div>
          <strong>${escapeHtml(item.title || "未命名 skill")}</strong>
          <span>${escapeHtml(buildQueueMeta(item, items.length))}</span>
        </div>
        <div class="training-queue-actions">
          <button class="mini-action" type="button" data-local-action="prev-item" ${state.currentIndex <= 0 ? "disabled" : ""}>上一条</button>
          <button class="mini-action" type="button" data-local-action="next-item" ${state.currentIndex >= items.length - 1 ? "disabled" : ""}>下一条</button>
        </div>
      </div>
      ${renderQueueRail(items)}
      ${renderTrainingItem(item)}
    </div>
  `;
}

function renderSummary() {
  const summary = state.summary || {};
  const cards = [
    ["待审", summary.total || 0],
    ["需复核", summary.issueCount || 0],
    ["疑似脏学习", summary.dirtyCount || 0],
    ["学习覆盖", summary.overrideCount || 0],
    ["带图片", summary.imageCount || 0]
  ];
  el.summaryGrid.innerHTML = cards.map(([label, value]) => `
    <div class="training-stat">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
  const lines = Array.isArray(summary.lines) && summary.lines.length
    ? summary.lines
    : ["还没有生成总结。"];
  el.summaryLines.innerHTML = lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function getVisibleItems() {
  if (!state.onlyIssues) return state.items;
  return state.items.filter((item) => isIssueItem(item));
}

function isCompletedItem(item) {
  return COMPLETED_TRAINING_STATUSES.has(String(item.trainingStatus || ""));
}

function isIssueItem(item) {
  if (isCompletedItem(item)) return false;
  if (item.trainingStatus === "needs_optimization" || item.learningMode === "review_queue") return true;
  return (item.reasons || []).some((reason) => ["danger", "warn"].includes(reason.level));
}

function clampCurrentIndex(items = getVisibleItems()) {
  if (!items.length) {
    state.currentIndex = 0;
    return;
  }
  state.currentIndex = Math.max(0, Math.min(state.currentIndex, items.length - 1));
}

function buildQueueMeta(item, total) {
  return [
    `第 ${state.currentIndex + 1} / ${total} 条`,
    item.manualOverrideCount ? `相似样本 ${item.manualOverrideCount}` : "",
    item.replyVariants?.length ? `话术变体 ${item.replyVariants.length}` : "",
    item.latestAt ? `最近 ${formatDateTime(item.latestAt)}` : ""
  ].filter(Boolean).join(" · ");
}

function renderQueueRail(items) {
  const maxDots = 16;
  const start = Math.max(0, Math.min(state.currentIndex - 7, Math.max(0, items.length - maxDots)));
  const visible = items.slice(start, start + maxDots);
  return `
    <div class="training-queue-rail" aria-label="训练进度">
      ${start > 0 ? '<span class="queue-ellipsis">...</span>' : ""}
      ${visible.map((item, offset) => {
        const index = start + offset;
        const status = item.reasons?.some((reason) => reason.level === "danger")
          ? "danger"
          : item.reasons?.some((reason) => reason.level === "warn") ? "warn" : "ok";
        return `<button class="queue-dot ${status} ${index === state.currentIndex ? "is-active" : ""}" type="button" data-local-action="go-item" data-index="${index}" title="${escapeAttr(item.title || "")}"></button>`;
      }).join("")}
      ${start + visible.length < items.length ? '<span class="queue-ellipsis">...</span>' : ""}
    </div>
  `;
}

function renderTrainingItem(item) {
  const latestOverride = item.latestOverride || null;
  const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
  const latestReplyText = latestOverride
    ? (latestOverride.reply || (latestOverride.imageUrls?.length ? "[图片回复]" : "-"))
    : "-";
  const classes = [
    "training-card",
    item.enabled === false ? "is-disabled" : "",
    item.reasons?.some((reason) => reason.level === "danger") ? "has-danger" : "",
    item.trainingStatus === "needs_optimization" ? "needs-review" : ""
  ].filter(Boolean).join(" ");
  return `
    <article class="${classes}" data-skill-id="${escapeAttr(item.id)}">
      <header class="training-card-head">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(formatMetaLine(item))}</span>
        </div>
        <div class="training-chip-row">
          ${(item.reasons || []).map((reason) => `<span class="training-chip ${escapeAttr(reason.level)}">${escapeHtml(reason.label)}</span>`).join("")}
        </div>
      </header>

      <div class="training-card-grid">
        <section class="training-block training-cluster">
          <h3>相似场景</h3>
          <dl class="training-kv">
            <div><dt>关键词</dt><dd>${escapeHtml((item.keywords || []).join("、") || "-")}</dd></div>
            <div><dt>样本</dt><dd>${escapeHtml((item.samples || []).slice(0, 5).join(" / ") || "-")}</dd></div>
            <div><dt>阶段</dt><dd>${escapeHtml((item.stageLabels || []).join(" / ") || "-")}</dd></div>
            <div><dt>最近</dt><dd>${latestOverride ? escapeHtml(latestOverride.prompt || "-") : "-"}</dd></div>
          </dl>
          ${renderPromptVariants(item.promptVariants)}
          ${latestOverride ? `
            <div class="training-override">
              <span>最近人工回复</span>
              <p>${escapeHtml(latestReplyText)}</p>
              ${latestOverride.imageUrls?.length ? renderImageStrip(latestOverride.imageUrls) : ""}
            </div>
          ` : ""}
        </section>

        <section class="training-block">
          <h3>当前入库</h3>
          <pre>${escapeHtml(item.currentText || "无文字话术")}</pre>
          ${imageUrls.length ? renderImageStrip(imageUrls) : ""}
          ${renderReplyVariants(item.replyVariants)}
        </section>

        <section class="training-block training-editor">
          <h3>审核编辑</h3>
          <div class="training-editor-row">
            <label>
              <span>标题</span>
              <input data-field="title" value="${escapeAttr(item.title)}" />
            </label>
            <label>
              <span>平台</span>
              <input data-field="platformKey" value="${escapeAttr(item.platformKey || "")}" placeholder="taobao / jd / pdd" />
            </label>
            <label>
              <span>意图</span>
              <input data-field="intentKey" value="${escapeAttr(item.intentKey || "")}" placeholder="order_missing / withdraw_query" />
            </label>
          </div>
          <label>
            <span>关键词</span>
            <input data-field="keywords" value="${escapeAttr((item.keywords || []).join(" "))}" />
          </label>
          <label>
            <span>样本问题</span>
            <textarea data-field="samples" rows="2" placeholder="每行或空格分隔一个样本">${escapeHtml((item.samples || []).join("\n"))}</textarea>
          </label>
          <label>
            <span>回复文案</span>
            <textarea data-field="replyText" rows="6" placeholder="留空后保存优化会变成仅图片或空话术">${escapeHtml(item.proposedText || "")}</textarea>
          </label>
          <label>
            <span>图片 URL</span>
            <textarea data-field="imageUrls" rows="3" placeholder="每行一个可发送图片 URL">${escapeHtml(imageUrls.join("\n"))}</textarea>
          </label>
          <label>
            <span>备注</span>
            <input data-field="note" value="${escapeAttr(item.trainingNote || "")}" placeholder="这次为什么批准或优化" />
          </label>
          <div class="training-toggles">
            <label><input data-field="allowAutoReply" type="checkbox" ${item.allowAutoReply ? "checked" : ""}> 可自动回复</label>
            <label><input data-field="noReply" type="checkbox" ${item.noReply ? "checked" : ""}> 无需回复</label>
          </div>
        </section>
      </div>

      <footer class="training-card-actions">
        <button class="mini-action" type="button" data-local-action="use-current">填入当前</button>
        ${latestOverride ? '<button class="mini-action" type="button" data-local-action="use-override">填入最近人工</button>' : ""}
        ${latestOverride?.imageUrls?.length ? '<button class="mini-action" type="button" data-local-action="use-override-images">填入最近图片</button>' : ""}
        <button class="mini-action" type="button" data-local-action="ai-organize">AI 整理</button>
        <span class="training-action-spacer"></span>
        <button class="mini-action ghost" type="button" data-training-action="needs-review">标记待优化</button>
        <button class="mini-action" type="button" data-training-action="approve">批准启用</button>
        <button class="mini-action primary" type="button" data-training-action="optimize">保存优化</button>
        ${item.manualOverrideCount ? '<button class="mini-action ghost" type="button" data-training-action="clear-overrides">清空覆盖</button>' : ""}
        <button class="mini-action danger" type="button" data-training-action="disable">停用</button>
        <button class="mini-action danger ghost" type="button" data-training-action="delete">删除</button>
      </footer>
    </article>
  `;
}

function renderPromptVariants(prompts = []) {
  const values = Array.isArray(prompts) ? prompts.slice(0, 5) : [];
  if (!values.length) return "";
  return `
    <div class="training-mini-list">
      <span>相似问法</span>
      ${values.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
    </div>
  `;
}

function renderReplyVariants(variants = []) {
  const values = Array.isArray(variants) ? variants.slice(0, 4) : [];
  if (!values.length) return "";
  return `
    <div class="training-variants">
      <span>人工回复变体</span>
      ${values.map((variant, index) => `
        <div class="training-variant">
          <button class="variant-fill" type="button" data-local-action="use-variant" data-index="${index}">填入</button>
          <strong>${Number(variant.count || 1)} 次</strong>
          <p>${escapeHtml(variant.reply || (variant.imageUrls?.length ? "[图片回复]" : "-"))}</p>
          ${variant.imageUrls?.length ? renderImageStrip(variant.imageUrls.slice(0, 4)) : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function formatMetaLine(item) {
  return [
    item.source === "learned" ? "自动学习" : item.source === "manual" ? "手动沉淀" : item.source || "内置",
    item.learningMode === "review_queue" ? "候选池" : "",
    item.platformKey ? `平台 ${item.platformKey}` : "",
    item.intentKey ? `意图 ${item.intentKey}` : "",
    item.learningBucketKey ? `分组 ${compactText(item.learningBucketKey, 36)}` : "",
    item.latestAt ? `最近 ${formatDateTime(item.latestAt)}` : ""
  ].filter(Boolean).join(" / ");
}

function renderImageStrip(urls) {
  const values = Array.isArray(urls) ? urls.filter(Boolean) : [];
  if (!values.length) return "";
  return `
    <div class="training-images">
      ${values.map((url, index) => `
        <a href="${escapeAttr(url)}" target="_blank" rel="noreferrer" title="打开图片 ${index + 1}">
          <img src="${escapeAttr(url)}" alt="skill 图片 ${index + 1}" loading="lazy" />
        </a>
      `).join("")}
    </div>
  `;
}

function renderSkeleton() {
  return `
    <article class="training-card training-skeleton">
      <div></div><div></div><div></div>
    </article>
  `;
}

async function handleTrainingClick(event) {
  const localAction = event.target.closest("[data-local-action]");
  if (localAction) {
    await applyLocalAction(localAction);
    return;
  }

  const actionTarget = event.target.closest("[data-training-action]");
  if (!actionTarget) return;
  const card = actionTarget.closest("[data-skill-id]");
  if (!card) return;
  const action = actionTarget.dataset.trainingAction;
  if (["delete", "disable", "clear-overrides"].includes(action)) {
    const ok = window.confirm(action === "delete" ? "确定删除这条学习记录吗？" : action === "disable" ? "确定停用这条 skill 吗？" : "确定清空这条 skill 的学习覆盖吗？");
    if (!ok) return;
  }
  await submitTrainingAction(card, action);
}

function handleTrainingKeydown(event) {
  if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveQueue(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveQueue(1);
  }
}

async function applyLocalAction(button) {
  const action = button.dataset.localAction;
  if (action === "prev-item") return moveQueue(-1);
  if (action === "next-item") return moveQueue(1);
  if (action === "go-item") {
    state.currentIndex = Number(button.dataset.index || 0);
    renderTraining();
    return;
  }

  const card = button.closest("[data-skill-id]");
  const item = state.items.find((entry) => String(entry.id) === String(card?.dataset.skillId));
  if (!card || !item) return;
  const replyTextarea = card.querySelector('[data-field="replyText"]');
  const imageTextarea = card.querySelector('[data-field="imageUrls"]');
  const latestOverride = item.latestOverride || null;

  if (action === "use-current") {
    if (replyTextarea) replyTextarea.value = item.currentText || "";
    if (imageTextarea) imageTextarea.value = (item.storedImageUrls || item.imageUrls || []).join("\n");
    replyTextarea?.focus();
  } else if (action === "use-override") {
    if (replyTextarea) replyTextarea.value = latestOverride?.reply || "";
    if (imageTextarea && latestOverride?.imageUrls?.length) imageTextarea.value = latestOverride.imageUrls.join("\n");
    replyTextarea?.focus();
  } else if (action === "use-override-images") {
    if (imageTextarea) imageTextarea.value = (latestOverride?.imageUrls || []).join("\n");
    imageTextarea?.focus();
  } else if (action === "use-variant") {
    const variant = item.replyVariants?.[Number(button.dataset.index || 0)];
    if (!variant) return;
    if (replyTextarea) replyTextarea.value = variant.reply || "";
    if (imageTextarea) imageTextarea.value = (variant.imageUrls || []).join("\n");
    replyTextarea?.focus();
  } else if (action === "ai-organize") {
    await organizeTrainingItemWithAi(card, item);
  }
}

function moveQueue(delta) {
  const items = getVisibleItems();
  if (!items.length) return;
  state.currentIndex = Math.max(0, Math.min(items.length - 1, state.currentIndex + delta));
  renderTraining();
}

async function submitTrainingAction(card, action) {
  const skillId = card.dataset.skillId;
  const oldIndex = state.currentIndex;
  const patch = collectPatch(card);
  setCardBusy(card, true);
  try {
    const response = await fetch("/local/skill-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        skillId,
        date: state.date,
        scope: state.scope,
        patch
      })
    });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(payload.message || `HTTP ${response.status}`);
    state.items = Array.isArray(payload.items) ? payload.items : [];
    state.summary = payload.summary || state.summary;
    advanceAfterAction(skillId, oldIndex);
    renderTraining();
    toast(actionLabel(action));
  } catch (error) {
    toast(`训练保存失败：${error.message}`, true);
    setCardBusy(card, false);
  }
}

function advanceAfterAction(skillId, oldIndex) {
  const items = getVisibleItems();
  if (!items.length) {
    state.currentIndex = 0;
    return;
  }
  const sameIndex = items.findIndex((item) => String(item.id) === String(skillId));
  if (sameIndex >= 0) {
    state.currentIndex = Math.min(sameIndex + 1, items.length - 1);
    return;
  }
  state.currentIndex = Math.min(oldIndex, items.length - 1);
}

function collectPatch(card) {
  return {
    title: card.querySelector('[data-field="title"]')?.value || "",
    platformKey: card.querySelector('[data-field="platformKey"]')?.value || "",
    intentKey: card.querySelector('[data-field="intentKey"]')?.value || "",
    keywords: card.querySelector('[data-field="keywords"]')?.value || "",
    samples: card.querySelector('[data-field="samples"]')?.value || "",
    replyText: card.querySelector('[data-field="replyText"]')?.value || "",
    imageUrls: card.querySelector('[data-field="imageUrls"]')?.value || "",
    note: card.querySelector('[data-field="note"]')?.value || "",
    allowAutoReply: Boolean(card.querySelector('[data-field="allowAutoReply"]')?.checked),
    noReply: Boolean(card.querySelector('[data-field="noReply"]')?.checked)
  };
}

async function organizeTrainingItemWithAi(card, item) {
  if (state.aiBusy) return;
  const aiConfig = getTrainingAiConfig();
  if (!aiConfig.apiKey) {
    toast("AI 密钥为空，先在工作台右上角 AI 设置里配置。", true);
    return;
  }

  state.aiBusy = true;
  setCardBusy(card, true);
  try {
    const response = await fetch("/ai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...aiConfig,
        messages: [
          {
            role: "system",
            content: [
              "你是悠聊客服 skill 训练助手。",
              "请把相似客户问题、人工回复变体和当前入库话术整理成一个稳定 skill。",
              "不要编造订单、余额、返利状态或后台查询结果。",
              "如果这是后续追问，不要覆盖首次答复流程；把建议写成适合当前阶段的引导。",
              "只返回 JSON 对象，字段为 title、keywords、samples、replyText、note、allowAutoReply、noReply。keywords 和 samples 返回数组。"
            ].join("\n")
          },
          {
            role: "user",
            content: buildAiTrainingPrompt(item, collectPatch(card))
          }
        ]
      })
    });
    const text = await response.text();
    const payload = parsePayload(text);
    if (!response.ok) throw new Error(getMessage(payload) || `HTTP ${response.status}`);
    const patch = parseAiTrainingPatch(getAiMessageText(payload));
    if (!patch) throw new Error("AI 没有返回可识别的整理结果");
    applyAiTrainingPatch(card, patch);
    toast("AI 已整理为候选话术，请确认后保存。");
  } catch (error) {
    toast(`AI 整理失败：${error.message}`, true);
  } finally {
    state.aiBusy = false;
    setCardBusy(card, false);
  }
}

function buildAiTrainingPrompt(item, currentPatch) {
  return JSON.stringify({
    title: item.title,
    platformKey: item.platformKey,
    intentKey: item.intentKey,
    learningStage: item.learningStage,
    stageLabels: item.stageLabels || [],
    keywords: item.keywords || [],
    samples: item.samples || [],
    promptVariants: item.promptVariants || [],
    currentStoredReply: item.currentText || "",
    currentEditorReply: currentPatch.replyText || "",
    currentImages: splitLines(currentPatch.imageUrls),
    replyVariants: (item.replyVariants || []).map((variant) => ({
      count: variant.count,
      reply: variant.reply,
      prompts: variant.prompts || [],
      imageCount: Array.isArray(variant.imageUrls) ? variant.imageUrls.length : 0,
      learningStage: variant.learningStage || ""
    }))
  }, null, 2);
}

function applyAiTrainingPatch(card, patch) {
  const setValue = (field, value) => {
    const node = card.querySelector(`[data-field="${field}"]`);
    if (!node || value === undefined || value === null) return;
    node.value = Array.isArray(value) ? value.join(field === "samples" ? "\n" : " ") : String(value);
  };
  setValue("title", patch.title);
  setValue("keywords", patch.keywords);
  setValue("samples", patch.samples);
  setValue("replyText", patch.replyText);
  setValue("note", patch.note);
  const allow = card.querySelector('[data-field="allowAutoReply"]');
  const noReply = card.querySelector('[data-field="noReply"]');
  if (allow && typeof patch.allowAutoReply === "boolean") allow.checked = patch.allowAutoReply;
  if (noReply && typeof patch.noReply === "boolean") noReply.checked = patch.noReply;
}

function getTrainingAiConfig() {
  const providerId = localStorage.getItem(AI_PROVIDER_STORAGE_KEY) || DEFAULT_AI_PROVIDER;
  const storedProviders = parsePayload(localStorage.getItem(AI_PROVIDER_SETTINGS_STORAGE_KEY) || "{}") || {};
  const stored = storedProviders?.[providerId] || {};
  const preset = AI_PRESETS[providerId] || AI_PRESETS.sub2;
  return {
    baseUrl: stored.baseUrl || preset.baseUrl,
    apiKey: stored.apiKey || preset.apiKey,
    model: stored.model || preset.model,
    authType: stored.authType || preset.authType,
    temperature: Number.isFinite(Number(stored.temperature)) ? Number(stored.temperature) : preset.temperature
  };
}

function parseAiTrainingPatch(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  const jsonText = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    const match = jsonText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        return { replyText: raw };
      }
    }
  }
  return { replyText: raw };
}

function getAiMessageText(payload) {
  return String(payload?.choices?.[0]?.message?.content || payload?.choices?.[0]?.delta?.content || payload?.message || "");
}

function splitLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setCardBusy(card, busy) {
  card.classList.toggle("is-busy", busy);
  card.querySelectorAll("button, input, textarea").forEach((node) => {
    node.disabled = busy;
  });
}

function actionLabel(action) {
  const map = {
    approve: "已批准并启用这条 skill。",
    optimize: "已保存优化话术，并进入下一条。",
    "needs-review": "已标记为待优化，并进入下一条。",
    disable: "已停用这条 skill。",
    delete: "已删除这条学习记录。",
    "clear-overrides": "已清空学习覆盖。"
  };
  return map[action] || "训练已保存。";
}

function toast(message, isError = false) {
  const item = document.createElement("div");
  item.className = `toast ${isError ? "error" : ""}`;
  item.textContent = message;
  el.toastHost.appendChild(item);
  window.setTimeout(() => item.remove(), isError ? 4200 : 2600);
}

function getTodayKey() {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function compactText(value, max = 60) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function parsePayload(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getMessage(payload) {
  return payload?.message || payload?.error?.message || payload?.error || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

document.addEventListener("DOMContentLoaded", init);

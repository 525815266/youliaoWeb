const state = {
  date: getTodayKey(),
  scope: "today",
  onlyIssues: true,
  items: [],
  summary: null,
  loading: false
};

const el = {};

function $(id) {
  return document.getElementById(id);
}

function init() {
  ["toastHost", "trainingDate", "onlyIssues", "summaryGrid", "summaryLines", "trainingCount", "trainingList", "refreshTraining"].forEach((id) => {
    el[id] = $(id);
  });
  el.trainingDate.value = state.date;
  el.onlyIssues.checked = state.onlyIssues;
  bindEvents();
  loadTraining();
}

function bindEvents() {
  el.refreshTraining.addEventListener("click", loadTraining);
  el.trainingDate.addEventListener("change", () => {
    state.date = el.trainingDate.value || getTodayKey();
    loadTraining();
  });
  el.onlyIssues.addEventListener("change", () => {
    state.onlyIssues = el.onlyIssues.checked;
    renderTraining();
  });
  document.querySelectorAll("[data-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scope = button.dataset.scope || "today";
      document.querySelectorAll("[data-scope]").forEach((item) => item.classList.toggle("is-active", item === button));
      loadTraining();
    });
  });
  el.trainingList.addEventListener("click", handleTrainingClick);
}

async function loadTraining() {
  state.loading = true;
  renderTraining();
  try {
    const response = await fetch(`/local/skill-training?date=${encodeURIComponent(state.date)}&scope=${encodeURIComponent(state.scope)}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || payload.success === false) throw new Error(payload.message || `HTTP ${response.status}`);
    state.items = Array.isArray(payload.items) ? payload.items : [];
    state.summary = payload.summary || null;
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

function renderTraining() {
  renderSummary();
  const items = getVisibleItems();
  el.trainingCount.textContent = state.loading ? "加载中" : `${items.length} 条`;
  if (state.loading) {
    el.trainingList.innerHTML = renderSkeleton();
    return;
  }
  el.trainingList.innerHTML = items.length
    ? items.map(renderTrainingItem).join("")
    : '<div class="training-empty">当前没有需要复核的 skill。切到“全部”可以查看已批准或较早的学习记录。</div>';
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

function isIssueItem(item) {
  if (item.trainingStatus === "needs_optimization") return true;
  if (item.enabled === false) return false;
  return (item.reasons || []).some((reason) => ["danger", "warn"].includes(reason.level));
}

function renderTrainingItem(item) {
  const latestOverride = item.latestOverride || null;
  const imageUrls = Array.isArray(item.imageUrls) ? item.imageUrls : [];
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
        <section class="training-block">
          <h3>触发与来源</h3>
          <dl class="training-kv">
            <div><dt>关键词</dt><dd>${escapeHtml((item.keywords || []).join("、") || "-")}</dd></div>
            <div><dt>样本</dt><dd>${escapeHtml((item.samples || []).slice(0, 3).join(" / ") || "-")}</dd></div>
            <div><dt>最近覆盖</dt><dd>${latestOverride ? escapeHtml(latestOverride.prompt || "-") : "-"}</dd></div>
          </dl>
          ${latestOverride ? `
            <div class="training-override">
              <span>最近人工回复</span>
              <p>${escapeHtml(latestOverride.reply || latestOverride.imageUrls?.length ? latestOverride.reply || "[图片回复]" : "-")}</p>
            </div>
          ` : ""}
        </section>

        <section class="training-block">
          <h3>当前入库话术</h3>
          <pre>${escapeHtml(item.currentText || "无文字话术")}</pre>
          ${imageUrls.length ? renderImageStrip(imageUrls) : ""}
        </section>

        <section class="training-block training-editor">
          <h3>批复后话术</h3>
          <label>
            <span>标题</span>
            <input data-field="title" value="${escapeAttr(item.title)}" />
          </label>
          <label>
            <span>关键词</span>
            <input data-field="keywords" value="${escapeAttr((item.keywords || []).join(" "))}" />
          </label>
          <label>
            <span>回复文案</span>
            <textarea data-field="replyText" rows="6" placeholder="留空后保存优化会变成仅图片或空话术">${escapeHtml(item.proposedText || "")}</textarea>
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
        ${latestOverride ? '<button class="mini-action" type="button" data-local-action="use-override">填入最近人工回复</button>' : ""}
        <span class="training-action-spacer"></span>
        <button class="mini-action ghost" type="button" data-training-action="needs-review">标记待优化</button>
        <button class="mini-action" type="button" data-training-action="approve">批准原样</button>
        <button class="mini-action primary" type="button" data-training-action="optimize">保存优化</button>
        ${item.manualOverrideCount ? '<button class="mini-action ghost" type="button" data-training-action="clear-overrides">清空覆盖</button>' : ""}
        <button class="mini-action danger" type="button" data-training-action="disable">停用</button>
        <button class="mini-action danger ghost" type="button" data-training-action="delete">删除</button>
      </footer>
    </article>
  `;
}

function formatMetaLine(item) {
  return [
    item.source === "learned" ? "自动学习" : item.source === "manual" ? "手动沉淀" : item.source || "内置",
    item.platformKey ? `平台 ${item.platformKey}` : "",
    item.intentKey ? `意图 ${item.intentKey}` : "",
    item.latestAt ? `最近 ${formatDateTime(item.latestAt)}` : ""
  ].filter(Boolean).join(" / ");
}

function renderImageStrip(urls) {
  return `
    <div class="training-images">
      ${urls.map((url, index) => `
        <a href="${escapeAttr(url)}" target="_blank" rel="noreferrer" title="打开图片 ${index + 1}">
          <img src="${escapeAttr(url)}" alt="skill 图片 ${index + 1}" loading="lazy" />
        </a>
      `).join("")}
    </div>
  `;
}

function renderSkeleton() {
  return Array.from({ length: 3 }).map(() => `
    <article class="training-card training-skeleton">
      <div></div><div></div><div></div>
    </article>
  `).join("");
}

async function handleTrainingClick(event) {
  const localAction = event.target.closest("[data-local-action]");
  if (localAction) {
    applyLocalAction(localAction);
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

function applyLocalAction(button) {
  const card = button.closest("[data-skill-id]");
  const item = state.items.find((entry) => String(entry.id) === String(card?.dataset.skillId));
  if (!card || !item) return;
  const textarea = card.querySelector('[data-field="replyText"]');
  if (!textarea) return;
  if (button.dataset.localAction === "use-current") {
    textarea.value = item.currentText || "";
  } else if (button.dataset.localAction === "use-override") {
    textarea.value = item.latestOverride?.reply || "";
  }
  textarea.focus();
}

async function submitTrainingAction(card, action) {
  const skillId = card.dataset.skillId;
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
    renderTraining();
    toast(actionLabel(action));
  } catch (error) {
    toast(`训练保存失败：${error.message}`, true);
  } finally {
    setCardBusy(card, false);
  }
}

function collectPatch(card) {
  return {
    title: card.querySelector('[data-field="title"]')?.value || "",
    keywords: card.querySelector('[data-field="keywords"]')?.value || "",
    replyText: card.querySelector('[data-field="replyText"]')?.value || "",
    note: card.querySelector('[data-field="note"]')?.value || "",
    allowAutoReply: Boolean(card.querySelector('[data-field="allowAutoReply"]')?.checked),
    noReply: Boolean(card.querySelector('[data-field="noReply"]')?.checked)
  };
}

function setCardBusy(card, busy) {
  card.classList.toggle("is-busy", busy);
  card.querySelectorAll("button, input, textarea").forEach((node) => {
    node.disabled = busy;
  });
}

function actionLabel(action) {
  const map = {
    approve: "已批准这条 skill。",
    optimize: "已保存优化话术。",
    "needs-review": "已标记为待优化。",
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

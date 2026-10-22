const fs = require("node:fs");
const path = require("node:path");

const POLL_PATHS = new Set([
  "/api/contact/getcontactlist", "/api/contact/getnewfirend",
  "/api/chatcontent/getlist", "/api/notice/getlist"
]);

function summarizePollResponse(url, buffer, status) {
  const pathname = new URL(url, "http://localhost").pathname.toLowerCase();
  if (!POLL_PATHS.has(pathname) || status < 200 || status >= 300) return null;
  try {
    const payload = JSON.parse(buffer.toString("utf8"));
    if (payload?.success !== true || payload.data === false) return null;
    const data = payload.data;
    const rows = Array.isArray(data) ? data : data?.list || data?.items || data?.rows;
    return JSON.stringify({
      success: true, captureSummary: true, responseBytes: buffer.length,
      data: data == null ? null : {
        count: Array.isArray(rows) ? rows.length : undefined,
        total: data?.total ?? data?.totalCount ?? payload.total
      }
    });
  } catch {
    return null;
  }
}

function appendCapture(file, entry, maxBytes = 32 * 1024 * 1024, generations = 3) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const line = `${JSON.stringify(entry)}\n`;
  const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
  if (size && size + Buffer.byteLength(line) > maxBytes) {
    // Preserve pre-rotation legacy evidence for explicit archival, never prune it.
    if (size > maxBytes * 2) {
      fs.renameSync(file, `${file}.legacy-${Date.now()}`);
    } else {
      for (let index = generations; index >= 1; index -= 1) {
        const source = index === 1 ? file : `${file}.${index - 1}`;
        const destination = `${file}.${index}`;
        if (index === generations && fs.existsSync(destination)) fs.unlinkSync(destination);
        if (fs.existsSync(source)) fs.renameSync(source, destination);
      }
    }
  }
  fs.appendFileSync(file, line, "utf8");
}

module.exports = { appendCapture, summarizePollResponse };

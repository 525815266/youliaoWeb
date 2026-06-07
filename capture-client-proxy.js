const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const LISTEN_PORT = Number(process.env.CAPTURE_PORT || process.argv[2] || 18081);
const TARGET = String(process.env.YOUCHAT_CAPTURE_TARGET || process.argv[3] || "http://127.0.0.1:18080").replace(/\/+$/, "");
const LOG_DIR = path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_DIR, "client-proxy-capture.ndjson");
const MAX_BODY = 12000;

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function decodeBody(buffer, contentType = "") {
  if (!buffer || !buffer.length) return "";
  const type = String(contentType || "").toLowerCase();
  if (
    type.includes("json") ||
    type.includes("text") ||
    type.includes("form") ||
    type.includes("xml") ||
    !type
  ) {
    const text = buffer.toString("utf8");
    return text.length > MAX_BODY ? `${text.slice(0, MAX_BODY)}...<truncated ${text.length - MAX_BODY} chars>` : text;
  }
  return `<binary ${buffer.length} bytes>`;
}

function writeCapture(entry) {
  ensureLogDir();
  fs.appendFileSync(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
}

function proxyWebSocket(req, socket, head) {
  const targetUrl = new URL(req.url, TARGET);
  const upstream = http.request({
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: `${targetUrl.pathname}${targetUrl.search}`,
    method: req.method,
    headers: req.headers
  });

  writeCapture({
    at: new Date().toISOString(),
    type: "upgrade",
    method: req.method,
    url: req.url,
    target: targetUrl.toString()
  });

  upstream.on("upgrade", (upstreamRes, upstreamSocket, upstreamHead) => {
    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        ...Object.entries(upstreamRes.headers).map(([key, value]) => `${key}: ${value}`)
      ].join("\r\n") + "\r\n\r\n"
    );
    if (upstreamHead?.length) socket.write(upstreamHead);
    if (head?.length) upstreamSocket.write(head);
    upstreamSocket.pipe(socket);
    socket.pipe(upstreamSocket);
  });

  upstream.on("error", (error) => {
    writeCapture({
      at: new Date().toISOString(),
      type: "upgrade-error",
      method: req.method,
      url: req.url,
      target: targetUrl.toString(),
      error: error.message
    });
    socket.destroy();
  });

  upstream.end();
}

const server = http.createServer(async (req, res) => {
  const targetUrl = new URL(req.url, TARGET);
  const requestBody = await readBody(req);
  const started = Date.now();
  const headers = { ...req.headers };
  headers.host = targetUrl.host;
  delete headers["content-length"];

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : requestBody
    });
    const responseBody = Buffer.from(await upstream.arrayBuffer());
    const responseHeaders = {};
    upstream.headers.forEach((value, key) => {
      if (!["content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });

    res.writeHead(upstream.status, responseHeaders);
    res.end(responseBody);

    writeCapture({
      at: new Date().toISOString(),
      type: "http",
      method: req.method,
      url: req.url,
      target: targetUrl.toString(),
      status: upstream.status,
      ms: Date.now() - started,
      requestContentType: req.headers["content-type"] || "",
      requestBody: decodeBody(requestBody, req.headers["content-type"] || ""),
      responseContentType: upstream.headers.get("content-type") || "",
      responseBody: decodeBody(responseBody, upstream.headers.get("content-type") || "")
    });
  } catch (error) {
    writeCapture({
      at: new Date().toISOString(),
      type: "http-error",
      method: req.method,
      url: req.url,
      target: targetUrl.toString(),
      status: 502,
      ms: Date.now() - started,
      requestBody: decodeBody(requestBody, req.headers["content-type"] || ""),
      error: error.message
    });
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: false, message: "capture proxy failed", target: targetUrl.toString(), error: error.message }));
  }
});

server.on("upgrade", proxyWebSocket);

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  ensureLogDir();
  console.log(`YouChat capture proxy listening on http://127.0.0.1:${LISTEN_PORT}`);
  console.log(`Forwarding to ${TARGET}`);
  console.log(`Writing ${LOG_FILE}`);
  console.log("Set the Electron client server to 127.0.0.1 and this proxy port, then operate the client.");
});

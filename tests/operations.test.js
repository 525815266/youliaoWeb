const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { appendCapture, summarizePollResponse } = require("../capture-log");
const policy = require("../public/signalr-policy");
const vm = require("node:vm");

test("a Basic-protected browser request preserves its YouChat login token through the proxy", async () => {
  const browserSource = fs.readFileSync(path.join(__dirname, "../public/app.js"), "utf8");
  const serverSource = fs.readFileSync(path.join(__dirname, "../server.js"), "utf8");
  const proxyContext = vm.createContext({});
  const proxyStart = serverSource.indexOf("const PROXY_STRIPPED_REQUEST_HEADERS =");
  const proxyEnd = serverSource.indexOf("\nfunction getAiChatCompletionsUrl(", proxyStart);
  vm.runInContext(serverSource.slice(proxyStart, proxyEnd), proxyContext);
  let checked = false;
  const browserContext = vm.createContext({
    state: { token: "YouChat test session" }, API_REQUEST_TIMEOUT_MS: 1000,
    apiPath: (value) => `/api${value}`, toFormData: (data) => data,
    parsePayload: JSON.parse, log: () => {}, summarize: (value) => value,
    fetchWithTimeout: async (url, options) => {
      assert.equal(url, "/api/Contact/GetContactList");
      assert.equal(options.headers.Authorization, undefined);
      const upstream = proxyContext.sanitizeProxyRequestHeaders({
        authorization: "Basic ingress-credentials",
        "x-youchat-authorization": options.headers["X-YouChat-Authorization"],
        connection: "keep-alive", host: "proxy.example"
      });
      assert.equal(upstream.authorization, "YouChat test session");
      assert.equal(upstream["x-youchat-authorization"], undefined);
      assert.equal(upstream.connection, undefined);
      assert.equal(upstream.host, undefined);
      checked = true;
      return { ok: true, status: 200, text: async () => '{"success":true}' };
    }
  });
  const browserStart = browserSource.indexOf("async function api(");
  const browserEnd = browserSource.indexOf("\nfunction toFormData(", browserStart);
  vm.runInContext(browserSource.slice(browserStart, browserEnd), browserContext);
  assert.equal((await browserContext.api("/Contact/GetContactList")).success, true);
  assert.ok(checked);
  assert.equal(proxyContext.sanitizeProxyRequestHeaders({ authorization: "legacy session" }).authorization, "legacy session");
});

test("successful polls retain counts but omit customer bodies; failures remain available", () => {
  const buffer = Buffer.from(JSON.stringify({ success: true, data: { list: [{ message: "private" }], total: 9000 } }));
  const result = JSON.parse(summarizePollResponse("/api/Contact/GetContactList?p=1", buffer, 200));
  assert.deepEqual(result.data, { count: 1, total: 9000 });
  assert.equal(JSON.stringify(result).includes("private"), false);
  assert.equal(result.responseBytes, buffer.length);
  for (const [url, body, status] of [
    ["/api/Contact/GetContactList", { success: false, message: "DB offline" }, 200],
    ["/api/Contact/GetContactList", { success: true, data: false, message: "Query failed" }, 200],
    ["/api/Contact/GetContactList", { success: true }, 500],
    ["/api/ChatContent/SendMsg", { success: true }, 200]
  ]) assert.equal(summarizePollResponse(url, Buffer.from(JSON.stringify(body)), status), null);
  assert.equal(summarizePollResponse("/api/Contact/GetContactList", Buffer.from("invalid"), 200), null);
  assert.equal(JSON.parse(summarizePollResponse("/api/Contact/GetContactList", Buffer.from('{"success":true,"data":null}'), 200)).data, null);
});

test("capture rotation is bounded, ordered, and leaves oversized legacy evidence intact", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "youchat-log-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "api-capture.ndjson");
  for (let i = 0; i < 20; i += 1) appendCapture(file, { i, text: "x".repeat(30) }, 70, 3);
  assert.equal(fs.readdirSync(dir).length, 4);
  for (let i = 0; i < 4; i += 1) {
    const item = i ? `${file}.${i}` : file;
    assert.equal(JSON.parse(fs.readFileSync(item)).i, 19 - i);
    assert.ok(fs.statSync(item).size <= 70);
  }
  fs.writeFileSync(file, "legacy".repeat(100));
  appendCapture(file, { i: 21 }, 70, 3);
  const legacy = fs.readdirSync(dir).find((name) => name.includes(".legacy-"));
  assert.equal(fs.readFileSync(path.join(dir, legacy), "utf8"), "legacy".repeat(100));
});

test("SignalR accepts only backend Int32 account IDs, never global IDs or login names", () => {
  for (const invalid of ["1556504756803862529", "2074080649250992130", "Boom", "", null, 0, -1, "2e3", "2.1", "2147483648", {}]) {
    assert.equal(policy.normalizeAccountId(invalid), "", String(invalid));
  }
  assert.equal(policy.normalizeAccountId(" 2 "), "2");
  assert.equal(policy.normalizeAccountId(2147483647), "2147483647");
  assert.ok(policy.keepAliveMs < 30000);
});

test("known hub notifications record metadata without forwarding message bodies", () => {
  const handlers = new Map();
  const received = [];
  policy.observe({ on: (name, fn) => handlers.set(name.toLowerCase(), fn) }, (...args) => received.push(args));
  for (const name of ["msgnotice", "allmsgnotice", "timeoutnotice", "accessin"]) {
    assert.ok(handlers.has(name));
    handlers.get(name)({ customer: "private" });
  }
  assert.equal(received.length, 4);
  assert.ok(received.every((args) => args.length === 1 && typeof args[0] === "string"));
});

test("browser and proxy map native Tencent COS fields; Qiniu remains unchanged", () => {
  const config = { txHostUrl: "https://example.cos.ap-shanghai.myqcloud.com", txPolicy: "policy",
    txQak: "access-id", txQkeyTime: "100;200", txQsignature: "signature" };
  for (const [file, builder] of [["server.js", "buildOssFormData"], ["public/app.js", "buildOssUploadForm"]]) {
    const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");
    const context = vm.createContext({ FormData, Blob, firstNonEmpty: first, firstValue: first, normalizeUploadEndpoint: (value) => value });
    for (const name of [builder, "extractUploadEndpoint"]) {
      const start = source.indexOf(`function ${name}(`);
      const end = source.indexOf("\nfunction ", start + 1);
      assert.ok(start >= 0 && end > start);
      vm.runInContext(source.slice(start, end), context);
    }
    assert.equal(context.extractUploadEndpoint(config), config.txHostUrl);
    const build = (cfg) => builder === "buildOssFormData"
      ? context[builder](cfg, "test.png", "test.png", "image/png", Buffer.from("test"))
      : context[builder](cfg, "test.png", new Blob(["test"], { type: "image/png" }), "test.png");
    const cos = build(config);
    for (const [name, value] of Object.entries({ key: "test.png", policy: "policy", "q-sign-algorithm": "sha1",
      "q-ak": "access-id", "q-key-time": "100;200", "q-signature": "signature", success_action_status: "200" })) {
      assert.equal(cos.get(name), value, `${file}: ${name}`);
    }
    assert.equal(cos.has("OSSAccessKeyId"), false);
    assert.equal(cos.get("file").name, "test.png");
    const qiniu = build({ qnToken: "test-token" });
    assert.equal(qiniu.get("token"), "test-token");
    assert.equal(qiniu.has("q-signature"), false);
  }
});

test("storage arrears surface as an actionable error, not a generic network failure", () => {
  const source = fs.readFileSync(path.join(__dirname, "../server.js"), "utf8");
  const start = source.indexOf("function describeOssUploadFailure(");
  const end = source.indexOf("\nfunction ", start + 1);
  const context = vm.createContext({});
  vm.runInContext(source.slice(start, end), context);
  assert.match(context.describeOssUploadFailure(451, '<Message>account is arrears, recharge</Message>'), /欠费/);
  assert.match(context.describeOssUploadFailure(403, 'AccessDenied'), /403/);
});

test("campaign guide uploads the compressed JPEG with matching name and MIME", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../server.js"), "utf8");
  const start = source.indexOf("async function ensureCampaignGuideUploaded(");
  const end = source.indexOf("\nfunction waitCampaign", start);
  let uploaded = false;
  const context = vm.createContext({
    DEFAULT_API_BASE: "test", CAMPAIGN_GUIDE_FILE: "guide.png", CAMPAIGN_GUIDE_UPLOAD_FILE: "guide.jpg",
    OSS_UPLOAD_TIMEOUT_MS: 60000, crypto: { randomBytes: () => ({ toString: () => "random" }) },
    fs: { existsSync: () => true, readFileSync: (file) => { assert.equal(file, "guide.jpg"); return Buffer.from("jpeg"); } },
    postYouChatApi: async (url, data) => { assert.equal(data.fileName, "campaign-influencer-floor-random.jpg"); return {}; },
    getPayloadData: () => ({}), extractUploadEndpoint: () => "https://storage.test", buildOssObjectKey: (_, file) => file,
    buildOssFormData: (_, key, name, mime) => { assert.equal(key, name); assert.equal(mime, "image/jpeg"); return "form"; },
    fetchWithTimeout: async () => { uploaded = true; return { ok: true, text: async () => "{}" }; },
    parseMaybeJson: JSON.parse, firstNonEmpty: (...args) => args.find(Boolean), extractUploadedUrl: () => "https://storage.test/guide.jpg"
  });
  vm.runInContext(source.slice(start, end), context);
  const state = {};
  assert.equal(await context.ensureCampaignGuideUploaded(state, 48), "https://storage.test/guide.jpg");
  assert.ok(uploaded);
  assert.equal(state.guideImageUrl, "https://storage.test/guide.jpg");
  assert.ok(fs.statSync(path.join(__dirname, "../public/assets/campaign-influencer-floor-guide-upload.jpg")).size < 700 * 1024);
});

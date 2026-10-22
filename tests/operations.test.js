const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { appendCapture, summarizePollResponse } = require("../capture-log");
const policy = require("../public/signalr-policy");

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

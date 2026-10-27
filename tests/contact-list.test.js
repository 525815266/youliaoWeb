const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createContactPager } = require("../contact-list");

function fixture(initial, options = {}) {
  let rows = initial;
  let calls = 0;
  let clock = 0;
  const pager = createContactPager({
    now: () => clock, batchSize: 2, ...options,
    fetchPage: async ({ pageIndex, pageSize }, context) => {
      calls += 1;
      const size = options.cap || pageSize;
      if (options.check) options.check(context);
      return { success: true, data: { total: rows.length, list: rows.slice((pageIndex - 1) * size, pageIndex * size) } };
    }
  });
  const query = { scope: "account-2", params: { isGuestbook: true }, pageSize: 2 };
  return { pager, query, replace: (value) => { rows = value; }, tick: (value) => { clock += value; }, calls: () => calls };
}

const contacts = [1, 2, 3, 4, 5].map((id) => ({ id, updateTime: `2026-10-${21 + id}T12:00:00+08:00` }));

test("newest contacts outside native page one appear first; all pages are reachable exactly once", async () => {
  const f = fixture(contacts);
  const first = (await f.pager.page(f.query)).data;
  assert.deepEqual(first.list.map((row) => row.id), [5, 4]);
  assert.equal(first.total, 5);
  assert.equal(first.hasMore, true);
  const second = (await f.pager.page({ ...f.query, pageIndex: 2, snapshotId: first.snapshotId })).data;
  const third = (await f.pager.page({ ...f.query, pageIndex: 3, snapshotId: first.snapshotId })).data;
  assert.deepEqual([...first.list, ...second.list, ...third.list].map((row) => row.id), [5, 4, 3, 2, 1]);
  assert.equal(third.hasMore, false);
  assert.equal(f.calls(), 3);
});

test("refresh replaces stale previews, removes closed contacts, and retains an off-page selected contact", async () => {
  const f = fixture(contacts);
  await f.pager.page(f.query);
  f.replace([contacts[0], { ...contacts[1], updateTime: "2026-10-27T12:00:00+08:00", unRead: 3, records: [{ content: "new" }] }, contacts[4]]);
  f.pager.invalidate();
  const fresh = (await f.pager.page({ ...f.query, pageIndex: 2, prefix: true, selectedId: "1" })).data;
  assert.deepEqual(fresh.list.map((row) => row.id), [2, 5, 1]);
  assert.equal(fresh.list[0].records[0].content, "new");
  assert.equal(fresh.list[0].unRead, 3);
  assert.equal(fresh.selectedContact.id, 1);
  assert.equal(fresh.hasMore, false);
});

test("arrivals between page requests keep a stable snapshot; expired snapshot returns a complete replacement prefix", async () => {
  const f = fixture(contacts);
  const first = (await f.pager.page(f.query)).data;
  f.replace([...contacts, { id: 6, updateTime: "2026-10-27T00:00:00Z" }]);
  f.pager.invalidate();
  const second = (await f.pager.page({ ...f.query, pageIndex: 2, snapshotId: first.snapshotId })).data;
  assert.deepEqual(second.list.map((row) => row.id), [3, 2]);
  f.tick(120001);
  const reset = (await f.pager.page({ ...f.query, pageIndex: 2, snapshotId: first.snapshotId })).data;
  assert.equal(reset.snapshotReset, true);
  assert.deepEqual(reset.list.map((row) => row.id), [6, 5, 4, 3]);
});

test("pinned contacts stay first and record time takes precedence over stale contact time", async () => {
  const f = fixture([{ ...contacts[0], isTodo: true }, ...contacts.slice(1), {
    id: 6, updateTime: contacts[0].updateTime, records: [{ createDate: "2026-10-27T00:00:00Z" }]
  }]);
  assert.deepEqual((await f.pager.page(f.query)).data.list.map((row) => row.id), [1, 6]);
});

test("account, search, category and authorization scopes never share snapshots; concurrent polls share one scan", async () => {
  const f = fixture(contacts);
  const [a, b] = await Promise.all([f.pager.page(f.query), f.pager.page(f.query)]);
  assert.equal(a.data.snapshotId, b.data.snapshotId);
  assert.equal(f.calls(), 3);
  for (const changes of [
    { scope: "other-token" }, { params: { isHistory: true } },
    { params: { accountId: "3" } }, { params: { keyWord: "query", isGuestbook: true } }
  ]) {
    const other = await f.pager.page({ ...f.query, ...changes, snapshotId: a.data.snapshotId });
    assert.notEqual(other.data.snapshotId, a.data.snapshotId);
    assert.equal(other.data.snapshotReset, true);
  }
});

test("server page-size caps are respected and an exact final page has no more", async () => {
  const f = fixture(contacts.slice(0, 4), { cap: 1 });
  const data = (await f.pager.page({ ...f.query, pageIndex: 2, prefix: true })).data;
  assert.equal(data.list.length, 4);
  assert.equal(data.hasMore, false);
});

test("failed or repeated native pages never publish a partial snapshot", async () => {
  for (const invalid of [{ success: false, message: "offline" }, { success: true, data: false }, {
    success: true, data: { total: 5, list: contacts.slice(0, 2) }
  }]) {
    let fail = true;
    const pager = createContactPager({ batchSize: 2, fetchPage: async ({ pageIndex, pageSize }) => {
      if (pageIndex > 1 && fail) return invalid;
      return { data: { total: 5, list: contacts.slice((pageIndex - 1) * pageSize, pageIndex * pageSize) } };
    } });
    const query = { scope: "test", params: { isHistory: true } };
    await assert.rejects(pager.page(query));
    fail = false;
    assert.equal((await pager.page(query)).data.total, 5);
  }
});

test("browser refresh requests the complete loaded window and never lets old previews overwrite it", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../public/app.js"), "utf8");
  const old = { id: 1, unread: 0, lastContent: "old" };
  const fresh = { id: 1, unread: 2, lastContent: "new" };
  const list = { scrollTop: 0, scrollHeight: 300, querySelector: () => null };
  const state = {
    listTab: "history", contacts: [old, { id: 2 }], activeContact: old, contactListPage: 2,
    contactListHasMore: true, listServerCounts: {}, listCountSources: {}, listCounts: {}, listUnreadCounts: {}, messages: [1]
  };
  let requested;
  const context = vm.createContext({
    state, contactListLoadToken: 0, el: { contactList: list, toolContent: list },
    CONTACT_LIST_PAGE_SIZE: 60, CONTACT_LIST_AUTOLOAD_THRESHOLD: 100,
    ensureContactListAccountId: async () => "2", getContactId: (contact) => contact?.id,
    captureContactListAnchor: () => null, isNearBottom: () => false,
    fetchContactListWithFallback: async (tab, options) => {
      requested = options;
      return { contacts: [fresh], total: 1, snapshotId: "new", hasMore: false };
    },
    shouldPreserveKnownListTotal: () => false, shouldPreserveEmptyContactResult: () => false,
    sumContactUnread: (rows) => rows.reduce((sum, row) => sum + row.unread, 0), getContactAvatar: () => "",
    renderConversationTabs() {}, renderContacts() {}, renderActive() {}, renderToolContent() {},
    restoreContactListAnchor() {}, scheduleContactListViewportFill() {}, log() {},
    toast: (message) => assert.fail(message), renderAll: () => assert.fail("unexpected failure")
  });
  const start = source.indexOf("async function loadContacts(");
  const end = source.indexOf("\nfunction captureContactListAnchor", start);
  vm.runInContext(source.slice(start, end), context);
  await context.loadContacts({ mode: "merge", preserveScroll: true, skipCounts: true });
  assert.equal(requested.pageIndex, 2);
  assert.equal(requested.prefix, true);
  assert.equal(state.contacts.length, 1);
  assert.equal(state.contacts[0].lastContent, "new");
  assert.equal(state.activeContact.unread, 2);
  assert.equal(state.contactListHasMore, false);
});

test("an explicitly empty current account cannot fall back to another agent's conversations", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../public/app.js"), "utf8");
  let calls = 0;
  const context = vm.createContext({
    state: { listTab: "current" }, getContactListAccountCandidates: () => ["2"],
    fetchContactListPayload: async (tab, options) => {
      calls += 1;
      assert.equal(options.accountIdOverride, "2");
      assert.notEqual(options.omitAccountId, true);
      return { contacts: [], explicitTotal: 0, total: 0, isZeroData: false };
    },
    isUsefulContactListResult: (data) => data.contacts.length > 0 || data.total > 0,
    isExplicitEmptyContactListResult: (data) => data.explicitTotal === 0 && !data.isZeroData,
    log() {}
  });
  const start = source.indexOf("async function fetchContactListWithFallback(");
  const end = source.indexOf("\nasync function fetchContactListPayload(", start);
  vm.runInContext(source.slice(start, end), context);
  const result = await context.fetchContactListWithFallback("current", { ordered: true });
  assert.equal(result.total, 0);
  assert.equal(calls, 1);
});

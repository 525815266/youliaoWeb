const { randomUUID } = require("node:crypto");

function timestamp(value) {
  if (!value) return 0;
  const number = Number(value);
  if (Number.isFinite(number)) return number < 100000000000 ? number * 1000 : number;
  return Date.parse(value) || 0;
}

function contactTime(contact) {
  return Math.max(timestamp(contact.updateTime), ...(contact.records || []).map((record) =>
    timestamp(record.sendTime || record.createDate || record.createTime || record.time)));
}

function compareContacts(a, b) {
  return Number(Boolean(b.isTodo)) - Number(Boolean(a.isTodo))
    || contactTime(b) - contactTime(a)
    || String(a.id).localeCompare(String(b.id));
}

// Native pagination can be oldest-first. Sort the complete category before slicing.
// Retain short-lived snapshots so an arrival between pages cannot skip a contact.
function createContactPager({ fetchPage, now = Date.now, ttlMs = 8000, snapshotMs = 120000, batchSize = 1000 }) {
  const snapshots = new Map();
  const latest = new Map();
  const pending = new Map();
  let revision = 0;

  async function collect(params, context) {
    const contacts = new Map();
    let pageSize = batchSize;
    let total = null;
    for (let pageIndex = 1; pageIndex <= 500; pageIndex += 1) {
      const payload = await fetchPage({ ...params, pageIndex, pageSize }, context);
      const data = payload?.data;
      if (payload?.success === false || !Array.isArray(data?.list)) {
        throw new Error(payload?.message || "Contact list returned an invalid page");
      }
      const rows = data.list;
      const reportedTotal = data.total == null ? NaN : Number(data.total);
      if (Number.isFinite(reportedTotal) && reportedTotal >= 0) total = reportedTotal;
      const before = contacts.size;
      for (const contact of rows) {
        if (contact.id == null) throw new Error("Contact list returned a row without an ID");
        contacts.set(String(contact.id), contact);
      }
      if ((total !== null && contacts.size >= total) || (total === null && rows.length < pageSize)) {
        let result = [...contacts.values()];
        if (!params.isHistory && !params.isGuestbook && !params.accountId) {
          result = result.filter((item) => Number(item.conversationId) > 0 && Number(item.accountId) > 0);
        }
        return result.sort(compareContacts);
      }
      if (contacts.size === before) throw new Error("Contact pagination stopped before reaching its total");
      // Some native versions cap pageSize; use the actual size for subsequent offsets.
      if (pageIndex === 1 && rows.length < pageSize) pageSize = rows.length;
    }
    throw new Error("Contact pagination exceeded its safety limit");
  }

  function prune() {
    for (const [id, snapshot] of snapshots) {
      if (now() - snapshot.at > snapshotMs) snapshots.delete(id);
    }
    while (snapshots.size > 32) snapshots.delete(snapshots.keys().next().value);
    for (const [key, id] of latest) if (!snapshots.has(id)) latest.delete(key);
  }

  return {
    invalidate() {
      revision += 1;
      latest.clear();
    },
    async page({ scope, params, pageIndex = 1, pageSize = 60, snapshotId = "", prefix = false, selectedId = "", context }) {
      prune();
      const key = JSON.stringify([scope, params]);
      let snapshot = snapshots.get(snapshotId);
      if (snapshot?.key !== key) snapshot = null;
      if (!snapshot) {
        snapshot = snapshots.get(latest.get(key));
        if (!snapshot || now() - snapshot.at >= ttlMs) {
          if (!pending.has(key)) {
            const startedRevision = revision;
            const request = collect(params, context).then((contacts) => {
              const result = { id: randomUUID(), key, at: now(), contacts };
              snapshots.set(result.id, result);
              if (revision === startedRevision) latest.set(key, result.id);
              prune();
              return result;
            }).finally(() => pending.delete(key));
            pending.set(key, request);
          }
          snapshot = await pending.get(key);
        }
      }
      const reset = Boolean(snapshotId && snapshotId !== snapshot.id);
      const end = pageIndex * pageSize;
      const start = prefix || reset ? 0 : (pageIndex - 1) * pageSize;
      return {
        success: true,
        data: {
          list: snapshot.contacts.slice(start, end), total: snapshot.contacts.length,
          snapshotId: snapshot.id, snapshotReset: reset,
          selectedContact: selectedId ? snapshot.contacts.find((item) => String(item.id) === String(selectedId)) || null : null,
          hasMore: end < snapshot.contacts.length, refreshedAt: new Date(snapshot.at).toISOString()
        }
      };
    }
  };
}

module.exports = { createContactPager, compareContacts };

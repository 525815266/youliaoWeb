(function (root) {
  const policy = {
    keepAliveMs: 15000,
    noticeNames: [
      "msgNotice", "allMsgNotice", "timeoutNotice", "connectionEstablished",
      "groupJoined", "testRegisterMessage", "stateSyncComplete", "accessIn", "msgShutDown", "unBound"
    ],
    normalizeAccountId(value) {
      const text = String(value ?? "").trim();
      return /^[1-9]\d{0,9}$/.test(text) && Number(text) <= 2147483647 ? text : "";
    },
    observe(connection, onNotice) {
      for (const name of this.noticeNames) connection.on(name, () => onNotice(name));
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = policy;
  else root.YouChatSignalRPolicy = policy;
})(globalThis);

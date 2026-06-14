# AI Handoff Notes

> Read this before changing the YouChat web dev project. This file is the compact map for future AI agents. Also read `PROJECT_MEMORY.md` for the human-readable full context.

## Mission

Build a real-data Web customer-service workbench from the Windows Electron YouChat client. Do not invent users, ids, orders, balances, chat records, or quick replies. Prefer real API, captured logs, original Electron references, and persistent local files.

## Roots

- Web project: `C:\youchat-dev-web`
- Original client: `C:\Program Files\youchat-desktop`
- Dev URL: `http://localhost:5177`
- API capture log: `C:\youchat-dev-web\logs\api-capture.ndjson`
- Local skills: `C:\youchat-dev-web\data\reply-skills.json`
- Original API reference: `C:\Program Files\youchat-desktop\bin\YouChatService.xml`

Path note:

- Old temporary path was `C:\tmp\youchat-dev-web`.
- Current official project root is `C:\youchat-dev-web`.
- Do not continue edits from the old tmp path unless explicitly recovering backup files.

## Key Files

- `public/app.js`: main frontend state, API calls, rendering, chat, tools, AI, skill learning.
- `public/styles.css`: blue/white compact client UI.
- `public/index.html`: app shell, AI settings, workbench layout.
- `server.js`: static server, `/api` proxy, `/ai/chat/completions`, OSS upload proxy, `/local/link-preview`, local skill endpoints.
- `server.js`: also owns `/local/signalr/consume`, the local Node SignalR bridge used to sync conversation read/unread state with the real YouChat hub.
- `PROJECT_MEMORY.md`: full readable project memory.
- `AI_HANDOFF.md`: this handoff map. Update it after meaningful changes.

## Verification

Run:

```powershell
cd C:\youchat-dev-web
npm run check
Invoke-WebRequest http://localhost:5177/health
Invoke-WebRequest http://localhost:5177/app.js
Invoke-WebRequest http://localhost:5177/styles.css
```

Playwright is not currently installed. Do not claim screenshot QA unless it is installed and actually run.

## API Plumbing

Frontend uses:

- `api(path, data, options)`
- `apiPath(path)`
- `toFormData(data)`
- `getData(payload)`
- `getRecords(payload)`
- `getTotal(payload)`
- `getExplicitTotal(payload)`

`server.js` captures every `/api/*` request/response into `logs/api-capture.ndjson`.

Default API target:

- `public/app.js`, `server.js`, and `start-dev-web.ps1` default to the user's FnOS Docker service: `http://192.168.9.83:18080/api`.
- FnOS deployment path discovered on 2026-06-08: `/vol1/1000/Docker/youchat`.
- Docker compose maps `youchat-service` as host `18080` -> container `8080`; control API is host `18081` -> container `8081`.
- `POST http://192.168.9.83:18080/api/System/GetOptions` returns 200; `GET` on the same route returns 404, so probe YouChat APIs with POST unless the client code proves otherwise.
- The login server field accepts a full API URL, for example `http://192.168.9.83:18080/api`.
- If the user enters host + port, Web builds `http://host:port/api`.
- Saved browser defaults `https://im.52youzai.com/api`, `http://127.0.0.1:8080/api`, and `http://localhost:8080/api` are automatically migrated back to `http://192.168.9.83:18080/api` by `loadStoredApiBase()`.
- If data does not match the Windows/FnOS client chain, inspect `localStorage.youchat.apiBase` and recent `logs/api-capture.ndjson` targets first. A stale target means Web is not querying the same service/database as the FnOS Docker service.
- 2026-06-08 service-side incident: both the Web workbench and official Windows client could not load contact/chat data. Root cause was MySQL collation drift in the FnOS Docker database, not Web UI code. `ChatContent_2026_06_08` was created as `utf8mb4_unicode_ci` while older chat partition tables were `utf8mb4_general_ci`, so `ChatContentService.GetList`, `ComsumMessage`, and `ConversationDetectiveJob` failed with `Illegal mix of collations for operation 'UNION'`.
- Applied on FnOS MySQL: database `1556504756803862529` default collation and table `ChatContent_2026_06_08` were converted to `utf8mb4_general_ci`. Backups:
  - pre-fix: `/vol1/1000/Docker/youchat/docker-control/db-backups/pre-collation-fix-20260608-160844.sql.gz`
  - post-fix: `/vol1/1000/Docker/youchat/docker-control/db-backups/post-collation-fix-20260608-161035.sql.gz`
- After fix, `/Contact/GetContactList` returned real data again (`total=29` for form current-list probe) and `/ChatContent/GetList` returned real messages. If this recurs after a new week partition table appears, inspect `information_schema.TABLES` for `ChatContent_%` table collations before changing frontend code.
- 2026-06-09 service-side incident: history count fell to `4` because `youchat-service` was reading SQLite, not MySQL. `/System/GetOptions` returned `dataBaseOptions.databaseType=2` and `connectionString=null`. MySQL still had `Contact=8041` and `Conversation=26798`, while SQLite `\悠聊数据库\DataBase-1556504756803862529.db` had only `Contact=265` and `Conversation=16`.
- Fixed by backing up config/SQLite under `/vol1/1000/Docker/youchat/docker-control/config-backups/manual-mysql-switch-20260609-152800`, editing `/vol1/1000/Docker/youchat/\悠聊数据库\config\YouChatConfig.json` back to `DatabaseType=0` with the MySQL connection string, and restarting only `youchat-service`.
- Post-fix probes: `/System/GetOptions` shows `databaseType=0`; `/Contact/GetContactList isHistory=true` returns `total=5714`; bare `/Contact/GetContactList` returns `total=8041`.
- Run `npm run fnos:health` before frontend debugging when counts look wrong. If it reports `databaseType=2`, fix FnOS service database mode first. The script lives at `tools/check-fnos-youchat-health.ps1`.
- 2026-06-12 the same SQLite regression happened again. `fnos:health` showed `databaseType=2`, `historyContacts=24`, and `totalContacts≈481`. This was not a fake Web count; the backend really switched runtime DB mode again.
- Recovery on 2026-06-12 used real service APIs:
  - `POST /System/ConnectDatabase`
  - `POST /System/SetConnectionString`
  - `POST /System/GetConnectionString`
  - `POST /System/GetOptions`
- Verified MySQL connection string:
  - `Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=w5B22RLPpprsrxdt;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;`
- After restore on 2026-06-12:
  - `databaseType=0`
  - `Contact total=8059`
  - `History contacts=5732`
  - `AccountId=2 current probe=7`
- New helper added:
  - `tools/restore-fnos-mysql-mode.ps1`
  - `npm run fnos:restore:mysql`
- Use `fnos:restore:mysql` first when counts suddenly collapse into dozens again. Only continue frontend debugging if `fnos:health` already reports `databaseType=0`.

## Contact List Data Gotchas

Business UI must match the Windows client. Do not show debug/source labels such as `本地`, `保留`, `全局回退`, `已清空`, `客服空`, or `接口空` in tabs or list headers.

Current conversation list should start with the Electron-compatible request:

- `POST /Contact/GetContactList`
- `pageIndex = 1`
- `pageSize = 20`
- use `keyWord` for search
- current project state now default-sends native list-shape flags for contact tabs:
  - `id=0`
  - `isGuestbook=false`
  - `isHistory=false`
- then overrides by tab:
  - `guestbook -> isGuestbook=true`
  - `history -> isHistory=true`

Known account-id facts:

- userName: `Boom666`
- nickName: `客服-王`
- `accountId=2` can return bare `{"success":true,"message":null,"data":0}` and is not stable enough as the default current-list filter.
- long `accountId = 1556504756803862529` is not the current-list filter id.
- Short ids from `/Senstive/GetAccountList` (`id`, `accId`) are fallback/diagnostic candidates only unless future client captures prove they are the default.

Important functions:

- `ensureContactListAccountId`
- `getContactListAccountId`
- `buildContactListParams`
- `loadContactCounts`
- `loadContacts`

Recent fix:

- `buildContactListParams()` now follows Electron-style params.
- `fetchContactListWithFallback()` tries no-account current list first, then account candidates only as fallback.
- `state.listCountSources` may be kept for logs/debugging, but must not be rendered in business UI.

2026-06-08 current-list fallback fix:

- `accountId=2` can return `{"success":true,"message":null,"data":0}` for `/Contact/GetContactList`.
- Treat `data:0` as an ambiguous empty response, not as authority to clear the list.
- Explicit empty means a structured payload with `records/list` and `total: 0`, not bare `data:0`.
- `state.contactListAccountIds` persists candidates from `/Senstive/GetAccountList`.
- `extractContactListAccountIds()` should prefer short local customer-service ids (`id`, `accId`). Do not use the long merchant `accountId` unless future captures prove it is valid.
- `fetchContactListWithFallback()` treats bare `data:0` as ambiguous and must not clear an existing real list on that response alone.
- Never show fallback/source words to the客服 user. They belong in logs only.

## Contact List

Important functions:

- `loadContacts`
- `sortContacts`
- `renderContacts`
- `renderConversationTabs`
- `selectContactById`
- `handleContactListKeydown`
- `markContactRead`
- `syncConsumedMessages`
- `syncAllConsumedMessages`
- `consumeMessageWithFallback`
- `consumeMessageViaLocalSignalR`

Behavior rules:

- Tabs: `current`, `guestbook`, `history`.
- Current tab must not clear `state.contacts` or `state.listCounts.current` just because `/Contact/GetContactList` with `accountId` returns bare `data:0`.
- If current data is ambiguous and there is an existing real list, preserve it and log the source internally.
- Preserve active right toolbar tab when switching contacts.
- Selected unread conversation should clear the local badge and sync server read state. The main path is `/local/signalr/consume` -> Node `@microsoft/signalr` -> hub `ConsumeMessage(contactId, 0)`. Browser SignalR and HTTP `/ChatContent/ConsumeMessage` are fallback only.
- Keyboard up/down switches conversations when focus is in list.
- Auto refresh should preserve scroll.
- History tab visible count must use the backend history count only, like the client `历史(5700)`.
- History list contents must also come from the backend history endpoint only. Do not merge Web local clear-list caches into the visible history list.
- Recent real captures showed `isHistory=true&pageSize=1` returning `data:0`; use `pageSize=20` for count probes and keep investigating with real client captures.

Read-state SignalR facts:

- Original Electron invokes `ConsumeMessage(contactId, 0)` over SignalR and `ConsumeMessage(0, 0)` for all-read.
- Hub URL is derived from API base: `http://192.168.9.83:18080/api` -> `http://192.168.9.83:18080/chathub?mode=client&userName=<shortAccountId>`.
- Register call is `RegisterUser(accountId, false, false, 0)`.
- Current verified short account id for `Boom666 / 客服-王` is `2`.
- Do not use username `Boom666` or merchant long id `1556504756803862529` for SignalR registration.
- Verified on 2026-06-09: `/local/signalr/consume` for `contactId=7052` returned `source=node-signalr`, then `/Contact/GetContactList(accountId=2)` showed `unRead: 0` after previously being `1`.
- 2026-06-10 follow-up fix: do not tie local read-state protection only to `contact.sortTime`. A customer-service reply updates `sortTime` and can make a just-read conversation look unread again after refresh. Use last incoming customer-message time (`lastIncomingTime`) as the main guard, and after successful send run read sync + contact refresh.

Clear-list behavior:

- `archiveAndClearCurrentList`
- `filterLocallyClearedContacts`
- `loadClearedContactState`
- `persistClearedContactState`

Clear-list is only a short local anti-repopulate filter after the real clear-list API succeeds. It must not create local history records or inflate `历史(...)`.

Recent contact-count functions:

- `getConversationTabCount`
- `formatTabCount`
- `hasZeroDataPayload`
- `fetchContactListWithFallback`
- `fetchContactListPayload`
- `state.listServerCounts`
- `state.listCountSources`

## Contact Avatars

Real captures show customer avatars in both `/Contact/GetContactList` and `/Contact/GetContactInfo` as `avatar` URLs, often `wx.qlogo.cn`.

Important functions:

- `CONTACT_AVATAR_FIELDS`
- `getAvatarFromRecord`
- `getContactAvatar`
- `renderContactAvatar`
- `handleAvatarImageError`
- `syncActiveContactFromInfo`
- `renderActiveAvatar`
- `renderMessageAvatar`

Rules:

- All customer avatar UI must go through `renderContactAvatar()` or `getContactAvatar()`.
- Do not hand-roll `contact.avatar ? <img ...>` in new UI.
- `/Contact/GetContactInfo` can return a fresher avatar than the list; `loadContactInfo()` must sync that avatar into both `state.activeContact` and matching `state.contacts`.
- If the avatar URL fails to load, fall back to the customer initial. Do not substitute fake profile images.
- When auto-refresh changes the active contact avatar, re-render message avatars with `renderMessagesPreservingScroll()`, so chat scroll is not pushed to the bottom or reset to the top.

## Chat

Important functions:

- `loadMessages`
- `fetchMessagePage`
- `normalizeMessage`
- `mergeMessages`
- `renderMessages`
- `renderMessageBubble`
- `handleMessageListScroll`
- `scrollElementToBottom`
- `restorePrependScroll`

Rules:

- Main chat should show newest at bottom.
- “Load more” is at top for older messages.
- Right history panel should also load older records from top/scroll-up.
- System notices are internal, not customer messages.
- No-reply notifications should not trigger customer replies.

Composer send shortcut:

- `#sendMode` lives to the right of `#sendText`.
- Persisted key: `localStorage.youchat.composer.sendMode`.
- Default is `enter`.
- Important functions: `hydrateComposerFields`, `updateComposerStatus`, `handleReplyKeydown`, `handleSendModeChange`, `normalizeSendMode`.
- `enter` mode: Enter sends; Shift+Enter or Ctrl+Enter can insert a line break.
- `ctrl-enter` mode: Enter inserts a line break; Ctrl+Enter sends.
- `handleReplyKeydown()` checks `event.isComposing`; keep this to avoid sending while Chinese IME is composing text.

## Link Cards And Preview Overlay

User requirement:

- Long links should render like the original client's WeChat-style card with real title/thumb and a `详情` action.
- Web enhancement: `详情` opens an in-page floating preview block.
- If real video/player metadata exists, the overlay should preview it.
- Chat images should also open in the same in-page overlay when clicked.

Important files/functions:

- `public/app.js`
  - `state.linkPreviewCache`
  - `state.activeLinkPreview`
  - `normalizeMessage`
  - `renderMessageContent`
  - `shouldRenderMessageLinkCard`
  - `buildMessageLinkCard`
  - `buildAppDeepLinkCard`
  - `renderMessageLinkCard`
  - `linkifyMessageText`
  - `hydrateVisibleLinkCards`
  - `loadLinkPreviewMeta`
  - `showLinkPreview`
  - `showImagePreview`
  - `renderActiveLinkPreview`
  - `handlePreviewClickTarget`
  - `getDirectPreviewVideoUrl`
  - `getPreviewPlayerUrl`
- `public/index.html`
  - `#linkPreviewOverlay`
- `public/styles.css`
  - `.message-link-card`
  - `.link-preview-overlay`
  - `.link-preview-panel`
  - `.link-preview-video`
  - `.link-preview-frame`
- `server.js`
  - `MAX_LINK_PREVIEW_BYTES`
  - `handleLinkPreview`
  - route `/local/link-preview`

Rules:

- Do not fake title, thumbnail, or video metadata.
- Preserve real card fields from the message when present: `cardTitle`, `cardDesc`, `cardImg`, `cardUrl`, and mini-program aliases.
- Render images before link cards so image URLs still show as images.
- Promote a plain URL into a card only when the message is a native card/link type or the whole message is just a URL.
- If text contains a URL plus other words, keep the text and render the URL as a clickable inline blue button.
- Real thumbnails are always preferred: `cardImg`, then preview metadata image.
- For known major platforms with no real thumbnail, use platform logo fallback. This is intentional platform identification, not fake product imagery.
- Known platform fallback is configured in `KNOWN_SITE_LOGOS`; update that table instead of adding ad hoc render branches.
- `renderMessageContent()` renders image messages as `.message-image-button[data-image-preview]`, not a bare `<img>`.
- Image preview state is `state.activeLinkPreview = { url, type: "image" }`; `renderActiveLinkPreview()` switches the existing overlay into `.is-image-preview`.
- Main chat, right toolbar, and tool modals should all route preview clicks through `handlePreviewClickTarget()` so image/link behavior stays consistent.
- The preview header uses grid columns `minmax(0, 1fr) auto`; keep actions in the fixed right column so long URLs cannot push the close button off screen.
- App deep links are configured in `APP_DEEP_LINK_PROFILES`; examples include `weishi://feed`, `kwai://`, `snssdk1128://`, `xhsdiscover://`.
- Deep links should render as cards, not raw long text. Parse nested encoded params such as `feed_info`, use embedded real `http(s)` URL for preview/open, and keep the original app scheme for copy.
- Logo fallback supports external favicon first and local generated SVG via `imageFallback` on error.
- Unknown sites with no thumbnail still show a domain abbreviation fallback.

## Skill Reply UI

Important functions:

- `getSkillSteps`
- `getSkillText`
- `getSkillImageSteps`
- `renderSkillImageStrip`
- `renderSkillMatchCard`
- `renderSkillRow`

Rules:

- Skill images come only from real `replySteps` or suggestion `steps` with `type: "image"`.
- Skill image thumbnails use `.skill-image-thumb[data-image-preview]`, so they reuse the same in-page image preview overlay as chat images.
- Keep skill cards compact: text preview is clamped to 3 lines and images render as 34px thumbnails.
- Direct `video/*` or video file URLs use `<video>`.
- Player URLs such as `twitter:player` or `og:video:iframe` use iframe.
- Ordinary webpages use iframe, but some sites block embedding. Keep the `打开网页` button.

Recent verification:

- `npm run check`
- `git diff --check`
- `/health`
- `/local/link-preview` with:
  - `https://example.com/` -> real `Example Domain`.
  - `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4` -> real `video/mp4`.
  - `https://www.xiaohongshu.com/goods-detail/69eb394dae65c90001108dbd` -> real `小红书`; if no real thumbnail, use known-site logo fallback, not fake product media.
- In-app browser loaded `http://localhost:5177/`; overlay DOM exists, hidden by default, no console errors.

## Right Toolbar

Important functions:

- `setToolTab`
- `loadToolDataForActiveTab`
- `renderToolContent`
- `renderUserInfo`
- `renderQuickReplyPanel`
- `renderSkillReplyPanel`
- `renderOrderPanel`
- `renderAccountDetails`
- `renderHistoryPanel`

Rules:

- Blue real values can be copied.
- Orders are platform grouped.
- Detail means account transaction/waterflow details.
- Do not truncate important user info.
- Keep selected tool tab when switching contacts.

## Quick Replies

APIs:

- `/Faq/GetPageList`
- `/Faq/GetTypeList`

Functions:

- `loadFaq`
- `loadFaqCategories`
- `renderQuickReplyPanel`

UI rule:

- Match original client idea: quick reply item with send and edit actions.
- If quick replies are empty, inspect API params and `logs/api-capture.ndjson` before adding fallback content.

## AI And Skill

Defaults:

- `DEFAULT_AI_BASE_URL = "https://sub2.sn55.cn/"`
- `DEFAULT_AI_MODEL = "gpt-5.4-mini"`
- `DEFAULT_AI_AUTH_TYPE = "bearer"`
- API key is currently hardcoded by user request and persisted in localStorage.
- `AI_PRESETS.deepseek` sets `baseUrl = "https://api.deepseek.com"` and `model = "deepseek-v4-flash"`.
- DeepSeek uses its own API key. The preset must not overwrite the current key.
- `AI_PRESETS.codebuddy` sets `authType = "x-api-key"`. CodeBuddy access keys use `X-Api-Key`, not Bearer.

Settings:

- `state.aiEnabled`: AI recommendations enabled.
- `state.skillAutoReply`: skill auto-send switch.
- `state.skillAutoLearn`: manual reply learning switch.
- `state.aiAuthType`: `"bearer"` or `"x-api-key"`.
- `hydrateAiSettingsFields`
- `saveAiSettings`
- `persistAiSettings`

Skill file:

- `data/reply-skills.json`

Local skill endpoints in `server.js`:

- `GET /local/reply-skills`
- `POST /local/reply-skills`
- `POST /local/reply-skills/learn`

Core functions:

- `getAiRelayBasePayload`
- `normalizeAiAuthType`

Server AI proxy:

- `server.js:getAiChatCompletionsUrl()` still normalizes OpenAI-compatible `/chat/completions` URLs.
- `server.js:getAiAuthHeaders()` chooses `Authorization: Bearer <key>` or `X-Api-Key: <key>`.
- If a CodeBuddy/Copilot Tencent host is used without explicit authType, the proxy defaults to `X-Api-Key`.

- `loadReplySkills`
- `saveReplySkills`
- `matchReplySkill`
- `buildSkillSuggestion`
- `maybeBuildSkillSuggestion`
- `sendSuggestionSteps`
- `learnFromManualReply`
- `learnMatchedSkillOverride`
- `replaceReplySkill`
- `updateSkillFromSuggestion`
- `generateAiWithRelay`
- `requestAiRelaySuggestions`
- `requestAiChatReplies`
- `refreshAiSuggestion`
- `scheduleAutoAiSuggestion`
- `generateAutoAiSuggestion`
- `buildAutoSuggestionKey`
- `renderAiSuggestionCard`
- `optimizeSkillById`

Recent AI behavior:

- AI recommendation is automatic after selecting a contact or loading/merging messages.
- It first tries skill. If no skill matches, it calls `/ai/chat/completions`.
- It deduplicates by latest actionable customer message key.
- Manual AI button still works and shows errors.
- Auto AI failures are silent and logged.

Recent AI UI:

- Recommendation panel is now its own `#aiSuggestionCard` grid row between `#messageList` and `footer.composer`.
- It is not inside the composer and is not absolutely positioned.
- Left label: `AI 推荐`, `文字优化`, or `skill 回复`.
- Right list: 1 to 3 candidates, each with `采用` and `发送`.
- Left rail includes `换一换`, which regenerates a different tone/style.
- Global apply/send buttons are hidden in the strip. Bottom `采用推荐` remains as backup.
- The panel may consume message-list space, but must never move the composer down or hide the textarea.

Composer/AI layout details:

- `.chat-pane` rows are `58px minmax(0, 1fr) auto auto`: header, message list, recommendation row, composer row.
- `footer.composer` is split into independent modules:
  - `.composer-tools`
  - `.composer-attachments`
  - `.composer-editor`
  - `.composer-actions`
- `.composer-tools` must remain a single horizontal strip with overflow-x scrolling. Do not allow it to wrap and steal textarea height.
- Do not reintroduce `observeComposerLayout()`, `updateComposerLayoutMetrics()`, `--composer-height`, or `--ai-suggestion-height`.
- Do not make `.ai-suggestion-card` `position:absolute` again. It caused repeated overlap and input-box jumping.

Skill optimize:

- Skill match card and skill rows have an `优化` button.
- `optimizeSkillById(id)` uses current skill text, draft text, draft image count, latest customer message, and recent conversation.
- It only optimizes text. It must not infer image contents.
- Optimized suggestions use `keepDraftImages` so applying/sending preserves staged images.
- Optimized skill suggestions carry `type="optimize"` and `skillId`.
- `renderAiSuggestionCard()` must show `更新skill` for optimized skill suggestions. This is the explicit path to overwrite the current skill.
- `updateSkillFromSuggestion()` writes optimized text back to that skill's `replySteps/fallback` using `replaceReplySkill()`.
- If draft images are staged when saving/updating a skill, `uploadDraftImagesForSkill()` uploads them through the real OSS chain and stores returned URLs as `replySteps` image steps.
- `mergeTextWithExistingSkillImages()` preserves existing image steps and dedupes image URLs when text is updated.

Skill manual learning:

- `sendText()` snapshots `buildSkillSuggestion()` before sending when no suggestion was adopted.
- If a matched skill exists, `learnFromManualReply(..., { matchedSkill })` calls `learnMatchedSkillOverride()` instead of creating an unrelated learned skill.
- `learnMatchedSkillOverride()` stores manual replies in `skill.manualOverrides`.
- Repeated identical prompt/reply increments `count`.
- Total manual override count >= 3 automatically writes the manual reply back to the matched skill's `replySteps/fallback`, raises priority at least to 75, and keeps auto-reply eligibility unless the skill explicitly disabled it.
- Do not remove this path. User explicitly wants ignored AI/skill suggestions to teach the matched skill.

Skill right-panel match UI:

- `renderSkillReplyPanel()` passes the current suggestion into `filterReplySkills()` and `renderSkillRow()`.
- Matched skill is sorted first.
- Matched skill gets `.is-matched`; other rows get `.is-dimmed`.
- Dimmed rows remain clickable. They are visual alternatives, not disabled.
- `public/styles.css` has `.skill-row.is-matched`, `.skill-row.is-dimmed`, and `@keyframes skill-match-rise`.

DeepSeek:

- Official OpenAI-compatible base as verified on 2026-06-07: `https://api.deepseek.com`.
- Chat completions path is `/chat/completions`, not `/v1/chat/completions`.
- Preset model is `deepseek-v4-flash`.
- Do not use old preset names `deepseek-chat` or `deepseek-reasoner`; official docs indicate they are deprecated after 2026-07-24 15:59 UTC.
- `server.js:getAiChatCompletionsUrl()` special-cases DeepSeek so both `https://api.deepseek.com` and `https://api.deepseek.com/v1` resolve to `/chat/completions`.
- `proxyAi` passes through `reasoning_effort` and `thinking` for future model options.

## Image And Composer

Functions:

- `handleReplyPaste`
- `getClipboardImageFiles`
- `handleReplyDrop`
- `sendText`
- `sendImageFile`
- `sendChatContent`
- `uploadChatImage`
- `uploadImageViaLocalProxy`
- `uploadDraftImagesForSkill`
- `withSendingLock`

Rules:

- Pasted images are staged in composer.
- Clipboard text + images must work in one paste: do not prevent default paste when text/html or text/plain exists; still stage image files from `clipboardData.files` and `clipboardData.items`.
- Text and images can be prepared together, but are sent through separate API steps.
- Draft images render inside `.composer-editor` as a left attachment rail (`#draftImageTray`), not as a separate row.
- Draft AI optimization changes text only and keeps original images.
- Manual replies, including image URLs, should be learned when `skillAutoLearn` is true.
- Skill save/update must not store `blob:` object URLs. Upload drafts first, then persist real image URLs in `replySteps`.
- `sendText()` and `sendSuggestionSteps()` are wrapped by `withSendingLock()` to stop duplicate submissions while the server queues/flushes messages.

## Friend Requests

APIs:

- `/Contact/GetNewFirend`
- `/Contact/NewFirendAccept`
- `/Contact/NewFirendIgnor`

Functions:

- `loadFriendRequests`
- `renderFriendRequestsDialog`
- `handleFriendRequestDecision`

## Server

`server.js` important areas:

- `proxyApi`: forwards real YouChat API and captures logs.
- `proxyAi`: OpenAI-compatible relay.
- `proxyOssUpload`: image upload helper.
- local skill read/write/learn routes.
- `/health`: returns server and default AI config.

Do not log raw API keys. Use masking helpers if adding logs.

## Portable Patch System

The project now has a portable zip overlay patch workflow. Use it when the user wants to move this web dev kit to another folder, another machine, or a fresh client-source location.

Files:

- `PATCH_GUIDE.md`: human instructions.
- `tools/export-devkit-patch.ps1`: exports a zip patch into `patches/`.
- `tools/import-devkit-patch.ps1`: imports a patch into any target path and backs up overwritten files.
- `tools/audit-client-update.ps1`: audits the original Electron client after updates.
- `tools/compare-client-audits.ps1`: compares two audit JSON reports and lists key file and endpoint changes.

Commands:

```powershell
npm run patch:export
npm run client:audit
npm run client:audit:compare
```

Patch format:

- `payload/`: overlay files.
- `youchat-devkit-manifest.json`: file hashes plus original-client fingerprints.
- `PATCH_README.md`: short import guide.
- `PATCH_GUIDE.md` is included in the payload so imported targets keep the full guide.

Import backups:

- `<TargetPath>\.youchat-patch-backups\<timestamp>`
- `import-report.json` is written there.

After Electron client updates:

1. Run `npm run client:audit`.
2. Run `npm run client:audit:compare`.
3. Review `reports/client-update-audit-*.md` and `reports/client-audit-compare-*.md`.
4. If iconfont, Braft CSS, emoji sprite, `YouChatService.xml`, or endpoint candidates changed, inspect mappings/API params before exporting a new patch.
5. Update `PROJECT_MEMORY.md`, `AI_HANDOFF.md`, and `PATCH_GUIDE.md` when this workflow changes.

## UI Register

Product UI, not marketing. Keep:

- blue/white YouChat client style
- dense, calm, scannable layout
- small radius around 5 to 6px
- stable text and scroll positions

Avoid:

- fake dashboard cards
- purple AI gradients
- large decorative panels
- AI recommendation blocks that cover the input area
- invented data

## Native Icons

Do not use random external icon glyphs for the client UI. Current native sources:

- YouChat iconfont: `C:\Program Files\youchat-desktop\wwwroot\fontIcon\iconfont.css`
- Braft editor iconfont embedded in original chatHistory CSS. `server.js` extracts it through `/native-icons/braft-icons.woff`.
- Original emoji sprite: `C:\Program Files\youchat-desktop\wwwroot\static\emojiSource.cdbf96da.png`, served through `/static/emojiSource.cdbf96da.png`.

Current mappings:

- Composer: `bfi-emoji`, `bfi-code`, `bfi-media`, red packet sprite, `bfi-camera`, `bfi-pushpin`, YouChat `client-icon-ai`.
- Settings/user/enter: YouChat iconfont `\e605`, `\e60e`, `\e60d`.
- Refresh/close/copy/search/login dropdown: `bfi-replay`, `bfi-close`, `bfi-copy`, `bfi-search`, `bfi-drop-down`.
- `pro_icon.svg` and `icons/icon-128x128.png` in the original package are Ant Design Pro defaults, not YouChat brand assets. Do not swap the app logo to those.

Validation from 2026-06-07:

- `/native-icons/braft-icons.woff` returned 200, `font/woff`, length 11348.
- `/static/emojiSource.cdbf96da.png` returned 200, `image/png`, length 616827.
- Composer toolbar CDP check: 7 icon buttons are 30x30, font icons 17x17, red packet 18x18.

## Chat Scroll

Important bug fix:

- `scrollToFirstUnreadMessage()` must only target `[data-red-point="true"]`.
- Do not fallback to `.message.incoming`; that jumps ordinary conversations to the first customer message.
- `selectContactById()` now calls `hasUnreadMessageAnchor()` before jumping to unread. If there is no real red-point anchor, it calls `scheduleMessageListBottom({ watchImages: true })`.
- CDP check verified a selected unread conversation without red-point anchors ends with `bottomGap = 0`.

## Current Change Log

2026-06-07:

- Added `PROJECT_MEMORY.md`.
- Added `AI_HANDOFF.md`.
- Added automatic AI recommendations on contact selection and message refresh.
- Added auto AI dedupe state and functions.
- Refactored AI relay call so manual and automatic calls share core logic.
- Changed AI recommendation UI from card blocks to compact list strip.
- Added `accountIdResolved` and tightened current-list accountId selection.
- Verified `npm run check`.

2026-06-07 follow-up:

- Moved the AI suggestion close button to the top-right corner of the suggestion strip.
- Kept the left rail as a label only: `AI 推荐`, `文字优化`, or `skill 回复`.
- Restyled candidates as real list rows with number, two-line text, `采用`, and `发送`.
- Fixed duplicate numbering such as `1. 1.` by returning raw text for single-step suggestions in `formatSuggestionText`.
- Updated AI prompt to request 1 to 3 replies, preferably as a JSON array.
- Added `buildLocalSuggestionVariants` so a single model reply can be expanded into up to three usable candidates.
- Verified `npm run check`.

2026-06-07 friend request fix:

- `GET/POST /Contact/GetNewFirend` with no `scene/scenes` returns `total: 0` in current real API behavior.
- Single sources work. Verified examples:
  - `scene=17, scenes=17` 微信卡片: `total: 1453`.
  - `scene=3, scenes=3` 搜索微信号: `total: 7`.
  - `scene=30, scenes=30` 扫描二维码: `total: 3`.
- Therefore the UI “全部来源” must not call the empty-source request.
- Added `FRIEND_ALL_SOURCE_VALUES`.
- Added `loadFriendRequestsBySource(source, page, size)`.
- Added `loadAllFriendRequestSources(page, size)` to request all source scenes, merge, sort, de-dupe, and frontend-paginate.
- Added `mergeFriendRequests(records)`.
- Added `state.friendSourceCounts` and source-count badges in the friend source tabs.
- Replaced the ugly friend request text icon with a CSS-drawn two-person icon.
- Friend request badge hides at 0 and displays `99+` over 99.
- Verified `npm run check`, `/health`, `/app.js`, `/styles.css`, and direct proxy calls for empty source, 17, 3, 30.

2026-06-07 history contact access:

- History tab contact cards now show a hover-only access button.
- Added `getContactHoverActions(contact, contactId)`:
  - `guestbook`: access + close.
  - `history`: access only via `data-contact-action="access-history"`.
  - `current`: close only.
- `handleContactAction` routes `access-history` to `accessHistoryContact(contact)`.
- `accessHistoryContact` calls real `/Conversation/AccessIn` with `contactId` and `accountId`.
- On success it removes the contact from local history cache, switches `state.listTab` to `current`, refreshes contacts, and selects the live contact if returned.
- If backend sync is slow, it temporarily inserts the accessed contact into current list so the user sees immediate feedback.
- Verified `npm run check`, `/app.js`, and `/styles.css`.

2026-06-07 native icons and chat-bottom fix:

- `server.js` now has `CLIENT_WWWROOT`, Braft icon extraction, and original emoji sprite serving.
- `public/index.html` composer toolbar uses original Braft/YouChat iconfont classes and the original red packet sprite.
- `public/styles.css` defines `youchat-iconfont`, `braft-icons`, native glyph mappings, and normalized icon sizes.
- Dynamic buttons in `public/app.js` use native close/copy/search/enter icons.
- Login account dropdown uses `bfi-drop-down`; password eye remains CSS because no original eye glyph was found.
- Fixed contact switching scroll by removing `.message.incoming` as unread fallback.
- Verified `npm run check`, `/health`, native asset routes, and CDP layout/scroll checks.

2026-06-07 portable patch system:

- Added `PATCH_GUIDE.md`.
- Added `tools/export-devkit-patch.ps1`.
- Added `tools/import-devkit-patch.ps1`.
- Added `tools/audit-client-update.ps1`.
- Added `tools/compare-client-audits.ps1`.
- Added npm scripts `patch:export`, `client:audit`, and `client:audit:compare`.
- Export patch is a zip overlay, not git diff, so it can be imported into arbitrary directories.
- Import backs up overwritten files into `.youchat-patch-backups`.
- Client audit records iconfont/Braft/emoji/YouChatService fingerprints and endpoint candidates for update tracking.
- Client audit compare reports key file hash changes plus added/removed endpoint candidates.
- Export payload includes `PATCH_GUIDE.md` so imported targets keep the complete migration guide.

2026-06-07 skill optimize, refresh suggestion, and DeepSeek:

- Added `AI_PRESETS` with `sub2` and `deepseek`.
- AI settings modal now has provider preset buttons.
- DeepSeek preset fills `https://api.deepseek.com` and `deepseek-v4-flash` without overwriting API key.
- `server.js` special-cases DeepSeek chat completions URL and passes `reasoning_effort` / `thinking`.
- Added `requestAiChatReplies` helper.
- Added `refreshAiSuggestion`, bound to the new `换一换` button.
- `换一换` rotates tone instructions: natural reassurance, concise direct, patient explanation, soft conversational.
- Added skill `优化` actions in the match card and every skill row.
- Added `optimizeSkillById`, combining skill text, draft text, staged image count, latest customer message, and recent context.
- Recommendation strip has more breathing room while staying above the composer and not hiding the textarea.
- Verified `npm run check`, `/health`, `/app.js`, `/styles.css`, and DeepSeek URL mapping.

2026-06-07 convergence audit:

- User asked to收敛 all previous requirements and missing docs.
- `README.md` was stale. It now documents `/ai/chat/completions` as the main AI path, DeepSeek preset, `换一换`, skill `优化`, friend requests, clear-list archive, patch export, and client audit flow.
- `PRODUCT.md` no longer says to keep preview/fake data when APIs fail. Current rule: show real failure state and logs, no fake users/orders/messages.
- Legacy `generateAi()` in `public/app.js` no longer calls `/ChatContent/GenerateRealAIReply`; it delegates to `generateAiWithRelay()`.
- Friend request badge now preloads real source totals via `loadFriendRequestBadgeTotals()` on connect and refresh.
- Friend request badge preload uses empty nickname/robot filters so dialog search does not corrupt the global badge count.
- `loadAllFriendRequestSources()` now uses `loadFriendRequestsFromSourceWindow()` to fetch enough source pages for the current aggregate page before merging, reducing empty "全部来源" pages when source totals are large.
- Added `FRIEND_AGGREGATE_SOURCE_PAGE_SIZE = 50`.
- DeepSeek URL mapping now normalizes `https://api.deepseek.com/v1/chat/completions` to `https://api.deepseek.com/chat/completions`.
- Still needs real-client verification for FAQ parameter variants and history cursor behavior if the user reports empty data.

2026-06-07 AI suggestion pill UI:

- User complained the AI recommendation strip above the composer looked clipped and stitched together.
- `public/styles.css` changed only.
- `.composer` is now `overflow: visible`.
- `.ai-suggestion-card` no longer has the large outer bordered panel.
- `.ai-suggestion-head` is a compact pill group for label, `换一换`, and close.
- Each `.ai-suggestion-option` is an independent content-sized pill with `width: fit-content`.
- Removed `-webkit-line-clamp` from `.ai-suggestion-option p`; do not bring it back.
- Long text wraps naturally with `white-space: pre-wrap` and `overflow-wrap: anywhere`.
- Candidate container still has a max height so huge suggestions do not swallow the textarea.
- Headless Chrome test screenshot: `C:\youchat-dev-web\ai-suggestion-pill-check.png`.

2026-06-07 image paste and Qiniu upload:

- User reported pasted images became flattened in the composer and image send failed with "OSS upload endpoint is missing".
- Real `GetOssConfig` capture showed Qiniu, not Ali OSS:
  - `cloudType: 0`
  - `qnDomain: https://qiniu.yunsert.com`
  - `qnRegionUrl: http://upload.qiniup.com`
  - `qnToken: ...`
- `public/app.js` now recognizes `qnRegionUrl/qiniuUploadUrl/qnUploadUrl` as upload endpoint.
- Qiniu form uses `{ key, token, file }` when `qnToken/qiniuToken/uploadToken` exists.
- Final image URL uses `qnDomain/qiniuDomain/publicDomain/cdnDomain + objectKey`.
- `server.js` local `/local/oss-upload` proxy also supports Qiniu fields for CORS fallback.
- Composer layout fix:
  - `.chat-pane` bottom composer row is `auto`, not fixed `202px`.
  - `.composer` has `min-height: 202px`, max height capped.
  - `.draft-image-tray` is non-shrinking with 74-82px height.
  - `.draft-image` is fixed 62x62.
- If future capture returns Tencent COS fields like `txHostUrl`, `txPolicy`, `txQak`, `txQsignature`, add COS form support.

2026-06-07 chat jump and composer stabilization:

- User reported repeated jumping/flicker in the main chat, especially around auto refresh, AI suggestions, and pasted images.
- Root cause was not just the textarea. The old flow forced bottom scroll too often:
  - `loadMessages(1, "replace")` rendered `"bottom"` before and after network responses.
  - `renderMessages()` defaulted to `"bottom"`.
  - image `load/error` callbacks from `scrollElementToBottom(..., watchImages)` could fire later and steal the scroll position.
  - right-side history used similar replace-to-bottom behavior.
- `public/app.js` changes:
  - `renderMessages(scrollMode = "none")` is now stable by default.
  - `loadMessages(page, mode, options)` supports `{ forceBottom: true }` and `{ keepPosition: true }`.
  - send flows use `{ forceBottom: true }`.
  - manual refresh uses `{ keepPosition: true }`.
  - auto merge only follows bottom if the user was already near bottom.
  - new `scrollRequestId` + `scrollRequestIds` WeakMap invalidates stale image-load scroll callbacks.
  - new `restoreScrollTop()` preserves viewport for refresh/merge when the user is reading older content.
  - `restorePrependScroll()` and `scrollElementToBottom()` now guard against user scroll-away.
  - `loadHistoryMessages(page, mode, options)` mirrors the same scroll rules for the right history tab.
  - `renderAiSuggestionCard()` only keeps the main chat at bottom when the user was already at bottom.
  - `renderDraftImages()` toggles `.composer.has-draft-images` for old Electron/browser compatibility.
- `public/styles.css` changes:
  - `.chat-pane` grid rows are `58px minmax(0, 1fr) minmax(0, auto) auto`.
  - AI recommendation strip is between message list and composer, consuming chat area height instead of pushing the composer down.
  - `.composer` is a fixed bottom grid workbench with stable toolbar, image tray, textarea, and send row.
  - `.composer.has-draft-images` and `:has(.draft-image-tray:not(.is-hidden))` expand the composer upward when images exist.
  - `.draft-image-tray` is fixed at 74px; `.draft-image` is fixed 62x62.
  - `.ai-suggestion-card` is a compact horizontal queue-style strip with visible close/refresh controls and internal scrolling.
- Maintenance rules:
  - Do not move `#aiSuggestionCard` back inside `footer.composer`.
  - Do not change `renderMessages()` default back to `"bottom"`.
  - Every new message refresh entry must explicitly choose `forceBottom` or `keepPosition`.
  - Preserve image-load scroll guards whenever image rendering changes.
- Verified:
  - `npm run check`
  - `GET /health` 200
  - `GET /app.js` 200
  - `GET /styles.css` 200

2026-06-08 FnOS MySQL collation recovery:

- User reported the official Windows client also stopped loading information after restart.
- Diagnosed the FnOS Docker service instead of Web UI.
- `youchat-service`, `youchat-mysql`, `youchat-autologin`, and `youchat-control` were running.
- Logs under `/vol1/1000/Docker/youchat/logs\Boom-1556504756803862529/20260608/error_20260608.log` showed repeated `Illegal mix of collations for operation 'UNION'`.
- DB inspection showed:
  - `ChatContent_2026_06_01`: `utf8mb4_general_ci`
  - `ChatContent_2026_06_08`: `utf8mb4_unicode_ci`
  - core tables like `Contact` and `Conversation`: `utf8mb4_general_ci`
- Backed up DB, then ran:

```sql
ALTER DATABASE `1556504756803862529`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE `ChatContent_2026_06_08`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

- Made clean post-fix backup with `mysqldump --no-tablespaces`.
- Verified `POST /api/Contact/GetContactList` and `POST /api/ChatContent/GetList` return real records again.
- `System/CheckLoginStatus` can still time out or throw when called without params; do not confuse that residual endpoint behavior with the restored contact/chat path.

2026-06-08 current conversation refresh/count fix:

- User reported Web refresh produced strange extra conversations and wrong counts; official Windows client did not.
- Root cause was frontend data shaping, not the FnOS MySQL collation issue.
- API truth:
  - `GET /Senstive/GetAccountList` returns `Boom666` with short id `id=2` and long backend account id `accountId=1556504756803862529`.
  - `/Contact/GetContactList` must receive the short `accountId=2` for current customer-service conversations.
  - Bare `/Contact/GetContactList` returns mixed/all contacts. Current probe returned `total=8034` with many `conversationId=0/accountId=0` ended/history contacts.
  - `isHistory=true` returned `total=5707`; `isGuestbook=true` returned `total=0`.
- `public/app.js` now:
  - Resolves account candidates from `/Senstive/GetAccountList` before current list loading.
  - Stores/uses only short numeric account ids via `CONTACT_LIST_ACCOUNT_ID_PATTERN`.
  - Does not prefer the bare global request for current when a candidate account id exists.
  - Filters global current fallback to `conversationId>0 && accountId>0`.
  - Uses filtered count instead of bare `total=8034` for any `global-filtered` current fallback.
  - Preserves ambiguous empty current responses only when existing contacts already all look like valid current conversations.
- Browser verification after connecting to `http://localhost:5177`:
  - Header: `2 个客户`.
  - Tabs: `当前(2)`, `留言(0)`, `历史(5707)`.
  - Current cards: `contactId=412`, `contactId=2303`.
- Latest capture log after auto refresh showed current list requests include `accountId=2`.
- Do not commit `logs/api-capture.ndjson`; it is runtime capture noise.

2026-06-08 message card rendering split:

- User asked to optimize link, mini-program, and file message display to mimic WeChat cards.
- Real enum source: `C:\Program Files\youchat-desktop\bin\YouChatService.xml` `EnumContentType`.
- Treat message content types as:
  - `5`: URL/web card, use `cardTitle/cardDesc/cardImg/cardUrl`.
  - `6`: mini-program card, use `miniProTitle/miniProName/miniProDesc/miniProImg/miniImgUrl/miniProUrl`.
  - `8`: file card. Current real sample stores JSON in `content`, e.g. `{"Title":"...pdf","Type":74,"TypeStr":"[应用消息]"}`.
- `public/app.js` now renders in this order:
  - image -> file card -> mini-program card -> link/web card -> text.
- Mini-program card specifics:
  - The original packaged client component uses `miniProTitle` and `miniImgUrl`, a large cover area, and a footer label `小程序`.
  - Real capture sample has `contentType=6`, `miniProTitle="绑定一下吧！"`, `miniProName="阿秘优选"`, and often no `miniProImg`.
  - `buildMessageMiniProgramCard()` parses both `message.content` and `message.ext` and supports JSON/XML fields such as `appid`, `ghid`, `username`, `pagepath`, `miniimgurl`, `thumburl`, `cover`, and `hdheadimg`.
  - Missing cover means generated local SVG type placeholder only. Do not fake product screenshots or mini-program business imagery.
- Important helpers:
  - `shouldRenderRichMessageCard`
  - `buildMessageMiniProgramCard`
  - `buildMessageFileCard`
  - `parseMessagePayload`
  - `formatFileSize`
  - `getFileIconMeta`
- `public/styles.css` now has:
  - `.message-mini-card`
  - `.message-file-card`
  - `.message-content.has-rich-card`
  - `.history-chat-list .message-content.has-rich-card`
- Keep the history override. Without it, right-side history adds normal message padding back to rich cards.
- Temporary visual QA page `public/card-preview.html` was created and deleted; do not expect it in the repo.

2026-06-08 native top-right client functions:

- User wanted the original Windows client's top-right settings/actions replicated, and separated from Web AI settings.
- `public/index.html` topbar now has:
  - `clientBackendButton`: opens stats backend.
  - `clientGlobalSearchButton`: global chat history search.
  - `clientStatsButton`: message statistics panel.
  - `clientNoticeButton` + `clientNoticeBadge`: notifications.
  - `clientSettingsButton` + `clientSettingsMenu`: native client menu.
  - `aiSettingsButton`: separate AI button, not the native gear.
- `public/app.js` added state for:
  - `clientPaused`
  - `clientOptions`
  - `databaseDelete`
  - `globalSearch`
  - `clientStats`
  - `clientNotice`
- Native data shape fixes added in this pass:
  - `unwrapPayloadData()`, `getRecordsDeep()`, `getTotalDeep()`: use these for nested native panel payloads instead of changing global `getData()`.
  - `normalizeStatsRecords()` now unwraps `/Summary/RealTimeSummary` shape `{ data: { success, data: [...] } }`.
  - Stats rows use real fields `it`, `count`, `fromUser`, `fromUserRedpointCount`, `fromRobot`, `fromKefu`, `contactCount`.
  - `/Notice/GetList` total is currently `data.total.value`; list is `data.data`.
- Real interfaces wired:
  - `/System/GetOptions`
  - `/System/SetOptions`
  - `/ChatContent/Delete`
  - `/ChatContent/SearchList`
  - `/Summary/RealTimeSummary`
  - `/Notice/GetEvents`
  - `/Notice/GetList`
  - `/Notice/ConsumeNotice`
- Important functions:
  - `showClientOptionsModal`
  - `showDatabaseModal`
  - `showGlobalSearchModal`
  - `showClientStatsModal`
  - `showClientNoticeModal`
  - `loadClientNoticeBadge`
  - `toggleClientPause`
  - `handleToolModalBodyClick`
- `openToolModal(config)` supports `size: "wide" | "large" | "xl"`.
- `统计后台` opens `/abnormal` on the current API host, e.g. `http://192.168.9.83:18080/abnormal`.
- `挂起` is currently local Web auto-refresh pause only. No server-side suspend endpoint was found in `YouChatService.xml`.
- `数据库管理` now matches the native delete-chat-records dialog:
  - `showDatabaseModal()` renders a `删除聊天记录` tab, date range, and confirm text field.
  - Required confirm text: `我已知晓删除的聊天记录无法恢复`.
  - Submit calls `POST /ChatContent/Delete` with `startTime` and `endTime`.
  - Do not rewire this menu back to `/System/GetConnectionString` or `/System/SetConnectionString` unless the user explicitly asks for database connection editing.
- `public/styles.css` adds native icon mappings:
  - `client-icon-dashboard`
  - `client-icon-chat-record`
  - `client-icon-chart`
  - `client-icon-notice`
  - `client-icon-database`
  - `client-icon-pause`
  - `client-icon-logout`
- Do not merge native client settings with Web AI settings. The native options modal may show server `aiOptions`, but those are service-side options and must not overwrite `localStorage` AI relay settings.
- If local `/api` proxy probes show transient `fetch failed`, verify the same route directly against `http://192.168.9.83:18080/api/...` before assuming the native API is broken. During this pass direct upstream probes worked for System, Summary, Notice, and SearchList, while a few proxy probes were intermittent.

2026-06-09 image send hang fix:

- User reported image sending stayed at `发送中` and never completed.
- Real capture showed `GetOssConfig` returned Qiniu config (`qnDomain`, `qnRegionUrl`, `qnToken`) but the failed flow did not reach `SendMsg contentType=1`.
- Important functions:
  - `sendText`
  - `sendImageFile`
  - `uploadChatImage`
  - `uploadImageViaLocalProxy`
  - `buildOssObjectKey`
  - `createOssUploadFileName`
  - server `handleOssUpload`
  - server `summarizeUploadConfig`
- Current strategy:
  - Generate a unique 32-hex image filename before `GetOssConfig`.
  - Use `/local/oss-upload` first for Qiniu upload.
  - Browser direct upload is only fallback and times out after 15s.
  - API proxy, OSS proxy, and AI proxy all have hard timeouts.
  - `sendText()` uploads all draft images before submitting text, then submits text and image messages. This avoids repeated text messages when image upload fails.
  - If text was submitted but later image message submission fails, clear the text box, remove already submitted image drafts, and keep only unsent image drafts for retry.
- Never use the clipboard filename `image.png` as the OSS key. Use the unique filename or an explicit server-provided key.
- `/local/oss-upload` capture logs must not include full Qiniu tokens. Use `summarizeUploadConfig()`.
- `tools/export-devkit-patch.ps1` excludes runtime `data/`, `logs/`, `reports/`, `node_modules/`, and `.youchat-patch-backups/`. Keep it that way so portable patches do not overwrite learned skills or ship captures.
- Verified with a no-customer-send smoke test:
  - `GetOssConfig` 200.
  - `/local/oss-upload` uploaded a 1x1 PNG to Qiniu and returned a unique `https://qiniu.yunsert.com/<hex>.png`.
  - Did not call `/ChatContent/SendMsg` during the smoke test.
- Validation commands run:
  - `npm run check`
  - `npm run fnos:health`

## Non-Negotiables

- Do not fake searchable user IDs.
- Do not fake order records.
- Do not convert internal system notices into customer messages.
- Do not overwrite unrelated user changes.
- Use `apply_patch` for manual edits.
- Update this file and `PROJECT_MEMORY.md` after meaningful work.

## 2026-06-11 UI Follow-up

- Latest user-facing frontend fix in `C:\youchat-dev-web` focused on:
  1. right toolbar dynamic sizing
  2. native-style emoji rendering

### Files changed

- `C:\youchat-dev-web\public\app.js`
- `C:\youchat-dev-web\public\styles.css`

### Right toolbar sizing rule

- `toolContent` now uses mode classes:
  - `is-history-tool`
  - `is-compact-tool`
  - `is-skill-tool`
  - `is-quick-tool`
- Class toggling happens in:
  - `setToolTab(tab)`
  - `renderToolContent()`
- Intended behavior:
  - `history` tab fills the full right column and owns the deep scroll area
  - `skill` uses internal scroll inside `.skill-panel-scroll`
  - `quick` uses internal scroll inside `.quick-list`
  - `user`, `order`, and `detail` stay compact
- Do not revert `.tool-content` back to a universal full-height scrolling box. That was the direct cause of the “large blank area” complaint.
- Do not push `quick` back into `is-compact-tool`. That was the reason the right-side quick-reply area could lose a usable scrollbar even though category chips and list markup were still rendered.

### Emoji implementation rule

- Emoji are no longer plain text buttons.
- `public/app.js` now contains:
  - `EMOJI_DEFS`
  - `EMOJI_LOOKUP`
  - `EMOJI_TOKEN_PATTERN`
  - `renderEmojiGlyph()`
  - `renderInlineTextWithEmojiAndLinks()`
- `renderEmojiPopover()` now renders icon + label buttons from `EMOJI_DEFS`.
- `linkifyMessageText()` now routes through `renderInlineTextWithEmojiAndLinks()` so text messages can render both:
  - clickable URLs
  - inline emoji sprites from tokens like `[微笑]`, `[红包]`, `[强]`

### Emoji data source

- Do not guess sprite mapping.
- Current mapping was extracted from native client resources:
  - `C:\Program Files\youchat-desktop\wwwroot\p__chatHistory__index.1b36184c.async.js`
  - `C:\Program Files\youchat-desktop\wwwroot\p__chatHistory__index.6848817b.chunk.css`
- Those native files expose:
  - token text like `[微笑]`
  - sprite class like `smiley_0`, `e2_05`, `u1F604`
  - original background-position
- Web client stores converted positions directly in `EMOJI_DEFS` using the current 18px sprite scale.

### Current emoji coverage

- High-frequency emoji are covered first.
- Current mapped set includes:
  - basic chat emoji such as `[微笑]`, `[撇嘴]`, `[流泪]`, `[呲牙]`, `[疑问]`, `[再见]`, `[OK]`
  - extended/common support emoji such as `[红包]`, `[捂脸]`, `[奸笑]`, `[机智]`, `[皱眉]`, `[笑脸]`, `[生病]`, `[庆祝]`, `[礼物]`, `[吃瓜]`, `[旺柴]`, `[好的]`, `[打脸]`
- Some native token ids exist in JS but have no matching CSS sprite position in the inspected chunk files. Do not invent positions for those. If the user asks for more emoji, continue extracting from native bundles first.

### Verification already done

- `npm run check` passed after the change.
- Local dev service on `http://localhost:5177` was restarted after edits.

### If user reports this area is still wrong

- For right toolbar spacing:
  - inspect `.tool-content`
  - inspect `.tool-content.is-quick-tool`
  - inspect `.quick-section`
  - inspect `.quick-list`
  - inspect `.history-section`
  - inspect `.history-chat-list`
  - inspect `.tool-content.is-skill-tool`
  - inspect `.skill-panel-scroll`
  - confirm `is-history-tool` / `is-skill-tool` / `is-quick-tool` / `is-compact-tool` are being toggled correctly
- For emoji:
  - inspect `EMOJI_DEFS`
  - inspect `renderEmojiPopover()`
  - inspect `linkifyMessageText()`
  - inspect `.client-emoji-icon`, `.emoji-popover`, `.message-emoji-icon`

## 2026-06-11 Skill Panel + Platform Classification Follow-up

- Latest user request after the toolbar/emoji pass:
  1. right-side `skill 回复` panel lost usable scroll
  2. `skill` needed real platform-aware and intent-aware grouping, especially from order/platform cues
  3. manual reply learning had to include “adopted then edited before send” flows

### Files changed

- `C:\youchat-dev-web\public\app.js`
- `C:\youchat-dev-web\public\styles.css`
- `C:\youchat-dev-web\server.js`

### Right-side skill panel layout rule

- `toolContent` now has a third mode:
  - `is-history-tool`
  - `is-compact-tool`
  - `is-skill-tool`
- `skill` is no longer routed through the compact tool mode.
- Layout behavior:
  - `history`: full-height deep scroll
  - `skill`: full-height internal scroll inside `.skill-panel-scroll`
  - others: compact content height
- If scroll breaks again, inspect:
  - `.tool-content.is-skill-tool`
  - `.skill-section`
  - `.skill-panel-scroll`

### Skill categorization now active

- `state.skillCategory` is now real UI state, not dead state.
- Right toolbar now renders category chips for:
  - `当前匹配`
  - `全部`
  - platform groups such as `淘宝/天猫`, `京东`, `拼多多`, `唯品会`, `美团`, `饿了么`, `抖音`, `快手`
  - intent groups such as `订单查不到`, `下单后没提示`, `绑定失败`, `提现相关`, `返利状态`, `转人工`, `通用`
  - `其他`
- `filterReplySkills()` now returns grouped data, not a flat array.
- `renderSkillReplyPanel()` now renders:
  - category chips
  - category summary
  - grouped skill sections with headers

### Platform / intent inference

- `public/app.js` added:
  - `ORDER_TYPE_PLATFORM_KEYS`
  - `SKILL_PLATFORM_LOOKUP`
  - `SKILL_INTENT_LOOKUP`
  - `normalizeOrderNo()`
  - `collectSkillContextMeta()`
  - `detectPlatformOrderNo()`
  - `detectOrderPlatformFromState()`
  - `detectSkillIntentKey()`
  - `resolveSkillPlatformKey()`
  - `resolveSkillIntentKey()`
- `normalizeOrder()` now stores `platformKey` per order record.
- `scoreReplySkill()` now scores by:
  - keyword hits
  - sample hits
  - platform consistency
  - intent consistency
  - order number match
  - manual override weight

### Learning behavior changed

- Old bad rule:
  - `learnFromManualReply()` used to return early when `state.lastSuggestionUsed` was true.
  - This blocked learning for the exact case the user cares about: “采用后我又改了一下才发”.
- New rule:
  - skip learning only when the final reply is effectively identical to the adopted suggestion
  - learn when the operator edits text, swaps wording, trims sensitive content, or keeps images but rewrites text
- Added:
  - `lastAppliedSuggestionFingerprint`
  - `lastAppliedSuggestionSkillId`
  - `buildSuggestionFingerprint()`
  - `isCurrentReplyEffectivelySameAsAppliedSuggestion()`
  - `resolveManualReplySkillTarget()`

### Important behavior detail

- Manual sends now prefer to learn back into the adopted skill when a suggestion was used and then edited.
- Without this, learned data would fork into noisy unrelated `learned-*` entries.
- `findLearnedSkillForPrompt()` now constrains matches by inferred platform/intent before keyword fallback.

### Persistence rule

- `server.js / normalizeLearnedSkill()` now preserves:
  - `platformKey`
  - `platformKeys`
  - `intentKey`
  - `intentKeys`
- If these fields disappear after reload, inspect that function first.

### Built-in defaults

- Built-in default skills now include baseline `intentKey` values:
  - `order-redpacket-not-bound -> order_missing`
  - `alipay-bind-failed -> bind_failed`
  - `withdraw-success-no-reply -> withdraw_query`
  - `system-conversation-event -> general`

### Verification

- `npm run check` passed after the change.

### Do not regress

- Do not push `skill` back into `is-compact-tool`.
- Do not revert learning logic to “if suggestion was adopted, skip learning entirely”.
- If future work expands platforms, update all of:
  - `SKILL_PLATFORM_DEFS`
  - `ORDER_TYPE_PLATFORM_KEYS`
  - built-in default skills

## 2026-06-11 CodeBuddy Integration Verified

- User provided a real CodeBuddy API key and asked whether the current integration actually works.
- It did not work with the prior defaults.

### Real findings

- Old preset was wrong:
  - `baseUrl = https://api.codebuddy.ai`
  - `model = codebuddy`
- Direct tests showed:
  - `https://api.codebuddy.ai/v1/chat/completions` -> `404 Route Not Found`
  - so the old preset was not a valid production endpoint for this user

### Working endpoint and model

- The real reachable target for this key is:
  - `https://copilot.tencent.com/v2/chat/completions`
- Working auth:
  - `X-Api-Key`
- Important behavior:
  - non-stream requests return `Non-stream chat request is currently not supported`
  - `model = codebuddy` returns `model [codebuddy] service info not found`
  - tested good model:
    - `deepseek-v3.1`
  - also observed as reachable in model probing:
    - `deepseek-r1`

### Code changes

- `public/app.js`
  - `AI_PRESETS.codebuddy` now defaults to:
    - `baseUrl: "https://copilot.tencent.com/v2"`
    - `model: "deepseek-v3.1"`
    - `authType: "x-api-key"`

- `server.js`
  - `getAiChatCompletionsUrl()` now understands `copilot.tencent.com` and normalizes:
    - `/v2` -> `/v2/chat/completions`
  - Added:
    - `isCodeBuddyTarget()`
    - `convertCodeBuddyStreamToJson()`
  - `proxyAi()` now:
    - forces `stream = true` for CodeBuddy/Tencent Copilot targets
    - converts SSE stream output into ordinary JSON with:
      - `choices[0].message.content`
    - this lets existing frontend reply extraction continue unchanged

### Real verification

- Local proxy test against:
  - `http://localhost:5177/ai/chat/completions`
  - with user key
  - `baseUrl = https://copilot.tencent.com/v2`
  - `model = deepseek-v3.1`
  - `authType = x-api-key`
- returned `200 OK`
- returned assistant message content:
  - `OK`

### Do not regress

- Do not switch CodeBuddy preset back to `api.codebuddy.ai` unless later verified.
- Do not default CodeBuddy model to `codebuddy`; current test says that model id is invalid.
- Keep the stream-to-JSON conversion unless the frontend is later upgraded to consume SSE natively.

## 2026-06-11 AI Provider Split

Latest AI settings work changed the storage model from one shared config to per-provider config.

New files and endpoints:

- `config/ai-providers.json`: committed default provider config
- `GET /ai/providers`: returns default provider and committed provider presets
- `POST /ai/models`: fetches model list for current provider, falls back to verified local model list when upstream models route is unavailable

Frontend storage now uses:

- `youchat.ai.provider`
- `youchat.ai.providers`

Behavior:

- `sub2`, `deepseek`, and `codebuddy` now keep separate `baseUrl`, `apiKey`, `model`, `authType`, `temperature`
- opening AI settings snapshots current runtime state
- closing settings without save restores the snapshot, so browsing another provider does not silently switch the live AI source
- old shared keys (`youchat.ai.baseUrl`, `apiKey`, `model`, `authType`, `temperature`) are migrated once into the `sub2` bucket

Known provider notes:

- CodeBuddy defaults are now committed in both frontend preset state and `config/ai-providers.json`
- verified CodeBuddy base remains `https://copilot.tencent.com/v2`
- verified auth is `X-Api-Key`
- verified working model remains `deepseek-v3.1`
- `https://copilot.tencent.com/v2/models` currently returns `404 Route Not Found`, so `/ai/models` should fall back to local verified models for CodeBuddy

Verification done:

- `npm run check` passed after the split
- if `http://localhost:5177` does not show the new provider dropdown / fetch-models button, restart the existing `node server.js` process because an older already-running server instance may still be serving the previous bundle

## 2026-06-11 CodeBuddy Probe + Skill Send Learning

Latest follow-up work added three concrete behaviors:

1. CodeBuddy model loading now probes real models instead of only falling back after `/models` 404
2. sending a reply from the `skill` panel now learns from that sent result
3. AI recommendations now combine matched skill + FAQ + learned manual patterns + AI output

### Server

File:

- `server.js`

Added:

- `probeCodeBuddyModels({ apiKey, authType, baseUrl, providerId })`

Behavior:

- takes CodeBuddy fallback candidates from `config/ai-providers.json`
- probes each candidate against:
  - `https://copilot.tencent.com/v2/chat/completions`
- uses:
  - `stream: true`
  - tiny prompt `ping`
- marks models valid when upstream returns `200` and SSE payload starts with `data: {`

`handleAiModels()` now:

- routes `providerId === "codebuddy"` or CodeBuddy hostname directly into the probe path
- returns:
  - `source: "probe"` when at least one model is verified
  - `target: https://copilot.tencent.com/v2/chat/completions`

Verified result on local new-port run:

- `POST http://127.0.0.1:5180/ai/models`
- response:
  - `models = ["deepseek-v3.1", "deepseek-r1"]`
  - `source = "probe"`

### Frontend

File:

- `public/app.js`

Added send-time skill rewrite / learning:

- `getSuggestionStepsForSend()`
- `rewriteSkillSendText()`
- `pickSkillVariant()`
- `applySkillToneVariant()`
- `learnFromSentSuggestion()`

Current rewrite rules:

- `返利` -> one of `反L / 饭力 / 返点 / 回馈`
- `返佣` -> one of `反Y / 返点 / 回馈`
- `红包` -> one of `红宝 / 鸿包 / 红补 / 优惠包`

`sendSuggestionSteps()` now:

- rewrites `skill` text steps before send
- records:
  - `lastAppliedSuggestionFingerprint`
  - `lastAppliedSuggestionSkillId`
- calls `learnFromSentSuggestion()` after successful send

Learning behavior:

- if sent suggestion has `skillId`, it learns into that matched skill via `learnMatchedSkillOverride()`
- otherwise it falls back into `learnFromManualReply()`

Added AI merge behavior at file end as function overrides:

- `getLearnedSkillPromptContext()`
- `buildAiConversationContextWithReferences()`
- `mergeAiSuggestions()`
- overridden `requestAiRelaySuggestions()`
- overridden `generateAutoAiSuggestion()`

New AI behavior:

- no longer exits early on first `skill` hit
- AI prompt now includes:
  - matched skill
  - FAQ prompt context
  - learned manual reply patterns
- merged candidates are:
  - matched skill first
  - top 2 FAQ items
  - AI replies
  - deduped to top 3

### Verification

- `npm run check` passed after this work
- `http://127.0.0.1:5180/` served normally in local verification

### Important current nuance

- old process on `5177` may still serve older code
- new local verification port used in this round:
  - `5180`
- if user reports “CodeBuddy still only shows fallback-upstream 404 behavior”, confirm they are not hitting an old dev process

## 2026-06-11 Skill Panel Layout + Learned Override Priority

Files changed:

- `public/app.js`
- `public/styles.css`

### Why this follow-up happened

User reported the right-side `skill 回复` panel was still:

- visually cramped
- hard to scan
- scrollbar felt missing
- learning felt dumb because manually corrected wording was not clearly winning in the panel

### Layout rule now

Do not reuse quick-reply row layout for skills anymore.

`skill` rows now use their own structure:

- `skill-row-aside`
- `skill-row-main`
- `skill-row-head`
- `skill-row-actions`
- `skill-row-preview`
- `skill-row-foot`

This means:

- sequence + copy stay narrow on the left
- title + chips + actions are separated from body text
- learned notes and keyword hints live in a footer area
- image strip is its own row instead of competing with action buttons

### Scroll rule now

Right toolbar skill scroll affordance is intentionally stronger:

- `skill-panel-scroll` now uses explicit track/thumb colors
- webkit scrollbar width increased to `12px`
- thumb is brighter blue and track is visible

If user says “there is still no scrollbar”, first confirm they are actually inside the `skill` tool and the list has enough content to overflow.

### Learned override priority changed

New helper flow in `public/app.js`:

- `getSkillOverrideCount()`
- `buildSkillOverrideSteps()`
- `scoreSkillOverride()`
- `getPreferredSkillOverride()`
- `getSkillReplyProfile()`

Behavior:

1. matched manual overrides are now scored against current context
2. best learned override can win over stale fallback text
3. same learned version is used by:
   - matched skill suggestion card
   - right-panel skill card preview
   - `采用`
   - `发送`
   - `优化` seed text

This is the important behavior change. Do not regress it by going back to raw `getSkillSteps(skill)` in panel actions.

### Matching changed too

`scoreReplySkill()` now gives score credit when a skill has a strong matching manual override.

So learning is no longer only cosmetic. It now affects rank order.

### Learned-skill lookup changed

`findLearnedSkillForPrompt()` now scores candidates rather than returning first keyword hit.

It now considers:

- platform match
- intent match
- keyword overlap
- override prompt history
- override count

### UI indicators now exposed

Skill cards can now show:

- `学习版`
- `已纠正 N 次`
- `最近学习：...`
- `带 N 图`
- `命中 N 次`
- `修订 N 次`

This is intentional. The user wanted to see whether learning was actually helping.

### Verification

- `npm run check` passed
- browser DOM check confirmed the new page shell serves with the updated bundle, although full screenshot capture from the in-app browser timed out during this pass

### Do not regress

If you later touch the right toolbar skill panel:

1. do not reintroduce `quick-row skill-row`
2. keep learned override selection centralized in `getSkillReplyProfile()`
3. panel actions must use context-aware learned text, not raw fallback text

## 2026-06-11 Skill Panel Height Compression Follow-up

User reported the previous skill-panel cleanup still looked cramped:

- top category area stacked too tall
- list felt folded/collapsed
- scrollbar still did not feel obvious

### Files changed

- `public/app.js`
- `public/styles.css`

### New rule for category tabs

Do not render the full category set as one wrapping multi-line chip cloud.

Current structure:

- pinned row:
  - `当前匹配`
  - `全部`
- horizontal rail:
  - remaining platform and intent categories

Implementation helper:

- `splitSkillCategoryTabs()`

### Why this matters

The old fully wrapped chip layout was consuming too much fixed vertical space in the right rail.
That made the list below look visually collapsed even when the scroll container technically existed.

### Unmatched-state rule

When there is no current skill match, do not use the full `skill-match-card` block.

Use the compact inline hint instead:

- `.skill-inline-hint`

This gives more height back to the actual list.

### Density tuning

The follow-up also tightened:

- skill group header padding
- row padding
- row internal gaps
- action gap
- tag margin
- image-strip top margin

And increased preview clamp from 3 lines to 4 lines so rows feel less abruptly cut off.

### Scrollbar detail

The skill list scrollbar style must remain the explicit blue version on `.skill-panel-scroll`.
Do not let the generic `.quick-list, .skill-panel-scroll` block be the last word on `scrollbar-width` / `scrollbar-color`.

### Regression check

If user still reports the same old stacked category cloud after these changes, first suspect an old running dev process or stale served bundle before changing layout code again.

## 2026-06-11 Skill Scroll Direction Correction

Important correction from user:

The user does **not** want a horizontal scrollbar for skill categories.

They want:

- one vertical scrollbar for the whole right-side skill panel
- category chips, match hint/card, and skill groups all living inside that vertical flow

So the temporary horizontal category-rail experiment was reverted.

### What was removed

- `splitSkillCategoryTabs()`
- `.skill-tabs-pinned`
- `.skill-tabs-rail`

### Current rule

Use:

- wrapped category chips at the top
- one shared `.skill-panel-scroll` around:
  - category chips
  - match hint/card
  - skill groups

Do not reintroduce a horizontal category track unless the user explicitly asks for it.

## 2026-06-12 Settings UI + Skill Learning Guardrails

### Scope

Files changed in this pass:

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`

Do not commit runtime data changes from:

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

### Client settings modal

The old `client-options` modal was a raw field dump.
It is now intentionally remapped to a native-like compact settings sheet.

Important behavior:

- still reads real `/System/GetOptions`
- still writes real `/System/SetOptions`
- modal size is now `settings`
- modal panel class support added:
  - `tool-modal-settings`

Key UI mapping:

- `commonOptions.switchType`
  - `显示昵称`
  - `显示备注`
  - `备注（昵称）`
- `commonOptions.audioNotice`
  - `系统提示音`
- `commonOptions.alertSysNotice`
  - `系统消息弹窗`
- `jobOptions.runTimeoutCheckJob`
  - `开启任务`
- `jobOptions.autoInviteScore`
  - `是否开启自动邀评`
- `jobOptions.autoLeaveMsg`
  - `是否开启留言分发`
- `jobOptions.autoShutDown`
  - `自动关闭会话`
- `jobOptions.closeTime`
  - `自动关闭时间(分钟)`
- `jobOptions.timeout`
  - `回复超时判定时间(分钟)`
- `jobOptions.getMsgByDate`
  - `获取多少小时前的聊天记录`

Database type mapping:

- `0` => `自定义数据库`
- `2` => `跟随服务端`

Raw fields are still available inside:

- `高级配置`
- `服务端 AI 与数据库`
- `原始配置 JSON`

### Skill learning guardrails

This pass fixes the main corruption pattern:

- learned overrides no longer auto-rewrite base `replySteps`
- learned overrides no longer auto-rewrite base `fallback`
- override activation is more conservative
- explicit optimize/update can now replace images instead of permanently unioning old + new images

Relevant functions:

- `getPreferredSkillOverride()`
- `getSkillReplyProfile()`
- `learnMatchedSkillOverride()`
- `mergeTextWithExistingSkillImages()`
- `normalizeSkillReplySteps()`
- `updateSkillFromSuggestion()`

Current rules:

1. learned override is used only when confidence is stronger
2. base skill content remains the stable source of truth
3. learned images can be replaced on explicit optimize/update

### Recovery actions added

Per skill row:

- `恢复`

Behavior:

- clears `manualOverrides`
- keeps base skill content

Function:

- `resetSkillLearningById(id)`

Top toolbar action:

- `清理学习`

Behavior:

- removes obviously noisy manual overrides

Functions:

- `trimSkillLearningNoise()`
- `isSkillOverrideNoisy()`

Current noisy override heuristics:

- image override with almost no text
- very long reply text
- long link-heavy pasted garbage

### Skill panel UI details

Added:

- `skill-head-actions`
- `skill-learning-state`

The skill panel still must use one vertical scroll container:

- `.skill-panel-scroll`

Do not reintroduce a horizontal category scroll track.

### Verification state

- `npm run check` passed
- local server was restarted on `http://localhost:5177`

### If user still reports old behavior

Check in this order:

1. is current process really `node server.js` from `C:\youchat-dev-web`
2. was port `5177` restarted after code changes
3. did runtime `reply-skills.json` already contain old polluted learned data

If the issue is old polluted data, use:

- per-row `恢复`
- top-level `清理学习`

## 2026-06-12 Skill Right Pane Scroll Finalization + Composer Structure Commit

### Scope

This pass intentionally bundled three related frontend surfaces:

1. right-side `skill` pane scroll/layout stabilization
2. small native-style polish for client settings menu + system settings modal sizing
3. commit of the already-coupled composer structure changes (`contenteditable` + inline image blocks + top-level emoji popover)

Relevant files:

- `public/index.html`
- `public/app.js`
- `public/styles.css`

Runtime files still excluded from commit:

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

### Skill pane scroll rule

Root cause was not “missing scrollbar CSS”.

The old layout had competing height models:

- `.tool-content` using `height: calc(100% - 42px)`
- `.skill-panel-scroll` also trying to fill height
- `.skill-group` still flex-shrinkable

This created:

- unstable vertical space
- hidden or awkward scrollbar behavior
- compressed group cards / folded-looking rows

Current rule:

- `.tool-content` is now `flex: 1 1 auto`
- `.skill-panel-scroll` is the single vertical scroll container
- `.skill-group` is `flex: 0 0 auto`
- long row content uses `min-width: 0` in the key flex/grid nodes

Do not reintroduce:

- `calc(100% - xx)` height hacks for the right pane
- horizontal scrolling category strips
- nested competing vertical scroll containers for skill content

### Settings polish

This pass slightly tightened the native-feel controls:

- `client-settings-menu`
  - wider, softer shadow, denser row typography
- `tool-modal-settings`
  - smaller and tighter
- `client-settings-*`
  - reduced heading sizes and spacing so the modal feels closer to the desktop client

This is a visual polish pass, not a schema or endpoint change.

### Composer structure state

The repo had a previously uncommitted but already-dependent structure change:

- `replyText` changed from `<textarea>` to contenteditable `<div class="reply-text">`
- `emojiPopover` moved to top-level
- inline draft images render inside the composer content itself

`public/app.js` already contains the paired logic:

- `parseComposerBlocks()`
- `insertInlineImagesAtCursor()`
- `syncInlineDraftImages()`
- contenteditable-aware `insertTextAtCursor()`

Because CSS/JS already depended on this DOM, this pass keeps them together to avoid a half-old / half-new state.

### Skill learning behavior update

One more learning cleanup was added inside:

- `learnMatchedSkillOverride()`

New behavior:

- when the same normalized prompt gets a newer manual reply variant
- older overrides for that same prompt are removed before inserting the newest one

This keeps matched skill learning closer to the operator’s latest real wording instead of only accumulating stale variants.

### Verification

- `npm run check` passed
- `/health` still returns `ok: true`

### Commit hygiene

If future work touches this area, keep commit boundaries explicit:

- UI structure / composer DOM
- right-pane scroll model
- runtime learned skill data

Only the first two belong in git by default.

## 2026-06-12 Current Conversation Sync Bug (Data Exists, Web Shows Empty)

### Symptom

User reported the web app “again cannot get data / not synced”.

Immediate verification showed backend was actually healthy:

- `/health` OK on `5177`
- `/System/GetOptions` OK on `192.168.9.83:18080/api`
- `Contact/GetContactList` capture still returned real data
  - current list: `total = 5`
  - history list: `total = 21`

So this was not a backend outage.

### Root cause

Relevant function:

- `fetchContactListWithFallback()`

Old current-list logic:

1. try candidate `accountId`s
2. if one candidate returned an explicitly empty result, return it immediately

That meant:

- one stale / wrong remembered `accountId` could short-circuit the whole flow
- later valid candidates were never tried
- global fallback result was never allowed to rescue the list

### Fix

Current behavior:

1. fetch a global compatible result first (`omitAccountId: true`) as fallback reference
2. iterate candidate `accountId`s
3. return immediately only for `isUsefulContactListResult(result)`
4. keep empty candidate results as evidence, but do not short-circuit on them
5. if no useful account candidate wins, fall back to global result

Important change:

- account candidates no longer immediately return on explicit-empty / zero-data
- final fallback source is now marked `global-fallback`

### Debug checklist for future

If user says current conversations disappeared again:

1. verify `Contact/GetContactList` capture still contains real records
2. inspect `fetchContactListWithFallback()`
3. inspect local storage candidates:
   - `youchat.accountId`
   - `youchat.contactListAccountIds`

This bug class is specifically “frontend fallback state drift”, not “backend unavailable”.

### Verification

- `npm run check` passed after patch

## 2026-06-12 Left Conversation List Truncation / Dynamic Load Fix

### User symptom

User reported the left conversation list still looked truncated and did not dynamically continue loading, especially in the `历史` tab.

### Verified backend status

This was not a backend data shortage.

Direct real API probe against FnOS:

- `POST /Contact/GetContactList`
- history request shape:
  - `pageIndex=1`
  - `pageSize=80`
  - `id=0`
  - `isGuestbook=false`
  - `isHistory=true`

Verified result on 2026-06-12:

- `total=5739`
- first page count `= 80`

Second-page probe returned a different id set, confirming server pagination works.

### Root cause

Two frontend issues stacked together:

1. `loadContacts()` set `state.contactListLoading = true` but did not reliably reset it after success/failure.
   - This blocked `handleContactListScroll()` auto-append because the guard always thought a load was still running.
2. `CONTACT_LIST_PAGE_SIZE` had drifted down to `20`.
   - Native request capture for the left list uses `pageSize=80`, so the smaller size made the truncation feel much worse.

### Fix applied

In `public/app.js`:

1. Restored:
   - `CONTACT_LIST_PAGE_SIZE = 80`
2. Added:
   - `finally { state.contactListLoading = false; }`
   - directly inside `loadContacts()`
3. Added:
   - `scheduleContactListViewportFill()`
   - after non-append loads, if the contact list still does not fill the viewport and `hasMore=true`, it auto-loads the next page(s)

### Why this matters

This fixes two distinct failure modes:

- scroll-triggered loading being permanently blocked
- history/current lists looking visually cut off even before the user scrolls

### Verification

- `npm run check` passed
- `http://localhost:5177/health` returned `ok: true`
- direct API re-check confirmed history page 1 now matches native batch sizing expectations:
  - `pageSize=80`
  - `count=80`
  - `total=5739`

### Git hygiene reminder

Do not commit runtime files while touching this area:

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

## 2026-06-12 Right Tool Pane, Skill Learning, Scroll, and Red-Dot Fix

### User symptom

User reported:

- right tool panels looked too narrow / not dynamically fitting the pane
- `skill回复` was split into a top match card and a lower current-match list
- skill auto-learning polluted order skills with later unrelated replies or accidental images
- right skill/history scroll could jump back to the top after refresh
- selecting a conversation sometimes landed in the middle of chat instead of the bottom
- red-dot unread behavior did not match the native client

### Files changed

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

### Key app.js changes

Right pane scroll preservation:

- `getToolScrollSelector()`
- `captureToolScrollSnapshot()`
- `restoreToolScrollSnapshot()`
- `renderToolContent()` now captures and restores internal scroll only for the same active tool tab and same contact.

Skill match UI:

- `renderSkillReplyPanel()` no longer renders the full `renderSkillMatchCard()` above the list.
- New `renderSkillMatchHint()` renders a compact status strip.
- Real actions stay on `renderSkillRow()`: apply, send, optimize, reset learning.

Skill learning guard:

- New state:
  - `lastAppliedSuggestionPromptKey`
  - `lastAppliedSuggestionContactId`
  - `lastAppliedSuggestionAt`
  - `lastAppliedSuggestionPlatformKey`
  - `lastAppliedSuggestionIntentKey`
- New helpers:
  - `rememberAppliedSuggestionContext()`
  - `clearAppliedSuggestionContext()`
  - `isAppliedSuggestionContextValid()`
  - `canLearnAsMatchedSkill()`
- `resolveManualReplySkillTarget(latest)` now validates context before returning the previously applied skill.
- `resetContactScopedState()` clears applied-suggestion context on contact switch.
- `learnMatchedSkillOverride()` keeps multiple variants for the same prompt instead of deleting old prompt variants.
- `getSkillReplyProfile()` only lets a learned override replace baseline wording when that exact variant has `count >= 3` or `forceLearned` is used.

Conversation bottom behavior:

- `selectContactById()` now opens normal conversation clicks at the latest/bottom position.
- It no longer jumps to the first unread red-point anchor during ordinary contact selection.
- Re-clicking the active `当前` tab still jumps to the red-point anchor if one is rendered.
- `renderMessages("bottom")` now calls `scrollElementToBottom(..., { force: true, watchImages: true })`.

Red-dot syncing:

- `syncConsumedMessages()` now consumes actual red-point message ids from `getConsumableMessageIds(contact)` first, then still calls `msgId=0` as fallback.
- Single message-id consume failures do not block the `msgId=0` fallback.
- New `clearLocalMessageRedPoints(contactId)` clears local red-point flags in `state.messages`, `activeContact.records`, and `contacts.records` after sync.

### Key styles.css changes

- `.tool-pane` has `min-width: 0` and `overflow: hidden`.
- `.tool-tabs` is full-width 6-column grid.
- `.tool-content` and `.tool-section` are full-width with border-box sizing.
- `.skill-panel-scroll` remains vertical-only scrolling.
- `.skill-inline-hint` is a compact strip; `.skill-inline-hint.is-hit` is the highlighted hit state.
- `.skill-row-preview` is tighter and clamped to 3 lines.

### Verification

- `npm run check` passed.
- `http://localhost:5177/health` returned `ok: true`.
- Local service was running on port `5177`.
- Browser check via system Edge after login:
  - right pane width about `382px`
  - tool content width about `381px`
  - six tool tabs about `64px` each
  - tool section width about `357px`
  - skill panel had `overflow-y:auto`, no horizontal overflow
  - `skill-match-card` count was `0` after the UI change

### Git hygiene reminder

Do not commit runtime files:

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Red-Point Filtering And FnOS Containers

### Red-Point Web Fix

Files changed:

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Behavior changed:

- `#redOnly` checkbox now reloads messages from the server with `redOnly`.
- `fetchMessagePage(contact,page,size,{ redOnly })` sends `onlyRepointMsg: true` in red-only mode.
- `renderMessages()` no longer treats every incoming message as red point.
- Red-only empty first page does not fall back to `activeContact.records`, so normal preview messages do not leak into red-only mode.
- Client settings modal now includes a read-only “显示红点” section.

Native/API evidence:

- Original service XML exposes `ChatContent/GetList(... onlyRepointMsg)` and `Account/GetRedPointConfig`.
- `GET /Account/GetRedPointConfig` returns real red-point config fields like `takeBalError`, `queryError`, `orderBindError`, `voice`, `redPack`, `transfer`, `addFriend`, `unknowMsg`.
- `GET /Contact/GetRedPointConfig` returns msgType codes such as `11,1,19,4,0,9,28,26,27`.

Important implementation notes:

- Do not restore the old local filter `message.isRedPoint || message.direction === "incoming"`.
- Keep red-point settings read-only until a real save endpoint is confirmed.
- `/System/GetOptions` does not contain 图5 red-point settings.

### FnOS / Docker State

Host:

- `192.168.9.83`
- SSH user `Boom`
- Working password found: `950331..`

YouChat compose path:

- `/vol1/1000/Docker/youchat`
- Compose files:
  - `docker-compose.yml`
  - `compose.mysql.yaml`
- Project name: `youliaoapp`

Current intended backup path:

- `/vol02/1000-1-713f7ca0/来自：飞牛私有云/youliaobackup`

Do not change this path unless the user asks. On 2026-06-13 the user re-authorized the cloud mount and explicitly said to keep using this source directory.

Issue found:

- `youchat-control` and `youchat-backup` were exited with code 255.
- `docker inspect` error:
  `error while creating mount source path '/vol02/1000-1-713f7ca0/来自：飞牛私有云/youliaobackup': mkdir /vol02/1000-1-713f7ca0/来自：飞牛私有云: operation not permitted`
- Root cause: FnOS cloud-storage authorization/mount temporarily unavailable, not a YouChat app crash.

Resolution already done:

- User re-authorized the cloud mount.
- Ran compose up for the two stopped services using existing config.
- Verified all five YouChat containers are Up:
  - `youchat-autologin`
  - `youchat-control`
  - `youchat-mysql`
  - `youchat-backup`
  - `youchat-service`
- Verified `/api/Contact/GetContactList` returns real data from `http://127.0.0.1:18080`.
- Verified backup source dir exists, is writable, and contains scheduled backup files through `20260613-033003`.

Useful commands:

```bash
cd /vol1/1000/Docker/youchat
echo 950331.. | sudo -S -p "" docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep youchat
echo 950331.. | sudo -S -p "" docker inspect youchat-control youchat-backup --format "{{.Name}} status={{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}"
echo 950331.. | sudo -S -p "" docker compose -p youliaoapp -f docker-compose.yml -f compose.mysql.yaml up -d youchat-control youchat-backup
```

Control API auth:

- Header is `X-Control-Token: <YOUCHAT_CONTROL_TOKEN>`.
- `Authorization: Bearer ...` does not work.

Git reminder:

- Stage only code/docs.
- Do not stage:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Bottom Tab Red Badges And Unread Jump

Files changed:

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Behavior:

- Bottom conversation tabs (`当前` / `留言` / `历史`) now show unread/red badge numbers clearly.
- Clicking a bottom tab with a red badge jumps to the first unread/red-point conversation and then to the first rendered `data-red-point="true"` message.
- Switching to another red-badge tab first loads that tab's contact list, then runs the unread jump.
- If the loaded contact list does not yet contain an unread contact but has more pages, `findUnreadContactInActiveList()` appends up to 6 pages looking for one.

Important functions:

- `getContactUnreadCount(contact)`: canonical unread count reader. It checks `unread`, `unRead`, `redDot`, `unReadCount`, `redPoint`, and `redpoint`.
- `getListUnreadCount(tab)`: tab badge count reader; for active tab it also re-sums currently loaded contacts.
- `jumpToUnreadInActiveList(tab)`: bottom-tab click unread flow.
- `findUnreadContactInActiveList(tab)`: loads more list pages while searching for unread contact.
- `selectContactById(id, { jumpUnread: true })`: special unread-jump path. Normal contact click still opens at bottom and marks read normally.
- `jumpToUnreadInLoadedMessages()`: forces real chat load if current messages are only contact-preview records.
- `messagesFromPreview`: state flag that distinguishes `activeContact.records` preview messages from real `/ChatContent/GetList` records.

Style notes:

- Removed `.conversation-tab.has-unread::after`; do not bring it back because it overlaps the numeric badge.
- `.conversation-tab i` is the single red numeric pill badge, capped at `99+`.
- `.message.is-jump-highlight .message-content` gives the destination message a short red highlight.

Verification:

- `npm run check` passed.

Git reminder:

- Runtime files were still dirty and must not be committed unless explicitly requested:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: SQLite Restore And Image Send Optimization

FnOS service status:

- User saw abnormal message/contact counts after replying.
- `npm run fnos:health` showed the service had switched to SQLite again:
  - `databaseType=2`
  - `totalContacts=497`
  - `historyContacts=24`
- Ran `npm run fnos:restore:mysql`.
- Final `npm run fnos:health` passed:
  - `databaseType=0`
  - `databaseMode=mysql`
  - `totalContacts=8066`
  - `historyContacts=5736`
  - `currentAccount2=6`

Image-send changes:

- Files changed:
  - `public/app.js`
  - `server.js`
  - `PROJECT_MEMORY.md`
  - `AI_HANDOFF.md`
- `LOCAL_IMAGE_UPLOAD_TIMEOUT_MS` is now `12000`.
- `IMAGE_UPLOAD_TIMEOUT_MS` is now `20000`.
- `server.js` `OSS_UPLOAD_TIMEOUT_MS` is now `20000`.
- Added `prepareImageForUpload(file)`:
  - skips GIF/SVG
  - max edge `1600px`
  - JPEG quality `0.86`
  - skips small non-PNG files under about `900KB`
- `sendText()` caches uploaded draft image URLs on `image.uploadUrl`, so a retry after partial failure does not re-upload successful images.
- Removed fixed `180ms` waits between image upload/send steps.
- Added `schedulePostSendMaintenance()`:
  - sends are considered complete after `/ChatContent/SendMsg` succeeds
  - skill learning, message refresh, red-point sync, and contact refresh run in the background
  - message refresh only runs if the active contact is still the same contact
- `sendImageFile()` uses the same background post-send maintenance path.

Operational note:

- Because `server.js` changed, restart the local dev server for the shorter OSS proxy timeout to take effect.
- Browser page refresh is enough for the `public/app.js` changes.

Verification:

- `npm run check` passed.
- `npm run fnos:health` passed after restore.

Git reminder:

- Do not commit runtime files:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Active Header And Contact Type Badges

User issue:

- Active conversation header looked unlike the native client.
- Header showed invalid values such as `null` / empty remark brackets in some cases.
- Active fallback avatar displayed a text character over the blue avatar.
- Left conversation list needed a small user-type badge immediately after the contact name:
  - `个微`
  - `公众号`
  - `企微`

Files changed:

- `public/app.js`
- `public/styles.css`
- `public/index.html`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Important functions:

- `normalizeContact(item, index)` now preserves normalized `robotType` and display-clean `robotName`.
- `getContactRobotType(contact)` reads real API fields:
  - `contact.robotType`
  - `contact.robot.robotType`
  - `deviceTypeValue`
  - `deviceType`
  - `accountType`
  - `contactType`
  - `type`
- `getContactTypeLabel(contact)`:
  - `robotType=6` => `公众号`
  - `robotType=2/9` => `企微`
  - otherwise => `个微`
  - also respects text fields containing `公众号` / `企微`.
- `renderContactTypeBadge(contact)` renders the inline list badge.
- `getContactListDetail(contact)` now avoids showing a second line that is exactly the same as the display name.
- `cleanDisplayText()`, `firstDisplayValue()`, and `isSameDisplayText()` filter UI display only. They do not mutate source API data.
- `renderActive()` now displays:
  - first line: display name + non-duplicate remark
  - second line: `微信号 ...，用户ID ...`
- `renderContactAvatar()` accepts `fallbackText: ""`.
- `handleAvatarImageError()` supports blank avatar fallback instead of forcing `客`.

Style notes:

- `.contact-title-row` keeps name + badge on one line.
- `.contact-type-badge` has distinct restrained styles for personal, public account, and work wechat.
- `.contact-avatar.active-contact-avatar` uses CSS pseudo-elements for the default active avatar icon.
- `.active-contact .active-remark` is forced to `white-space: nowrap`; do not remove this, or long remarks wrap and push the native-like header into three lines.

Verification:

- `npm run check` passed.
- `git diff --check` passed, only CRLF warnings.
- `Invoke-RestMethod http://localhost:5177/health` returned `ok: true`.
- Browser smoke test connected to real API through `http://localhost:5177` and confirmed:
  - active avatar text is empty
  - active title height is one line
  - left contact badges render from real list data

Git reminder:

- Runtime files were dirty and must not be committed:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Native Active Header Structure

User correction:

- The active chat header must match the native Windows client, not the previous Web header.
- Native structure:
  - first line: `昵称（客户备注）`
  - second line: `所属机器人：机器人名称（机器人类型）  备注：机器人备注`
- User also wants the contact type badge after the first-line `昵称（客户备注）`.

Files changed:

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Important functions:

- `getContactRobotName(contact)`: prefer real `contact.robot.robotName`, then other real robot/account name fields.
- `getContactRobotRemark(contact)`: prefer real `contact.robot.robotRemark`.
- `getContactRobotTypeText(contact)`: uses `getContactRobotType(contact)` and `robotTypeName(rawType)`.
- `getActiveRobotMetaText(contact)`: returns the exact header second-line format.
- `renderActive()` now renders:
  - `activeTitle`: `active-name-text` + `active-remark` + `renderContactTypeBadge(contact, "active-type-badge")`
  - `activeMeta`: native robot line from `getActiveRobotMetaText(contact)`

Do not regress:

- Do not put `微信号` / `用户ID` back into the active chat header. Those belong in the right-side user information panel.
- Keep `.active-contact #activeMeta` single-line with ellipsis, or long robot names will push the header taller than native.
- Keep `.active-contact .contact-type-badge` override, because `.active-contact span` is a broad legacy rule and otherwise changes badge sizing.

Verification:

- `npm run check` passed.
- `git diff --check` passed.
- `http://localhost:5177/health` OK.
- Browser connected to real API and selecting `A-文静` produced:
  - title: `A-文静（51-260613-A-文静）个微`
  - meta: `所属机器人：我们的小秘密 ¹°（微信手机版）  备注：小秘密10`

Git reminder:

- Do not commit runtime dirty files:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Skill Training Center

User issue:

- User said skill learning quality is poor.
- They want a separate page that summarizes today's learned replies and lets them approve whether each one should be optimized.
- The goal is to stop bad automatic learning from silently polluting future recommendations.

Files changed:

- `server.js`
- `public/skill-training.html`
- `public/skill-training.css`
- `public/skill-training.js`
- `public/index.html`
- `public/app.js`
- `package.json`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

New UI entry:

- Top-right native client settings menu now has `skill 训练`.
- Handler in `public/app.js` opens `/skill-training.html` in a new tab/window.

New local API:

- `GET /local/skill-training?date=YYYY-MM-DD&scope=today|all`
- `POST /local/skill-training`

Server functions to know:

- `getShanghaiDateKey(value)`: uses `Asia/Shanghai` for "today".
- `buildSkillTrainingItems(data, { date, scope })`: reads `data/reply-skills.json` and builds review cards.
- `summarizeSkillTrainingItems(items, date)`: returns top summary stats and lines.
- `isTrainingDirtyText(text)`: flags obviously bad learned content, such as test numbers, long file hashes, download links, file metadata, `巴嘎`, `454654`.
- `applySkillTrainingPatch(skill, patch, action)`: applies edits from the training page.
- `handleSkillTraining(req, res)`: route handler.

POST actions:

- `approve`: approve as-is or with field edits.
- `optimize`: save edited reply text/keywords/title and mark optimized.
- `needs-review`: mark as `trainingStatus = needs_optimization`.
- `disable`: set `enabled = false`.
- `delete`: remove the skill from `data/reply-skills.json`.
- `clear-overrides`: remove `manualOverrides` and clear `lastManualOverrideAt`.

Training page behavior:

- Shows summary cards:
  - pending total
  - issue count
  - dirty learning count
  - manual override count
  - image count
- Each card shows:
  - source and status chips
  - keywords/samples/latest override
  - current stored reply and images
  - editable title, keywords, reply text, note
  - `可自动回复` and `无需回复` toggles
  - action buttons for approval/optimization/cleanup

Verification:

- Restarted local dev server on the same port `5177` because `server.js` changed.
- `npm run check` now includes `public/skill-training.js` and passed.
- `git diff --check` passed.
- `GET /local/skill-training?scope=today` returned:
  - total `15`
  - issueCount `15`
  - dirtyCount `14`
  - overrideCount `17`
  - imageCount `12`
- Invalid POST with an unknown skill id returns `400` and does not write.
- Browser smoke test opened `/skill-training.html` and rendered the stats and action buttons.

Do not regress:

- Training page must write back to the same `data/reply-skills.json`, not a parallel store.
- Do not auto-apply optimization without user action. This page is an approval layer.
- Do not commit runtime dirty files unless user explicitly asks:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-13 Handoff: Skill Training Queue And Clustered Learning

User correction:

- Skill learning was still too dumb.
- Do not train one skill from every single manual reply.
- Similar customer questions and similar manual replies must be clustered first.
- Initial answers and later customer follow-up answers are different stages and must not overwrite each other.
- AI may help organize candidates, but it must not silently write final skill changes.
- The training page should show one item at a time, then advance after approve/optimize/delete/disable/clear.

Files changed:

- `public/app.js`
- `server.js`
- `public/skill-training.html`
- `public/skill-training.css`
- `public/skill-training.js`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Frontend learning changes in `public/app.js`:

- `getSkillReplyProfile()` no longer uses a manual override merely because `count >= 3`.
- Manual override text can replace the baseline only if:
  - `override.approved === true`
  - `override.trainingStatus === "approved"`
  - `skill.useManualOverrides === true`
  - or caller passes `forceLearned`
- `learnFromManualReply()` now writes unmatched manual replies into a review queue:
  - `learningMode = "review_queue"`
  - `trainingStatus = "needs_optimization"`
  - new learned candidates default `enabled = false`
  - new learned candidates default `allowAutoReply = false`
- `learnMatchedSkillOverride()` now only appends review samples and marks the skill as needing optimization. It no longer auto-raises priority, enables auto-reply, or rewrites formal reply steps after 3 overrides.

New frontend helpers:

- `getLearningStageForMessage(latest)`
- `buildLearningBucketKey(prompt, contextMeta, learningStage)`
- `findLearnedSkillForBucket(prompt, contextMeta, learningStage)`
- `uniqueSkillStrings(values, limit)`
- `mergeManualTrainingOverride(overrides, override)`
- `getManualOverrideTotalCount(overrides)`

Learning bucket fields:

- platform: `taobao`, `jd`, `pdd`, etc.
- intent: `order_missing`, `bind_failed`, `withdraw_query`, etc.
- stage:
  - `first_answer`
  - `customer_followup`
- keyword signature from `extractLearningKeywords(prompt)`

Server training summary changes in `server.js`:

- `normalizeLearnedSkill()` preserves:
  - `learningMode`
  - `learningBucketKey`
  - `learningStage`
  - `trainingStatus`
  - `trainingNote`
  - `reviewedAt`
  - `updatedAt`
- `manualOverrides` retention increased from 12 to 24.
- `buildSkillManualTrainingSummary(skill)` returns clustered:
  - prompt variants
  - reply variants
  - image variants
  - stage labels
- `buildSkillTrainingItems()` now includes:
  - `promptVariants`
  - `replyVariants`
  - `stageLabels`
  - `storedImageUrls`
  - `learningMode`
  - `learningBucketKey`
  - `learningStage`
- `chooseSkillTrainingProposalText()` prefers the strongest manual reply variant only for dirty/needs-review/disabled candidate items.
- `chooseSkillTrainingImages()` exposes manual override images when the base skill has no stored images.
- `applySkillTrainingPatch()` saves `imageUrls` independently and enables candidates on `approved` / `optimized`.

Training page behavior:

- URL remains `http://localhost:5177/skill-training.html`.
- Page renders one `.training-card` at a time, not a list of all cards.
- Header shows `第 X / N 条`.
- Queue rail shows risk state with small dots.
- `上一条` / `下一条` buttons and left/right arrow keys navigate the queue.
- After POST actions, `advanceAfterAction()` moves to the next visible item without jumping the page to top.
- `isCompletedItem()` removes `approved`, `optimized`, `disabled`, and `overrides_cleared` from the default “只看需要处理” queue.

Training page editor:

- Editable fields:
  - title
  - platformKey
  - intentKey
  - keywords
  - samples
  - replyText
  - imageUrls
  - note
  - allowAutoReply
  - noReply
- Local fill actions:
  - current stored text/images
  - latest manual reply
  - latest manual images
  - individual reply variants

AI organize:

- Button: `AI 整理`.
- Uses the same localStorage provider keys as the main workbench:
  - `youchat.ai.provider`
  - `youchat.ai.providers`
- Fallback presets exist in `public/skill-training.js` for sub2, DeepSeek, and CodeBuddy.
- Calls `/ai/chat/completions` and expects JSON fields:
  - `title`
  - `keywords`
  - `samples`
  - `replyText`
  - `note`
  - `allowAutoReply`
  - `noReply`
- AI result only fills the editor. It does not save until the user clicks approve/optimize.

Idle/manual-reply sampling:

- New endpoint: `POST /local/skill-training/sample`.
- Frontend button on `skill-training.html`: `闲时采样`.
- The endpoint uses real YouChat APIs:
  - `/Contact/GetContactList`
  - `/ChatContent/GetList`
- It detects adjacent pairs:
  - incoming customer message: usually `source=0`
  - outgoing manual service reply: usually `source=2`
- It queues pairs through `queueTrainingCandidate(data, sample)`.
- New sampled items are still review-only:
  - `learningMode = "review_queue"`
  - `trainingStatus = "needs_optimization"`
  - new candidates default `enabled = false`
  - new candidates default `allowAutoReply = false`
- UI default samples:
  - `contactLimit = 18`
  - `messageLimit = 80`
- Internal validation can use `dryRun=true`; this runs real API sampling but does not write `data/reply-skills.json`.

Server sampling helpers:

- `postYouChatApi(pathname, payload, apiBase)`
- `getPayloadRecords(payload)`
- `sampleManualRepliesForTraining(data, options)`
- `queueTrainingCandidate(data, sample)`
- `detectTrainingPlatformKey(text)`
- `detectTrainingIntentKey(text)`
- `buildServerLearningBucketKey(prompt, platformKey, intentKey, learningStage)`
- `mergeTrainingOverrideList(overrides, override)`

Verification:

- Restarted `node server.js` on the same port `5177`.
- `npm run check` passed.
- `git diff --check` passed with only CRLF warnings.
- `GET /local/skill-training?scope=today` returned items with `replyVariants` and `promptVariants`.
- `POST /local/skill-training/sample` with `dryRun=true`, `contactLimit=2`, `messageLimit=30` succeeded:
  - `contacts=4`
  - `sampledPairs=2`
  - simulated `created=2`
- Playwright smoke test:
  - rendered exactly one non-skeleton training card
  - queue count was `第 1 / 14 条`
  - `闲时采样` button existed
  - action footer was `position: sticky`
  - no page JS error; favicon 404 only

Do not regress:

- Do not restore the old `count >= 3` automatic override rule.
- Do not make new learned candidates enabled/auto-reply before review.
- Do not remove `learningStage` from duplicate matching, or customer follow-up replies can pollute first-answer skills again.
- Do not commit runtime files:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`

## 2026-06-15 Handoff: Web FnOS Database Repair Button

User issue:

- FnOS YouChat backend switched to SQLite again.
- Web and native client counts collapsed.
- User asked to switch it back and add a Web button to repair it next time.

Immediate backend recovery:

- `npm run fnos:health` initially reported:
  - `databaseType=2`
  - `databaseMode=sqlite`
  - `totalContacts=500`
  - `historyContacts=24`
  - `currentAccount2=8`
- Ran:
  - `npm run fnos:restore:mysql`
  - `npm run fnos:health`
- Recovered to:
  - `databaseType=0`
  - `databaseMode=mysql`
  - `totalContacts=8072`
  - `historyContacts=5688`
  - `currentAccount2=62`

Files changed:

- `server.js`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

New server API:

- `GET /local/fnos/health`
- `POST /local/fnos/restore-mysql`

Server details:

- `FNOS_MYSQL_CONNECTION_STRING` defaults to:
  `Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=w5B22RLPpprsrxdt;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;`
- Can be overridden with env var:
  - `YOUCHAT_MYSQL_CONNECTION_STRING`
- New helpers:
  - `getYouChatDatabaseMode(databaseType)`
  - `getYouChatContactCount(body, apiBase)`
  - `getFnOSDatabaseHealth(options)`
  - `restoreFnOSDatabaseToMySQL(options)`
  - `handleFnOSDatabase(req, res)`

Restore flow:

- Calls real YouChat APIs:
  - `/System/ConnectDatabase`
  - `/System/SetConnectionString`
  - `/System/GetConnectionString`
  - `/System/GetOptions`
- Then re-checks:
  - contact total
  - history total
  - guestbook total
  - `accountId=2` probe

Web UI:

- Entry remains:
  - top-right menu -> `数据库管理`
- `showDatabaseModal()` now calls `loadDatabaseRepairStatus({ silent: true })`.
- Database modal now renders `renderDatabaseRepairPanel()` above the existing delete-chat form.
- Buttons:
  - `刷新状态` -> `loadDatabaseRepairStatus({ silent: false })`
  - `一键切回 MySQL` -> `repairDatabaseFromModal()`
- After repair succeeds:
  - stores `payload.result.after` in `state.databaseRepair.health`
  - calls `loadContactCounts()`
  - calls `loadContacts(1, { keepPosition: true })`

UI state:

- `state.databaseRepair`:
  - `health`
  - `loading`
  - `repairing`
  - `error`

Verification:

- Restarted local `node server.js` on port `5177`.
- `GET /local/fnos/health` first detected SQLite again:
  - `databaseType=2`
  - `historyContacts=24`
- `POST /local/fnos/restore-mysql` succeeded:
  - before: SQLite/history 24
  - after: MySQL/contacts 8072/history 5749
- Final `GET /local/fnos/health` and `npm run fnos:health` passed.
- Playwright smoke test on `showDatabaseModal()`:
  - status pill: `MySQL 正常`
  - grid values: `mysql`, `8,072`, `5,749`, `1`
  - buttons existed: `刷新状态`, `一键切回 MySQL`

Do not regress:

- Keep the existing `删除聊天记录` confirm flow intact.
- Do not move this to fake local state; button must call real FnOS/YouChat APIs.
- If counts collapse again, use Web button or `POST /local/fnos/restore-mysql` before debugging frontend lists.
- Do not commit runtime files:
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`


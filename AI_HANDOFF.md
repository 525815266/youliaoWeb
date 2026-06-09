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

## Contact List Data Gotchas

Business UI must match the Windows client. Do not show debug/source labels such as `本地`, `保留`, `全局回退`, `已清空`, `客服空`, or `接口空` in tabs or list headers.

Current conversation list should start with the Electron-compatible request:

- `POST /Contact/GetContactList`
- `pageIndex = 1`
- `pageSize = 20`
- use `keyWord` for search
- do not default-send `id=0`, `isGuestbook=false`, or `isHistory=false`

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

Behavior rules:

- Tabs: `current`, `guestbook`, `history`.
- Current tab must not clear `state.contacts` or `state.listCounts.current` just because `/Contact/GetContactList` with `accountId` returns bare `data:0`.
- If current data is ambiguous and there is an existing real list, preserve it and log the source internally.
- Preserve active right toolbar tab when switching contacts.
- Selected unread conversation should clear local badge and call consume API.
- Keyboard up/down switches conversations when focus is in list.
- Auto refresh should preserve scroll.
- History tab visible count must use the backend history count only, like the client `历史(5700)`.
- History list contents must also come from the backend history endpoint only. Do not merge Web local clear-list caches into the visible history list.
- Recent real captures showed `isHistory=true&pageSize=1` returning `data:0`; use `pageSize=20` for count probes and keep investigating with real client captures.

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

## Link Cards And Preview Overlay

User requirement:

- Long links should render like the original client's WeChat-style card with real title/thumb and a `详情` action.
- Web enhancement: `详情` opens an in-page floating preview block.
- If real video/player metadata exists, the overlay should preview it.

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
  - `renderActiveLinkPreview`
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
- App deep links are configured in `APP_DEEP_LINK_PROFILES`; examples include `weishi://feed`, `kwai://`, `snssdk1128://`, `xhsdiscover://`.
- Deep links should render as cards, not raw long text. Parse nested encoded params such as `feed_info`, use embedded real `http(s)` URL for preview/open, and keep the original app scheme for copy.
- Logo fallback supports external favicon first and local generated SVG via `imageFallback` on error.
- Unknown sites with no thumbnail still show a domain abbreviation fallback.
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
- API key is currently hardcoded by user request and persisted in localStorage.
- `AI_PRESETS.deepseek` sets `baseUrl = "https://api.deepseek.com"` and `model = "deepseek-v4-flash"`.
- DeepSeek uses its own API key. The preset must not overwrite the current key.

Settings:

- `state.aiEnabled`: AI recommendations enabled.
- `state.skillAutoReply`: skill auto-send switch.
- `state.skillAutoLearn`: manual reply learning switch.
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
  - `6`: mini-program card, use `miniProTitle/miniProName/miniProDesc/miniProImg/miniProUrl`.
  - `8`: file card. Current real sample stores JSON in `content`, e.g. `{"Title":"...pdf","Type":74,"TypeStr":"[应用消息]"}`.
- `public/app.js` now renders in this order:
  - image -> file card -> mini-program card -> link/web card -> text.
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

## Non-Negotiables

- Do not fake searchable user IDs.
- Do not fake order records.
- Do not convert internal system notices into customer messages.
- Do not overwrite unrelated user changes.
- Use `apply_patch` for manual edits.
- Update this file and `PROJECT_MEMORY.md` after meaningful work.

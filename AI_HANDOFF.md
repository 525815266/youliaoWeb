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

## Web Client Docker Deployment

Important correction from 2026-06-15: Dockerize and deploy the Web client project `C:\youchat-dev-web`, not the already-Dockerized YouChat backend.

- Web client compose project/container: `youchat-dev-web`
- Web client image: `youchat-dev-web:local`
- Web client port: host `5177` -> container `5177`
- Web client FnOS deploy dir: `/vol1/1000/Docker/youchat-dev-web`
- In-container backend API: `http://host.docker.internal:18080/api`, mapped by compose `extra_hosts: host.docker.internal:host-gateway`
- External/backend service remains the existing FnOS YouChat service: `http://192.168.9.83:18080/api`
- Do not modify/restart backend project `/vol1/1000/Docker/youchat` or compose project `youliaoapp` during Web-client Docker work.

Files added for Web Docker:

- `Dockerfile`
- `compose.yaml`
- `.dockerignore`
- `.env.example`
- `scripts/deploy-fnos-web.py`

Docker verification:

```powershell
cd C:\youchat-dev-web
npm run check
python -m py_compile .\scripts\deploy-fnos-web.py
docker compose -p youchat-dev-web -f compose.yaml up -d --build
Invoke-RestMethod http://localhost:5177/health
```

FnOS deploy command:

```powershell
cd C:\youchat-dev-web
$env:FNOS_PASSWORD = "..."
$env:FNOS_SUDO_PASSWORD = "..."
python .\scripts\deploy-fnos-web.py
```

The container uses bundled original-client assets:

- `public/native-icons/braft-icons.woff`
- `public/static/emojiSource.cdbf96da.png`

Docker proxy gotcha fixed on 2026-06-15:

- `/api/*` proxy must strip hop-by-hop/problematic request headers.
- In particular, `Expect: 100-continue` from PowerShell/other clients makes Node/undici `fetch` fail with `expect header not supported`.
- `server.js` uses `sanitizeProxyRequestHeaders()` before forwarding to YouChat.

Do not commit runtime files:

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

## Docker Image Publishing

GitHub Container Registry publishing was added on 2026-06-15.

- Workflow: `.github/workflows/docker-publish.yml`
- Registry: `ghcr.io`
- Image naming: `ghcr.io/<owner>/<repo>:<tag>`
- Pull-based compose template: `compose.registry.yaml`

Security rule:

- Public images must not include real user runtime data or secrets.
- `Dockerfile` intentionally does not copy `config/` or `data/`.
- `.dockerignore` excludes `config`, `data`, and `logs`.
- `.gitignore` ignores:
  - `config/ai-providers.json`
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`
- Example files are safe:
  - `config/ai-providers.example.json`
  - `data/reply-skills.example.json`

Deploy from GHCR:

```bash
docker compose -p youchat-dev-web -f compose.registry.yaml pull
docker compose -p youchat-dev-web -f compose.registry.yaml up -d
```

## PromptWorks Sidecar Training Workbench

Added on 2026-06-17 after evaluating `https://github.com/YellowSeaa/PromptWorks`.

Use case:

- PromptWorks is useful as a sidecar prompt/skill evaluation and optimization workbench.
- It is not a replacement for the YouChat Web chat UI and should not directly run production auto-reply.
- Intended flow:
  1. export/sample real YouChat manual replies, quick replies, and skill candidates
  2. evaluate and optimize them in PromptWorks
  3. let the user approve changes
  4. write approved results back to `data/reply-skills.json` or the Web skill training queue

Local files:

- `deploy/promptworks-compose.fnos.yaml`
- `scripts/deploy-fnos-promptworks.py`
- npm script: `npm run fnos:deploy:promptworks`

FnOS deployment:

- URL: `http://192.168.9.83:5188`
- Remote dir: `/vol1/1000/Docker/promptworks`
- Compose project: `promptworks`
- Containers:
  - `promptworks-frontend`
  - `promptworks-backend`
  - `promptworks-postgres`
  - `promptworks-redis`

Port rules:

- Only expose frontend: host `5188` -> container `80`.
- Do not use PromptWorks default `18080:80`; `18080` is the YouChat backend API.
- Do not expose PromptWorks backend/Postgres/Redis to host unless explicitly debugging.
- Do not modify `/vol1/1000/Docker/youchat` or compose project `youliaoapp` for PromptWorks work.

Deploy/update command:

```powershell
cd C:\youchat-dev-web
$env:FNOS_PASSWORD = "..."
$env:FNOS_SUDO_PASSWORD = "..."
npm run fnos:deploy:promptworks
```

The deploy script:

- uploads `deploy/promptworks-compose.fnos.yaml` as remote `compose.yaml`
- runs remote `docker compose -p promptworks -f compose.yaml pull`
- runs remote `docker compose -p promptworks -f compose.yaml up -d`
- waits for `/api/v1/project-info/summary`
- seeds compatible Bearer/OpenAI AI providers from local runtime `config/ai-providers.json`

Current seeded provider:

- `sub2 中转`
- base URL: `https://sub2.sn55.cn/v1`
- models: `gpt-5.4-mini`, `gpt-4.1`, `gpt-4o-mini`

Important auth limitation:

- PromptWorks upstream invokes models as `Authorization: Bearer <api_key>` against `{base_url}/chat/completions`.
- CodeBuddy in YouChat Web uses `X-Api-Key`; do not auto-seed it into PromptWorks unless PromptWorks is extended with auth type support or routed through a compatible proxy.
- DeepSeek can work if configured with an official key and base URL ending in `/v1`.

Verified on 2026-06-17:

- `GET http://192.168.9.83:5188/` returned `200`.
- `GET /api/v1/project-info/summary` worked and showed PromptWorks `v1.3.1`.
- `GET /api/v1/llm-providers/` showed one provider and three models.
- `POST /api/v1/llm-providers/1/invoke` reached sub2 and returned completion plus token usage.

Failure/fix on 2026-06-17:

- User saw PromptWorks UI `Failed to fetch`.
- Root cause 1: upstream frontend bundle hardcoded `http://localhost:8000/api/v1`.
- Root cause 2: FastAPI slash redirects on paths like `/api/v1/prompts` lost host port because upstream nginx used `$host`, producing `http://192.168.9.83/api/v1/prompts/`.
- Fix files:
  - `deploy/promptworks-nginx.conf`
  - `deploy/promptworks-compose.fnos.yaml`
  - `scripts/deploy-fnos-promptworks.py`
- Frontend container startup now patches JS bundle:
  - `http://localhost:8000/api/v1` -> `/api/v1`
- Compose mounts `./nginx.conf` over `/etc/nginx/conf.d/default.conf`.
- Nginx config uses:
  - `proxy_set_header Host $http_host`
  - `proxy_set_header X-Forwarded-Host $http_host`
  - `proxy_redirect` to keep redirects on `:5188`
- Deploy script now verifies:
  - frontend bundle no longer contains the bad localhost API URL
  - browser paths `/api/v1/prompts` and `/api/v1/prompt-classes` work through redirects
- Verified after redeploy:
  - `/api/v1/prompts` redirects to `http://192.168.9.83:5188/api/v1/prompts/`
  - following that redirect returns real prompt data

## 2026-06-17 Handoff: Import YouChat Manual Replies into PromptWorks

User asked whether database replies can be imported into PromptWorks for training. This is now implemented with real YouChat API data, not fake samples.

New local API:

- `POST /local/promptworks/import-training`
- Default is `dryRun=true`, which only previews samples.
- `dryRun=false` writes to PromptWorks.

Request fields:

- `contactLimit`, default `18`, max `80`
- `messageLimit`, default `80`, max `180`
- `sampleLimit`, default `80`, max `500`
- `previewLimit`, default `8`, max `20`
- optional `promptWorksApiBase`
- optional `promptName`, `taskName`, `version`

Server flow:

1. `collectManualReplySamples()` calls real YouChat endpoints:
   - `/Contact/GetContactList`
   - `/ChatContent/GetList`
2. It extracts adjacent customer-message -> manual-service-reply pairs.
3. It filters system/internal notices with `isSampleSystemMessage()`, including:
   - 接入会话
   - 会话结束
   - 系统关闭
   - 转接
   - 自动回复/机器人提示
   - 撤回/拍一拍
4. It creates PromptWorks cases with:
   - `customer_message`
   - `manual_reply`
   - `platform_key`
   - `intent_key`
   - `learning_stage`
   - `image_urls`
   - contact/message timestamps
5. `dryRun=false` creates or updates PromptWorks Prompt `悠聊客服回复训练`, then creates a draft prompt-test task with `variables: { cases: [...] }`.

Frontend entry:

- Page: `http://localhost:5177/skill-training.html`
- Panel: `PromptWorks 导入训练`
- Buttons:
  - `预览样本`
  - `确认导入`
- Files:
  - `public/skill-training.html`
  - `public/skill-training.js`
  - `public/skill-training.css`

Config:

- `.env.example`
- `compose.yaml`
- `PROMPTWORKS_API_BASE`
- `PROMPTWORKS_TIMEOUT_MS`
- Container default API base: `http://host.docker.internal:5188/api/v1`
- Local default API base: `http://192.168.9.83:5188/api/v1`

Verification done:

- `npm run check` passed.
- Dry-run returned real samples, after filtering system notices.
- Real import with `sampleLimit=2` succeeded:
  - PromptWorks Prompt id `2`, name `悠聊客服回复训练`
  - PromptWorks task id `1`
  - task status `draft`
  - one unit with 2 cases
  - model provider `sub2`, model `gpt-5.4-mini`
- Node fetch confirmed PromptWorks stores normal Chinese. PowerShell display may look mojibake, but API data is correct.
- Deployed to FnOS Web container at `http://192.168.9.83:5177` using `scripts/deploy-fnos-web.py`.
- Remote verification:
  - `/health` includes `promptWorksApiBase: http://host.docker.internal:5188/api/v1`
  - `/skill-training.html` contains the `PromptWorks 导入训练` panel
  - remote dry-run collected real samples from YouChat

Do not regress:

- Do not let PromptWorks directly update production `data/reply-skills.json`.
- Do not auto-execute PromptWorks tasks from this import endpoint.
- Keep preview-first workflow in the UI.
- Keep `/local/skill-training/sample` working; it now reuses the same collector but still queues Web skill candidates.
- Do not auto-seed CodeBuddy into PromptWorks unless PromptWorks supports `X-Api-Key` or YouChat Web proxies it.

## 2026-06-16 Handoff: Client Options Save Guard

User issue:

- User corrected the intent: `自动关闭会话` should stay off, because enabling it automatically closes conversations.
- Saving the native-style `系统设置` modal can also make the backend fall back to SQLite if database/task options are submitted unsafely.
- Since the deployment should use MySQL, Web should periodically detect SQLite regression and repair automatically.

Do not regress:

- Do not let Web save `jobOptions.autoShutDown=true`.
- Do not call `/System/SetOptions` directly from the frontend for the settings modal.
- Keep `POST /local/client-options/save` as the safe save path.
- Do not call `/System/SetOptions` with JSON. Use dotted `form-data` fields; JSON can make YouChat fall back to SQLite.
- Do not expose database mode as a normal easy-to-toggle UI control that can save SQLite.

Files changed:

- `public/app.js`
- `public/styles.css`
- `server.js`
- `.env.example`
- `compose.yaml`
- `compose.registry.yaml`
- `README.md`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

New local API:

- `POST /local/client-options/save`
- `GET /local/fnos/guard`
- `POST /local/fnos/guard`

Safe settings save flow:

1. Server reads current `/System/GetOptions`.
2. Server merges incoming settings with current settings.
3. Server forces:
   - `dataBaseOptions.databaseType=0`
   - MySQL connection string preserved
   - `jobOptions.autoShutDown=false`
   - `jobOptions.runTimeoutCheckJob=true`
4. Server calls real `/System/SetOptions` with dotted `form-data` fields, for example `jobOptions.autoShutDown=false`.
5. Server checks database health.
6. If SQLite or abnormal history count appears, server calls `restoreFnOSDatabaseToMySQL()`.
7. Server rereads `/System/GetOptions` and refuses success unless `databaseType=0` and `autoShutDown=false`.

Database guard:

- Enabled by default.
- Startup check after 15 seconds.
- Timer check every `YOUCHAT_DATABASE_GUARD_INTERVAL_MS`, default `300000`.
- Repairs automatically if database mode is not MySQL or history count is below `YOUCHAT_DATABASE_GUARD_MIN_HISTORY_COUNT`.
- State is exposed in database modal and `/local/fnos/guard`.

Verification performed:

- `npm run check` passed.
- `python -m py_compile .\scripts\deploy-fnos-web.py` passed.
- `GET /local/fnos/health` returned MySQL:
  - `databaseType=0`
  - `historyContacts=5758`
  - `guard.enabled=true`
- Simulated saving with `jobOptions.autoShutDown=true`; after save:
  - real `/System/GetOptions` still had `databaseType=0`
  - real `/System/GetOptions` still had `jobOptions.autoShutDown=false`
  - safe save path did not need repair after switching to dotted `form-data`.

Additional 2026-06-16 probe:

- `json-camel-root` to `/System/SetOptions` changed `dataBaseOptions.databaseType` from `0` to `2`, confirming JSON is unsafe.
- `form-json-params-camel` did not persist `jobOptions.autoShutDown=false` and still caused a database regression.
- `form-dot-camel` persisted `jobOptions.autoShutDown=false` while keeping MySQL, so `server.js` now uses `postYouChatDotForm()` for safe settings save.

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
- Guestbook `全部接入` (`/Conversation/AccessInAll`) must use the verified short customer-service account id (captured working payload: `accountId=2`). Do not pass a guestbook contact's `accountId=0`; the API may still return success while doing nothing.
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
- 2026-06-16 red-dot sync hardening:
  - `server.js` now detects Docker runtime and retries private-host API bases through `host.docker.internal` for both `/local/signalr/consume` and `/api/*` proxying.
  - `public/app.js` now prefers the verified short contact-list account id for SignalR registration.
  - Clicking/selecting a conversation no longer clears Web unread state before real sync. It calls `ConsumeMessage(contactId, 0)`, verifies `/Contact/GetContactList(id=contactId)` reports `unRead=0`, then clears local badges.
  - Verification only copies read-count fields back into the local contact. Do not overwrite the full contact from `id=contactId` probes because those responses may have `records:null` or missing robot info.
  - Live FnOS verification: browser-style payload `apiBase=http://192.168.9.83:18080/api`, `accountId=2`, `contactId=223`, `msgId=0` returned `resolvedApiBase=http://host.docker.internal:18080/api`; direct backend and Web proxy both then returned `unRead=0`.
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
- Auto recommendation/auto reply must only use the latest unanswered inbound customer message. If an outgoing/AI/system/robot handling result appears after the customer message, do not reply to the old customer question.
- Order lookup result prompts are no-reply boundaries, including `发【订单】查看`, product title + `订单/查看`, and order success/bound/tracked/queried phrases.
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



## 2026-06-20 Handoff: Skill Platform Detection for Douyin Orders

User issue:

- Skill training knew messages contained order numbers, but did not reliably classify the platform.
- Douyin order ids such as `5120219343689007205` were not detected as `douyin`.
- Generic numeric rules and default Taobao order filter state could pollute platform matching.

Changed files:

- `public/app.js`
- `server.js`
- `public/skill-training.js`

Important logic:

- `public/app.js`:
  - Douyin platform aliases now include Douyin Shop terms.
  - Douyin high-confidence order pattern: `/^5\d{18}$/`.
  - `detectPlatformOrderNo(text)` now uses explicit text platform, real order state, PDD pattern, then Douyin 5-prefix 19-digit rule before generic numeric rules.
  - `detectOrderPlatformFromState()` no longer returns Taobao simply because `state.orderType=0`; it requires real order context.
- `server.js`:
  - `detectTrainingOrderPlatformKey(text)` mirrors the Douyin/PDD order-id logic for skill training and PromptWorks imports.
  - `detectTrainingPlatformKey(text)` returns `douyin` for explicit Douyin aliases before generic platforms.

Verified:

- `npm run check` passed.
- Frontend VM test proved:
  - `5120219343689007205` -> `douyin`
  - PDD hyphen id -> `pdd`
  - default Taobao filter outside order context -> no platform
  - active order tool with Douyin filter -> `douyin`
- Server VM test proved the same for training sampler.

Do not regress:

- Keep Douyin high-confidence numeric detection before Taobao/JD generic pure-number matching.
- Do not use default order filter state as platform evidence unless the order tool actually has keyword/data/context.
- If adding new platform order patterns, update both frontend matching and server training sampler.


## 2026-06-20 Handoff: Platform-aware Skill Learning from Order Records

What changed after the first Douyin fix:

- Added exact order-record platform matching in `public/app.js`.
- New helper path:
  - `getOrderRecordNumbers(order)`
  - `getOrderRecordPlatformKey(order)`
  - `detectOrderPlatformFromRecords(orderNo)`
  - `detectPlatformOrderNo(text)`
- `detectPlatformOrderNo(text)` now returns `source: "order-record"` when the customer order number matches a real right-side order row.
- `inferOrderPlatformKey(orderNo, options)` now checks Douyin 19-digit 5-prefix ids before default/generic state platform matching.
- Skill send/manual-learning platform priority now prefers current context platform before old suggestion platform, preventing stale skill matches from teaching the wrong platform.

Server training:

- `detectTrainingPlatformAliasKey(text)` now handles explicit aliases.
- `detectTrainingPlatformKey(text)` checks order id patterns first, then aliases.
- Training imports can classify generic numeric ids when text explicitly says Douyin/JD/Taobao/etc.

Verified commands/tests:

- `npm run check`
- Frontend VM cases:
  - record Douyin order `5120219343689007205` -> `douyin/order-record`
  - default Taobao + `5120219343689007205` -> `douyin`
  - PDD hyphen -> `pdd`
  - explicit JD -> `jd`
- Server VM cases:
  - Douyin pattern -> `douyin`
  - explicit Douyin numeric -> `douyin`
  - PDD hyphen -> `pdd`
  - explicit JD/Taobao -> correct platform

Do not regress:

- Current prompt/order context must outrank old matched suggestion platform when learning from a manual reply.
- Right-side order record matches are real-data evidence; do not replace them with fake platform guesses.
- Keep default `state.orderType=0` from classifying unrelated numeric ids as Taobao outside actual order context.


## 2026-06-21 Handoff: HTTPS Mixed Content Fix for Lucky Public URL

Public URL:

- `https://yzkf.xmmhsj.cn:8001/`

Problem:

- Cert is valid, but browser warns that parts of the page are not secure.
- Treat this as mixed content, not a certificate failure.

Implemented:

- `server.js`: added `/local/media-proxy?url=...`, streaming image/video-like upstream responses from the current origin.
- `public/app.js`: added `getDisplayMediaUrl()`, `getPreviewFrameUrl()`, and HTTPS embed guards.
- HTTPS page no longer browser-connects to HTTP SignalR; it relies on `/local/signalr/consume` server bridge.
- Chat images, avatars, link thumbnails, mini-program covers, order images, skill thumbs, and link preview media are display-proxied when source is HTTP.
- HTTP iframe previews are blocked in HTTPS page and replaced by a message; open-page action still works.
- `public/skill-training.js`: training image strip uses display proxy for HTTP images when page is HTTPS.

Important rule:

- Proxy URLs are display-only. Preserve original image URLs for sending, learning, copying, opening, and storage.

Verified:

- `npm run check` passed.
- `git diff --check` passed.
- Static scan found no remaining direct risky display template patterns for image `src` or preview iframe `src`.

If user reports the warning persists:

1. Open DevTools > Security / Console on `https://yzkf.xmmhsj.cn:8001/`.
2. Copy the exact `Mixed Content` URL.
3. Add that render path to `getDisplayMediaUrl()` or block embedding if it is an iframe/script/style.


## 2026-06-29 Handoff: Conversation Keyboard Navigation and Skill Training Marking UI

Changed files:

- `public/app.js`
- `public/skill-training.html`
- `public/skill-training.js`
- `public/skill-training.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Conversation list keyboard behavior:

- `state.contactListKeyboardActive` tracks whether the left conversation list is the current keyboard target.
- Clicking, mousing down, or focusing the contact list enables keyboard navigation.
- Global `ArrowUp` / `ArrowDown` handling now switches conversations when the list is active and the user is not typing in an input/textarea/select/button/contenteditable target.
- `focusContactCard(contactId)` restores focus after async `selectContactById()` renders the list again.
- The original contact-list keydown handler now stops propagation for up/down to avoid double navigation.

Skill training UI:

- Training page is now framed as a data marking queue, not an unclear approval screen.
- Header actions:
  - `采样日常回复` calls `/local/skill-training/sample`.
  - `AI 初审当前条` runs the existing AI organize flow for the current visible card only.
  - `刷新待审` reloads `/local/skill-training`.
- `打开页面时自动采样` persists to `localStorage` key `youchat.training.autoAudit`. When enabled, the page samples real manual replies on load and every 10 minutes while open. It does not save skills automatically.
- Button labels map to backend actions:
  - `approve` -> 保存并启用
  - `optimize` -> 保存修改
  - `needs-review` -> 继续人工处理
  - `disable` -> 不再使用
  - `delete` -> 删除记录
  - `clear-overrides` -> 清空误学样本

Keyword tag editor:

- The old plain keywords input is now rendered by `renderKeywordEditor()`.
- Keywords display as removable chips. Users can click `x` to delete or type and press Enter to add.
- `splitKeywordValue()` supports whitespace, comma, Chinese comma/dunhao, semicolon, pipe, and slash separators.
- `collectPatch()` calls `syncAllKeywordEditors()` before saving so pending typed keywords are not lost.
- Storage remains the original `keywords` field, so existing `data/reply-skills.json` stays compatible.

Do not regress:

- AI初审 must only fill candidate editor fields. It must not silently save, enable, disable, or delete a skill.
- Auto sampling must not mutate mature enabled skills without later manual marking.
- If adding more platform/intent labels, update `TRAINING_PLATFORM_LABELS`, `TRAINING_INTENT_LABELS`, and possibly the server-side detection in `server.js`.

Verified:

- `npm run check`
- Local server health and training assets returned 200:
  - `http://127.0.0.1:5177/health`
  - `http://127.0.0.1:5177/skill-training.html`
  - `http://127.0.0.1:5177/skill-training.js`
  - `http://127.0.0.1:5177/skill-training.css`
  - `http://127.0.0.1:5177/local/skill-training?scope=today`


## 2026-06-30 Handoff: Order-number Skill Training Correction

Problem:

- Customer messages that are only an order number, for example `5121974090067009148`, were being learned as raw numeric keywords/samples.
- Douyin order-number scenarios could inherit or update Taobao-style learned replies.
- Ads/promotions plus polite manual replies could enter the skill training queue.

Changed files:

- `server.js`
- `public/app.js`
- `public/skill-training.js`
- `public/skill-training.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Server-side training rules:

- New helpers in `server.js` detect likely order numbers and pure-order prompts:
  - `getTrainingOrderNumbers()`
  - `isLikelyTrainingOrderNo()`
  - `isPureTrainingOrderPrompt()`
  - `hasTrainingOrderSignal()`
- Pure order-number prompts, and order-number prompts without stronger intent, default to `intentKey=order_waiting`.
- 19-digit order numbers starting with `5`, such as `5121974090067009148`, classify as `douyin`.
- Raw order numbers are removed from `keywords`.
- Semantic keyword replacements are generated, for example:
  - `抖音订单`
  - `订单未提示`
  - `首次答复`
  - `客户发订单号`
- `learningBucketKey` uses semantic platform/intent/stage tokens instead of the raw order number.
- Pure order-number prompts no longer fallback-merge into old learned skills by prompt similarity. This prevents Douyin order replies from being written into old Taobao skills.
- `queueTrainingCandidate()` skips ad-like prompts and low-value polite replies, such as `好的`, `收到`, `稍等`, unless there is an order/business signal.

Frontend manual learning:

- `public/app.js` mirrors the backend behavior:
  - `detectSkillIntentKey()` returns `order_waiting` for pure order-number text.
  - `extractLearningKeywords()` returns semantic order keywords for order-number prompts.
  - `shouldSkipManualLearning()` rejects ad-like prompts and low-value polite replies.
  - Current detected platform/intent outranks stale matched skill metadata.
  - Pure order-number prompts do not fallback to old prompt-similar learned skills.

Training UI:

- Platform is now a native `<select>` with options: 未识别、淘宝/天猫、京东、拼多多、抖音、快手、唯品会、美团、饿了么.
- Intent was renamed to `回复类型` and is now a native `<select>` with options: 通用、订单未提示、订单无回馈/查不到、绑定失败、提现相关、到账/回馈状态、转人工.
- Keyword chips filter raw order numbers and replace them with semantic tags based on the current platform/type selects.
- AI audit prompt asks for `platformKey` and `intentKey` and explicitly says not to use raw order numbers as keywords.

Verified:

- `npm run check`
- `git diff --check`
- Node VM cases:
  - `5121974090067009148` -> `douyin/order_waiting`, keywords are semantic and contain no raw number.
  - `京东订单 3309003552115074869` -> `jd/order_waiting`, keywords are semantic.
  - Ad prompt + `好的` -> skipped.
  - `你好` + `收到` -> skipped.

Do not regress:

- Never store raw order numbers as training keywords.
- Do not merge pure order-number prompts into old learned skills by fuzzy prompt match.
- If adding platform order patterns, update both `server.js` and `public/app.js`.


## 2026-07-02 Handoff: Mobile Workbench Adaptation

Problem:

- On mobile Safari/phone browsers, the desktop three-column workbench was squeezed into a narrow viewport.
- Conversation list, chat pane, and a blank right-side area could appear together.
- The composer and top tools could be clipped, especially near the iPhone browser chrome.

Changed files:

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Key implementation:

- `public/index.html`
  - viewport now includes `viewport-fit=cover`.
  - Added mobile-only controls:
    - `#mobileBackToList`
    - `#mobileOpenTools`
    - `#mobileBackToChat`
  - Added `.mobile-tool-head` above the right-side tool tabs.

- `public/app.js`
  - Added `MOBILE_WORKBENCH_QUERY = "(max-width: 760px)"`.
  - Added `state.mobilePanel`, default `list`.
  - Added:
    - `isMobileWorkbench()`
    - `setMobilePanel(panel)`
    - `updateMobilePanelState()`
  - `#workbenchView.dataset.mobilePanel` drives mobile panel visibility.
  - Selecting a contact on mobile switches to `chat`.
  - Calling `setToolTab()` on mobile switches to `tool`.
  - Resize updates the mobile panel state and closes the emoji popover.

- `public/styles.css`
  - Below 760px, `.client-layout` is no longer a three-column grid.
  - `.conversation-pane`, `.chat-pane`, and `.tool-pane` become full-screen absolute panels.
  - The visible panel is selected by `#workbenchView[data-mobile-panel="list|chat|tool"]`.
  - Mobile topbar hides `#operatorName` to avoid status/operator overlap.
  - Mobile chat head hides `#refreshMessages`; it keeps `会话`, `人工接入`, `转 AI`, and `工具`.
  - Mobile composer tools wrap into two rows:
    - icon row
    - 快捷回复/查订单/skill/AI row
  - Mobile composer hides `.red-dot-filter` to avoid a third row pushing the input away.
  - Desktop layout remains unchanged.

Verified:

- `npm run check`
- Local server health:
  - `http://127.0.0.1:5177/health`
- Playwright via system Edge/Chrome:
  - 390x844 mobile viewport has no horizontal overflow (`scrollWidth === 390`).
  - list/chat/tool mobile panels become visible with `opacity=1` after transition.
  - composer stays inside viewport and keeps an editor height around 92px.
  - chat header buttons are not clipped.
  - composer tool buttons are not clipped.
  - 1440x900 desktop keeps three columns: 306px / 752px / 382px.

Do not regress:

- Do not restore the old 760px behavior that stacked `.conversation-pane` and `.chat-pane` vertically.
- Do not add fixed desktop min-widths under the 760px breakpoint.
- If a new composer control is added, test the 390px viewport. The mobile composer has only two intentional rows.
- If mobile red-dot filtering is needed later, expose it through a mobile menu or tool panel, not by adding a third composer row.


## 2026-07-03 Handoff: Withdrawal Refund-block AI Insight

Problem:

- Some users repeatedly try to withdraw, but the chat/system message says the request is paused because there are pending return/refund/exchange orders.
- The user believes these repeat cases often mean the refund/rights-protection order has already finished, but the service has not synced the final order status.
- The web client should surface this as an AI insight in the chat composer area, without fake data.

Changed files:

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Key behavior:

- Added `#withdrawRiskSignal` after the composer AI button.
- Added `state.withdrawRisk`.
- Scans real loaded messages plus optional deeper pages through existing `fetchMessagePage()`.
- Scan window is the last 3 days, but if a withdrawal success/arrival/completion message appears, counting restarts after that success.
- Threshold is `WITHDRAW_REFUND_MIN_COUNT = 3`, because the user asked for “超过2次”.
- A refund-block hit must include withdrawal/extraction terms, refund/return/exchange/rights-protection terms, and blocked/paused/unresolved terms.
- Customer messages that ask “why cannot withdraw / what happened” do not count as block events. They only increase probability/emotion score.
- Urgency detection adds a separate warning signal for impatient or repeated questioning.

UI states:

- Loading: blue compact status.
- Safe: green compact status with generic wording, for example `暂无异常感知，正常接待即可`. Do not mention withdrawal/refund in the safe state because more AI insight types will be added later.
- Notice/warn: orange for customer urgency or medium confidence.
- Danger: red for high-confidence repeated withdrawal block.
- High-risk signal buttons:
  - `查订单`: switches to the order tool and reloads orders.
  - `复制`: copies the internal insight summary.

AI context:

- `buildAiConversationContext()` includes `AI感知提示：...` when the insight exists.
- This should influence AI reply generation, especially for refund-block withdrawal cases and urgent customers.

External order script:

- The provided `3.52youzai` Tampermonkey script calls `https://3.52youzai.com/api/console/tbOrder/findTbOrderList`.
- It captures its `authorization` token inside the `3.52youzai.com` page and GM storage.
- The web client cannot directly read that GM storage. Do not hardcode that token in frontend code.
- Future integration should be a backend proxy with configured token, or a Tampermonkey push-back endpoint that sends order status summaries to the web backend.

Do not regress:

- Do not count pre-success withdrawal failures after a later successful withdrawal.
- Do not count customer restatements as system block events.
- Do not show fabricated orders or fabricated training data for this insight.
- Keep the insight compact and generic by default. It must not push the composer input down like the old AI suggestion layout issues.


## 2026-07-03 Handoff: AI Insight Urgency and Dismissal

Problem:

- The safe AI insight state had an unnecessary `复制` button.
- The safe state wording was too specific to withdrawal/refund risk, but the product will add more AI insight types later.
- The user wants urgency visible in the conversation list, not only after opening a conversation.
- If the customer calms down after the agent soothes them, the insight should clear automatically.
- Otherwise the agent needs a manual clear flow with `忽略` and `已解决`.

Changed files:

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

Implementation:

- Added persistent local dismissal storage:
  - `INSIGHT_DISMISS_STORAGE_KEY = "youchat.ai.insightDismissals"`
  - `INSIGHT_DISMISS_TTL_MS = 3 days`
  - `state.insightDismissals`
- Added list-level insight cache:
  - `state.contactInsights`
  - Deep active-conversation scans write their result back into this cache.
- Conversation list now computes a lightweight insight from contact `records`, or from `lastContent` when records are missing.
- Conversation cards display urgency pills:
  - `平稳`
  - `关注`
  - `紧张`
  - `紧急`
- Conversation card backgrounds use subtle full-card gradients from green to yellow/orange/red.

Composer insight behavior:

- Safe state has no buttons.
- Clicking the safe strip no longer jumps to orders.
- Risk state may show:
  - `查订单` for withdrawal/refund block risks.
  - `消除` for dismissible risks.
- Clicking `消除` expands inline actions:
  - `忽略`
  - `已解决`
- Dismissal lowers the active insight and list urgency to safe.
- A later risk message with a timestamp after the dismissal can trigger the insight again.

Automatic easing:

- Added:
  - `detectInsightResolution()`
  - `isSoothingOutgoingMessage()`
  - `isCustomerReliefMessage()`
- If the agent/AI sends a soothing or checking message, and the customer later replies with understanding/thanks/OK, the insight becomes safe with `客户已回复理解，感知已缓和`.

Verified:

- `npm run check`
- Browser probe:
  - Safe insight has zero buttons.
  - Risk insight buttons are `查订单`, `消除`, `忽略`, `已解决`.
  - Desktop strip stays 520x30.
  - Mobile 390px viewport has no horizontal overflow and composer remains inside the viewport.
  - Conversation card can show `紧急` with a red gradient.

Do not regress:

- Do not re-add a copy button to the safe insight state.
- Do not make the safe text specific to one scenario.
- Do not use `AI 稳/低/中/高` in the conversation list. Use descriptive words instead.
- Future insight types should reuse `contactInsights` and `insightDismissals` instead of creating separate list urgency systems.

## 2026-07-03 Handoff: Security & Robustness Audit + Fixes

Full code audit (`server.js` + `public/app.js`) and UI/UX review. Applied fixes are low-risk and verified with `npm run check`. Higher-risk items are left as open decisions.

Fixed (`server.js`):

- **H2 crash-hardening**: added global `uncaughtException` / `unhandledRejection` handlers (log + stay alive), plus an `error` listener and `res.on("close")` cleanup on the media-proxy `Readable.fromWeb(...).pipe(res)` stream. Previously a single interrupted `/local/media-proxy` request could crash the whole process and drop every agent.
- **M6 atomic write**: `writeReplySkills()` writes a temp file then `renameSync`, so a crash/power loss no longer leaves half-written JSON that `readReplySkills()` resets to defaults (losing all learned skills).
- **M7 body cap**: `readBody()` rejects bodies over `MAX_REQUEST_BODY_BYTES = 32MB`.
- **M2 log redaction**: `captureApi()` runs `redactSensitiveCaptureText()` before writing — masks password/pwd/token/access_token/api_key/secret/authorization/signature in both JSON and form bodies. Login credentials/tokens no longer land in `logs/api-capture.ndjson`.

Fixed (frontend):

- **P0-1**: `.composer .reply-text` gained a `:focus-visible` outline (was `outline:none`; the main reply box had no visible keyboard focus).
- **P1-2**: `toast()` sets `role="alert"` for errors (assertive announce), errors stay 6s, click-to-dismiss. Signature unchanged.
- **P1-3**: low-contrast greys (`#8a98aa` `#7a8798` `#8a96a8` `#9aa4b3`) folded to WCAG-passing `--muted` / `#5f6b7d`.

Open decisions (NOT changed — need product/deploy call):

- **H1 (CRITICAL — keys already leaked publicly)**: `origin` is the PUBLIC repo `github.com/525815266/youliaoWeb`. `app.js:8` and `app.js:46` hardcode the real sub2 / codebuddy API keys, present since the initial commit `211d09f`, so both keys are already exposed on public GitHub — **git history included, so deleting them from HEAD does NOT undo the exposure**. The required first action is out of code scope: **rotate (regenerate) the sub2 (`sub2.sn55.cn`) and codebuddy (`copilot.tencent.com`) keys** to invalidate the leaked ones. Then keep keys only in gitignored `config/ai-providers.json`, inject them server-side in `proxyAi`/`handleAiModels` by providerId/baseUrl when the frontend sends an empty key, drop the hardcoded frontend keys, and stop returning `apiKey` from `/ai/providers`. AI calls can't be tested from the dev box, so do the code half with the user able to verify on `:5177` right after.
- **P0-A (high)**: 761–1120px hides `.tool-pane` with no reopen path (mobile split only activates ≤760px via `MOBILE_WORKBENCH_QUERY`). Proper fix is a tool drawer for tablet width; needs multi-breakpoint browser testing. Do NOT just move the breakpoint to 1120 — that forces phone-style single-column switching onto tablets.
- **M3/M4 (med)**: media-proxy/link-preview have no private-IP filter (SSRF); `/api?__target=` is an open forward proxy. Verify frontend `__target` usage before restricting.
- **P2-6 (cleanup)**: dead-CSS removal deferred. WARNING: `applyAiSuggestion` / `sendAiSuggestion` are NOT dead — they are `display:none` but bound at `app.js:730` and state-managed; deleting their HTML crashes the frontend. Only truly orphaned login-illustration child styles (`.platform/.chat-rail/.cube`, no matching DOM under `.login-illustration`) may be removed after a browser check.

Audit notes:

- Reviewed and found robust: withdraw-risk scan token/debounce, AI auto-suggest debounce + AbortController, static file path-traversal guard, image-upload fallback chain. `proxyAi` does not leak keys to logs/errors; the only key exposure is H1.

## 2026-07-05 Handoff: FnOS YouChat Backend 18080 Offline Recovery

Incident:

- Web login stayed on `连接中`.
- Official Windows client showed `网络错误，请检查服务端是否在线`.
- `5177` Web container and `5700` Qinglong were reachable; `18080` backend was the failing path.

Root cause:

- `youchat-service` container was `Up` and still mapped `18080 -> 8080`, but the app process crashed immediately on startup.
- Logs repeated `Newtonsoft.Json.JsonReaderException: Error reading JObject from JsonReader. Path '', line 0, position 0`.
- The backend config file `/vol1/1000/Docker/youchat/\悠聊数据库\config\YouChatConfig.json` was `0 bytes`.
- Important Linux path detail: this is a filename containing backslashes under `/vol1/1000/Docker/youchat`, not a normal nested `/悠聊数据库/config/` directory. Use `find` to locate it instead of hand-typing the path.

Recovery performed:

- Backed up the empty config under `docker-control/config-backups/empty-json-<timestamp>/YouChatConfig.json.empty`.
- Restored from `/vol1/1000/Docker/youchat/docker-control/config-backups/manual-mysql-switch-20260609-152800/YouChatConfig.json.after`.
- That backup has `DatabaseType=0` and a MySQL connection string.
- Restarted only `youchat-service`.

Verification:

- Remote FnOS POST `/api/System/GetOptions` returned `200`.
- Local Windows `Test-NetConnection 192.168.9.83 -Port 18080` returned `TcpTestSucceeded=True`.
- Local Windows POST `http://192.168.9.83:18080/api/System/GetOptions` returned `success=True` and `databaseType=0`.
- `http://192.168.9.83:5177/health` remained healthy with `apiBase=http://host.docker.internal:18080/api`.

Future diagnostic shortcut:

- If the official client says backend offline while Docker says `youchat-service Up`, inspect `docker logs youchat-service` first.
- If `JsonReaderException` appears, check the config size with `find /vol1/1000/Docker/youchat -maxdepth 1 -type f -name '*YouChatConfig.json' -printf '%s %p\n'`.
- Do not restart or reset MySQL for this failure mode; restore the config and restart `youchat-service`.

## 2026-07-05 Handoff: Self-Healing Backend Config Guard

Goal:

- Prevent recurrence of the 0-byte `YouChatConfig.json` outage.
- Let Web repair the backend even when `:18080` is offline.
- Let the original backend self-heal before every `YouChatService` start, independent of Web.

Implemented locally:

- `compose.yaml` / `compose.registry.yaml` now mount the original backend directory:
  - host: `${FNOS_YOUCHAT_SERVICE_DIR:-/vol1/1000/Docker/youchat}`
  - container: `${YOUCHAT_SERVICE_DIR:-/youchat-service}`
- `.env.example` documents:
  - `FNOS_YOUCHAT_SERVICE_DIR`
  - `YOUCHAT_SERVICE_DIR`
  - `YOUCHAT_CONFIG_REPAIR_WAIT_MS`
- `server.js` now has an offline repair path:
  - locates the special backslash filename `*YouChatConfig.json` under the mounted backend directory
  - validates size, JSON parse, MySQL mode, connection string, and `AutoShutDown=false`
  - backs up the old file under `docker-control/config-backups/web-config-repair-<timestamp>/`
  - writes a safe MySQL config atomically
  - writes `docker-control/restart.request`
  - waits for `/System/GetOptions` to recover
- `restoreFnOSDatabaseToMySQL()` now tries the official API first and falls back to config-file repair when the API is unavailable.
- New backend guard template:
  - `ops/fnos-youchat-service/config-guard.sh`
- New installer:
  - `scripts/install-fnos-youchat-service-guard.py`
  - npm command: `npm run fnos:install:service-guard`

Applied on FnOS:

- Installed `config-guard.sh` to `/vol1/1000/Docker/youchat/docker/config-guard.sh`.
- Patched `/vol1/1000/Docker/youchat/docker/run-youchat.sh` to call `/app/docker/config-guard.sh` before launching `/app/YouChatService`.
- Restarted `youchat-service`.
- Logs showed `[config-guard] disabled AutoShutDown in existing config`.

Verified:

- Backend API:
  - `POST http://192.168.9.83:18080/api/System/GetOptions`
  - `databaseType=0`
  - `autoShutDown=False`
- Web health:
  - `GET http://192.168.9.83:5177/health` ok
- Web FnOS health:
  - `GET http://192.168.9.83:5177/local/fnos/health`
  - `databaseMode=mysql`
  - `offlineRepairAvailable=True`
  - `serviceConfig.ok=True`
  - `serviceConfig.autoShutDown=False`
- Sandbox guard test:
  - Created a 0-byte `YouChatConfig.json` in `/tmp`.
  - Ran `config-guard.sh` with `YOUCHAT_APP_DIR=/tmp/youchat-guard-test`.
  - It generated a MySQL config, set `AutoShutDown=false`, and created a backup.

Operational shortcut:

- If `:18080` is offline again, call `POST /local/fnos/restore-mysql` from Web first. It now handles both online SQLite regression and offline empty-config recovery.
- Backend restarts also self-heal without Web being open.

## 2026-07-05 Handoff: Conversation List Status Column Fix

Issue:

- In the left conversation list, the AI insight pill (`平稳`, `关注`, etc.) and unread badge could visually collide.
- The latest-message line spanned into the right status column, so the unread badge looked like it was sitting on top of message text.

Fix:

- `renderContacts()` now renders a structured right-side status column:
  - `.contact-time`
  - `.contact-status-stack`
  - `.contact-urgency-pill`
  - `.unread-badge`
- `.contact-card` uses named grid areas: `avatar`, `main`, `last`, `side`.
- `.contact-last` is constrained to the body column only.
- The side column is fixed at `64px`, enough for `07/05 20:51`.
- AI status and unread badge stack vertically in the side column.

Verified:

- `npm run check`.
- Chrome headless screenshot using the real `public/styles.css` showed full time text and clean vertical separation between AI status and unread badges.

## 2026-07-05 Handoff: Mobile Workbench Adaptation

Goal:

- Make the Web客服工作台 usable on phones without squeezing the desktop three-column layout into one viewport.
- Keep real-data behavior unchanged. This change is layout-only.

Changed:

- `public/index.html`
  - Viewport now includes `maximum-scale=1, user-scalable=no, viewport-fit=cover` to prevent accidental double-tap zoom inside the phone workflow.
- `public/styles.css`
  - Added a final `@media (max-width: 760px)` mobile hardening layer.
  - Topbar becomes two rows: brand/status/AI on row 1, native client shortcut icons on row 2.
  - Chat header becomes two rows: back + contact identity on row 1, action buttons on row 2.
  - Messages, outgoing bubbles, link cards, mini-program cards, and file cards now clamp to phone width.
  - AI/skill suggestion strip is shorter and no longer pushes the composer as aggressively.
  - Composer toolbar becomes two stable rows: icon tools and quick panel buttons, each horizontally scrollable.
  - Tool pane remains a dedicated mobile panel with internal scrolling. Quick replies, skill, history, order, and detail tools get mobile-specific scroll/layout treatment.
  - Order filters/cards are compacted for touch. Account detail tables become card-like rows on mobile.
  - Link/image preview panels occupy the available phone viewport so close/actions stay reachable.

Verified:

- `npm run check` passed.
- Chrome headless at `390x844` checked `list`, `chat`, and `tool` panels.
- Measurements:
  - `documentElement.scrollWidth=390`
  - `body.scrollWidth=390`
  - visible mobile panels match viewport width.
- QA screenshots saved under `reports/_uicheck/` and intentionally left untracked.

Notes:

- `client-layout.scrollWidth` may report `406` during measurement because hidden absolute panels keep the existing slide transition offset. The document/body do not overflow, so the phone viewport is not widened.
- Future mobile changes should respect the single-panel flow controlled by `workbenchView[data-mobile-panel="list|chat|tool"]`.

## 2026-07-06 Handoff: Mobile Message Bubble Fix

Issue:

- On phones, short incoming customer messages could render as one Chinese character per line.
- Message avatars could appear visually detached from their text bubbles.
- Chat bubble text looked oversized on mobile because it inherited the browser/body default.

Root cause:

- The previous mobile hardening layer used `.message { width: fit-content; }`. In a grid, short CJK text can collapse to its min-content width, which is effectively one character.
- `.contact-avatar` is shared with the conversation list and carries `grid-area: avatar`; inside chat message grids this needed an explicit override.

Changed:

- In `public/styles.css`, mobile `.message` now spans the message list width. The bubble controls its own width with `width: max-content`, `min-width`, and `max-width`.
- Mobile incoming/outgoing messages now use fixed 32px avatar columns and a bounded message body width of `min(78vw, 336px)`.
- `.message .contact-avatar, .message .contact-photo` now set `grid-area: auto` and fixed 30px size.
- Mobile `.message-content` now uses a stable 14px font size and 1.5 line-height.
- Rich cards override the text-bubble width behavior so link/miniprogram/file cards remain responsive.

Verified:

- `npm run check` passed.
- Chrome headless at `390x844` with fixture messages:
  - `documentElement.scrollWidth=390`
  - `body.scrollWidth=390`
  - short messages (`提现`, `好的`) stayed horizontal, about `45x39`.
  - avatar top was within 2px of the bubble top.
- QA screenshot: `reports/_uicheck/mobile-message-fit-390x844.png` (left untracked).

## 2026-07-06 Handoff: Empty Conversation List Desktop Height Fix

Issue:

- When the left conversation list is empty, desktop workbench panels stopped above the viewport bottom and exposed a large pale blank area under the composer.
- When the list contained conversations, the issue was mostly hidden because list content stretched the implicit grid row.

Root cause:

- `.client-layout` defined only columns. Its implicit grid row used `auto`, so empty/short content let the row shrink.

Changed:

- `public/styles.css`
  - `.client-layout` now has `grid-template-rows: minmax(0, 1fr)` and `align-items: stretch`.
  - The `@media (max-width: 860px)` single-column fallback resets `grid-template-rows: none`.

Verified:

- `npm run check` passed.
- Chrome headless desktop fixture at `1919x927`:
  - Before: layout height `786px`, panes only `559px` tall, ending at y=`605`.
  - After: panes are `786px` tall and end at the viewport bottom y=`832`.
- QA screenshot: `reports/_uicheck/empty-layout-after-1919x927.png` (left untracked).

## 2026-07-05 Handoff: Closed audit open items H1 / M3-M4 / P2-6

Followed up the 2026-07-03 audit. All three open code items are done and verified with disposable end-to-end harnesses (deleted after running). `npm run check` passes.

**H1 — frontend key leak (code half done; USER STILL MUST ROTATE KEYS)**

- Removed the hardcoded sub2/codebuddy keys from `public/app.js` (`DEFAULT_AI_API_KEY` and the codebuddy preset are now `""`).
- `/ai/providers` (`handleAiProvidersConfig`) no longer returns `apiKey`; it returns `hasKey: boolean` per provider. Frontend learns which providers have a server key into `state.aiServerKeyProviders`.
- `proxyAi` + `handleAiModels` inject the key from gitignored `config/ai-providers.json` when the browser sends an empty key, matched by `providerId` (then baseUrl host). `getAiRelayBasePayload()` now sends `providerId`.
- **SECURITY**: when a server key is injected, the provider's own configured `baseUrl`/`authType` are forced — a tampered `baseUrl` (e.g. `providerId=sub2` + `baseUrl=evil.com`) can NOT exfiltrate the key. Verified.
- Frontend AI guards changed from `!state.aiApiKey` to `!hasUsableAiKey()` (typed key OR server has one). 6 sites, both `requestAiRelaySuggestions` copies included.
- `index.html` key field gained placeholder "留空则使用服务端已配置的密钥".
- STILL REQUIRED OF USER: the old keys leaked in the public repo history are still valid — **rotate/regenerate the sub2 (`sub2.sn55.cn`) and codebuddy (`copilot.tencent.com`) keys**, update `config/ai-providers.json`, then verify AI on `:5177` (AI can't be exercised from the dev box).

**M3/M4 — SSRF + open forward proxy (done)**

- New `assertSafeExternalTarget()` resolves the host (DNS included) and blocks loopback/private/link-local/CGNAT/multicast/reserved IPs, incl. `169.254.169.254`. `safeSsrfFetch()` follows redirects manually and re-checks every hop (no 30x bounce to internal). Wired into `handleMediaProxy` + `handleLinkPreview`.
- Allowlist `MEDIA_PROXY_ALLOW_HOSTS` = backend host from `DEFAULT_API_BASE` + env `YOUCHAT_MEDIA_ALLOW_HOSTS`, so backend-served media still works. Real chat media is on public CDNs (qiniu/wx.qlogo/yzimage/alicdn/pddpic), confirmed from the capture log, so blocking private IPs doesn't regress display.
- `/api?__target=` restricted: `getTargetBase()` only honors `__target` whose host is in `API_TARGET_ALLOW_HOSTS` (`DEFAULT_API_BASE` host + env `YOUCHAT_ALLOWED_API_HOSTS`); otherwise falls back to `DEFAULT_API_BASE`. Verified the frontend only ever sends `state.apiBase`, so this is safe. If you deploy a non-default backend, add its host via env.

**P2-6 — dead CSS (done, narrowly)**

- Removed only the orphaned login-illustration internals (`.platform`, `.chat-rail*`, `.bubble*`, `.document-card*`, `.cube*` — 172 lines) whose DOM was replaced by a single `<img src="/assets/login_img.png">`. Confirmed zero references in HTML/JS. Kept `.login-illustration`, `.login-illustration img`, `.login-card`. `applyAiSuggestion`/`sendAiSuggestion` left untouched (still bound).

## 2026-07-06 Handoff: Desktop Chat Bubble/Layout Fix

Issue:

- Desktop chat messages could render incorrectly after the mobile message work:
  - short incoming Chinese text such as `我同意XV` could collapse into one character per line;
  - some message avatars looked detached from their bubbles.

Root cause:

- `width: fit-content` on `.message-content` is unsafe inside the current grid/flex message structure because it can collapse CJK text to min-content width.
- `.contact-avatar` is shared by contact cards and chat messages. Contact-card grid placement must be overridden inside `.message`.
- The desktop base layer needed explicit row/body sizing instead of relying on mobile overrides.

Changed:

- `public/styles.css`
  - `.message` now uses `width: min(680px, 82%)` plus `max-width: 100%`.
  - `.message.is-compact` now explicitly uses `width: 100%`.
  - `.message .contact-avatar, .message .contact-photo` reset `grid-area: auto`, keep fixed size, and align from the top.
  - `.message-body` has `max-width: 100%`; outgoing/AI bodies right-align in the base layer.
  - `.message-content` uses `box-sizing: border-box`, `width: max-content`, `min-width: min(3.2em, 100%)`, `max-width: 100%`, `overflow-wrap: anywhere`, and `word-break: normal`.
  - Rich card messages override text-bubble width behavior with `width:auto; min-width:0; max-width:100%`.

Verified:

- `npm run check` passed.
- Chrome headless desktop fixture at `1366x768`:
  - `我同意XV` bubble measured about `68x45`, not vertical.
  - incoming avatar stayed on the left track; outgoing avatar stayed on the right track.
  - order number and long-link messages kept sane widths.
- Chrome headless mobile fixture at `390x844` still rendered messages without one-character columns or composer displacement.
- QA screenshots:
  - `reports/_uicheck/message-layout-desktop-after.png`
  - `reports/_uicheck/message-layout-mobile.png`

Do not regress:

- Do not change `.message-content` back to `fit-content`.
- Keep the `.message .contact-avatar { grid-area: auto; }` scoped override.
- Put phone-only sizing under the `max-width: 760px` media layer instead of moving it into the desktop base rules.

## 2026-07-06 Handoff: Contact Context Menu Boundary Fix

Issue:

- Right-clicking a conversation near the bottom of the left list opened the context menu downward, so it was visually clipped/covered by the bottom `当前 / 留言 / 历史` tabs.
- The long current-conversation menu was most affected.

Changed:

- `public/app.js`
  - `renderContextMenu()` now appends the menu hidden, then calls `positionContextMenu(menu)`.
  - `positionContextMenu()` measures the menu and constrains it to both viewport bounds and the visible `#contactList` rectangle.
  - If there is not enough room below the cursor and there is more space above, the menu flips upward (`data-placement="top"`).
  - If the menu is too tall for the available area, it gets `maxHeight` and internal vertical scrolling.
  - Left position clamps to the viewport right edge.
  - Contact-list scroll and window resize close the context menu to avoid detached menus.
- `public/styles.css`
  - `.context-menu` gets viewport-safe `max-width`, contained overscroll, and thin scrollbar.

Verified:

- `npm run check` passed.
- Chrome headless `1366x768`, 18-contact fixture, right-clicking the last visible item:
  - menu flipped upward with `placement=top`;
  - menu bottom `613`, contact-list bottom `629`, so it did not overlap the bottom tabs;
  - scrolling the contact list closed the menu.
- QA screenshot: `reports/_uicheck/context-menu-bottom-after.png`.

Do not regress:

- Do not position context menus directly from `event.clientY` without post-render measurement.
- If the bottom conversation tabs become sticky/overlay later, keep `#contactList` as the vertical boundary or update the boundary source accordingly.

## 2026-07-06 Handoff: Manual Draft Optimization + Suggestion Tray Redesign

Goal:

- Add an explicit “优化文案” flow for customer-service operators who type a rough reply and want AI to rewrite it into a warmer, patient, easy-to-understand answer.
- When this manual optimization runs, it must replace normal AI/skill recommendations instead of mixing with them.
- Make the floating suggestion tray look like a compact workbench control, not an ad-hoc long strip.

Changed:

- `public/index.html`
  - Added `#optimizeDraft` in the composer shortcut row.
  - Added `#optimizeDraftInline` next to `采用推荐 / 发送`.
- `public/app.js`
  - Added `requestDraftOptimizeFromComposer()`.
  - `optimizeDraftReply(options = {})` now supports manual/forced optimization:
    - validates draft text, AI enabled state, and usable server/local key;
    - replaces current suggestions with a loading `type:"optimize"` item;
    - then replaces that with 1-3 optimize candidates;
    - keeps draft images but optimizes only text;
    - fixed null latest-message handling by using `latest ? getMessageKey(latest, 0) : ""`.
  - Optimize prompt now explicitly asks for warmer, patient, calming, normal-person-readable replies and avoids blaming the customer or adding unverified order/rebate/backend facts.
  - Loading suggestions disable apply/send.
  - `renderAiSuggestionCard()` marks `is-optimize` and `is-loading` states.
- `public/styles.css`
  - Redesigned `.ai-suggestion-card` as a compact tray:
    - left control cluster;
    - right candidate rows;
    - numbered circular index;
    - max 2 text lines per candidate;
    - apply/send buttons on each row.
  - Tray max height is capped at `108px`; multiple candidates scroll internally.
  - Added styles for optimize buttons and disabled `tool-button` state.

Verified:

- `npm run check` passed.
- Desktop fixture `1366x768` with 3 optimize candidates:
  - tray height capped at `108px`;
  - candidates scroll internally;
  - composer remains visible.
  - Screenshot: `reports/_uicheck/ai-suggestion-tray-polished-after.png`.
- Mobile fixture:
  - no horizontal page overflow;
  - tray about `112px`;
  - send row remains horizontally usable.
  - Screenshot: `reports/_uicheck/ai-suggestion-tray-mobile.png`.
- Functional mock:
  - seeded normal suggestion `OLD_SHOULD_GO`;
  - mocked `/ai/chat/completions` to return `A_OPTIMIZED_REPLY/B_OPTIMIZED_REPLY`;
  - after `optimizeDraftReply({ manual:true, force:true })`, `state.aiSuggestions` contained only optimized replies and `hasOld=false`.

Do not regress:

- Manual optimization should replace existing recommendation content.
- Keep optimization text-only; preserve draft images as attachments.
- Do not let the suggestion tray grow into a large panel. Use internal scrolling for multiple candidates.

## 2026-07-06 Handoff: Suggestion Tray Visual Cleanup Pass

User complaint:

- The floating AI/skill suggestion tray still looked ugly and assembled, closer to a long stuffed pill than a polished workbench control.
- The user explicitly preferred something closer to Codex task guidance: compact, readable, not pushing the input box down, and not visually blocking the chat.

Important constraint:

- Do not restore the older absolute-positioning implementation. Project memory already documents that `ResizeObserver + --composer-height` caused composer/tool/image-tray collisions.
- Keep `#aiSuggestionCard` as the independent grid row between `#messageList` and `footer.composer`.

Changed:

- `public/app.js`
  - `renderAiSuggestionCard()` now toggles `is-single` and `is-multiple`.
  - Candidate markup now wraps text in `.ai-suggestion-copy`.
  - The candidate index changed from `1.` text to a clean circular `1`.
- `public/styles.css`
  - The tray is now centered with `width: fit-content`, constrained by chat width instead of stretching as a full long strip.
  - Max tray height is reduced to `112px`; single candidate height is capped at `88px`.
  - Candidate rows are 30px-class compact rows with number, text, and row-level apply/send buttons.
  - Left controls are vertically centered to remove the empty lower-left patch.
  - Desktop/tablet/mobile breakpoints were tightened.
  - Added reduced-motion fallback for tray entrance/loading animations.

Verified:

- `npm run check` passed.
- Chrome headless with local Chrome:
  - Desktop `1440x860`: tray `724x112`, composer remains stable, no horizontal overflow.
  - Mobile `390x780`: tray `362x112`, composer remains stable, no horizontal overflow.
- Screenshots:
  - `reports/_uicheck/ai-suggestion-tray-redesign-desktop-v2.png`
  - `reports/_uicheck/ai-suggestion-tray-redesign-mobile-v2.png`

Do not regress:

- Do not make the suggestion tray a large panel.
- Do not move it into the composer.
- Do not switch it back to absolute positioning.
- Preserve row-level apply/send buttons for each candidate.

## 2026-07-06 Handoff: Long Skill Copy Tray Clamp

User complaint:

- Real skill replies are much longer than the earlier fixture. With `width: fit-content`, the first candidate stretched into a very long horizontal strip and the apply/send buttons drifted far to the right.

Changed:

- `public/styles.css`
  - `.ai-suggestion-card` no longer uses content-driven width. It is capped at `min(920px, calc(100% - 28px))`.
  - Left control rail is fixed at `176px` so `换一换` does not wrap.
  - Candidate rows use `width: 100%` and `minmax(0, 1fr)` so long copy wraps inside the tray.
  - Active candidate shows up to 2 lines; inactive candidates preview 1 line.
  - Refresh button has `white-space: nowrap`.

Verified:

- `npm run check` passed.
- Chrome headless wide fixture `1802x564`:
  - tray `920x96`, centered;
  - first candidate `682x42`;
  - no horizontal overflow.
- Screenshots:
  - `reports/_uicheck/ai-suggestion-tray-long-desktop-v4.png`
  - `reports/_uicheck/ai-suggestion-tray-long-mobile-v3.png`

Do not regress:

- Do not use `width: fit-content` for the tray or candidate rows when rendering real skill copy.
- Keep long skill replies clamped inside the candidate row. Do not expand all steps horizontally.

## 2026-07-06 Handoff: Translucent Suggestion Tray

User request:

- Make the suggestion bubble semi-transparent so it feels lighter and does not visually block the chat area as much.

Changed:

- `public/styles.css`
  - Outer tray uses semi-transparent blue-white background, about `rgba(247, 251, 255, 0.62)`.
  - Added purposeful `backdrop-filter: blur(8px) saturate(145%)` for a softer translucent material.
  - Header pill, refresh button, and candidate rows use lower-alpha backgrounds.
  - Active candidate remains more solid, about `rgba(255, 255, 255, 0.86)`, to keep copy readable.
  - Hover/focus-within makes the tray more solid for accurate apply/send actions.
  - Added state-specific hover/focus rules for `is-optimize` and `is-no-reply`.

Verified:

- `npm run check` passed.
- Chrome headless wide long-copy fixture:
  - tray remains `920x96`;
  - no horizontal overflow;
  - computed tray background `rgba(247, 251, 255, 0.62)`;
  - active candidate text remains readable.
- Screenshot:
  - `reports/_uicheck/ai-suggestion-tray-translucent-v1.png`

Do not regress:

- Do not set opacity on the entire tray because it fades text and buttons too.
- Use translucent backgrounds while keeping text/button opacity intact.

## 2026-07-07 Handoff: Preserve Composer Newlines on Send

User issue:

- Multi-line product copy pasted into the chat composer, such as JD title, separators, price lines, and purchase URL, was sent/displayed as one stacked paragraph instead of preserving line breaks.

Root cause:

- Browser `contenteditable` paste often creates multiple block nodes (`div`, `p`, etc.).
- Existing `extractTextFromNode()` and `parseComposerBlocks()` recursively read block contents without adding `\n` at block boundaries.
- Message rendering already supports `white-space: pre-wrap`, so the main loss was before send.

Changed:

- `public/app.js`
  - Added `normalizeComposerText(text)`.
  - Added `isComposerBlockElement(node)`.
  - Added `appendComposerLineBreak(text)`.
  - `getReplyTextContent()` now normalizes extracted composer text.
  - `extractTextFromNode()` inserts newline boundaries around block elements.
  - `parseComposerBlocks()` inserts newline boundaries around block elements before submitting text blocks to `/ChatContent/SendMsg`.

Verified:

- `npm run check` passed.
- Chrome headless injected the JD sample as multiple `<div>` lines:
  - `getReplyTextContent()` preserved `\n`.
  - `parseComposerBlocks().blocks[0].content` preserved `\n`.
  - plain text-node newline input also preserved `\n`.

Do not regress:

- Do not collapse composer text with `replace(/\s+/g, " ")` before sending.
- If adding paste sanitization later, keep block-level line boundaries as `\n`.

## 2026-07-07 Handoff: Editable Right-Side User Info

User request:

- Match the original client behavior for editing right-side user information:
  - membership type;
  - member tags;
  - balance;
  - integral;
  - remark;
  - normal tags.
- Use real YouChat APIs, not fake local state. Make the edit buttons cleaner.

Changed:

- `public/app.js`
  - Added `state.userTypeOptions` and `state.memberTagOptions`.
  - Added edit modal helpers around `getUserEditContext()` and `refreshUserInfoAfterMutation()`.
  - Added real user type flow:
    - read `/Contact/GetUserTypeList`;
    - render searchable, scrollable radio picker;
    - save through `/Contact/UpdateUserType`;
    - use only one highlighted option when duplicate display names exist.
  - Added balance/integral flow:
    - modal shows current balance/integral;
    - inputs are signed adjustment values;
    - save through `/Contact/UpdateIntegralAndBalance` with required `argument`.
  - Added remark/normal tag flow via `/Contact/UpdateContactInfo`.
  - Added member tag flow:
    - read `/Contact/GetMemberTags`;
    - grouped checkbox editor;
    - save through `/Contact/UpdateUserMemberTags` with `syncUserFlag` and JSON `sysTagList`.
  - Added `normalizeUserTagList()`, `getUserMemberTagList()`, `getUserNormalTagList()`.
  - Added `kvEditable()` and `handleToolClick()` actions for six edit buttons.
- `public/styles.css`
  - Added `.tool-modal-user-edit`.
  - Replaced right-info edit glyph with stable `✎` instead of the flaky `bfi-edit` icon.
  - Added styles for user type picker, amount adjustment rows, tag chips, and member tag groups.

Source endpoints:

- `C:\Program Files\youchat-desktop\bin\YouChatService.xml`
  - `/Contact/GetUserTypeList`
  - `/Contact/UpdateUserType`
  - `/Contact/GetMemberTags`
  - `/Contact/UpdateUserMemberTags`
  - `/Contact/UpdateContactInfo`
  - `/Contact/UpdateIntegralAndBalance`

Verified:

- `npm run check` passed.
- Browser smoke against `http://127.0.0.1:5177/` using the remembered account:
  - backend `http://192.168.9.83:18080/api`;
  - right-side user info has 6 edit buttons;
  - user type modal loaded 17 real options;
  - user type picker had 1 checked option and 1 selected visual class even with duplicate `会员` display names;
  - balance/integral modals showed 2 current-value chips.
- Did not click confirm/save in QA to avoid mutating real customer data.
- Screenshots:
  - `reports/_uicheck/user-info-edit-smoke-v2.png`
  - `reports/_uicheck/user-type-edit-modal-v1.png`

Do not regress:

- Balance/integral values are deltas, not absolute totals.
- Do not fake successful saves; show real API errors.
- If endpoint behavior changes, re-check `YouChatService.xml` and HAR/client requests before changing request shapes.

## 2026-07-08 Handoff: FnOS Service Online But YouChat Logged Out

User report:

- “服务端离线了好像.”

Diagnosis:

- Web client was online:
  - `http://192.168.9.83:5177/health` returned OK.
- Backend HTTP and database were online:
  - `npm run fnos:health` passed;
  - `databaseType=0 (mysql)`;
  - `totalContacts=8212`;
  - `historyContacts≈5875`.
- Business login was offline:
  - `POST /api/System/GetAccountInfo` initially returned `realName=null`, `userId=0`;
  - `POST /api/Summary/LogIn` returned `success=false`, `message=悠聊未登录`;
  - `POST /api/System/LogIn` timed out.
- Root cause:
  - `youchat-autologin` log showed `Automatic login is paused by the logout API.`
  - pause marker existed at `/vol1/1000/Docker/youchat/docker-control/autologin.pause` with content `manual logout`.
  - `youchat-control` logs showed repeated `POST /api/logout`.

Recovery performed:

```sh
rm -f /vol1/1000/Docker/youchat/docker-control/autologin.pause
echo '<sudo_password>' | sudo -S docker restart youchat-autologin
```

Verified after recovery:

- `POST /api/System/GetAccountInfo` returned:
  - `realName=Boom`;
  - `userId=1556504756803862529`.
- `POST /api/Summary/LogIn` returned:
  - `success=true`;
  - `message=登录成功`.
- `npm run fnos:health` passed after recovery:
  - MySQL mode;
  - total contacts `8212`;
  - history contacts `5875`;
  - guestbook contacts `1`.
- Pause marker check returned `NOT_PAUSED`.
- Containers:
  - `youchat-service` Up on `18080 -> 8080`;
  - `youchat-mysql` Up healthy;
  - `youchat-autologin` Up;
  - `youchat-dev-web` Up healthy.

Do not regress:

- When `GetOptions` and contact/history counts work but `GetAccountInfo.userId=0`, do not treat it as SQLite/database corruption. Check `docker-control/autologin.pause` first.
- `POST /api/System/CheckLoginStatus` still timed out after recovery; previous notes already say this endpoint can be unreliable. Do not use it as the main online-status probe.

## 2026-07-09 Handoff: Web Client Must Register Online Through Node SignalR Bridge

User report:

- Official Windows client online: incoming messages are routed into `当前`.
- Only Web client open: incoming messages land in `留言`.
- Interpretation: Web was reading real APIs but was not reliably registered as an online customer-service client for YouChat routing.

Key implementation:

- `server.js`
  - Added `POST /local/signalr/online`.
    - Reads `{ apiBase, accountId }`.
    - Tries `getApiBaseCandidates(apiBase)` so Docker can use `host.docker.internal` when needed.
    - Calls `ensureServerSignalRConnection(candidateBase, accountId)`.
    - That starts `/chathub?mode=client&userName=<accountId>` and invokes `RegisterUser(accountId, false, false, 0)`.
    - Responds with `source=node-signalr-online`, `resolvedApiBase`, `hubUrl`, `state`, and failed attempts.
  - Added `POST /local/signalr/offline`.
    - Invokes `UnRegisterUser(accountId)`.
    - Stops and removes the cached Node SignalR connection.
- `public/app.js`
  - Added server SignalR state fields:
    - `serverSignalRConnecting`
    - `serverSignalRStatus`
    - `serverSignalRKey`
    - `serverSignalRLastRegisteredAt`
    - `serverSignalRResolvedApiBase`
  - Added:
    - `ensureServerSignalROnline()`
    - `keepServerSignalROnline()`
    - `stopServerSignalROnline()`
  - `connect()` now waits for `keepServerSignalROnline({ force: true })` after `ensureContactListAccountId()`.
  - `startAutoRefresh()` calls `keepServerSignalROnline()` before polling contacts/messages; throttle is `SERVER_SIGNALR_ONLINE_REFRESH_MS = 60000`.
  - pause/resume:
    - resume calls `keepServerSignalROnline({ force: true })`;
    - pause/logout route through `stopSignalRConnection()`, which now calls `/local/signalr/offline`.

Verified locally:

- `npm run check` passed.
- Temporary current-code server:

```powershell
$env:PORT='5199'; node server.js
```

- `POST http://127.0.0.1:5199/local/signalr/online` with:

```json
{"apiBase":"http://192.168.9.83:18080/api","accountId":"2"}
```

- Returned:
  - `success=true`
  - `source=node-signalr-online`
  - `resolvedApiBase=http://192.168.9.83:18080/api`
  - `hubUrl=http://192.168.9.83:18080/chathub?mode=client&userName=2`
  - `state=Connected`
- `/local/signalr/offline` returned `success=true` with `state=closed`.

Do not regress:

- The hub registration account is the short contact-list account id (`2` for `Boom666`), not merchant long user id `1556504756803862529`.
- Do not “fix”留言/current routing by locally moving records between tabs; routing must be solved by real online registration and, if needed, any additional official-client distribution endpoint.
- Browser SignalR is intentionally not the primary path for HTTPS public pages; Node bridge must remain first-class for Docker/Lucky deployments.

## 2026-07-09 Handoff: Two fnOS Web Targets Must Deploy Together

User added a second independent Docker backend and Web client. Future Web updates should deploy to both Web stacks.

Current target inventory:

- Primary:
  - Web URL: `http://192.168.9.83:5177`
  - Web container/project: `youchat-dev-web` / `youchat-dev-web`
  - Web dir: `/vol1/1000/Docker/youchat-dev-web`
  - Backend API: `http://192.168.9.83:18080/api`
  - Backend service/project: `youchat-service` / `youliaoapp`
  - Backend dir mounted into Web: `/vol1/1000/Docker/youchat`
- Secondary:
  - Web URL: `http://192.168.9.83:5178`
  - Web container/project: `youchat-dev-web-2` / `youchat-dev-web-2`
  - Web dir: `/vol1/1000/Docker/youchat-dev-web-2`
  - Backend API: `http://192.168.9.83:18082/api`
  - Backend service/project: `youchat-service-2` / `youchat-2`
  - Backend dir mounted into Web: `/vol1/1000/Docker/youchat-2`
  - Control API host port: `18083`
  - Database: independent MySQL database `youchat2`, not the primary database.

Files added/changed for multi-target deploy:

- `deploy/fnos-web-targets.json`
  - Defines `primary` and `secondary` Web targets.
  - Contains only non-secret paths, ports, API bases, and env overrides.
- `scripts/deploy-fnos-web-all.py`
  - Reads the targets file.
  - Runs `scripts/deploy-fnos-web.py` once per target.
  - Verifies each target health URL and expected `apiBase`.
- `scripts/deploy-fnos-web.py`
  - Now supports `FNOS_WEB_ENV_OVERRIDES_JSON`.
  - Writes target-specific values into remote `.env` before `docker compose up`.
- `compose.yaml` and `compose.registry.yaml`
  - `container_name` is now `${WEB_CONTAINER_NAME:-youchat-dev-web}`.
  - This is required because secondary must be `youchat-dev-web-2`; a hardcoded name conflicts with primary.

Deploy both Web targets:

```powershell
cd C:\youchat-dev-web
$env:FNOS_PASSWORD = "..."
$env:FNOS_SUDO_PASSWORD = "..."
python .\scripts\deploy-fnos-web-all.py
```

Verification performed:

- `npm run check` passed.
- `python -m py_compile .\scripts\deploy-fnos-web.py .\scripts\deploy-fnos-web-all.py` passed.
- `scripts/deploy-fnos-web-all.py` deployed both:
  - `5177` health OK, `apiBase=http://host.docker.internal:18080/api`.
  - `5178` health OK, `apiBase=http://host.docker.internal:18082/api`.
- Secondary Web initially lacked `/local/signalr/online`; after deploying both, secondary online bridge works:
  - `POST http://192.168.9.83:5178/local/signalr/online`
  - payload `{"apiBase":"http://192.168.9.83:18082/api","accountId":"2"}`
  - returned `success=true`, `state=Connected`, `resolvedApiBase=http://host.docker.internal:18082/api`.
  - `/local/signalr/offline` returned `success=true`.
- Secondary backend health:
  - MySQL mode (`databaseType=0`);
  - `totalContacts=6`;
  - `historyContacts=0`;
  - `currentAccount2=3`.

Important:

- Secondary history count is low because it is a new database. Its guard threshold is intentionally `YOUCHAT_DATABASE_GUARD_MIN_HISTORY_COUNT=0`.
- Do not deploy only `5177` unless the user explicitly asks for a single target. Default should be `deploy-fnos-web-all.py`.
- Do not mix primary and secondary service directories or API ports. Primary uses `18080` + `/vol1/1000/Docker/youchat`; secondary uses `18082` + `/vol1/1000/Docker/youchat-2`.

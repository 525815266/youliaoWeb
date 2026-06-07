# 悠聊 Web 二开项目记忆

> 本文档给项目负责人和开发者阅读。后续每次做了有意义的功能、接口、UI、状态逻辑、部署或验证改动，都必须同步更新本文档和 `AI_HANDOFF.md`，避免后续接手时丢失关键上下文。

## 目录

1. [项目目标](#1-项目目标)
2. [当前架构](#2-当前架构)
3. [启动与验证](#3-启动与验证)
4. [真实接口原则](#4-真实接口原则)
5. [会话列表与账号口径](#5-会话列表与账号口径)
6. [聊天区与历史消息](#6-聊天区与历史消息)
7. [右侧工具栏](#7-右侧工具栏)
8. [快捷回复、Skill 与 AI](#8-快捷回复skill-与-ai)
9. [图片与输入框](#9-图片与输入框)
10. [好友请求与会话操作](#10-好友请求与会话操作)
11. [UI 设计规则](#11-ui-设计规则)
12. [本次关键修复](#12-本次关键修复)
13. [已知风险与后续方向](#13-已知风险与后续方向)
14. [文档维护规则](#14-文档维护规则)
15. [2026-06-07 AI 推荐条二次修复](#15-2026-06-07-ai-推荐条二次修复)
16. [2026-06-07 好友请求全部来源修复](#16-2026-06-07-好友请求全部来源修复)
17. [2026-06-07 历史会话悬停接入](#17-2026-06-07-历史会话悬停接入)
18. [2026-06-07 原生图标与会话滚动修复](#18-2026-06-07-原生图标与会话滚动修复)
19. [2026-06-07 可迁移补丁体系](#19-2026-06-07-可迁移补丁体系)
20. [2026-06-07 客户端审计对比工具](#20-2026-06-07-客户端审计对比工具)
21. [2026-06-07 skill 优化、AI 换一换与 DeepSeek 兼容](#21-2026-06-07-skill-优化ai-换一换与-deepseek-兼容)
22. [2026-06-07 收敛审计与遗留项清单](#22-2026-06-07-收敛审计与遗留项清单)
23. [2026-06-07 AI 推荐条胶囊化 UI 修复](#23-2026-06-07-ai-推荐条胶囊化-ui-修复)
24. [2026-06-07 项目迁出 tmp 目录](#24-2026-06-07-项目迁出-tmp-目录)
25. [2026-06-07 图片预览和七牛上传修复](#25-2026-06-07-图片预览和七牛上传修复)
26. [2026-06-07 聊天区反复跳动与输入区稳定修复](#26-2026-06-07-聊天区反复跳动与输入区稳定修复)
27. [2026-06-07 长链接卡片与网页视频浮层预览](#27-2026-06-07-长链接卡片与网页视频浮层预览)
28. [2026-06-08 历史计数来源与输入区位置修复](#28-2026-06-08-历史计数来源与输入区位置修复)

## 1. 项目目标

本项目的目标是把悠聊 Windows Electron 客户端逐步二次开发成可运行、可扩展的 Web 客服工作台。

当前阶段不是做演示假页面，而是尽可能复刻原客户端的真实客服能力：登录、会话列表、聊天记录、右侧用户信息、订单、流水明细、快捷回复、好友请求、会话关闭/接入、图片发送和 AI 辅助回复。

长期方向是：

- 服务端与数据库尽量 Docker 化，减少必须挂 Windows 机器的依赖。
- Web 前端承载客服操作界面，支持多人协同、远程办公和二次开发。
- 接入 AI 大模型、快捷回复和 skill 知识库，提高客服回复效率。
- 所有可查询的信息优先走悠聊真实接口或真实数据库，不用假用户、假编号、假订单。

## 2. 当前架构

主项目目录：

`C:\youchat-dev-web`

历史说明：

- 早期临时开发目录曾是 `C:\tmp\youchat-dev-web`。
- 2026-06-07 已迁移到固定目录 `C:\youchat-dev-web`。
- 后续文档、脚本、补丁和抓包都以 `C:\youchat-dev-web` 为准。
- 旧 `C:\tmp\youchat-dev-web` 暂时只作为备份，不再作为工作目录。

原 Electron 客户端参考目录：

`C:\Program Files\youchat-desktop`

核心文件：

- `public/index.html`：静态页面骨架，包含登录页、工作台、聊天区、右侧工具栏、AI 设置弹层。
- `public/app.js`：主前端逻辑，包含状态、接口封装、渲染、会话、消息、工具栏、AI、skill、图片发送。
- `public/styles.css`：全部 UI 样式，蓝白紧凑客服工作台风格。
- `server.js`：本地 Node 服务，提供静态资源、悠聊 API 代理、AI 中转、OSS 上传代理、本地 skill 读写接口。
- `data/reply-skills.json`：本地 skill 知识库和自动学习结果持久化文件。
- `logs/api-capture.ndjson`：所有 `/api/*` 代理请求和响应的抓取日志。
- `capture-client-proxy.js`、`start-client-capture-proxy.ps1`、`watch-api-capture.ps1`：辅助抓包与查看接口日志。

当前开发服务：

`http://localhost:5177`

## 3. 启动与验证

启动：

```powershell
cd C:\youchat-dev-web
npm run dev
```

语法检查：

```powershell
npm run check
```

接口健康检查：

```powershell
Invoke-WebRequest http://localhost:5177/health
```

静态资源检查：

```powershell
Invoke-WebRequest http://localhost:5177/app.js
Invoke-WebRequest http://localhost:5177/styles.css
```

当前已验证过：

- `npm run check` 通过。
- `/health`、`/app.js`、`/styles.css` 之前已通过访问验证。
- Playwright 当前未安装，不能依赖它做截图验证。

## 4. 真实接口原则

用户明确要求：不要假数据。

前端所有数据都应来自真实悠聊接口、本地真实抓包或本地真实持久化文件。接口失败时应显示真实失败原因、空状态和抓包日志入口，不能把预览数据当真实数据展示给业务使用。

本地代理规则：

- 前端请求 `api("/xxx", data)`。
- 实际走 `server.js` 的 `/api/xxx?__target=真实APIBase`。
- `server.js` 会把请求和响应写入 `logs/api-capture.ndjson`。
- AI 请求走 `/ai/chat/completions`，再由 `server.js` 转发到 OpenAI 兼容中转站。

关键真实接口：

- `/System/GetOptions`
- `/System/LogIn`
- `/Senstive/GetAccountList`
- `/Contact/GetContactList`
- `/ChatContent/GetList`
- `/ChatContent/GetChatContentList`
- `/ChatContent/ConsumeMessage`
- `/ChatContent/SendMsg`
- `/Faq/GetPageList`
- `/Faq/GetTypeList`
- `/Order/GetPageList`
- `/Order/GetAccDetailPageList`
- `/Contact/GetNewFirend`
- `/Contact/NewFirendAccept`
- `/Contact/NewFirendIgnor`
- `/Conversation/ShutDown`
- `/Conversation/ShutDownAll`
- `/Conversation/AccessInAll`
- `/Conversation/TransferToAI`

## 5. 会话列表与账号口径

会话列表分三个页签：

- 当前
- 留言
- 历史

重要口径：

当前会话列表不能用全局商户号、登录名或旧 localStorage 里的错误 accountId。当前列表必须先通过 `GET /Senstive/GetAccountList` 找到当前客服账号，并使用该账号对象的 `id` 作为 `/Contact/GetContactList` 的 `accountId`。

已知真实返回示例：

- 登录账号：`Boom666`
- 客服昵称：`客服-王`
- 当前会话列表应使用：`id: 2`
- 返回里的长 `accountId: 1556504756803862529` 不是当前会话列表的筛选 ID。

如果当前页签显示类似 `8018` 这种全局数量，通常说明 accountId 口径错了。已在 `public/app.js` 中增加 `accountIdResolved`，强制优先用 `/Senstive/GetAccountList` 校验后的 `id`，并避免旧缓存污染当前列表。

会话排序：

- 普通会话按最后回复/最后消息时间排序。
- 待办/置顶会话需要特殊显示，并允许排在上面。
- 清空列表后，Web 端会本地归档到历史缓存，并临时过滤刚清空的联系人，避免自动刷新马上把列表弹回来。

## 6. 聊天区与历史消息

中间聊天区：

- 用户名和消息内容分行显示。
- 最新消息应显示在底部，符合常见聊天习惯。
- 顶部有“加载更多”入口，用于加载更早历史。
- 自动刷新时，如果客服不在底部，不应强行把滚动条跳回底部。
- 点击带未读红点的会话时，需要清除小数字，并同步 `/ChatContent/ConsumeMessage`。

右侧工具栏的聊天记录：

- 属于同一联系人的历史记录浏览。
- 最新消息应在底部。
- 向上滚动应动态加载更早历史。
- 不应轻易显示“没有更多”，除非接口分页确实无更多数据。

消息分类：

- 客户消息：需要 AI/skill 判断是否要回复。
- 客服消息：用于学习人工回复。
- 系统提示：只给客服看，不是真正发给客户的消息，不能当作客户消息自动回复。
- 提现成功、到账提醒等通知类消息：通常不需要回复，应归入 no-reply skill。

## 7. 右侧工具栏

右侧工具栏当前包含：

- 用户
- 快捷回复
- skill 回复
- 订单
- 明细
- 聊天记录

用户要求：

- 切换左侧联系人时，右侧保持当前工具栏页签。例如已经在“聊天记录”，点击下一个人后仍停留在“聊天记录”。
- 右侧蓝色真实字段可点击复制。
- 用户信息不能截断关键信息，备注要显示出来。
- 订单按平台展示，蓝色订单号/关键编号可点击复制。
- 明细实际是账户流水明细，不是普通用户资料。

相关函数：

- `renderToolContent`
- `setToolTab`
- `loadToolDataForActiveTab`
- `renderQuickReplyPanel`
- `renderSkillReplyPanel`
- `renderOrderPanel`
- `renderAccountDetails`
- `renderHistoryPanel`

## 8. 快捷回复、Skill 与 AI

快捷回复：

- 应从 `/Faq/GetPageList`、`/Faq/GetTypeList` 拉真实数据库数据。
- UI 应接近原客户端，有“发送”和“编辑”按钮。
- 快捷回复内容会作为 AI 推荐上下文的一部分。

Skill 回复：

- 本地文件：`data/reply-skills.json`
- 本地接口：
  - `GET /local/reply-skills`
  - `POST /local/reply-skills`
  - `POST /local/reply-skills/learn`
- skill 可包含关键词、样例、优先级、多步骤回复、图片、是否允许自动回复、是否 no-reply。
- 典型场景：订单查不到、红包导致无返利、返回直播间下单、绑定支付宝失败、提现成功无需回复。

AI 设置：

- 默认 API 端点：`https://sub2.sn55.cn/`
- 默认模型：`gpt-5.4-mini`
- API 密钥已写在前端默认配置和本地设置中。
- 设置通过 localStorage 持久化。
- 右上角齿轮可开关 AI 推荐、skill 自动回复、自动学习。
- 设置弹窗支持供应商预设：
  - `sub2 中转`：填入 `https://sub2.sn55.cn/` 和 `gpt-5.4-mini`。
  - `DeepSeek`：填入 `https://api.deepseek.com` 和 `deepseek-v4-flash`，密钥需要用户自己的 DeepSeek API Key。

AI 推荐逻辑：

- AI 推荐现在默认自动开启，只要设置中没有关闭、API key 存在、有真实客户上下文，就会在切换会话或拉到新消息后自动生成候选。
- 自动推荐会先匹配 skill；未命中时才请求 AI 中转。
- 自动推荐用最新客户消息生成 key 去重，避免 10 秒自动刷新反复请求。
- 发送框上方展示 1 到 3 条横条候选，每条有“采用”和“发送”，推荐条左侧提供“换一换”。
- “换一换”会基于原推荐和真实上下文重新生成不同语气/说法，语气池包含自然安抚、简短直接、耐心解释、轻柔口语。
- 如果客服不采用 AI 推荐，而是自己发送文字或图片，会触发自动学习。
- 同类人工回复命中超过一定次数后，可提升 skill 优先级并允许自动回复。
- Skill 回复列表和当前命中 skill 卡片都提供“优化”按钮。优化会结合当前 skill 话术、客服输入框中的补充文字、草稿图片数量和最近聊天上下文生成 1 到 3 条候选。

## 9. 图片与输入框

输入区支持：

- 粘贴图片。
- 拖拽图片。
- 点击图片按钮选择图片。
- 图片和文字可同时在输入框区域准备，但发送时仍按接口能力分开发送。
- AI 只优化文字，不优化图片。
- 采用文字优化候选时，应保留原图。

图片发送相关函数：

- `handleReplyPaste`
- `handleReplyDrop`
- `sendText`
- `sendImageFile`
- `sendChatContent`
- `uploadImage`
- `uploadImageViaLocalProxy`

## 10. 好友请求与会话操作

好友请求：

- 左上工具按钮进入好友请求弹层。
- 使用 `/Contact/GetNewFirend` 拉取。
- 支持状态、来源、机器人、关键词筛选。
- 通过和忽略走 `/Contact/NewFirendAccept`、`/Contact/NewFirendIgnor`。

会话列表操作：

- 右键菜单需要区分当前、留言、待办等状态。
- 留言列表存在“全部接入”等操作。
- 当前列表支持关闭、解除、解除全部、清空列表、全部已读等。
- 鼠标悬停会话显示快捷按钮，例如接入、关闭。
- 选中会话后键盘上下键可切换会话。
- 从左侧点击切换会话后，主聊天区默认必须落在最新消息底部。
- 只有消息 DOM 里存在真实红点锚点 `[data-red-point="true"]` 时，才允许跳到红点消息；不能把第一条普通客户消息当未读锚点。

清空列表：

- 原客户端清空后当前列表会真的空掉，并进入历史。
- Web 端已实现本地归档和刷新过滤，避免接口刷新后马上重新出现。

## 11. UI 设计规则

这是高密度客服工具，不是营销页。

设计原则：

- 保留悠聊蓝白识别。
- 紧凑、可扫读、低干扰。
- 不做大卡片看板，不做深色 AI 工具风，不用紫色渐变。
- 工具按钮要像客户端工作台，不能像低保真 demo。
- 输入框和发送按钮必须始终可见，AI 推荐不能把输入框挤走。
- 右侧栏与中间聊天区要稳定，不要自动刷新时闪跳。
- 文字不要溢出、错位或把用户名和消息挤在一行。

## 12. 本次关键修复

本次任务新增了两类工作：项目记忆文档，以及 AI 推荐/当前数量/UI 的修复。

文档：

- 新增 `PROJECT_MEMORY.md`：给人读的完整项目记忆。
- 新增 `AI_HANDOFF.md`：给后续 AI 快速接手的路径和函数索引。

AI 推荐：

- AI 推荐不再必须手动点击才生成。
- 在切换会话和加载/刷新消息后，会自动尝试生成推荐。
- 自动推荐先走 skill，没命中才走 AI 中转。
- 同一联系人同一条最新客户消息只生成一次，避免自动刷新反复打接口。
- 手动点击“AI 推荐”仍保留，且会显示错误提示；自动推荐静默失败，只写日志。

AI 推荐 UI：

- 推荐区域从“方块卡片”改成横条清单。
- 左侧固定显示“AI 推荐 / 文字优化 / skill 回复”和关闭按钮。
- 右侧动态显示 1 到 3 条候选：
  - `1. 文案  采用  发送`
  - `2. 文案  采用  发送`
  - `3. 文案  采用  发送`
- 全局“采用/发送”按钮隐藏，仅每条候选自己带操作。
- 推荐区高度控制在较小范围，避免挤掉输入框。

当前列表数量：

- 增加 `accountIdResolved`。
- 当前会话列表优先通过 `/Senstive/GetAccountList` 获取客服账号对象的 `id`。
- 避免旧 localStorage 或登录返回里的长 `accountId` 把当前会话数量带成全局数量。

## 13. 已知风险与后续方向

已知风险：

- 某些 PowerShell 输出会把中文显示成乱码，但源文件本身是 UTF-8；修改时不要按终端乱码内容盲改。
- Playwright 未安装，暂时无法自动截图验证 UI。
- 部分接口参数仍来自 HAR 和 Electron 参考，后续应继续抓包比对。
- 快捷回复是否完整拉到，还需要继续对照原客户端真实接口和返回结构。
- 右侧聊天记录的历史分页需要持续观察接口是否返回 total、current、size 或游标。

后续建议：

- 继续深挖 Electron 源码和 `YouChatService.xml`。
- 对每个原客户端按钮做接口映射表。
- 把抓包日志里的成功请求整理成稳定 API 文档。
- 补一个浏览器自动化验证工具，至少能检查输入框、推荐条、滚动位置和右侧工具栏。

## 14. 文档维护规则

以后每次修改项目，都按以下规则更新：

1. 改功能：更新对应章节，写清行为变化。
2. 改接口：更新接口名、参数、返回口径、失败兜底。
3. 改 UI：更新 UI 规则和具体模块。
4. 改 AI/skill：更新触发规则、学习规则、文件路径。
5. 修 bug：写入“本次关键修复”或新增日期小节。
6. 新增关键文件：同步写到 `AI_HANDOFF.md`。
7. 验证过什么：写清命令和结果。

这两份文档是项目记忆，不是一次性说明。后续不要只在聊天里解释，必须落到 Markdown。

## 15. 2026-06-07 AI 推荐条二次修复

用户反馈 AI 推荐区存在两个明显问题：

- 关闭按钮被放在左侧标题下面，看起来像一个小横线，位置不直观。
- 候选经常只有一条，并且外观像临时拼出来的细输入框，不够像客服工具里的推荐清单。

本次修复：

- 关闭按钮改为推荐条右上角的 18px 圆形小按钮，悬停时显示蓝色焦点。
- 左侧区域只保留“AI 推荐 / 文字优化 / skill 回复”小标签，不再竖向堆按钮。
- 候选区改为真正的清单行，每条行内包含编号、两行内文案、采用、发送。
- 修复 `1. 1.` 双编号问题，单文本候选不再由 `formatSuggestionText` 再编号。
- AI prompt 从“一条回复”改为“1 到 3 条候选回复”，优先要求 JSON 数组，失败时允许 `1. 2. 3.` 分行。
- 如果模型只返回一条，前端通过 `buildLocalSuggestionVariants` 补足简短/安抚候选，避免界面孤零零只显示一条。

涉及文件：

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 16. 2026-06-07 好友请求全部来源修复

用户反馈好友请求弹层里“全部来源”为空，但单独选择“微信卡片”“扫描二维码”等来源可以显示数据。抓包和本地代理验证确认：

- 不传 `scene/scenes` 的请求返回 `total: 0`。
- `scene=17, scenes=17`（微信卡片）返回 `total: 1453`。
- `scene=3, scenes=3`（搜索微信号）返回 `total: 7`。
- `scene=30, scenes=30`（扫描二维码）返回 `total: 3`。

因此“全部来源”不能直接调用空来源接口。当前实现已改为：

- `loadFriendRequestsBySource(source, page, size)`：单来源真实请求。
- `loadAllFriendRequestSources(page, size)`：并发请求全部来源 `1/3/17/14/30`，合并、去重、按请求时间排序，再做前端分页。
- `mergeFriendRequests(records)`：按真实 id 或机器人+wxid+来源去重。
- `friendSourceCounts`：记录每个来源的真实 total，来源标签显示数量徽标。
- 左上角好友请求角标取聚合总数，超过 99 显示 `99+`。

UI 同步修复：

- 左上角好友请求按钮不再用文字“人”或乱码符号。
- 改为悠聊原客户端 `fontIcon/iconfont.css` 里的 `\e60e` 用户图标。
- 红色角标 0 时隐藏，有数据时显示，超过 99 显示 `99+`。

涉及文件：

- `public/app.js`
- `public/index.html`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 17. 2026-06-07 历史会话悬停接入

用户要求历史会话列表中，鼠标悬停某个会话时显示“接入”按钮。点击后应调用接入接口，并跳转到“当前”列表。

当前实现：

- `getContactHoverActions(contact, contactId)` 根据左侧页签决定 hover 按钮：
  - 留言：接入 + 关闭。
  - 历史：只显示接入。
  - 当前：只显示关闭。
- 历史接入按钮使用 `data-contact-action="access-history"`。
- `handleContactAction` 识别 `access-history` 后调用 `accessHistoryContact(contact)`。
- `accessHistoryContact` 调用真实接口 `/Conversation/AccessIn`，参数为 `contactId` 和 `accountId`。
- 接入成功后：
  - 从本地历史缓存移除该联系人。
  - `state.listTab` 切到 `current`。
  - 刷新当前会话列表。
  - 如果后端已同步到当前列表，则选中新会话。
  - 如果后端同步慢，则先把该联系人临时插入当前列表，保证用户能看到动作反馈。

涉及文件：

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 18. 2026-06-07 原生图标与会话滚动修复

用户反馈 Web 端很多图标像临时找的，输入框上方快捷按钮大小不一，不像原 Windows Electron 客户端；同时从左侧会话列表点击某个会话后，主聊天区没有滚到最下面。

本次处理原则：

- 优先使用原客户端可追溯资源。
- 原包没有的资源不硬套错误素材。例如 `wwwroot/pro_icon.svg` 和 `wwwroot/icons/icon-128x128.png` 实际是 Ant Design Pro 默认 “Pro” 图标，不是悠聊品牌图，因此没有替换成它。
- 不再引入外部图标库或随机符号。

原生图标来源：

- 悠聊 iconfont：`C:\Program Files\youchat-desktop\wwwroot\fontIcon\iconfont.css`。
- Braft 编辑器 iconfont：从原客户端 chatHistory chunk CSS 里的 base64 `braft-icons` 字体提取，由本地服务暴露为 `/native-icons/braft-icons.woff`。
- 红包图标：原客户端表情雪碧图 `C:\Program Files\youchat-desktop\wwwroot\static\emojiSource.cdbf96da.png`，由本地服务暴露为 `/static/emojiSource.cdbf96da.png`，使用原 `e2_09` 红包格子。

当前图标映射：

- 表情：`bfi-emoji`
- 发送指令：`bfi-code`
- 选择图片：`bfi-media`
- 发送红包：`emojiSource.cdbf96da.png` 红包雪碧格
- 截图：`bfi-camera`
- 保存到 skill 回复：`bfi-pushpin`
- 转入 AI：悠聊 iconfont `\e61a`
- AI 设置：悠聊 iconfont `\e605`
- 好友请求：悠聊 iconfont `\e60e`
- 刷新：`bfi-replay`
- 关闭：`bfi-close`
- 复制：`bfi-copy`
- 搜索：`bfi-search`
- 登录账号下拉：`bfi-drop-down`

服务端新增/确认：

- `server.js` 增加 `CLIENT_WWWROOT`，默认指向 `C:\Program Files\youchat-desktop\wwwroot`。
- `server.js` 增加字体 MIME：`.woff`、`.woff2`、`.ttf`。
- `sendClientBraftIcons()` 从原客户端 CSS 提取 Braft 字体。
- `sendClientStaticAsset()` 只允许读取原客户端 `wwwroot` 内的静态资源。
- 路由 `/native-icons/braft-icons.woff` 返回 `font/woff`。
- 路由 `/static/emojiSource.cdbf96da.png` 返回原表情雪碧图。

UI 修复：

- 输入框上方 7 个快捷图标统一为 30px 按钮。
- 字体图标统一 17px，红包雪碧图为 18px。
- 快捷回复、skill、订单搜索按钮统一使用原生 `bfi-search`。
- 复制按钮统一使用原生 `bfi-copy`。
- 会话 hover 的接入、关闭按钮统一为原生 `client-icon-enter`、`bfi-close`。
- 好友请求角标继续 0 隐藏、超过 99 显示 `99+`。
- 清理了重复的 `.quick-search .icon-search-button` 样式，避免后续覆盖导致按钮大小不一致。

会话滚动 bug 修复：

- 问题根因：`scrollToFirstUnreadMessage()` 之前查询 `[data-red-point='true'], .message.incoming`，如果会话有未读数字但当前消息没有真实红点字段，就会退而跳到第一条普通客户消息，导致点击会话后看起来停在上方。
- 修复后：`scrollToFirstUnreadMessage()` 只查 `[data-red-point='true']`。
- 新增 `hasUnreadMessageAnchor()` 判断是否有真实红点消息锚点。
- 新增 `scheduleMessageListBottom()`，在切换会话完成加载后兜底滚动到底部。
- 普通点击会话、重复点击当前会话、未读但无真实红点锚点的会话，都会回到最新消息底部。

验证结果：

- `npm run check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- `GET http://localhost:5177/native-icons/braft-icons.woff` 返回 200，长度 11348，类型 `font/woff`。
- `GET http://localhost:5177/static/emojiSource.cdbf96da.png` 返回 200，长度 616827，类型 `image/png`。
- `GET http://localhost:5177/fontIcon/iconfont.woff2` 返回 200。
- Chrome CDP 验证输入框工具栏：
  - 7 个工具按钮均为 30x30。
  - 字体图标为 17x17。
  - 红包雪碧图为 18x18。
  - 工具栏高度 34px。
  - 工具栏到底部输入框间距 6px。
- Chrome CDP 验证会话滚动：模拟有未读数字但没有真实红点锚点的会话，切换后 `bottomGap = 0`，即主聊天区在最底部。
- 截图文件：
  - `C:\youchat-dev-web\login-native-icon-check.png`
  - `C:\youchat-dev-web\workbench-native-icon-check.png`

涉及文件：

- `server.js`
- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 19. 2026-06-07 可迁移补丁体系

用户提出：除了持续写好 Markdown 记忆，还希望后续客户端更新、接口变化时能够继续跟随更新；并且最好能做成一个 patch，方便导入到任意位置的客户端源码。

当前实现不是 git diff，而是 zip overlay 补丁体系。原因是后续目标目录可能不是 git 仓库，也可能是任意机器、任意目录或一份新客户端源码。zip 补丁更适合直接导入。

新增文件：

- `PATCH_GUIDE.md`：补丁导出、导入、客户端更新审计和审计对比的完整使用说明。
- `tools/export-devkit-patch.ps1`：导出当前二开工程为 zip 补丁。
- `tools/import-devkit-patch.ps1`：导入 zip 补丁到目标目录，覆盖前自动备份。
- `tools/audit-client-update.ps1`：客户端升级后的资源与接口审计工具。
- `tools/compare-client-audits.ps1`：比较两次客户端审计报告，列出资源 hash 和接口候选变化。

`package.json` 新增命令：

- `npm run patch:export`
- `npm run client:audit`
- `npm run client:audit:compare`

导出补丁：

```powershell
cd C:\youchat-dev-web
npm run patch:export
```

默认输出：

```text
C:\youchat-dev-web\patches\youchat-dev-web-patch-<timestamp>.zip
```

补丁内容：

- `payload/`：项目文件。
- `youchat-devkit-manifest.json`：文件哈希、生成时间、原客户端关键资源指纹。
- `PATCH_README.md`：补丁包内说明。

导入补丁：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\youchat-dev-web\tools\import-devkit-patch.ps1 `
  -PatchZip C:\youchat-dev-web\patches\youchat-dev-web-patch-xxxx.zip `
  -TargetPath D:\target\youchat-dev-web
```

导入安全：

- 如果目标文件已存在且内容不同，会先备份到 `<TargetPath>\.youchat-patch-backups\<timestamp>`。
- 导入报告在备份目录的 `import-report.json`。

客户端更新审计：

```powershell
cd C:\youchat-dev-web
npm run client:audit
```

审计输出：

- `reports/client-update-audit-<timestamp>.json`
- `reports/client-update-audit-<timestamp>.md`

审计重点：

- `fontIcon/iconfont.css` 和 `iconfont.woff2` 是否变化。
- Braft 图标 CSS 是否变化。
- `emojiSource*.png` 是否变化。
- `bin/YouChatService.xml` 是否变化。
- 扫描到的接口候选是否变化。

维护要求：

- 客户端更新后先跑 `npm run client:audit`，再跑 `npm run client:audit:compare`。
- 如果资源变化，判断是否需要更新 glyph 映射、红包雪碧图位置或原生静态资源路由。
- 如果接口变化，回到真实客户端抓包、HAR、`logs/api-capture.ndjson` 和 `YouChatService.xml` 对照前端 API 参数。
- 修复确认后再跑 `npm run patch:export` 生成新版补丁。
- 每次补丁体系变化要同步更新 `PATCH_GUIDE.md`、`PROJECT_MEMORY.md`、`AI_HANDOFF.md`。

## 20. 2026-06-07 客户端审计对比工具

为满足“客户端更新、接口变化后还能继续随之更新”的需求，本次新增了审计报告对比工具。

脚本路径：

```text
C:\youchat-dev-web\tools\compare-client-audits.ps1
```

默认命令：

```powershell
cd C:\youchat-dev-web
npm run client:audit:compare
```

默认行为：

- 自动读取 `reports` 目录里最新的两份 `client-update-audit-*.json`。
- 如果只有一份审计报告，则进行自比较，方便确认脚本链路能跑通。
- 生成 `client-audit-compare-*.json` 和 `client-audit-compare-*.md`。

也可以手动指定两份报告：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\compare-client-audits.ps1 `
  -OldAudit .\reports\client-update-audit-old.json `
  -NewAudit .\reports\client-update-audit-new.json
```

对比内容：

- 关键文件是否存在、文件大小、SHA256 是否变化。
- 接口候选新增列表。
- 接口候选删除列表。

本次验证：

- `npm run check` 通过。
- `npm run client:audit:compare` 可生成对比报告。
- `npm run client:audit` 可生成当前客户端审计报告。
- `npm run patch:export` 可导出新版 zip overlay 补丁。
- `tools/import-devkit-patch.ps1` 已在独立目录做过导入验证，导入时会创建备份和 `import-report.json`。

涉及文件：

- `package.json`
- `PATCH_GUIDE.md`
- `tools/compare-client-audits.ps1`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 21. 2026-06-07 skill 优化、AI 换一换与 DeepSeek 兼容

用户提出两个新需求：

- skill 里面的回复增加“优化”按钮，客服可以给 AI 一些图片和文字，让 AI 按客服意思优化话术。
- 会话框上方 AI 推荐太紧，增加“换一换”，用于更换语气和说法。

本次实现：

- AI 推荐条左侧增加 `换一换` 按钮。
- `换一换` 会基于当前推荐、真实聊天上下文和当前候选状态重新请求 AI，轮换语气：
  - 自然安抚
  - 简短直接
  - 耐心解释
  - 轻柔口语
- 推荐条样式从 92px 左栏扩到 116px，候选区加大间距和高度，避免看起来紧紧巴巴。
- 推荐条仍保持在输入框上方，不做大卡片，不挡输入框。
- Skill 命中卡片和 skill 列表行都新增 `优化` 按钮。
- `optimizeSkillById(id)` 会把以下内容交给 AI：
  - 当前 skill 标题、关键词、原话术。
  - 客服输入框中的补充文字。
  - 草稿图片数量，只提示图片存在，不让 AI 编造图片内容。
  - 客户最新问题和最近聊天上下文。
- Skill 优化候选标记 `keepDraftImages`，采用后只替换文字，发送时保留草稿图片并按现有接口分开发送。

DeepSeek 兼容：

- 已确认截至 2026-06-07，DeepSeek 官方 API 支持 OpenAI 兼容格式。
- 官方 base URL：`https://api.deepseek.com`
- 官方聊天路径：`/chat/completions`
- 当前建议模型预设：`deepseek-v4-flash`
- 官方文档提示旧模型 `deepseek-chat`、`deepseek-reasoner` 会在 2026-07-24 15:59 UTC 弃用，因此本项目预设不用旧模型名。
- `server.js` 的 `getAiChatCompletionsUrl()` 已兼容 DeepSeek：
  - `https://api.deepseek.com` -> `https://api.deepseek.com/chat/completions`
  - `https://api.deepseek.com/v1` -> `https://api.deepseek.com/chat/completions`
  - 普通 OpenAI 兼容中转仍按 `/v1/chat/completions`。
- AI 设置弹窗新增供应商预设：
  - `sub2 中转`
  - `DeepSeek`
- 点击 DeepSeek 预设只填端点和模型，不覆盖 API Key，避免误删用户现有 key。用户需要填自己的 DeepSeek API Key。
- `proxyAi` 允许透传 `reasoning_effort` 和 `thinking` 字段，方便后续接 DeepSeek V4 推理/思考参数。

验证：

- `npm run check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- `GET http://localhost:5177/app.js` 返回 200。
- `GET http://localhost:5177/styles.css` 返回 200。
- 本地验证 DeepSeek URL 拼接结果正确。
- 当前 CDP 端口未开启，未做浏览器截图验证。

涉及文件：

- `server.js`
- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

## 22. 2026-06-07 收敛审计与遗留项清单

用户要求把前面上下文中提到但可能没有完成、没有写进说明、或后续容易忘的地方完整收敛一次。本次按产品 UI 审计、真实接口原则、文档记忆和 patch 可迁移性做了复查。

本次发现并修复：

- `README.md` 仍把 AI 推荐主接口写成旧的 `/ChatContent/GenerateRealAIReply`，但当前真实实现已经走本地 OpenAI 兼容中转 `/ai/chat/completions`。已更新 README，说明 AI 推荐、文字优化、skill 优化、DeepSeek 预设、换一换、补丁和客户端升级审计流程。
- `public/app.js` 仍保留一个旧的 `generateAi()` 函数调用 `/ChatContent/GenerateRealAIReply`。虽然当前按钮已经走 `generateAiWithRelay()`，但这个旧函数后续被复用会造成口径混乱。已改为统一转调 `generateAiWithRelay()`。
- 好友请求角标之前依赖弹窗加载结果，刚进工作台时可能显示 0。已新增 `loadFriendRequestBadgeTotals()`，登录成功和定时刷新时按真实 `/Contact/GetNewFirend` 对每个来源拉 `size=1` 获取 total，角标最多显示 `99+`。
- 好友请求“全部来源”之前用 `page * size` 从每个来源只拉第一页再前端分页。如果真实总数很大，后续页可能出现“total 还有很多但当前页空”的错觉。已新增 `FRIEND_AGGREGATE_SOURCE_PAGE_SIZE` 和 `loadFriendRequestsFromSourceWindow()`，按来源逐页拉到足够组成当前聚合页，再合并、去重、排序。
- 好友请求角标预取现在不会受弹窗昵称/机器人搜索词污染，固定按当前设备类型、未处理状态、空关键词统计真实 total。
- `PRODUCT.md` 早期原则里仍写着“接口未联通时保留预览数据”，这和用户后续多次要求“不要假的数据”冲突。已改成接口失败显示真实失败原因和抓包日志。
- `server.js` 的 DeepSeek URL 兼容增强：如果用户填 `https://api.deepseek.com/v1/chat/completions`，会规范到 `https://api.deepseek.com/chat/completions`，避免 DeepSeek 官方路径和通用 OpenAI 路径混用导致 404。

仍需继续用真实客户端或抓包验证的点：

- 快捷回复接口 `/Faq/GetPageList`、`/Faq/GetTypeList` 目前已经接入并渲染发送/编辑按钮，但如果某些账号仍拉不到，需要继续拿原客户端抓包确认参数，例如分类 id、账号 id、机器人过滤、分页字段。
- 右侧聊天记录和主聊天区都已做顶部加载更多、向上自动拉更早消息、默认滚到底、图片加载后复位，但聊天记录接口的真实游标仍需继续观察 `endTime`、`current`、`size`、`contentid` 在不同后端版本下的返回规律。
- 订单、流水明细、用户信息目前坚持真实接口和真实字段，不造编号；如果仍出现字段错位，要拿 `logs/api-capture.ndjson` 中对应响应继续补 `normalizeOrder()`、`normalizeAccountDetail()`、`mergeUserInfo()`。
- WebSocket/SignalR 的实时帧如果是二进制，当前抓包代理只能记录 upgrade，不能解析帧内容。HTTP 接口仍可完整记录请求体和响应摘要。
- 当前本轮 CDP 不可用，未做新的截图 QA。前序已有截图检查文件，但本次改动后的视觉验证以语法和静态资源检查为主。

本次收敛后重要口径：

- 页面默认开启 AI 推荐，但自动发送必须受 `skillAutoReply`、`allowAutoReply`、no-reply 规则限制。
- 候选推荐保持 1 到 3 条横条，不做挡住输入框的大卡片。
- DeepSeek 可以接，但需要用户填 DeepSeek 自己的 API Key；sub2 的 key 不应直接拿去 DeepSeek 使用。
- 后续任何 AI 或开发者接手，必须先读 `PROJECT_MEMORY.md`、`AI_HANDOFF.md`、`PATCH_GUIDE.md`，再动代码。

验证：

- 本次代码修改后需要运行 `npm run check`。
- 服务运行时检查 `/health`、`/app.js`、`/styles.css`。
- 客户端更新跟踪继续跑 `npm run client:audit:compare`。
- 交付或迁移前继续跑 `npm run patch:export`。

## 23. 2026-06-07 AI 推荐条胶囊化 UI 修复

用户反馈会话框上方的 AI 推荐区域显示不全，像 UI 被挡住了一部分；整体也像拼凑的固定块，不够自然。用户希望可以做成更灵活的圆形/胶囊 UI，不必固定整体大小，最好根据文字长度自动定义。

问题根因：

- `.ai-suggestion-card` 之前固定 `max-height: 126px`，且外层 `overflow: hidden`。
- `.ai-suggestion-option p` 之前固定 `max-height: 42px` 并使用 `-webkit-line-clamp: 2`，长话术必然被截断。
- 外层有完整浅蓝边框，视觉上像一个塞在输入框上方的大模块，拼凑感较强。

本次修复：

- `public/styles.css` 中 `.composer` 改为 `overflow: visible`，避免推荐浮条被输入区裁剪。
- `.ai-suggestion-card` 去掉大外框、大背景和整体阴影，改成透明容器。
- `.ai-suggestion-head` 改为独立胶囊标签组，包含 `AI 推荐`、`换一换`、关闭按钮。
- `.ai-suggestion-option` 改为独立胶囊气泡，`width: fit-content`，短话术短显示，长话术按最大宽度自然换行。
- 移除推荐正文的 `-webkit-line-clamp` 和固定 2 行截断；正文改为 `white-space: pre-wrap` 和 `overflow-wrap: anywhere`。
- 候选区允许 1 到 3 条自然换行，最大高度限制在 `min(196px, 28dvh)`，避免极端长内容挤掉输入框。
- 窄屏下退回 100% 宽度，保证阅读和点击稳定。

验证：

- `npm run check` 通过。
- `GET /styles.css` 返回 200。
- 使用 headless Chrome 渲染临时长推荐测试页，截图输出：
  - `C:\youchat-dev-web\ai-suggestion-pill-check.png`
- 截图确认：大外框已去掉，候选以独立胶囊显示，输入框仍可见。

注意：

- 临时截图 HTML 中中文显示成问号是临时文件/Chrome 字体编码显示问题；项目文件本身由 Node 读取确认是 UTF-8，真实页面中文正常。
- 后续不要恢复 `-webkit-line-clamp` 到 AI 推荐正文，否则会重新出现“话术被挡住一截”的问题。

## 24. 2026-06-07 项目迁出 tmp 目录

用户质疑为什么正式二开项目放在 `C:\tmp`。这个反馈正确：`tmp` 只适合早期临时开发缓存，不适合作为长期工作目录。

本次处理：

- 停止旧 `5177` Node 服务。
- 将 `C:\tmp\youchat-dev-web` 复制到固定目录：
  - `C:\youchat-dev-web`
- 排除临时 Chrome profile 和临时 AI 推荐截图 HTML/PNG，不把调试残留当作项目文件。
- 批量替换项目内所有旧路径：
  - `C:\tmp\youchat-dev-web`
  - `C:/tmp/youchat-dev-web`
- 更新启动脚本：
  - `start-dev-web.ps1`
  - `watch-api-capture.ps1`
- 更新文档：
  - `README.md`
  - `PATCH_GUIDE.md`
  - `PROJECT_MEMORY.md`
  - `AI_HANDOFF.md`
- `rg` 检查新目录中已经没有旧 `tmp` 项目路径。

新启动方式：

```powershell
cd C:\youchat-dev-web
npm run dev
```

或运行：

```powershell
C:\youchat-dev-web\start-dev-web.ps1
```

验证：

- `npm run check` 通过。
- 从 `C:\youchat-dev-web` 启动服务后，`GET http://localhost:5177/health` 返回 200。

注意：

- 旧目录 `C:\tmp\youchat-dev-web` 暂时保留为备份，避免误删历史日志、旧 patch 或截图。
- 后续所有开发、启动、patch 导出和文档更新都必须在 `C:\youchat-dev-web` 进行。

## 25. 2026-06-07 图片预览和七牛上传修复

用户反馈两个图片相关问题：

- 发送图片时报错：`已拿到上传配置，但未识别到 OSS 上传地址，请继续抓包确认 GetOssConfig 返回结构`。
- 图片粘贴到输入框后，草稿预览被压成一条很扁的“饼”。

抓包确认：

`logs/api-capture.ndjson` 中 `/ChatContent/GetOssConfig` 真实返回不是阿里 OSS 字段，而是七牛云字段：

```json
{
  "cloudType": 0,
  "qnDomain": "https://qiniu.yunsert.com",
  "qnRegionUrl": "http://upload.qiniup.com",
  "qnToken": "..."
}
```

上传逻辑修复：

- `public/app.js` 的 `extractUploadEndpoint(config)` 新增识别：
  - `qnRegionUrl`
  - `qiniuUploadUrl`
  - `qnUploadUrl`
- `buildOssUploadForm()` 如果识别到 `qnToken/qiniuToken/uploadToken`，改用七牛表单字段：
  - `key`
  - `token`
  - `file`
- `extractUploadedFileUrl()` 最终图片 URL 优先用：
  - `qnDomain`
  - `qiniuDomain`
  - `publicDomain`
  - `cdnDomain`
- `server.js` 的 `/local/oss-upload` 同步支持七牛字段，浏览器直传被 CORS 拦截时仍可走本地代理。

UI 修复：

- `.chat-pane` 底部输入区不再固定 `202px`，改为 `auto`，新增内容向上压缩聊天区。
- `.composer` 设置 `min-height: 202px` 和 `max-height: min(330px, 42dvh)`。
- `.draft-image-tray` 固定 `min-height: 74px`、`max-height: 82px`，且 `flex: 0 0 auto`，避免被 textarea 或推荐条挤扁。
- `.draft-image` 固定 `flex: 0 0 62px`、`62x62`，粘贴多图时横向滚动，不压缩缩略图。
- `.draft-image-tray.is-hidden` 明确 `display: none`，隐藏时不占高度。

验证：

- `npm run check` 通过。
- `GET /app.js`、`GET /styles.css` 返回 200。
- 使用真实抓包样例验证七牛解析结果：
  - endpoint: `http://upload.qiniup.com`
  - form: `{ key, token }`
  - final url: `https://qiniu.yunsert.com/<key>`

后续注意：

- 如果 `GetOssConfig` 返回 `txHostUrl/txPolicy/txQak/txQsignature`，说明切到腾讯云 COS，还需要继续补腾讯云表单签名格式。
- 当前已覆盖本次真实抓包里的七牛云结构。

## 26. 2026-06-07 聊天区反复跳动与输入区稳定修复

用户反馈：

- 点击会话后聊天区有时不会停在底部。
- 会话列表或聊天框会因为定时刷新反复跳动、闪烁。
- AI 推荐条和 skill 推荐区域会把输入框往下挤，输入框和发送按钮像是被顶没了。
- 粘贴图片后，如果推荐条或输入区高度变化，图片预览容易被压扁。

根因：

- `loadMessages(1, "replace")` 原来在请求前和请求后都会 `renderMessages("bottom")`，一次刷新可能多次强制滚到底。
- `renderMessages()` 默认参数是 `"bottom"`，很多只是重画状态的调用也会偷偷滚到底。
- `scrollElementToBottom(..., { watchImages: true })` 会给图片绑定 `load/error` 回调，图片加载完成后无条件再次滚到底。用户往上翻历史时，旧图片回调仍可能把位置抢回去。
- 右侧工具栏聊天记录 `loadHistoryMessages()` 也存在同类 replace 后滚底逻辑。
- AI 推荐条虽然已移出 composer，但仍在文档流里影响底部输入区高度，视觉上像把输入框往下挤。

修复策略：

- `public/app.js`
  - `renderMessages(scrollMode = "none")` 默认不再滚动。
  - `loadMessages(page, mode, options)` 新增：
    - `{ forceBottom: true }`：切换会话、发送成功、接入历史会话后强制滚到最新。
    - `{ keepPosition: true }`：手动刷新保持当前位置。
  - 自动刷新 `loadMessages(1, "merge")` 只在用户原本接近底部时继续跟随到底；否则用 `restoreScrollTop()` 保持原位置。
  - 加入 `scrollRequestId` 和 `scrollRequestIds` WeakMap，旧滚动请求和旧图片加载回调会被新请求覆盖，避免延迟抢滚动。
  - 新增 `restoreScrollTop()`，给刷新但不追加历史的场景保持视口。
  - `restorePrependScroll()` 和 `scrollElementToBottom()` 都加了 guard：用户手动滚开后，图片加载完成不再强行改位置。
  - `loadHistoryMessages(page, mode, options)` 同步支持 `{ forceBottom, keepPosition }`，右侧聊天记录与主聊天框行为一致。
  - `renderAiSuggestionCard()` 只在主聊天区原本在底部时，推荐条出现后才补一次到底；用户正在翻历史时不抢位置。
  - `renderDraftImages()` 同步给 `.composer` 加 `has-draft-images` 类，兼容不支持 `:has()` 的旧 Electron/浏览器内核。

滚动规则：

- 切换会话：加载完成后滚到底；如果有红点消息，则优先跳红点。
- 发送文字、图片、红包、指令、skill/AI 推荐：发送成功后滚到底。
- 手动刷新聊天记录：保持当前滚动位置。
- 自动刷新：如果客服本来在底部，则跟随新消息到底；如果客服正在向上翻，则保持原位置。
- 加载更多历史：保持当前位置锚点，新加载的更早记录插到上方，不把人拉到底。
- 图片加载完成：只补偿当前滚动请求，不再让旧图片回调抢位置。

输入区和 AI 推荐条 UI 修复：

- `public/styles.css`
  - `.chat-pane` 改为 `58px minmax(0, 1fr) minmax(0, auto) auto`，AI 推荐条占聊天区空间，不挤 composer。
  - `.composer` 改成固定底部网格工作台：工具栏、表情面板、图片托盘、textarea、发送行都有稳定行位。
  - `.composer` 默认高度 `clamp(196px, 28dvh, 278px)`。
  - `.composer.has-draft-images` 和 `.composer:has(.draft-image-tray:not(.is-hidden))` 有图时提升到 `clamp(252px, 36dvh, 312px)`，只压缩聊天区，不往下挤输入区。
  - `.draft-image-tray` 固定 74px 高，`.draft-image` 固定 62x62，粘贴多图横向滚动。
  - `.ai-suggestion-card` 改为贴近输入区上沿的横向提示条，最大高度 `min(128px, 18dvh)`。
  - AI 候选项每条为紧凑行，文字自然换行，候选项内部最多 42px 自滚，整体推荐条自滚，不挡住 textarea。
  - 关闭按钮和 `换一换` 保持在左侧标题胶囊里，始终可见。

验证：

- `npm run check` 通过。
- `GET /health` 返回 200。
- `GET /app.js` 返回 200。
- `GET /styles.css` 返回 200。
- 静态结构检查通过：
  - AI 推荐条位于 `messageList` 与 `footer.composer` 之间。
  - `renderMessages()` 默认不滚动。
  - `loadMessages()` 已支持 force/keep options。
  - 滚动 token guard 存在。
  - composer 已支持图片草稿高度扩展。

后续注意：

- 不要把 AI 推荐条重新放回 `.composer` 内部，否则会再次挤压输入框。
- 不要把 `renderMessages()` 默认值改回 `"bottom"`。
- 新增任何刷新入口时必须明确选择 `{ forceBottom: true }` 或 `{ keepPosition: true }`。
- 新增图片消息渲染时，仍要让图片 load 回调走 guard，避免延迟抢滚动。

## 27. 2026-06-07 长链接卡片与网页视频浮层预览

用户要求：

- 客户端对长链接会显示类似微信的网页卡片，带网页缩略图和右上角“详情”。
- Web 二开版也要显示卡片，但希望点击“详情”后不是单纯跳出网页，而是在当前网页上浮动一个预览块。
- 如果链接提供真实视频地址或播放器地址，浮层里优先预览视频。

实现范围：

- `public/app.js`
  - 新增 `state.linkPreviewCache` 和 `state.activeLinkPreview`。
  - `normalizeMessage()` 保留真实卡片字段：
    - `cardTitle`
    - `cardDesc`
    - `cardImg`
    - `cardUrl`
    - 同时兼容 `miniProTitle/miniProDesc/miniProImg/miniProUrl` 等字段。
  - `renderMessageContent()` 先判断图片，再判断链接卡片，避免图片 URL 被误渲染成网页卡片。
  - 只有以下场景会提升为卡片：
    - 原消息带真实卡片字段。
    - `contentType` 是卡片/链接类。
    - 消息内容本身就是一个纯 URL。
  - 如果是一段文字里夹带 URL，不会吞掉文字，会保持原文并把 URL 渲染成可点击的蓝色内联按钮。
  - 新增 `hydrateVisibleLinkCards()`，消息列表和右侧聊天记录渲染后会异步请求真实网页 meta，再刷新当前卡片。
  - 新增浮层预览相关函数：
    - `showLinkPreview`
    - `renderActiveLinkPreview`
    - `closeLinkPreview`
    - `openActiveLinkPreview`
    - `copyActiveLinkPreviewUrl`
    - `getDirectPreviewVideoUrl`
    - `getPreviewPlayerUrl`
  - 浮层规则：
    - 真实 `video/mp4` 等直链用 `<video controls>`。
    - `twitter:player`、`og:video:iframe` 等播放器地址用 iframe。
    - 普通网页用 iframe。
    - 如果目标站禁止嵌入，显示真实提示并保留“打开网页”按钮。

- `public/index.html`
  - 新增 `#linkPreviewOverlay` 浮层结构。
  - 包含标题、副标题、复制链接、打开网页、关闭按钮和预览 body。

- `public/styles.css`
  - 新增 `.message-link-card` 卡片样式。
  - 卡片右上角固定“详情”，底部显示真实状态与打开/复制。
  - 有真实缩略图时显示图片；无缩略图时显示域名缩写，不伪造图片。
  - `.message-content.has-link-card` 去掉外层气泡边框，避免卡片套卡片。
  - 新增 `.link-preview-overlay`、`.link-preview-panel`、`.link-preview-video`、`.link-preview-frame` 等浮层样式。

- `server.js`
  - 新增 `GET /local/link-preview?url=...`。
  - 仅允许 `http/https`。
  - 读取真实 HTML meta，不生成假标题、假图片：
    - `og:title`
    - `twitter:title`
    - `<title>`
    - `og:description`
    - `twitter:description`
    - `description`
    - `og:image`
    - `twitter:image`
    - `og:video`
    - `og:video:type`
    - `twitter:player`
    - `twitter:player:stream`
  - 限制读取大小 `MAX_LINK_PREVIEW_BYTES = 900000`，避免整页无限拉取。
  - 视频直链或 `video/*` 响应会直接返回 `video` 和 `videoType` 给前端。

真实数据原则：

- 不伪造网页标题、缩略图或视频地址。
- 目标网页没有 meta 时，只显示真实 URL、域名和可打开入口。
- 小红书等平台如果只返回标题、不给缩略图或视频，就只显示真实标题/域名，不补假图。
- 如果 iframe 被站点 `X-Frame-Options` 或 CSP 禁止，浮层仍保留真实打开按钮。

已验证：

- `npm run check` 通过。
- `git diff --check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- `GET /local/link-preview?url=https://example.com/` 返回真实标题 `Example Domain`。
- `GET /local/link-preview?url=https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4` 返回真实 `video/mp4` 和视频 URL。
- `GET /local/link-preview?url=https://www.xiaohongshu.com/goods-detail/69eb394dae65c90001108dbd` 返回真实标题 `小红书`，没有伪造缩略图或视频。
- 内置浏览器打开 `http://localhost:5177/`：
  - 登录页可见。
  - `#linkPreviewOverlay` 存在且默认隐藏。
  - 浮层 panel 角色为 `dialog`。
  - 无浏览器脚本错误。

后续注意：

- 真实业务验证仍需要等真实聊天消息里出现长链接或卡片字段。
- 不要把所有含 URL 的长文本强行变成卡片，否则会丢失客户原话。
- 如果后续抓包发现原客户端卡片字段名不同，需要优先扩展 `normalizeMessage()` 字段映射。
- 视频平台通常不会直接给可播放 mp4，更多会给播放器 iframe 或禁止嵌入，Web 端只能按真实返回处理。

## 28. 2026-06-08 历史计数来源与输入区位置修复

用户反馈：

- 左侧底部 `历史 23` 看起来不合理，怀疑是否真的是服务端历史会话数量。
- 输入框位置仍然不舒服，AI 推荐条和输入区的关系看起来像在互相挤压。

历史计数结论：

- `logs/api-capture.ndjson` 里最近多次真实请求 `/Contact/GetContactList`，其中 `isHistory=true`、`pageSize=1` 的响应是：
  - `{"success":true,"message":null,"data":0}`
- 因此当前看到的 `23` 不能解释为悠聊后端历史会话总数。
- 这个 `23` 来自 Web 本地清空列表归档：
  - `state.localHistoryContacts`
  - `localStorage` key：`youchat.localHistoryContacts`
  - 入口：`archiveAndClearCurrentList()`
- 这是为了让“清空列表”真的在 Web 端清空当前列表，并把被清空的会话暂存到历史列表，避免定时刷新马上把当前列表刷回来。

本次实现：

- `public/app.js`
  - 新增 `state.listServerCounts` 和 `state.listLocalCounts`，分别记录接口数量和本地归档数量。
  - 新增 `getConversationTabCountMeta()` 和 `formatTabCount()`。
  - `renderConversationTabs()` 不再把历史数量只显示成一个裸数字。
  - 历史 tab 现在会显示来源：
    - 只有接口数：显示接口数量，来源为 `接口`。
    - 只有本地归档：显示本地数量，来源为 `本地`。
    - 两者都有：显示 `接口数+本地数`，来源为 `接口+本地`。
  - `title` 会说明完整口径，例如“历史接口暂无数据，本地清空归档 23”。
  - `loadContactCounts()` 对 `data:0` 做显式 0 处理，不再误用旧 fallback。
  - `loadContacts()` 在历史 tab 合并服务端历史会话和本地归档，但单独保留两类计数。
  - `archiveAndClearCurrentList()` 清空后同步刷新本地历史计数。

输入区和 AI 推荐浮层修复：

- `public/app.js`
  - 新增 `observeComposerLayout()` 和 `updateComposerLayoutMetrics()`。
  - 使用 `ResizeObserver` 监听 `.composer` 和 `#aiSuggestionCard` 高度。
  - 写入 CSS 变量：
    - `--composer-height`
    - `--ai-suggestion-height`
  - `showWorkbench()`、`renderDraftImages()`、`renderAiSuggestionCard()` 后都会重新测量，避免登录页隐藏工作台或贴图后浮层位置不准。

- `public/styles.css`
  - `.chat-pane` 改为稳定三行：`58px minmax(0, 1fr) auto`。
  - `#aiSuggestionCard` 不再占正常文档流，不再把 composer 往下挤。
  - `.ai-suggestion-card` 改为绝对定位浮层：
    - `bottom: calc(var(--composer-height) + 8px)`
    - 位置贴在底部输入区上方。
  - `.message-list` 底部 padding 使用 `--ai-suggestion-height` 预留浮层空间，推荐条出现时不会遮住最新消息。
  - `.composer` 默认高度压缩为 `clamp(128px, 17dvh, 158px)`。
  - 有图片草稿时 `.composer` 扩展为 `clamp(204px, 29dvh, 238px)`，只向上压缩聊天区，不向下挤掉输入框。
  - 移动端去掉绝对定位浮层的 `width: 100%`，避免 `left/right + width` 造成横向溢出。

设计原则：

- 这里是客服工作台，不是卡片化后台；输入框必须稳定贴底，客服不能因为 AI 推荐条出现而找不到输入区。
- AI 推荐可以压缩聊天记录可视区域，但不能挤压或遮挡输入区。
- 历史 tab 必须说明真实来源，不能把本地归档数包装成接口历史数。

验证：

- `npm run check` 通过。
- `git diff --check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- 抓包日志确认 `isHistory=true` 的 `GetContactList` 当前返回 `data:0`。

后续注意：

- 如果后续抓包证明原客户端底部“历史” tab 使用了另一个接口或不同参数，应优先把 Web 历史 tab 改成真实接口口径，而不是继续依赖本地归档。
- 不要把 `.ai-suggestion-card` 放回文档流里，否则输入框会再次被挤压。
- 不要把历史 tab 的 `本地` 来源标签删掉，除非已经能用接口拿到真实历史总数。

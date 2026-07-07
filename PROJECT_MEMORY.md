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
29. [2026-06-08 当前会话账号过滤回退与数量修复](#29-2026-06-08-当前会话账号过滤回退与数量修复)
30. [2026-06-08 会话列表真实口径二次纠偏](#30-2026-06-08-会话列表真实口径二次纠偏)
31. [2026-06-08 真实数据源、历史列表和默认 API 地址修复](#31-2026-06-08-真实数据源历史列表和默认-api-地址修复)
32. [2026-06-08 输入区模块化隔离修复](#32-2026-06-08-输入区模块化隔离修复)
33. [2026-06-08 飞牛 youchat 服务端链路回正](#33-2026-06-08-飞牛-youchat-服务端链路回正)
34. [2026-06-08 飞牛 MySQL 排序规则修复](#34-2026-06-08-飞牛-mysql-排序规则修复)
35. [2026-06-08 Web 刷新后当前会话混入历史修复](#35-2026-06-08-web-刷新后当前会话混入历史修复)
36. [2026-06-08 聊天消息卡片分类渲染](#36-2026-06-08-聊天消息卡片分类渲染)
37. [2026-06-08 Skill 优化回写与命中态排序](#37-2026-06-08-skill-优化回写与命中态排序)
38. [2026-06-08 知名网站链接卡片 Logo 兜底](#38-2026-06-08-知名网站链接卡片-logo-兜底)
39. [2026-06-08 原生客户端右上角功能区](#39-2026-06-08-原生客户端右上角功能区)
40. [2026-06-08 Skill 图片回写、混合粘贴与发送防重复](#40-2026-06-08-skill-图片回写混合粘贴与发送防重复)
41. [2026-06-09 数据库管理删除聊天记录](#41-2026-06-09-数据库管理删除聊天记录)
42. [2026-06-09 应用深链长链接卡片](#42-2026-06-09-应用深链长链接卡片)
43. [2026-06-09 小程序卡片微信式大封面](#43-2026-06-09-小程序卡片微信式大封面)
44. [2026-06-09 客户头像同步](#44-2026-06-09-客户头像同步)
45. [2026-06-09 CodeBuddy API 支持](#45-2026-06-09-codebuddy-api-支持)
46. [2026-06-09 聊天图片网页浮层预览](#46-2026-06-09-聊天图片网页浮层预览)
47. [2026-06-09 发送快捷键、skill 图片与预览头部修复](#47-2026-06-09-发送快捷键skill-图片与预览头部修复)
48. [2026-06-09 飞牛服务误切 SQLite 修复](#48-2026-06-09-飞牛服务误切-sqlite-修复)
49. [2026-06-09 图片发送卡在发送中修复](#49-2026-06-09-图片发送卡在发送中修复)
50. [2026-06-09 SignalR 清红点桥接](#50-2026-06-09-signalr-清红点桥接)
51. [2026-06-11 AI 渠道独立配置与模型拉取](#51-2026-06-11-ai-渠道独立配置与模型拉取)
58. [2026-06-12 当前会话列表“接口有数据但 Web 偶发显示空”排查与修复](#58-2026-06-12-当前会话列表接口有数据但-web-偶发显示空排查与修复)
59. [2026-06-12 飞牛 SQLite 再次回退与一键恢复脚本](#59-2026-06-12-飞牛-sqlite-再次回退与一键恢复脚本)
60. [2026-06-12 左侧会话列表动态加载截断修复](#60-2026-06-12-左侧会话列表动态加载截断修复)
61. [2026-06-12 右侧工具栏、Skill 学习与红点滚动修复](#61-2026-06-12-右侧工具栏skill-学习与红点滚动修复)
62. [2026-06-13 底部会话分类红点与未读跳转修复](#62-2026-06-13-底部会话分类红点与未读跳转修复)
63. [2026-06-13 SQLite 回退恢复与图片发送性能修复](#63-2026-06-13-sqlite-回退恢复与图片发送性能修复)
68. [2026-06-13 Skill 队列式训练与相似学习聚类](#68-2026-06-13-skill-队列式训练与相似学习聚类)
69. [2026-06-15 Web 数据库一键修复按钮](#69-2026-06-15-web-数据库一键修复按钮)
70. [2026-06-15 Web 客户端 Docker 化部署](#70-2026-06-15-web-客户端-docker-化部署)
71. [2026-06-15 GitHub Container Registry 发布](#71-2026-06-15-github-container-registry-发布)
72. [2026-06-16 系统设置保存保护与数据库自动守护](#72-2026-06-16-系统设置保存保护与数据库自动守护)
73. [2026-06-17 PromptWorks 旁路训练工作台](#73-2026-06-17-promptworks-旁路训练工作台)
74. [2026-06-17 PromptWorks 前端 Failed to fetch 修复](#74-2026-06-17-promptworks-前端-failed-to-fetch-修复)
75. [2026-06-17 悠聊人工回复导入 PromptWorks 训练](#75-2026-06-17-悠聊人工回复导入-promptworks-训练)
79. [2026-06-29 会话列表键盘切换与 Skill 训练标记台](#79-2026-06-29-会话列表键盘切换与-skill-训练标记台)
80. [2026-06-30 订单号场景 Skill 训练纠偏](#80-2026-06-30-订单号场景-skill-训练纠偏)

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

- 业务 UI 必须贴近原客户端，底部只显示 `当前(25)`、`留言(2)`、`历史(5700)` 这种业务数字，不显示 `本地`、`保留`、`全局回退`、`客服空`、`接口空` 等内部来源标签。
- 原客户端当前会话列表默认请求 `/Contact/GetContactList`，初始化参数接近 `pageIndex=1&pageSize=20`；搜索字段是 `keyWord`。不要默认塞 `id=0`、`isGuestbook=false`、`isHistory=false` 这类空条件。
- 当前 tab 默认先走不带 `accountId` 的客户端兼容请求。`/Senstive/GetAccountList` 拿到的短 `id/accId` 只作为非破坏性兜底或诊断，不再作为默认强制过滤。
- 已知 `accountId=2` 会返回 `{"success":true,"message":null,"data":0}`，所以 `id=2` 不是稳定的默认当前列表口径。长 `accountId: 1556504756803862529` 也不是当前会话筛选 ID。
- 留言右键“全部接入”调用 `/Conversation/AccessInAll` 时必须传客服短账号 ID（实测 `accountId=2`）。不能用留言联系人记录里的 `accountId=0`，否则接口可能返回 `success:true` 但实际不接入。
- `state.listCountSources` 只允许用于日志、调试和后续抓包分析，不能渲染到业务界面。
- 历史 tab 的可见数字和列表内容都只使用后端历史接口返回的数据。不要把 Web 本地缓存或清空列表缓存合并进业务历史列表。

会话排序：

- 普通会话按最后回复/最后消息时间排序。
- 待办/置顶会话需要特殊显示，并允许排在上面。
- 清空列表后，Web 端只做短时间本地过滤，避免自动刷新马上把刚清空的联系人弹回来；不再生成本地历史记录。

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
- 自动推荐/自动回复只能针对“最后一条仍未被处理的客户消息”。如果这条客户消息后面已经出现客服、AI、机器人或系统处理结果，就不能回头拿旧问题继续生成或发送回复。
- 订单查询结果类提示属于无需回复，例如“发【订单】查看”、商品标题 + “订单/查看”、订单已成功/已绑定/已跟单/已查询。即使后端方向字段偶尔标成 incoming，也不能触发自动回复。
- 发送框上方展示 1 到 3 条横条候选，每条有“采用”和“发送”，推荐条左侧提供“换一换”。
- “换一换”会基于原推荐和真实上下文重新生成不同语气/说法，语气池包含自然安抚、简短直接、耐心解释、轻柔口语。
- 如果客服不采用 AI 推荐，而是自己发送文字或图片，会触发自动学习。
- 如果人工回复时当前已经命中某个 skill，则优先把这次人工回复记录到该 skill 的 `manualOverrides`，不是另建一个孤立 learned skill。
- 同一命中 skill 被人工纠正累计 3 次后，会自动把人工话术回写到该 skill 的 `replySteps/fallback`，并保留原 skill 中已有图片步骤。
- Skill 回复列表和当前命中 skill 卡片都提供“优化”按钮。优化会结合当前 skill 话术、客服输入框中的补充文字、草稿图片数量和最近聊天上下文生成 1 到 3 条候选。优化候选上有“更新skill”，点击后可立即把该候选写回当前 skill。

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

- 原客户端清空后当前列表会真的空掉，历史归属以服务端接口为准。
- Web 端只实现短时间刷新过滤，避免接口刷新后马上重新出现；不要再把清空列表结果写成本地历史。

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
- 目标网页没有 meta 时，未知站点只显示真实 URL、域名和可打开入口。
- 小红书、快手、1688、得物等知名平台如果没有真实缩略图，可以使用平台 logo 作为识别兜底；不要伪造商品图或视频。
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
- 因此当时看到的 `23` 不能解释为悠聊后端历史会话总数。
- 这个 `23` 来自旧版 Web 本地清空列表归档：
  - `state.localHistoryContacts`
  - `localStorage` key：`youchat.localHistoryContacts`
  - 入口：`archiveAndClearCurrentList()`
- 这个旧方案已在第 31 节废弃。Web 不再把本地归档混入历史列表。

本次实现：

- `public/app.js`
  - 新增 `state.listServerCounts` 记录接口数量；旧版曾有 `state.listLocalCounts`，已在第 31 节删除。
  - `renderConversationTabs()` 后续已修正为客户端式 `当前(25)`、`留言(2)`、`历史(5700)`。
  - 历史 tab 可见计数只取服务端历史接口总数，不再显示 `本地`、`接口+本地` 这类内部来源。
  - 旧版曾把本地清空归档合并进历史列表供临时翻阅；该行为已在第 31 节删除。
  - `loadContactCounts()` 对 `data:0` 做显式 0 处理，不再误用旧 fallback。
  - `loadContacts()` 的历史 tab 现在只显示服务端历史会话。
  - `archiveAndClearCurrentList()` 清空后只做短时防回弹过滤，不写本地历史。

输入区和 AI 推荐浮层修复（已废弃，见第 32 节）：

> 下面这套 `ResizeObserver + 绝对定位浮层` 方案后来又导致输入框、工具条、图片托盘和 AI 推荐互相挤压。2026-06-08 第 32 节已改成独立 grid 行和输入区模块隔离。后续不要按本小节恢复旧实现。

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
- 历史 tab 的业务数字必须像客户端一样只显示真实服务端历史数量，不能把本地归档数包装成接口历史数，也不能在业务 UI 暴露来源标签。

验证：

- `npm run check` 通过。
- `git diff --check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- 抓包日志确认 `isHistory=true` 的 `GetContactList` 当前返回 `data:0`。

后续注意：

- 如果后续抓包证明原客户端底部“历史” tab 使用了另一个接口或不同参数，应优先把 Web 历史 tab 改成真实接口口径，不要依赖本地归档。
- 旧结论“不要把 `.ai-suggestion-card` 放回文档流”已被第 32 节替代。当前正确做法是：`#aiSuggestionCard` 作为 `.chat-pane` 独立 grid 行存在，且不能进入 `.composer` 内部。
- 不要在业务界面显示历史 tab 的 `本地` 来源标签；调试来源只写日志或文档。

## 29. 2026-06-08 当前会话账号过滤回退与数量修复

用户反馈：

- 会话列表的消息数量坏了。
- 当前列表拿不到数据。

根因：

- 前一版为了避免 `当前 8018` 这种全局数量误导，强制当前页签携带 `/Senstive/GetAccountList` 返回的客服账号 `id=2` 去请求 `/Contact/GetContactList`。
- 最近真实抓包显示，同样的 `accountId=2` 请求会返回：
  - `{"success":true,"message":null,"data":0}`
- 前端把这个 `data:0` 当作权威空列表处理，于是：
  - `state.contacts = []`
  - `state.totalContacts = 0`
  - `state.listCounts.current = 0`
- 因此左侧会话和消息数量看起来像“都拿不到数据”。

本次实现：

- `public/app.js`
  - 新增 `CONTACT_LIST_ACCOUNT_IDS_STORAGE_KEY = "youchat.contactListAccountIds"`。
  - 新增 `state.contactListAccountIds`，持久化客服列表筛选候选 ID。
  - 新增 `state.listCountSources`，记录每个 tab 的数量来源。
  - 新增账号候选与持久化函数：
    - `loadContactListAccountIds()`
    - `persistContactListAccountIds()`
    - `rememberContactListAccountIds()`
    - `extractContactListAccountIds()`
    - `uniqueContactListAccountIds()`
  - `extractContactListAccountIds()` 优先取客服账号对象的 `id/accId`，只有短数字 `accountId` 才作为候选，避免把长商户 `accountId=1556504756803862529` 误当成当前会话筛选 ID。
  - 登录账号变化时清理旧 `youchat.accountId` 和 `youchat.contactListAccountIds`，避免换账号后旧筛选污染。
  - 新增会话列表请求封装：
    - `fetchContactListWithFallback()`
    - `fetchContactListPayload()`
    - `getContactListPayloadTotal()`
    - `isUsefulContactListResult()`
    - `isExplicitEmptyContactListResult()`
    - `shouldPreserveEmptyContactResult()`

请求策略：

- 当前 tab：
  - 先请求不带 `accountId` 的客户端兼容 `/Contact/GetContactList`。
  - 初始化参数贴近原客户端：`pageIndex=1`、`pageSize=20`，有搜索时传 `keyWord`。
  - 默认不传 `id=0`、`isGuestbook=false`、`isHistory=false`。
  - 只有客户端兼容请求返回 `data:0` 或失败时，才用客服账号候选 ID 做兜底探测。
  - 如果返回带 `total: 0` 且不是 `data:0`，认为是真实明确空列表。
  - 如果返回 `data:0`，认为是不可靠空响应，不能直接清空已有会话。
  - 如果兜底也失败或仍是空响应，并且页面已有真实会话，则保留已有会话，只在日志里标记来源。
- 留言、历史 tab：
  - 继续按各自参数请求，不强行加当前客服 `accountId`。
- 清空列表后：
  - `loadContactCounts()` 检测 `shouldKeepListLocallyCleared(tab)`，避免刚清空后又被自动刷新弹回。

界面变化：

- 当前、留言、历史 tab 只显示客户端式业务数量：`当前(25)`、`留言(2)`、`历史(5700)`。
- 左侧顶部只显示 `N 个客户`。
- 禁止在业务 UI 暴露 `本地`、`保留`、`全局回退`、`已清空`、`客服空`、`接口空` 等内部调试标签。

验证：

- `npm run check` 通过。
- `git diff --check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- `GET http://localhost:5177/app.js` 返回 200。
- `GET http://localhost:5177/styles.css` 返回 200。
- 直连 `/api/Contact/GetContactList` 的 shell 探测当前返回 502，是上游 `192.168.9.83` 不可达导致，不能作为业务逻辑失败依据。

后续注意：

- 不要再把 `data:0` 直接当作“当前会话明确为 0”。
- 明确空列表应以 `data.records/list` 加 `total: 0` 这种结构为准。
- 如果后续抓包发现原客户端当前列表还带其他参数，例如时间窗口、机器人 ID 或状态字段，应扩展 `buildContactListParams()`，不要删除现有 fallback 保护。
- 如果要核对当前客服精准数量，必须用抓包确认真实客户端实际参数；不要把内部 `source` 标签显示给客服。

## 30. 2026-06-08 会话列表真实口径二次纠偏

用户反馈：

- Web 数据仍和 Windows 客户端对不起来。
- 客户端并没有显示 `本地`、`保留` 等字样。
- 希望 Web 按真实数据和客户端业务 UI 来，不要把内部调试口径露出来。

本次修正：

- `public/app.js`
  - `renderConversationTabs()` 改为单行客户端式：`当前(25)`、`留言(2)`、`历史(5700)`。
  - 删除业务 UI 中的来源小字渲染。
  - `renderContacts()` 左侧顶部只显示 `N 个客户`。
  - `getConversationTabCount()` 对历史 tab 只取 `state.listServerCounts.history` 或服务端列表计数。
  - `loadContactCounts()` 改用 `pageSize=20`，贴近原客户端初始化请求。
  - `buildContactListParams()` 改用 `keyWord`，不再默认传 `id=0`、`isGuestbook=false`、`isHistory=false`。
  - `fetchContactListWithFallback()` 先走不带 `accountId` 的客户端兼容请求，再把客服账号过滤作为兜底。
  - `archiveAndClearCurrentList()` 不再把本地归档数加到历史 tab 可见计数里。
- `public/styles.css`
  - 底部 tab 去掉三行布局和 `<small>` 来源样式，收紧为一行按钮。

客户端源码依据：

- `C:\Program Files\youchat-desktop\wwwroot\p__chatHistory__index.*.async.js`
  - `/Contact/GetContactList`
  - 初始化分页约 `pageIndex=1`、`pageSize=20`
  - 搜索字段 `keyWord`
  - 15 秒增量刷新使用 `startTime`、`endTime`、`pageSize=100`
- `C:\Program Files\youchat-desktop\bin\YouChatService.xml`
  - `accountId` 仅说明“传入则表示获取客服的当前会话列表”，但近期真实返回证明 `accountId=2` 不稳定，不能作为默认强制参数。

运行状态注意：

- 本次检查时电脑重启后未发现 `18080/8080` 悠聊服务监听，只有 Web dev server 在 `5177`。
- 如果 Windows 客户端看到 `当前(25)`，而 Web 代理请求仍返回 `data:0`，优先确认两边是否连到同一个悠聊服务地址、端口、数据库和登录态。
- 需要进一步精确对齐时，使用 `start-client-capture-proxy.ps1` 抓原客户端请求，不要靠猜参数。

## 31. 2026-06-08 真实数据源、历史列表和默认 API 地址修复

> 2026-06-08 追加纠偏：本节里“默认 API 改为 `https://im.52youzai.com/api`”的结论已被第 33 节覆盖。用户真实目标是连接飞牛上的悠聊 Docker 服务 `/vol1/1000/Docker/youchat`，默认地址应为 `http://192.168.9.83:18080/api`。

用户反馈：

- Web 数据仍对不上 Windows 客户端。
- 客户端界面没有 `本地`、`保留` 等字样。
- 希望按照真实数据来，不要本地拼出来的业务数据。

当时新增发现与误判：

- 原客户端配置文件：
  - `C:\Program Files\youchat-desktop\appsettings.json`
  - `C:\Program Files\youchat-desktop\bin\appsettings.json`
- 其中 Windows 安装包默认 `DefaultOptions.ChatServiceUrl` 是：
  - `https://im.52youzai.com/api`
- 当时只检查了本机端口，未继续查飞牛 Docker，所以误判为应该默认连正式服。
- 后续第 33 节已经确认：用户真实目标是飞牛 Docker 服务 `http://192.168.9.83:18080/api`，不是正式服。
- `logs/api-capture.ndjson` 里的 `http://192.168.9.83:18080/api` 记录不是错误方向，而是用户当前真实服务端链路。

本次实现：

- `public/app.js`
  - 当时曾误把默认 `DEFAULT_API_BASE` 改为 `https://im.52youzai.com/api`，这个改动已在第 33 节撤回。
  - 当时曾误把 `http://192.168.9.83:18080/api` 当作旧默认地址迁移走，这个改动已在第 33 节撤回。
  - 登录页服务器地址支持直接填写完整 API 地址，例如 `http://192.168.9.83:18080/api`。
  - 如果只填 host + port，则仍兼容构造成 `http://host:port/api`，用于本地或 Docker 服务。
  - 删除 `LOCAL_HISTORY_STORAGE_KEY`、`state.localHistoryContacts`、`state.listLocalCounts`、`loadLocalHistoryContacts()`、`persistLocalHistoryContacts()`、`removeLocalHistoryContact()`。
  - `loadContacts()` 在 `history` tab 不再合并本地历史缓存，只展示 `/Contact/GetContactList` 的 `isHistory=true` 真实接口结果。
  - `archiveAndClearCurrentList()` 清空后只写 `state.clearedContactState` 做短时防回弹过滤，不再生成本地历史记录。
  - `accessHistoryContact()` 接入历史会话后不再操作本地历史缓存。
- `server.js`
  - 当时曾误把默认 `YOUCHAT_API_BASE` fallback 改为 `https://im.52youzai.com/api`，这个改动已在第 33 节撤回。
- `README.md`
  - 更新启动说明，明确默认后端对齐原客户端。
  - 更新清空列表说明，明确历史列表只展示接口历史，不混入 Web 本地缓存。
- `AI_HANDOFF.md`
  - 更新默认 API 地址和历史列表规则。

重要新规则：

- 业务历史列表只能来自后端历史接口。接口没有返回，就显示真实空状态或失败原因。
- 清空列表只能短时过滤当前列表，避免刷新回弹；不能把被清空的联系人写成本地历史。
- `state.listCountSources` 仍可用于内部日志，但不能渲染给客服。
- 如果后续要恢复“清空后进入历史”，必须通过真实客户端抓包确认服务端如何迁移历史，而不是在 Web 端伪造。
- 如果用户再次反馈“数据对不上客户端”，第一步检查浏览器 `localStorage.youchat.apiBase` 和 `logs/api-capture.ndjson` 里的 `target`，确认 Web 是否已经打到第 33 节确认的飞牛地址 `http://192.168.9.83:18080/api`。

验证：

- `npm run check` 通过。
- `git diff --check` 通过。
- `GET http://localhost:5177/health` 返回 200。
- `GET http://localhost:5177/app.js` 返回 200，长度 215829。
- `GET http://localhost:5177/styles.css` 返回 200，长度 56097。
- 已导出 patch：见 `patches/youchat-dev-web-patch-*.zip`，以本次提交新增的最新 zip 为准。

提交注意：

- `logs/api-capture.ndjson` 是运行抓包日志，包含旧目标请求记录，本次不提交。

## 32. 2026-06-08 输入区模块化隔离修复

用户反馈：

- 聊天输入框、工具栏、图片托盘和 AI 推荐又挤在一起。
- 不能继续靠一个框架里互相影响的高度计算修补，应该分模块写，避免谁影响谁。

问题原因：

- 旧版本把 `#aiSuggestionCard` 做成 `.chat-pane` 内的绝对定位浮层。
- 旧版本再用 `ResizeObserver` 计算 `.composer` 和推荐条高度，写入：
  - `--composer-height`
  - `--ai-suggestion-height`
- `.message-list`、`.ai-suggestion-card` 和 `.composer` 互相依赖这些动态高度，图片托盘、AI 推荐、工具栏一变就容易重排、跳动或压扁输入框。
- `.composer-tools` 在宽度不足时会换行，把编辑区高度挤掉。

本次实现：

- `public/index.html`
  - `#aiSuggestionCard` 改为独立 `section`，位于 `#messageList` 和 `footer.composer` 之间。
  - `footer.composer` 拆成四个独立模块：
    - `.composer-tools`
    - `.composer-attachments`
    - `.composer-editor`
    - `.composer-actions`
- `public/styles.css`
  - `.chat-pane` 改为 `58px minmax(0, 1fr) auto auto`，即头部、消息区、AI 推荐区、输入区四行。
  - `.message-list` 不再使用基于 `--ai-suggestion-height` 的底部 padding。
  - `.ai-suggestion-card` 不再 `position:absolute`，改为正常 grid 行。
  - `.composer` 使用固定模块行：工具条、附件、编辑器、发送区。
  - `.composer-tools` 改成单行横向滚动工具带，带独立边框，不允许换行压缩输入区。
  - `.composer-editor` 单独承载 textarea，保持自己的高度和滚动。
- `public/app.js`
  - 删除 `composerResizeObserver`。
  - 删除 `observeComposerLayout()`。
  - 删除 `updateComposerLayoutMetrics()`。
  - 删除工作台显示、草稿图片渲染、AI 推荐渲染时的动态高度测量调用。

验证：

- `npm run check` 通过。
- Chrome headless 真实布局验证通过，测试场景包含：
  - 12 条聊天消息。
  - 3 条 AI 推荐。
  - 1 张草稿图片。
  - 宽度 1224，高度 768。
- 关键测量：
  - `.composer-tools`：38px。
  - `.composer-attachments`：74px。
  - `.composer-editor` / textarea：82px。
  - `.composer-actions`：30px。
  - 模块间距均为 6px。
  - `overlap=false`。
- 截图输出：`composer-layout-check.png`，仅作本地验证截图，不提交。

后续禁止回退：

- 不要把 `#aiSuggestionCard` 放回 `.composer` 内部。
- 不要把 `#aiSuggestionCard` 改回绝对定位浮层。
- 不要恢复 `--composer-height`、`--ai-suggestion-height` 或 `ResizeObserver` 动态高度方案。
- 不要让 `.composer-tools` 换行；按钮不够宽时横向滚动，不能压缩输入框。

## 33. 2026-06-08 飞牛 youchat 服务端链路回正

用户纠正：

- 当前二开目标不是连接悠聊正式服，而是连接用户已经部署在飞牛里的悠聊服务端。
- 飞牛地址：`http://192.168.9.83/`。
- SSH 用户：`Boom`。
- 用户明确提到要看 `youliaoapp` / 悠聊 Docker 相关内容，不能继续只改 Web 壳或默认正式服。

本次实际巡检结果：

- 本机安装客户端路径：`C:\Program Files\youchat-desktop`。
- 安装包不是 git 工程，主要包含：
  - `appsettings.json`
  - `bin\appsettings.json`
  - `bin\YouChatService.xml`
  - `wwwroot`
  - `resources\app.asar`
- Windows 客户端配置仍保留正式服：
  - `DefaultOptions.ServerAddr = 139.196.171.27`
  - `DefaultOptions.SocketPort = 7190`
  - `DefaultOptions.ChatServiceUrl = https://im.52youzai.com/api`
- 但用户当前要对齐的是飞牛 Docker 部署，不是这个正式服默认值。

飞牛服务发现：

- `http://192.168.9.83/` 是飞牛 fnOS 面板。
- SSH 22 可达，`Boom` 用户可登录。
- 飞牛上发现真实悠聊部署目录：
  - `/vol1/1000/Docker/youchat`
- 关键文件：
  - `/vol1/1000/Docker/youchat/docker-compose.yml`
  - `/vol1/1000/Docker/youchat/.env`
  - `/vol1/1000/Docker/youchat/YouChatService`
  - `/vol1/1000/Docker/youchat/YouChatService.xml`
  - `/vol1/1000/Docker/youchat/wwwroot`
  - `/vol1/1000/Docker/youchat/YouChatService.postman_collection.json`
- Docker compose 端口：
  - `youchat-service`: host `18080` -> container `8080`
  - `youchat-control`: host `18081` -> container `8081`
- `.env` 显示当前数据库模式为 MySQL：
  - `YOUCHAT_DATABASE_MODE=mysql`
  - `YOUCHAT_DB_HOST=mysql`
  - `YOUCHAT_DB_PORT=3306`
  - `YOUCHAT_DB_NAME=1556504756803862529`
  - `YOUCHAT_DB_USERNAME=yz`

接口验证：

- `POST http://192.168.9.83:18080/api/System/GetOptions` 返回 200。
- 返回内容包含真实数据库连接：`Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;...`
- `POST http://192.168.9.83:18080/api/System/LogIn` 使用 `boom / 950331` 返回：
  - `{"success":true,"message":"","data":true}`
- `POST http://192.168.9.83:18080/api/Summary/LogIn` 使用 `boom / 950331` 返回 Bearer JWT。
- `GET http://192.168.9.83:18080/api/System/GetOptions` 返回 404，所以以后探测悠聊业务接口时不能用 GET 误判接口不存在，优先使用 POST。

本次修复：

- `public/app.js`
  - `DEFAULT_API_BASE` 改回 `http://192.168.9.83:18080/api`。
  - `LEGACY_DEFAULT_API_BASES` 改为迁移旧的错误目标：
    - `https://im.52youzai.com/api`
    - `http://127.0.0.1:8080/api`
    - `http://localhost:8080/api`
  - 登录页默认 host 改为 `192.168.9.83`，端口保持 `18080`。
  - `parseApiBase()` 异常 fallback 改为飞牛目标。
- `server.js`
  - `DEFAULT_API_BASE` fallback 改回 `http://192.168.9.83:18080/api`。
- `start-dev-web.ps1`
  - `YOUCHAT_API_BASE` 改为 `http://192.168.9.83:18080/api`，避免启动脚本继续覆盖成 `localhost:8080`。
- `README.md`
  - 启动说明改为飞牛 Docker 服务。
  - 说明旧正式服地址会自动迁回飞牛地址。
- `AI_HANDOFF.md`
  - 默认 API 目标、飞牛部署路径、端口映射、POST 探测规则已更新。

重要新规则：

- 这条项目线的默认真实数据源是飞牛悠聊 Docker：`http://192.168.9.83:18080/api`。
- 不要再把默认值改回 `https://im.52youzai.com/api`，除非用户明确说要连正式服。
- 如果数据对不上，第一步看：
  - 浏览器 `localStorage.youchat.apiBase`
  - `logs/api-capture.ndjson` 里的 `target`
  - `/vol1/1000/Docker/youchat` 的 compose 和 `.env`
- 检查 API 是否存在时优先 POST，不要用 GET 404 下结论。

## 34. 2026-06-08 飞牛 MySQL 排序规则修复

用户反馈：

- Web 二开客户端拿不到联系人和聊天信息。
- 随后用户重启官方 Windows 客户端，官方客户端也拿不到信息。
- 因此本次不再继续先改 Web UI，而是优先排查飞牛 Docker 服务端。

服务端状态：

- 飞牛地址：`192.168.9.83`。
- 悠聊部署目录：`/vol1/1000/Docker/youchat`。
- `youchat-service`、`youchat-mysql`、`youchat-autologin`、`youchat-control` 均在运行。
- `POST http://192.168.9.83:18080/api/System/GetOptions` 正常返回。
- `POST http://192.168.9.83:18080/api/System/GetAccountInfo` 正常返回 `realName=Boom`。
- `GET http://192.168.9.83:18080/api/Senstive/GetAccountList` 正常返回客服账号 `Boom666 / 客服-王`。
- 故障时 `POST /api/Contact/GetContactList` 返回裸 `data:0`，`POST /api/ChatContent/GetList` 会触发错误。

关键日志：

- 日志文件：`/vol1/1000/Docker/youchat/logs\Boom-1556504756803862529/20260608/error_20260608.log`。
- 高频错误：
  - `Illegal mix of collations for operation 'UNION'`
  - 报错位置包含 `ChatContentService.GetList`、`ChatContentService.ComsumMessage`、`ConversationDetectiveJob`。
- 这说明服务端在 UNION 多张聊天分表时，MySQL 字符集排序规则不一致，导致聊天记录和会话检测查询失败。官方客户端和 Web 都依赖同一个服务端，所以会一起异常。

数据库发现：

- 数据库：`1556504756803862529`。
- 旧聊天分表和核心表大多是 `utf8mb4_general_ci`：
  - `ChatContent_2026_06_01`
  - `Contact`
  - `Conversation`
  - 其他历史 `ChatContent_YYYY_MM_DD`
- 2026-06-08 新建的聊天分表是 `utf8mb4_unicode_ci`：
  - `ChatContent_2026_06_08`
- 数据库默认排序规则当时也是 `utf8mb4_unicode_ci`，导致后续新分表继续可能继承错误默认值。

已执行修复：

- 修复前备份：
  - `/vol1/1000/Docker/youchat/docker-control/db-backups/pre-collation-fix-20260608-160844.sql.gz`
  - 已用 `gzip -t` 验证可读。
  - `mysqldump` 曾提示缺少 `PROCESS` 权限读取 tablespace，但 dump 文件完整结束并可解压。
- 修复 SQL：

```sql
ALTER DATABASE `1556504756803862529`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `ChatContent_2026_06_08`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

- 修复后干净备份：
  - `/vol1/1000/Docker/youchat/docker-control/db-backups/post-collation-fix-20260608-161035.sql.gz`
  - 使用 `--no-tablespaces` 重新备份，已通过 `gzip -t`。

验证结果：

- `POST /api/Contact/GetContactList` 恢复真实联系人数据：
  - 当前列表返回 `total=29`。
  - JSON 请求可返回全量口径 `total=8033`。
  - 示例联系人包含真实 `userName`、`nickName`、`userRemark`、`unRead`、`records`。
- `POST /api/ChatContent/GetList` 恢复真实聊天记录：
  - `contactId=3032` 返回文字和图片消息。
  - `contactId=7602` 返回真实历史消息。
- 16:08 之后日志不再新增同类 `Illegal mix of collations for operation 'UNION'` 错误。

残留注意：

- `POST /api/System/CheckLoginStatus` 单独仍可能超时或在缺少参数时记录 `Value cannot be null. (Parameter 's')`。
- 这不是本次联系人和聊天记录为空的主因，但后续如果需要精确复刻登录状态检查，应抓官方客户端实际请求参数。

未来排查规则：

- 如果官方客户端和 Web 同时拿不到联系人/聊天记录，优先查服务端日志和 MySQL，不要先怀疑 Web UI。
- 如果下一周新建 `ChatContent_YYYY_MM_DD` 分表后再出现同样错误，先检查该表 `TABLE_COLLATION` 是否又变成非 `utf8mb4_general_ci`。
- 新建分表异常的根本防线是保持数据库默认排序规则为 `utf8mb4_general_ci`。
- 排查命令口径：

```sql
SELECT TABLE_NAME, TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME LIKE 'ChatContent_%'
ORDER BY TABLE_NAME DESC;

SELECT COLLATION_NAME, COUNT(*)
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND COLLATION_NAME IS NOT NULL
GROUP BY COLLATION_NAME
ORDER BY COUNT(*) DESC;
```

## 35. 2026-06-08 Web 刷新后当前会话混入历史修复

用户反馈：

- Web 客户端刷新后会出现一些莫名其妙的对话。
- 会话数量也不对，曾出现类似 `当前(8034)` 的异常数量。
- 官方 Windows 客户端没有这个情况。

根因确认：

- 这次不是服务端故障，而是 Web 前端的当前会话兜底逻辑不严谨。
- 官方接口文档 `C:\Program Files\youchat-desktop\bin\YouChatService.xml` 明确写着：
  - `/Contact/GetContactList` 传入 `accountId` 表示获取客服当前会话列表。
  - `isGuestbook` 表示留言列表。
  - `isHistory` 表示历史聊天列表。
- 真实接口探针结果：
  - `GET /Senstive/GetAccountList` 返回当前客服 `Boom666 / 客服-王`，短客服 id 是 `id=2`，后台长账号号是 `accountId=1556504756803862529`。
  - `POST /Contact/GetContactList` 带 `accountId=2` 返回当前会话：`total=2`，记录均为 `conversationId>0/accountId>0`。
  - `POST /Contact/GetContactList` 不带 `accountId` 返回全量联系人：`total=8034`，其中大量记录是 `conversationId=0/accountId=0` 的历史或已结束会话。
  - `POST /Contact/GetContactList` 带 `isHistory=true` 返回历史：`total=5707`。
  - `POST /Contact/GetContactList` 带 `isGuestbook=true` 当前返回 `total=0`。

已修改：

- `public/app.js`
  - `fetchContactListWithFallback()` 当前 tab 不再优先使用无 `accountId` 的全量列表。
  - 当前 tab 会先使用 `/Senstive/GetAccountList` 解析出的短客服 id，再带 `accountId=2` 查询。
  - 无候选客服 id 时才允许走全量兜底，且全量兜底必须经过 `conversationId>0 && accountId>0` 过滤。
  - `fetchContactListPayload()` 对 `global-filtered` 当前会话源强制使用过滤后的 `contacts.length` 作为数量，避免把接口 `total=8034` 带到 UI。
  - 新增 `isCurrentConversationContact()` 和 `filterCurrentConversationContacts()`。
  - `shouldPreserveEmptyContactResult()` 和 `loadContactCounts()` 只在现有列表本身都是真实当前会话时才保留旧列表，避免把已污染的全量列表继续保留下来。
  - `CONTACT_LIST_ACCOUNT_ID_PATTERN` 限定当前会话用的客服 id 必须是短数字 id，防止把 `1556504756803862529` 这种后台长账号号当成 `GetContactList.accountId`。
  - `loadContactListAccountIds()`、`persistContactListAccountIds()`、`getContactListAccountCandidates()`、`extractContactListAccountIds()` 都使用短 id 过滤。

验证结果：

- `npm run check` 通过。
- 真实 API 探针通过：
  - `accountId=2` 当前列表：`total=2 / current_like=2`。
  - 无 `accountId` 全量列表：`total=8034`，只作为诊断，不再作为当前列表数量。
  - `isHistory=true`：`total=5707`。
  - `isGuestbook=true`：`total=0`。
- 浏览器连接 `http://localhost:5177` 后验证：
  - 会话头显示 `2 个客户`。
  - 底部 tab 显示 `当前(2)`、`留言(0)`、`历史(5707)`。
  - 当前列表只显示真实当前会话 `contactId=412` 和 `contactId=2303`。
- `logs/api-capture.ndjson` 最新自动刷新请求显示：
  - 当前列表请求均带 `accountId=2`。
  - 自动刷新不再持续请求无 `accountId` 的 `8034` 全量当前列表。

未来维护规则：

- 当前会话列表必须带短客服 `accountId`，目前真实值是 `2`。
- 不要把 `/Senstive/GetAccountList.accountId` 的长后台账号号当作 `/Contact/GetContactList.accountId`。
- 不带 `accountId` 的 `/Contact/GetContactList` 是全量联系人/混合口径，不能直接显示在“当前”。
- 如果将来服务端返回当前为空，只有现有列表已经全部满足 `conversationId>0/accountId>0` 时才允许保留旧列表。
- 如果又出现 `当前(几千)`，第一步检查 `logs/api-capture.ndjson` 中当前 tab 的 `/Contact/GetContactList` 请求体是否丢了 `accountId=2`。

## 36. 2026-06-08 聊天消息卡片分类渲染

用户反馈：

- 链接类、小程序类、文件类消息不能都按普通文本或同一种链接卡片显示。
- 小程序应参考微信卡片：标题、描述、绿色小程序标识。
- 文件应参考微信电脑版文件卡：文件名、大小、右侧文件类型图标、底部来源。

真实接口和枚举：

- `C:\Program Files\youchat-desktop\bin\YouChatService.xml` 中 `EnumContentType`：
  - `CtCard`：URL 卡片。
  - `CtWeapp`：小程序。
  - `CtFile`：文件。
- 真实抓包统计里常见类型：
  - `contentType=5`：URL/网页卡片，字段通常是 `cardTitle/cardDesc/cardImg/cardUrl`。
  - `contentType=6`：小程序，字段通常是 `miniProTitle/miniProName/miniProDesc/miniProImg/miniProUrl`。
  - `contentType=8`：文件，当前真实样本的 `content` 是 JSON，例如：
    - `{"Title":"中交（长沙）建设有限公司2453343（机械租赁费）.pdf","Type":74,"TypeStr":"[应用消息]","disForward":0,"version":0}`
- 真实文件样本：
  - `contactId=491`
  - `contentType=8`
  - 文件名：`中交（长沙）建设有限公司2453343（机械租赁费）.pdf`

已修改：

- `public/app.js`
  - `renderMessageContent()` 分流顺序改为：图片 -> 文件卡 -> 小程序卡 -> 网页/链接卡 -> 文本。
  - 新增 `shouldRenderRichMessageCard()`，统一让富卡片气泡去掉普通文本 padding/background。
  - 新增 `buildMessageMiniProgramCard()` / `renderMessageMiniProgramCard()`。
  - 新增 `buildMessageFileCard()` / `renderMessageFileCard()`。
  - 新增 `parseMessagePayload()`，兼容 JSON 和基础 XML payload，用于解析文件名、文件大小、小程序标题等字段。
  - 新增 `formatFileSize()`、`getFileExtension()`、`getFileIconMeta()` 等文件显示辅助。
  - `buildMessageLinkCard()` 不再把小程序字段混进网页卡片，避免 `contentType=6` 被错误渲染成普通链接预览。
- `public/styles.css`
  - 新增 `.message-mini-card`，两段式白色小程序卡片，绿色圆形小程序标识。
  - 新增 `.message-file-card`，灰底文件卡片，支持 Word/Excel/PPT/PDF/压缩包等文件图标色。
  - `.message-content.has-rich-card` 去除普通气泡样式。
  - 右侧聊天记录 `.history-chat-list .message-content.has-rich-card` 单独覆盖，防止历史面板把富卡片重新加 padding 挤坏。

验证结果：

- `npm run check` 通过。
- `git diff --check` 只有 Windows 换行提示。
- 本地临时预览页验证后删除，卡片尺寸：
  - 小程序：约 `260x118`。
  - 文件：约 `340x126`。
  - 网页卡片：约 `320x135`。

维护规则：

- 不要再把 `contentType=6` 小程序交给 `buildMessageLinkCard()`。
- 不要删除 `.history-chat-list .message-content.has-rich-card` 覆盖，否则右侧工具栏聊天记录会把卡片挤回普通气泡。
- 如果后续抓到更多文件字段，例如 `FileSize/fileUrl/cdnattachurl`，优先扩展 `parseMessagePayload()` 和 `buildMessageFileCard()`，不要写一次性字符串拆分。

## 37. 2026-06-08 Skill 优化回写与命中态排序

用户反馈：

- 客服没有采用 AI 推荐或 skill 推荐，而是自己按新策略回复时，系统应该学习“我是怎么回复的”。
- 如果已经命中 skill，但推荐和 skill 的话术不正确，点击“优化”后应能把当前 skill 回复改掉，否则优化按钮意义不大。
- 右侧工具栏的 skill 列表要有动态变化：skill 开着并命中后，命中项最亮、跑到最上面，其他没命中的项变灰。

已修改：

- `public/app.js`
  - `sendText()` 在发送前保存当前命中的 skill，避免发送完成后清空推荐导致学习对象丢失。
  - `learnFromManualReply(content, imageUrls, { matchedSkill })` 新增命中 skill 学习路径。
  - 新增 `learnMatchedSkillOverride()`：
    - 当客服未采用推荐而人工发送时，如果当前命中 skill，则把人工回复写入该 skill 的 `manualOverrides`。
    - 同一个 prompt/reply 重复出现会增加 `count`，避免无限堆重复样本。
    - 累计人工纠正达到 3 次后，自动把人工回复回写到该 skill 的 `replySteps/fallback`。
    - 回写时通过 `mergeTextWithExistingSkillImages()` 保留原 skill 的图片步骤，并记录人工发送成功后的真实图片 URL。
  - 新增 `replaceReplySkill()`，复用现有 `/local/reply-skills` 持久化接口保存整个 skill 文件。
  - 新增 `updateSkillFromSuggestion()`：
    - skill 优化候选上显示“更新skill”按钮。
    - 点击后立即把优化后的文字写回当前 skill 的 `replySteps/fallback`。
    - 更新后记录 `revisionCount` 和 `lastOptimizedAt`。
  - `renderAiSuggestionCard()` 对 `type="optimize"` 且带 `skillId` 的候选渲染“更新skill”主按钮。
  - `renderSkillReplyPanel()`、`filterReplySkills()`、`renderSkillRow()` 变为命中态驱动：
    - 命中的 skill 排第一。
    - 命中项显示“中”标记。
    - 未命中项加 `is-dimmed`。
    - 命中 skill 的人工纠正次数显示在关键词行。
- `public/styles.css`
  - 新增 `.ai-suggestion-row-actions .mini-action.primary`，让“更新skill”成为明确主操作。
  - 新增 `.skill-list.has-active-match`、`.skill-row.is-matched`、`.skill-row.is-dimmed`。
  - 命中项有蓝色高亮、轻微上浮、短动画 `skill-match-rise`。
  - 未命中项灰度降低，hover 时恢复可读性，仍然可以点击采用/发送/优化。

验证结果：

- `npm run check` 通过。
- `git diff --check` 仅提示 Windows 换行转换，不存在实际空白错误。

维护规则：

- 不要让“优化”只停留在临时候选。对 skill 优化候选必须保留“更新skill”入口。
- 不要把命中 skill 的人工回复另建成孤立 learned skill；优先沉淀回当前命中的 skill。
- 3 次自动回写是保守阈值，避免一次误回复污染内置话术。若用户后续要求更激进，可把阈值抽成配置。
- 命中 skill 回写时要保留原图片步骤，除非用户明确要求替换图片。
- 右侧 skill 列表的置灰只是视觉状态，不是禁用状态；客服仍可手动选择其他 skill。

## 38. 2026-06-08 知名网站链接卡片 Logo 兜底

用户反馈：

- 小红书、快手、1688、得物这类知名网站链接，如果接口没有返回商品/网页缩略图，右侧缩略块不应该只显示域名缩写或空白。
- 知名网站可以直接用 logo 当作卡片图片，让客服一眼识别平台。

已修改：

- `public/app.js`
  - 新增 `KNOWN_SITE_LOGOS`，覆盖：
    - 小红书：`xiaohongshu.com`、`xhslink.com`
    - 快手：`kuaishou.com`、`gifshow.com`、`ksurl.cn`、`kwai.com`
    - 1688：`1688.com`
    - 得物：`dewu.com`、`poizon.com`
    - 淘宝、天猫、京东、拼多多、抖音、Bilibili、微博、知乎、美团、饿了么
  - 新增 `getKnownSiteMeta()`，按链接 hostname 匹配主域和子域。
  - 新增 `getKnownSiteLogoDataUrl()`，生成本地 SVG 品牌兜底图，避免外链 logo 加载失败后卡片空白。
  - `buildMessageLinkCard()` 现在仍优先使用真实消息字段和真实预览图：
    - `message.cardImg`
    - `state.linkPreviewCache[url].image`
    - 知名站点 logo fallback
  - `renderMessageLinkCard()` 对知名站点 logo 加 `imageKind="site-logo"`，并给 favicon 设置 `onerror` 回退到本地 SVG。
- `public/styles.css`
  - 新增 `.link-card-thumb.is-site-logo`，让 logo 居中显示为 48x48 的品牌块，真实缩略图仍按原逻辑铺满裁切。

维护规则：

- 真实缩略图永远优先，不要用 logo 覆盖接口返回的 `cardImg` 或预览接口抓到的 `og:image`。
- 知名网站没有真实缩略图时，允许使用站点 logo 作为平台识别 fallback，这不属于假商品图。
- 如果新增更多平台，只扩展 `KNOWN_SITE_LOGOS`，不要在 `renderMessageLinkCard()` 里写特殊分支。
- 外链 favicon 可能被拦截，所以必须保留本地 SVG `imageFallback`。

## 39. 2026-06-08 原生客户端右上角功能区

用户反馈：

- 原生 Windows 客户端右上角除了 AI 设置外，还有一组客户端功能：
  - 设置
  - 数据库管理
  - 挂起
  - 退出登录
  - 关闭程序
  - 统计后台
  - 聊天记录全局搜索
  - 消息统计面板
  - 通知
- Web 版此前把右上角齿轮直接做成 AI 设置，和原生客户端设置混在一起。
- 需要把原生客户端功能按钮、真实接口、图标和弹窗样式一起完善，并和 Web AI 设置明确区分。

原生接口来源：

- `C:\Program Files\youchat-desktop\bin\YouChatService.xml`
  - `ChatContentController.SearchList(contacts, robots, keyWord, startTime, endTime, index, size)`
  - `NoticeController.GetEvents(warnType)`
  - `NoticeController.GetList(msgType, warnType, eventType, startTime, endTime, accountId, robotId, index, size)`
  - `NoticeController.ConsumeNotice(noticeId)`
  - `SummaryController.RealTimeSummary(startTime, endTime)`
  - `ChatContentController.Delete(startTime, endTime)`
  - `SystemController.GetConnectionString`
  - `SystemController.SetConnectionString(connectionString, DbType)`
  - `SystemController.GetOptions`
  - `SystemController.SetOptions(dataBaseOptions, commonOptions, jobOptions, aiOptions)`
- `C:\Program Files\youchat-desktop\wwwroot\fontIcon\iconfont.json`
  - `聊天记录`：`\e60c`
  - `配置管理`：`\e605`
  - `统计概览`：`\e600`
  - `工作量/图表`：`\e607`
  - `退出登录`：`\e60f`
  - `高级搜索`：`\e665`

已修改：

- `public/index.html`
  - 顶栏新增 `.client-top-actions` 原生客户端按钮组：
    - `clientBackendButton`：统计后台
    - `clientGlobalSearchButton`：聊天记录全局搜索
    - `clientStatsButton`：消息统计面板
    - `clientNoticeButton`：通知，带 `clientNoticeBadge`，最多显示 `99+`
    - `clientSettingsButton`：客户端设置菜单
  - 新增 `clientSettingsMenu` 菜单：
    - 设置
    - 数据库管理
    - 挂起/恢复
    - 退出登录
    - 关闭程序
  - AI 设置改为独立 `ai-top-button`，使用 AI 图标和 `AI` 文本，和客户端齿轮用分隔线隔开。
- `public/app.js`
  - 新增 `CLIENT_PAUSED_STORAGE_KEY`、`GLOBAL_SEARCH_PAGE_SIZE`、`CLIENT_NOTICE_PAGE_SIZE`。
  - `state` 新增：
    - `clientPaused`
    - `clientOptions`
    - `globalSearch`
    - `clientStats`
    - `clientNotice`
  - 新增客户端设置菜单逻辑：
    - `toggleClientSettingsMenu()`
    - `handleClientSettingsMenuClick()`
    - `toggleClientPause()`
    - `updateClientChromeState()`
  - `挂起` 是 Web 本地暂停自动刷新，因为当前 XML 没有找到明确服务端挂起接口；状态持久化到 `localStorage`。
  - `统计后台` 使用当前 API 地址推导 `/abnormal` 页面，例如 `http://192.168.9.83:18080/abnormal`。
  - 新增 `showClientOptionsModal()`：
    - 读取 `/System/GetOptions`
    - 分组展示 `commonOptions/jobOptions/aiOptions/dataBaseOptions`
    - 保存调用 `/System/SetOptions`
    - 明确说明这是悠聊服务端 AI 配置，不覆盖 Web AI 推荐设置。
  - 新增 `showDatabaseModal()`：
    - 按原客户端“数据库管理 -> 删除聊天记录”窗口实现。
    - 日期范围输入提交到 `/ChatContent/Delete`。
    - 确认按钮默认禁用，必须输入 `我已知晓删除的聊天记录无法恢复`。
    - 旧的连接串读取/保存入口不再挂到该菜单，避免误把高风险数据库连接改动当成截图里的数据库管理功能。
  - 新增 `showGlobalSearchModal()`：
    - 调用 `/ChatContent/SearchList`
    - 支持关键字、用户/ID/备注、机器人、日期范围、分页
    - 结果表含用户、机器人、来源、消息内容、发送时间、复制
    - 搜索结果内链接继续走已有链接预览。
  - 新增 `showClientStatsModal()`：
    - 调用 `/Summary/RealTimeSummary`
    - 当前真实返回是嵌套结构：`{ success, data: { success, data: [...] } }`
    - 分段字段为：`it/count/fromUser/fromUserRedpointCount/fromRobot/fromKefu/contactCount`
    - 指标卡按真实分段汇总：消息总量、用户普通消息、用户红点消息、机器人消息、客服回复、触达客户、峰值客户、时间分段
    - 用内联 SVG 绘制趋势，带网格和时间刻度，不引入新依赖。
  - 新增 `showClientNoticeModal()`：
    - 调用 `/Notice/GetList`
    - 调用 `/Notice/GetEvents`
    - 支持分页、复制和 `/Notice/ConsumeNotice`
    - 当前真实通知列表返回总数为 `data.total.value`，列表为 `data.data`。
    - 自动刷新链路中追加 `loadClientNoticeBadge()`，失败只写日志，不影响客服主路径。
  - `openToolModal()` 新增 `size` 变体：
    - `tool-modal-wide`
    - `tool-modal-large`
    - `tool-modal-xl`
  - 新增通用辅助：
    - `clonePlainObject()`
    - `castLike()`
    - `splitListValue()`
    - `toDateTimeLocal()`
    - `fromDateTimeLocal()`
    - `formatFullTime()`
    - `humanizeKey()`
    - `contentTypeName()`
    - `unwrapPayloadData()`
    - `getRecordsDeep()`
    - `getTotalDeep()`
    - `estimateNoticeUnread()`
- `public/styles.css`
  - 补齐原生 iconfont 映射：
    - `client-icon-dashboard`
    - `client-icon-chat-record`
    - `client-icon-chart`
    - `client-icon-notice`
    - `client-icon-database`
    - `client-icon-pause`
    - `client-icon-logout`
  - 新增顶栏按钮、角标、分隔线、AI 按钮和客户端设置菜单样式。
  - 新增客户端功能弹窗样式：
    - 全局搜索表格
    - 设置分组
    - 原始 JSON 查看
    - 消息统计指标和 SVG 图表
    - 通知列表
    - 删除聊天记录弹窗

验证结果：

- `npm run check` 通过。
- `git diff --check` 通过，仅有 Windows CRLF 提示。
- 浏览器打开 `http://localhost:5177` 可正常加载登录页，页面标题为 `悠聊 Web 客服工作台`。
- 本地服务 `http://localhost:5177` 返回 200。
- 直连飞牛接口验证：
  - `/System/GetOptions` 返回真实 `commonOptions/jobOptions/aiOptions/dataBaseOptions`。
  - `/Summary/RealTimeSummary` 返回真实嵌套分段数组。
  - `/Notice/GetList` 返回真实 `{ total: { value: 0 }, data: [] }`。
  - `/ChatContent/SearchList` 返回真实 `{ total: 0, list: [] }`。
- 浏览器插件可以读取登录页 DOM，但自动输入/点击时遇到插件虚拟剪贴板限制；本轮没有继续用浏览器强行绕过登录态，也没有提交任何假数据或模拟用户。

维护规则：

- AI 设置入口必须继续和客户端齿轮分开，避免把 Web AI 配置误写入悠聊服务端配置。
- `挂起` 目前只暂停 Web 自动刷新。如果后续抓包确认原生客户端有服务端挂起接口，再替换 `toggleClientPause()`。
- 全局聊天搜索必须用 `/ChatContent/SearchList`，不要用当前会话 `/ChatContent/GetList` 冒充全局结果。
- 消息统计快速面板用 `/Summary/RealTimeSummary`；统计后台按钮打开 `/abnormal`，二者不是同一个入口。
- 通知角标目前按 `/Notice/GetList` 返回结构自适应，若抓包确认有未读专用字段或接口，应优先改 `loadClientNoticeBadge()`。
- `getData()` 是全局老函数，不要为了统计/通知粗暴改它；深层嵌套取数统一用 `unwrapPayloadData()`、`getRecordsDeep()`、`getTotalDeep()`，避免影响联系人、订单、快捷回复等旧链路。
- 本地 `/api` 代理偶发 `fetch failed` 时，先用直连 `http://192.168.9.83:18080/api/...` 分辨是代理请求格式/连接复用问题，还是飞牛服务端真实失败。
- 客户端设置保存有风险，后续改字段时必须保留原始 JSON 查看区，方便确认真实服务端返回结构。

## 40. 2026-06-08 Skill 图片回写、混合粘贴与发送防重复

用户反馈：

- 文字优化后点击“更新skill”可以改文字，但当前草稿里的图片不会进入 skill，后续 skill 发送仍然只有文字。
- 剪贴板里同时有文字和图片时，浏览器只把文字粘进输入框，图片需要再粘贴一次。
- 图片希望像原客户端一样出现在输入框内部左侧，而不是单独占一整行挤压输入区。
- 点击发送后服务端会排队，消息不会马上回流到消息列表，客服连续点击会造成重复发送。

已修改：

- `public/app.js`
  - 新增 `getClipboardImageFiles()`，同时读取 `clipboardData.files` 和 `clipboardData.items`，解决部分来源图片只在 items 里的问题。
  - `handleReplyPaste()` 改为混合粘贴：剪贴板同时有文字和图片时不阻止默认文字粘贴，同时把图片加入 `state.draftImages`；纯图片粘贴才阻止默认行为。
  - 新增 `uploadDraftImagesForSkill()`，复用现有 `uploadChatImage()`，只上传草稿图片拿真实 URL，不提前发送给客户。
  - `showSaveSkillModal()` 会提示当前草稿图片数量。
  - `saveSkillFromModal()` 保存 skill 时写入文字步骤和当前草稿图片步骤。
  - `updateSkillFromSuggestion()` 点击“更新skill”时，会先上传当前草稿图片，再把优化文字和图片 URL 回写到该 skill。
  - `mergeTextWithExistingSkillImages()` 对图片 URL 去重，并继续保留原 skill 里的旧图片步骤。
  - `refreshAiSuggestion()` 保留原优化候选的 `skillId`，避免“换一换”后无法继续更新原 skill。
  - 新增 `state.sendingMessage`、`updateSendControls()`、`withSendingLock()`。
  - `sendText()` 和 `sendSuggestionSteps()` 入口套发送锁，提交过程中主发送、AI 推荐发送、skill 行发送都会禁用，按钮显示“发送中...”。
  - `renderSkillRow()` 显示 `含 N 张图`，并在发送中禁用采用/发送/优化按钮。
- `public/index.html`
  - `#draftImageTray` 从 `.composer-attachments` 移到 `.composer-editor` 内部，图片托盘成为输入框左侧区域。
- `public/styles.css`
  - `.composer-editor` 改成 grid 容器，有草稿图片时为 `82px + 文本框` 两列。
  - `.draft-image-tray` 改成输入框左侧附件栏，图片固定缩略图并显示 `共 N 个图片`。
  - 有图片时 composer 高度降低到 `min-height: 206px`、`max-height: min(306px, 38dvh)`，避免图片托盘过度挤压聊天区。
  - 补齐禁用按钮视觉态。
- `server.js`
  - `normalizeLearnedSkill()` 保留 `manualOverrides`、`revisionCount`、`lastManualOverrideAt`、`lastAutoRevisedAt`、`lastOptimizedAt`，避免 skill 学习/保存时把人工纠正和优化历史洗掉。

验证结果：

- `npm run check` 通过。
- 本轮浏览器控制工具未暴露可用的本地截图/操作接口，因此没有声明截图 QA。

维护规则：

- skill 图片必须存真实可发送 URL。不要把 `blob:`、`File`、本地 object URL 或 base64 临时预览写入 `data/reply-skills.json`。
- `uploadDraftImagesForSkill()` 只负责上传并返回步骤，不调用 `/ChatContent/SendMsg`。
- 如果用户点击“更新skill”时草稿里有新图片，应把新图片加到 skill，同时保留旧图片并按 URL 去重。
- 不要把 `#draftImageTray` 再移回独立附件行；当前设计是输入框内部左侧附件栏。
- 发送锁是前端防重复提交层，不替代服务端幂等。后续若服务端提供消息 requestId/idempotency key，再加服务端级防重。

## 41. 2026-06-09 数据库管理删除聊天记录

用户反馈：

- 原客户端截图里的“数据库管理”实际是“删除聊天记录”功能，不是数据库连接字符串编辑。
- Web 版需要按原客户端窗口补齐：标题为“数据库管理”，内部只有“删除聊天记录”页签、日期范围、确认删除输入框和确认按钮。

原生接口来源：

- `C:\Program Files\youchat-desktop\bin\YouChatService.xml`
  - `ChatContentController.Delete(System.DateTime startTime, System.DateTime endTime)`
  - summary：`删除聊天记录`

已修改：

- `public/app.js`
  - 新增 `DATABASE_DELETE_CONFIRM_TEXT = "我已知晓删除的聊天记录无法恢复"`。
  - 新增 `state.databaseDelete`，保存开始日期、结束日期、确认文案和删除中状态。
  - `showDatabaseModal()` 改成删除聊天记录弹窗，不再读取 `/System/GetConnectionString`。
  - `renderDatabaseModal()` 渲染：
    - `删除聊天记录` 激活页签
    - `databaseDeleteStart`、`databaseDeleteEnd` 日期输入
    - `databaseDeleteConfirm` 确认输入和 `0 / 50` 字数提示
  - `deleteChatRecordsFromModal()` 调用真实接口：
    - `POST /ChatContent/Delete`
    - `startTime: YYYY-MM-DD 00:00:00`
    - `endTime: YYYY-MM-DD 23:59:59`
  - 确认按钮默认禁用，只有日期范围合法且确认文案完全匹配时才启用。
  - 日期输入被清空时会立即判定为无效，不沿用旧日期。
  - 删除成功后刷新当前聊天区；右侧处于聊天记录工具栏时同步刷新右侧历史。
  - 清理旧的 `DB_TYPE_OPTIONS`、`clientConnectionString`、`clientDbType`、`normalizeDbType()` 残留，避免后续误接回连接字符串保存。
- `public/styles.css`
  - 新增 `.database-delete-panel`、`.database-delete-tabs`、`.database-delete-form`、`.date-range-control`、`.confirm-input-wrap` 样式。
  - 布局贴近原客户端紧凑弹窗，同时保留 Web 现有蓝白产品风格。
- `README.md`
  - 右上角客户端功能区说明改为 `/ChatContent/Delete`。
  - 补充确认文案和删除不可恢复提醒。
- `AI_HANDOFF.md`
  - 原生顶栏功能说明改为数据库管理删除聊天记录，避免后续 AI 继续按旧连接串管理理解。

验证结果：

- 已从 `C:\Program Files\youchat-desktop\bin\YouChatService.xml` 确认原生接口 `ChatContentController.Delete(System.DateTime,System.DateTime)`，summary 为 `删除聊天记录`。
- `npm run check` 通过。
- `git diff --check` 通过，仅有 Windows CRLF 换行提示。
- 本地 `http://localhost:5177` 可打开，页面标题为 `悠聊 Web 客服工作台`；当前浏览器停在登录页，本轮没有为了验证弹窗而触发真实登录或删除接口。

维护规则：

- 该菜单当前只做“删除聊天记录”。不要在没有用户明确要求时恢复 `/System/GetConnectionString`、`/System/SetConnectionString` 编辑入口。
- `/System/GetOptions` 里的 `dataBaseOptions` 仍可在“设置”弹窗查看和保存，但那属于客户端设置，不等于“数据库管理”截图里的删除记录功能。
- 删除类接口必须保留强确认文案，不要为了省一步把确认按钮默认打开。
- 如果后续客户端新增更多数据库管理页签，再在 `.database-delete-tabs` 扩展，不要把危险功能混到同一个确认按钮里。

## 42. 2026-06-09 应用深链长链接卡片

用户反馈：

- 类似截图里的 `weishi://feed?...` 超长链接不应该原样铺满聊天气泡。
- 这类长连接也应该参考之前的网页卡片、小程序卡片和视频预览方式处理。

问题原因：

- 旧 `extractFirstUrl()` 只识别 `http(s)://` 和 `//`。
- `weishi://feed` 属于应用 deep link，里面的 `feed_info` 参数还会二次编码 JSON，包含标题、描述和真实网页/视频 URL。
- 因为没有识别为卡片，消息只能作为普通文本显示，导致中间聊天框出现巨大长文本块。

已修改：

- `public/app.js`
  - 新增 `APP_DEEP_LINK_PROFILES`，覆盖微视、微信、企微、小红书、快手、抖音、淘宝、天猫、京东、拼多多、得物、美团、饿了么等常见应用 scheme。
  - `buildMessageLinkCard()` 优先调用 `buildAppDeepLinkCard()`，文件和小程序仍然优先于链接卡片。
  - 新增 deep link 解析辅助：
    - `extractFirstAppDeepLink()`
    - `parseAppDeepLink()`
    - `getDeepLinkNestedData()`
    - `parseNestedObject()`
    - `decodeUrlValue()`
    - `getDeepLinkEmbeddedUrl()`
    - `getAppDeepLinkProfile()`
    - `getAppDeepLinkLogoDataUrl()`
    - `getDeepLinkDisplayHost()`
  - `weishi://feed?...feed_info=...` 会解析 `feed_info` 中的 `nickname/video_des/url/cover` 等字段：
    - 标题优先真实消息字段，再用嵌套 JSON 标题/昵称。
    - 描述优先真实消息字段，再用嵌套 JSON 描述。
    - 可解析到真实 `http(s)` URL 时，`详情` 和 `打开` 走真实网页/视频地址。
    - 复制按钮保留原始 `weishi://...` 深链。
  - `refreshRenderedLinkCard()` 改用 `getMessagePreviewUrl()`，让 deep link 中真实视频/网页 URL 的预览元信息回来后也能刷新原卡片。
  - 主聊天框 `handleMessageListClick()` 补齐 `[data-copy]` 处理，保证中间消息卡片里的复制按钮可用。
- `public/styles.css`
  - 新增 `.message-link-card.is-deep-link` 样式。
  - 给 deep link 缩略图加视频/播放角标，使它和普通网页卡片有轻微区分，但仍保持原客户端蓝白风格。

验证结果：

- `npm run check` 通过。
- `git diff --check` 通过，仅有 Windows CRLF 换行提示。
- 用截图同类 `weishi://feed?...feed_info=...` 样本做本地解析验证，能拿到：
  - `scheme: weishi`
  - `nickname: 中国经营报`
  - `video_des: 事关你的存款利息！央行又出招，下一步是`
  - 内嵌真实 `http://q.weishi.qq.com/...mp4?...` 地址

维护规则：

- 不要把应用 deep link 原样当普通文本渲染。优先折叠成卡片，完整原文通过复制按钮保留。
- deep link 中解析出的 `http(s)` 才能用于详情预览和打开；`weishi://`、`kwai://` 这类原始 scheme 只复制，不当作网页打开。
- 不伪造视频标题、封面或视频地址。没有真实字段时只展示平台名、应用 logo 和“应用深链/视频深链”。
- 新增应用平台时优先扩展 `APP_DEEP_LINK_PROFILES`，不要在 `renderMessageLinkCard()` 写一次性分支。

## 43. 2026-06-09 小程序卡片微信式大封面

用户反馈：

- 小程序卡片和链接卡片区分还不明显。
- 微信里的小程序消息是顶部应用名、中间标题、大封面、底部“小程序”标识；如果拿不到图片，也应该有替代封面。

已修改：

- `public/app.js`
  - `buildMessageMiniProgramCard()` 扩展字段读取：
    - 标题：`miniProTitle/miniProTitle in JSON/title/Title/cardTitle/cardDesc`
    - 应用名：`miniProName/appName/AppName/source/displayName`
    - 封面：`miniProImg/miniImgUrl/miniProCover/image/thumbUrl/cover/icon/cardImg`
    - 应用图标：`miniProIcon/miniProLogo/appIcon/iconUrl/icon`
    - 路径：`miniProUrl/url/cardUrl/pagePath/path`
    - 标识：`miniProAppId/miniProGhId/appId/appid/ghId/username`
  - `parseMessagePayload()` 增强：
    - 兼容微信 XML 的 `appid/ghid/username/pagepath/appicon/iconurl/miniimgurl/cover/hdheadimg`。
    - 新增 `cleanXmlValue()` 去掉 `<![CDATA[]]>` 外壳后再解实体。
  - 同时解析 `message.content` 和 `message.ext`，避免小程序字段藏在扩展字段里时被漏掉。
  - 新增 `getMiniProgramPlaceholderDataUrl(appName, title)`：
    - 没有真实封面时生成本地 SVG 占位封面。
    - 占位封面只表达“小程序卡片类型”，不伪造真实商品图或真实小程序截图。
  - `renderMessageMiniProgramCard()` 改为微信式结构：
    - 顶部 `.mini-card-app` 显示真实应用头像；没有头像时用绿色小程序类型图标。
    - 中间 `.mini-card-heading` 显示标题。
    - `.mini-card-cover` 显示真实封面或本地占位封面。
    - 底部固定显示“小程序”，并保留打开/复制按钮。
- `public/styles.css`
  - `.message-mini-card` 改为白底、浅边框、轻阴影，更接近原客户端和微信卡片。
  - 新增 `.mini-card-app`、`.mini-card-app-mark`、`.mini-card-heading`、`.mini-card-cover`。
  - `.mini-card-app-mark` 用 CSS 画绿色小程序类型图标，替代原先黑色首字母。
  - 删除旧的右侧 38px 小图标布局，改成 16:9 大封面。

真实依据：

- 原客户端打包代码里小程序组件使用 `miniProTitle` 和 `miniImgUrl`，底部显示“小程序”。
- `logs/api-capture.ndjson` 里真实 `contentType=6` 样本：
  - `miniProTitle`: `绑定一下吧！`
  - `miniProName`: `阿秘优选`
  - `miniProImg`: `null`
  - 所以无真实封面时必须展示类型占位图，而不是伪造封面。

验证结果：

- `npm run check` 通过。

维护规则：

- 小程序 `contentType=6` 必须优先走 `buildMessageMiniProgramCard()`，不要交给普通链接卡片。
- 真实封面永远优先；只有没有 `miniProImg/miniImgUrl/thumbUrl/cardImg` 等真实字段时才用本地占位 SVG。
- 新增小程序字段时优先扩展 `normalizeMessage()`、`buildMessageMiniProgramCard()` 和 `parseMessagePayload()`，不要在 render 里临时拆字符串。

## 44. 2026-06-09 客户头像同步

用户反馈：

- 左侧会话列表头像和中间会话框顶部头像不同步。
- 同一个联系人进入聊天后，消息气泡里的客户头像也可能和左侧列表不一致。

真实依据：

- `logs/api-capture.ndjson` 的真实 `/Contact/GetContactList` 返回联系人字段 `avatar`，例如 Boom 和其他客户的 `wx.qlogo.cn` 头像。
- 真实 `/Contact/GetContactInfo` 也返回 `avatar`，有时详情接口的头像比列表接口更新。

已修改：

- `public/app.js`
  - 新增 `CONTACT_AVATAR_FIELDS`，统一兼容 `avatar/headImg/headImgUrl/headimgurl/headimg/headUrl/avatarUrl/userAvatar/photo/portrait/faceUrl` 等真实字段。
  - `normalizeContact()` 改为通过 `getAvatarFromRecord()` 写入 `contact.avatar`。
  - 新增 `getContactAvatar()`，优先使用当前联系人详情 `GetContactInfo` 返回的真实头像，再回退联系人列表头像。
  - 新增 `renderContactAvatar()`，左侧列表、会话顶部、客户消息气泡都走同一套 `<img>` 或文字头像渲染。
  - 新增 `handleAvatarImageError()`，真实头像 URL 加载失败时回退为文字头像，避免浏览器破图。
  - `loadContactInfo()` 在详情接口返回后调用 `syncActiveContactFromInfo()`，把详情头像同步回 `state.activeContact` 和 `state.contacts`，再刷新列表、顶部和消息头像。
  - 新增 `renderMessagesPreservingScroll()`；`loadContacts()` 自动刷新同一联系人但头像变化时，只刷新消息头像并恢复原滚动位置。

维护规则：

- 后续凡是展示客户头像，必须调用 `renderContactAvatar()` 或 `getContactAvatar()`，不要重新拼 `contact.avatar ? <img ...>`。
- 不伪造头像。没有真实头像或真实 URL 加载失败时，只显示客户昵称/备注首字文字头像。
- 详情接口头像优先于列表头像，但必须同步回当前会话和列表状态，避免三个区域各自显示不同头像。
- 刷新头像时不要调用会滚到底部的渲染，必须保留 `messageList.scrollTop`，避免客服正在翻历史时被打断。

## 45. 2026-06-09 CodeBuddy API 支持

用户需求：

- 希望右上角 AI 设置支持 CodeBuddy 的 API，后续可以用 CodeBuddy 访问密钥驱动 AI 推荐、文字优化和 skill 优化。

真实依据：

- CodeBuddy 官方环境变量文档包含：
  - `CODEBUDDY_API_KEY`：用于模型 API 调用的访问密钥。
  - `CODEBUDDY_BASE_URL`：用于覆盖模型 API 端点。
  - `CODEBUDDY_MODEL`：用于覆盖模型名称。
- CodeBuddy 身份/API Key 文档说明 API Key 通过 `X-Api-Key` 请求头传递。

已修改：

- `public/index.html`
  - AI 设置供应商预设新增 `CodeBuddy`。
  - 新增“认证方式”下拉：
    - `Authorization: Bearer`
    - `X-Api-Key`
- `public/app.js`
  - 新增 `DEFAULT_AI_AUTH_TYPE = "bearer"`。
  - `AI_PRESETS` 扩展 `authType`，CodeBuddy 预设使用 `authType: "x-api-key"`。
  - 新增 `state.aiAuthType`，持久化到 `localStorage.youchat.ai.authType`。
  - `hydrateAiSettingsFields()`、`saveAiSettings()`、`resetAiSettings()`、`handleAiPresetClick()` 同步处理认证方式。
  - 新增 `normalizeAiAuthType()` 和 `getAiRelayBasePayload()`，所有 AI 中转请求统一携带 `baseUrl/apiKey/model/authType/temperature`，避免推荐回复、换一换、文字优化、skill 优化其中某一处漏掉 CodeBuddy 鉴权。
- `server.js`
  - 新增 `normalizeAiAuthType()` 和 `getAiAuthHeaders()`。
  - `/ai/chat/completions` 根据 `incoming.authType` 选择：
    - `bearer` -> `Authorization: Bearer <key>`
    - `x-api-key` -> `X-Api-Key: <key>`
  - 如果 `baseUrl` hostname 包含 `codebuddy` 或为 `copilot.tencent.com`，未显式传 authType 时也自动使用 `X-Api-Key`。

使用规则：

- CodeBuddy 平台创建访问密钥后，在 Web 右上角 `AI` 设置中点 `CodeBuddy`。
- 填入 CodeBuddy 平台给出的 API 端点、访问密钥和模型名。
- 如果平台给的是完整 `/chat/completions` 地址，可以直接填完整地址；如果只给根地址或 `/v1`，`server.js:getAiChatCompletionsUrl()` 会按 OpenAI 兼容规则补全。
- 不要把 CodeBuddy 改回 Bearer 鉴权，否则会导致 CodeBuddy 访问密钥请求失败。

## 46. 2026-06-09 聊天图片网页浮层预览

用户反馈：

- 客户发送的图片在聊天里不能点击打开。
- 希望参考网页/视频预览的处理方式，直接在 Web 页面上用一个浮层框架预览图片。

已修改：

- `public/app.js`
  - `renderMessageContent()` 对 `contentType=1` 或图片 URL 消息渲染为 `.message-image-button`，保留真实图片地址，不生成假图片。
  - 新增 `showImagePreview()` 和 `normalizePreviewImageUrl()`，支持 `http(s)`、协议相对 URL、`blob:` 和 `data:image/` 图片预览。
  - `renderActiveLinkPreview()` 增加 `type: "image"` 模式，复用 `#linkPreviewOverlay`，标题显示“图片预览”，按钮显示“打开原图”，主体展示完整图片。
  - 新增 `handlePreviewClickTarget()`，主聊天框、右侧工具栏和工具弹层共用同一套图片/链接/复制点击处理，避免右侧聊天记录漏掉图片预览。
- `public/styles.css`
  - 新增 `.message-image-button` 的 hover/focus 状态，让聊天图片有明确可点击反馈。
  - 新增 `.link-preview-panel.is-image-preview`、`.link-preview-image-wrap`、`.link-preview-image`，图片在浮层内居中等比显示，不挤压聊天输入框。

维护规则：

- 聊天图片必须继续使用真实 `message.content` 或真实图片字段，不允许用占位图替代客户图片。
- 图片预览继续复用 `#linkPreviewOverlay`，不要另做一套与链接/视频割裂的弹窗。
- 后续如果新增右侧聊天记录、全局搜索结果或数据库管理里的消息渲染，只要使用 `renderMessageBubble()`，图片预览会自动生效；如果手写消息 HTML，必须补 `data-image-preview` 点击目标。

## 47. 2026-06-09 发送快捷键、skill 图片与预览头部修复

用户反馈：

- 输入框需要支持 `Enter` 发送或 `Ctrl+Enter` 发送，默认 `Enter` 发送，选择下拉放在发送按钮右侧。
- skill 已能优化文案，但卡片显示太长、图片步骤不显示，客服看不到要发哪些图。
- 长链接预览浮层头部 URL 太长时会把右侧关闭 X 挤出屏幕，导致无法关闭。

已修改：

- `public/index.html`
  - 发送按钮右侧新增 `#sendMode` 下拉，选项为 `Enter 发送` 和 `Ctrl+Enter 发送`。
- `public/app.js`
  - 新增 `SEND_MODE_STORAGE_KEY = "youchat.composer.sendMode"`，发送模式持久化到 `localStorage`。
  - 新增 `hydrateComposerFields()`、`updateComposerStatus()`、`handleReplyKeydown()`、`handleSendModeChange()`、`normalizeSendMode()`。
  - 默认 `Enter` 发送；默认模式下 `Shift+Enter`/`Ctrl+Enter` 可换行；`Ctrl+Enter` 模式下 `Enter` 换行、`Ctrl+Enter` 发送。输入法合成期间不会误发送。
  - `getSkillSteps()` 同时支持 skill 的 `replySteps` 和 AI/skill suggestion 的 `steps`。
  - 新增 `getSkillImageSteps()` 和 `renderSkillImageStrip()`，skill 列表和命中卡都会显示真实图片步骤缩略图；缩略图使用 `data-image-preview`，点击复用图片预览浮层。
- `public/styles.css`
  - 新增 `.send-mode-select`，让发送模式下拉紧贴发送按钮右侧。
  - 压缩 `.quick-row`、`.skill-match-card`、`.skill-row` 间距；skill 文案预览限制为 3 行，避免一条 skill 占满右侧工具栏。
  - 新增 `.skill-image-strip`、`.skill-image-thumb`、`.skill-image-more`，用 34px 小缩略图展示 skill 图片。
  - `.link-preview-head` 改为 `grid-template-columns: minmax(0, 1fr) auto`，右侧复制/打开/关闭按钮固定在动作区，长 URL 只能在左侧省略，不会再挤掉关闭按钮。

维护规则：

- 发送快捷键只读写 `youchat.composer.sendMode`，不要把它混到 AI 设置里。
- skill 图片必须来自真实 `replySteps/steps` 里的图片 URL，不使用占位图伪造。
- skill 缩略图和聊天图片一样走 `handlePreviewClickTarget()`，不要另写一套图片弹窗。
- 预览浮层头部必须保留左内容 `minmax(0, 1fr)`、右动作区 `auto` 的布局，避免长链接再次遮住关闭按钮。

## 48. 2026-06-09 飞牛服务误切 SQLite 修复

用户反馈：

- Web 和服务端恢复后，左侧“历史”数量只剩 4。
- 用户怀疑飞牛服务端异常，要求继续任务并先跑起 Web。

排查过程：

- Web 已运行在 `http://localhost:5177`，健康检查返回 `apiBase=http://192.168.9.83:18080/api`。
- 直接请求 `/Contact/GetContactList`：
  - `isHistory=true` 一度只返回 `total=4`。
  - 不带历史参数只返回约 `total=262`。
- 通过 SSH 只读检查飞牛 Docker：
  - `youchat-service`、`youchat-mysql` 均在运行。
  - MySQL 数据库 `1556504756803862529` 仍有 `Contact=8041`、`Conversation=26798`。
  - MySQL 历史候选仍在，并不是数据整体丢失。
- 关键根因：
  - `/System/GetOptions` 返回 `dataBaseOptions.databaseType=2`、`connectionString=null`。
  - 服务端实际读取的是容器目录里的 SQLite 文件 `\悠聊数据库\DataBase-1556504756803862529.db`。
  - 该 SQLite 只有 `Contact=265`、`Conversation=16`，所以历史接口只剩 4 是服务端读库模式错误导致。

修复动作：

- 先备份当前配置和 SQLite：
  - `/vol1/1000/Docker/youchat/docker-control/config-backups/sqlite-to-mysql-20260609-152526`
  - `/vol1/1000/Docker/youchat/docker-control/config-backups/manual-mysql-switch-20260609-152800`
- 将 `/vol1/1000/Docker/youchat/\悠聊数据库\config\YouChatConfig.json` 的 `DataBaseOptions` 改回：
  - `DatabaseType=0`
  - `ConnectionString=Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=...;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;`
- 重启 `youchat-service`，不重启 MySQL。

验证结果：

- `/System/GetOptions` 已恢复 `databaseType=0`，连接串指向 MySQL。
- 飞牛本机接口：
  - 全量 `/Contact/GetContactList`：`total=8041`。
  - 历史 `/Contact/GetContactList isHistory=true`：`total=5714`。
  - 留言：`total=0`。
- Web 代理接口：
  - `http://localhost:5177/api/Contact/GetContactList` 历史返回 `total=5714`。
  - `npm run check` 通过。

新增预防：

- 新增 `tools/check-fnos-youchat-health.ps1`。
- 新增 `npm run fnos:health`。
- 脚本会检查：
  - `/System/GetOptions` 的 `databaseType` 是否为 `0(mysql)`。
  - 全量联系人、历史、留言、`accountId=2` 探测数量。
  - 历史低于阈值时失败并提示优先检查 SQLite/MySQL 模式。

以后排查规则：

- 如果 Web 和官方客户端同时数量异常，先跑：

```powershell
cd C:\youchat-dev-web
npm run fnos:health
```

- 如果 `databaseType=2`，不要先改前端，优先把飞牛服务端配置切回 MySQL 并重启 `youchat-service`。
- 如果 `databaseType=0` 但接口报错，再检查 MySQL 日志、`ChatContent_%` 表排序规则、磁盘和服务日志。

## 49. 2026-06-09 图片发送卡在发送中修复

用户反馈：

- 粘贴或选择图片后点击发送，按钮一直显示“发送中”，随后没有反应。
- 之前已经出现过图片发送拿到 `/ChatContent/GetOssConfig` 后没有继续产生 `/ChatContent/SendMsg contentType=1` 的情况。

真实日志依据：

- `logs/api-capture.ndjson` 中失败链路显示：
  - `/ChatContent/GetOssConfig` 返回七牛配置：
    - `qnDomain=https://qiniu.yunsert.com`
    - `qnRegionUrl=http://upload.qiniup.com`
    - `qnToken=...`
  - 后续没有对应的 `/ChatContent/SendMsg contentType=1`。
- 旧实现先走浏览器直传 OSS，失败或卡住后才走 `/local/oss-upload` 本地代理。
- 旧实现当服务端未返回 `key/objectKey/path` 时，直接用原始文件名作为 OSS key。粘贴图片常见文件名是 `image.png`，会导致重复 key、覆盖或显示混乱。

已修改：

- `public/app.js`
  - 新增请求超时：
    - 普通 API：45 秒。
    - 浏览器 OSS 直传：15 秒。
    - 本地 OSS 上传代理：70 秒。
  - 新增 `fetchWithTimeout()`，所有前端 `/api` 请求和图片上传请求都会超时退出，不再无限挂起。
  - 图片上传改为“本地代理优先，浏览器直传兜底”：
    - 先调用 `/ChatContent/GetOssConfig`。
    - 生成 32 位随机十六进制文件名，例如 `d79e0e5d82e55d523ad2975d34f0a1e5.png`。
    - 优先调用 `/local/oss-upload` 由本地 Node 服务上传七牛，避开浏览器 CORS 和直传卡住问题。
    - 本地代理失败时，再尝试浏览器直传，直传最多等待 15 秒。
  - 新增 `createOssUploadFileName()`、`randomHex()`、`getSafeImageExtension()`、`normalizeOssObjectKey()`、`joinOssKey()`。
  - `buildOssObjectKey()` 支持服务端返回目录、前缀或模板 key；没有明确 key 时使用唯一文件名，不再用 `image.png`。
  - 发送状态条会显示当前阶段：
    - 正在准备发送
    - 正在获取图片上传配置
    - 正在通过本地代理上传图片
    - 正在通过浏览器直传图片
    - 正在提交文字消息
    - 正在提交图片消息
    - 正在学习回复并刷新聊天
  - 文字 + 图片一起发送时，先上传所有图片拿到 URL，再提交文字和图片消息，避免图片上传失败后重试导致文字重复发送。
  - 如果文字已经成功提交但后续图片消息失败，输入框文字会清空，已成功提交的图片会从草稿里移除，未成功提交的图片保留，用户重试时不会重复发文字。
- `server.js`
  - 新增后端请求超时：
    - 悠聊 API 代理：60 秒。
    - OSS 上传代理：70 秒。
    - AI 代理：90 秒。
  - 新增后端 `fetchWithTimeout()`。
  - `/local/oss-upload` 使用同一套唯一 key 和七牛表单字段上传。
  - 新增 `summarizeUploadConfig()`，抓包日志只记录上传配置摘要，不记录完整 token。
- `/local/oss-upload` 会把 OSS 上传结果写入 `logs/api-capture.ndjson`，包含 endpoint、objectKey、文件大小和 OSS 响应摘要。
- `tools/export-devkit-patch.ps1`
  - 补丁包排除 `data/`、`logs/`、`reports/`、`node_modules/` 和 `.youchat-patch-backups/`。
  - 以后导出的迁移包不会覆盖其他环境里的 skill 学习数据，也不会夹带抓包日志。

验证结果：

- `npm run check` 通过。
- `npm run fnos:health` 通过：
  - `databaseType=0 (mysql)`
  - `totalContacts=8043`
  - `historyContacts=5710`
  - `currentAccount2=5`
- 本地服务 `http://localhost:5177/health` 正常。
- 不发送给客户的真实上传烟测通过：
  - `/ChatContent/GetOssConfig` 返回 200。
  - `/local/oss-upload` 上传 1x1 测试 PNG 到七牛返回 200。
  - 返回 URL 示例：`https://qiniu.yunsert.com/d79e0e5d82e55d523ad2975d34f0a1e5.png`。
  - 没有调用 `/ChatContent/SendMsg`，不会给真实客户发送测试图片。

以后排查规则：

- 图片发送卡住时，先看 `logs/api-capture.ndjson`：
  - 是否有 `/ChatContent/GetOssConfig`。
  - 是否有 `/local/oss-upload`，以及 OSS 响应里的 `key/hash`。
  - 是否有 `/ChatContent/SendMsg` 且 `contentType=1` 或 GIF 时 `contentType=4`。
- 如果 `GetOssConfig` 有返回但 `/local/oss-upload` 失败，优先检查七牛 `qnRegionUrl/qnToken/qnDomain` 和本地 Node 代理。
- 如果 `/local/oss-upload` 成功但没有 `SendMsg contentType=1`，排查前端发送阶段或 `sendText()` 的异常。
- 不要再把粘贴图片原始名 `image.png` 作为 OSS key。必须使用唯一 key 或服务端明确返回的 key。
- 不要在 `/local/oss-upload` 抓包里记录完整 `qnToken`，只记录 `hasQnToken=true/false`。
- 导出迁移 patch 前确认 zip 内不包含 `payload/data/reply-skills.json` 或 `payload/logs/api-capture.ndjson`。

## 50. 2026-06-09 SignalR 清红点桥接

用户反馈：

- 在 Web 页面点击左侧会话后，Web 会话列表里的红点/小数字消失。
- 但官方 Windows 客户端里同一个会话仍显示未读，说明之前只是 Web 本地清状态，没有可靠同步服务端已读。

排查结论：

- 原 Electron 客户端主窗口源码里，点开会话调用的是 SignalR hub 方法：
  - `signalRConnection.invoke("ConsumeMessage", contactId, 0)`
  - 全部已读调用 `ConsumeMessage(0, 0)`
- SignalR hub 地址由 API 地址推导：
  - API: `http://192.168.9.83:18080/api`
  - Hub: `http://192.168.9.83:18080/chathub?mode=client&userName=<客服短id>`
- 注册方法：
  - `RegisterUser(accountId, false, false, 0)`
  - 当前飞牛健康检查里 `Boom666 / 客服-王` 的短客服 id 为 `2`。
- HTTP `/ChatContent/ConsumeMessage(contactId, 0)` 当前也会返回成功，但官方客户端的实时已读语义以 SignalR 为准。浏览器直连 SignalR 可能受 CORS/协商限制影响，所以不能只依赖浏览器端 hub。

已修改：

- `package.json`
  - 新增依赖 `@microsoft/signalr`，本地 Node 服务可直接连接悠聊 hub。
- `server.js`
  - 新增 `/vendor/signalr.min.js`，供浏览器兜底直连 SignalR 使用。
  - 新增 `/local/signalr/consume`。
  - `handleSignalRConsume()` 会读取 `apiBase/accountId/contactId/msgId`，由本地 Node 服务连接 `/chathub`，注册用户后调用 `ConsumeMessage(contactId, msgId)`。
  - SignalR 连接按 `hubBase + accountId` 复用，避免每次点击会话都重新握手。
  - Node 进程收到 `SIGINT/SIGTERM` 时会停止已缓存的 SignalR 连接。
- `public/index.html`
  - 加载 `/vendor/signalr.min.js`。
- `public/app.js`
  - 新增 SignalR 地址推导、注册、停止、浏览器直连兜底函数。
  - `syncConsumedMessages()`、`syncAllConsumedMessages()`、`syncConsumedMessageIds()` 改为顺序兜底：
    1. `/local/signalr/consume` 本地 Node SignalR 桥。
    2. 浏览器 SignalR。
    3. HTTP `/ChatContent/ConsumeMessage`。
  - 本地桥成功后不再重复调用后续兜底，避免一次点击打多次已读。
  - Web 本地已读状态只保留 30 秒宽限期，避免接口刷新失败时长期假装已读。

真实验证：

- 重启 `http://localhost:5177` 本地 Web 服务后，直接调用：

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:5177/local/signalr/consume `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"apiBase":"http://192.168.9.83:18080/api","accountId":"2","contactId":7052,"msgId":0}'
```

- 返回：

```json
{
  "success": true,
  "source": "node-signalr",
  "hubUrl": "http://192.168.9.83:18080/chathub?mode=client&userName=2",
  "accountId": "2",
  "contactId": 7052,
  "msgId": 0
}
```

- 随后查询 `/Contact/GetContactList(accountId=2)`，真实会话 `contactId=7052` 的 `unRead` 从 `1` 变为 `0`。
- `npm run check` 通过。
- `npm run fnos:health` 通过：
  - `databaseType=0 (mysql)`
  - `totalContacts=8043`
  - `historyContacts=5710`
  - `currentAccount2=5`
- `/vendor/signalr.min.js` 和 `/app.js` 均返回 200。

以后排查规则：

- 如果 Web 红点消了但官方客户端不消，先看 Web 日志里 `consume message synced` 的 `source`。
  - 理想值：`node-signalr`。
  - 如果是 `browser-signalr` 或 `http`，说明本地桥失败过，继续看 `consume message fallback used` 的错误。
- 不能只把前端 `unread=0` 当成清红点完成；必须确认 `/local/signalr/consume` 或 SignalR `ConsumeMessage` 成功。
- 不要再把单条长 `msgId` HTTP 消费作为主路径。之前 probe 过部分长 id 会返回服务端异常。
- `accountId` 必须是客服短 id，例如当前 `2`，不是登录名 `Boom666`，也不是后台长账号号 `1556504756803862529`。
- 如果官方客户端和 Web 同时数量异常，仍先跑 `npm run fnos:health` 排除飞牛服务端读库问题。

2026-06-10 追加修复：

- 用户反馈“红点已同步到 Web，但回复完消息后又出现红点”。
- 根因不是 `ConsumeMessage` 没调用，而是前端本地已读保护之前依赖 `contact.sortTime`。
- 客服发送消息后，`touchActiveContact()` 会把当前会话 `sortTime` 更新成最新，导致本地已读保护立即失效；随后自动刷新或发送后的联系人刷新把服务端旧 `unRead` 又写回来了。
- 现已改为按“最后一条客户来消息时间”保护已读：
  - `normalizeContact()` 增加 `lastIncomingTime`。
  - `applyReadStateToContact()` 改为比较 `lastIncomingTime`，不再因为客服自己的回复把红点保护冲掉。
  - `markContactRead()` 和 `markVisibleContactsRead()` 会记录 `lastIncomingTime`。
  - `syncConsumedMessages()` 成功后会刷新本地已读窗口。
  - `sendText()`、`sendImageFile()` 成功后会顺序执行：
    1. `markContactRead(state.activeContact)`
    2. `loadMessages(1, "replace")`
    3. `syncConsumedMessages(state.activeContact)`
    4. `loadContacts({ preserveScroll: true, skipCounts: true })`
- 后续如果再出现“回复后红点回弹”，优先检查：
  - 服务端联系人接口是否仍返回旧 `unRead`
  - 当前联系人的 `lastIncomingTime` 是否被正确提取
  - 发送成功后的 `syncConsumedMessages()` 是否报错

2026-06-16 追加修复：Web 清红点必须等待服务端确认

- 用户再次反馈：Web 端点击红点会话后，Web 角标会消失，但去官方 Windows 客户端看红点仍在。
- 本次真实复现：
  - `/Contact/GetContactList(accountId=2)` 返回 `contactId=6264`、`unRead=1`、`consumeTime=0`。
  - 直接调用线上 Web 容器 `/local/signalr/consume`，传 `apiBase=http://192.168.9.83:18080/api` 时返回 502：
    - `Failed to complete negotiation with the server: TypeError: fetch failed`
  - 同样请求改成 `apiBase=http://host.docker.internal:18080/api` 后成功：
    - `source=node-signalr`
    - `hubUrl=http://host.docker.internal:18080/chathub?mode=client&userName=2`
  - 随后回查官方接口，`contactId=6264` 的 `unRead` 从 1 变成 0。
- 根因：
  - Web 页面保存/传入的是浏览器视角地址 `http://192.168.9.83:18080/api`。
  - 但 Web 服务部署在 Docker 容器里，容器内回连飞牛宿主机发布端口需要走 `host.docker.internal`。
  - 之前前端 `markContactRead(..., { sync:true })` 会先清 Web 本地 `readContactState/unRead`，再异步调用 `syncConsumedMessages()`；桥接失败只写日志，不回滚 UI，所以造成“Web 假清、官方客户端未清”。
- 已修改：
  - `server.js`
    - 新增容器内 API 地址候选：
      - `YOUCHAT_CONTAINER_API_BASE` 可显式覆盖。
      - Docker runtime 下自动把私网宿主机地址映射到 `host.docker.internal`。
    - `/local/signalr/consume` 会按候选 API base 重试，并在成功响应里返回 `resolvedApiBase`、`failedAttempts`。
    - `/api/*` 代理也使用同一候选策略，避免容器内普通 API 代理对 `192.168.9.83:18080` 超时。
  - `public/app.js`
    - `getSignalRAccountId()` 优先使用 `getContactListAccountId()` 返回的已验证客服短 id，再兜底旧缓存。
    - 新增 `confirmContactRead()` / `confirmContactReadInBackground()`：
      1. 调用 `syncConsumedMessages(contact)`。
      2. 用 `/Contact/GetContactList(id=contactId)` 回查服务端。
      3. 只有回查到 `getContactUnreadCount(contact) === 0` 时，才调用 `clearContactReadStateLocally()`。
      4. 失败时保留 Web 红点并提示“红点同步到客户端失败，已保留未读标记。”
    - `syncConsumedMessages()` 默认只调用原生同款 `ConsumeMessage(contactId, 0)`，不再默认逐个消费长 `msgId`，避免历史上长 id HTTP 失败造成噪音。
    - 回查联系人只合并未读字段，不把 `records:null` / `robot:null` 的精简响应整条覆盖本地联系人，避免破坏会话预览和机器人显示。
- 真实验证：
  - 部署到飞牛 `http://192.168.9.83:5177`。
  - 线上普通 API 代理测试：
    - 请求 `/api/Contact/GetContactList?__target=http://192.168.9.83:18080/api`
    - 实际成功返回真实数据，说明代理已自动走容器可达地址。
  - 线上 SignalR 测试：

```powershell
Invoke-WebRequest -UseBasicParsing `
  -Method Post 'http://192.168.9.83:5177/local/signalr/consume' `
  -ContentType 'application/json' `
  -Body '{"apiBase":"http://192.168.9.83:18080/api","accountId":"2","contactId":223,"msgId":0}'
```

  - 返回：

```json
{
  "success": true,
  "source": "node-signalr",
  "apiBase": "http://192.168.9.83:18080/api",
  "resolvedApiBase": "http://host.docker.internal:18080/api",
  "hubUrl": "http://host.docker.internal:18080/chathub?mode=client&userName=2",
  "accountId": "2",
  "contactId": 223,
  "msgId": 0
}
```

  - 之后直连官方接口和 Web 代理回查 `contactId=223`，均返回 `unRead=0`。
  - `/local/fnos/guard` 仍显示 `databaseMode=mysql`、`totalContacts=8081`、`historyContacts=5758`。
  - `npm run check` 通过。
- 后续规则：
  - 不允许再让点击会话先本地清红点再异步同步；必须先真实消费并回查确认。
  - 如果回查不到该联系人，宁愿保留红点，不要假清。
  - 如果部署在 Docker，排查清红点失败时优先看 `/local/signalr/consume` 返回的 `resolvedApiBase` 是否为 `host.docker.internal`。
  - `id=contactId` 的回查响应可能是精简联系人，不能拿它覆盖完整联系人对象。

2026-06-11 前端细修：

- 用户反馈两个直接可见的问题：
  1. 右侧工具栏除“聊天记录”外，其他 tab 预留了过多固定高度，出现明显空白。
  2. 基础表情只显示文字标签，没有按客户端原生图标渲染。

- 本次修改文件：
  - `public/app.js`
  - `public/styles.css`

- 右侧工具栏高度策略已改为“双模式”：
  - `toolContent` 在 `state.activeTool === "history"` 时挂 `is-history-tool`
  - 其他 tab 挂 `is-compact-tool`
  - `history` 保持整列撑满并由 `.history-section` / `.history-chat-list` 吃满剩余高度
  - `user / quick / skill / order / detail` 改为按内容自然收起，必要时自身滚动，不再凭空占满整列高度

2026-06-11 右侧滚动条补修：

- 用户追加反馈：右侧工具栏不是“下拉框没了”，而是 `skill 回复 / 快捷回复` 的滚动条没了，导致无法浏览全部内容。
- 本次修改文件：
  - `public/app.js`
  - `public/styles.css`
- 修复策略：
  - 右侧工具栏内部滚动模式从两类扩展成三类：
    - `is-history-tool`
    - `is-skill-tool`
    - `is-quick-tool`
  - `quick` 不再继续走 `is-compact-tool`，避免分类按钮和列表内容都堆进一个自然高度容器，出现“内容很多但没有可见滚动条”的退化。
  - `.tool-pane` 改为稳定的纵向 flex 容器，确保 `tool-tabs` 在上、`toolContent` 在下，不再依赖默认块布局高度碰运气。
  - `.quick-section` 改为真正的纵向弹性容器，`.quick-list` 自身承担纵向滚动。
  - `.skill-panel-scroll` 保持内部滚动，并与 `.quick-list` 统一补上显式滚动条样式。
- 当前规则：
  - `history`：整列深滚动
  - `skill`：页签头部固定，`.skill-panel-scroll` 内部滚动
  - `quick`：页签头部固定，`.quick-list` 内部滚动
  - `user / order / detail`：继续保持紧凑内容模式
- 后续注意：
  - 不要再把 `quick` 塞回 `is-compact-tool`。
  - 如果以后用户再反馈“右侧分类还在，但翻不到下面”，优先检查 `.tool-pane`、`.tool-content.is-quick-tool`、`.quick-section`、`.quick-list`。

- 表情已改为真实 sprite 渲染：
  - 不再只用 `EMOJI_SHORTCUTS` 纯字符串数组直接渲染文字按钮。
  - `public/app.js` 新增：
    - `EMOJI_DEFS`
    - `EMOJI_LOOKUP`
    - `EMOJI_TOKEN_PATTERN`
    - `renderEmojiGlyph()`
    - `renderInlineTextWithEmojiAndLinks()`
  - `renderEmojiPopover()` 现在渲染“sprite 图标 + 中文名”的网格面板。
  - 聊天气泡文本路径 `linkifyMessageText()` 已改为支持：
    1. 原有 URL 识别按钮
    2. 文本中的 `[微笑]`、`[红包]`、`[强]` 等 token 直接替换成 inline sprite

- emoji 映射来源说明：
  - 映射不是手写猜的。
  - 参考官方客户端 bundle：
    - `C:\Program Files\youchat-desktop\wwwroot\p__chatHistory__index.1b36184c.async.js`
    - `C:\Program Files\youchat-desktop\wwwroot\p__chatHistory__index.6848817b.chunk.css`
  - 从官方 bundle 中抽取了：
    - 中文 token，如 `[微笑]`、`[捂脸]`、`[机智]`
    - 原生 sprite class，如 `smiley_0`、`e2_05`、`u1F604`
    - sprite background-position，再换算到当前 Web 端 `18px` 基础尺寸

- 当前策略不是“全量表情百科”，而是“优先覆盖真实客服高频常用表情”：
  - 基础常用表情已覆盖
  - 扩展常用表情已覆盖一批：`[红包]`、`[捂脸]`、`[奸笑]`、`[机智]`、`[皱眉]`、`[笑脸]`、`[生病]`、`[庆祝]`、`[礼物]`、`[吃瓜]`、`[旺柴]`、`[好的]`、`[打脸]`
  - 官方 bundle 里少数 class 在对应 CSS chunk 中本身无坐标定义，这类不要瞎编；如果后续用户继续点名某个表情缺失，继续优先按官方资源补

- 验证结果：
  - `npm run check` 通过
  - 本地 `http://localhost:5177` 服务已重启
  - 源码层确认：
    - 右侧 tool tab 已有 `history/compact` 模式 class 切换
    - emoji 面板已改为图标网格
    - 文本消息渲染已支持 inline emoji sprite

- 后续继续改这块时的注意事项：
  - 不要把 `history` 的“整列滚动”逻辑再套到其他 tool tab 上。
  - 不要退回纯文字 emoji 按钮。
  - 任何新增 emoji 优先从官方 bundle 抽 token/style/坐标，不要自己编 sprite 坐标。
  - 如果后续用户继续要求“表情更全”，应优先补 `EMOJI_DEFS`，不要改消息发送 token 本身。

2026-06-11 skill 分类与学习补强：

- 用户新反馈两类问题：
  1. 右侧 `skill 回复` 需要滚动时反而没有滚动条。
  2. `skill` 只能对订单号做粗匹配，不能依据淘宝/京东/拼多多等平台及提现/绑定失败/下单后没提示等意图做更智能的分类与学习。

- 本次修改文件：
  - `public/app.js`
  - `public/styles.css`
  - `server.js`

- 右侧 `skill` 面板布局修复：
  - `toolContent` 新增 `is-skill-tool` 模式。
  - `setToolTab(tab)` 与 `renderToolContent()` 中：
    - `history` 仍用 `is-history-tool`
    - `skill` 改为 `is-skill-tool`
    - 其他页签继续走 `is-compact-tool`
  - `.skill-section` 改成真正的纵向弹性容器。
  - 新增 `.skill-panel-scroll` 作为内部滚动区，恢复右侧 skill 列表的滚动条，而不是依赖外层容器。
  - 新增：
    - `.skill-tabs`
    - `.skill-group`
    - `.skill-group-header`
    - `.skill-meta-tags`
  - 现在 `skill` 页签可滚动，且不会再把内容挤成一整块无滚动长板。

- `skill` 分类系统已正式启用：
  - 之前只有 `state.skillCategory` 和平台/意图常量，未真正接入 UI。
  - 现已接入：
    - `当前匹配`
    - `全部`
    - 平台分类：`淘宝/天猫`、`京东`、`拼多多`、`唯品会`、`美团`、`饿了么`、`抖音`、`快手`
    - 意图分类：`订单查不到`、`下单后没提示`、`绑定失败`、`提现相关`、`返利状态`、`转人工`、`通用`
    - `其他`
  - 右侧 skill 面板现在按分组渲染，不再只是一个平铺列表。
  - `当前匹配` 会优先显示：
    - 当前命中的 skill
    - 与当前命中相同平台的 skill
    - 与当前命中相同意图的 skill

- 平台识别逻辑：
  - `public/app.js` 新增：
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
  - 订单平台来源优先级：
    1. 当前消息上下文里能识别出的订单号格式
    2. 右侧订单接口当前筛选/当前订单数据
    3. skill 本身历史标签
  - `normalizeOrder()` 现已给订单补 `platformKey`，不再只保留 `platformName`。

- `skill` 匹配排序增强：
  - `scoreReplySkill()` 不再只看关键词命中。
  - 现在会综合：
    - 关键词/样例命中
    - 平台一致性
    - 意图一致性
    - 当前上下文中的订单号
    - 手工纠正次数
    - 命中 skill 优先级
  - `buildSkillSuggestion()` 已把以下信息带到 suggestion：
    - `platformKey`
    - `intentKey`
    - `matchedOrderNo`
    - `matchKeywords`

- 学习逻辑修复重点：
  - 之前 `learnFromManualReply()` 只要发现 `state.lastSuggestionUsed === true` 就直接不学。
  - 这会误伤“采用后再改一下再发”的真实客服习惯。
  - 现已改成：
    - 只有“当前回复与刚采用的建议完全相同”时才跳过学习。
    - 采用后如果客服改了文字、替换了敏感词、保留图片重新发，都会学习。
  - 为此新增：
    - `lastAppliedSuggestionFingerprint`
    - `lastAppliedSuggestionSkillId`
    - `buildSuggestionFingerprint()`
    - `isCurrentReplyEffectivelySameAsAppliedSuggestion()`
    - `resolveManualReplySkillTarget()`
  - 现在人工发送时会优先学习回“刚采用并修改过”的那条 skill，而不是新建一个乱的 learned skill。

- 学习后的结构化沉淀：
  - 新学到的 skill 或修正过的 skill 会一起保存：
    - `platformKey`
    - `intentKey`
  - `findLearnedSkillForPrompt()` 现已先用平台/意图做约束，再匹配关键词，避免不同平台订单号混进同一条 skill。
  - `learnMatchedSkillOverride()` 写回时，会继承或补齐当前平台/意图标签。

- 服务端持久化修复：
  - `server.js / normalizeLearnedSkill()` 新增保留字段：
    - `platformKey`
    - `platformKeys`
    - `intentKey`
    - `intentKeys`
  - 否则前端学出来的结构化标签刷新后会丢失。

- 内置 skill 补分类：
  - `defaultReplySkills()` 中内置 skill 已补：
    - `order-redpacket-not-bound -> intentKey: order_missing`
    - `alipay-bind-failed -> intentKey: bind_failed`
    - `withdraw-success-no-reply -> intentKey: withdraw_query`
    - `system-conversation-event -> intentKey: general`

- 验证结果：
  - `npm run check` 通过。

- 后续继续改这块时的注意事项：
  - 不要再把 `skill` tab 塞回 `is-compact-tool`，否则滚动区又会退化。
  - 后续若要做更多平台区分，优先扩：
    - `SKILL_PLATFORM_DEFS`
    - `ORDER_TYPE_PLATFORM_KEYS`
    - `defaultReplySkills()`
  - 若要让 `当前匹配` 更智能，优先改：
    - `collectSkillContextMeta()`
    - `scoreReplySkill()`
    - `buildSkillGroupScore()`
  - 学习逻辑最容易回退的坑是：不要恢复成“采用过推荐就完全不学”。

2026-06-11 CodeBuddy 实测接通：

- 用户提供了真实 CodeBuddy API Key，要求确认现有接口是否能调用，不能则修好。

- 实测结论：
  - 之前网页里的 CodeBuddy 预设是错的：
    - `baseUrl = https://api.codebuddy.ai`
    - `model = codebuddy`
  - 这套配置实测会得到：
    - `404 Route Not Found`
  - 说明不是 key 无效，而是默认端点和模型就不对。

- 真实打通的参数：
  - 端点：`https://copilot.tencent.com/v2/chat/completions`
  - 鉴权：`X-Api-Key`
  - 模型：`deepseek-v3.1`
  - 请求模式：必须 `stream: true`

- 实测链路：
  - 直接请求 `https://copilot.tencent.com/v2/chat/completions`，带用户 key：
    - 用非流式会返回：`Non-stream chat request is currently not supported`
    - 用流式 + `model=codebuddy` 会返回：`model [codebuddy] service info not found`
    - 用流式 + `model=deepseek-v3.1` 则可正常返回
  - 通过本地代理 `http://localhost:5177/ai/chat/completions` 实测成功返回：
    - assistant content = `OK`

- 本次修改文件：
  - `public/app.js`
  - `server.js`

- 前端预设修复：
  - `AI_PRESETS.codebuddy` 改为：
    - `baseUrl: "https://copilot.tencent.com/v2"`
    - `model: "deepseek-v3.1"`
    - `authType: "x-api-key"`

- 服务端 AI 代理修复：
  - `getAiChatCompletionsUrl()` 现在识别 `copilot.tencent.com`：
    - `.../v2` -> 自动补到 `/v2/chat/completions`
    - 若已经是 `/v2/chat/completions` 则直接使用
  - 新增：
    - `isCodeBuddyTarget()`
    - `convertCodeBuddyStreamToJson()`
  - `proxyAi()` 逻辑新增：
    - 命中 CodeBuddy/Tencent Copilot 域名时，自动强制 `payload.stream = true`
    - 如果上游返回的是 SSE/stream 内容，则把增量片段拼成普通 OpenAI 兼容 JSON：
      - `choices[0].message.content`
    - 这样前端现有 `extractAiReplies()` 不需要重写也能继续工作

- 验证结果：
  - `curl http://localhost:5177/ai/chat/completions` 携带：
    - `baseUrl=https://copilot.tencent.com/v2`
    - `model=deepseek-v3.1`
    - `authType=x-api-key`
    - 用户提供的真实 key
  - 返回 `200 OK`
  - body 中成功得到：
    - `choices[0].message.content = "OK"`
  - `npm run check` 通过

- 后续注意事项：
  - 不要再把 CodeBuddy 默认端点改回 `api.codebuddy.ai`，当前实测是 404。
  - 不要把 CodeBuddy 默认模型写成 `codebuddy`，当前实测该模型不存在。
  - 如果后续用户换了新的 CodeBuddy 账号/网络环境，优先再次验证：
    - 是否仍走 `copilot.tencent.com/v2/chat/completions`
    - 是否仍要求 `stream=true`
    - 当前账号可用模型是否还是 `deepseek-v3.1 / deepseek-r1`

## 51. 2026-06-11 AI 渠道独立配置与模型拉取

## 52. 2026-06-11 左侧会话列表动态续页

用户新增反馈：

- 原客户端左侧会话列表在滑动接近底部时，会自动继续加载下一页，尤其 `历史` 分类更明显。
- Web 端之前更像固定一页列表，没有把联系人分页和滚动续页真正做起来。

本次修改文件：

- `public/app.js`

本次补齐内容：

- 左侧会话列表新增独立分页状态：
  - `state.contactListPage`
  - `state.contactListHasMore`
  - `state.contactListLoading`
  - `state.contactListAutoLoading`
- 联系人列表参数统一走：
  - `CONTACT_LIST_PAGE_SIZE = 20`
- 联系人接口加载模式扩展为：
  - `replace`
  - `append`
  - `merge`
- `loadContacts()` 不再只支持“替换第一页”：
  - `append` 会把下一页联系人按 `contactId` 去重合并后继续保持排序
  - `merge` 用于自动刷新时，把第一页最新数据和当前已加载的多页列表合并，避免每次刷新把列表缩回一页
- 新增左侧滚动自动续页：
  - `handleContactListScroll()`
  - 当前 / 留言 使用 `CONTACT_LIST_AUTOLOAD_THRESHOLD = 140`
  - 历史 使用更积极的 `CONTACT_LIST_HISTORY_AUTOLOAD_THRESHOLD = 220`
- 切换 `当前 / 留言 / 历史` tab 时，会重置联系人分页状态，再从第一页重新加载。

行为规则：

- 左侧列表滑动接近底部时，会自动拉下一页。
- `历史` tab 会比其他 tab 更早触发续页，更接近原客户端手感。
- 自动刷新期间：
  - 如果左侧当前只看第一页，继续 `replace`
  - 如果左侧已经翻出多页，自动刷新改走 `merge`
  - 这样不会每 10 秒把你已经翻出来的列表打回第一页

注意事项：

- 左侧联系人列表是“向下追加”，不是消息区那种“向上补旧消息”，因此不要套用 `restorePrependScroll()`。
- 分页状态属于左侧列表本身，不要在切换某个联系人时通过 `resetContactScopedState()` 清空，否则会把已加载的多页列表状态误删。

本次把 AI 设置从“全局共用一套字段”改成了“按渠道独立存储”。

新增能力：

- `sub2`、`DeepSeek`、`CodeBuddy` 三个渠道分别保存自己的 `baseUrl / apiKey / model / authType / temperature`。
- AI 设置弹层新增“当前渠道”下拉框和“获取模型”按钮。
- 模型输入改为“下拉选择 + 自定义模型名输入框”双轨模式。
- 服务端新增 `config/ai-providers.json` 作为 AI 渠道默认配置文件。
- 服务端新增 `/ai/providers`，前端启动时会读取默认渠道配置。
- 服务端新增 `/ai/models`，优先请求上游模型列表，失败时回退到本地已验证模型列表。

当前默认配置：

- `sub2`：`https://sub2.sn55.cn/`，默认模型 `gpt-5.4-mini`
- `DeepSeek`：`https://api.deepseek.com`，默认模型 `deepseek-v4-flash`
- `CodeBuddy`：`https://copilot.tencent.com/v2`，默认模型 `deepseek-v3.1`

实现细节：

- 前端本地存储改为：
  - `youchat.ai.provider`
  - `youchat.ai.providers`
- 旧共享字段 `youchat.ai.baseUrl / apiKey / model / authType / temperature` 会在首次加载时迁移到 `sub2` 渠道配置中。
- 打开 AI 设置弹层时会记录快照，未保存直接关闭会回滚，不会因为切换查看渠道就偷偷改掉当前运行态。
- 在弹层内切换渠道前，会先把当前输入框中的临时修改同步到对应渠道草稿，避免切换查看时丢失未保存内容。

注意事项：

- `CodeBuddy` 已验证仍应优先使用 `https://copilot.tencent.com/v2/chat/completions`，认证头为 `X-Api-Key`。
- `CodeBuddy` 的标准 `/models` 路由当前返回 404，因此 `/ai/models` 会自动回退到本地已验证模型列表，当前至少包括 `deepseek-v3.1`、`deepseek-r1`。
- `DeepSeek` 和 `sub2` 的模型列表获取已按 OpenAI 兼容接口路径处理，但如上游限制权限或未开放模型接口，也会回退到本地预置列表。

验证：

- `npm run check` 已通过。
- 如果 `http://localhost:5177` 页面还没出现新的渠道下拉框或“获取模型”按钮，说明旧的 `node server.js` 进程还在运行，需要重启当前开发服务。

## 52. 2026-06-11 CodeBuddy 探活 + skill 发送学习 + AI 推荐合并

本次继续收口了三件事：

1. `CodeBuddy` 的“获取模型”不再只是看到 `/models` 404 后静态回退。
2. 从 `skill` 面板点击“发送”后，系统会把实际发出的内容也学进去。
3. AI 推荐不再因为命中一个 `skill` 就提前结束，而是把 `skill / 快捷回复 / 已学习的人工作答习惯 / AI 结果` 组合成候选。

### 1. CodeBuddy 模型拉取修复

- 服务端新增 `probeCodeBuddyModels()`：
  - 不再依赖 `https://copilot.tencent.com/v2/models`
  - 改为对候选模型逐个发起真实 `chat/completions` 探活
  - 使用 `stream: true`
  - 当前通过实测可用的模型：
    - `deepseek-v3.1`
    - `deepseek-r1`
- `handleAiModels()` 在 `providerId === codebuddy` 或命中 CodeBuddy 域名时，直接走探活分支。
- 新进程验证结果：
  - 本地新端口 `http://127.0.0.1:5180`
  - `POST /ai/models`
  - 返回：
    - `source: "probe"`
    - `target: "https://copilot.tencent.com/v2/chat/completions"`
    - `models: ["deepseek-v3.1", "deepseek-r1"]`

### 2. skill 发送后的学习补齐

- `sendSuggestionSteps()` 现在会：
  - 记录本次发送后的 `lastAppliedSuggestionFingerprint`
  - 记录本次发送的 `lastAppliedSuggestionSkillId`
  - 在发送成功后调用 `learnFromSentSuggestion()`
- `learnFromSentSuggestion()` 会：
  - 读取最近一条真实客户消息作为 `prompt`
  - 读取这次真正发出去的文字和图片作为 `replySteps`
  - 命中已有 `skill` 时，走 `learnMatchedSkillOverride()`
  - 未命中时，回退到 `learnFromManualReply()` 的自动学习逻辑

这意味着：

- 你从 `skill` 面板直接点击“发送”，也会反哺学习。
- 后续你手工继续修正的风格，会更容易累积回对应 `skill`。

### 3. skill 发送改写：敏感词规避 + 轻微变体

- 新增：
  - `getSuggestionStepsForSend()`
  - `rewriteSkillSendText()`
  - `pickSkillVariant()`
  - `applySkillToneVariant()`
- 当前只对 `skill` 类型发送做发送前改写，不影响普通手输和图片本身。
- 现阶段规则：
  - `返利` -> `反L / 饭力 / 返点 / 回馈`
  - `返佣` -> `反Y / 返点 / 回馈`
  - `红包` -> `红宝 / 鸿包 / 红补 / 优惠包`
- 另外会根据 seed 自动加轻微前缀/尾缀，让相同 `skill` 的文案每次发出去不完全一样，但意思保持一致。

### 4. AI 推荐不再只看 skill

- 旧逻辑：
  - `requestAiRelaySuggestions()` 只要命中 `skill`，就直接 `appendAiSuggestions([skill])` 然后 `return`
- 新逻辑：
  - 不再提前返回
  - 会把以下内容一起写入 AI 上下文：
    - 当前真实聊天上下文
    - 当前命中的 `skill`
    - `getFaqPromptContext()` 的快捷回复参考
    - `getLearnedSkillPromptContext()` 的已学习人工作答样本
  - AI 返回后再通过 `mergeAiSuggestions()` 合并：
    - 当前命中的 `skill`
    - 前 2 条快捷回复
    - AI 生成候选
  - 最终去重后保留前 3 条

### 5. 自动推荐行为修正

- `generateAutoAiSuggestion()` 不再是“命中 skill 就不跑 AI”
- 现在会：
  - 先保留 `maybeBuildSkillSuggestion({ autoReply: true })`
  - 再继续调用 `requestAiRelaySuggestions({ silent: true })`
- 这样自动推荐时，也能保持：
  - `skill` 命中优先
  - 但仍然会并出 AI / 快捷回复候选

### 6. 本次涉及文件

- `server.js`
- `public/app.js`

### 7. 验证结果

- `npm run check` 已通过
- 新端口本地实测：
  - `http://127.0.0.1:5180/` 可返回页面
  - `POST http://127.0.0.1:5180/ai/models` 对 `CodeBuddy` 返回真实探活结果：
    - `deepseek-v3.1`
    - `deepseek-r1`

### 8. 后续注意事项

- 如果用户仍说 `CodeBuddy` 拉模型不对，先确认访问的是不是旧的 `5177` 进程，而不是新代码进程。
- `skill` 改写目前只做文字，不改图片。
- 如果后面要把“每次不同表达”做得更强，不要直接随机重写整句，优先在：
  - `rewriteSkillSendText()`
  - `applySkillToneVariant()`
里继续加受控模板。

## 53. 2026-06-11 右侧 Skill 面板重构与学习优先级修复

### 1. 问题背景

用户继续反馈右侧 `skill 回复` 工具栏有三个核心问题：

1. 格式难用，内容挤在一起，读起来累。
2. 滚动条虽然理论上存在，但视觉上太弱，像是没有。
3. `skill` 学习不够智能，明明人工纠正过多次，命中时还是优先展示旧文案。

### 2. 本次调整目标

这次不再沿用快捷回复那套 `quick-row` 四列布局硬套 `skill`，而是把 `skill` 面板改成独立的工作台结构：

- 左侧只保留序号与复制按钮。
- 中间主体分成标题区、话术预览区、图片条、学习信息区。
- 右侧操作按钮固定聚合，避免和正文抢空间。
- 当前命中时优先展示已经学到的人工作答版本，而不是始终显示原始 fallback。

### 3. 前端结构改动

涉及文件：

- `public/app.js`
- `public/styles.css`

关键点：

- `renderSkillGroup()` 不再复用 `quick-list`。
- `renderSkillMatchCard()` 改成：
  - 顶部命中标题 + 标签
  - 右上操作按钮
  - 下方预览文案
  - 图片条单独一行
- `renderSkillRow()` 改成独立 `skill-row` 结构：
  - `skill-row-aside`
  - `skill-row-main`
  - `skill-row-head`
  - `skill-row-actions`
  - `skill-row-preview`
  - `skill-row-foot`

这样 `skill` 的平台标签、意图标签、学习状态、图片张数、命中次数、修订次数都不会再挤在同一行里。

### 4. 滚动条修复

右侧 `skill-panel-scroll` 现在做了更明确的滚动提示：

- `scrollbar-width: auto`
- 更宽的 `12px` WebKit 滚动条
- 更亮的蓝色 thumb
- 浅色轨道底

目标不是花哨，而是让客服一眼看出“这里还能继续往下翻”。

### 5. 学习逻辑增强

新增或强化了几类能力：

- `getSkillOverrideCount(skill)`
- `buildSkillOverrideSteps(override)`
- `scoreSkillOverride(override, options)`
- `getPreferredSkillOverride(skill, options)`
- `getSkillReplyProfile(skill, options)`
- `compactInlineText(value, max)`

行为变化：

1. 当某个 `skill` 已有人工纠正记录时，会先根据当前上下文去选最贴近的一条 override。
2. 如果 override 已经足够稳定，会优先把这条学习版用于：
   - 当前命中的 `skill` 卡片展示
   - `skill` 面板里的“采用”
   - `skill` 面板里的“发送”
   - `skill` 的“优化”起始文案
3. `scoreReplySkill()` 现在会把 override 匹配度纳入打分，而不是只看 `keywords / samples / platform / intent`。
4. `findLearnedSkillForPrompt()` 也会把：
   - 平台
   - 意图
   - 历史 override prompt
   - override 数量
   一起纳入学习匹配，而不是只做非常浅的关键词包含。

### 6. 界面上新增的学习反馈

右侧 `skill` 卡片现在会直接显示学习结果：

- `学习版`
- `已纠正 N 次`
- `最近学习：xxxx`
- `带 N 图`
- `命中 N 次`
- `修订 N 次`

这样客服能直接看出来当前看到的是不是已经被自己修过的版本。

### 7. 发送 / 采用行为同步变化

`applySkillById()`、`sendSkillById()`、`optimizeSkillById()` 现在不再直接拿原始 `getSkillSteps(skill)`，而是先取当前上下文下的 `getSkillReplyProfile()`。

这意味着：

- 同一个 `skill` 在不同上下文里，优先带出的学习版更贴近当前客户问题。
- 客服从右侧点“发送”时，更接近自己最近真正采用过的风格。

### 8. 验证

- `npm run check` 已通过。
- 本轮还做了本地页面 DOM 验证，确认新结构类名已写入页面代码：
  - `skill-row-actions`
  - `skill-match-top`
  - `skill-panel-scroll`

注意：

- 如果右侧仍显示旧布局，基本可以判断当前浏览器访问的是旧进程缓存的页面，需要刷新或重启当前 `node server.js` 进程。

### 9. 后续维护规则

后面如果还要继续增强 `skill`：

1. 不要再把 `skill` 结构回退成 `quick-row`。
2. 学习优先级相关逻辑统一收口在：
   - `getPreferredSkillOverride()`
   - `getSkillReplyProfile()`
   - `scoreSkillOverride()`
3. 如果要做更细的“当前命中分类”排序，不要只改 CSS，要同时调整 `buildSkillGroupScore()` 和 override 匹配打分。

## 54. 2026-06-11 Skill 分类折叠与滚动条二次收口

### 1. 用户反馈

在上一轮 skill 面板重构后，用户继续反馈：

- 上方分类标签区还是太高，像“折叠的折叠”
- 真正的 skill 列表可视高度不足
- 右侧滚动条不明显，体感上像没有

### 2. 这次的处理原则

继续压缩 skill 顶部固定区，把高度尽量还给真正的 skill 列表：

- 固定保留最常用的两个分类：
  - `当前匹配`
  - `全部`
- 其他分类不再往下换行堆高，而是改成横向滚动轨道
- 未命中时，不再占一大块卡片，改成一行轻提示

### 3. 代码改动

涉及文件：

- `public/app.js`
- `public/styles.css`

新增：

- `splitSkillCategoryTabs()`

行为调整：

1. `renderSkillReplyPanel()` 不再直接把所有分类按钮一次性平铺换行。
2. `buildSkillCategoryTabs()` 的结果被拆成：
   - `pinned`
   - `rail`
3. `pinned` 只显示：
   - `当前匹配`
   - `全部`
4. 其余平台 / 意图分类进入横向可滚的 `skill-tabs-rail`

### 4. 样式调整

#### 顶部分类区

- `skill-tabs` 改成纵向双层结构
- `skill-tabs-pinned` 负责固定分类
- `skill-tabs-rail` 负责横向滚动分类
- 轨道本身也带细滚动条，避免看起来像一排被截断的按钮

#### 列表滚动区

- 重新确认 `skill-panel-scroll` 的滚动条样式不再被通用 `.quick-list` 覆盖
- 保持：
  - 更亮的 thumb
  - 更浅的轨道
  - `12px` 宽度

#### 列表内容密度

为了把空间还给列表，又压了一轮这些区块：

- group header
- row padding
- row gap
- actions gap
- meta tag margin
- image strip margin

同时把正文预览从 3 行放宽到 4 行，避免“内容刚展开一点就被截断”的感觉。

### 5. 未命中提示收口

原来未命中时，会占一整块 `skill-match-card`。

现在未命中时改成：

- `skill-inline-hint`

只保留轻提示：

- 当前未命中 skill
- 继续交给 AI 结合快捷回复兜底

这样 skill 列表能多露出一整截。

### 6. 验证

- `npm run check` 已通过。

### 7. 当前判断

如果用户刷新后仍看到：

- 分类大面积换行堆叠
- 没有横向分类轨道
- 未命中还是大块卡片

那基本说明当前浏览器拿到的还是旧 bundle，需要重启当前 `5177` 对应的 `node server.js` 进程后再看。

## 55. 2026-06-11 Skill 滚动方向理解纠偏

### 1. 纠偏原因

用户明确指出，上一轮把 `skill` 分类改成横向轨道，是理解错需求了。

用户真正要的是：

- 整个 `skill` 面板使用竖向滚动条
- 分类、命中提示、skill 列表一起顺着这个竖向滚动往下走

而不是：

- 分类自身做一个横向滚动条

### 2. 本次回退与修正

本次把上一轮新增的横向分类轨道逻辑撤回：

- 删除 `splitSkillCategoryTabs()`
- `renderSkillReplyPanel()` 恢复为：
  - `skill-tabs`
  - `skill-inline-hint / skill-match-card`
  - `skill groups`
  全部一起放进同一个 `skill-panel-scroll`

### 3. 样式回正

同步移除：

- `skill-tabs-pinned`
- `skill-tabs-rail`
- 横向 rail 的滚动条样式

当前策略重新回到：

- `skill-tabs` 允许多行换行
- 整块 `skill-panel-scroll` 作为唯一有效滚动区

### 4. 后续规则

后面如果继续调这块，先记住这个前提：

- 用户要的是右侧工具栏整体纵向滚动体验
- 不是顶部分类横向滑动体验

## 56. 2026-06-12 系统设置原生化与 Skill 学习纠偏

### 1. 背景

用户明确指出两个问题：

1. 右上角“系统设置”太像字段 dump，不像原生客户端。
2. `skill` 学习只会越学越脏：
   - 错误图片一旦学进去，后面不会自动去掉
   - 学习到的话术会反写进主 `skill`
   - 导致原始文案被带偏，越用越不可信

这次处理目标不是只修样式，而是一起修 UI 和学习机制。

### 2. 系统设置弹窗这次怎么改

涉及文件：

- `public/app.js`
- `public/styles.css`

#### 结构改动

`showClientOptionsModal()` 的 modal size 从 `wide` 调整为新的 `settings`。

`openToolModal()` 现在支持：

- `tool-modal-settings`

弹窗标题改为：

- `系统设置`

#### 字段映射规则

保留真实接口：

- 读取：`/System/GetOptions`
- 保存：`/System/SetOptions`

但展示不再直接 dump 四组原始字段，而是映射成更接近原客户端的设置项：

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

数据库模式也改成了可读文案：

- `0` -> `自定义数据库`
- `2` -> `跟随服务端`

#### 保底策略

真实字段仍然保留，只是移到：

- `高级配置`
- `服务端 AI 与数据库`
- `原始配置 JSON`

这样既保留真实调试能力，也不再把主界面做成后台表单。

### 3. Skill 学习这次怎么纠偏

涉及文件：

- `public/app.js`

#### 旧问题根因

旧逻辑里：

- `mergeTextWithExistingSkillImages()` 会把新图片和旧图片永久合并
- `learnMatchedSkillOverride()` 在学习次数够多后，会把学习结果反写回：
  - `replySteps`
  - `fallback`

这会导致：

- 一次误学习图片，后面一直带着
- 主 skill 的基线文案被学习覆盖污染

#### 新规则

1. `manualOverrides` 继续保留，但默认只作为“学习覆盖”使用。
2. 学习结果不再自动反写主 `replySteps` / `fallback`。
3. `getPreferredSkillOverride()` 更保守：
   - 无上下文时，至少 `count >= 3` 才启用
   - 有上下文时，匹配阈值从 `16` 提到 `22`
4. `getSkillReplyProfile()` 改为：
   - 命中学习覆盖时，直接使用 `normalizeSkillReplySteps(buildSkillOverrideSteps(...))`
   - 不再把旧主图重新并进学习覆盖

#### 图片更新规则

`updateSkillFromSuggestion()` 现在在显式更新 skill 时使用：

- `mergeTextWithExistingSkillImages(..., { replaceImages: true })`

含义：

- 这次明确提供了哪些图片，就只保留这次图片
- 不再把历史图片偷偷带回来

### 4. 新增恢复与清理入口

用户需要能把误学习的东西撤回，所以这次新增：

#### 单条恢复

每条 skill 右侧增加：

- `恢复`

行为：

- 清空该 skill 的 `manualOverrides`
- 恢复为主 `skill` 基线话术

函数：

- `resetSkillLearningById(id)`

#### 批量清理

skill 面板顶部新增：

- `清理学习`

行为：

- 扫描明显异常的学习覆盖并移除

当前噪音判定：

- 带图片但文本极短
- 回复文本超长
- 回复里是超长链接堆积

函数：

- `trimSkillLearningNoise()`
- `isSkillOverrideNoisy()`

### 5. Skill 面板本次顺手修的展示

#### 顶部动作

`skill 回复` 标题区现在有：

- `刷新`
- `清理学习`

#### 单条状态

每条 skill 会额外显示：

- `基线话术`
  或
- `学习覆盖 N 条`

这样可以直接看出当前是不是已经被学习覆盖过。

### 6. 本次仍需注意

1. `data/reply-skills.json` 是运行态学习数据，不要直接跟着代码提交。
2. `logs/api-capture.ndjson` 同样不要进代码提交。
3. 如果用户说“还是旧的系统设置样式”，先检查当前 `5177` 的 `node server.js` 是否重启。
4. 如果后面继续扩 `skill` 学习，优先扩 `manualOverrides` 的筛选策略，不要再回到“自动反写主 skill”的旧路上。

## 57. 2026-06-12 右栏 Skill 竖向滚动收口与输入框结构并档

### 1. 这次为什么继续改

用户继续反馈两类问题：

1. 右侧 `skill` 工具栏看起来还是乱：
   - 没有明显的竖向滚动条
   - 分类、命中卡片、skill 列表互相挤压
   - 折叠/分组区像“堆在一起”
2. 右上角设置和系统设置弹层虽然已经原生化一轮，但细节仍偏粗糙。

同时，当前工作区里还留着一组未提交但已经互相依赖的输入框结构改动：

- `public/index.html`
- `public/app.js`
- `public/styles.css`

这组改动把回复框从 `textarea` 切成了 `contenteditable`，并把表情面板提到了页面顶层。如果只提交样式或只提交脚本，会形成半状态。

### 2. 右栏 Skill 工具栏本次怎么收口

涉及文件：

- `public/styles.css`

#### 根因

问题并不是“少一条滚动条样式”那么简单，而是右侧容器链路里有两套高度模型同时存在：

- `.tool-content` 以前靠 `height: calc(100% - 42px)` 硬算
- `.skill-panel-scroll` 又自己吃满高度
- 分组 `.skill-group` 默认还能被 flex 压缩

结果就是：

- 滚动区域高度不稳定
- 内容有时被压扁
- 看起来像没滚动条，或者滚动条位置不对

#### 新结构

本次改成统一的单纵向滚动模型：

1. `.tool-content`
   - 改为 `flex: 1 1 auto`
   - 不再用 `calc(100% - 42px)` 硬算高度
2. `.tool-content.is-skill-tool`
   - 保持内部滚动，不再单独写死高度
3. `.skill-panel-scroll`
   - 作为真正的唯一竖向滚动容器
4. `.skill-group`
   - 明确 `flex: 0 0 auto`
   - 防止分组被压缩变形
5. `.skill-list`、`.skill-row-head`
   - 补 `min-width: 0`
   - 防止长内容把布局顶坏

#### 当前规则

后续如果再改右栏 `skill`：

- 竖向滚动只能保留一层主滚动容器：`.skill-panel-scroll`
- 不要再把分类 tab 或分组块做成独立横向滚动轨道
- 不要再回到 `calc(100% - xx)` 的手算高度模式

### 3. 设置区这次顺手打磨了什么

涉及文件：

- `public/styles.css`

#### 右上角菜单

`client-settings-menu` 这次继续收紧成更像原生菜单的尺寸和密度：

- 宽度从 `166px` 调整到 `184px`
- 内边距、阴影、字体统一压回更轻的桌面风格
- 每行菜单项高度微调为 `34px`

#### 系统设置弹层

`tool-modal-settings` 和客户端设置块继续做了二次收口：

- 弹层宽度改成更接近客户端的小面板比例
- 圆角、间距、标题字号收紧
- 分组标题、单选组、数字输入区统一减小密度

目的不是做“好看大面板”，而是贴近客户端那种紧凑工具设置感。

### 4. 输入框结构这次为什么一起并档

涉及文件：

- `public/index.html`
- `public/app.js`
- `public/styles.css`

当前输入框结构已经切换为：

- `replyText`：`contenteditable`
- `emojiPopover`：从输入附件区移到页面顶层
- 草稿图片：支持直接以内嵌块形式插入输入区

脚本侧已同步支持：

- 粘贴文字+图片时同时进入输入框
- 拖拽/选择图片时以内嵌图片块插入
- 发送时按“文本块 + 图片块”的顺序逐条发出
- 点击输入框里的图片可以直接预览

因此这次把这组结构与样式、脚本一起归档，避免以后出现：

- DOM 是旧的
- JS/CSS 是新的

这种最难排查的半成品状态。

### 5. Skill 学习这次新增的一个小纠偏

涉及文件：

- `public/app.js`

之前虽然已经防止“学习覆盖反写主 skill”，但还有个尾巴：

- 同一类 prompt 后续人工改了说法
- 老学习覆盖不会被同 prompt 的新覆盖自然顶掉

这次在 `learnMatchedSkillOverride()` 增加了一个小策略：

- 如果是同一个 prompt，但人工回复已经换了
- 新覆盖插入前，先把旧的同 prompt 覆盖移走

这样可以让 skill 更贴近你最近采用的真实回复方式，而不是一直往下堆。

### 6. 验证结果

- `npm run check` 已通过
- `http://localhost:5177/health` 返回正常

### 7. 本次提交边界

本次代码提交允许纳入：

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

本次仍然不要提交：

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

## 58. 2026-06-12 当前会话列表“接口有数据但 Web 偶发显示空”排查与修复

### 1. 排查结论

这次不是服务端整体挂了。

现场核查结果：

- `http://localhost:5177/health` 正常
- `http://192.168.9.83:18080/api/System/GetOptions` 正常
- 抓包日志里 `Contact/GetContactList` 正常返回：
  - 当前：`total = 5`
  - 历史：`total = 21`

因此问题不在“接口拿不到”，而在 Web 前端当前会话列表的 fallback 逻辑。

### 2. 根因

涉及文件：

- `public/app.js`

函数：

- `fetchContactListWithFallback()`

旧逻辑在当前会话 `current` 模式下会按 `accountId` 候选逐个尝试。

问题在于：

- 某个候选 `accountId` 只要返回“明确空列表”
- 前端就会立刻 `return` 这个空结果
- 后面的候选不会继续试
- 全局 `omitAccountId` 结果也不会再参与兜底

这样一来，只要本地记住的 `accountId` 候选里有一个失效或错位，就会出现：

- 服务端明明有真实数据
- Web 偶发显示空列表或不同步

### 3. 本次修复

修复原则：

1. 当前会话先拉一次全局兼容结果作为兜底参考
2. 再按 `accountId` 候选逐个尝试
3. 只有命中“有用结果”时立即返回
4. 所有候选都试完后，才决定是否回退到全局结果
5. 不再被单个空候选提前截断

也就是：

- `isUsefulContactListResult(result)` 才允许 account 结果立即返回
- 显式空结果先记录下来，不再直接把页面清空
- 最后优先使用 `global-fallback`

### 4. 当前判断规则

后续如果又遇到“接口有数据但页面空了”：

先看这几个点：

1. 抓包里 `Contact/GetContactList` 的真实返回是不是还有数据
2. `fetchContactListWithFallback()` 有没有被某个旧 `accountId` 候选提前命中空结果
3. 本地存储的：
   - `youchat.accountId`
   - `youchat.contactListAccountIds`
   是否积累了过期候选

### 5. 验证

- `npm run check` 已通过
- 抓包确认当前接口仍在返回真实会话数据

## 59. 2026-06-12 飞牛 SQLite 再次回退与一键恢复脚本

### 1. 现象

- 用户反馈“历史数据不对”。
- 当次真实探测里：
  - `POST /Contact/GetContactList(isHistory=true)` 只有 `total=24`
  - 全量联系人约 `total=481`
  - `accountId=2` 当前只有 `7`

### 2. 结论

这次不是 Web 前端把历史数算错了，而是飞牛服务端又重新读回了 SQLite。

`npm run fnos:health` 当次返回：

- `databaseType=2 (sqlite)`
- `historyContacts=24`
- `totalContacts=481`

因此历史数据不对的主因在服务端数据库模式，不在前端 tab 计数。

### 3. 原生请求形状复核

同时核对了 `localhost.har`：

- 原生客户端历史列表请求确实是：
  - `pageIndex=1`
  - `pageSize=80`
  - `id=0`
  - `isGuestbook=false`
  - `isHistory=true`
- 历史量级当时是 `5679`

2026-06-12 现场重新用同样的 `multipart/form-data` 请求形状直连飞牛：

- 仍然只返回 `24`

这说明当次问题不是“参数形状不一致导致历史口径偏差”，而是服务端真实读库模式已经变小。

### 4. 当次修复动作

这次直接通过悠聊真实接口恢复 MySQL 模式，而不是先手改 Web：

- `POST /System/ConnectDatabase`
- `POST /System/SetConnectionString`
- `POST /System/GetConnectionString`
- `POST /System/GetOptions`

使用已验证连接串：

- `Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=w5B22RLPpprsrxdt;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;`

恢复后立刻复测：

- `databaseType=0`
- `Contact total=8059`
- `History contacts=5732`
- `AccountId=2 current probe=7`

Web 本地代理 `http://localhost:5177/api/Contact/GetContactList` 也同步恢复：

- 历史 `total=5732`

### 5. 本次新增脚本

新增：

- `tools/restore-fnos-mysql-mode.ps1`
- `npm run fnos:restore:mysql`

用途：

- 当飞牛又掉回 `databaseType=2` 时，直接通过真实接口一键恢复到 MySQL 模式。

### 6. 前端顺手对齐

涉及文件：

- `public/app.js`

`buildContactListParams()` 现在默认补齐原生列表请求形状：

- `id=0`
- `isGuestbook=false`
- `isHistory=false`

再按 tab 覆写：

- `guestbook -> isGuestbook=true`
- `history -> isHistory=true`

已验证这不会影响当前会话短 id 请求：

- `accountId=2`
- `accountId=2 + id=0 + isGuestbook=false + isHistory=false`

返回一致。

### 7. 以后排查顺序

如果再出现“历史怎么突然只剩几十条”：

1. 先跑：

```powershell
cd C:\youchat-dev-web
npm run fnos:health
```

2. 如果看到 `databaseType=2`，先跑：

```powershell
npm run fnos:restore:mysql
```

3. 再复跑：

```powershell
npm run fnos:health
```

4. 只有在 `databaseType=0` 仍异常时，才继续追前端或 MySQL 分表问题。

## 60. 2026-06-12 左侧会话列表动态加载截断修复

### 1. 现象

用户反馈左侧会话列表“像被截断”，尤其切到“历史”后更明显。原生客户端会随着滚动继续动态加载，但 Web 版看起来只出一小截。

### 2. 真实排查结果

这次不是服务端没有更多数据。

2026-06-12 现场用真实接口直连飞牛验证：

- `POST /Contact/GetContactList`
- 参数形状：
  - `pageIndex=1`
  - `pageSize=80`
  - `id=0`
  - `isGuestbook=false`
  - `isHistory=true`

返回：

- `total=5739`
- `page1 list count=80`

继续请求第二页：

- `pageIndex=2`
- `pageSize=20` 或 `80`

都能拿到不同于第一页的真实联系人，说明服务端分页本身是正常的。

### 3. 根因

这次前端有两个叠加问题：

1. `loadContacts()` 里把 `state.contactListLoading` 置成了 `true`，但成功路径和失败路径结束后没有统一复位。
2. 左侧列表页大小之前被改成了 `20`，而原生抓包里首屏列表是 `pageSize=80`，因此在历史分类里更容易表现成“只出来一截”。

第一个问题会直接导致：

- `handleContactListScroll()` 里的自动追加加载长期被 `contactListLoading` 挡住。

### 4. 本次修复

涉及文件：

- `public/app.js`

本次已做：

1. 将左侧会话列表页大小恢复为更接近原生客户端的：
   - `CONTACT_LIST_PAGE_SIZE = 80`
2. 给 `loadContacts()` 增加统一收尾：
   - `finally { state.contactListLoading = false; }`
3. 新增 `scheduleContactListViewportFill()`
   - 当左侧列表首屏高度还没有撑满滚动容器，且服务端仍有更多页时，自动继续追加下一页。
   - 这样即使用户还没滚动，历史/当前列表也不会表现成明显“半屏截断”。

### 5. 验证结论

本次修改后：

- `npm run check` 通过
- `http://localhost:5177/health` 正常
- 真实接口复测历史第一页：
  - `pageSize=80`
  - `list count=80`
  - `total=5739`

### 6. 以后再遇到类似问题时先看哪里

先查：

- `loadContacts()` 是否有成对的 loading 置位/复位
- `handleContactListScroll()` 是否被 `contactListLoading` 或 `contactListAutoLoading` 卡住
- `CONTACT_LIST_PAGE_SIZE` 是否又被改小
- 原生抓包里 `GetContactList` 的 `pageSize` 是否变化

## 61. 2026-06-12 右侧工具栏、Skill 学习与红点滚动修复

### 1. 用户反馈

本轮集中修复这些体验问题：

- 右侧用户、订单、明细等工具面板宽度没有动态撑满，看起来短一块。
- skill 回复面板上半部分一个命中卡、下半部分又一个当前匹配列表，重复且割裂。
- skill 自动学习会把后续无关回复、偶发图片学到原来的订单 skill 里，导致下次推荐被反向污染。
- 右侧 skill/聊天记录列表手动滚动后，自动刷新会把滚动条强制跳回顶部。
- 从左侧会话列表点进会话时，有时主聊天区停在半空而不是最新消息底部。
- 红点消除与原客户端不一致，Web 本地清了但服务端/客户端可能又出现红点。

### 2. 涉及文件

- `public/app.js`
- `public/styles.css`

### 3. 右侧工具栏布局修复

`styles.css` 调整：

- `.tool-pane` 增加 `min-width: 0` 和 `overflow: hidden`。
- `.tool-tabs` 固定为 6 等分、宽度 100%。
- `.tool-content`、`.tool-section` 强制 `width: 100%` 和 `box-sizing: border-box`。
- skill 列表只保留竖向滚动，禁止横向溢出。

浏览器实测：

- 右侧 pane 宽度约 `382px`。
- tool content 宽度约 `381px`。
- 6 个工具 tab 均分，每个约 `64px`。
- section 宽度约 `357px`，正好扣掉左右 12px padding。

### 4. 右侧滚动保护

新增函数：

- `getToolScrollSelector()`
- `captureToolScrollSnapshot()`
- `restoreToolScrollSnapshot()`

`renderToolContent()` 在重绘前记录：

- 当前工具 tab
- 当前联系人 id
- 内部滚动容器选择器
- `scrollTop`

重绘后仅在“同一 tab + 同一联系人”时恢复滚动位置，避免自动刷新把 skill/聊天记录拉回顶部，也避免切换联系人时错误继承上一个人的滚动条。

### 5. Skill 面板结构修复

旧结构：

- 顶部 `renderSkillMatchCard()`
- 下方 `当前匹配` 分组

这会把同一个命中 skill 展示两遍。

新结构：

- 顶部只保留一条轻量 `renderSkillMatchHint()` 状态提示。
- 具体文案、图片、采用、发送、优化、恢复都放在 skill 行里。
- 命中的 skill 仍排在 `当前匹配` 第一条，其他相关 skill 变暗但可浏览。

### 6. Skill 学习防污染

新增状态：

- `lastAppliedSuggestionPromptKey`
- `lastAppliedSuggestionContactId`
- `lastAppliedSuggestionAt`
- `lastAppliedSuggestionPlatformKey`
- `lastAppliedSuggestionIntentKey`

新增函数：

- `rememberAppliedSuggestionContext()`
- `clearAppliedSuggestionContext()`
- `isAppliedSuggestionContextValid()`
- `canLearnAsMatchedSkill()`

规则：

- 只有同一会话、同一触发消息或平台/意图一致，并且未超过 10 分钟窗口，才允许把人工修改写回原 skill。
- 切换联系人时清空上一会话的应用上下文。
- 同一 prompt 下新的不同回复不再删除旧 override，而是保留多个变体。
- 只有同一变体累计 `count >= 3` 时，才会优先顶替基线话术。
- 一次偶发图片会被记录，但不会立刻污染常用订单 skill。

### 7. 会话点击与聊天区滚动

`selectContactById()` 调整：

- 普通点击会话默认滚到最新消息底部。
- 不再在普通会话点击时自动跳到红点消息锚点。
- 明确 bottom 渲染时 `renderMessages("bottom")` 使用 `force: true`。
- 需要跳红点时，重复点击 `当前` tab 且当前消息区有红点锚点，会执行 `scrollToFirstUnreadMessage()`。

### 8. 红点消费同步

`syncConsumedMessages()` 调整：

- 先通过 `getConsumableMessageIds()` 收集真实红点消息 id。
- 逐个调用 `consumeMessageWithFallback(contactId, msgId)`。
- 最后仍调用 `consumeMessageWithFallback(contactId, 0)` 兜底。
- 单条 msgId 消费失败不会阻断后续 `msgId=0` 兜底。
- 成功后执行 `clearLocalMessageRedPoints()`，清理本地 `messages`、`activeContact.records`、`contacts.records` 的 redPoint 标记。

### 9. 验证

已验证：

- `npm run check` 通过。
- `http://localhost:5177/health` 返回 `ok: true`，端口仍为 `5177`。
- 使用本机 Edge 通道打开 `http://localhost:5177` 并成功连接。
- 右侧工具栏宽度实测正常。
- skill 面板实测为竖向滚动，无横向溢出，旧的上半块 match card 数量为 0。

### 10. 后续注意

- 不要把 `data/reply-skills.json` 的运行时学习结果随功能代码一起提交，除非明确要固化技能库。
- 不要把 `logs/api-capture.ndjson` 提交。
- 如果以后又出现 skill 被图片污染，先看某个 override 的 `count` 是否达到 3，再看 `lastAppliedSuggestion*` 上下文是否被绕过。

## 2026-06-13：红点筛选对齐原生与飞牛容器恢复

### 1. 红点筛选规则修正

原 Web 错误规则：

- 勾选“只显示红点消息”后，本地用 `message.isRedPoint || message.direction === "incoming"` 过滤。
- 这会把所有客户发来的普通消息都当红点显示，和原生客户端不一致。

原生客户端证据：

- `YouChatService.xml` 里 `ChatContentService.GetList(... onlyRepointMsg)` 明确用于只取红点消息。
- 原生 `chatHistory` bundle 在切换 checkbox 时调用 `/ChatContent/GetList`，并传 `onlyRepointMsg`。
- `/Account/GetRedPointConfig` 是 GET，返回后台“显示红点”的真实配置。

当前实现：

- `redOnly` 变更后会重新请求消息第一页，而不是只前端过滤。
- `fetchMessagePage()` 根据 `redOnly` 传 `onlyRepointMsg: true/false`。
- 红点模式不再回退展示 `activeContact.records` 预览，避免服务端无命中时又显示普通消息。
- `renderMessages()` 不再把 `incoming` 当作红点，直接渲染服务端返回的当前分页。

### 2. 客户端设置新增只读红点配置

右上角客户端设置仍保留 `/System/GetOptions` 原生系统设置，同时新增“显示红点”只读区：

- 读取 `/Account/GetRedPointConfig`。
- 读取 `/Contact/GetRedPointConfig` 补充 `msgType` 编号。
- 按原管理页语义分组展示：订单、查券/提现、指令/消息、消息提示、其他。
- 展示关键词列表，例如 `fuzzyMiniTitleList`。
- 未确认保存接口前，不在 Web 里伪造红点配置保存。

### 3. 飞牛 youliaoapp 容器检查

用户截图显示两个辅助容器红点：

- `youchat-control`
- `youchat-backup`

SSH：

- 主机：`192.168.9.83`
- 用户：`Boom`
- 可用密码：`950331..`

检查结论：

- 主业务容器正常：`youchat-service`、`youchat-mysql`、`youchat-autologin` 都在运行。
- `youchat-service` 暴露 `18080 -> 8080`，业务 API `/api/Contact/GetContactList` 可返回真实数据。
- MySQL 容器 healthy，数据库包含 `1556504756803862529`。
- `youchat-control` 和 `youchat-backup` 退出原因不是代码错误，而是飞牛云盘授权失效导致 Docker 创建备份挂载源失败：
  `mkdir /vol02/1000-1-713f7ca0/来自：飞牛私有云: operation not permitted`

用户重新授权飞牛云盘后：

- 源目录 `/vol02/1000-1-713f7ca0/来自：飞牛私有云/youliaobackup` 恢复可读写。
- 未修改 `.env`，继续使用原备份路径。
- 执行 compose 恢复后，5 个 youchat 容器均为 Up：
  `youchat-autologin`、`youchat-control`、`youchat-mysql`、`youchat-backup`、`youchat-service`。
- `youchat-control` 挂载仍指向原源目录。

### 4. 飞牛诊断命令

常用状态检查：

```powershell
@'
import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
host='192.168.9.83'; user='Boom'; pwd='950331..'
client=paramiko.SSHClient(); client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=pwd, look_for_keys=False, allow_agent=False)
cmd='echo 950331.. | sudo -S -p "" docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" | grep youchat || true'
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8','replace'))
client.close()
'@ | python -
```

业务 API 检查：

```powershell
Invoke-RestMethod -Method Post -Uri "http://192.168.9.83:18080/api/Contact/GetContactList" -Body @{ pageIndex=1; pageSize=1 }
Invoke-RestMethod -Method Get -Uri "http://192.168.9.83:18080/api/Account/GetRedPointConfig"
```

控制 API token header 是：

```text
X-Control-Token: <YOUCHAT_CONTROL_TOKEN>
```

不是 `Authorization: Bearer ...`。

## 62. 2026-06-13 底部会话分类红点与未读跳转修复

### 1. 问题

底部会话分类按钮（当前、留言、历史）上的红点数字显示不清楚，尤其是 `历史 (5741)` 这类长计数场景，原实现同时渲染数字角标和 `.conversation-tab.has-unread::after` 小圆点，导致红色元素叠在一起，白色数字发糊、拥挤。

另一个问题是：分类按钮有红点时，点击 `当前`、`历史` 等按钮只会切换列表或刷新列表，不会像原客户端习惯那样定位到未读/红点消息。

### 2. 当前实现

相关文件：

- `public/app.js`
- `public/styles.css`

行为规则：

- `renderConversationTabs()` 统一通过 `getListUnreadCount(tab)` 读取底部红点数量。
- `getContactUnreadCount()` 同时兼容 `unread`、`unRead`、`redDot`、`unReadCount`、`redPoint`、`redpoint`，避免接口字段差异导致列表和底部红点不同步。
- 点击带红点的底部分类时，会执行 `jumpToUnreadInActiveList(tab)`：
  - 如果当前分类已经激活，直接在当前列表中找第一个未读会话。
  - 如果是切换到其他分类，先 `loadContacts()` 加载该分类，再找第一个未读会话。
  - 如果当前已加载列表里没有未读会话，但列表还有更多页，会继续 append 加载最多 6 页来找未读会话。
  - 找到未读会话后调用 `selectContactById(contactId, { jumpUnread: true })`，加载真实聊天记录并滚动到第一条 `data-red-point="true"` 消息。
- `selectContactById()` 新增 `jumpUnread` 选项：
  - 普通点击会话仍然按原逻辑打开最新消息并清红点。
  - 红点分类跳转时先加载和定位红点消息，再执行 `markContactRead(..., { sync: true })` 和后续同步。
- 新增 `messagesFromPreview` 状态，区分“会话列表 records 预览消息”和“真实 `/ChatContent/GetList` 聊天记录”。红点跳转时如果当前只是预览态，会强制拉真实聊天页，避免把列表预览误当完整聊天记录。

### 3. UI 修复

- 移除 `.conversation-tab.has-unread::after`，不再叠加额外红点。
- `.conversation-tab i` 改为清晰的红色数字胶囊：
  - `min-width: 18px`
  - `height: 18px`
  - 白色描边
  - `font-variant-numeric: tabular-nums`
  - `99+` 封顶
- 底部标签容器和按钮设置 `overflow: visible`，角标抬到右上角时不会被裁剪。
- 跳到红点消息后，目标消息会短暂添加 `.is-jump-highlight`，用红色边框和淡阴影提示当前位置。

### 4. 验证

已执行：

```powershell
npm run check
```

结果：通过。

注意：`data/reply-skills.json` 与 `logs/api-capture.ndjson` 是运行时脏文件，本次不提交。

## 63. 2026-06-13 SQLite 回退恢复与图片发送性能修复

### 1. 服务端状态

用户反馈回复几条消息后数量异常。执行：

```powershell
npm run fnos:health
```

发现飞牛服务端再次回退到 SQLite：

- `databaseType=2`
- `totalContacts=497`
- `historyContacts=24`

随后执行：

```powershell
npm run fnos:restore:mysql
npm run fnos:health
```

恢复结果：

- `databaseType=0`
- `databaseMode=mysql`
- `totalContacts=8066`
- `historyContacts=5736`
- `currentAccount2=6`

结论：本次消息数量异常首先是后端运行库又切到 SQLite，不是 Web 计数逻辑本身。

### 2. 图片发送卡住原因

从 `logs/api-capture.ndjson` 看到一次 `/local/oss-upload` 在拿到 Qiniu 配置后卡了约 40 秒并 `fetch failed`。原配置：

- 前端本地代理上传超时 `LOCAL_IMAGE_UPLOAD_TIMEOUT_MS=70000`
- 服务端 OSS 代理超时 `OSS_UPLOAD_TIMEOUT_MS=70000`

同时 `sendText()` 把以下步骤全部包在同一个“发送中”锁里：

- 上传图片
- 调用 `/ChatContent/SendMsg`
- `learnFromManualReply()` 学习 skill
- `loadMessages()` 刷新聊天
- `syncConsumedMessages()` 清红点
- `loadContacts()` 刷新会话列表

所以多图或 OSS 抖动时，消息可能已经提交成功，但按钮仍显示发送中很多秒。

### 3. 当前修复

相关文件：

- `public/app.js`
- `server.js`

图片上传：

- 前端本地代理超时从 `70000ms` 降到 `12000ms`。
- 浏览器直传超时调整为 `20000ms`。
- 服务端 `/local/oss-upload` 的上游 OSS 超时从 `70000ms` 降到 `20000ms`。
- 新增 `prepareImageForUpload()`：
  - GIF/SVG 不压缩，避免破坏动图或矢量图。
  - 大图最长边压到 `1600px`。
  - 大图转 JPEG，质量 `0.86`。
  - 小于约 `900KB` 的非 PNG 图片不处理。
  - 上传前记录压缩前后大小到日志。
- `sendText()` 会缓存每张草稿图的 `image.uploadUrl`，部分发送失败后重试不会重复上传已成功的图片。

发送流程：

- 移除了多图发送中每张图之间的固定 `180ms` 延迟。
- `sendText()` 和 `sendImageFile()` 在消息提交成功后立即清输入框、更新左侧会话预览并释放发送锁。
- `learnFromManualReply()`、`loadMessages()`、`syncConsumedMessages()`、`loadContacts()` 改由 `schedulePostSendMaintenance()` 后台执行。
- 后台刷新只在当前仍停留同一会话时刷新聊天区，避免客服切到其他会话后被后台任务拉回。

### 4. 验证

已执行：

```powershell
npm run check
npm run fnos:health
```

结果：

- `node --check server.js && node --check public/app.js` 通过。
- 飞牛服务端为 MySQL，健康检查通过。

注意：因为 `server.js` 改了 OSS 代理超时，正在运行的 `http://localhost:5177` 服务需要重启后才会使用新的服务端超时；前端 `public/app.js` 需要刷新页面后生效。

## 65. 2026-06-13 当前会话头部与会话列表用户类型标签修复

### 1. 用户反馈

用户指出 Web 当前会话头部和原生客户端不一致：

- 当前会话头部显示拥挤，曾出现 `所属机器人: null`、空备注括号等无效信息。
- 当前会话头像上叠了一个文字，默认头像观感不如客户端。
- 左侧会话列表需要在昵称后面显示用户类型小标签：
  - `个微`
  - `公众号`
  - `企微`
- 当前用户主要有 `个微` 和 `公众号`，但 Web 需要预留 `企微`。

### 2. 本次修复

相关文件：

- `public/app.js`
- `public/styles.css`
- `public/index.html`

会话列表：

- 新增真实字段识别用户类型：
  - `getContactRobotType(contact)`
  - `getContactTypeLabel(contact)`
  - `getContactTypeClass(contact)`
  - `renderContactTypeBadge(contact)`
- 类型判断规则：
  - `robotType=6` 显示 `公众号`
  - `robotType=2/9` 显示 `企微`
  - 其他微信 PC/手机类默认显示 `个微`
  - 如果未来接口直接给 `robotTypeName/contactTypeName/accountTypeName`，包含 `公众号` 或 `企微` 时也会识别。
- `normalizeContact()` 保留并规范化 `robotType`、`robotName`，标签完全来自真实接口字段，不造假身份。
- 左侧列表昵称行改为：
  - 昵称
  - 紧贴昵称的小标签
  - 第二行显示备注、机器人名或微信号，且会过滤和昵称完全重复的信息。

当前会话头部：

- `renderActive()` 改成原生客户端式两行：
  - 第一行：昵称 + 有效备注
  - 第二行：`微信号 ...，用户ID ...`
- 新增展示值清洗：
  - `cleanDisplayText(value)`
  - `firstDisplayValue(...values)`
  - `isSameDisplayText(left, right)`
- 这些函数只影响 UI 展示，过滤空值、`null`、`undefined`、`NaN` 等无效字符串，避免头部出现 `null` 或空括号。
- 如果备注和昵称完全一样，头部不再重复显示 `昵称（同昵称）`。

头像：

- `renderContactAvatar()` 支持显式传入空 `fallbackText`。
- `handleAvatarImageError()` 支持空 fallback，不再强制回退到 `客`。
- 当前会话头像无图时使用 CSS 默认头像图形，不再把首字盖在头像上。
- `public/index.html` 初始静态头像也同步改成无文字默认头像，避免页面刚加载时闪出 `客` 字。

### 3. 样式细节

- 新增 `.contact-title-row`，保证长昵称截断、小标签不被挤没。
- 新增 `.contact-type-badge`：
  - `个微`：蓝色轻量标签
  - `公众号`：红色轻量标签
  - `企微`：绿色轻量标签
- 当前头部昵称强制单行省略，备注也不换行，避免挤压第二行微信号和用户 ID。

### 4. 验证

已执行：

```powershell
npm run check
git diff --check
Invoke-RestMethod -Uri "http://localhost:5177/health"
```

结果：

- `node --check server.js && node --check public/app.js` 通过。
- `git diff --check` 无空白错误。
- 本地服务 `http://localhost:5177` 健康检查正常，API 仍指向 `http://192.168.9.83:18080/api`。
- 使用真实接口连接 Web 工作台验证：
  - 会话列表真实加载。
  - 当前头像文字为空。
  - 当前头部保持两行结构。
  - 左侧会话列表显示 `个微` 标签。

注意：本次只改前端展示层，不改服务端、数据库、会话分页、红点接口。

## 66. 2026-06-13 当前会话头部改回原生客户端信息结构

### 1. 用户反馈

用户再次对比原生客户端截图指出，Web 当前会话头部仍然不是原生显示方式。

原生客户端头部结构是：

- 第一行：`昵称（客户备注）`
- 第二行：`所属机器人：机器人名称（机器人类型）  备注：机器人备注`

用户还要求在第一行 `昵称（客户备注）` 后面继续显示用户类型标签，例如 `个微`、`公众号`、`企微`。

### 2. 本次修复

相关文件：

- `public/app.js`
- `public/styles.css`

新增头部机器人信息 helper：

- `getContactRobotName(contact)`
- `getContactRobotRemark(contact)`
- `getContactRobotTypeText(contact)`
- `getActiveRobotMetaText(contact)`

当前会话头部规则调整：

- `renderActive()` 不再把 `微信号`、`用户ID` 放在聊天头部。
- 头部第一行改为：
  - `displayName`
  - `（客户备注）`
  - `renderContactTypeBadge(contact, "active-type-badge")`
- 头部第二行改为：
  - `所属机器人：${robotName}（${robotTypeName}）  备注：${robotRemark}`
- 详细的用户微信号、用户 ID 仍然保留在右侧用户信息面板，不在聊天头部重复显示。

### 3. 样式调整

- `#activeTitle` 改成横向 flex，用来承载昵称、备注和标签。
- `.active-name-text`、`.active-remark`、`.active-type-badge` 单行显示，超长内容省略。
- `#activeMeta` 固定单行省略，避免长机器人名称把头部撑高。
- 头部里的类型标签复用 `.contact-type-badge`，但补了 `.active-contact .contact-type-badge` 覆盖，避免被通用 `.active-contact span` 规则拉错字体和行高。

### 4. 验证

已执行：

```powershell
npm run check
git diff --check
Invoke-RestMethod -Uri "http://localhost:5177/health"
```

真实接口浏览器验证：

- 选择 `A-文静` 会话后：
  - 头部第一行：`A-文静（51-260613-A-文静）个微`
  - 头部第二行：`所属机器人：我们的小秘密 ¹°（微信手机版）  备注：小秘密10`
- 页面端口仍为 `http://localhost:5177`。

注意：本次只改聊天头部展示，不改右侧用户信息面板、会话列表数据加载、红点或消息接口。

## 67. 2026-06-13 skill 训练中心独立页面

### 1. 用户反馈

用户认为当前 skill 自动学习质量不好，希望单独出一个页面来训练：

- 总结今天这些客服回复和系统学到的 skill。
- 把可能需要改的学习项列出来。
- 由用户批复是否需要优化。
- 用户能改写文案，让系统以后学得更准。

### 2. 设计原则

本次不再让自动学习“悄悄变强”，而是增加人工 review 层：

- 自动学习仍然写入 `data/reply-skills.json`。
- 训练中心只读取并整理这些学习项。
- 真正改 skill 必须由用户在训练页点击批复动作。
- 批复后直接写回同一个 skill 文件，右侧 skill 回复和 AI 推荐会继续使用这些结果。

### 3. 新增文件

- `public/skill-training.html`
- `public/skill-training.css`
- `public/skill-training.js`

入口：

- 右上角客户端设置菜单新增 `skill 训练`。
- 点击后打开 `/skill-training.html`，不会打断当前客服工作台。

### 4. 新增本地接口

相关文件：

- `server.js`

新增接口：

- `GET /local/skill-training?date=YYYY-MM-DD&scope=today|all`
- `POST /local/skill-training`

`GET` 行为：

- 读取 `data/reply-skills.json`。
- 按 Asia/Shanghai 日期整理今日或全部 skill。
- 自动识别并标记：
  - `自动学习`
  - `手动沉淀`
  - `今日覆盖`
  - `覆盖 N`
  - `带图片`
  - `疑似脏学习`
  - `话术过长`
  - `待优化`
  - `已批准`
  - `已优化`
  - `已停用`
- 返回 `summary` 和 `items` 给训练页面。

`POST` 支持动作：

- `approve`：批准原样或带编辑内容批准。
- `optimize`：保存优化后的标题、关键词、回复文案、自动回复开关等。
- `needs-review`：标记为待优化。
- `disable`：停用这条 skill。
- `delete`：删除异常学习记录。
- `clear-overrides`：清空某条 skill 的 `manualOverrides` 学习覆盖。

### 5. 脏学习判断

服务端新增 `isTrainingDirtyText(text)`，会优先标记以下内容：

- 纯数字或测试类短语。
- 超长文案。
- 下载链接、文件名、文件大小、CRC32、MD5、SHA、压缩包等明显非客服话术。
- `巴嘎`、`454654` 等明显异常学习样本。

这次实际接口验证中，训练中心总结到：

- `15` 条待审 skill。
- `15` 条需要复核。
- `14` 条疑似脏学习。
- `17` 条学习覆盖。
- `12` 条带图片。

说明当前自动学习确实已经混入了需要人工清洗的内容。

### 6. 页面能力

训练页每条 skill 展示：

- 标题、来源、平台、意图、最近时间。
- 风险/状态标签。
- 关键词、样本、最近人工覆盖。
- 当前入库话术。
- 已保存图片缩略图。
- 可编辑的标题、关键词、回复文案、备注。
- `可自动回复` 和 `无需回复` 开关。

可执行动作：

- `填入当前`
- `填入最近人工回复`
- `标记待优化`
- `批准原样`
- `保存优化`
- `清空覆盖`
- `停用`
- `删除`

### 7. 验证

已执行：

```powershell
npm run check
git diff --check
Invoke-RestMethod -Uri "http://localhost:5177/health"
Invoke-RestMethod -Uri "http://localhost:5177/local/skill-training?scope=today"
```

结果：

- `node --check server.js && node --check public/app.js && node --check public/skill-training.js` 通过。
- 训练接口可返回今日 summary 和 items。
- 无效提交测试返回 `400`，不会误写数据。
- 浏览器打开 `http://localhost:5177/skill-training.html` 可正常渲染统计、待审卡片和批复按钮。

注意：因为新增了 `server.js` 路由，本次已重启本地 `5177` 的 `node server.js`，仍使用原端口，不换端口。

## 68. 2026-06-13 Skill 队列式训练与相似学习聚类

### 1. 用户反馈

用户指出训练中心仍然不智能：

- 不应该“回复一次就训练一次”。
- 相似回复应先归并成一类训练样本。
- 客户首次提问、客户追问、客服补充引导是不同阶段，不能互相覆盖。
- 客服采用推荐后又手动修改，或客户后续继续追问时，不能把后续回复反向优化掉一开始正确的 skill。
- 图片被偶然学进去后，需要能在训练页删掉或改掉。
- 训练页面应该一次只显示一条，处理后自动进入下一条，不要保存后跳到顶部。

### 2. 学习策略修复

相关文件：

- `public/app.js`
- `server.js`
- `public/skill-training.js`
- `public/skill-training.css`
- `public/skill-training.html`

核心变化：

- `getSkillReplyProfile()` 不再因为 `manualOverrides` 累计 3 次就自动使用覆盖话术。
- 覆盖样本只有在 `override.approved === true`、`override.trainingStatus === "approved"`、`skill.useManualOverrides === true` 或显式 `forceLearned` 时才会替代基线。
- `learnFromManualReply()` 未命中正式 skill 时，不再直接创建可用的正式自动学习 skill。
- 新的未命中学习会写入候选池：
  - `learningMode = "review_queue"`
  - `trainingStatus = "needs_optimization"`
  - 新候选默认 `enabled = false`
  - 新候选默认 `allowAutoReply = false`
- 同类候选按 `learningBucketKey` 聚合，组成规则为：
  - 平台：如 `taobao`、`jd`、`pdd`
  - 意图：如 `order_missing`、`bind_failed`、`withdraw_query`
  - 阶段：`first_answer` 或 `customer_followup`
  - 关键词签名
- `learnMatchedSkillOverride()` 命中已有 skill 时只追加训练覆盖样本，并把 skill 标记为待优化；不再自动提高优先级、打开自动回复或反写正式话术。

### 3. 对话阶段

新增：

- `getLearningStageForMessage(latest)`
- `buildLearningBucketKey(prompt, contextMeta, learningStage)`
- `findLearnedSkillForBucket(prompt, contextMeta, learningStage)`
- `mergeManualTrainingOverride(overrides, override)`

阶段规则：

- 如果客户消息之前最近一次有效消息是客服回复，则标记为 `customer_followup`。
- 否则标记为 `first_answer`。
- 这样客户追问后的补充解释，不会覆盖首次答复流程。

### 4. 训练中心队列 UI

训练页从“多卡片列表”改为“单条审核队列”：

- 页面只渲染一条 `.training-card`。
- 顶部显示 `第 X / N 条`。
- 左右按钮支持上一条/下一条。
- 进度条用小胶囊显示风险状态。
- 保存优化、批准、删除、停用、清空覆盖后自动推进到下一条。
- 普通刷新会尽量保留当前审核位置。
- 方向键左右可以切换训练项。

训练卡片分三栏：

- `相似场景`：关键词、样本、阶段、最近人工回复、相似问法。
- `当前入库`：当前正式话术、当前图片、人工回复变体。
- `审核编辑`：标题、平台、意图、关键词、样本问题、回复文案、图片 URL、备注、自动回复/无需回复开关。

图片处理：

- `imageUrls` 现在是独立编辑字段。
- 可从当前 skill、最近人工回复或某个回复变体填入图片。
- 保存优化时服务端按 `imageUrls` 重建图片步骤，所以误学进去的图片可以删掉。

### 5. AI 整理

训练卡片新增 `AI 整理`：

- 读取和工作台一致的 localStorage AI 渠道配置。
- 支持 sub2、DeepSeek、CodeBuddy 的 OpenAI 兼容中转。
- 只让 AI 生成候选 JSON：
  - `title`
  - `keywords`
  - `samples`
  - `replyText`
  - `note`
  - `allowAutoReply`
  - `noReply`
- AI 不会直接写入 skill 文件，必须用户再点 `保存优化` 或 `批准启用`。

### 6. 服务端训练摘要

`server.js` 新增训练摘要 helpers：

- `normalizeTrainingComparableText()`
- `uniqueTrainingList()`
- `getTrainingStageLabel()`
- `buildSkillManualTrainingSummary()`
- `chooseSkillTrainingProposalText()`
- `chooseSkillTrainingImages()`

`GET /local/skill-training` 现在返回：

- `promptVariants`
- `replyVariants`
- `stageLabels`
- `storedImageUrls`
- `learningMode`
- `learningBucketKey`
- `learningStage`

`manualOverrides` 保留上限从 12 条提升到 24 条，方便聚类训练时看到更多真实人工样本。

### 7. 闲时采样

新增接口：

- `POST /local/skill-training/sample`

用途：

- 从真实悠聊 API 小批量拉联系人和聊天记录。
- 识别 `source=0` 的客户消息与 `source=2` 的客服人工回复。
- 把相邻的“客户问题 -> 人工回复”转换成训练候选。
- 只写入 `review_queue` / `needs_optimization` 候选，不直接启用，不打开自动回复。

默认前端按钮：

- 训练页右上角新增 `闲时采样`。
- 默认采样 `18` 个联系人，每个联系人最多 `80` 条消息。
- 采样后刷新当前训练队列。

内部测试能力：

- `dryRun=true` 时只跑真实接口和聚类逻辑，不写 `data/reply-skills.json`。
- 本次用 `dryRun` 验证小样本：
  - 取到 `4` 个联系人。
  - 识别 `2` 组客户消息与人工回复。
  - 模拟新增 `2` 条候选。

### 8. 验证

已执行：

```powershell
npm run check
git diff --check
Invoke-RestMethod -Uri "http://localhost:5177/health"
Invoke-RestMethod -Uri "http://localhost:5177/local/skill-training?scope=today"
Invoke-RestMethod -Method Post -Uri "http://localhost:5177/local/skill-training/sample" -Body '{"dryRun":true,"contactLimit":2,"messageLimit":30}' -ContentType "application/json"
```

浏览器烟测：

- 使用 Playwright 打开 `http://localhost:5177/skill-training.html`。
- 页面只渲染 `1` 条训练卡片。
- 队列显示 `第 1 / 14 条`。
- 接口项已带 `replyVariants` 和 `promptVariants`。
- `闲时采样` 按钮存在。
- 底部操作区为 sticky。
- 训练页没有 JS 页面错误；仅 favicon 404。

注意：

- `data/reply-skills.json` 是运行时学习数据，本次不提交。
- `logs/api-capture.ndjson` 是运行抓包日志，本次不提交。
- 本次已重启本地 `5177` 服务，仍使用原端口。

## 69. 2026-06-15 Web 数据库一键修复按钮

### 1. 问题

用户反馈飞牛后端数据库又崩溃，Web 和官方客户端数据数量异常。

本次先执行：

```powershell
npm run fnos:health
```

确认服务端再次切到 SQLite：

- `databaseType=2`
- `databaseMode=sqlite`
- `totalContacts=500`
- `historyContacts=24`
- `currentAccount2=8`

随后执行：

```powershell
npm run fnos:restore:mysql
npm run fnos:health
```

恢复后：

- `databaseType=0`
- `databaseMode=mysql`
- `totalContacts=8072`
- `historyContacts=5688`
- `currentAccount2=62`

### 2. 新增本地修复接口

相关文件：

- `server.js`

新增常量：

- `FNOS_MYSQL_CONNECTION_STRING`

默认值仍是已验证可用的飞牛 MySQL 连接串：

```text
Server=mysql;Port=3306;Database=1556504756803862529;User ID=yz;Password=w5B22RLPpprsrxdt;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;
```

新增接口：

- `GET /local/fnos/health`
- `POST /local/fnos/restore-mysql`

`GET /local/fnos/health` 会检查：

- `/System/GetOptions` 的 `databaseType`
- 联系人总数
- 历史联系人数量
- 留言联系人数量
- `accountId=2` 当前会话探测数量

`POST /local/fnos/restore-mysql` 会执行和脚本一致的真实悠聊接口链路：

- `/System/ConnectDatabase`
- `/System/SetConnectionString`
- `/System/GetConnectionString`
- `/System/GetOptions`
- 再次检查联系人数量和历史数量

### 3. Web 数据库管理按钮

相关文件：

- `public/app.js`
- `public/styles.css`

入口：

- 右上角菜单 -> `数据库管理`

弹窗顶部新增 `飞牛数据库状态` 面板：

- 状态胶囊：
  - `MySQL 正常`
  - `需要修复`
  - `检查失败`
  - `检查中`
  - `修复中`
- 指标：
  - 数据库模式
  - 联系人
  - 历史
  - 当前探测
- 按钮：
  - `刷新状态`
  - `一键切回 MySQL`

按钮行为：

- 打开数据库管理弹窗后会静默调用 `/local/fnos/health`。
- 点击 `刷新状态` 会重新读取后端真实状态。
- 点击 `一键切回 MySQL` 会弹确认框，然后调用 `/local/fnos/restore-mysql`。
- 修复成功后会刷新会话数量和当前会话列表。
- 下方原有 `删除聊天记录` 功能保留，确认输入逻辑不变。

### 4. 本次接口验证

重启本地 `5177` 后直接请求：

```powershell
Invoke-RestMethod -Uri "http://localhost:5177/local/fnos/health"
```

当时接口再次看到 SQLite：

- `databaseType=2`
- `databaseMode=sqlite`
- `totalContacts=510`
- `historyContacts=24`
- `currentAccount2=10`

随后请求：

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5177/local/fnos/restore-mysql" -Body "{}" -ContentType "application/json"
```

修复接口成功返回：

- 修复前：SQLite，历史 `24`
- 修复后：MySQL，联系人 `8072`，历史 `5749`

最终 `npm run fnos:health` 通过：

- `databaseType=0`
- `databaseMode=mysql`
- `totalContacts=8072`
- `historyContacts=5749`

### 5. 浏览器烟测

使用 Playwright 打开 `http://localhost:5177/`，直接调出 `showDatabaseModal()`：

- 弹窗显示 `MySQL 正常`。
- 指标显示：
  - `mysql`
  - `8,072`
  - `5,749`
  - `1`
- `刷新状态` 和 `一键切回 MySQL` 按钮存在。
- 面板宽度正常，无明显错位。

注意：

- 这只是把悠聊服务端运行配置切回 MySQL，不修改 Docker compose。
- 如果后续又自动回退 SQLite，可以直接从 Web 数据库管理里点 `一键切回 MySQL`。
- 若切回后仍异常，再继续检查飞牛容器、MySQL 表分区/排序规则和服务日志。

## 70. 2026-06-15 Web 客户端 Docker 化部署

### 1. 本次目标纠偏

用户明确纠正：要 Docker 化的是 `C:\youchat-dev-web` 这个二开的 Web 客户端，不是已经 Docker 化的悠聊服务端。

后续处理规则：

- Web 客户端项目根目录：`C:\youchat-dev-web`。
- Web 客户端飞牛部署目录：`/vol1/1000/Docker/youchat-dev-web`。
- Web 客户端 compose project/container：`youchat-dev-web`。
- 已有悠聊服务端目录 `/vol1/1000/Docker/youchat` 和 compose project `youliaoapp` 只作为 API 后端，不在 Web 客户端 Docker 化任务里修改或重启。
- Web 容器内默认 API 使用 `http://host.docker.internal:18080/api`，对应飞牛宿主机上已发布的服务端 `http://192.168.9.83:18080/api`。

### 2. 新增 Docker 文件

新增：

- `Dockerfile`
- `compose.yaml`
- `.dockerignore`
- `.env.example`
- `scripts/deploy-fnos-web.py`

默认容器信息：

- 镜像：`youchat-dev-web:local`
- 容器：`youchat-dev-web`
- 端口映射：`${WEB_PORT:-5177}:5177`
- 健康检查：`GET http://127.0.0.1:5177/health`
- `extra_hosts`：`host.docker.internal:host-gateway`，用于 Web 容器访问飞牛宿主机上的悠聊服务端端口 `18080`。
- 持久化挂载：
  - `./data:/app/data`
  - `./logs:/app/logs`
  - `./config:/app/config`

### 3. 原客户端静态资源内置

Docker 容器无法依赖 Windows 路径 `C:\Program Files\youchat-desktop\wwwroot`，所以本次把 Web 运行必须的原客户端资源内置到项目：

- `public/native-icons/braft-icons.woff`
- `public/static/emojiSource.cdbf96da.png`

`server.js` 新增内置资源优先读取逻辑：

- `/native-icons/braft-icons.woff` 优先读取 `public/native-icons/braft-icons.woff`。
- `/static/emojiSource.cdbf96da.png` 优先读取 `public/static/emojiSource.cdbf96da.png`。
- 如果内置资源不存在，再回退读原 Electron 客户端目录。

### 4. 飞牛部署脚本

脚本：

```powershell
cd C:\youchat-dev-web
$env:FNOS_PASSWORD = "飞牛 SSH 密码"
$env:FNOS_SUDO_PASSWORD = "飞牛 sudo 密码"
python .\scripts\deploy-fnos-web.py
```

默认行为：

- 打包当前 Web 项目，排除 `.git`、`node_modules`、`logs`、`deploy-dist`、截图和临时文件。
- 上传到飞牛 `/vol1/1000/Docker/youchat-dev-web`。
- 若远端没有 `.env`，从 `.env.example` 初始化。
- 若远端 `.env` 还是旧默认 `YOUCHAT_API_BASE=http://192.168.9.83:18080/api`，部署脚本会迁移为 `http://host.docker.internal:18080/api`，避免容器内 `/api/*` 代理 502。
- 运行：

```bash
docker compose -p youchat-dev-web -f compose.yaml up -d --build --force-recreate
```

### 5. 验证命令

本地代码检查：

```powershell
cd C:\youchat-dev-web
npm run check
python -m py_compile .\scripts\deploy-fnos-web.py
```

本地 Docker 验证：

```powershell
docker compose -p youchat-dev-web -f compose.yaml up -d --build
Invoke-RestMethod http://localhost:5177/health
Invoke-WebRequest http://localhost:5177/native-icons/braft-icons.woff
Invoke-WebRequest http://localhost:5177/static/emojiSource.cdbf96da.png
```

远端验证：

```bash
cd /vol1/1000/Docker/youchat-dev-web
docker compose -p youchat-dev-web -f compose.yaml ps
curl http://127.0.0.1:5177/health
```

### 6. Git 注意事项

用户要求每次修改后提交 Git。提交 Docker 化改动时只提交源码、Docker 文件、脚本、内置静态资源和文档。

不要提交运行时文件：

- `data/reply-skills.json`
- `logs/api-capture.ndjson`

### 7. Docker 代理 502 修复

首次部署后，`GET /health` 正常，但 `POST /api/System/GetOptions` 通过 Web 容器代理返回 502。

排查结论：

- 容器内直接 `fetch http://host.docker.internal:18080/api/System/GetOptions` 可返回 200，说明 Docker 网络已经可达服务端。
- 失败来自代理转发了客户端请求头里的 `Expect: 100-continue`。
- Node/undici `fetch` 不支持转发 `expect` 请求头，会直接抛出 `fetch failed` / `expect header not supported`。

修复：

- `server.js` 新增 `sanitizeProxyRequestHeaders()`。
- `/api/*` 代理会剥离 hop-by-hop/problematic 请求头：
  - `host`
  - `connection`
  - `content-length`
  - `expect`
  - `keep-alive`
  - `proxy-authenticate`
  - `proxy-authorization`
  - `te`
  - `trailer`
  - `transfer-encoding`
  - `upgrade`

这个修复也适用于浏览器、PowerShell、抓包脚本等不同客户端来源。

## 71. 2026-06-15 GitHub Container Registry 发布

### 1. 发布目标

用户询问 Docker 镜像能否发布到专门发布 Docker 的地方，GitHub 是否可以发布。

结论：

- 可以发布到 GitHub Container Registry，地址格式为 `ghcr.io/<owner>/<repo>:<tag>`。
- 本项目新增 GitHub Actions 自动构建并推送镜像。

### 2. 新增文件

新增：

- `.github/workflows/docker-publish.yml`
- `compose.registry.yaml`
- `config/ai-providers.example.json`
- `data/reply-skills.example.json`

### 3. 安全调整

公开镜像不能包含用户的真实 AI key、skill 回复库、客户内容或抓包日志。

本次调整：

- `Dockerfile` 不再 `COPY config ./config`。
- `Dockerfile` 不再 `COPY data ./data`。
- `.dockerignore` 排除：
  - `config`
  - `data`
  - `logs`
- `.gitignore` 新增忽略：
  - `config/ai-providers.json`
  - `data/reply-skills.json`
  - `logs/api-capture.ndjson`
- 使用 `git rm --cached` 停止跟踪上述真实运行数据，但保留本地文件。

后续不要把真实 `config/ai-providers.json`、`data/reply-skills.json`、`logs/api-capture.ndjson` 加回 Git，也不要打进公共镜像。

### 4. GitHub Actions 规则

工作流：`.github/workflows/docker-publish.yml`

触发：

- push 到 `main`
- push 到 `master`
- push tag `v*.*.*`
- 手动 `workflow_dispatch`

发布标签：

- `latest`：默认分支。
- 分支名。
- tag 名。
- `sha-xxxx`。

权限：

- `contents: read`
- `packages: write`

### 5. 从 GHCR 部署

服务器运行公开镜像时使用：

```bash
docker compose -p youchat-dev-web -f compose.registry.yaml pull
docker compose -p youchat-dev-web -f compose.registry.yaml up -d
```

`.env` 示例：

```env
WEB_PORT=5177
YOUCHAT_WEB_IMAGE=ghcr.io/<owner>/<repo>:latest
YOUCHAT_API_BASE=http://host.docker.internal:18080/api
```

仍然需要挂载本地目录：

- `./config:/app/config`
- `./data:/app/data`
- `./logs:/app/logs`

## 72. 2026-06-16 系统设置保存保护与数据库自动守护

### 1. 用户问题

用户在原生风格系统设置弹窗中发现：

- 打开或保存 `自动关闭会话` 后，服务端会自动关闭会话。
- 保存系统设置时数据库也可能再次切回 SQLite。
- 用户纠正需求：该开关默认应关闭，刷新后仍保持关闭，不能让 Web 把它保存成开启。
- 既然当前系统应使用 MySQL，就应定时检测是否异常切回 SQLite，发现异常自动修复。

### 2. 根因判断

Web 之前系统设置保存直接调用：

```text
/System/SetOptions
```

提交内容包括：

- `dataBaseOptions`
- `commonOptions`
- `jobOptions`
- `aiOptions`

这会把系统设置弹窗里读取到的数据库配置和任务配置一起提交。现场模拟验证发现，保存任务配置时悠聊服务端可能在保存过程中触发数据库配置异常；新的安全保存接口能检测到并立即修复。业务上 `autoShutDown` 必须保持 `false`，避免系统自动关闭客服会话。

2026-06-16 继续深挖后确认了更具体的接口绑定规则：

- `/System/SetOptions` 不能用 JSON body 提交完整对象。
- 实测 JSON body 会把后端运行时数据库模式切回 SQLite。
- 正确形态是 `multipart/form-data`，字段用点号展开：
  - `dataBaseOptions.databaseType=0`
  - `dataBaseOptions.connectionString=...`
  - `jobOptions.autoShutDown=false`
  - `jobOptions.runTimeoutCheckJob=true`
- `form-data` 中把整个 `jobOptions` 放成 JSON 字符串也不行，后端不会正确保存 `autoShutDown=false`。

### 3. 前端修复

修改文件：

- `public/app.js`
- `public/styles.css`

改动：

- 系统设置中的 `自动关闭会话` 强制显示为关闭。
- 该开关禁用，不允许用户打开。
- 增加说明：`已锁定关闭，避免服务端自动关闭当前会话。`
- 保存系统设置不再直接调用 `/System/SetOptions`。
- 改为调用本地安全接口：

```text
POST /local/client-options/save
```

前端提交前还会执行 `normalizeClientOptionsForSave()`：

- `dataBaseOptions.databaseType = 0`
- `jobOptions.autoShutDown = false`
- 默认补齐：
  - `closeTime=20`
  - `runTimeoutCheckJob=true`

数据库管理弹窗的修复面板新增守护状态：

- 是否自动守护中。
- 检查间隔。
- 上次检查时间。
- 上次修复时间。
- 最近错误。

### 4. 服务端修复

修改文件：

- `server.js`
- `.env.example`
- `compose.yaml`
- `compose.registry.yaml`

新增服务端接口：

```text
POST /local/client-options/save
GET  /local/fnos/guard
POST /local/fnos/guard
```

`/local/client-options/save` 流程：

1. 读取真实 `/System/GetOptions`。
2. 使用 `buildSafeClientOptionsForSave()` 合并当前配置与前端提交配置。
3. 强制保持：
   - `dataBaseOptions.databaseType=0`
   - `dataBaseOptions.connectionString` 优先保留 MySQL 连接串
   - `jobOptions.autoShutDown=false`
   - `jobOptions.runTimeoutCheckJob=true`
4. 用点号 `form-data` 调用真实 `/System/SetOptions`，不要用 JSON。
5. 调用 `/System/GetOptions`、`/Contact/GetContactList` 等检查数据库健康。
6. 如果发现 SQLite 或历史数量异常，立即调用 `restoreFnOSDatabaseToMySQL()`。
7. 再次读取 `/System/GetOptions`，确认：
   - `dataBaseOptions.databaseType=0`
   - `jobOptions.autoShutDown=false`
8. 如果上述复核失败，接口直接返回错误，不允许 Web 提示“保存成功”。

新增自动守护：

- 服务启动后 15 秒做一次启动检查。
- 默认每 5 分钟检查一次。
- 发现 `databaseType !== 0` 或历史数量低于阈值时，自动切回 MySQL。
- 守护状态保存在 `databaseGuardState` 中。

新增环境变量：

```env
YOUCHAT_DATABASE_GUARD_ENABLED=1
YOUCHAT_DATABASE_GUARD_INTERVAL_MS=300000
YOUCHAT_DATABASE_GUARD_MIN_HISTORY_COUNT=1000
```

### 5. 验证结果

本地重启 `node server.js` 后：

```powershell
Invoke-RestMethod http://localhost:5177/local/fnos/health
```

返回：

- `databaseType=0`
- `databaseMode=mysql`
- `totalContacts=8081`
- `historyContacts=5758`
- `currentAccount2=3`
- `guard.enabled=true`
- `guard.intervalMinutes=5`

手动触发守护：

```powershell
Invoke-RestMethod -Method Post http://localhost:5177/local/fnos/guard -Body "{}" -ContentType "application/json"
```

返回正常，未触发修复。

模拟用户问题：

- 先读取真实 `/System/GetOptions`。
- 构造 `jobOptions.autoShutDown=true`，模拟绕过前端试图打开自动关闭。
- 调用 `POST /local/client-options/save`。

结果：

- 请求成功。
- 保存后真实 `/System/GetOptions` 仍为：
  - `dataBaseOptions.databaseType=0`
  - `jobOptions.autoShutDown=false`
- 历史数量仍为 `5758`。
- 这次使用点号 `form-data` 后没有触发数据库修复，证明正确提交形态可以避免 JSON 导致的 SQLite 回退。

### 6. 后续注意

- 不要再让系统设置直接裸调 `/System/SetOptions`。
- 不要允许 `autoShutDown` 从 Web 保存成 `true`。
- 不要把数据库模式暴露成可随手切回 SQLite 的普通表单项。
- 如果用户仍反馈保存设置后数据库掉回 SQLite，优先看：
  - `/local/fnos/guard`
  - `/local/fnos/health`
  - `logs/api-capture.ndjson`
  - Docker 容器日志里的 `[database-guard]`

## 2026-06-16：公开 GitHub 仓库与 GHCR Docker 镜像发布

用户要求：

- 将 Web 二开项目推送到 `https://github.com/525815266/youliaoWeb`。
- 打包成 Docker 镜像，并发布到可拉取的 Docker 镜像仓库。

处理策略：

- 没有直接把 `C:\youchat-dev-web` 的完整 Git 历史推到公开仓库。
- 原因：本地开发仓库历史和文档中包含飞牛地址、AI key、CodeBuddy key、MySQL 连接串、运维密码、抓包和项目记忆。
- 采用“干净公开发布包”：
  - 发布目录：`C:\youchat-web-public-release`
  - 新建 Git 仓库，不带本地开发历史。
  - 删除 `AI_HANDOFF.md`、`PROJECT_MEMORY.md`、`PATCH_GUIDE.md`、部署脚本、本地补丁工具、真实 `config/ai-providers.json`、真实 `data/reply-skills.json`、日志、报告、patch、截图。
  - 保留运行代码、Dockerfile、compose、GitHub Actions、示例配置、公开 README。

脱敏修改：

- `server.js`
  - 默认 `YOUCHAT_API_BASE` 改成 `http://host.docker.internal:18080/api`。
  - 默认 `FNOS_MYSQL_CONNECTION_STRING` 改为空字符串，只从环境变量读取。
- `public/app.js`
  - 默认 API base 改成 `http://host.docker.internal:18080/api`。
  - 默认 sub2 API key 改为空。
  - 默认 CodeBuddy API key 改为空。
- `public/skill-training.js`
  - 默认 sub2 API key 改为空。
  - 默认 CodeBuddy API key 改为空。
- `compose.registry.yaml`
  - 默认镜像改成 `ghcr.io/525815266/youliaoweb:latest`。
- `README.md`
  - 改成公开版说明，只保留通用部署、Docker、GHCR、配置和安全说明。

验证：

- 在 `C:\youchat-web-public-release` 执行：

```powershell
npm run check
```

- 通过：`server.js`、`public/app.js`、`public/skill-training.js` 语法检查均正常。
- 执行敏感扫描：

```powershell
rg -n "sk-[A-Za-z0-9]|ck_[A-Za-z0-9_.-]+|950331|w5B22|Password=w|1556504756803862529|192\.168\.9\.83" -S .
```

- 无命中。

GitHub 发布：

- 公开发布仓库：`https://github.com/525815266/youliaoWeb`
- 发布提交：
  - `aa46a738a4a3f71882a9ce86f9a1aa1a9a36be64`
  - message: `Initial public web client release`
- 推送分支：`main`
- Actions：
  - workflow: `Publish Docker image`
  - run id: `27626240678`
  - conclusion: `success`

Docker 镜像：

- GHCR 包页：`https://github.com/525815266/youliaoWeb/pkgs/container/youliaoWeb`
- 镜像地址：

```text
ghcr.io/525815266/youliaoweb:latest
```

- 已发布标签：
  - `latest`
  - `main`
  - `sha-aa46a73`

后续注意：

- 后续公开发布继续在 `C:\youchat-web-public-release` 上做干净版本同步，或写脚本从开发仓库生成公开包。
- 不要把 `C:\youchat-dev-web` 原仓库历史 force push 到公开 GitHub。
- 公开仓库只接受无密钥、无真实数据、无飞牛私有运维信息的代码和示例配置。

### 2026-06-16 追加：公开 README 功能介绍与图片

用户反馈：

- 公开仓库功能介绍不够详尽，希望 README 里带图片。

已修改公开发布仓库 `C:\youchat-web-public-release`：

- 重写公开版 `README.md`：
  - 增加适合场景。
  - 增加真实接口工作台、会话列表、聊天窗口、右侧工具栏、AI/skill 回复、客户端设置和数据库守护等详细功能说明。
  - 增加部署架构、快速开始、Docker 本地构建、GHCR 镜像使用、环境变量、本地文件、安全说明、开发检查、目录结构和当前边界。
- 新增脱敏 SVG 图片：
  - `docs/images/workbench-overview.svg`
  - `docs/images/ai-skill-flow.svg`
  - `docs/images/docker-deployment.svg`
- 图片是文档示意图，不包含真实客户、订单、聊天记录或密钥。

验证：

- 在公开发布仓库执行 `npm run check` 通过。
- 执行敏感扫描无命中：

```powershell
rg -n "sk-[A-Za-z0-9]|ck_[A-Za-z0-9_.-]+|950331|w5B22|Password=w|1556504756803862529|192\.168\.9\.83" -S .
```

推送说明：

- 本机 `git push` 当时连接 GitHub 443 超时，但浏览器/API 可访问。
- 因此使用 GitHub REST API 创建远程提交：
  - `982f82120b039c54ed6e25855920cb600488602d`
  - message: `Expand README with feature overview and diagrams`
- 远程 README 和 SVG 已验证可通过 raw.githubusercontent.com 访问。
- 新 Actions run：
  - `https://github.com/525815266/youliaoWeb/actions/runs/27627140856`
  - 状态：`completed`
  - 结果：`success`

## 73. 2026-06-17 PromptWorks 旁路训练工作台

用户问题：

- 询问 `https://github.com/YellowSeaa/PromptWorks` 是否可以优化客服流程。
- 如果有价值，希望部署到飞牛上；如果不适合则不部署。

判断结论：

- PromptWorks 有价值，但定位是“Prompt/话术/skill 训练与评估工作台”，不是悠聊 Web 聊天窗口替代品。
- 它适合承接用户一直要求的这条链路：
  - 从悠聊真实聊天、人工回复、快捷回复和 skill 中抽样。
  - 用 AI 做归类、评分、对比和优化建议。
  - 把候选结果留给人工审核。
  - 审核通过后再回写到 `data/reply-skills.json` 或 Web 的 skill 训练队列。
- 它不应该直接接入生产自动回复；当前先作为旁路工具运行，避免影响现有客服台和悠聊后端。

本地调研目录：

```text
C:\youchat-research\PromptWorks
```

部署文件：

```text
C:\youchat-dev-web\deploy\promptworks-compose.fnos.yaml
C:\youchat-dev-web\scripts\deploy-fnos-promptworks.py
```

新增 npm 脚本：

```powershell
npm run fnos:deploy:promptworks
```

飞牛部署信息：

- 远程目录：`/vol1/1000/Docker/promptworks`
- Compose project：`promptworks`
- 访问地址：`http://192.168.9.83:5188`
- 容器：
  - `promptworks-frontend`
  - `promptworks-backend`
  - `promptworks-postgres`
  - `promptworks-redis`

端口与隔离原则：

- PromptWorks 前端只暴露宿主机端口 `5188`。
- 后端 `8000`、Postgres `5432`、Redis `6379` 都只在 Docker 网络内使用，不暴露到飞牛宿主机。
- 不使用 PromptWorks 默认 `18080:80` 映射，因为 `18080` 已经是悠聊服务端 `http://192.168.9.83:18080/api`。
- 不修改、不重启 `/vol1/1000/Docker/youchat` 和 compose project `youliaoapp`。

模型配置：

- 部署脚本会读取本地运行时配置 `config/ai-providers.json`。
- 只自动种入 OpenAI/Bearer 兼容渠道。
- 本次已种入 `sub2 中转`：
  - `base_url=https://sub2.sn55.cn/v1`
  - 默认模型：`gpt-5.4-mini`
  - 额外模型：`gpt-4.1`、`gpt-4o-mini`
- 不把 API key 写进项目文档，也不要把真实 `config/ai-providers.json` 提交到 Git。
- CodeBuddy 当前在我们 Web 项目里走 `X-Api-Key` 特殊适配；PromptWorks 原生 `invoke` 只按 `Authorization: Bearer` 调 OpenAI 兼容 `/chat/completions`。所以 CodeBuddy 暂时不自动种入 PromptWorks，后续如果要接入，需要给 PromptWorks 加 auth type 或继续通过悠聊 Web 的 `/ai/chat/completions` 中转。

部署命令：

```powershell
cd C:\youchat-dev-web
$env:FNOS_PASSWORD = "飞牛 SSH 密码"
$env:FNOS_SUDO_PASSWORD = "飞牛 sudo 密码"
npm run fnos:deploy:promptworks
```

脚本行为：

1. 上传 `deploy/promptworks-compose.fnos.yaml` 到 `/vol1/1000/Docker/promptworks/compose.yaml`。
2. 首次生成远端 `.env`，默认 `PROMPTWORKS_FRONTEND_PORT=5188`。
3. 执行：

```bash
docker compose -p promptworks -f compose.yaml pull
docker compose -p promptworks -f compose.yaml up -d
```

4. 等待 `http://192.168.9.83:5188/api/v1/project-info/summary` 可用。
5. 从本地 AI 配置自动创建兼容的 LLM provider 和模型。

验证结果：

- `GET http://192.168.9.83:5188/` 返回 `200`。
- `GET http://192.168.9.83:5188/api/v1/project-info/summary` 正常，版本显示 `v1.3.1`。
- `GET http://192.168.9.83:5188/api/v1/llm-providers/` 正常，能看到 1 个 provider、3 个模型。
- `POST http://192.168.9.83:5188/api/v1/llm-providers/1/invoke` 已能真实调用 sub2，并返回 completion 与 token usage。
- 远端 `docker compose ps` 显示 4 个 PromptWorks 容器均为 Up。

后续集成建议：

- 第一步：保持 PromptWorks 作为人工可访问的训练/评估工作台。
- 第二步：从悠聊 Web 的 `skill-training` 或服务端数据库导出样本，生成 PromptWorks 的测试任务。
- 第三步：在 PromptWorks 中用 AI 评分和优化建议批量筛选候选话术。
- 第四步：只把人工审核通过的结果回写到 `data/reply-skills.json`，不要让 PromptWorks 直接改生产 skill。
- 第五步：如果确实需要 CodeBuddy/DeepSeek 特殊认证或模型拉取，再考虑 fork PromptWorks 后补 provider auth type。

不要回退：

- 不要把 PromptWorks 绑定到 `18080`。
- 不要让 PromptWorks compose 暴露 Postgres/Redis 到宿主机。
- 不要把它混入 `youchat-dev-web` 容器或悠聊服务端容器。
- 不要把 PromptWorks 当作实时自动回复服务直接上线。

## 74. 2026-06-17 PromptWorks 前端 Failed to fetch 修复

用户反馈：

- PromptWorks 页面能打开，但 Prompt 管理页连续弹出 `Failed to fetch`。

根因：

1. 上游 `yellowseaa/promptworks:frontend-main-latest` 前端 bundle 里把 API base 打成了：

```text
http://localhost:8000/api/v1
```

浏览器访问飞牛页面时，这会变成请求客服电脑本机的 `localhost:8000`，所以页面报 `Failed to fetch`。

2. 即使手动访问 `http://192.168.9.83:5188/api/v1/...` 可用，页面仍会在 `/api/v1/prompts`、`/api/v1/prompt-classes` 这种无尾斜杠接口上触发 FastAPI 的 `307` 跳转。原 nginx 配置使用：

```nginx
proxy_set_header Host $host;
```

这会让后端生成的 Location 丢掉 `:5188`，跳到 `http://192.168.9.83/api/v1/prompts/`，最终命中飞牛系统页面而不是 PromptWorks。

修复：

- 新增固定 nginx 配置：

```text
C:\youchat-dev-web\deploy\promptworks-nginx.conf
```

- `deploy/promptworks-compose.fnos.yaml`：
  - 将 `./nginx.conf` 挂载到 `/etc/nginx/conf.d/default.conf:ro`。
  - frontend 启动前继续把静态 JS 里的 `http://localhost:8000/api/v1` 替换成 `/api/v1`。
- `promptworks-nginx.conf`：
  - 使用 `proxy_set_header Host $http_host` 保留 `192.168.9.83:5188`。
  - 增加 `X-Forwarded-Host $http_host`。
  - 增加 `proxy_redirect`，兜底把后端 `Location: http://host/api/v1/...` 改回当前 `$scheme://$http_host/...`。
- `scripts/deploy-fnos-promptworks.py`：
  - 上传 `promptworks-nginx.conf` 到远端 `/vol1/1000/Docker/promptworks/nginx.conf`。
  - 部署后检查前端 bundle 不再包含 `http://localhost:8000/api/v1`。
  - 部署后检查浏览器实际路径：
    - `GET /api/v1/prompts`
    - `GET /api/v1/prompt-classes`

验证结果：

- 重新执行：

```powershell
npm run fnos:deploy:promptworks
```

- 脚本输出：
  - `Verified frontend API base in 1 bundle(s).`
  - `Verified browser API redirect paths.`
  - `PromptWorks is ready: http://192.168.9.83:5188`
- `GET http://192.168.9.83:5188/api/v1/prompts` 能跟随跳转后返回真实 prompt 数据。
- `GET /api/v1/prompts` 的 `307 Location` 已变为：

```text
http://192.168.9.83:5188/api/v1/prompts/
```

- 远端容器内 `/etc/nginx/conf.d/default.conf` 已确认是本项目固定配置。

后续注意：

- 不要移除 frontend 启动时替换 JS API base 的命令，除非后续改成自建前端镜像并在 build 阶段明确设置 `VITE_API_BASE_URL=/api/v1`。
- 不要恢复上游默认 nginx 配置，否则无尾斜杠 API 会再次跳到飞牛主页面端口。
- 用户如果仍看到 `Failed to fetch`，先让浏览器强刷，因为旧前端 JS 可能被缓存。

## 75. 2026-06-17 悠聊人工回复导入 PromptWorks 训练

用户继续确认：

- 希望把悠聊数据库/接口里已有的人工回复内容导入 PromptWorks 训练。
- 必须是真实数据，不要假的训练样本。
- 导入应该先可预览，避免脏数据直接污染训练台。

本次实现：

1. `server.js` 把原来的闲时采样逻辑抽成 `collectManualReplySamples(options)`。
   - 仍然走真实悠聊接口：
     - `/Contact/GetContactList`
     - `/ChatContent/GetList`
   - 采集“客户消息 -> 人工客服回复”的相邻配对。
   - 保留原有 `/local/skill-training/sample` 能力，仍然会把样本写入 Web 的 skill 训练候选。
   - 新增系统提示过滤，跳过：
     - 客服接入会话
     - 会话结束
     - 系统关闭
     - 转接
     - 自动回复/机器人提示
     - 撤回/拍一拍等内部提示

2. 新增本地接口：

```http
POST /local/promptworks/import-training
```

默认 `dryRun=true`，只预览，不写 PromptWorks。

请求示例：

```json
{
  "dryRun": true,
  "contactLimit": 18,
  "messageLimit": 80,
  "sampleLimit": 80,
  "previewLimit": 5
}
```

真实导入时传：

```json
{
  "dryRun": false,
  "contactLimit": 18,
  "messageLimit": 80,
  "sampleLimit": 80
}
```

返回包含：

- `summary.total`
- `summary.byIntent`
- `summary.byPlatform`
- `summary.byStage`
- `preview`
- `prompt.id/name/versionId`
- `task.id/name/status`
- `model.providerKey/modelName`

3. PromptWorks 写入方式：

- 如果不存在，会创建 Prompt：

```text
悠聊客服回复训练
```

- Prompt 内容要求模型根据：
  - `customer_message`
  - `platform_key`
  - `intent_key`
  - `learning_stage`
  - `manual_reply`
  - `image_urls`

  生成更适合当前客户的客服回复，并识别无需回复场景。

- 每次真实导入会创建一个 PromptWorks 测试任务，状态为 `draft`，不会自动执行。
- 任务变量使用 PromptWorks 支持的：

```json
{
  "cases": []
}
```

4. 训练中心 UI：

文件：

```text
C:\youchat-dev-web\public\skill-training.html
C:\youchat-dev-web\public\skill-training.js
C:\youchat-dev-web\public\skill-training.css
```

新增一个 `PromptWorks 导入训练` 工具条：

- 联系人数量
- 消息数量
- 样本数量
- `预览样本`
- `确认导入`

预览结果会显示：

- 样本数
- 联系人数
- 配对数
- 意图/平台/阶段分布
- 最多 5 条真实样本预览

真实导入成功后会显示：

- `打开任务`
- `打开 Prompt`

PromptWorks 前端路由：

```text
http://192.168.9.83:5188/prompts/{promptId}
http://192.168.9.83:5188/tests/tasks/{taskId}/result
```

5. 配置：

新增环境变量：

```env
PROMPTWORKS_API_BASE=http://host.docker.internal:5188/api/v1
PROMPTWORKS_TIMEOUT_MS=60000
```

本地非容器默认：

```text
http://192.168.9.83:5188/api/v1
```

容器默认：

```text
http://host.docker.internal:5188/api/v1
```

验证结果：

1. 语法检查通过：

```powershell
npm run check
```

2. dry-run 通过，采集到真实人工回复样本：

```text
sampledContacts: 10
sampledPairs: 2
summary.byIntent.order_missing: 2
summary.byStage.first_answer: 2
```

3. 修复前曾把 `客服(客服-王)接入会话...` 误判为客户消息；已通过 `isSampleSystemMessage()` 过滤。

4. 真实导入验证通过：

```text
PromptWorks Prompt: 悠聊客服回复训练
Prompt id: 2
Task id: 1
Task status: draft
Unit cases: 2
Model: sub2 / gpt-5.4-mini
```

5. 用 Node 直接读取 PromptWorks API 确认实际保存为正常中文；PowerShell 输出里的中文乱码只是控制台显示编码问题。

6. 已部署到飞牛 Web 容器：

```text
http://192.168.9.83:5177
```

远端验证：

- `/health` 返回 `promptWorksApiBase: http://host.docker.internal:5188/api/v1`。
- `/skill-training.html` 已包含 `PromptWorks 导入训练` 面板。
- 远端 `POST /local/promptworks/import-training` dry-run 能采集真实样本，示例结果：
  - `sampledContacts: 9`
  - `sampledPairs: 3`
  - `summary.byIntent.order_missing: 3`

后续注意：

- PromptWorks 目前只是旁路训练台，不直接改 `data/reply-skills.json`，也不自动上线生产回复。
- 后续如果要把 PromptWorks 优化结果回写 Web skill，必须再加“人工审核通过后回写”的接口和 UI。
- 采样器目前根据会话相邻消息配对，适合快速构建训练集；如果要更精准，应进一步按订单查询结果、右侧订单平台、快捷回复分类做上下文增强。
- 如果 PromptWorks 里没有模型，会返回“还没有可用模型”，需要先在 PromptWorks 的 LLM 管理配置 provider/model。
- 不要把 CodeBuddy 直接塞进 PromptWorks，除非 PromptWorks 支持 `X-Api-Key` 或走 Web 中转。



## 76. 2026-06-20 Skill order platform detection and Douyin order classification

User issue:

- Skill training and skill matching could detect that a message contains an order number, but could not reliably classify which platform the order belongs to.
- Douyin orders, especially pure numeric order ids like `5120219343689007205`, were not classified as `douyin`.
- Because the platform stayed `unknown` or was swallowed by generic Taobao/JD numeric rules, learned skill buckets could not produce platform-specific replies.

Files changed:

- `C:\youchat-dev-web\public\app.js`
- `C:\youchat-dev-web\server.js`
- `C:\youchat-dev-web\public\skill-training.js`

Frontend changes:

1. Expanded the Douyin platform definition:
   - aliases now include `douyin`, `iesdouyin`, `aweme`, and Douyin Shop naming.
   - high-confidence order pattern added: `/^5\d{18}$/`.

2. Reworked `detectPlatformOrderNo(text)`:
   - detects explicit platform words in message text first.
   - uses current right-side order context only when there is real order context, not merely because the order filter defaults to Taobao.
   - checks PDD hyphen format first.
   - checks Douyin 19-digit 5-prefix order numbers before generic numeric platform rules.

3. Reworked `detectOrderPlatformFromState()`:
   - no longer returns Taobao just because `state.orderType` defaults to `0`.
   - prefers actual loaded order rows, order platform name, or active order-tool context with keyword/records.

Server changes:

1. Added `detectTrainingOrderPlatformKey(text)` for skill training and PromptWorks/import sampling.
2. Updated `detectTrainingPlatformKey(text)` so sampled manual replies classify:
   - PDD hyphen order ids as `pdd`.
   - 19-digit 5-prefix Douyin order ids as `douyin`.
   - explicit Douyin text/aliases as `douyin`.

Training UI change:

- The skill training platform input placeholder now includes `douyin`:

`taobao / jd / pdd / douyin`

Verification:

- `npm run check` passed.
- Frontend function VM test:
  - `5120219343689007205` -> `douyin`
  - `20260601-123456789` -> `pdd`
  - explicit Douyin text + numeric order -> `douyin`
  - default non-order page Taobao filter -> empty platform, no pollution
  - active order tool with Douyin filter + numeric order -> `douyin`
- Server function VM test:
  - `5120219343689007205` -> `douyin`
  - explicit Douyin text + numeric order -> `douyin`
  - PDD hyphen order -> `pdd`
  - explicit Taobao text -> `taobao`

Follow-up:

- This solves the current Douyin-order classification gap, but platform-specific replies still depend on enough approved/learned skills per platform.
- If later real data shows other Douyin prefixes, extend the high-confidence rule in both `public/app.js` and `server.js` together.
- Avoid reintroducing default `state.orderType=0` as a platform source outside the actual order tool context.


## 77. 2026-06-20 Platform-aware skill learning from real order records

User issue:

- Skill could identify that a customer sent an order number, but sometimes still failed to classify the platform, especially Douyin orders.
- A stale or default platform state, such as the order filter defaulting to Taobao, could pollute automatic skill learning.
- If an old suggestion was already classified under the wrong platform, manual replies could continue learning into that wrong platform bucket.

Files changed:

- `C:\youchat-dev-web\public\app.js`
- `C:\youchat-dev-web\server.js`

Frontend changes:

1. Added real order-record platform lookup:
   - `getOrderRecordNumbers(order)` collects common order fields such as `orderNo`, `parentOrderNo`, `orderId`, `tradeNo`, `orderSn`, `bizOrderNo`, and other order/trade/sn/no-like keys.
   - `detectOrderPlatformFromRecords(orderNo)` matches the customer message order id against the currently loaded right-side order list.
   - When a match is found, `detectPlatformOrderNo(text)` returns source `order-record`, which is stronger than a generic filter state.

2. Tightened platform priority:
   - Explicit platform words in the customer text still win.
   - Exact right-side order record matches are next.
   - Douyin 19-digit 5-prefix ids are checked before default/generic numeric state matching.
   - Default `state.orderType=0` can no longer swallow Douyin ids as Taobao.

3. Improved skill learning priority:
   - When sending or manually replying, the current prompt/order context platform is preferred over the old matched suggestion platform.
   - This prevents an old Taobao-classified skill suggestion from forcing a Douyin/PDD/JD manual reply back into the wrong learning bucket.

Server training changes:

- `detectTrainingPlatformAliasKey(text)` separates explicit platform aliases from order-id shape matching.
- `detectTrainingPlatformKey(text)` now checks order-id rules first, then explicit aliases.
- Explicit platform aliases can classify generic numeric order ids for training imports, while high-confidence PDD/Douyin patterns still work without aliases.

Verification:

- `npm run check` passed.
- Frontend VM verification:
  - right-side order record `5120219343689007205` with `orderType=11` -> `douyin`, source `order-record`
  - default Taobao state + `5120219343689007205` -> `douyin`
  - `20260601-123456789` -> `pdd`
  - `京东订单 3309003552115074869` -> `jd`
- Server VM verification:
  - `5120219343689007205` -> `douyin`
  - `抖音订单 3309003552115074869` -> `douyin`
  - `20260601-123456789` -> `pdd`
  - `京东订单 3309003552115074869` -> `jd`
  - `淘宝订单 3309003552115074869` -> `taobao`

Follow-up:

- Existing learned skills that were previously stored under the wrong platform may still need review in the skill training page, but new learning should no longer be polluted by default Taobao state or stale matched suggestions.
- If real data shows more Douyin/Kuaishou/JD/PDD order-number shapes, add the pattern in both `public/app.js` and `server.js`, then rerun the VM verification.


## 78. 2026-06-21 Public HTTPS reverse proxy mixed-content fix

User issue:

- Public Lucky reverse-proxy URL: `https://yzkf.xmmhsj.cn:8001/`.
- Browser certificate is valid, but the page reports that parts of the site are not secure.
- Root cause is mixed content: the HTTPS page could still directly load HTTP resources such as chat images, avatars, order images, link preview iframes/videos, or browser-side SignalR to the internal YouChat server.

Files changed:

- `C:\youchat-dev-web\server.js`
- `C:\youchat-dev-web\public\app.js`
- `C:\youchat-dev-web\public\skill-training.js`

Backend change:

- Added `GET /local/media-proxy?url=...`.
- The proxy fetches only HTTP/HTTPS media-like resources and returns them from the current Web origin.
- Allowed upstream types include `image/*`, `video/*`, octet-stream, and common image/video file extensions.
- This lets an HTTPS public page load `https://yzkf.xmmhsj.cn:8001/local/media-proxy?...` instead of directly loading `http://...`.

Frontend changes:

1. Added safe display helpers in `public/app.js`: `isHttpsPage()`, `getDisplayMediaUrl(value)`, `canEmbedInHttps(value)`, and `getPreviewFrameUrl(value)`.
2. Updated browser-visible media display to use `getDisplayMediaUrl()`: friend request avatars, chat images, link thumbnails, mini-program icons/covers, link preview media, skill thumbnails, and order images.
3. Kept original URLs for sending, copying, learning, and opening externally. Do not send `/local/media-proxy?...` to customers.
4. HTTPS pages now block browser-side direct HTTP SignalR. Web still uses `/local/signalr/consume` server-side bridge first.
5. HTTP page/player previews are no longer embedded inside the HTTPS page; users can still open the target separately.
6. `public/skill-training.js` image strip now uses its own `getDisplayMediaUrl()` helper.

Verification:

- `npm run check` passed.
- `git diff --check` passed.
- Static scan no longer finds direct risky display patterns for image `src` or preview iframe `src`.

Follow-up:

- If Lucky still shows mixed content after deploy, inspect browser DevTools Security/Console and copy the exact `Mixed Content` URL.
- The remaining likely culprit would be an external script/style inserted outside this Web app or Lucky injecting content.
- Because CSP is not yet enforced, this fix avoids mixed content by rewriting known Web app display paths rather than blocking everything globally.


## 79. 2026-06-29 会话列表键盘切换与 Skill 训练标记台

用户问题：

- Web 客服工作台左侧会话列表里，选中会话后按键盘上/下不能稳定切换会话。
- Skill 训练页的含义不够明确，按钮如“批准启用、同意、删除、不保存”不符合人工标注习惯。
- 关键词需要像标签一样展示和编辑：点 `x` 删除，输入后回车快速新增。
- 希望训练页能采样已有真实人工回复，AI 做初审，最后由人工审核入库，避免自动学习继续把错误图片或错误话术学坏。

文件改动：

- `public/app.js`
- `public/skill-training.html`
- `public/skill-training.js`
- `public/skill-training.css`

会话列表键盘修复：

- 新增 `state.contactListKeyboardActive`，点击、鼠标按下或聚焦左侧会话列表后进入列表键盘态。
- 新增全局 `ArrowUp` / `ArrowDown` 兜底处理：当前焦点不在输入框、按钮、下拉框等可编辑控件时，按上下键会调用 `selectAdjacentContact()`。
- 点击会话后会把焦点还给对应会话卡片，异步切换后再通过 `focusContactCard()` 保持焦点和滚动位置。
- 会话列表自身的 `keydown` 已停止冒泡，避免一次按键被列表 handler 和全局 handler 处理两次。

Skill 训练页交互改造：

- 顶部标题改成“采样真实回复，AI 初审后由你逐条标记”，并新增标记规则说明。
- “闲时采样”改名为“采样日常回复”，“刷新总结”改名为“刷新待审”。
- 新增“AI 初审当前条”顶部按钮，复用当前卡片的 AI 整理能力，只生成候选内容，不自动保存入库。
- 新增“打开页面时自动采样”开关，状态存储在 `localStorage` 的 `youchat.training.autoAudit`，开启后训练页会按 10 分钟间隔采样真实人工回复进入待审候选。
- 训练列表标题改为“数据标记队列”，强调这是人工标注流程，不是直接训练黑盒。
- 卡片里的平台、意图、阶段现在以可读标签展示，例如淘宝/天猫、京东、拼多多、抖音、订单查不到、下单后没提示等。

关键词标签编辑：

- 原先普通 `keywords` 输入框改为标签编辑器。
- 关键词会以标签显示，支持点击 `x` 删除。
- 输入关键词后按 Enter 可快速增加，支持空格、逗号、顿号、分号、斜杠等分隔。
- 保存前会自动同步还停留在输入框里的关键词，最终仍写回原有 `keywords` 字段，兼容 `data/reply-skills.json` 的既有结构。

按钮语义调整：

- `approve` 展示为“保存并启用”：确认这条可直接参与推荐或自动回复。
- `optimize` 展示为“保存修改”：人工已经改好标题、关键词、文案或图片。
- `needs-review` 展示为“继续人工处理”：不丢弃，继续留在待审队列。
- `disable` 展示为“不再使用”：停用但保留记录。
- `delete` 展示为“删除记录”：彻底删除误学样本。
- `clear-overrides` 展示为“清空误学样本”：清掉手动覆盖/误学习记录，避免错误图片长期污染 skill。

验证：

- `npm run check` passed。
- 本地后台启动 `node server.js` 后：
  - `http://127.0.0.1:5177/health` 返回 200。
  - `http://127.0.0.1:5177/skill-training.html` 返回 200。
  - `http://127.0.0.1:5177/skill-training.js` 和 `skill-training.css` 返回 200。
  - `http://127.0.0.1:5177/local/skill-training?scope=today` 返回 200。

后续注意：

- 自动采样只负责把真实人工回复拉成候选，不会自动保存 skill。
- AI 初审只填充当前卡片候选内容，仍需人工点击“保存并启用”或“保存修改”。
- 如继续增强训练智能化，优先在 `server.js` 的 `sampleManualRepliesForTraining()` 和训练候选聚类逻辑上做多样本聚类，而不是让单次回复直接覆盖成熟 skill。


## 80. 2026-06-30 订单号场景 Skill 训练纠偏

用户问题：

- 训练页出现客户只发订单号 `5121974090067009148`，关键词、样本、相似问法全是订单号本身。
- 这类 5 开头 19 位订单号实际更像抖音订单，但历史学习可能套用了淘宝话术。
- 客户发订单号一般意味着“订单没提示/没跟单/查不到”，需要先识别平台，再按平台学习话术。
- 广告、无关推广、客服礼貌性短回复不应该进入 skill 学习。
- 训练页里的平台、回复类型不应该是难懂的文本输入框，应改为下拉选择。

文件改动：

- `server.js`
- `public/app.js`
- `public/skill-training.js`
- `public/skill-training.css`

服务端训练规则：

- 新增订单号检测辅助：
  - `normalizeTrainingOrderNo()`
  - `getTrainingOrderNumbers()`
  - `isLikelyTrainingOrderNo()`
  - `isPureTrainingOrderPrompt()`
  - `hasTrainingOrderSignal()`
- 纯订单号 prompt 或含订单号但没有更强意图时，默认 `intentKey=order_waiting`。
- `5121974090067009148` 这类 5 开头 19 位订单号会识别为 `douyin`。
- 纯订单号不再进入 `keywords`；会被语义化为：
  - `抖音订单`
  - `订单未提示`
  - `首次答复`
  - `客户发订单号`
- `learningBucketKey` 不再用订单号本身，改用平台/意图/阶段语义，例如：
  - `learn:douyin:order_waiting:first_answer:抖音订单_订单未提示_首次答复`
- 服务端 `queueTrainingCandidate()` 对疑似广告和低价值礼貌短回复直接跳过：
  - 疑似广告/无关客户消息。
  - `好的`、`收到`、`稍等`、`我看看` 等没有明确业务场景的短回复。
- 纯订单号不再通过 prompt 相似度合并到旧 skill，避免抖音订单误合并进淘宝旧样本。

前端手动学习规则：

- `public/app.js` 的手动学习也同步：
  - 纯订单号默认 `order_waiting`。
  - 含订单号会生成语义关键词，不把订单号本身作为关键词。
  - 广告、推广、无业务场景礼貌短回复不会自动学习。
  - 当前订单上下文的 `platformKey/intentKey` 优先于旧命中 skill，减少抖音回复被写回淘宝 skill。
  - 纯订单号不再 fallback 到旧 prompt 相似 skill。

训练页 UI：

- 平台字段从输入框改为下拉框：
  - 未识别、淘宝/天猫、京东、拼多多、抖音、快手、唯品会、美团、饿了么。
- 意图字段改名为“回复类型”，从输入框改为下拉框：
  - 通用、订单未提示、订单无回馈/查不到、绑定失败、提现相关、到账/回馈状态、转人工。
- 关键词标签组件会过滤纯订单号；如果发现订单号，会用当前下拉选择的平台和回复类型生成语义标签。
- AI 初审提示词新增约束：
  - 客户只发订单号时不要把订单号本身作为关键词。
  - 返回 `platformKey` 和 `intentKey`。
  - 疑似广告、无关推广、礼貌性短回复不应启用为 skill。

验证：

- `npm run check` passed。
- `git diff --check` passed。
- Node VM 验证：
  - `5121974090067009148` -> `platformKey=douyin`，`intentKey=order_waiting`，关键词不含订单号。
  - `京东订单 3309003552115074869` -> `platformKey=jd`，`intentKey=order_waiting`，关键词语义化。
  - `加微信代理项目 www.example.com` + `好的` -> skipped，原因 `疑似广告/无关客户消息`。
  - `你好` + `收到` -> skipped，原因 `礼貌性短回复，不适合作为 skill`。

后续注意：

- 已存在的旧错误 skill 仍需在训练页里清空误学样本、保存修改或删除记录；新规则能阻止后续继续污染。
- 如果后续发现更多平台订单号规则，要同时更新 `server.js` 和 `public/app.js` 的订单号识别。


## 81. 2026-07-02 移动端工作台适配

用户问题：

- 手机访问 `yzkf.xmmhsj.cn` 时，桌面三栏被硬挤在手机宽度里。
- 左侧会话列表、中间聊天框、右侧空白区域同时出现，页面像被截断。
- iPhone Safari 底部地址栏附近容易盖住输入区，顶部工具栏和聊天输入区也会被挤出半截。

文件改动：

- `public/index.html`
- `public/app.js`
- `public/styles.css`

HTML 结构：

- viewport 改为 `width=device-width, initial-scale=1, viewport-fit=cover`，支持 iPhone 安全区。
- 聊天头部新增移动端按钮：
  - `#mobileBackToList`：回到会话列表。
  - `#mobileOpenTools`：打开工具栏。
- 右侧工具栏新增移动端头部：
  - `#mobileBackToChat`：从工具栏返回聊天。
  - 标题显示“工具栏”。
- 这些按钮桌面端默认隐藏。

JS 行为：

- 新增 `MOBILE_WORKBENCH_QUERY = "(max-width: 760px)"`。
- `state.mobilePanel` 记录手机端当前面板：`list`、`chat`、`tool`。
- 新增：
  - `isMobileWorkbench()`
  - `setMobilePanel(panel)`
  - `updateMobilePanelState()`
- `#workbenchView` 会写入 `data-mobile-panel`，CSS 根据该值显示对应面板。
- 手机端点击会话后，`selectContactById()` 会自动切到 `chat` 面板。
- 手机端点击快捷回复、订单、skill、右侧工具 tab 时，`setToolTab()` 会自动切到 `tool` 面板。
- resize 时会同步面板状态并关闭表情弹窗，避免横竖屏切换后状态错乱。

CSS 移动端布局：

- 760px 以下不再把三栏上下堆叠，也不再保留桌面列宽。
- `.workbench-view` 改为满屏两行：顶部栏 + 工作区。
- `.client-layout` 改为相对定位容器。
- `.conversation-pane`、`.chat-pane`、`.tool-pane` 在手机端都变为全屏绝对定位面板，只显示当前 `data-mobile-panel` 对应面板。
- 顶部栏压缩：
  - 手机端隐藏 `#operatorName`，保留连接状态和原生功能按钮。
  - 原生顶部按钮允许横向轻扫，但页面本身不横向滚动。
- 聊天头部：
  - 保留“会话 / 人工接入 / 转 AI / 工具”。
  - 手机端隐藏聊天头里的 `#refreshMessages`，避免半截按钮。
- 输入区：
  - 使用 `100dvh` 和 `env(safe-area-inset-bottom)` 适配 iPhone Safari。
  - 工具条改为最多两行：第一行图标，第二行快捷回复/查订单/skill/AI。
  - 手机端暂时收起输入区里的红点过滤，避免第三行把输入框挤没。
  - 输入框保持至少约 92px 高度。
- 工具栏：
  - 手机端变成全屏面板。
  - 工具 tab 横向轻扫，避免把 tab 挤变形。

验证：

- `npm run check` passed。
- 本地 `http://127.0.0.1:5177/health` 返回 200。
- 使用系统 Edge/Chrome 的 Playwright 通道验证：
  - 390x844 手机视口：`document.documentElement.scrollWidth === 390`。
  - 会话面板、聊天面板、工具面板都能独占全屏，切换后 `visibility=visible` 且 `opacity=1`。
  - 聊天输入框底部贴合视口，不再被三栏布局挤出屏幕。
  - 聊天头部三个按钮完整显示，不再出现半截“工具/刷新”。
  - 输入区工具条不再出现半截“查订单”。
  - 1440x900 桌面视口仍保持三栏布局：306px / 752px / 382px，移动端按钮桌面隐藏。

后续注意：

- 手机端是分面板工作流，不是桌面三栏缩放。后续新增右侧工具时，需要确认 `setToolTab()` 在手机端仍会进入 `tool` 面板。
- 手机端输入区红点过滤目前收起，如果以后要在移动端使用红点过滤，建议放进聊天头工具菜单或工具栏，而不是再塞回输入工具条。
- 不要重新引入 `.client-layout` 的固定最小列宽到 760px 以下，否则会恢复横向溢出。


## 82. 2026-07-03 提现维权/退款卡单 AI 感知

用户需求：

- 有些用户几天前开始尝试提现，但系统提示“由于您存在正在申请退货/退款/换货订单！暂缓提现请求”。
- 正常情况下，用户多次发起提现后，订单维权/退款可能已经结束，只是服务端未同步到订单状态，导致用户反复被卡住。
- 需要在客服界面提示：用户可能遇到订单结案状态未同步问题。
- 统计范围取近三天，且最后一次“提现成功/到账/打款/已完成”之后重新计数。
- 近三天同类系统/客服侧暂缓提示超过 2 次，即 3 次及以上，显示风险提示。
- 客户中途如果成功提取，就不能继续沿用成功前的失败次数。
- 结合客户追问、疑问和急躁情绪计算成立概率，概率越高，颜色越醒目。
- 如果没有触发任何感知风险，也要有绿色轻提示，文案保持通用轻量，不特指提现维权。
- 还希望后续能联动已有的 `3.52youzai` 订单遍历/导出 JS 插件。

文件改动：

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

前端实现：

- 输入框上方工具栏新增 `#withdrawRiskSignal`，位置在 AI 推荐按钮后、红点过滤前。
- 新增状态 `state.withdrawRisk`，记录当前会话扫描状态、命中结果、检查时间和错误。
- 新增扫描常量：
  - `WITHDRAW_REFUND_LOOKBACK_MS = 3 天`
  - `WITHDRAW_REFUND_MIN_COUNT = 3`
  - `WITHDRAW_REFUND_SCAN_PAGE_SIZE = 50`
  - `WITHDRAW_REFUND_MAX_SCAN_PAGES = 6`
  - `WITHDRAW_REFUND_CACHE_MS = 90 秒`
- 会话切换、消息加载、右侧聊天记录加载后，会调用 `scheduleWithdrawRiskScan()`。
- 深度扫描使用现有真实聊天接口 `fetchMessagePage()`，最多扫 6 页，每页 50 条。
- 如果深度扫描接口临时失败，但当前已有消息，会降级使用已加载消息，不直接展示假数据或误报。

识别规则：

- `isWithdrawRefundBlockMessage()`：
  - 只统计系统/客服侧提示，不把客户复述的同一句话算为系统拦截次数。
  - 文本需同时包含：
    - 提现/提取相关词。
    - 退货/退款/换货/维权/售后相关词。
    - 暂缓/阻止/不能/无法/存在/申请中/未完成/解除/12h 等拦截状态词。
- `isWithdrawSuccessMessage()`：
  - 识别“提现/提取/转出 + 成功/到账/打款/已完成/已处理”等。
  - 成功时间之后重新计数。
- `isWithdrawQuestionMessage()`：
  - 识别客户关于提现、余额、到账、维权、退款的追问。
  - 追问不算失败次数，只提高风险概率。
- `analyzeCustomerUrgency()`：
  - 识别急躁催促、疑问追问、反复遇到、投诉倾向、连续标点。
  - 可单独显示“客户可能有急躁情绪”的橙色提示。

UI 表现：

- 绿色：暂无异常感知，提示“正常接待即可”，不特指提现维权，方便后续增加更多 AI 感知类型。
- 蓝色：正在扫描。
- 橙色：客户有急躁/追问情绪，但未达到卡单风险。
- 深橙/红色：近三天提现被维权/退款拦截 3 次及以上，显示次数和概率。
- 高风险时提供两个小按钮：
  - `查订单`：切到右侧订单工具栏并加载该用户订单。
  - `复制`：复制 AI 感知摘要，方便客服备注或内部沟通。
- 移动端保持单行截断，不做大卡片，避免再次挤压输入框。

AI 推荐联动：

- `buildAiConversationContext()` 会把当前 AI 感知提示写入 AI 上下文；无命中时是通用轻提示，命中时才显示具体场景。
- 后续 AI 推荐回复时，可以参考“疑似订单维权/退款结案状态未同步”和客户情绪，不再只看最后一条消息。

外部订单脚本联动结论：

- 用户提供的 `3.52youzai 淘宝订单下载` 是 Tampermonkey 脚本。
- 该脚本调用 `https://3.52youzai.com/api/console/tbOrder/findTbOrderList`，并在 `3.52youzai.com` 页面内通过 XHR/fetch/localStorage/GM 存储捕获 `authorization`。
- Web 客服页不能直接读取 Tampermonkey 的 GM 存储，也不应在前端硬编码该站点授权 token。
- 后续可选联动方案：
  - 在 Web 后端新增受控代理接口，由用户在设置中配置 `3.52youzai` 授权 token，再由服务端查询订单维权状态。
  - 或修改 Tampermonkey 脚本，把已筛选出的订单状态摘要 POST 到 Web 客服后端。
  - 或从 Web 端打开订单脚本页面并带上用户 ID，但这只能辅助跳转，不能直接跨域读结果。

后续注意：

- 不要把客户疑问文本计入“暂缓提现次数”，它只能影响概率。
- 成功提现后必须重新计数。
- 不能用假订单或假训练数据补这块逻辑。
- 如果后续接 `3.52youzai` 真实订单状态，优先做后端代理，不要在浏览器里绕 CORS 或硬编码 token。


## 83. 2026-07-03 AI 感知紧急度与手动消除

用户问题：

- 安全态 AI 感知后面出现“复制”按钮很突兀。
- AI 感知后续会扩展更多类型，因此安全态不应围绕“提现维权卡单”说话。
- 需要在左侧会话列表增加紧急度，不要只有点开会话后才感知。
- 如果客户情绪紧张，客服安抚后客户回复理解，感知应自动缓和。
- 如果系统无法判断是否已缓和，需要提供“消除”操作，可选“忽略 / 已解决”，并降低会话列表紧急度。
- 会话列表希望有从绿到红的渐变，越不稳定颜色越深。

文件改动：

- `public/app.js`
- `public/styles.css`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

核心实现：

- 新增本地持久化：
  - `INSIGHT_DISMISS_STORAGE_KEY = youchat.ai.insightDismissals`
  - `INSIGHT_DISMISS_TTL_MS = 3 天`
  - `state.insightDismissals`
- 新增会话级感知缓存：
  - `state.contactInsights`
  - 深度扫描完成后会把当前会话的感知结果回写到列表缓存。
- 左侧会话列表新增轻量感知：
  - `getContactInsight(contact)`
  - `buildContactInsightFromPreview(contact)`
  - 优先使用当前联系人已有 `records`。
  - 没有 `records` 时，用 `lastContent` 做轻量判断，避免必须点开会话才知道风险。
- 左侧会话列表新增紧急度：
  - `平稳`
  - `关注`
  - `紧张`
  - `紧急`
- 紧急度颜色：
  - 平稳：浅绿。
  - 关注：浅黄。
  - 紧张：浅橙。
  - 紧急：浅红。
- 会话卡片背景使用整卡渐变，不使用侧边粗线，保持接近原客户端的列表密度。

AI 感知条行为：

- 安全态不再显示“复制”按钮，也不会点击整条后跳订单。
- 风险态：
  - 提现维权卡单风险显示“查订单”。
  - 所有可处理风险显示“消除”。
  - 点击“消除”后内联展开：
    - `忽略`
    - `已解决`
- 选择“忽略 / 已解决”后：
  - 写入 `localStorage`。
  - 当前 AI 感知变成绿色安全态。
  - 左侧会话列表紧急度降为 `平稳`。
  - 如果之后出现更新时间更晚的新风险消息，感知会重新触发。

自动缓和：

- 新增：
  - `detectInsightResolution()`
  - `isSoothingOutgoingMessage()`
  - `isCustomerReliefMessage()`
- 规则：
  - 客服/AI 回复里出现安抚、核实、处理、放心、抱歉等内容。
  - 之后客户回复“好的 / 明白 / 理解 / 谢谢 / 辛苦了 / 可以了”等。
  - 且客户回复时间晚于最新风险或急躁线索。
  - 则 AI 感知自动降为安全态，文案为“客户已回复理解，感知已缓和”。

验证：

- `npm run check` passed。
- Node/Edge 探针：
  - 安全态按钮数量为 0。
  - 风险态按钮为：查订单、消除、忽略、已解决。
  - 桌面 1440px：AI 感知条宽 520px，高 30px。
  - 手机 390px：页面无横向溢出，AI 感知条宽 371px，高 28px，composer 仍贴合视口底部。
  - 左侧会话卡片可显示 `紧急`，背景为红色渐变。

后续注意：

- 后续增加新的 AI 感知类型时，应复用 `contactInsights` 和 `insightDismissals`，不要为每个类型各写一套列表紧急度。
- 安全态文案继续保持通用，不要特指某一个业务场景。
- 手动消除只压制当前已发生的风险，后续新消息时间晚于消除时间时仍应重新触发。
- 会话列表紧急度用描述词，不再使用 `AI 稳/低/中/高` 这种调试感较强的标签。

## 2026-07-03 安全与健壮性审计及修复

本次对 `server.js` + `public/app.js` 做了完整代码审计，并复查了 UI/UX。已应用的是低风险、经 `npm run check` 验证的修复；高风险项列为待决策，未擅自改。

已修复（`server.js`）：

- H2 防崩溃：新增全局 `uncaughtException`/`unhandledRejection` 兜底（记录日志、保持进程存活），并给 media-proxy 的 `Readable.fromWeb(...).pipe(res)` 流加 `error` 监听 + `res.on("close")` 清理。此前一个中断的 `/local/media-proxy` 请求就能崩掉整个进程、让全体客服掉线。
- M6 原子写：`writeReplySkills()` 改为先写临时文件再 `renameSync`，崩溃/断电不再产生半写损坏的 JSON（否则 `readReplySkills()` 会把文件重置为默认，丢光已学习 skill）。
- M7 请求体上限：`readBody()` 超过 `MAX_REQUEST_BODY_BYTES = 32MB` 拒绝，防超大 POST 撑爆内存。
- M2 日志脱敏：`captureApi()` 写入前经 `redactSensitiveCaptureText()`，对 JSON 与 form 两种形态的 password/pwd/token/access_token/api_key/secret/authorization/signature 脱敏。登录账号密码与 auth token 不再明文落入 `logs/api-capture.ndjson`。

已修复（前端）：

- P0-1：`.composer .reply-text` 加 `:focus-visible` 焦点环（原为 `outline:none`，主回复框键盘聚焦无可见焦点）。
- P1-2：`toast()` 错误态设 `role="alert"`（读屏立即播报），错误停留延长到 6 秒，点击可关闭；签名不变，全项目调用不受影响。
- P1-3：低对比度灰字（`#8a98aa` `#7a8798` `#8a96a8` `#9aa4b3`）收敛到达标的 `--muted`/`#5f6b7d`。

待决策（未改，需产品/部署确认）：

- H1（严重——密钥已公网泄露）：`origin` 是**公开**仓库 `github.com/525815266/youliaoWeb`。`app.js:8`、`app.js:46` 从初始提交 `211d09f` 起就硬编码了真实的 sub2 / codebuddy key，所以两个付费 key 早已暴露在公开 GitHub 上——**含 git 历史，从 HEAD 删掉也无法消除历史暴露**。第一步必须做、且超出代码范围：**在 sub2（`sub2.sn55.cn`）和 codebuddy（`copilot.tencent.com`）后台轮换（重新生成）key**，作废已泄露的旧 key。之后 key 只保留在 gitignore 的 `config/ai-providers.json`，由 `proxyAi`/`handleAiModels` 在前端传空 key 时按 providerId/baseUrl 注入，删掉前端硬编码 key，`/ai/providers` 不再返回 apiKey。AI 调用在开发机无法实测，代码这半部分要配合用户在 `:5177` 部署后立即验证。
- P0-A（高）：761–1120px 隐藏 `.tool-pane` 且无重新打开入口（移动分栏仅 ≤760px 由 `MOBILE_WORKBENCH_QUERY` 启用）。正确做法是给平板宽度做工具栏抽屉，需多断点浏览器实测。不要简单把断点移到 1120，否则会把手机式单栏切换强加给平板。
- M3/M4（中）：media-proxy/link-preview 无内网 IP 过滤（SSRF）；`/api?__target=` 是开放转发代理。收紧前需先确认前端对 `__target` 的依赖。
- P2-6（清理）：死 CSS 清理暂缓。警告：`applyAiSuggestion`/`sendAiSuggestion` 不是死代码——它们 `display:none` 但在 `app.js:730` 有事件绑定并被状态管理，删 HTML 会崩前端。只有确实无 DOM 的登录插画子样式（`.platform/.chat-rail/.cube`）可在浏览器复核后删除。

审计确认健壮的区域：撤回风险扫描的 token/防抖、AI 自动建议防抖 + AbortController、静态文件路径穿越防护、图片上传兜底链。`proxyAi` 不会把密钥泄到日志/错误，唯一密钥暴露是 H1。

## 2026-07-05 飞牛悠聊服务端 18080 离线恢复

现象：

- Web 登录页一直卡在“连接中”。
- 官方 Windows 客户端提示“网络错误，请检查服务端是否在线”。
- 本地探测：`192.168.9.83:5177` 正常，`192.168.9.83:5700` 正常，`192.168.9.83:18080` 初始不通。

根因：

- `youchat-service` 容器显示 `Up`，端口映射仍是 `18080 -> 8080`，但服务进程启动后反复崩溃。
- `docker logs youchat-service` 反复出现 `Newtonsoft.Json.JsonReaderException: Error reading JObject from JsonReader. Path '', line 0, position 0`。
- 服务端实际读取的配置文件是 `/vol1/1000/Docker/youchat/\悠聊数据库\config\YouChatConfig.json`。
- 该文件在 Linux 上是带反斜杠的文件名，不是正常目录层级；本次检查时大小为 `0 bytes`，导致 `ConfigHelper.InitConfig()` 解析空 JSON 直接崩。

恢复动作：

- 使用远端 `find` 自动定位 `*YouChatConfig.json`，避免手写中文 + 反斜杠路径。
- 先把 0 字节文件备份到 `docker-control/config-backups/empty-json-<timestamp>/YouChatConfig.json.empty`。
- 从既有 MySQL 备份恢复：`/vol1/1000/Docker/youchat/docker-control/config-backups/manual-mysql-switch-20260609-152800/YouChatConfig.json.after`。
- 该备份 `DatabaseType=0`，连接字符串为 MySQL 模式。
- 重启 `youchat-service`，不重启 MySQL。

验证：

- 飞牛本机 `POST http://127.0.0.1:18080/api/System/GetOptions` 返回 `200`。
- Windows 本机 `Test-NetConnection 192.168.9.83 -Port 18080` 返回 `TcpTestSucceeded=True`。
- Windows 本机 `POST http://192.168.9.83:18080/api/System/GetOptions` 返回 `success=True`、`databaseType=0`。
- `http://192.168.9.83:5177/health` 正常，Web 容器默认 API 仍是 `http://host.docker.internal:18080/api`。

后续注意：

- 如果官方客户端提示服务端不在线，但 Docker 里 `youchat-service` 仍显示 `Up`，第一步看日志是否有 `JsonReaderException`，不要只看容器状态。
- 对这个特殊配置文件不要写成普通 Linux 子目录路径；优先用 `find /vol1/1000/Docker/youchat -maxdepth 1 -type f -name '*YouChatConfig.json'` 定位。
- 修复时不要重置 MySQL 容器；只恢复配置并重启 `youchat-service`。

## 2026-07-05 飞牛服务端配置自愈版本

目标：

- 彻底收敛 `YouChatConfig.json` 变成 0 字节、服务端反复崩、客户端卡“连接中”的问题。
- 解决之前 Web 守护只能在 `18080` API 活着时修复，服务端自己起不来时无能为力的问题。

本次新增：

- Web Docker 挂载原悠聊服务目录：
  - `FNOS_YOUCHAT_SERVICE_DIR=/vol1/1000/Docker/youchat`
  - 容器内路径：`YOUCHAT_SERVICE_DIR=/youchat-service`
- `server.js` 新增离线配置修复链路：
  - 定位 `/youchat-service/\悠聊数据库\config\YouChatConfig.json`。
  - 检查是否空文件、非法 JSON、非 MySQL、缺连接串、`AutoShutDown=true`。
  - 优先从服务目录 `.env` 生成 MySQL 连接串。
  - 写入前备份到 `docker-control/config-backups/web-config-repair-<timestamp>/YouChatConfig.json.before`。
  - 原子写回安全配置，并写入 `docker-control/restart.request` 触发 `youchat-service` 重启。
  - `/local/fnos/restore-mysql` 现在先尝试官方接口修复；如果官方接口不可达，自动 fallback 到配置文件离线修复。
- 新增后端启动守护模板：
  - `ops/fnos-youchat-service/config-guard.sh`
  - 已安装到飞牛 `/vol1/1000/Docker/youchat/docker/config-guard.sh`。
  - `docker/run-youchat.sh` 已插入启动前调用。
  - 每次 `YouChatService` 启动前都会检查配置，空文件/SQLite/自动关闭会话开启都会被修回。
- 新增安装器：
  - `scripts/install-fnos-youchat-service-guard.py`
  - npm 脚本：`npm run fnos:install:service-guard`

已部署并验证：

- 已执行安装器并重启 `youchat-service`。
- `docker logs youchat-service` 出现 `[config-guard] disabled AutoShutDown in existing config`。
- `POST http://192.168.9.83:18080/api/System/GetOptions` 返回：
  - `databaseType=0`
  - `autoShutDown=False`
- Web 已重新部署到飞牛。
- `GET http://192.168.9.83:5177/local/fnos/health` 返回：
  - `ok=True`
  - `databaseMode=mysql`
  - `offlineRepairAvailable=True`
  - `serviceConfig.ok=True`
  - `serviceConfig.autoShutDown=False`
- 沙盒演练通过：在 `/tmp` 创建 0 字节 `YouChatConfig.json` 后运行 `config-guard.sh`，结果生成 MySQL 配置，`AutoShutDown=false`，并产生备份。

后续注意：

- 以后再遇到 `18080` 离线，优先点 Web 的数据库修复按钮或调用 `POST /local/fnos/restore-mysql`；它已经能处理 API 离线场景。
- 后端服务自身重启时也会自愈，不依赖 Web 页面打开。
- 如果更换飞牛服务目录，需要同步调整 Web `.env` 的 `FNOS_YOUCHAT_SERVICE_DIR`。

## 2026-07-05 会话列表 AI 状态与未读气泡共存修复

问题：

- 会话列表右侧同时显示时间、AI 感知状态（如“平稳/关注”）和未读气泡时，状态和红色未读数视觉上挤在一起。
- 消息摘要此前跨到右侧状态列，容易让未读气泡看起来压在摘要文字上。

修复：

- `renderContacts()` 中把右侧状态拆成：
  - `.contact-time`
  - `.contact-status-stack`
  - `.contact-urgency-pill`
  - `.unread-badge`
- `.contact-card` 改为命名 grid 区域：
  - `avatar`
  - `main`
  - `last`
  - `side`
- `.contact-last` 只占正文列，不再横跨右侧状态列。
- 右侧状态列固定为 `64px`，保证 `07/05 20:51` 这类时间完整显示。
- AI 状态和未读气泡在右侧列纵向排列，紧凑但互不覆盖。

验证：

- `npm run check` 通过。
- 使用 Chrome headless + 真实 `public/styles.css` 生成会话卡片样例截图：
  - 时间完整显示。
  - `平稳/关注` 与 `1/99+` 未读气泡上下分离。
  - 摘要文字不会进入右侧状态列。

## 2026-07-05 手机端工作台适配强化

问题：

- 手机端能打开 Web 客服，但仍像桌面三栏被压缩：顶部功能区、聊天头、右侧工具栏和输入区会横向挤压。
- 右侧发送消息、链接卡片、文件卡片在窄屏上容易只看到一半。
- 输入框上方工具按钮、快捷入口和 AI/skill 推荐互相抢高度，部分按钮看不全。
- 订单、明细、快捷回复、skill 等右侧工具在手机上可进入，但内部筛选和列表不够适合触屏使用。
- 手机浏览器双击会触发页面缩放，放大后返回会话按钮和输入区位置容易丢失。

修复：

- `index.html` 的 viewport 增加 `maximum-scale=1, user-scalable=no, viewport-fit=cover`，配合工作台内 `touch-action` 禁止双击放大误操作。
- 在 `styles.css` 追加 `max-width: 760px` 的移动端兜底层：
  - 顶部栏改为两行：品牌/连接状态/AI 设置在第一行，原生客户端功能图标在第二行横向滚动。
  - 聊天头改为两行：返回会话 + 当前客户信息在第一行，人工接入/转 AI/工具按钮在第二行横向滚动。
  - 消息列表、右侧消息气泡、网页链接卡片、小程序卡片、文件卡片统一按手机视口收缩，不再撑出屏幕。
  - AI/skill 推荐压缩高度，最多占用一小段，不继续向下挤爆输入框。
  - 输入工具区固定为图标行 + 快捷入口行，两行内部可横滑；输入正文保持 16px 字号，避免移动浏览器聚焦放大。
  - 工具页保持单页进入，但 `tool-content`、快捷回复、skill、聊天记录内部各自滚动。
  - 订单筛选在手机上压成可点击的紧凑网格，订单卡片缩小图片和字段列宽。
  - 明细表在手机上改成卡片式行，避免横向表格无法阅读。
  - 图片/链接预览弹层在手机上撑满可用区域，关闭按钮和操作按钮保持可见。

验证：

- `npm run check` 通过。
- Chrome headless 以 `390x844` 手机视口检查 `list/chat/tool` 三个面板：
  - `documentElement.scrollWidth=390`
  - `body.scrollWidth=390`
  - 可见面板宽度与视口一致，没有把页面整体撑宽。
- 生成本地 QA 截图：
  - `reports/_uicheck/mobile-list-390x844.png`
  - `reports/_uicheck/mobile-chat-390x844.png`
  - `reports/_uicheck/mobile-tool-390x844.png`

后续注意：

- 手机端不是桌面三栏缩放，而是 `data-mobile-panel=list/chat/tool` 的单面板流转。
- 后续新增按钮或工具页时，要先确认在 `max-width: 760px` 下是否需要单独收缩、横滑或卡片化。

## 2026-07-06 手机端聊天气泡与头像错位修复

问题：

- 手机端客户发来的短消息（例如“提现”“好的”）会被压成一行一个字。
- 聊天消息头像和文字气泡在窄屏下出现错位，尤其是客户头像会飘到不该出现的位置。
- 手机端聊天气泡继承默认字号，长文本显得过大，容易挤压内容。

原因：

- 上一轮移动端兜底样式里把 `.message` 设置成 `width: fit-content`，CSS Grid 会按最小内容宽度计算中文短文本，导致 CJK 字符按单字折行。
- `.contact-avatar` 同时被会话列表和聊天消息复用，而会话列表样式里有 `grid-area: avatar`；在聊天消息网格里没有覆盖时，会干扰头像定位。

修复：

- 手机端 `.message` 改成占满消息列表宽度，气泡自身用 `width: max-content; max-width: 100%` 控制内容宽度。
- 客户/客服消息分别固定 32px 头像列，消息正文限制在 `min(78vw, 336px)` 内。
- `.message .contact-avatar, .message .contact-photo` 增加 `grid-area: auto`，避免继承会话列表的命名 grid 区域。
- 手机端 `.message-content` 设为 14px / 1.5 行高，短消息保留横排，长消息按气泡最大宽度自然换行。
- 富卡片消息（链接、小程序、文件）单独保持 `width:auto; min-width:0; max-width:100%`，避免受文字气泡 `max-content` 影响。

验证：

- `npm run check` 通过。
- Chrome headless `390x844` 手机视口验证：
  - `documentElement.scrollWidth=390`
  - `body.scrollWidth=390`
  - “提现”“好的”短消息气泡宽约 45px、高约 39px，没有竖排。
  - 头像 top 与气泡 top 约差 2px，位置稳定。
- QA 截图：
  - `reports/_uicheck/mobile-message-fit-390x844.png`

## 2026-07-06 空会话列表桌面端底部空白修复

问题：

- 当左侧会话列表为空时，桌面端三栏工作台会在输入框下方露出大片浅蓝空白。
- 同一页面在有会话列表数据时通常不会出现，因为列表内容把 grid 行撑高了。

原因：

- `.client-layout` 只定义了三列 `grid-template-columns`，没有定义行。
- CSS Grid 的隐式行默认是 `auto`。空列表时这一行按内容高度收缩，三栏面板只到输入框底部，工作台剩余高度露出背景色。
- 有会话时左侧列表内容变高，隐式行被内容撑开，所以问题不明显。

修复：

- `public/styles.css` 中 `.client-layout` 增加：
  - `grid-template-rows: minmax(0, 1fr)`
  - `align-items: stretch`
- `@media (max-width: 860px)` 的单列兜底中重置 `grid-template-rows: none`，避免影响窄屏堆叠布局。

验证：

- `npm run check` 通过。
- Chrome headless 使用 `1919x927` 桌面视口复现空列表：
  - 修复前：`.client-layout` 高 786px，但 `.conversation-pane/.chat-pane/.tool-pane` 只到 605px。
  - 修复后：三栏面板高度均为 786px，从 topbar 下方一直撑到窗口底部。
- QA 截图：
  - `reports/_uicheck/empty-layout-after-1919x927.png`

## 2026-07-05 收尾安全审计遗留项 H1 / M3-M4 / P2-6

承接 2026-07-03 审计。三个开放代码项已全部完成，并用一次性端到端脚本验证（跑完即删）。`npm run check` 通过。改动文件：`public/app.js`、`public/index.html`、`public/styles.css`、`server.js`。

### H1 — 前端密钥泄露（代码侧已完成；**用户仍须轮换旧 key**）

- `public/app.js` 删除硬编码的 sub2/codebuddy key（`DEFAULT_AI_API_KEY` 与 codebuddy preset 现为 `""`）。
- `/ai/providers`（`handleAiProvidersConfig`）不再返回 `apiKey`，改为每个渠道返回 `hasKey: boolean`；前端把"哪些渠道服务端有 key"学到 `state.aiServerKeyProviders`。
- `proxyAi` + `handleAiModels`：前端传空 key 时，从 gitignore 的 `config/ai-providers.json` 按 `providerId`（再退回 baseUrl 主机）注入真实 key。`getAiRelayBasePayload()` 现在带上 `providerId`。
- **安全关键**：注入服务端 key 时，强制使用该渠道自己配置的 `baseUrl`/`authType`——被篡改的 `baseUrl`（如 `providerId=sub2` + `baseUrl=evil.com`）无法把 key 外泄到攻击者地址。已验证。
- 前端 6 处 AI 守卫从 `!state.aiApiKey` 改为 `!hasUsableAiKey()`（本地填了 key 或服务端有 key），两个 `requestAiRelaySuggestions` 副本都改到。
- `index.html` 密钥框加 placeholder「留空则使用服务端已配置的密钥」。
- **仍需用户做**：公开仓库历史里泄露的旧 key 依然有效——**去 sub2（`sub2.sn55.cn`）和 codebuddy（`copilot.tencent.com`）后台轮换/重置 key**，更新 `config/ai-providers.json`，然后在 `:5177` 实测 AI（开发机无法实际调 AI）。

### M3/M4 — SSRF + 开放转发代理（已完成）

- 新增 `assertSafeExternalTarget()`：解析主机（含 DNS）后拦截 loopback/私网/link-local/CGNAT/组播/保留 IP，含 `169.254.169.254`。`safeSsrfFetch()` 手动逐跳跟随重定向并每跳复检（防 30x 跳转到内网）。接入 `handleMediaProxy` + `handleLinkPreview`。
- 白名单 `MEDIA_PROXY_ALLOW_HOSTS` = `DEFAULT_API_BASE` 的后端主机 + 环境变量 `YOUCHAT_MEDIA_ALLOW_HOSTS`，保证后端托管的媒体仍可代理。真实聊天媒体都在公网 CDN（qiniu/wx.qlogo/yzimage/alicdn/pddpic，抓包日志证实），所以拦内网 IP 不影响图片显示。
- `/api?__target=` 收紧：`getTargetBase()` 只接受主机在 `API_TARGET_ALLOW_HOSTS`（`DEFAULT_API_BASE` 主机 + 环境变量 `YOUCHAT_ALLOWED_API_HOSTS`）里的 `__target`，否则回退 `DEFAULT_API_BASE`。已确认前端只会传 `state.apiBase`，所以安全。若部署非默认后端，用环境变量加它的主机。

### P2-6 — 死 CSS（小范围完成）

- 只删了登录插画的孤立内部样式（`.platform`、`.chat-rail*`、`.bubble*`、`.document-card*`、`.cube*`，共 172 行）——它们的 DOM 早已被单个 `<img src="/assets/login_img.png">` 取代，HTML/JS 里零引用。保留 `.login-illustration`、`.login-illustration img`、`.login-card`。`applyAiSuggestion`/`sendAiSuggestion` 未动（仍有事件绑定）。

## 2026-07-06 桌面端会话气泡和头像错乱修复

问题：

- 电脑端聊天区出现客户短消息竖排显示，例如“我同意XV”被压成一字一行。
- 部分客服消息头像和气泡不在同一条稳定轨道上，看起来像头像漂在气泡左侧或上方。
- 这些问题和前一轮手机端消息适配有关：移动端修复需要让短消息不竖排，但基础消息样式没有完全稳住桌面端。

原因：

- `.message-content` 原来的 `width: fit-content` 在 Grid/Flex 混合布局里容易按最小内容宽度收缩，中文短句可能被压到单字宽度。
- `.contact-avatar` 是会话列表和聊天消息共用类，会话列表里的命名 grid 区域会影响聊天消息头像定位，必须在 `.message` 作用域里覆盖为 `grid-area: auto`。
- 桌面端 `.message-body` 没有明确最大宽度和客服/AI 右对齐规则，真实数据里遇到头像图片、长链接、短中文时更容易被内容尺寸牵着跑。

修复：

- `public/styles.css`
  - `.message` 从只设 `max-width` 改为 `width: min(680px, 82%); max-width: 100%`，让消息行自身有稳定宽度。
  - `.message.is-compact` 显式 `width: 100%`，保证右侧聊天记录工具栏里的紧凑消息仍按容器排版。
  - `.message .contact-avatar, .message .contact-photo` 增加 `grid-area: auto`、固定尺寸和顶部对齐，避免继承会话列表头像布局。
  - `.message-body` 增加 `max-width: 100%`，客服/AI 消息 body 基础层右对齐。
  - `.message-content` 改为 `box-sizing: border-box; width: max-content; min-width: min(3.2em, 100%); max-width: 100%`，短消息保持横排，长消息按气泡最大宽度自然换行。
  - 富卡片消息继续单独设 `width: auto; min-width: 0; max-width: 100%`，避免链接、小程序、文件卡片被文字气泡规则挤坏。

验证：

- `npm run check` 通过。
- Chrome headless `1366x768` 桌面视口注入真实结构消息：
  - 客户短句“我同意XV”气泡约 `68x45`，没有竖排。
  - 客户头像在左列，客服头像在右列，头像和气泡轨道稳定。
  - 订单号 `5121974090067009148` 保持单行横排，长链接消息按气泡宽度换行。
- Chrome headless `390x844` 手机视口复查：
  - 客户短句不竖排。
  - 右侧客服气泡和头像不溢出屏幕。
  - 输入框没有被这次消息布局改动向下挤出。
- QA 截图：
  - `reports/_uicheck/message-layout-desktop-after.png`
  - `reports/_uicheck/message-layout-mobile.png`

后续注意：

- 后续不要把 `.message` 改回 `width: fit-content`，否则中文短句很容易再次变成一字一行。
- 会话列表头像和聊天消息头像虽然共用 `.contact-avatar`，但聊天区必须保留 `.message .contact-avatar { grid-area: auto; }` 这类作用域覆盖。
- 移动端消息宽度应该在 `@media (max-width: 760px)` 中单独收缩，不要把手机端的视口宽度规则直接搬到基础桌面层。

## 2026-07-06 会话列表右键菜单边界定位修复

问题：

- 当选中靠近会话列表底部的会话并右键时，菜单仍按鼠标位置向下展开，会被底部“当前 / 留言 / 历史”分类栏挡住。
- 长菜单（当前会话 8 项操作）比短菜单更容易被裁切，导致“清空列表”“全部已读”等底部操作看不全。

原因：

- 右键菜单是 `position: fixed` 挂到 `body` 上的，但原逻辑只使用 `event.clientX/Y` 直接写 `left/top`。
- 没有在菜单渲染后测量实际高度，也没有把会话列表可视区域底部作为定位边界。

修复：

- `public/app.js`
  - 新增 `positionContextMenu(menu)`：菜单先隐藏渲染、测量尺寸，再按视口和 `#contactList` 可视区域重新定位。
  - 默认向下弹出；如果下方空间不足且上方空间更多，则自动改为向上弹出。
  - 极端小窗口或菜单过长时限制 `max-height` 并启用菜单内部纵向滚动。
  - 横向位置也会贴合视口右边界，避免菜单伸出屏幕。
  - 会话列表滚动、窗口 resize 时自动关闭右键菜单，避免菜单停留在旧位置。
- `public/styles.css`
  - `.context-menu` 增加 `max-width`、`overscroll-behavior: contain` 和细滚动条。

验证：

- `npm run check` 通过。
- Chrome headless `1366x768` 注入 18 条会话，滚动到底部后模拟右键最后一条：
  - 菜单 `placement=top`。
  - 菜单底部 `613`，会话列表底部 `629`，未压到下方分类栏。
  - 会话列表滚动后菜单自动关闭。
- QA 截图：
  - `reports/_uicheck/context-menu-bottom-after.png`

后续注意：

- 右键菜单新增操作项时不需要手工调高度，定位逻辑会用实际 `getBoundingClientRect()` 结果计算。
- 如果以后把会话列表底部分类栏改成浮层或 sticky，需要继续保证 `#contactList.getBoundingClientRect().bottom` 代表菜单能使用的真实底部。

## 2026-07-06 AI 优化文案入口与推荐托盘重做

需求：

- 客服手动输入回复后，可以点“优化文案”，让 AI 从贴心、耐心、安抚、普通人容易理解的角度重写。
- 点击优化后，普通 AI 推荐/skill 推荐不应继续混在一起，默认替换成优化候选。
- 输入框上方的浮动推荐条原本太像临时拼接的长条，标题、换一换、关闭、内容和按钮挤在一起，需要重新设计。

修复：

- `public/index.html`
  - 工具快捷区新增 `优化文案` 按钮。
  - 发送按钮旁新增 `优化文案` 按钮，方便客服写完草稿后直接点。
- `public/app.js`
  - 新增 `requestDraftOptimizeFromComposer()`：校验草稿、AI 开关、服务端密钥后手动触发优化。
  - `optimizeDraftReply(options)` 支持 `{ manual: true, force: true }`：
    - 手动点击时先用“正在优化”候选替换当前推荐条。
    - AI 返回后只展示 `type=optimize` 的 1-3 条候选。
    - 保留草稿图片，优化只处理文字。
    - 修复空会话/没有最新客户消息时 `latest=null` 导致 `getMessageKey()` 报错的问题。
  - 优化提示词强化：避免责备客户、避免情绪过激、把生硬/催促表达改成温和但不拖泥带水的说法。
  - loading 候选禁止“采用/发送”，避免点到半成品。
- `public/styles.css`
  - 重做 `.ai-suggestion-card` 推荐托盘：左侧控制区 + 右侧候选列表。
  - 候选条改成紧凑任务行：编号圆点、最多两行文本、右侧采用/发送按钮。
  - 推荐托盘高度上限压到 `108px`，3 条候选时内部滚动，不再继续向下挤输入框。
  - `优化文案` 按钮使用蓝白轻量态，AI 关闭/生成中时有禁用态。

验证：

- `npm run check` 通过。
- Chrome headless 桌面 `1366x768` 注入 3 条优化候选：
  - 推荐托盘高度 `108px`。
  - 3 条候选内部滚动，输入框不被挤出。
  - QA 截图：`reports/_uicheck/ai-suggestion-tray-polished-after.png`。
- Chrome headless 手机视口：
  - 页面无横向溢出。
  - 推荐托盘约 `112px`，发送区按钮可横向滚动。
  - QA 截图：`reports/_uicheck/ai-suggestion-tray-mobile.png`。
- 功能模拟测试：
  - 先放入普通 AI 推荐 `OLD_SHOULD_GO`。
  - 模拟 `/ai/chat/completions` 返回两条优化文案。
  - 调用 `optimizeDraftReply({ manual:true, force:true })` 后，`state.aiSuggestions` 只剩优化候选，`hasOld=false`。

后续注意：

- 推荐托盘不能再做成大卡片面板，最多是紧凑提示条；多条候选用内部滚动消化。
- 优化文案只改文字，不处理图片，不编造订单/返利/后台事实。
- 如果后续要加“更正式/更口语/更安抚”等语气选项，可以复用当前 `type=optimize` 候选和 `refreshAiSuggestion()` 的换一换逻辑。

## 2026-07-06 AI 浮动提示框二次收口

问题：

- 用户反馈输入框上方的 AI/skill 浮动提示框仍然很丑，像一根临时拼接的长胶囊，标题、换一换、关闭、候选文案、采用/发送全部挤在一起。
- 上一版虽然已经把提示条压缩到独立 grid 行，但候选项仍偏满宽，短文案也显得像被硬塞进大框里。
- 不能回退到旧的 `ResizeObserver + 绝对定位 + --composer-height` 方案；项目前面已经证明那套方案会让输入框、工具栏、图片托盘和 AI 推荐互相挤压。

修复：

- `public/app.js`
  - `renderAiSuggestionCard()` 给推荐托盘补充 `is-single / is-multiple` 状态，方便单条、多条候选走不同高度策略。
  - 候选结构改成 `编号圆点 + .ai-suggestion-copy + 行内操作按钮`，序号从 `1.` 改成干净的圆形 `1`。
- `public/styles.css`
  - `.ai-suggestion-card` 从贴边长条改成居中的轻浮层托盘：`width: fit-content`、最大宽度受聊天区约束，短内容不会硬撑满整行。
  - 外层高度二次压缩到 `112px`，单条候选压到 `88px`，多条候选继续用内部纵向滚动。
  - 左侧控制区垂直居中，避免标题胶囊顶在上方、下方一大片空白。
  - 候选行压缩到 30px 级别，采用/发送按钮仍保持可点。
  - 增加进入和 loading 动效，并用 `prefers-reduced-motion` 关闭动画。
  - 860px / 760px / 480px 断点同步收口，手机端不横向溢出。

验证：

- `npm run check` 通过。
- Chrome headless 使用本机 Chrome 截图：
  - 桌面 `1440x860`：托盘 `724x112`，composer 仍在下方稳定位置，无横向溢出。
  - 手机 `390x780`：托盘 `362x112`，composer 仍在下方稳定位置，无横向溢出。
- QA 截图：
  - `reports/_uicheck/ai-suggestion-tray-redesign-desktop-v2.png`
  - `reports/_uicheck/ai-suggestion-tray-redesign-mobile-v2.png`

后续注意：

- 不要把 `#aiSuggestionCard` 改回绝对定位，不要恢复 `ResizeObserver` 和 `--composer-height`。
- AI/skill 推荐应该保持“提示队列”形态：轻量、可关闭、可换一换、每条候选有自己的采用/发送按钮。
- 如果以后要显示图片候选，应该加在候选行内部的缩略图位，不要把整个托盘改成大卡片。

## 2026-07-06 AI 浮动提示框长话术收口

问题：

- 用户用真实 skill 长话术验证后，推荐托盘仍然丑：第一条候选被拉成一条横向长蛇，按钮跑到屏幕最右边，视觉上像横向拼接出来的条，不像客服工作台组件。
- 根因是上一版用了 `width: fit-content`，短话术看起来灵活，但一遇到长话术就按内容最大宽度撑开。

修复：

- `public/styles.css`
  - `.ai-suggestion-card` 从动态内容宽度改成固定最大宽度队列卡：`width/max-width: min(920px, calc(100% - 28px))`。
  - 左侧控制区固定 `176px`，避免“换一换”被挤成两行。
  - 候选项改为 `width: 100%`，内部 grid 使用 `minmax(0, 1fr)`，强制长文案在卡片内换行，不再横向撑爆。
  - 主候选 `.is-active` 最多两行，其他候选一行预览，保持队列紧凑。
  - “换一换”按钮增加 `white-space: nowrap`。

验证：

- `npm run check` 通过。
- Chrome headless 按用户截图宽屏尺寸 `1802x564` 注入超长 skill 文案：
  - 托盘 `920x96`，居中，不再铺满宽屏。
  - 第一条候选 `682x42`，文案区域 `552x33`，长文本正常夹在卡片内。
  - 页面横向溢出为 `0`。
- 手机 `390x780` 仍无横向溢出。
- QA 截图：
  - `reports/_uicheck/ai-suggestion-tray-long-desktop-v4.png`
  - `reports/_uicheck/ai-suggestion-tray-long-mobile-v3.png`

后续注意：

- 不要再给 `.ai-suggestion-card` 或 `.ai-suggestion-option` 使用 `width: fit-content` 承载真实长话术。
- 长 skill 回复必须先在候选行内收住，图片/步骤只作为预览，不要把完整多步骤内容横向展开。

## 2026-07-06 AI 浮动提示框半透明减遮挡

需求：

- 用户希望输入框上方的提示气泡可以做成半透明状态，不要像实心面板一样遮挡聊天区域。

修复：

- `public/styles.css`
  - `.ai-suggestion-card` 外层改为半透明蓝白玻璃感：背景主 alpha 约 `0.62`，边框透明度降低，阴影变轻。
  - 增加 `backdrop-filter: blur(8px) saturate(145%)`，让半透明层更柔和。
  - `.ai-suggestion-head`、`换一换`、候选行背景同步降低不透明度。
  - 主候选保留更高不透明度 `0.86`，确保客服仍能快速阅读。
  - hover/focus-within 时自动变实一点，方便鼠标移上去后准确点击“采用/发送”。
  - `is-optimize`、`is-no-reply` 单独补了 hover/focus 半透明状态，避免后写样式覆盖普通 hover。

验证：

- `npm run check` 通过。
- Chrome headless 宽屏长话术场景：
  - 托盘仍为 `920x96`，无横向溢出。
  - 外层计算背景为 `rgba(247, 251, 255, 0.62)`。
  - 主候选计算背景为 `rgba(255, 255, 255, 0.86)`，文字可读。
- QA 截图：
  - `reports/_uicheck/ai-suggestion-tray-translucent-v1.png`

后续注意：

- 不要直接给整个 `.ai-suggestion-card` 设置 `opacity`，否则文字和按钮也会一起变淡。
- 应继续用半透明背景 + 可读文字的方式减轻遮挡。

## 2026-07-07 对话框多行文案发送保留换行

问题：

- 客服在输入框粘贴多行商品文案，例如京东商品标题、分隔线、价格、抢购链接，发送后实际内容堆在一起，没有按原换行展示。
- 典型文案：
  - `【京东】...`
  - `---------------`
  - `京东价：¥99.80`
  - `到手价：¥59.80`
  - `抢购链接：https://u.jd.com/...`

原因：

- `contenteditable` 粘贴多行内容时，浏览器经常会生成多个 `<div>` / `<p>` 块。
- 旧的 `extractTextFromNode()` 和 `parseComposerBlocks()` 只递归块级元素内容，没有在块级边界补 `\n`，所以多个块会被拼成一段。
- 显示层 `.message-content { white-space: pre-wrap; }` 本身可以显示换行，主要问题在发送前提取阶段。

修复：

- `public/app.js`
  - 新增 `normalizeComposerText(text)`，统一 CRLF、去掉行尾多余空格，并压缩 3 个以上连续换行为 2 个。
  - 新增 `isComposerBlockElement(node)`，识别 `DIV`、`P`、`LI`、`PRE`、标题等块级节点。
  - 新增 `appendComposerLineBreak(text)`。
  - `getReplyTextContent()` 现在返回规范化后的文本。
  - `extractTextFromNode()` 遇到块级节点时会在前后补换行。
  - `parseComposerBlocks()` 遇到块级节点时同样补换行，确保实际发送到 `/ChatContent/SendMsg` 的 `content` 带原始换行。

验证：

- `npm run check` 通过。
- Chrome headless 注入和用户示例相同结构的多行京东文案：
  - `replyText.innerHTML = sampleLines.map(line => <div>line</div>)`
  - `getReplyTextContent()` 返回包含 `\n` 的文本。
  - `parseComposerBlocks().blocks[0].content` 返回包含 `\n` 的文本。
  - DOM 多 `<div>` 场景得到 7 行（含尾部换行，真实发送前 `.trim()` 会去掉尾部空行）。
  - 纯文本节点 `sampleLines.join("\n")` 场景也保持换行。

后续注意：

- 不要在发送前对 `block.content` 做 `.replace(/\s+/g, " ")` 或类似压缩，否则商品文案/价格模板会再次堆叠。
- 如果后续接入富文本粘贴清洗，必须保留块级节点边界的 `\n`。

# 悠聊二开 Web 工作台

这是一个不改动原 Electron 安装包的 Web 二开工程，用来连接悠聊本地服务或 Docker 服务，并逐步复刻 Windows 客户端的客服工作台能力。

## 已接入的真实接口

- 登录：`/System/LogIn`
- 配置探测：`/System/GetOptions`
- 会话列表：`/Contact/GetContactList`
- 聊天记录：`/ChatContent/GetList`、`/ChatContent/GetChatContentList`
- 点击会话清红点：`/ChatContent/ConsumeMessage`
- 发送消息：`/ChatContent/SendMsg`
- 发送指令：`/ChatContent/SendSuperCmd`
- 图片上传参数：`/ChatContent/GetOssConfig`
- 图片上传本地代理：`/local/oss-upload`
- 红包模板：`/ChatContent/GetRedPacks`
- 发送红包：`/ChatContent/SendRedPacks`
- AI 推荐、文字优化、skill 优化：`/ai/chat/completions`
- 用户信息：`/Contact/GetContactInfo`
- 快捷回复：`/Faq/GetPageList`、`/Faq/GetTypeList`
- 订单：`/Order/GetPageList`
- 账户流水明细：`/Order/GetAccDetailPageList`
- 人工接入：`/Conversation/AccessIn`
- 全部接入：`/Conversation/AccessInAll`
- 待办切换：`/Contact/SetTodo`
- 免打扰切换：`/Contact/UpdateContactIsNotice`
- 关闭会话：`/Conversation/ShutDown`
- 解除客服绑定：`/Conversation/UnBound`
- 转 AI：`/Conversation/TransferToAI`
- 好友请求：`/Contact/GetNewFirend`、`/Contact/NewFirendAccept`、`/Contact/NewFirendIgnor`
- 本地 skill 回复库：`/local/reply-skills`、`/local/reply-skills/learn`

客户头像会同时读取会话列表和 `/Contact/GetContactInfo` 的真实头像字段。左侧会话列表、会话顶部和客户消息气泡共用同一套头像渲染；如果真实头像 URL 加载失败，只回退为文字头像，不使用假图片。

## 输入区快捷工具栏

聊天输入框上方已按原客户端补齐一排常用按钮：

- 表情：插入微信/悠聊表情短码到输入框。
- 发送指令：调用 `/ChatContent/SendSuperCmd`。
- 选择图片：调用 `/ChatContent/GetOssConfig` 获取 OSS 参数，优先浏览器直传，失败时走 `/local/oss-upload` 本地代理，再用 `/ChatContent/SendMsg(contentType=1/4)` 发出。
- 红包：调用 `/ChatContent/GetRedPacks` 读取模板，再调用 `/ChatContent/SendRedPacks`。
- 截图：使用浏览器屏幕捕获生成图片，再走图片发送链路。
- 星标：把当前输入/推荐话术写入 `data/reply-skills.json`；如果输入框里已有草稿图片，会先走真实 OSS 上传拿到图片 URL，再把图片步骤一起写入 skill。
- 转 AI：调用 `/Conversation/TransferToAI`。
- 粘贴图片：输入框支持直接粘贴/拖入图片；剪贴板里同时有文字和图片时，文字会正常进入输入框，图片会进入输入框左侧草稿栏。点击发送时文字走 `/ChatContent/SendMsg(contentType=0)`，图片逐张走上传 + `/ChatContent/SendMsg(contentType=1/4)`。发送过程中按钮会锁定为“发送中...”，避免服务端排队未回显时重复点击造成多次发送。
- 发送快捷键：发送按钮右侧可以选择 `Enter 发送` 或 `Ctrl+Enter 发送`，默认 `Enter 发送`，选择会持久化到浏览器。
- 聊天图片预览：客户或客服发送的真实图片在主聊天区和右侧聊天记录里都可以点击，直接复用网页/视频预览浮层在当前页面打开，支持复制地址和打开原图。
- 文字优化：输入文字后会用 AI 生成 1-3 条“您输入的可优化为”候选，只优化文字，不改图片；采纳/发送时可保留原图一起发送。
- 好友请求：左侧会话顶部按钮调用 `/Contact/GetNewFirend`，通过/忽略分别调用 `/Contact/NewFirendAccept`、`/Contact/NewFirendIgnor`。
- 会话 tab：当前、留言、历史显示数量和红点；选中会话后按键盘上下箭头可切换会话。

## 启动 Web

```powershell
cd C:\youchat-dev-web
npm run dev
```

默认页面地址是 `http://localhost:5177`。

如需指定端口或后端地址：

```powershell
$env:PORT = "5177"
$env:YOUCHAT_API_BASE = "http://192.168.9.83:18080/api"
npm run dev
```

Web 默认后端地址对齐飞牛上的悠聊 Docker 服务：`http://192.168.9.83:18080/api`。登录页服务器地址可以直接填完整 API 地址，例如 `http://192.168.9.83:18080/api`；如果填主机加端口，则会按 `http://主机:端口/api` 连接本地或 Docker 服务。

如果浏览器里还保存着早期误用的正式服地址 `https://im.52youzai.com/api` 或本机地址 `http://localhost:8080/api`，页面启动时会自动迁移回 `http://192.168.9.83:18080/api`，避免和飞牛本地服务、数据库对不上。

也可以直接运行：

```powershell
.\start-dev-web.ps1
```

## 启动本地悠聊服务

```powershell
.\start-local-youchat-service.ps1
```

验证服务：

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8080/api/System/GetOptions
```

## 抓取 Web 真实请求

开发服务器会自动记录所有 `/api/*` 代理请求，日志路径：

```text
C:\youchat-dev-web\logs\api-capture.ndjson
```

每一行是一条请求，包含目标地址、状态码、耗时、请求体和响应摘要。你操作页面后，把这个文件发回来，我就能继续反查失败接口和字段。

清空旧日志：

```powershell
Remove-Item -LiteralPath C:\youchat-dev-web\logs\api-capture.ndjson -ErrorAction SilentlyContinue
```

实时查看日志：

```powershell
.\watch-api-capture.ps1
```

## 右上角客户端功能区

右上角分成两组：

- 原生客户端功能组：统计后台、聊天记录全局搜索、消息统计、通知、客户端设置菜单。
- Web AI 设置：单独的 `AI` 按钮，持久化到浏览器 `localStorage`。

客户端设置菜单包含：

- `设置`：读取 `/System/GetOptions`，保存 `/System/SetOptions`。
- `数据库管理`：按原客户端“删除聊天记录”窗口调用 `/ChatContent/Delete`。
- `挂起/恢复`：Web 本地暂停或恢复自动刷新。
- `退出登录`：回到登录页。
- `关闭程序`：网页端会尝试关闭当前标签页。

聊天记录全局搜索调用：

```text
POST /ChatContent/SearchList
```

消息统计面板调用：

```text
POST /Summary/RealTimeSummary
```

当前真实返回是嵌套结构，分段字段包括 `it/count/fromUser/fromUserRedpointCount/fromRobot/fromKefu/contactCount`，Web 会按这些字段汇总和绘制趋势。

通知面板调用：

```text
POST /Notice/GetList
POST /Notice/GetEvents
POST /Notice/ConsumeNotice
```

当前通知列表总数来自 `data.total.value`，列表来自 `data.data`。如果后续抓包发现有未读专用字段或接口，再优先替换通知角标来源。

数据库管理会删除指定日期范围内的聊天记录。该功能来自原客户端接口 `ChatContentController.Delete(System.DateTime startTime, System.DateTime endTime)`，Web 会把日期转换成 `YYYY-MM-DD 00:00:00` 到 `YYYY-MM-DD 23:59:59` 后提交到 `/ChatContent/Delete`。确认按钮默认禁用，必须输入 `我已知晓删除的聊天记录无法恢复` 才能提交；删除不可恢复，操作前先确认数据库备份。

统计后台按钮会按当前服务端地址打开 `/abnormal`，例如：

```text
http://192.168.9.83:18080/abnormal
```

## AI 和 skill 回复

AI 设置在右上角单独的 `AI` 按钮里，持久化到浏览器 `localStorage`，当前默认使用 OpenAI 兼容中转：

```text
https://sub2.sn55.cn/
```

页面默认开启 AI 推荐。它会在新客户消息进入后自动结合真实聊天上下文、快捷回复和本地 skill 生成 1 到 3 条横条候选；未采用时也会记录人工回复，用于后续学习。推荐条支持关闭、采用、发送和“换一换”，其中“换一换”会换一种语气和说法。

AI 请求统一走本地中转：

```text
POST /ai/chat/completions
```

`server.js` 会再转发到右上角 AI 设置的 OpenAI 兼容端点。内置预设：

- `sub2 中转`：`https://sub2.sn55.cn/`，默认模型 `gpt-5.4-mini`。
- `DeepSeek`：`https://api.deepseek.com`，默认模型 `deepseek-v4-flash`。DeepSeek 使用自己的 API Key，点击预设不会覆盖当前密钥。
- `CodeBuddy`：自动切换为 `X-Api-Key` 认证。CodeBuddy 平台创建访问密钥后，把平台给出的 API 端点、访问密钥和模型填入设置即可；如果只填根地址，Web 会按 OpenAI 兼容规则补 `/v1/chat/completions`。

右侧新增了 `skill回复` 标签。skill 数据不是假数据，保存在本地文件：

```text
C:\youchat-dev-web\data\reply-skills.json
```

这里可以维护关键词、回复步骤、图片步骤、是否允许自动回复、是否仅标记无需回复。开启“自动学习人工回复”后，如果已经命中某个 skill 但客服没有采用推荐，而是自己回复，页面会先把人工回复记录到这个 skill 的 `manualOverrides`；同一 skill 被人工纠正累计 3 次后，会自动把人工话术回写到该 skill 的 `replySteps/fallback`。没有命中 skill 时，才会按“最新客户问题 + 人工回复”沉淀为新的 learned skill。开启“skill 自动回复”后，只有命中 `allowAutoReply: true` 且不是系统提示/提现成功/无需回复类消息时才会自动发送。

skill 命中卡片和 skill 列表都提供“优化”按钮。优化时会参考当前 skill 话术、客服输入框里的补充文字、草稿图片数量、最新客户消息和最近聊天记录，只优化文字，不处理或改写图片。优化候选里会出现“更新skill”按钮，点击后会把当前候选写回命中的 skill；如果输入框里有草稿图片，会先上传图片并把真实图片 URL 追加为 skill 图片步骤，旧图片步骤会保留并按 URL 去重。

右侧 `skill回复` 会把 skill 里的真实图片步骤显示为小缩略图，方便客服发送前确认图片内容；缩略图点击后同样走网页内图片预览浮层。

## 好友请求和会话列表

好友请求按钮会预取各来源的真实 `total`，角标最多显示 `99+`。由于真实接口在不传来源时会返回空结果，`全部来源` 不是调用空来源，而是分别请求 QQ号搜索、搜索微信号、微信卡片、群聊、扫描二维码后在前端合并、去重、排序。

会话列表按真实接口返回排序。点开会话会清本地未读角标并同步 `/ChatContent/ConsumeMessage(contactId, 0)`；右键“清空列表”后会调用真实清空接口，并短时间过滤刚清空的会话，避免自动刷新马上把列表弹回来。历史列表只展示 `/Contact/GetContactList(isHistory=true)` 的接口数据，不再混入 Web 本地缓存。

## 补丁和客户端升级审计

当前二开成果可以导出为 zip overlay 补丁，方便迁移到任意目录或新机器：

```powershell
cd C:\youchat-dev-web
npm run patch:export
```

客户端升级后先跑审计，再决定是否更新图标、接口或静态资源映射：

```powershell
npm run client:audit
npm run client:audit:compare
```

详细说明见：

```text
C:\youchat-dev-web\PATCH_GUIDE.md
```

## 抓取原 Electron 客户端请求

如果要确认原客户端某个按钮到底发了什么请求，可以启动本地转发抓包代理：

```powershell
cd C:\youchat-dev-web
.\start-client-capture-proxy.ps1 -ListenPort 18081 -Target "http://127.0.0.1:18080"
```

然后在原 Windows 客户端登录页把服务器改成：

```text
地址：127.0.0.1
端口：18081
```

代理会转发到 `-Target` 指定的真实悠聊服务，并把请求写入：

```text
C:\youchat-dev-web\logs\client-proxy-capture.ndjson
```

如果你的真实服务不是 `127.0.0.1:18080`，把 `-Target` 换成实际地址即可。

## 接 Docker 后端

页面登录区的服务器地址和端口可以直接填 Docker 服务地址，例如：

```text
服务器IP:端口
```

Web 会把接口统一代理到：

```text
http://服务器IP:端口/api
```

## 飞牛服务端排查记录

2026-06-08 出现过 Web 和官方 Windows 客户端同时拿不到联系人/聊天记录的问题。已确认根因是飞牛 MySQL 聊天分表排序规则混用：

- 旧表多为 `utf8mb4_general_ci`。
- 新表 `ChatContent_2026_06_08` 曾变成 `utf8mb4_unicode_ci`。
- 服务端 UNION 多张聊天表时报 `Illegal mix of collations for operation 'UNION'`。

已在飞牛上修复数据库默认排序规则和当天分表，并备份：

```text
/vol1/1000/Docker/youchat/docker-control/db-backups/pre-collation-fix-20260608-160844.sql.gz
/vol1/1000/Docker/youchat/docker-control/db-backups/post-collation-fix-20260608-161035.sql.gz
```

以后如果官方客户端和 Web 同时拿不到数据，先查飞牛服务端日志和 MySQL 分表排序规则，再判断是否需要改前端。

## 当前注意点

- 当前不会使用假数据，接口失败会显示真实失败信息并写入抓包日志。
- 右上角客户端设置和 Web AI 设置已经分离；不要把原生 `System/GetOptions` 里的 `aiOptions` 当成 Web AI 推荐配置。
- `挂起` 当前是 Web 本地自动刷新暂停，后续如果抓到原生服务端挂起接口，再替换这一层逻辑。
- “当前”会话必须使用 `/Contact/GetContactList` + 短客服 `accountId`。当前飞牛数据里 `Boom666` 对应短 id 是 `2`；不带 `accountId` 的同接口会返回全量联系人，不能当作当前列表数量。
- 聊天消息卡片已按真实类型区分：`contentType=5` 网页卡片、`contentType=6` 小程序、`contentType=8` 文件卡片。
- 小程序卡片会优先使用真实 `miniProTitle/miniProName/miniProImg/miniImgUrl`，没有真实封面时只显示“小程序类型占位图”，不伪造商品图或小程序截图。
- 知名网站链接卡片无真实缩略图时会用平台 logo 兜底，当前覆盖小红书、快手、1688、得物、淘宝、天猫、京东、拼多多、抖音、B站、微博、知乎、美团、饿了么；真实 `cardImg` 或 `og:image` 仍然优先。
- 原客户端主窗口源码显示点开会话会调用 `ConsumeMessage(contactId, 0)`，全部已读会调用 `ConsumeMessage(0, 0)`；Web 版已按这个逻辑同步。
- SignalR 的 WebSocket 帧如果是二进制格式，简易代理只能记录 upgrade；HTTP 接口请求会完整记录请求体和响应摘要。
- 快捷回复、聊天记录游标、订单和流水的字段如果仍有不一致，以真实客户端抓包和 `logs/api-capture.ndjson` 为准继续补齐。

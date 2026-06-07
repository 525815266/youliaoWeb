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

## 输入区快捷工具栏

聊天输入框上方已按原客户端补齐一排常用按钮：

- 表情：插入微信/悠聊表情短码到输入框。
- 发送指令：调用 `/ChatContent/SendSuperCmd`。
- 选择图片：调用 `/ChatContent/GetOssConfig` 获取 OSS 参数，优先浏览器直传，失败时走 `/local/oss-upload` 本地代理，再用 `/ChatContent/SendMsg(contentType=1/4)` 发出。
- 红包：调用 `/ChatContent/GetRedPacks` 读取模板，再调用 `/ChatContent/SendRedPacks`。
- 截图：使用浏览器屏幕捕获生成图片，再走图片发送链路。
- 星标：把当前输入/推荐话术写入 `data/reply-skills.json`，后续 skill 回复和 AI 推荐会使用。
- 转 AI：调用 `/Conversation/TransferToAI`。
- 粘贴图片：输入框支持直接粘贴/拖入图片，先进入待发送草稿；点击发送时文字走 `/ChatContent/SendMsg(contentType=0)`，图片逐张走上传 + `/ChatContent/SendMsg(contentType=1/4)`。
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
$env:YOUCHAT_API_BASE = "http://localhost:8080/api"
npm run dev
```

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

## AI 和 skill 回复

AI 设置在右上角齿轮里持久化到浏览器 `localStorage`，当前默认使用 OpenAI 兼容中转：

```text
https://sub2.sn55.cn/
```

页面默认开启 AI 推荐。它会在新客户消息进入后自动结合真实聊天上下文、快捷回复和本地 skill 生成 1 到 3 条横条候选；未采用时也会记录人工回复，用于后续学习。推荐条支持关闭、采用、发送和“换一换”，其中“换一换”会换一种语气和说法。

AI 请求统一走本地中转：

```text
POST /ai/chat/completions
```

`server.js` 会再转发到右上角设置的 OpenAI 兼容端点。内置预设：

- `sub2 中转`：`https://sub2.sn55.cn/`，默认模型 `gpt-5.4-mini`。
- `DeepSeek`：`https://api.deepseek.com`，默认模型 `deepseek-v4-flash`。DeepSeek 使用自己的 API Key，点击预设不会覆盖当前密钥。

右侧新增了 `skill回复` 标签。skill 数据不是假数据，保存在本地文件：

```text
C:\youchat-dev-web\data\reply-skills.json
```

这里可以维护关键词、回复步骤、图片步骤、是否允许自动回复、是否仅标记无需回复。开启“自动学习人工回复”后，如果没有采用推荐而是手动回复，页面会把“最新客户问题 + 人工回复”写入这个文件，默认只做推荐，不直接自动发送。开启“skill 自动回复”后，只有命中 `allowAutoReply: true` 且不是系统提示/提现成功/无需回复类消息时才会自动发送。

skill 命中卡片和 skill 列表都提供“优化”按钮。优化时会参考当前 skill 话术、客服输入框里的补充文字、草稿图片数量、最新客户消息和最近聊天记录，只优化文字，不处理或改写图片。

## 好友请求和会话列表

好友请求按钮会预取各来源的真实 `total`，角标最多显示 `99+`。由于真实接口在不传来源时会返回空结果，`全部来源` 不是调用空来源，而是分别请求 QQ号搜索、搜索微信号、微信卡片、群聊、扫描二维码后在前端合并、去重、排序。

会话列表按真实接口返回和本地清空归档状态排序。点开会话会清本地未读角标并同步 `/ChatContent/ConsumeMessage(contactId, 0)`；右键“清空列表”后会调用真实清空接口，并把当前列表归入本地历史缓存，避免自动刷新马上把列表弹回来。

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

## 当前注意点

- 当前不会使用假数据，接口失败会显示真实失败信息并写入抓包日志。
- 原客户端主窗口源码显示点开会话会调用 `ConsumeMessage(contactId, 0)`，全部已读会调用 `ConsumeMessage(0, 0)`；Web 版已按这个逻辑同步。
- SignalR 的 WebSocket 帧如果是二进制格式，简易代理只能记录 upgrade；HTTP 接口请求会完整记录请求体和响应摘要。
- 快捷回复、聊天记录游标、订单和流水的字段如果仍有不一致，以真实客户端抓包和 `logs/api-capture.ndjson` 为准继续补齐。

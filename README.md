# Youliao Web

一个基于真实悠聊接口的 Web 客服工作台二开项目。它不修改 Windows Electron 客户端安装包，通过悠聊服务端 API、SignalR、OSS 上传接口和本地持久化配置，提供 Web 会话、消息、订单、快捷回复、skill 回复和 AI 辅助客服能力。

## 功能

- 登录与配置探测：`/System/LogIn`、`/System/GetOptions`
- 会话列表、聊天记录、红点消费：`/Contact/GetContactList`、`/ChatContent/GetList`、`/local/signalr/consume`
- 消息发送、图片上传、红包、指令：`/ChatContent/SendMsg`、`/ChatContent/GetOssConfig`、`/local/oss-upload`
- 右侧工具栏：用户信息、聊天记录、订单、流水、快捷回复、skill 回复
- AI 推荐、文字优化、skill 优化：OpenAI 兼容接口代理 `/ai/chat/completions`
- 本地数据文件：`config/ai-providers.json`、`data/reply-skills.json`、`logs/api-capture.ndjson`
- Docker 部署和 GitHub Container Registry 镜像发布

## 安全说明

公开仓库和镜像不内置任何 API Key、数据库密码、skill 私有库或抓包日志。运行时请通过以下方式配置：

- `.env`：后端地址、端口、数据库修复连接串等
- `config/ai-providers.json`：AI 渠道、模型、API Key
- `data/reply-skills.json`：本地 skill 回复库

不要把真实的 `.env`、`config/ai-providers.json`、`data/reply-skills.json`、`logs/` 提交到公开仓库。

## 本地运行

```powershell
npm install
$env:PORT = "5177"
$env:YOUCHAT_API_BASE = "http://你的悠聊服务端:18080/api"
npm run dev
```

打开：

```text
http://localhost:5177
```

首次使用 AI 功能前，复制示例配置并填入自己的 Key：

```powershell
Copy-Item config\ai-providers.example.json config\ai-providers.json
Copy-Item data\reply-skills.example.json data\reply-skills.json
```

## Docker 本地构建

```bash
docker compose -p youliaoweb -f compose.yaml up -d --build
```

默认端口：

```text
http://localhost:5177
```

如果 Web 容器需要访问宿主机上的悠聊服务端，推荐：

```env
YOUCHAT_API_BASE=http://host.docker.internal:18080/api
```

Linux Docker 已在 compose 中配置：

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

## 使用 GHCR 镜像

本仓库的 GitHub Actions 会在推送到 `main` / `master` 或推送 `v*.*.*` tag 后构建镜像：

```text
ghcr.io/525815266/youliaoweb:latest
```

服务器目录示例：

```bash
mkdir -p ./config ./data ./logs
cp config/ai-providers.example.json ./config/ai-providers.json
cp data/reply-skills.example.json ./data/reply-skills.json
```

`.env` 示例：

```env
WEB_PORT=5177
YOUCHAT_WEB_IMAGE=ghcr.io/525815266/youliaoweb:latest
YOUCHAT_API_BASE=http://host.docker.internal:18080/api
YOUCHAT_DATABASE_GUARD_ENABLED=1
YOUCHAT_DATABASE_GUARD_INTERVAL_MS=300000
YOUCHAT_DATABASE_GUARD_MIN_HISTORY_COUNT=1000
```

启动：

```bash
docker compose -p youliaoweb -f compose.registry.yaml pull
docker compose -p youliaoweb -f compose.registry.yaml up -d
```

如果镜像是私有包，需要先登录 GHCR：

```bash
echo <GitHub Personal Access Token> | docker login ghcr.io -u <GitHub用户名> --password-stdin
```

## AI 配置

`config/ai-providers.example.json` 提供三个 OpenAI 兼容渠道模板：

- Sub2API
- DeepSeek
- CodeBuddy

复制为 `config/ai-providers.json` 后填入自己的 `baseUrl`、`apiKey`、`model`、`authType`。Web 右上角 AI 设置也会保存到浏览器本地存储，不同渠道互相独立。

## 数据库守护

如果你的悠聊服务端可能从 MySQL 异常切回 SQLite，可以开启数据库守护：

```env
YOUCHAT_DATABASE_GUARD_ENABLED=1
YOUCHAT_MYSQL_CONNECTION_STRING=Server=mysql;Port=3306;Database=你的库名;User ID=你的用户;Password=你的密码;CharSet=utf8mb4;SslMode=None;Allow User Variables=true;
```

连接串只应放在服务器 `.env` 或容器环境变量中，不要提交到仓库。

## 开发检查

```bash
npm run check
```

该命令会检查 `server.js`、`public/app.js`、`public/skill-training.js` 的语法。

## 目录

- `server.js`：静态服务、API 代理、SignalR 桥、AI 代理、本地数据接口
- `public/`：Web 工作台页面、样式、前端逻辑和原客户端字体/表情资源
- `config/ai-providers.example.json`：AI 渠道示例配置
- `data/reply-skills.example.json`：skill 回复库示例
- `compose.yaml`：源码构建部署
- `compose.registry.yaml`：GHCR 镜像部署
- `.github/workflows/docker-publish.yml`：自动构建并发布 Docker 镜像

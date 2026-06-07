# 悠聊 Web 二开补丁使用指南

本文档说明如何把当前 Web 二开成果打包成可迁移补丁，并导入到任意目标目录。它适合以下场景：

- 换一台机器继续开发。
- 把当前二开工程复制到新的客户端源码目录。
- 悠聊 Windows Electron 客户端升级后，重新审计资源和接口，再导出新版补丁。
- 后续 AI 或开发者接手时，快速恢复完整工作台、文档、skill 文件和本地工具。

## 目录

1. [补丁包是什么](#1-补丁包是什么)
2. [导出补丁](#2-导出补丁)
3. [导入补丁](#3-导入补丁)
4. [客户端更新后的审计流程](#4-客户端更新后的审计流程)
5. [审计报告对比](#5-审计报告对比)
6. [补丁包含的内容](#6-补丁包含的内容)
7. [安全与备份](#7-安全与备份)
8. [后续维护规则](#8-后续维护规则)

## 1. 补丁包是什么

补丁包是一个 zip 文件，里面包含：

- `payload/`：需要导入目标目录的项目文件。
- `youchat-devkit-manifest.json`：文件哈希、生成时间、原客户端关键资源指纹。
- `PATCH_README.md`：简短导入说明。

它不是 git diff。原因是目标目录可能不是 git 仓库，也可能是任意位置的客户端源码或新机器目录。zip overlay 更适合直接迁移。

## 2. 导出补丁

在当前项目目录运行：

```powershell
cd C:\youchat-dev-web
npm run patch:export
```

或直接运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\export-devkit-patch.ps1
```

默认输出目录：

```text
C:\youchat-dev-web\patches
```

补丁文件名类似：

```text
youchat-dev-web-patch-20260607-173000.zip
```

如果原客户端不在默认路径，可以指定：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\export-devkit-patch.ps1 `
  -ClientWwwroot "D:\YourClient\wwwroot"
```

## 3. 导入补丁

在任意已有项目或新目录中导入：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\youchat-dev-web\tools\import-devkit-patch.ps1 `
  -PatchZip C:\youchat-dev-web\patches\youchat-dev-web-patch-xxxx.zip `
  -TargetPath D:\target\youchat-dev-web
```

导入后建议检查：

```powershell
cd D:\target\youchat-dev-web
npm run check
npm run dev
```

服务启动后访问：

```text
http://localhost:5177
```

## 4. 客户端更新后的审计流程

悠聊 Electron 客户端更新后，先不要直接覆盖二开代码。先审计客户端资源和接口：

```powershell
cd C:\youchat-dev-web
npm run client:audit
```

或指定客户端目录：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\audit-client-update.ps1 `
  -ClientRoot "C:\Program Files\youchat-desktop"
```

审计报告输出到：

```text
C:\youchat-dev-web\reports
```

如果已经有两次审计报告，可以继续运行：

```powershell
npm run client:audit:compare
```

这个命令默认比较 `reports` 目录里最新的两份 `client-update-audit-*.json`。如果只有一份报告，也会生成一次自比较报告，确认脚本链路正常。

重点看：

- `iconfont.css` 是否变化。
- Braft CSS 是否变化。
- `emojiSource*.png` 是否变化。
- `YouChatService.xml` 是否变化。
- 扫描到的接口候选是否出现新增、删除或明显改名。

如果图标字体变化：

- 检查 `public/styles.css` 里的 glyph 映射。
- 重点检查 `bfi-emoji`、`bfi-code`、`bfi-media`、`bfi-camera`、`bfi-pushpin`、`bfi-replay`、`bfi-close`、`bfi-copy`、`bfi-search`、`bfi-drop-down`。

如果表情雪碧图变化：

- 检查红包格子是否仍然是当前 `background-position`。

如果接口变化：

- 先跑真实客户端抓包。
- 对照 `logs/api-capture.ndjson`、HAR、`YouChatService.xml` 和前端调用函数。
- 确认后更新 `PROJECT_MEMORY.md` 和 `AI_HANDOFF.md`。

审计和修复都确认后，再运行 `npm run patch:export` 生成新版补丁。

## 5. 审计报告对比

对比脚本路径：

```text
C:\youchat-dev-web\tools\compare-client-audits.ps1
```

默认用法：

```powershell
cd C:\youchat-dev-web
npm run client:audit:compare
```

手动指定两份报告：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\compare-client-audits.ps1 `
  -OldAudit .\reports\client-update-audit-old.json `
  -NewAudit .\reports\client-update-audit-new.json
```

输出文件：

```text
C:\youchat-dev-web\reports\client-audit-compare-*.json
C:\youchat-dev-web\reports\client-audit-compare-*.md
```

重点看：

- 关键文件 hash 是否变化：`iconfont.css`、Braft CSS、表情雪碧图、`YouChatService.xml`。
- 接口候选是否新增或删除。
- 如果资源变了，优先检查原生图标、红包雪碧图、字体 glyph 映射。
- 如果接口变了，优先检查真实抓包、HAR、`logs/api-capture.ndjson` 和前端 API 参数。

## 6. 补丁包含的内容

默认导出：

- `package.json`
- `server.js`
- `public/`
- `data/`
- `tools/`
- `README.md`
- `PRODUCT.md`
- `DESIGN.md`
- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`
- 启动与抓包脚本

默认不导出：

- `.chrome-*`
- `logs/`
- `patches/`
- `reports/`
- 截图检查文件

## 7. 安全与备份

导入脚本不会直接无备份覆盖目标文件。

如果目标文件已经存在且内容不同，会先备份到：

```text
<TargetPath>\.youchat-patch-backups\<timestamp>
```

导入报告：

```text
<TargetPath>\.youchat-patch-backups\<timestamp>\import-report.json
```

如果误导入，可以根据这个备份目录手动恢复对应文件。

## 8. 后续维护规则

每次做了有意义的修改，至少同步以下文件：

- `PROJECT_MEMORY.md`
- `AI_HANDOFF.md`

如果修改了补丁导出、导入或审计流程，还要同步：

- `PATCH_GUIDE.md`

每次准备交付给别人或迁移到新机器时，执行：

```powershell
npm run check
npm run client:audit
npm run client:audit:compare
npm run patch:export
```

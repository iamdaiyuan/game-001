# 环境与工具状态

**检查时间**：2026-11-01  
**机器**：macOS (darwin)

## 已就绪

| 工具 | 路径 / 版本 | 备注 |
|---|---|---|
| Git | 2.55.0 | `git@github.com:iamdaiyuan/game-001.git` 可 push |
| GitHub CLI | `gh` 已登录 `iamdaiyuan` | repo scope |
| Node | v26.9.0 | `packages/core` 使用 |
| npm | 11.19.1 | `npm install` 可用 |
| 微信开发者工具 | `/Applications/wechatwebdevtools.app` | CLI 在 `Contents/MacOS/cli` |
| Cocos Dashboard | `/Applications/CocosDashboard.app` v2.2.2 | 仅 Dashboard，未找到 Creator |

## 待确认 / 待安装

### 1. Cocos Creator 3.8.x

当前在以下位置未找到 `Cocos Creator.app`：

- `/Applications`
- `~/Applications`
- `~/Library/Application Support/Cocos*`
- `~/Downloads`（只有 `CocosDashboard-v2.2.2-mac-091515.dmg`）

**需要确认**：

1. 是否已在 Cocos Dashboard 里安装 3.8.x Creator？
2. 如果已安装，请提供实际路径，例如：
   ```bash
   mdfind "kMDItemFSName == 'CocosCreator.app'"
   ```
   或 Dashboard 里的“安装路径”。
3. 如果未安装，请在 Dashboard 里安装 **Cocos Creator 3.8.x**，并打开一次空项目。

### 2. 抖音开发者工具 + Skill

当前状态：

- 安装包已下载：
  `~/Downloads/抖音开发者工具-4.5.7-arm64.pkg.download/抖音开发者工具-4.5.7-arm64.pkg`
- `/Applications` 中未找到 `抖音开发者工具.app`
- 终端 `douyinide` 命令不存在

**需要执行**：

1. 双击 pkg 完成安装（需要 4.5.7+）。
2. 启动一次抖音开发者工具，完成登录。
3. 在终端运行：
   ```bash
   douyinide
   ```
   记录输出的 Skill 安装目录和版本号。
4. 把 Skill 目录加入编程助手配置，或导出 `douyinide-skill-<version>.zip` 导入。
5. 验证：
   ```bash
   douyinide check-ide-status -c <clientName>
   ```

> 官方文档：https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/dev-tools/developer-instrument/ai/ide-skill

## 已完成的仓库初始化

- 文档：`docs/01`–`05`
- 浏览器原型：`prototype/browser/`
- AI Orchestrator：`ai/orchestrator.md`
- 任务图：`ai/task-graph.yaml`
- Gate：`ai/gates.md`
- 任务包 schema：`ai/task-packet.schema.json`
- 核心逻辑：`packages/core/`
- CI：`.github/workflows/core.yml`

## 验证命令

```bash
cd game-001
npm run ci
```

当前结果：

- `tsc --noEmit` 通过
- 13 个单测通过
- 无头模拟：12 单 + 3 改造可通关（约 202 个动作）

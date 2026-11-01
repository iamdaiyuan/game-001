# 小城烟火 / game-001

微信 / 抖音小游戏《小城烟火》的 AI 原生开发仓库。

> 一句话：二合 + 模拟经营 + 老街改造。玩家回到家乡，把一条被遗忘的老街重新点亮。

## 当前状态

| 模块 | 状态 |
|---|---|
| 市场调研 / 策划书 | ✅ `docs/01-market-and-gdd.md` |
| 30 分钟 Demo 需求 | ✅ `docs/02-demo-spec.md` |
| 首月 20 条素材脚本 | ✅ `docs/03-ad-scripts.md` |
| AI 原生 24/7 排程 | ✅ `docs/04-ai-schedule.md` |
| 浏览器可玩原型 | ✅ `prototype/browser/` |
| AI Orchestrator / 任务图 | ✅ `ai/` |
| 纯逻辑核心 `@xcyh/core` | 🚧 进行中 |
| Cocos Creator 3.8 工程 | ⏳ 等待 Creator 安装确认 |
| 微信开发者工具 | ✅ CLI 可用 |
| 抖音开发者工具 + Skill | ⏳ 已下载 pkg，未安装 / `douyinide` 未找到 |

## 目录

```
docs/00-environment.md    # 本机工具/环境状态
docs/                     # 产品、市场、AI 排程文档
prototype/browser/        # 可玩浏览器原型（设计参照）
ai/                       # Orchestrator、任务图、Gate、任务包 schema
packages/core/            # 平台无关的游戏核心逻辑（TypeScript）
```

## 快速体验浏览器原型

```bash
cd prototype/browser
./start.sh
```

打开 `http://127.0.0.1:4173`。

## AI 原生开发

- 人类只定义 **Outcome / 约束 / 验收 / Gate**。
- Orchestrator 在运行时把 Outcome 拆成 **Task Packet**（含可执行验收）。
- Agents 并行生成代码、美术、音频、测试、构建。
- 每 4h 构建、每 12h 人类 digest、每 48h Gate。
- 详见 `docs/04-ai-schedule.md` 与 `ai/orchestrator.md`。

## 环境状态

- **Cocos Creator**：`/Applications` 目前只有 `CocosDashboard.app`，未找到 `Cocos Creator.app`。需要确认 Dashboard 中是否已安装 3.8.x Creator，或提供实际安装路径。
- **微信开发者工具**：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli` 可用。
- **抖音开发者工具**：`~/Downloads/抖音开发者工具-4.5.7-arm64.pkg.download/` 里有 pkg，但 `/Applications` 未找到 App，`douyinide` 命令不存在。需要安装 4.5.7+ 并在终端运行 `douyinide` 完成 Skill 安装/授权。

## 下一步

1. 确认 Cocos Creator 实际安装路径，创建 `apps/cocos/` 工程。
2. 安装抖音开发者工具 4.5.7+，运行 `douyinide` 获取 Skill 目录。
3. 完成 `@xcyh/core` 的核心逻辑与测试。
4. 用 Cocos 薄壳接 `@xcyh/core`，跑通 10 分钟二合切片。

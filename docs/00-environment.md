# 环境与工具状态

**检查时间**：2026-11-01  
**机器**：macOS (darwin)

## 已就绪

| 工具 | 路径 / 版本 | 状态 |
|---|---|---|
| Git | 2.55.0 | ✅ `git@github.com:iamdaiyuan/game-001.git` 可 push |
| GitHub CLI | `gh` 已登录 `iamdaiyuan` | ✅ repo scope |
| Node | v26.9.0 | ✅ |
| npm | 11.19.1 | ✅ |
| Cocos Creator | `/Applications/Cocos/Creator/3.8.8/CocosCreator.app` | ✅ 3.8.8 |
| 微信开发者工具 | `/Applications/wechatwebdevtools.app` | ✅ 已安装；CLI 服务端口需开启 |
| 抖音开发者工具 | `/Applications/抖音开发者工具.app` | ✅ 已安装 4.5.7+ |
| 抖音 Skill | `douyinide` @ `~/.local/bin/douyinide` | ✅ v0.0.1，IDE 在线 |

## 已验证

### Cocos → Web

```bash
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project "$PWD/apps/cocos" --build "platform=web-mobile;debug=true"
```

产物：`apps/cocos/build/web-mobile/`  
验证：Playwright 截图，标题 / HUD / 7×7 棋盘 / 3 按钮正常。

### Cocos → 抖音小游戏

```bash
--build "platform=bytedance-mini-game;debug=true"
```

产物：`apps/cocos/build/bytedance-mini-game/`

`douyinide` 验证链：

```bash
douyinide open-project-window -c OpenCode \
  --path /Users/daiyuan/Game/game-001/apps/cocos/build/bytedance-mini-game \
  --type microgame
douyinide simulator-compile -c OpenCode --window-id 4
douyinide miniapp-tap -c OpenCode --window-id 4 --x 77 --y 770
douyinide miniapp-get-console-messages -c OpenCode --window-id 4
douyinide miniapp-image-screenshot -c OpenCode --window-id 4 \
  --file-name /Users/daiyuan/Game/game-001/artifacts/cocos-douyin-tap.png
```

证据：

- 截图：`artifacts/cocos-douyin-tap.png`
- console：`[xcyh] producer old true old_1 59`
- 画面：能量 60 → 59，棋盘出现「破布 L1」，底部状态「获得 破布」

### Cocos → 微信小游戏

```bash
--build "platform=wechatgame;debug=true"
```

产物：`apps/cocos/build/wechatgame/`  
已配置 AppID：`wx7266351d42743bbe`（`apps/cocos/build-config.wechat.json`，构建后由 `scripts/patch-wechat-appid.mjs` 写入）。

当前阻塞：微信开发者工具 CLI 报“需要重新登录”。请先在开发者工具里扫码登录，或运行：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli login
```

登录后可用：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open \
  --project /Users/daiyuan/Game/game-001/apps/cocos/build/wechatgame
```

## Cocos CLI 已知行为

Cocos Creator 3.8.8 在 macOS 命令行构建成功后可能返回 exit code `36`，同时日志里有：

```
build Task (web-mobile) Finished in ...
```

判断成功以日志里的 `build Task (...) Finished` 和产物目录为准。

## 抖音 Skill 说明

- `douyinide` 已可用，`check-ide-status -c OpenCode` 返回 `ideOnline: true`。
- 小游戏只有 Canvas，没有页面元素；自动化必须用坐标 + 状态探针（console / 项目调试日志 / 截图）。
- 本项目已在 Cocos 脚本中输出 `[xcyh] producer ...` / `[xcyh] merge ...` 探针。

## 当前验证命令

```bash
cd game-001
npm run ci          # 13 个单测 + 无头模拟
npm run sync:core   # 同步 core 到 Cocos assets
```

## 相关文档

- `apps/cocos/README.md`：Cocos 场景、构建、验证
- `docs/04-ai-schedule.md`：AI 原生排程
- `ai/task-graph.yaml`：C0–C6 目标图

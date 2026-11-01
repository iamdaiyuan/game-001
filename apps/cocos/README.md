# Cocos Creator 3.8.8 工程

这是《小城烟火》的 Cocos 表现层。核心逻辑来自 `packages/core`，通过 `scripts/sync-core.mjs` 同步到 `assets/scripts/core/`。

## 打开

```bash
open -a "/Applications/Cocos/Creator/3.8.8/CocosCreator.app" --args --project "$PWD"
```

或在 Cocos Dashboard 里选择本目录。

## 场景

- `assets/main.scene`：最小 2D 场景（Canvas + Camera + MainMenu 节点）。
- `assets/scripts/MainMenu.ts`：场景根组件，用代码构建标题、HUD、7×7 棋盘和按钮。
- 场景里的 `MainMenu` 组件通过 `assets/scripts/MainMenu.ts.meta` 的 UUID 绑定。

> 场景来自一个最小 Cocos 3.8 2D 模板，避免手工拖拽；后续新增 UI 优先用代码/配置生成。

## 微信 AppID

`build-config.wechat.json` 保存微信小游戏 AppID：

```json
{ "appid": "wx7266351d42743bbe" }
```

`npm run build:wechat` 会在构建成功后调用 `scripts/patch-wechat-appid.mjs`，把 AppID 写入 `build/wechatgame/project.config.json`。

## 构建

```bash
# Web（用于快速验收）
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project "$PWD" --build "platform=web-mobile;debug=true"

# 微信小游戏
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project "$PWD" --build "platform=wechatgame;debug=true"

# 抖音小游戏
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project "$PWD" --build "platform=bytedance-mini-game;debug=true"
```

产物：

```
build/web-mobile/
build/wechatgame/
build/bytedance-mini-game/
```

## 已知 CLI 行为

Cocos Creator 3.8.8 在 macOS 上命令行构建成功后可能返回 exit code `36`，同时日志里有：

```
build Task (web-mobile) Finished in ...
```

判断成功以日志里的 `build Task (...) Finished` 和产物目录为准，不要只看 exit code。

## 验证

- Web：`python3 -m http.server 4174 -d build/web-mobile`，Playwright 截图。
- 微信：微信开发者工具导入 `build/wechatgame`（需在设置 → 安全设置里开启服务端口）。
- 抖音：`douyinide open-project-window -c OpenCode --path <abs>/build/bytedance-mini-game --type microgame`，再 `simulator-compile` + `miniapp-image-screenshot`。

## 当前切片

- 标题 / HUD / 7×7 空棋盘 / 3 个按钮。
- 点「旧物箱」产出物品，点两个同级物品合成。
- `window.__xcyh` / `globalThis.__xcyh` 暴露引擎与 `tap` / `merge` / `state`，供 Playwright 与抖音 `miniapp-execute-js` 做状态探针。

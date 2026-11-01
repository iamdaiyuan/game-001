# @xcyh/core

《小城烟火》平台无关核心逻辑。目标：

- 不依赖 Cocos / 微信 / 抖音 API。
- 可被 Cocos 表现层、浏览器原型、Node 测试、AI 模拟器共同调用。
- 所有规则都有自动化测试。

## 模块

| 文件 | 说明 |
|---|---|
| `src/types.ts` | 状态、物品、订单、改造类型 |
| `src/data.ts` | 18 个物品、12 个订单、3 个改造区域 |
| `src/engine.ts` | 二合、订单、经济、体力、改造、存档快照 |
| `tests/engine.test.ts` | 13 个单测 |
| `scripts/simulate.ts` | 无头自动通关模拟 |

## 命令

```bash
npm install
npm run typecheck
npm test
npm run simulate
```

## 设计原则

1. 逻辑与表现分离：Cocos 只负责输入、动画、音频、UI。
2. 所有状态变更走 `GameEngine` 方法，返回 `ActionResult`。
3. 不依赖 `Date.now()` / `Math.random()`：通过 `EngineOptions` 注入，便于测试和回放。
4. `snapshot()` 用于存档/回放/调试；构造器会深拷贝传入状态。
5. 新增内容优先加到 `data.ts`，用配置驱动，不写死在 UI。

## 当前覆盖

- 7×7 棋盘、2 个产出器、6 级物品链。
- 12 个订单、3 个槽位、逐步解锁。
- 铜钱/体力/钻石/零件、体力恢复。
- 3 个改造区域 × 3 方案、零件门槛、订单加成。
- 无头模拟：12 单 + 3 改造可通关（约 202 个动作）。

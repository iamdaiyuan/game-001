import { GameEngine } from '../src/engine.js';
import { ITEMS, RENOVATIONS } from '../src/data.js';

/**
 * 无头自动通关模拟。
 * 不是完美玩家，只用于验证核心循环可完成、无死锁、数值可通关。
 */

let now = 0;
const engine = new GameEngine({
  now: () => now,
  random: () => 0.1, // 固定掉 1 级，保证可重复
});

const milestones: Record<string, number> = {};
let actions = 0;
let stuck = 0;

function visibleOrders() {
  return engine.state.slots
    .map((id) => engine.orderById(id))
    .filter((order): order is NonNullable<typeof order> => !!order);
}

function completeReadyOrders(): boolean {
  for (let i = 0; i < engine.state.slots.length; i += 1) {
    const order = engine.orderById(engine.state.slots[i] ?? null);
    if (order && engine.canFulfill(order)) {
      const result = engine.completeOrder(i);
      if (result.ok) {
        actions += 1;
        if (!milestones.firstOrder) milestones.firstOrder = actions;
        if (engine.state.completedOrders === 12) milestones.allOrders = actions;
        return true;
      }
    }
  }
  return false;
}

function renovateIfPossible(): boolean {
  const zone = engine.currentZone();
  if (!zone) return false;
  const option = RENOVATIONS[zone].options[0];
  if (!option) return false;
  if (engine.state.coins >= option.cost && engine.state.parts >= (option.partsCost ?? 0)) {
    const result = engine.chooseRenovation(zone, option.id);
    if (result.ok) {
      actions += 1;
      if (!milestones.firstRenovation) milestones.firstRenovation = actions;
      if (engine.allRenovated()) milestones.allRenovations = actions;
      return true;
    }
  }
  return false;
}

function mergeGreedy(): boolean {
  const orders = visibleOrders();
  const requiredAtLevel = new Set<string>();
  for (const order of orders) {
    for (const req of order.requires) {
      const have = engine.totalItemCount(req.item);
      if (have <= req.count) requiredAtLevel.add(req.item);
    }
  }

  const groups = new Map<string, number[]>();
  engine.state.board.forEach((id, index) => {
    if (!id) return;
    const item = ITEMS[id];
    if (!item || item.chain === 'special') return;
    const arr = groups.get(id) ?? [];
    arr.push(index);
    groups.set(id, arr);
  });

  const candidates = [...groups.entries()]
    .filter(([id, arr]) => arr.length >= 2 && !requiredAtLevel.has(id))
    .sort((a, b) => {
      const ia = ITEMS[a[0]];
      const ib = ITEMS[b[0]];
      return (ia?.level ?? 0) - (ib?.level ?? 0);
    });

  for (const [, arr] of candidates) {
    const from = arr[0];
    const to = arr[1];
    if (from === undefined || to === undefined) continue;
    const result = engine.mergeCells(from, to);
    if (result.ok) {
      actions += 1;
      return true;
    }
  }
  return false;
}

function neededChain(): 'old' | 'food' {
  for (const order of visibleOrders()) {
    for (const req of order.requires) {
      const item = ITEMS[req.item];
      if (!item || item.chain === 'special') continue;
      if (engine.totalItemCount(req.item) < req.count) {
        return item.chain;
      }
    }
  }
  return 'old';
}

while (actions < 12000 && (engine.state.completedOrders < 12 || !engine.allRenovated())) {
  if (completeReadyOrders()) continue;
  if (renovateIfPossible()) continue;

  if (engine.state.energy < 2) {
    now += 5 * 60 * 1000;
    engine.tick(now);
    actions += 1;
    continue;
  }

  if (mergeGreedy()) continue;

  const chain = neededChain();
  const result = engine.tapProducer(chain);
  if (!result.ok) {
    if (result.event === 'board_full') {
      if (!mergeGreedy()) break;
    } else {
      stuck += 1;
      if (stuck > 50) break;
      now += 60 * 1000;
      engine.tick(now);
    }
  } else {
    actions += 1;
    stuck = 0;
  }
}

const result = {
  ok: engine.allRenovated() && engine.state.completedOrders >= 12,
  actions,
  simulatedMinutes: Math.round(actions * 0.1),
  coins: engine.state.coins,
  parts: engine.state.parts,
  completedOrders: engine.state.completedOrders,
  renovations: engine.state.renovations,
  merges: engine.state.totalMerges,
  milestones,
  boardItems: engine.state.board.filter(Boolean).length,
  energy: engine.state.energy,
};

console.log(JSON.stringify(result, null, 2));

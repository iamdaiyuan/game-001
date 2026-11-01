// 游戏状态、存档、经济辅助

import { ITEMS, ORDERS, RENOVATION_ORDER } from './data.js';

export const SAVE_KEY = 'xcyh_demo_v1';

export function initialState() {
  return {
    version: 1,
    scene: 'boot',
    started: false,
    prologueIndex: 0,
    coins: 0,
    energy: 60,
    maxEnergy: 100,
    diamonds: 0,
    parts: 0,
    reputation: 0,
    completedOrders: 0,
    orderQueueIndex: 0,
    slots: [null, null, null],
    unlockedSlots: 1,
    board: Array(49).fill(null),
    warehouse: { special_photo: 1, special_key: 1, special_cup: 1 },
    renovations: { door: null, counter: null, wall: null },
    tutorialStep: 0,
    tutorialDone: false,
    storySeen: {},
    firstChargeDone: false,
    adWatched: 0,
    ordersSinceEnergy: 0,
    totalCoinsEarned: 0,
    totalMerges: 0,
    discovered: [],
    limitedSign: false,
    startedAt: Date.now(),
    lastEnergyAt: Date.now(),
    audioMuted: false,
    analytics: [],
    survey: {},
    endingSeen: false,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const base = initialState();
    const merged = { ...base, ...parsed };
    // 兼容旧数组长度
    if (!Array.isArray(merged.board) || merged.board.length !== 49) {
      merged.board = Array(49).fill(null);
    }
    if (!merged.warehouse || typeof merged.warehouse !== 'object') {
      merged.warehouse = base.warehouse;
    }
    if (!merged.renovations || typeof merged.renovations !== 'object') {
      merged.renovations = base.renovations;
    }
    if (!Array.isArray(merged.analytics)) merged.analytics = [];
    return merged;
  } catch (err) {
    console.warn('[XCYH] load state failed', err);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[XCYH] save state failed', err);
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.warn('[XCYH] clear save failed', err);
  }
}

export function hasSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed.started;
  } catch (err) {
    return false;
  }
}

export function getItem(id) {
  return ITEMS[id] || null;
}

export function isSpecial(id) {
  return !!ITEMS[id] && ITEMS[id].chain === 'special';
}

export function countOnBoard(state, itemId) {
  return state.board.filter((id) => id === itemId).length;
}

export function countInWarehouse(state, itemId) {
  return state.warehouse[itemId] || 0;
}

export function countItem(state, itemId) {
  if (isSpecial(itemId)) return countInWarehouse(state, itemId);
  return countOnBoard(state, itemId);
}

export function totalItemCount(state, itemId) {
  return countOnBoard(state, itemId) + countInWarehouse(state, itemId);
}

export function findEmptyCell(state) {
  const empties = [];
  for (let i = 0; i < state.board.length; i += 1) {
    if (!state.board[i]) empties.push(i);
  }
  if (!empties.length) return -1;
  return empties[Math.floor(Math.random() * empties.length)];
}

export function addItemToBoard(state, itemId) {
  const idx = findEmptyCell(state);
  if (idx < 0) return -1;
  state.board[idx] = itemId;
  discover(state, itemId);
  return idx;
}

export function consumeItem(state, itemId, count) {
  let remaining = count;
  if (isSpecial(itemId)) {
    const have = state.warehouse[itemId] || 0;
    if (have < count) return false;
    state.warehouse[itemId] = have - count;
    return true;
  }
  for (let i = 0; i < state.board.length && remaining > 0; i += 1) {
    if (state.board[i] === itemId) {
      state.board[i] = null;
      remaining -= 1;
    }
  }
  return remaining === 0;
}

export function canFulfill(state, requires) {
  return requires.every((req) => totalItemCount(state, req.item) >= req.count);
}

export function missingText(state, requires) {
  const missing = [];
  for (const req of requires) {
    const have = totalItemCount(state, req.item);
    if (have < req.count) {
      const item = ITEMS[req.item];
      missing.push(`${item ? item.name : req.item} ${have}/${req.count}`);
    }
  }
  return missing.join('、');
}

export function discover(state, itemId) {
  if (!itemId) return;
  if (!state.discovered.includes(itemId)) state.discovered.push(itemId);
}

export function currentRenovationZone(state) {
  return RENOVATION_ORDER.find((zone) => !state.renovations[zone]) || null;
}

export function renovationCount(state) {
  return RENOVATION_ORDER.filter((zone) => !!state.renovations[zone]).length;
}

export function allRenovated(state) {
  return RENOVATION_ORDER.every((zone) => !!state.renovations[zone]);
}

export function nextOrder(state) {
  if (state.orderQueueIndex >= ORDERS.length) return null;
  return ORDERS[state.orderQueueIndex];
}

export function fillSlots(state) {
  for (let i = 0; i < state.unlockedSlots; i += 1) {
    if (state.slots[i] === null) {
      const order = nextOrder(state);
      if (!order) break;
      state.slots[i] = order.id;
      state.orderQueueIndex += 1;
    }
  }
}

export function orderById(id) {
  return ORDERS.find((order) => order.id === id) || null;
}

export function clampEnergy(state) {
  state.energy = Math.max(0, Math.min(state.maxEnergy, state.energy));
  return state.energy;
}

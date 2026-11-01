import {
  BOARD_SIZE, CHAINS, ITEMS, ORDERS, PRODUCERS, RENOVATIONS, RENOVATION_ORDER,
} from './data.js';
import type {
  ActionResult, EngineOptions, GameState, OrderDef, RenovationOption,
} from './types.js';

const MAX_ENERGY = 100;
const ENERGY_REGEN_MS = 45_000;
const MAX_SLOTS = 3;

export function createInitialState(now = Date.now()): GameState {
  return {
    coins: 0,
    energy: 60,
    maxEnergy: MAX_ENERGY,
    diamonds: 0,
    parts: 0,
    completedOrders: 0,
    orderQueueIndex: 0,
    slots: [null, null, null],
    unlockedSlots: 1,
    board: Array<string | null>(BOARD_SIZE).fill(null),
    warehouse: { special_photo: 1, special_key: 1, special_cup: 1 },
    renovations: { door: null, counter: null, wall: null },
    tutorialStep: 0,
    totalMerges: 0,
    totalCoinsEarned: 0,
    ordersSinceEnergy: 0,
    lastEnergyAt: now,
    storySeen: {},
    discovered: [],
    limitedSign: false,
  };
}

export class GameEngine {
  state: GameState;

  private readonly now: () => number;

  private readonly random: () => number;

  private readonly boardSize: number;

  constructor(options: EngineOptions = {}, state?: GameState) {
    this.now = options.now ?? Date.now;
    this.random = options.random ?? Math.random;
    this.boardSize = options.boardSize ?? BOARD_SIZE;
    this.state = state
      ? (JSON.parse(JSON.stringify(state)) as GameState)
      : createInitialState(this.now());
    if (this.state.board.length !== this.boardSize) {
      this.state.board = Array<string | null>(this.boardSize).fill(null);
    }
    this.fillSlots();
  }

  snapshot(): GameState {
    return JSON.parse(JSON.stringify(this.state)) as GameState;
  }

  getItem(itemId: string) {
    return ITEMS[itemId] ?? null;
  }

  countItem(itemId: string): number {
    const item = ITEMS[itemId];
    if (!item) return 0;
    if (item.chain === 'special') return this.state.warehouse[itemId] ?? 0;
    return this.state.board.filter((id) => id === itemId).length;
  }

  totalItemCount(itemId: string): number {
    return this.countItem(itemId);
  }

  private findEmptyCell(): number {
    const empties: number[] = [];
    this.state.board.forEach((id, index) => {
      if (!id) empties.push(index);
    });
    if (empties.length === 0) return -1;
    return empties[Math.floor(this.random() * empties.length)] ?? -1;
  }

  private discover(itemId: string): void {
    if (itemId && !this.state.discovered.includes(itemId)) {
      this.state.discovered.push(itemId);
    }
  }

  addItem(itemId: string): number {
    const index = this.findEmptyCell();
    if (index < 0) return -1;
    this.state.board[index] = itemId;
    this.discover(itemId);
    return index;
  }

  consumeItem(itemId: string, count: number): boolean {
    const item = ITEMS[itemId];
    if (!item) return false;
    if (item.chain === 'special') {
      const have = this.state.warehouse[itemId] ?? 0;
      if (have < count) return false;
      this.state.warehouse[itemId] = have - count;
      return true;
    }
    let remaining = count;
    for (let i = 0; i < this.state.board.length && remaining > 0; i += 1) {
      if (this.state.board[i] === itemId) {
        this.state.board[i] = null;
        remaining -= 1;
      }
    }
    return remaining === 0;
  }

  canFulfill(order: OrderDef): boolean {
    return order.requires.every((req) => this.totalItemCount(req.item) >= req.count);
  }

  missingText(order: OrderDef): string {
    const missing: string[] = [];
    for (const req of order.requires) {
      const have = this.totalItemCount(req.item);
      if (have < req.count) {
        const item = ITEMS[req.item];
        missing.push(`${item?.name ?? req.item} ${have}/${req.count}`);
      }
    }
    return missing.join('、');
  }

  nextOrder(): OrderDef | null {
    return ORDERS[this.state.orderQueueIndex] ?? null;
  }

  fillSlots(): void {
    for (let i = 0; i < this.state.unlockedSlots; i += 1) {
      if (this.state.slots[i] === null) {
        const order = this.nextOrder();
        if (!order) break;
        this.state.slots[i] = order.id;
        this.state.orderQueueIndex += 1;
      }
    }
  }

  orderById(orderId: number | null): OrderDef | null {
    if (orderId === null) return null;
    return ORDERS.find((order) => order.id === orderId) ?? null;
  }

  tapProducer(producerId: 'old' | 'food'): ActionResult {
    const producer = PRODUCERS[producerId];
    if (!producer) {
      return { ok: false, event: 'producer_unknown' };
    }
    if (this.state.completedOrders < producer.unlockAt) {
      return {
        ok: false,
        event: 'producer_locked',
        message: `再完成 ${producer.unlockAt - this.state.completedOrders} 单解锁`,
      };
    }
    if (this.state.energy < 1) {
      return { ok: false, event: 'energy_empty' };
    }
    if (this.findEmptyCell() < 0) {
      return { ok: false, event: 'board_full', message: '棋盘满了，先合成或整理' };
    }

    this.state.energy -= 1;
    const roll = this.random();
    let level = 1;
    if (roll > 0.95) level = 3;
    else if (roll > 0.8) level = 2;
    const itemId = CHAINS[producer.chain][level - 1];
    if (!itemId) return { ok: false, event: 'producer_invalid' };
    const index = this.addItem(itemId);
    if (index < 0) {
      this.state.energy += 1;
      return { ok: false, event: 'board_full', message: '棋盘满了，先合成或整理' };
    }
    return {
      ok: true,
      event: 'producer_tap',
      data: { producer: producerId, itemId, level, index, energy: this.state.energy },
    };
  }

  mergeCells(from: number, to: number): ActionResult {
    const fromId = this.state.board[from];
    const toId = this.state.board[to];
    if (!fromId || !toId) {
      return { ok: false, event: 'merge_empty' };
    }
    if (fromId !== toId) {
      return { ok: false, event: 'merge_mismatch', message: '要两个一样的才能合' };
    }
    const item = ITEMS[fromId];
    if (!item) return { ok: false, event: 'merge_unknown' };
    if (item.level >= 6) {
      return { ok: false, event: 'merge_max', message: '已经是最高级了' };
    }
    const nextId = CHAINS[item.chain as 'old' | 'food']?.[item.level];
    if (!nextId) {
      return { ok: false, event: 'merge_max', message: '已经是最高级了' };
    }
    this.state.board[from] = null;
    this.state.board[to] = nextId;
    this.state.totalMerges += 1;
    this.discover(nextId);
    return {
      ok: true,
      event: 'merge',
      data: { from, to, fromId, toId: nextId, level: item.level + 1 },
    };
  }

  orderBonus(): number {
    let bonus = 0;
    for (const zone of ['door', 'counter'] as const) {
      const chosen = this.state.renovations[zone];
      if (!chosen) continue;
      const option = RENOVATIONS[zone].options.find((opt) => opt.id === chosen);
      if (!option) continue;
      const match = option.bonus.match(/(\d+)%/);
      if (match?.[1]) bonus += Number(match[1]);
    }
    return bonus;
  }

  completeOrder(slotIndex: number): ActionResult {
    const orderId = this.state.slots[slotIndex];
    const order = this.orderById(orderId ?? null);
    if (!order) {
      return { ok: false, event: 'order_missing' };
    }
    if (!this.canFulfill(order)) {
      return {
        ok: false,
        event: 'order_incomplete',
        message: `还差：${this.missingText(order)}`,
      };
    }
    for (const req of order.requires) {
      if (!this.consumeItem(req.item, req.count)) {
        return { ok: false, event: 'order_consume_failed' };
      }
    }

    const bonus = this.orderBonus();
    const coins = Math.round(order.coins * (1 + bonus / 100));
    this.state.coins += coins;
    this.state.totalCoinsEarned += coins;
    this.state.parts += order.parts ?? 0;
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + (order.energy ?? 0));
    this.state.completedOrders += 1;
    this.state.ordersSinceEnergy += 1;
    if (this.state.ordersSinceEnergy >= 3) {
      this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 10);
      this.state.ordersSinceEnergy = 0;
    }
    if (order.bonusItem) {
      this.state.warehouse[order.bonusItem] = (this.state.warehouse[order.bonusItem] ?? 0) + 1;
      this.discover(order.bonusItem);
    }
    if (order.specialReward) {
      this.state.limitedSign = true;
      this.discover('special_sign');
    }

    this.state.unlockedSlots = Math.min(MAX_SLOTS, 1 + this.state.completedOrders);
    this.state.slots[slotIndex] = null;
    this.fillSlots();

    return {
      ok: true,
      event: 'order_complete',
      data: {
        orderId: order.id,
        coins,
        bonus,
        parts: order.parts ?? 0,
        energy: order.energy ?? 0,
        completedOrders: this.state.completedOrders,
      },
    };
  }

  currentZone(): 'door' | 'counter' | 'wall' | null {
    return RENOVATION_ORDER.find((zone) => !this.state.renovations[zone]) ?? null;
  }

  renovationCount(): number {
    return RENOVATION_ORDER.filter((zone) => !!this.state.renovations[zone]).length;
  }

  allRenovated(): boolean {
    return RENOVATION_ORDER.every((zone) => !!this.state.renovations[zone]);
  }

  chooseRenovation(zone: 'door' | 'counter' | 'wall', optionId: string): ActionResult {
    if (this.state.renovations[zone]) {
      return { ok: false, event: 'renovation_done', message: '这个区域已经改造过了' };
    }
    if (this.currentZone() !== zone) {
      return { ok: false, event: 'renovation_locked', message: '先完成前一个区域' };
    }
    const zoneData = RENOVATIONS[zone];
    const option: RenovationOption | undefined = zoneData.options.find((opt) => opt.id === optionId);
    if (!option) return { ok: false, event: 'renovation_unknown' };
    const partsCost = option.partsCost ?? 0;
    if (this.state.coins < option.cost || this.state.parts < partsCost) {
      const missing: string[] = [];
      if (this.state.coins < option.cost) missing.push(`${option.cost - this.state.coins} 铜钱`);
      if (this.state.parts < partsCost) missing.push(`${partsCost - this.state.parts} 零件`);
      return {
        ok: false,
        event: 'renovation_insufficient',
        message: `还差 ${missing.join('、')}`,
      };
    }

    this.state.coins -= option.cost;
    this.state.parts -= partsCost;
    this.state.renovations[zone] = option.id;
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 20);
    return {
      ok: true,
      event: 'renovation_choice',
      data: { zone, option: option.id, cost: option.cost, partsCost },
    };
  }

  tick(now = this.now()): ActionResult {
    if (this.state.energy >= this.state.maxEnergy) {
      this.state.lastEnergyAt = now;
      return { ok: true, event: 'tick', data: { energy: this.state.energy } };
    }
    const elapsed = now - this.state.lastEnergyAt;
    const regen = Math.floor(elapsed / ENERGY_REGEN_MS);
    if (regen <= 0) {
      return { ok: true, event: 'tick', data: { energy: this.state.energy } };
    }
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + regen);
    this.state.lastEnergyAt += regen * ENERGY_REGEN_MS;
    if (this.state.energy >= this.state.maxEnergy) {
      this.state.lastEnergyAt = now;
    }
    return { ok: true, event: 'tick', data: { regen, energy: this.state.energy } };
  }

  addDiamonds(amount: number): void {
    this.state.diamonds += amount;
  }

  spendDiamondsForEnergy(cost = 10, amount = 30): ActionResult {
    if (this.state.diamonds < cost) {
      return { ok: false, event: 'diamond_insufficient' };
    }
    this.state.diamonds -= cost;
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + amount);
    return { ok: true, event: 'diamond_energy', data: { cost, amount } };
  }
}

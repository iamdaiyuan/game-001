export type Chain = 'old' | 'food' | 'special';

export interface ItemDef {
  id: string;
  name: string;
  emoji: string;
  chain: Chain;
  level: number;
}

export interface ProducerDef {
  id: 'old' | 'food';
  name: string;
  chain: 'old' | 'food';
  unlockAt: number;
}

export interface OrderRequirement {
  item: string;
  count: number;
}

export interface OrderDef {
  id: number;
  title: string;
  requires: OrderRequirement[];
  coins: number;
  parts?: number;
  energy?: number;
  bonusItem?: string;
  specialReward?: string;
}

export interface RenovationOption {
  id: string;
  name: string;
  cost: number;
  partsCost?: number;
  bonus: string;
}

export interface RenovationZone {
  key: 'door' | 'counter' | 'wall';
  name: string;
  options: RenovationOption[];
}

export interface GameState {
  coins: number;
  energy: number;
  maxEnergy: number;
  diamonds: number;
  parts: number;
  completedOrders: number;
  orderQueueIndex: number;
  slots: Array<number | null>;
  unlockedSlots: number;
  board: Array<string | null>;
  warehouse: Record<string, number>;
  renovations: Record<'door' | 'counter' | 'wall', string | null>;
  tutorialStep: number;
  totalMerges: number;
  totalCoinsEarned: number;
  ordersSinceEnergy: number;
  lastEnergyAt: number;
  storySeen: Record<string, boolean>;
  discovered: string[];
  limitedSign: boolean;
}

export interface EngineOptions {
  now?: () => number;
  random?: () => number;
  boardSize?: number;
}

export interface ActionResult {
  ok: boolean;
  event: string;
  message?: string;
  data?: Record<string, unknown>;
}

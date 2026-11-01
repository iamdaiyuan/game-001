import type { Chain, ItemDef, OrderDef, ProducerDef, RenovationZone } from './types';

export const BOARD_SIZE = 49;

export const ITEMS: Record<string, ItemDef> = {
  old_1: { id: 'old_1', name: '破布', emoji: '🧵', chain: 'old', level: 1 },
  old_2: { id: 'old_2', name: '补丁', emoji: '🩹', chain: 'old', level: 2 },
  old_3: { id: 'old_3', name: '布料', emoji: '🧶', chain: 'old', level: 3 },
  old_4: { id: 'old_4', name: '成衣', emoji: '👕', chain: 'old', level: 4 },
  old_5: { id: 'old_5', name: '旗袍', emoji: '👘', chain: 'old', level: 5 },
  old_6: { id: 'old_6', name: '礼服', emoji: '👗', chain: 'old', level: 6 },

  food_1: { id: 'food_1', name: '面粉', emoji: '🌾', chain: 'food', level: 1 },
  food_2: { id: 'food_2', name: '面团', emoji: '🥟', chain: 'food', level: 2 },
  food_3: { id: 'food_3', name: '面条', emoji: '🍜', chain: 'food', level: 3 },
  food_4: { id: 'food_4', name: '牛肉面', emoji: '🍲', chain: 'food', level: 4 },
  food_5: { id: 'food_5', name: '招牌牛肉面', emoji: '🥘', chain: 'food', level: 5 },
  food_6: { id: 'food_6', name: '团圆宴', emoji: '🍱', chain: 'food', level: 6 },

  special_photo: { id: 'special_photo', name: '老照片', emoji: '🖼️', chain: 'special', level: 0 },
  special_key: { id: 'special_key', name: '铜钥匙', emoji: '🔑', chain: 'special', level: 0 },
  special_cup: { id: 'special_cup', name: '搪瓷杯', emoji: '☕', chain: 'special', level: 0 },
  special_ticket: { id: 'special_ticket', name: '粮票', emoji: '🎫', chain: 'special', level: 0 },
  special_radio: { id: 'special_radio', name: '收音机', emoji: '📻', chain: 'special', level: 0 },
  special_sign: { id: 'special_sign', name: '门牌', emoji: '🏷️', chain: 'special', level: 0 },
};

export const CHAINS: Record<'old' | 'food', string[]> = {
  old: ['old_1', 'old_2', 'old_3', 'old_4', 'old_5', 'old_6'],
  food: ['food_1', 'food_2', 'food_3', 'food_4', 'food_5', 'food_6'],
};

export const PRODUCERS: Record<'old' | 'food', ProducerDef> = {
  old: { id: 'old', name: '旧物箱', chain: 'old', unlockAt: 0 },
  food: { id: 'food', name: '食材篮', chain: 'food', unlockAt: 2 },
};

export const ORDERS: OrderDef[] = [
  { id: 1, title: '补一补门帘', requires: [{ item: 'old_2', count: 1 }], coins: 120 },
  { id: 2, title: '再补两块', requires: [{ item: 'old_2', count: 2 }], coins: 180 },
  { id: 3, title: '一张老照片', requires: [{ item: 'old_3', count: 1 }, { item: 'special_photo', count: 1 }], coins: 200, parts: 1, bonusItem: 'special_ticket' },
  { id: 4, title: '一碗热面', requires: [{ item: 'food_2', count: 2 }], coins: 180 },
  { id: 5, title: '两块布料', requires: [{ item: 'old_3', count: 2 }], coins: 260 },
  { id: 6, title: '一件成衣', requires: [{ item: 'old_4', count: 1 }], coins: 350, parts: 1, bonusItem: 'special_radio' },
  { id: 7, title: '三份面团', requires: [{ item: 'food_2', count: 3 }], coins: 300, energy: 30 },
  { id: 8, title: '两碗面条', requires: [{ item: 'food_3', count: 2 }], coins: 420 },
  { id: 9, title: '一衣一面', requires: [{ item: 'old_4', count: 1 }, { item: 'food_4', count: 1 }], coins: 600, parts: 2 },
  { id: 10, title: '一件旗袍', requires: [{ item: 'old_5', count: 1 }], coins: 900, parts: 3 },
  { id: 11, title: '三碗面', requires: [{ item: 'food_3', count: 3 }], coins: 700 },
  { id: 12, title: '招牌牛肉面', requires: [{ item: 'food_5', count: 1 }], coins: 1200, bonusItem: 'special_sign', specialReward: '限定门牌「外婆的店」' },
];

export const RENOVATIONS: Record<'door' | 'counter' | 'wall', RenovationZone> = {
  door: {
    key: 'door',
    name: '门头',
    options: [
      { id: 'door_warm', name: '暖灯木牌', cost: 300, bonus: '订单收益 +3%' },
      { id: 'door_cloth', name: '手写布幌', cost: 350, bonus: '订单收益 +5%' },
      { id: 'door_paint', name: '彩绘招牌', cost: 400, bonus: '订单收益 +8%' },
    ],
  },
  counter: {
    key: 'counter',
    name: '柜台',
    options: [
      { id: 'counter_glass', name: '玻璃柜台', cost: 600, bonus: '订单收益 +3%' },
      { id: 'counter_wood', name: '老木新漆', cost: 700, bonus: '订单收益 +5%' },
      { id: 'counter_lamp', name: '暖灯展柜', cost: 800, bonus: '订单收益 +8%' },
    ],
  },
  wall: {
    key: 'wall',
    name: '墙面',
    options: [
      { id: 'wall_photos', name: '老照片墙', cost: 900, partsCost: 3, bonus: '改造评分 +5' },
      { id: 'wall_paint', name: '手绘招牌墙', cost: 1000, partsCost: 3, bonus: '改造评分 +10' },
      { id: 'wall_green', name: '满墙绿植', cost: 1100, partsCost: 3, bonus: '改造评分 +15' },
    ],
  },
};

export const RENOVATION_ORDER: Array<'door' | 'counter' | 'wall'> = ['door', 'counter', 'wall'];

export function chainOf(itemId: string): Chain | null {
  return ITEMS[itemId]?.chain ?? null;
}

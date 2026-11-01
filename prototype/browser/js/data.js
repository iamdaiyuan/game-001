// 《小城烟火》30 分钟原型 Demo · 内容配置
// 所有数值均为 Demo 压缩版，正式版按主 GDD 缩放。

export const GAME_TITLE = '小城烟火';
export const GAME_SUB = '把一条老街重新点亮';
export const DEMO_VERSION = '0.1.0';

export const ITEMS = {
  // 旧物链
  old_1: { id: 'old_1', name: '破布', emoji: '🧵', chain: 'old', level: 1, desc: '外婆柜子底下翻出来的旧布头。' },
  old_2: { id: 'old_2', name: '补丁', emoji: '🩹', chain: 'old', level: 2, desc: '缝缝补补，还能用。' },
  old_3: { id: 'old_3', name: '布料', emoji: '🧶', chain: 'old', level: 3, desc: '一卷洗得发白的棉布。' },
  old_4: { id: 'old_4', name: '成衣', emoji: '👕', chain: 'old', level: 4, desc: '一件简单的中式上衣。' },
  old_5: { id: 'old_5', name: '旗袍', emoji: '👘', chain: 'old', level: 5, desc: '暗纹旗袍，外婆年轻时也有一件。' },
  old_6: { id: 'old_6', name: '礼服', emoji: '👗', chain: 'old', level: 6, desc: '带刺绣的礼服，像从旧照片里走出来的。' },

  // 食材链
  food_1: { id: 'food_1', name: '面粉', emoji: '🌾', chain: 'food', level: 1, desc: '街坊送来的新麦子磨的面。' },
  food_2: { id: 'food_2', name: '面团', emoji: '🥟', chain: 'food', level: 2, desc: '揉到位了，光溜溜的。' },
  food_3: { id: 'food_3', name: '面条', emoji: '🍜', chain: 'food', level: 3, desc: '手擀面，筋道。' },
  food_4: { id: 'food_4', name: '牛肉面', emoji: '🍲', chain: 'food', level: 4, desc: '一碗热乎的，汤头很足。' },
  food_5: { id: 'food_5', name: '招牌牛肉面', emoji: '🥘', chain: 'food', level: 5, desc: '加了一个溏心蛋，老周的手艺。' },
  food_6: { id: 'food_6', name: '团圆宴', emoji: '🍱', chain: 'food', level: 6, desc: '一桌菜，够整条街的人吃。' },

  // 特殊物品（不参与合成，进仓库）
  special_photo: { id: 'special_photo', name: '老照片', emoji: '🖼️', chain: 'special', level: 0, desc: '照片上，外婆站在店门口笑。' },
  special_key: { id: 'special_key', name: '铜钥匙', emoji: '🔑', chain: 'special', level: 0, desc: '门框上找到的，磨得发亮。' },
  special_cup: { id: 'special_cup', name: '搪瓷杯', emoji: '☕', chain: 'special', level: 0, desc: '杯口磕了一块，外婆一直没舍得扔。' },
  special_radio: { id: 'special_radio', name: '收音机', emoji: '📻', chain: 'special', level: 0, desc: '拧一拧，还能收到戏曲频道。' },
  special_sewing: { id: 'special_sewing', name: '缝纫机', emoji: '🪡', chain: 'special', level: 0, desc: '脚踩上去，还会发出吱呀声。' },
  special_clock: { id: 'special_clock', name: '旧挂钟', emoji: '🕰️', chain: 'special', level: 0, desc: '慢了十分钟，但一直没停。' },
  special_ticket: { id: 'special_ticket', name: '粮票', emoji: '🎫', chain: 'special', level: 0, desc: '夹在账本里，已经泛黄。' },
  special_marble: { id: 'special_marble', name: '玻璃弹珠', emoji: '🔮', chain: 'special', level: 0, desc: '小时候赢来的，舍不得丢。' },
  special_frog: { id: 'special_frog', name: '铁皮青蛙', emoji: '🐸', chain: 'special', level: 0, desc: '拧上发条，还能跳两下。' },
  special_book: { id: 'special_book', name: '小人书', emoji: '📚', chain: 'special', level: 0, desc: '封面掉了，故事还记得。' },
  special_kettle: { id: 'special_kettle', name: '暖水瓶', emoji: '🫖', chain: 'special', level: 0, desc: '红双喜的，外婆结婚时买的。' },
  special_fan: { id: 'special_fan', name: '蒲扇', emoji: '🪭', chain: 'special', level: 0, desc: '夏天的风，都是它扇出来的。' },
  special_lamp: { id: 'special_lamp', name: '煤油灯', emoji: '🪔', chain: 'special', level: 0, desc: '停电的晚上，就靠它。' },
  special_abacus: { id: 'special_abacus', name: '算盘', emoji: '🧮', chain: 'special', level: 0, desc: '外婆算账，从来不用计算器。' },
  special_phone: { id: 'special_phone', name: '老式电话', emoji: '☎️', chain: 'special', level: 0, desc: '拨号的时候，会发出长长的嘟声。' },
  special_tv: { id: 'special_tv', name: '黑白电视', emoji: '📺', chain: 'special', level: 0, desc: '全村第一台，晚上挤满人。' },
  special_bell: { id: 'special_bell', name: '自行车铃', emoji: '🔔', chain: 'special', level: 0, desc: '叮铃一声，整条巷子都听见。' },
  special_sign: { id: 'special_sign', name: '门牌', emoji: '🏷️', chain: 'special', level: 0, desc: '青溪街 17 号。' },
};

export const CHAINS = {
  old: ['old_1', 'old_2', 'old_3', 'old_4', 'old_5', 'old_6'],
  food: ['food_1', 'food_2', 'food_3', 'food_4', 'food_5', 'food_6'],
};

export const SPECIAL_IDS = Object.keys(ITEMS).filter((id) => ITEMS[id].chain === 'special');

export const PRODUCERS = {
  old: {
    id: 'old',
    name: '旧物箱',
    emoji: '📦',
    chain: 'old',
    unlockAt: 0,
    desc: '外婆留下的旧物，能用的都还在。',
  },
  food: {
    id: 'food',
    name: '食材篮',
    emoji: '🧺',
    chain: 'food',
    unlockAt: 2,
    desc: '街坊送来的食材，做点热乎的。',
  },
};

// 12 个订单，按顺序投放
export const ORDERS = [
  { id: 1, title: '补一补门帘', requires: [{ item: 'old_2', count: 1 }], coins: 120, parts: 0, energy: 0, desc: '先把门口那堆旧东西理一理。' },
  { id: 2, title: '再补两块', requires: [{ item: 'old_2', count: 2 }], coins: 180, parts: 0, energy: 0, desc: '外婆说，能用的都别扔。' },
  { id: 3, title: '一张老照片', requires: [{ item: 'old_3', count: 1 }, { item: 'special_photo', count: 1 }], coins: 200, parts: 1, energy: 0, bonusItem: 'special_ticket', desc: '把照片擦干净，挂在墙上。' },
  { id: 4, title: '一碗热面', requires: [{ item: 'food_2', count: 2 }], coins: 180, parts: 0, energy: 0, desc: '街坊说，想吃口热的。' },
  { id: 5, title: '两块布料', requires: [{ item: 'old_3', count: 2 }], coins: 260, parts: 0, energy: 0, desc: '柜台上的布，该换了。' },
  { id: 6, title: '一件成衣', requires: [{ item: 'old_4', count: 1 }], coins: 350, parts: 1, energy: 0, bonusItem: 'special_radio', desc: '挂在门口，招揽客人。' },
  { id: 7, title: '三份面团', requires: [{ item: 'food_2', count: 3 }], coins: 300, parts: 0, energy: 30, desc: '今晚有人要办席。' },
  { id: 8, title: '两碗面条', requires: [{ item: 'food_3', count: 2 }], coins: 420, parts: 0, energy: 0, desc: '老周的面，还是那个味。' },
  { id: 9, title: '一衣一面', requires: [{ item: 'old_4', count: 1 }, { item: 'food_4', count: 1 }], coins: 600, parts: 2, energy: 0, bonusItem: 'special_clock', desc: '客人说，吃完面顺便看看衣服。' },
  { id: 10, title: '一件旗袍', requires: [{ item: 'old_5', count: 1 }], coins: 900, parts: 3, energy: 0, bonusItem: 'special_sewing', desc: '外婆年轻时也有一件。' },
  { id: 11, title: '三碗面', requires: [{ item: 'food_3', count: 3 }], coins: 700, parts: 0, energy: 0, desc: '街坊们又来了。' },
  { id: 12, title: '招牌牛肉面', requires: [{ item: 'food_5', count: 1 }], coins: 1200, parts: 0, energy: 0, bonusItem: 'special_sign', desc: '开业第一天，得有一碗拿得出手的面。', specialReward: '限定门牌「外婆的店」' },
];

export const RENOVATIONS = {
  door: {
    key: 'door',
    name: '门头',
    emoji: '🏮',
    intro: '门头是店的脸。换一盏灯，路过的人就会慢下来。',
    options: [
      { id: 'door_warm', name: '暖灯木牌', emoji: '🏮', cost: 300, desc: '一盏暖灯，让整条巷子都亮一点。', bonus: '订单收益 +3%' },
      { id: 'door_cloth', name: '手写布幌', emoji: '🎏', cost: 350, desc: '外婆的字，风吹起来会动。', bonus: '订单收益 +5%' },
      { id: 'door_paint', name: '彩绘招牌', emoji: '🎨', cost: 400, desc: '把老街画在招牌上，谁路过都要看一眼。', bonus: '订单收益 +8%' },
    ],
  },
  counter: {
    key: 'counter',
    name: '柜台',
    emoji: '🪵',
    intro: '柜台是店的心。把光透进来，人才愿意多待一会儿。',
    options: [
      { id: 'counter_glass', name: '玻璃柜台', emoji: '🪟', cost: 600, desc: '擦得亮亮的，能看见里面的糖。', bonus: '订单收益 +3%' },
      { id: 'counter_wood', name: '老木新漆', emoji: '🪵', cost: 700, desc: '还是那张老柜台，只是重新上了漆。', bonus: '订单收益 +5%' },
      { id: 'counter_lamp', name: '暖灯展柜', emoji: '💡', cost: 800, desc: '灯一开，连糖果都变得贵气。', bonus: '订单收益 +8%' },
    ],
  },
  wall: {
    key: 'wall',
    name: '墙面',
    emoji: '🖼️',
    intro: '墙面是店的记忆。把旧照片挂起来，街坊就会停下来。',
    options: [
      { id: 'wall_photos', name: '老照片墙', emoji: '🖼️', cost: 900, partsCost: 3, desc: '每一张照片，都是一个故事。', bonus: '改造评分 +5' },
      { id: 'wall_paint', name: '手绘招牌墙', emoji: '🎨', cost: 1000, partsCost: 3, desc: '把整条老街画在墙上。', bonus: '改造评分 +10' },
      { id: 'wall_green', name: '满墙绿植', emoji: '🌿', cost: 1100, partsCost: 3, desc: '让店里先有了春天。', bonus: '改造评分 +15' },
    ],
  },
};

export const RENOVATION_ORDER = ['door', 'counter', 'wall'];

export const PROLOGUE = [
  {
    art: 'city',
    kicker: '凌晨 1:00',
    title: '她关掉了电脑',
    text: '大城市的灯还亮着，但她不想再等了。',
  },
  {
    art: 'train',
    kicker: '早上 7:20',
    title: '三个小时后',
    text: '高铁穿过田野，停在了一个很久没回的小站。',
  },
  {
    art: 'alley',
    kicker: '青溪老街',
    title: '外婆的杂货铺',
    text: '卷帘门半开着，门口的风铃还在。',
  },
  {
    art: 'letter',
    kicker: '门框上',
    title: '一封信',
    text: '“店你要是不要，就关了吧。要是还想开，钥匙在门框上。”',
  },
];

export const STORY = {
  p1: {
    id: 'p1',
    title: '回到青溪',
    lines: [
      { speaker: '外婆', avatar: '👵', text: '店你要是不要，就关了吧。' },
      { speaker: '外婆', avatar: '👵', text: '要是还想开，钥匙在门框上。' },
      { speaker: '你', avatar: '👩', text: '……我回来看看。' },
      { speaker: '旁白', avatar: '📖', text: '门开了，灰尘在光里飘。外婆的店，还在。' },
    ],
  },
  p2: {
    id: 'p2',
    title: '第一单',
    lines: [
      { speaker: '外婆', avatar: '👵', text: '你小时候就爱帮我理货。' },
      { speaker: '你', avatar: '👩', text: '那时候你总嫌我添乱。' },
      { speaker: '外婆', avatar: '👵', text: '现在不嫌了。' },
    ],
  },
  p3: {
    id: 'p3',
    title: '灯亮了',
    lines: [
      { speaker: '张婶', avatar: '🧕', text: '哟，这灯一亮，整条巷子都像活过来了。' },
      { speaker: '你', avatar: '👩', text: '还差得远呢。' },
      { speaker: '张婶', avatar: '🧕', text: '差什么差，有人气就行。' },
    ],
  },
  p4: {
    id: 'p4',
    title: '信的第二页',
    lines: [
      { speaker: '旁白', avatar: '📖', text: '信的背面，还有一行小字。' },
      { speaker: '外婆', avatar: '👵', text: '店不大，能装下几个人，就够了。' },
      { speaker: '你', avatar: '👩', text: '……你早说啊。' },
    ],
  },
  p5: {
    id: 'p5',
    title: '街坊来了',
    lines: [
      { speaker: '老周', avatar: '👨‍🍳', text: '听说你要把店重新开起来？' },
      { speaker: '小满', avatar: '👩‍🌾', text: '我把我家的花也搬来，摆在门口。' },
      { speaker: '张婶', avatar: '🧕', text: '缺什么就说，整条街都在呢。' },
      { speaker: '你', avatar: '👩', text: '……好。' },
    ],
  },
  p6: {
    id: 'p6',
    title: '开门',
    lines: [
      { speaker: '外婆', avatar: '👵', text: '店不大，能装下几个人，就够了。' },
      { speaker: '你', avatar: '👩', text: '那就……先开着吧。' },
      { speaker: '旁白', avatar: '📖', text: '灯亮了，街坊进了门。青溪街 17 号，重新开张。' },
    ],
  },
};

export const SURVEY = [
  { id: 'q1', text: '你愿意继续玩下去吗？' },
  { id: 'q2', text: '“改造前后”的瞬间，让你有成就感吗？' },
  { id: 'q3', text: '你会把这个游戏分享给朋友吗？' },
];

export const TUTORIAL = [
  null,
  { text: '点一下「旧物箱」，找两块破布。', target: '[data-producer="old"]' },
  { text: '把两块破布合在一起：点一块，再点另一块。', target: '.cell.has-item' },
  { text: '交掉第一单，铜钱就到手了。', target: '#orders .order-card' },
  { text: '攒够 300 铜钱，点「改造」把门头修好。', target: '#btn-renovate' },
  { text: '选一个门头方案，看看前后差别。', target: '.renovation-option' },
];

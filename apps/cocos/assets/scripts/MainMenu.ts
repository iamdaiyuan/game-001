import {
  _decorator, Component, Node, Label, UITransform, Graphics, Color,
  view, ResolutionPolicy, Vec3, Size, Widget, profiler, Camera,
} from 'cc';
import { GameEngine } from './core/engine';
import { ITEMS } from './core/data';

const { ccclass } = _decorator;

const INK = new Color(59, 43, 35, 255);
const MUTED = new Color(138, 119, 104, 255);
const ORANGE = new Color(224, 120, 60, 255);
const PAPER = new Color(247, 239, 227, 255);
const CARD = new Color(255, 250, 242, 255);
const LINE = new Color(59, 43, 35, 32);

const W = 720;
const H = 1560;
const CELL = 84;
const GAP = 6;

@ccclass('MainMenu')
export class MainMenu extends Component {
  private engine = new GameEngine({ now: () => Date.now(), random: () => Math.random() });
  private hud!: Label;
  private status!: Label;
  private cellLabels: Label[] = [];
  private cellNodes: Node[] = [];
  private selected: number | null = null;

  start(): void {
    view.setDesignResolutionSize(W, H, ResolutionPolicy.FIXED_WIDTH);
    profiler.hideStats();
    const camera = this.node.getComponentInChildren(Camera);
    if (camera) camera.clearColor = PAPER;
    this.build();
    this.refresh();
    {
      (globalThis as any).__xcyh = {
        engine: this.engine,
        tap: (id: 'old' | 'food') => { const r = this.engine.tapProducer(id); this.refresh(); return r; },
        merge: (a: number, b: number) => { const r = this.engine.mergeCells(a, b); this.refresh(); return r; },
        state: () => this.engine.state,
        refresh: () => this.refresh(),
      };
    }
  }

  private build(): void {
    const root = new Node('GameRoot');
    this.node.addChild(root);
    root.addComponent(UITransform).setContentSize(W, H);
    const widget = root.addComponent(Widget);
    widget.isAlignTop = true;
    widget.isAlignBottom = true;
    widget.isAlignLeft = true;
    widget.isAlignRight = true;
    widget.top = 0;
    widget.bottom = 0;
    widget.left = 0;
    widget.right = 0;

    this.drawRect(root, 0, 0, W, H, PAPER, null, 0);

    this.addLabel(root, '小城烟火', 0, 680, 48, INK, true);
    this.addLabel(root, '二合 · 经营 · 老街改造', 0, 620, 20, MUTED, false);

    this.hud = this.addLabel(root, '', 0, 550, 22, INK, true);
    this.status = this.addLabel(root, '点「旧物箱」开始', 0, -700, 18, MUTED, false);

    const board = new Node('Board');
    root.addChild(board);
    board.setPosition(new Vec3(0, 80, 0));
    const total = 7 * CELL + 6 * GAP;
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const index = row * 7 + col;
        const x = -total / 2 + CELL / 2 + col * (CELL + GAP);
        const y = total / 2 - CELL / 2 - row * (CELL + GAP);
        const cell = new Node(`Cell_${index}`);
        board.addChild(cell);
        cell.setPosition(new Vec3(x, y, 0));
        cell.addComponent(UITransform).setContentSize(CELL, CELL);
        this.drawRect(cell, 0, 0, CELL, CELL, CARD, LINE, 14);
        const label = this.addLabel(cell, '', 0, 0, 16, INK, true);
        label.node.getComponent(UITransform)!.setContentSize(CELL - 8, CELL - 8);
        label.overflow = Label.Overflow.SHRINK;
        label.lineHeight = 20;
        this.cellLabels.push(label);
        this.cellNodes.push(cell);
        cell.on(Node.EventType.TOUCH_END, () => this.onCell(index));
      }
    }

    this.addButton(root, '旧物箱', -220, -620, () => this.onProducer('old'));
    this.addButton(root, '食材篮', 0, -620, () => this.onProducer('food'));
    this.addButton(root, '整理', 220, -620, () => this.onOrganize());
  }

  private drawRect(
    parent: Node, x: number, y: number, w: number, h: number,
    fill: Color, stroke: Color | null, radius: number,
  ): Node {
    const node = new Node('Rect');
    parent.addChild(node);
    node.setPosition(new Vec3(x, y, 0));
    node.addComponent(UITransform).setContentSize(w, h);
    const g = node.addComponent(Graphics);
    g.fillColor = fill;
    if (radius > 0) g.roundRect(-w / 2, -h / 2, w, h, radius);
    else g.rect(-w / 2, -h / 2, w, h);
    g.fill();
    if (stroke) {
      g.strokeColor = stroke;
      g.lineWidth = 2;
      g.stroke();
    }
    return node;
  }

  private addLabel(
    parent: Node, text: string, x: number, y: number,
    size: number, color: Color, bold: boolean,
  ): Label {
    const node = new Node('Label');
    parent.addChild(node);
    node.setPosition(new Vec3(x, y, 0));
    node.addComponent(UITransform).setContentSize(W - 40, size * 2);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = size;
    label.lineHeight = size * 1.3;
    label.color = color;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.isBold = bold;
    label.overflow = Label.Overflow.SHRINK;
    return label;
  }

  private addButton(
    parent: Node, text: string, x: number, y: number, onClick: () => void,
  ): void {
    const node = new Node(`Btn_${text}`);
    parent.addChild(node);
    node.setPosition(new Vec3(x, y, 0));
    node.addComponent(UITransform).setContentSize(190, 88);
    this.drawRect(node, 0, 0, 190, 88, ORANGE, null, 22);
    this.addLabel(node, text, 0, 0, 22, new Color(255, 255, 255, 255), true);
    node.on(Node.EventType.TOUCH_END, onClick);
  }

  private onProducer(id: 'old' | 'food'): void {
    const result = this.engine.tapProducer(id);
    console.log('[xcyh] producer', id, result.ok, result.data?.itemId, this.engine.state.energy);
    if (!result.ok) this.status.string = result.message ?? '再试试';
    else this.status.string = `获得 ${ITEMS[String(result.data?.itemId)]?.name ?? '物品'}`;
    this.refresh();
  }

  private onOrganize(): void {
    // 简单整理：把非空格子前移，保持相对顺序
    const items = this.engine.state.board.filter(Boolean) as string[];
    this.engine.state.board = Array(this.engine.state.board.length).fill(null);
    items.forEach((id, i) => { this.engine.state.board[i] = id; });
    this.selected = null;
    this.status.string = '整理好了';
    this.refresh();
  }

  private onCell(index: number): void {
    const itemId = this.engine.state.board[index];
    if (!itemId) {
      this.selected = null;
      this.refresh();
      return;
    }
    if (this.selected === null) {
      this.selected = index;
      this.status.string = `选中 ${ITEMS[itemId]?.name ?? ''}`;
      this.refresh();
      return;
    }
    if (this.selected === index) {
      this.selected = null;
      this.refresh();
      return;
    }
    const result = this.engine.mergeCells(this.selected, index);
    console.log('[xcyh] merge', this.selected, index, result.ok, String(result.data?.toId ?? ''), this.engine.state.totalMerges);
    if (result.ok) {
      this.status.string = `合成 ${ITEMS[String(result.data?.toId)]?.name ?? ''}`;
      this.selected = null;
    } else {
      this.status.string = result.message ?? '合不了';
      this.selected = index;
    }
    this.refresh();
  }

  private refresh(): void {
    const s = this.engine.state;
    this.hud.string = `🪙 ${s.coins}    ⚡ ${s.energy}/${s.maxEnergy}    ⚙️ ${s.parts}`;
    for (let i = 0; i < this.cellLabels.length; i += 1) {
      const itemId = s.board[i];
      const item = itemId ? ITEMS[itemId] : null;
      const label = this.cellLabels[i]!;
      label.string = item ? `${item.name}\nL${item.level}` : '';
      label.color = item ? INK : MUTED;
      const cell = this.cellNodes[i]!;
      const g = cell.getComponent(Graphics);
      if (g) {
        g.clear();
        g.fillColor = this.selected === i ? new Color(255, 236, 214, 255) : CARD;
        g.roundRect(-CELL / 2, -CELL / 2, CELL, CELL, 14);
        g.fill();
        g.strokeColor = this.selected === i ? ORANGE : LINE;
        g.lineWidth = this.selected === i ? 4 : 2;
        g.stroke();
      }
    }
  }
}

// 基础 UI 渲染：HUD、棋盘、订单、店铺、引导、弹窗容器

import { ITEMS, ORDERS, RENOVATIONS, RENOVATION_ORDER, PROLOGUE, TUTORIAL } from './data.js';
import { canFulfill, totalItemCount, renovationCount, allRenovated } from './state.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function escapeHTML(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function showScreen(name) {
  $$('.screen').forEach((el) => el.classList.remove('active'));
  const target = $(`#screen-${name}`);
  if (target) target.classList.add('active');
  document.body.dataset.scene = name;
}

let modalCloseHandler = null;

export function openModal(html, { dismissible = true, className = '', onClose = null } = {}) {
  const root = $('#modal-root');
  modalCloseHandler = onClose;
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card ${className}">
        ${html}
      </div>
    </div>
  `;
  document.body.classList.add('modal-open');
  const backdrop = $('.modal-backdrop', root);
  if (dismissible) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
  root.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });
  return $('.modal-card', root);
}

export function closeModal() {
  $('#modal-root').innerHTML = '';
  document.body.classList.remove('modal-open');
  const handler = modalCloseHandler;
  modalCloseHandler = null;
  if (handler) handler();
}

let toastTimer = null;
export function toast(message, type = 'info') {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💬';
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  root.appendChild(el);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.classList.add('toast-out');
    window.setTimeout(() => el.remove(), 220);
  }, 2200);
}

export function formatNumber(n) {
  return new Intl.NumberFormat('zh-CN').format(Math.round(n));
}

export function renderHUD(state) {
  const coins = $('#hud-coins');
  const energy = $('#hud-energy');
  const diamonds = $('#hud-diamonds');
  const bar = $('#hud-energy-bar');
  if (coins) coins.textContent = formatNumber(state.coins);
  if (energy) energy.textContent = `${Math.floor(state.energy)}/${state.maxEnergy}`;
  if (diamonds) diamonds.textContent = formatNumber(state.diamonds);
  if (bar) bar.style.width = `${Math.min(100, (state.energy / state.maxEnergy) * 100)}%`;
}

export function shopSceneInner() {
  return `
    <div class="shop-sky"></div>
    <div class="shop-building">
      <div class="shop-roof"></div>
      <div class="shop-sign"><span>外婆的杂货铺</span></div>
      <div class="shop-lantern"></div>
      <div class="shop-lamp"></div>
      <div class="shop-window"><i></i><i></i><i></i></div>
      <div class="shop-door"></div>
      <div class="shop-counter"></div>
      <div class="shop-photos"><i></i><i></i><i></i></div>
      <div class="shop-plants"><i></i><i></i></div>
      <div class="shop-street"></div>
    </div>
  `;
}

export function shopSceneClasses(renovations = {}, extra = '', limited = false) {
  const classes = ['shop-scene'];
  if (renovations.door) classes.push('has-door');
  if (renovations.counter) classes.push('has-counter');
  if (renovations.wall) classes.push('has-wall');
  if (limited) classes.push('has-limited');
  if (extra) classes.push(extra);
  return classes.join(' ');
}

export function shopSceneHTML(renovations = {}, extra = '', limited = false) {
  return `<div class="${shopSceneClasses(renovations, extra, limited)}">${shopSceneInner()}</div>`;
}

export function renderShop(state) {
  const shop = $('#shop-scene');
  if (!shop) return;
  shop.className = shopSceneClasses(state.renovations, '', state.limitedSign);
  if (!shop.dataset.mounted) {
    shop.innerHTML = shopSceneInner();
    shop.dataset.mounted = '1';
  }
}

export function renderBoard(state, selectedIndex = null) {
  const board = $('#board');
  if (!board) return;
  let html = '';
  for (let i = 0; i < state.board.length; i += 1) {
    const itemId = state.board[i];
    if (!itemId) {
      html += `<button class="cell empty" data-index="${i}" aria-label="空格子"></button>`;
      continue;
    }
    const item = ITEMS[itemId];
    const selected = selectedIndex === i ? ' selected' : '';
    html += `
      <button class="cell has-item${selected}" data-index="${i}" data-item="${itemId}" title="${escapeHTML(item.name)}">
        <span class="item-emoji">${item.emoji}</span>
        <span class="item-name">${escapeHTML(item.name)}</span>
        <span class="item-level">L${item.level}</span>
      </button>
    `;
  }
  board.innerHTML = html;
}

export function renderOrders(state) {
  const wrap = $('#orders');
  if (!wrap) return;
  let html = '';
  for (let i = 0; i < 3; i += 1) {
    if (i >= state.unlockedSlots) {
      html += `
        <div class="order-card locked">
          <div class="order-top"><span class="order-index">订单 ${i + 1}</span><span class="order-lock">🔒</span></div>
          <div class="order-locked-text">完成上一单解锁</div>
        </div>
      `;
      continue;
    }
    const orderId = state.slots[i];
    if (!orderId) {
      html += `
        <div class="order-card empty">
          <div class="order-top"><span class="order-index">订单 ${i + 1}</span></div>
          <div class="order-locked-text">新订单准备中…</div>
        </div>
      `;
      continue;
    }
    const order = ORDERS.find((o) => o.id === orderId);
    if (!order) continue;
    const ready = canFulfill(state, order.requires);
    const reqs = order.requires.map((req) => {
      const item = ITEMS[req.item];
      const have = totalItemCount(state, req.item);
      const ok = have >= req.count;
      return `<span class="req ${ok ? 'ok' : 'miss'}" title="${escapeHTML(item.name)}">${item.emoji}${have}/${req.count}</span>`;
    }).join('');
    const rewardParts = [];
    rewardParts.push(`🪙 ${formatNumber(order.coins)}`);
    if (order.parts) rewardParts.push(`⚙️ ${order.parts}`);
    if (order.energy) rewardParts.push(`⚡ ${order.energy}`);
    html += `
      <button class="order-card ${ready ? 'ready' : ''}" data-slot="${i}" data-order="${order.id}">
        <div class="order-top">
          <span class="order-index">订单 ${i + 1}</span>
          <span class="order-status">${ready ? '可交付' : '还差'}</span>
        </div>
        <div class="order-title">${escapeHTML(order.title)}</div>
        <div class="order-req">${reqs}</div>
        <div class="order-reward">${rewardParts.join(' · ')}</div>
      </button>
    `;
  }
  wrap.innerHTML = html;
}

export function renderChapter(state) {
  const progress = $('#chapter-progress');
  const label = $('#chapter-label');
  if (progress) progress.textContent = `${renovationCount(state)}/3`;
  if (label) label.textContent = '第 1 章 · 外婆的杂货铺';
  const btn = $('#btn-renovate');
  if (btn) {
    if (allRenovated(state)) {
      btn.innerHTML = `<span class="action-emoji">🎉</span><span>开门营业</span>`;
      btn.classList.add('finish');
    } else {
      btn.innerHTML = `<span class="action-emoji">🔨</span><span>改造</span>`;
      btn.classList.remove('finish');
    }
  }
}

export function renderAll(state, selectedIndex = null) {
  renderHUD(state);
  renderShop(state);
  renderBoard(state, selectedIndex);
  renderOrders(state);
  renderChapter(state);
}

export function renderPrologue(index) {
  const data = PROLOGUE[Math.max(0, Math.min(PROLOGUE.length - 1, index))];
  const art = $('#prologue-art');
  if (art) art.className = `prologue-art art-${data.art}`;
  $('#prologue-kicker').textContent = data.kicker;
  $('#prologue-title').textContent = data.title;
  $('#prologue-text').textContent = data.text;
  const btn = $('#prologue-btn');
  btn.textContent = index >= PROLOGUE.length - 1 ? '我留下' : '继续';
  $$('.prologue-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
}

let pulseEl = null;
export function pulseTarget(selector) {
  if (pulseEl) pulseEl.classList.remove('pulse');
  pulseEl = null;
  if (!selector) return;
  const el = $(selector);
  if (!el) return;
  el.classList.add('pulse');
  pulseEl = el;
}

export function showTutorial(text, selector) {
  const banner = $('#tutorial-banner');
  if (!banner) return;
  document.body.classList.add('tutorial-open');
  banner.classList.remove('hidden');
  banner.innerHTML = `
    <span class="tip-emoji">💡</span>
    <span class="tip-text">${escapeHTML(text)}</span>
    <button class="tip-skip" id="tutorial-skip">跳过</button>
  `;
  $('#tutorial-skip').addEventListener('click', () => {
    hideTutorial();
    document.dispatchEvent(new CustomEvent('tutorial-skip'));
  });
  pulseTarget(selector);
}

export function hideTutorial() {
  const banner = $('#tutorial-banner');
  if (banner) banner.classList.add('hidden');
  document.body.classList.remove('tutorial-open');
  if (pulseEl) pulseEl.classList.remove('pulse');
  pulseEl = null;
}

export function tutorialContent(step) {
  return TUTORIAL[step] || null;
}

export function renovationOptionCard(option, state, zone) {
  const partsCost = option.partsCost || 0;
  const affordable = state.coins >= option.cost && state.parts >= partsCost;
  const price = `🪙 ${formatNumber(option.cost)}${partsCost ? ` · ⚙️ ${partsCost}` : ''}`;
  return `
    <button class="renovation-option ${affordable ? '' : 'disabled'}" data-option="${option.id}" data-zone="${zone}" ${affordable ? '' : 'disabled'}>
      <div class="reno-thumb reno-${option.id}"><span>${option.emoji}</span></div>
      <div class="reno-body">
        <div class="reno-head"><b>${escapeHTML(option.name)}</b><span>${price}</span></div>
        <div class="reno-desc">${escapeHTML(option.desc)}</div>
        <div class="reno-bonus">${escapeHTML(option.bonus)}</div>
      </div>
    </button>
  `;
}

export function renovationModalHTML(state) {
  const zoneKey = RENOVATION_ORDER.find((z) => !state.renovations[z]);
  if (!zoneKey) return '';
  const zone = RENOVATIONS[zoneKey];
  const minParts = Math.min(...zone.options.map((opt) => opt.partsCost || 0));
  const partsHint = minParts > 0 && state.parts < minParts
    ? `<p class="hint">零件不够：完成带 ⚙️ 奖励的订单可以获得零件。</p>`
    : '';
  return `
    <div class="modal-head">
      <div>
        <div class="modal-kicker">第 1 章 · 改造 ${renovationCount(state) + 1}/3</div>
        <h2>${zone.emoji} ${zone.name}</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <p class="modal-desc">${escapeHTML(zone.intro)}</p>
    ${partsHint}
    <div class="renovation-list">
      ${zone.options.map((opt) => renovationOptionCard(opt, state, zoneKey)).join('')}
    </div>
    <div class="modal-foot">
      <span>🪙 ${formatNumber(state.coins)} · ⚙️ ${formatNumber(state.parts)}</span>
      <span>已完成 ${renovationCount(state)}/3</span>
    </div>
  `;
}

export function beforeAfterHTML(previous, current, zoneKey, limited = false) {
  const zone = RENOVATIONS[zoneKey];
  const before = shopSceneClasses(previous, 'is-before', limited);
  const after = shopSceneClasses(current, 'is-after', limited);
  return `
    <div class="ba-wrap">
      <div class="ba-stage" id="ba-stage">
        <div class="ba-layer before"><div class="${before}">${shopSceneInner()}</div></div>
        <div class="ba-layer after" id="ba-after" style="clip-path: inset(0 0 0 50%)"><div class="${after}">${shopSceneInner()}</div></div>
        <div class="ba-divider" id="ba-divider" style="left:50%"></div>
        <span class="ba-label before-label">改造前</span>
        <span class="ba-label after-label">改造后</span>
      </div>
      <input class="ba-slider" id="ba-slider" type="range" min="0" max="100" value="50" aria-label="改造前后对比" />
      <div class="ba-caption">${zone.name}改造完成 · 拖动看看差别</div>
    </div>
  `;
}

export function bindBeforeAfter() {
  const slider = $('#ba-slider');
  const after = $('#ba-after');
  const divider = $('#ba-divider');
  if (!slider || !after || !divider) return;
  const update = () => {
    const v = Number(slider.value);
    after.style.clipPath = `inset(0 0 0 ${v}%)`;
    divider.style.left = `${v}%`;
  };
  slider.addEventListener('input', update);
  update();
}

export function showDialogue(lines, onDone) {
  const root = $('#dialogue-root');
  if (!root) return;
  document.body.classList.add('dialogue-open');
  let index = 0;
  let charIndex = 0;
  let timer = null;
  let typing = false;

  const render = () => {
    const line = lines[index];
    root.innerHTML = `
      <div class="dialogue-backdrop"></div>
      <div class="dialogue-box">
        <div class="dialogue-head">
          <div class="dialogue-avatar">${line.avatar || '💬'}</div>
          <div class="dialogue-name">${escapeHTML(line.speaker || '旁白')}</div>
          <button class="dialogue-skip" id="dialogue-skip">跳过</button>
        </div>
        <div class="dialogue-text" id="dialogue-text"></div>
        <div class="dialogue-next" id="dialogue-next">点击继续 ▸</div>
      </div>
    `;
    const textEl = $('#dialogue-text');
    const nextEl = $('#dialogue-next');
    typing = true;
    charIndex = 0;
    textEl.textContent = '';
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      charIndex += 1;
      textEl.textContent = line.text.slice(0, charIndex);
      if (charIndex >= line.text.length) {
        window.clearInterval(timer);
        typing = false;
        nextEl.textContent = index >= lines.length - 1 ? '点击结束 ▸' : '点击继续 ▸';
      }
    }, 28);

    const advance = () => {
      if (typing) {
        window.clearInterval(timer);
        textEl.textContent = line.text;
        typing = false;
        nextEl.textContent = index >= lines.length - 1 ? '点击结束 ▸' : '点击继续 ▸';
        return;
      }
      if (index < lines.length - 1) {
        index += 1;
        render();
      } else {
        closeDialogue();
        if (onDone) onDone();
      }
    };

    $('.dialogue-backdrop', root).addEventListener('click', advance);
    $('.dialogue-box', root).addEventListener('click', (e) => {
      if (e.target.id === 'dialogue-skip') return;
      advance();
    });
    $('#dialogue-skip').addEventListener('click', (e) => {
      e.stopPropagation();
      window.clearInterval(timer);
      closeDialogue();
      if (onDone) onDone();
    });
  };

  render();
}

export function closeDialogue() {
  const root = $('#dialogue-root');
  if (root) root.innerHTML = '';
  document.body.classList.remove('dialogue-open');
}

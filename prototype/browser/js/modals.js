// 弹窗：改造、前后对比、首充、广告、分享、背包、设置、结局

import { ITEMS, SPECIAL_IDS, RENOVATIONS, SURVEY, DEMO_VERSION } from './data.js';
import { renovationCount, allRenovated, totalItemCount } from './state.js';
import {
  $, $$, openModal, closeModal, toast, formatNumber, showScreen,
  renovationModalHTML, beforeAfterHTML, bindBeforeAfter, escapeHTML,
} from './ui.js';
import { createShareImage } from './share.js';

export function showRenovationModal(game) {
  if (allRenovated(game.state)) {
    toast('已经全部改造完成，点「开门营业」吧。', 'info');
    return;
  }
  const html = renovationModalHTML(game.state);
  if (!html) return;
  openModal(html, { className: 'renovation-modal' });
  $$('.renovation-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const zone = btn.dataset.zone;
      const option = btn.dataset.option;
      game.chooseRenovation(zone, option);
    });
  });
  game.log('renovation_open', { zone: game.currentZone() });
}

export function showBeforeAfter(game, previous, zoneKey, onClose) {
  const zone = RENOVATIONS[zoneKey];
  openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">改造完成</div>
        <h2>${zone.emoji} ${zone.name}，亮了。</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    ${beforeAfterHTML(previous, game.state.renovations, zoneKey, game.state.limitedSign)}
    <div class="ba-actions">
      <button class="btn ghost" id="ba-share">生成分享卡</button>
      <button class="btn primary" id="ba-continue">继续</button>
    </div>
  `, { className: 'ba-modal', dismissible: false, onClose });
  bindBeforeAfter();
  $('#ba-share').addEventListener('click', () => {
    game.log('share_card_generate', { from: 'renovation', zone: zoneKey });
    showShareModal(game, 'renovation', onClose);
  });
  $('#ba-continue').addEventListener('click', () => {
    closeModal();
  });
}

export function showShareModal(game, mode = 'renovation', onClose = null) {
  const dataUrl = createShareImage(game.state, mode);
  const text = mode === 'ending'
    ? '30 天，我把一条老街重新点亮。来《小城烟火》开一家属于你的店。'
    : '第 1 天，我把外婆的店门擦亮了。来《小城烟火》改造你的老街。';
  openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">分享卡</div>
        <h2>${mode === 'ending' ? '把这条街，发给朋友' : '这一下，值得截图'}</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <div class="share-frame">
      <img src="${dataUrl}" alt="改造前后分享卡" class="share-image" />
    </div>
    <p class="share-tip">长按图片可保存到相册；也可以点下面的按钮。</p>
    <div class="ba-actions">
      <button class="btn ghost" id="share-copy">复制文案</button>
      <button class="btn primary" id="share-save">保存图片</button>
    </div>
  `, { className: 'share-modal', onClose });
  $('#share-save').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `小城烟火-${mode === 'ending' ? '老街重开' : '改造前后'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('已保存分享卡', 'success');
    game.log('share_click', { from: mode, action: 'save' });
  });
  $('#share-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast('文案已复制', 'success');
    } catch (err) {
      toast('复制失败，请长按图片保存', 'error');
    }
    game.log('share_click', { from: mode, action: 'copy' });
  });
}

export function showChargeModal(game) {
  if (game.state.firstChargeDone) return;
  game.log('iap_click', { sku: 'first_charge_6' });
  const card = openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">限时一次</div>
        <h2>6 元首充</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <div class="charge-card">
      <div class="charge-emoji">🏮</div>
      <div class="charge-title">60 钻石 + 限定门牌「外婆的店」</div>
      <div class="charge-desc">门牌会挂在店门口，只有第一次开张才有。</div>
      <div class="charge-price"><span>¥</span>6<span class="charge-origin">¥12</span></div>
    </div>
    <div class="ba-actions">
      <button class="btn ghost" id="charge-cancel">先不要</button>
      <button class="btn primary" id="charge-buy">6 元开通</button>
    </div>
    <p class="fineprint">Demo 为模拟支付，不会产生真实扣款。</p>
  `, { className: 'charge-modal', dismissible: false });
  $('#charge-cancel').addEventListener('click', () => {
    closeModal();
    toast('没关系，先继续开店。', 'info');
  });
  $('#charge-buy').addEventListener('click', () => {
    const btn = $('#charge-buy');
    btn.disabled = true;
    btn.textContent = '支付中…';
    const closeBtn = $('.modal-card .icon-btn');
    if (closeBtn) closeBtn.style.display = 'none';
    const cancel = $('#charge-cancel');
    if (cancel) cancel.disabled = true;
    window.setTimeout(() => {
      game.completeFirstCharge();
      if (card) {
        card.innerHTML = `
          <div class="success-state">
            <div class="success-icon">🎉</div>
            <h2>开张礼到了</h2>
            <p>60 钻石和限定门牌已经放进店里。</p>
            <button class="btn primary" id="charge-done">收下</button>
          </div>
        `;
        $('#charge-done').addEventListener('click', closeModal);
      }
    }, 900);
  });
}

export function showAdModal(game) {
  game.log('ad_offer', { scene: 'energy' });
  let timer = null;
  openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">免费补给</div>
        <h2>看一段视频，+30 体力</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <div class="ad-box" id="ad-box">
      <div class="ad-placeholder">
        <div class="ad-play">▶</div>
        <div class="ad-copy">假装这是一段 3 秒的短视频</div>
      </div>
    </div>
    <div class="ba-actions">
      <button class="btn ghost" id="ad-cancel">稍后</button>
      <button class="btn primary" id="ad-start">开始观看</button>
    </div>
    ${game.state.diamonds >= 10 ? `<button class="text-btn ad-diamond" id="ad-diamond">用 10 💎 换 30 体力</button>` : ''}
    <p class="fineprint">Demo 为模拟广告，不会请求真实广告。</p>
  `, { className: 'ad-modal', dismissible: false, onClose: () => window.clearInterval(timer) });
  $('#ad-cancel').addEventListener('click', () => {
    window.clearInterval(timer);
    closeModal();
  });
  $('#ad-diamond')?.addEventListener('click', () => {
    window.clearInterval(timer);
    game.spendDiamondsForEnergy();
    closeModal();
  });
  $('#ad-start').addEventListener('click', () => {
    const box = $('#ad-box');
    const start = $('#ad-start');
    const cancel = $('#ad-cancel');
    start.disabled = true;
    start.textContent = '播放中…';
    cancel.disabled = true;
    const closeBtn = $('.modal-card .icon-btn');
    if (closeBtn) closeBtn.style.display = 'none';
    let left = 3;
    box.innerHTML = `
      <div class="ad-playing">
        <div class="ad-progress"><i id="ad-progress-bar"></i></div>
        <div class="ad-countdown" id="ad-countdown">3s</div>
        <div class="ad-copy">看完了，体力马上到账</div>
      </div>
    `;
    timer = window.setInterval(() => {
      left -= 1;
      const bar = $('#ad-progress-bar');
      const cd = $('#ad-countdown');
      if (bar) bar.style.width = `${((3 - left) / 3) * 100}%`;
      if (cd) cd.textContent = `${Math.max(0, left)}s`;
      if (left <= 0) {
        window.clearInterval(timer);
        game.grantAdEnergy();
        box.innerHTML = `
          <div class="ad-done">
            <div class="success-icon">⚡</div>
            <h3>体力 +30</h3>
            <p>可以继续合成了。</p>
          </div>
        `;
        const actions = $('.ba-actions');
        if (actions) {
          actions.innerHTML = `<button class="btn primary" id="ad-done-btn">继续开店</button>`;
          $('#ad-done-btn').addEventListener('click', closeModal);
        }
      }
    }, 1000);
  });
}

export function showBagModal(game) {
  const state = game.state;
  const ownedSpecials = SPECIAL_IDS.filter((id) => (state.warehouse[id] || 0) > 0);
  const renderSpecial = () => {
    if (!ownedSpecials.length) {
      return `<div class="empty-state">仓库还是空的。去完成订单，会找到更多旧物。</div>`;
    }
    return `<div class="bag-grid">
      ${SPECIAL_IDS.map((id) => {
        const item = ITEMS[id];
        const count = state.warehouse[id] || 0;
        return `<div class="bag-item ${count ? '' : 'unknown'}">
          <span class="bag-emoji">${count ? item.emoji : '❔'}</span>
          <span class="bag-name">${count ? item.name : '未发现'}</span>
          <span class="bag-count">${count ? `×${count}` : ''}</span>
        </div>`;
      }).join('')}
    </div>`;
  };
  const renderCollection = () => {
    return `<div class="collection-grid">
      ${Object.values(ITEMS).map((item) => {
        const known = state.discovered.includes(item.id) || totalItemCount(state, item.id) > 0;
        return `<div class="collection-item ${known ? '' : 'unknown'}">
          <span>${known ? item.emoji : '❔'}</span>
          <small>${known ? item.name : '未发现'}</small>
        </div>`;
      }).join('')}
    </div>`;
  };
  openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">背包</div>
        <h2>旧物与图鉴</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <div class="tabs">
      <button class="tab active" data-tab="special">特殊物品</button>
      <button class="tab" data-tab="collection">图鉴</button>
    </div>
    <div id="bag-content">${renderSpecial()}</div>
  `, { className: 'bag-modal' });
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      $('#bag-content').innerHTML = tab.dataset.tab === 'special' ? renderSpecial() : renderCollection();
    });
  });
}

export function showSettingsModal(game) {
  const state = game.state;
  const debugHTML = game.debug ? `
    <div class="settings-section">
      <h3>调试工具</h3>
      <div class="debug-grid">
        <button class="btn small" data-debug="coins">+1000 铜钱</button>
        <button class="btn small" data-debug="energy">+50 体力</button>
        <button class="btn small" data-debug="order">完成首单</button>
        <button class="btn small" data-debug="renovation">+5000 铜钱</button>
        <button class="btn small" data-debug="charge">首充弹窗</button>
        <button class="btn small" data-debug="ad">广告弹窗</button>
      </div>
    </div>
  ` : '';
  openModal(`
    <div class="modal-head">
      <div>
        <div class="modal-kicker">设置</div>
        <h2>小店后台</h2>
      </div>
      <button class="icon-btn" data-close aria-label="关闭">✕</button>
    </div>
    <div class="settings-section">
      <label class="setting-row">
        <span>音效与音乐</span>
        <input type="checkbox" id="audio-toggle" ${state.audioMuted ? '' : 'checked'} />
      </label>
      <div class="setting-row static">
        <span>事件记录</span>
        <span>${state.analytics.length} 条</span>
      </div>
      <div class="setting-row static">
        <span>版本</span>
        <span>Demo ${DEMO_VERSION}</span>
      </div>
    </div>
    <div class="settings-section">
      <h3>数据</h3>
      <div class="debug-grid">
        <button class="btn small" id="export-data">导出 JSON</button>
        <button class="btn small danger" id="reset-game">重新开始</button>
      </div>
    </div>
    ${debugHTML}
    <p class="fineprint">Demo 数据只保存在本机浏览器。清除浏览器数据会丢失进度。</p>
  `, { className: 'settings-modal' });
  $('#audio-toggle').addEventListener('change', (e) => {
    game.setMuted(!e.target.checked);
  });
  $('#export-data').addEventListener('click', () => game.exportData());
  $('#reset-game').addEventListener('click', () => {
    if (window.confirm('确定要重新开始吗？当前进度会清空。')) game.resetGame();
  });
  $$('[data-debug]').forEach((btn) => {
    btn.addEventListener('click', () => game.debugAction(btn.dataset.debug));
  });
}

export function showEnding(game) {
  const state = game.state;
  state.endingSeen = true;
  showScreen('ending');
  const stats = $('#ending-stats');
  if (stats) {
    stats.innerHTML = `
      <div class="stat"><b>${state.completedOrders}</b><span>完成订单</span></div>
      <div class="stat"><b>${renovationCount(state)}/3</b><span>改造区域</span></div>
      <div class="stat"><b>${formatNumber(state.totalCoinsEarned)}</b><span>赚到铜钱</span></div>
      <div class="stat"><b>${state.totalMerges}</b><span>合成次数</span></div>
    `;
  }
  const survey = $('#ending-survey');
  if (survey) {
    survey.innerHTML = `
      <h3>最后，帮我们试玩 3 个问题</h3>
      ${SURVEY.map((q) => `
        <div class="survey-q" data-q="${q.id}">
          <div class="survey-text">${escapeHTML(q.text)}</div>
          <div class="survey-stars">
            ${[1, 2, 3, 4, 5].map((v) => `<button data-q="${q.id}" data-v="${v}">${v}</button>`).join('')}
          </div>
        </div>
      `).join('')}
      <button class="btn primary" id="survey-submit" disabled>提交</button>
      <p class="fineprint">1 = 完全不同意，5 = 非常同意</p>
    `;
    $$('.survey-stars button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        const v = Number(btn.dataset.v);
        state.survey[q] = v;
        $$(`.survey-q[data-q="${q}"] .survey-stars button`).forEach((b) => {
          b.classList.toggle('active', Number(b.dataset.v) === v);
        });
        const done = SURVEY.every((item) => state.survey[item.id]);
        $('#survey-submit').disabled = !done;
        game.save();
      });
    });
    $('#survey-submit').addEventListener('click', () => {
      game.log('survey', { answers: state.survey });
      game.save();
      toast('谢谢，你的反馈已经记下了。', 'success');
      $('#survey-submit').textContent = '已提交';
      $('#survey-submit').disabled = true;
    });
  }
  $('#ending-share').onclick = () => {
    game.log('share_card_generate', { from: 'ending' });
    showShareModal(game, 'ending');
  };
  $('#ending-again').onclick = () => {
    if (window.confirm('再开一次店？当前进度会清空。')) game.resetGame();
  };
  game.log('ending_view', { orders: state.completedOrders, renovations: renovationCount(state) });
}

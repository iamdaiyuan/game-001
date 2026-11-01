// 生成“改造前后”分享卡（Canvas，无外部图片）

import { GAME_TITLE, GAME_SUB } from './data.js';

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawShop(ctx, x, y, w, h, renovations) {
  // 天空
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#cfe0df');
  sky.addColorStop(0.65, '#efe0c9');
  sky.addColorStop(1, '#d9c3a6');
  ctx.fillStyle = sky;
  roundRect(ctx, x, y, w, h, 26);
  ctx.fill();

  // 太阳
  ctx.fillStyle = 'rgba(255, 226, 164, .75)';
  ctx.beginPath();
  ctx.arc(x + w * 0.78, y + h * 0.18, w * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const bx = x + w * 0.1;
  const by = y + h * 0.2;
  const bw = w * 0.8;
  const bh = h * 0.76;

  // 房子
  ctx.fillStyle = renovations.door ? '#e0c9a8' : '#cdb897';
  roundRect(ctx, bx, by, bw, bh, 14);
  ctx.fill();

  // 屋顶
  ctx.fillStyle = '#6e4a35';
  roundRect(ctx, bx - 14, by - 18, bw + 28, 26, 8);
  ctx.fill();

  // 招牌
  ctx.fillStyle = renovations.door ? '#8a3f2a' : '#6e4a35';
  roundRect(ctx, bx + bw * 0.26, by + 16, bw * 0.48, 56, 6);
  ctx.fill();
  ctx.fillStyle = '#f3dfc0';
  ctx.font = 'bold 24px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('外婆的杂货铺', bx + bw * 0.5, by + 51);

  // 灯
  const lampX = bx + bw * 0.14;
  const lampY = by + 92;
  if (renovations.door) {
    const glow = ctx.createRadialGradient(lampX, lampY, 4, lampX, lampY, 60);
    glow.addColorStop(0, 'rgba(255, 214, 120, .95)');
    glow.addColorStop(1, 'rgba(255, 214, 120, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 60, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = renovations.door ? '#ffd77a' : '#8a7768';
  ctx.beginPath();
  ctx.arc(lampX, lampY, 12, 0, Math.PI * 2);
  ctx.fill();

  // 窗
  ctx.fillStyle = renovations.counter ? '#8a6a4f' : '#5b4a3f';
  roundRect(ctx, bx + bw * 0.12, by + 122, bw * 0.36, bh * 0.34, 6);
  ctx.fill();
  ctx.strokeStyle = '#a98463';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.14, by + 142 + i * 28);
    ctx.lineTo(bx + bw * 0.46, by + 142 + i * 28);
    ctx.stroke();
  }

  // 门
  ctx.fillStyle = renovations.door ? '#c98a4a' : '#6b4a35';
  roundRect(ctx, bx + bw * 0.58, by + 128, bw * 0.2, bh * 0.45, 6);
  ctx.fill();
  ctx.strokeStyle = '#8a6a4f';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 柜台
  ctx.fillStyle = renovations.counter ? '#d8b08a' : '#8a5a3b';
  roundRect(ctx, bx + bw * 0.06, by + bh * 0.78, bw * 0.88, bh * 0.12, 8);
  ctx.fill();
  if (renovations.counter) {
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    roundRect(ctx, bx + bw * 0.08, by + bh * 0.765, bw * 0.84, 12, 6);
    ctx.fill();
  }

  // 墙面照片
  if (renovations.wall) {
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = '#f3dfc0';
      roundRect(ctx, bx + bw * 0.58 + i * 42, by + 90, 32, 32, 4);
      ctx.fill();
      ctx.strokeStyle = '#6e4a35';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  // 绿植
  if (renovations.wall) {
    for (let i = 0; i < 2; i += 1) {
      ctx.fillStyle = '#6f8b63';
      ctx.beginPath();
      ctx.ellipse(bx + bw * 0.12 + i * 26, by + bh * 0.73, 13, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 街道
  ctx.fillStyle = '#b99d7e';
  roundRect(ctx, x, y + h * 0.92, w, h * 0.08, 0);
  ctx.fill();
}

export function createShareImage(state, mode = 'renovation') {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  // 背景
  const bg = ctx.createLinearGradient(0, 0, 1080, 1440);
  bg.addColorStop(0, '#fdf6ea');
  bg.addColorStop(0.55, '#f3e3ce');
  bg.addColorStop(1, '#e6cdb1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1440);

  // 装饰圆
  ctx.fillStyle = 'rgba(224, 120, 60, .08)';
  ctx.beginPath();
  ctx.arc(880, 160, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(111, 139, 99, .08)';
  ctx.beginPath();
  ctx.arc(120, 1180, 220, 0, Math.PI * 2);
  ctx.fill();

  // 顶部品牌
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8a7768';
  ctx.font = '600 28px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.fillText(GAME_TITLE, 80, 100);
  ctx.fillStyle = '#b7a08b';
  ctx.font = '400 22px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.fillText(GAME_SUB, 80, 140);

  // 标题
  ctx.fillStyle = '#3b2b23';
  ctx.font = '800 64px "PingFang SC", "Noto Sans SC", sans-serif';
  const title = mode === 'ending'
    ? ['30 天，', '我把一条老街重新点亮。']
    : ['第 1 天，', '我把外婆的店门擦亮了。'];
  ctx.fillText(title[0], 80, 280);
  ctx.fillText(title[1], 80, 368);

  // 店铺插画
  drawShop(ctx, 80, 460, 920, 600, state.renovations || {});

  // 底部文案
  ctx.textAlign = 'left';
  ctx.fillStyle = '#3b2b23';
  ctx.font = '700 34px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.fillText('青溪街 17 号，重新开张。', 80, 1160);
  ctx.fillStyle = '#8a7768';
  ctx.font = '400 24px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.fillText('《小城烟火》· 二合 + 模拟经营 · Demo 画面', 80, 1206);

  // 假二维码
  const qx = 820;
  const qy = 1150;
  ctx.fillStyle = '#3b2b23';
  roundRect(ctx, qx - 18, qy - 18, 168, 168, 16);
  ctx.fill();
  ctx.fillStyle = '#fdf6ea';
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      if ((row * 3 + col * 5 + row * col) % 3 !== 0) {
        ctx.fillRect(qx + col * 18, qy + row * 18, 12, 12);
      }
    }
  }
  ctx.fillStyle = '#3b2b23';
  ctx.font = '600 20px "PingFang SC", "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('扫码开张', qx + 66, qy + 186);

  // 边框
  ctx.strokeStyle = 'rgba(59, 43, 35, .12)';
  ctx.lineWidth = 3;
  roundRect(ctx, 28, 28, 1024, 1384, 28);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

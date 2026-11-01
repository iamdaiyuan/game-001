const info = (() => {
  try {
    return tt.getSystemInfoSync();
  } catch (err) {
    return { windowWidth: 375, windowHeight: 667, pixelRatio: 2 };
  }
})();

const canvas = tt.createCanvas();
const ctx = canvas.getContext('2d');
const dpr = info.pixelRatio || 2;
const w = info.windowWidth || 375;
const h = info.windowHeight || 667;

canvas.width = w * dpr;
canvas.height = h * dpr;
ctx.scale(dpr, dpr);

ctx.fillStyle = '#f7efe3';
ctx.fillRect(0, 0, w, h);

ctx.fillStyle = '#e0783c';
ctx.beginPath();
ctx.arc(w * 0.78, h * 0.18, 56, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#3b2b23';
ctx.font = 'bold 34px sans-serif';
ctx.fillText('小城烟火', 32, 92);
ctx.font = '16px sans-serif';
ctx.fillStyle = '#8a7768';
ctx.fillText('抖音小游戏工具链 smoke test', 32, 124);

ctx.fillStyle = '#d9c5a7';
ctx.fillRect(32, 180, w - 64, 220);
ctx.fillStyle = '#6e4a35';
ctx.fillRect(32, 180, w - 64, 18);
ctx.fillStyle = '#8a3f2a';
ctx.fillRect(w / 2 - 64, 210, 128, 44);
ctx.fillStyle = '#f3dfc0';
ctx.font = 'bold 16px sans-serif';
ctx.fillText('外婆的杂货铺', w / 2 - 52, 238);
ctx.fillStyle = '#c98a4a';
ctx.fillRect(w - 130, 270, 64, 130);
ctx.fillStyle = '#7a5d49';
ctx.fillRect(64, 270, 120, 80);

ctx.fillStyle = '#3b2b23';
ctx.font = '14px sans-serif';
ctx.fillText('Canvas 渲染正常', 32, 456);
ctx.fillStyle = '#6f8b63';
ctx.fillRect(32, 480, 120, 36);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 14px sans-serif';
ctx.fillText('smoke ok', 62, 503);

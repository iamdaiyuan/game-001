// 轻量 WebAudio 音效，无外部音频资源

export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
  }

  tone(freq, dur = 0.08, type = 'sine', gain = 0.04, slideTo = null, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), start + dur);
    }
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  click() {
    this.tone(620, 0.045, 'triangle', 0.022);
  }

  select() {
    this.tone(480, 0.05, 'sine', 0.018, 620);
  }

  merge(level = 1) {
    const base = 480 + level * 55;
    this.tone(base, 0.09, 'sine', 0.05, base * 1.5);
    this.tone(base * 1.8, 0.08, 'sine', 0.028, base * 2.2, 0.06);
  }

  reward() {
    this.tone(660, 0.08, 'sine', 0.04);
    this.tone(880, 0.1, 'sine', 0.04, 990, 0.09);
    this.tone(1320, 0.12, 'sine', 0.028, 1320, 0.2);
  }

  renovate() {
    [523, 659, 784, 1046].forEach((f, i) => {
      this.tone(f, 0.18, 'triangle', 0.035, f, i * 0.08);
    });
  }

  error() {
    this.tone(180, 0.12, 'sawtooth', 0.025, 140);
  }

  pop() {
    this.tone(900, 0.05, 'sine', 0.03, 1200);
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }
}

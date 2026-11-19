class RetroSound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, duration = 0.08, type = 'square', delay = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // 오디오 권한 제한 무시
    }
  }

  beep() {
    this.playTone(880, 0.06, 'square', 0);
  }

  confirm() {
    this.playTone(660, 0.06, 'square', 0);
    this.playTone(1046, 0.1, 'square', 0.06);
  }

  eat() {
    this.playTone(523, 0.07, 'triangle', 0);
    this.playTone(659, 0.07, 'triangle', 0.09);
    this.playTone(784, 0.1, 'triangle', 0.18);
  }

  evolve() {
    const notes = [523, 659, 784, 1046, 784, 1046];
    notes.forEach((n, i) => this.playTone(n, 0.11, 'square', i * 0.11));
  }

  win() {
    this.playTone(587, 0.08, 'square', 0);
    this.playTone(784, 0.08, 'square', 0.08);
    this.playTone(1174, 0.16, 'square', 0.16);
  }
}

export const sfx = new RetroSound();
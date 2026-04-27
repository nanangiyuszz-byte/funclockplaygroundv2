const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playCorrectSound() {
  playTone(523, 0.15, 'sine', 0.4);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.4), 100);
  setTimeout(() => playTone(784, 0.3, 'sine', 0.4), 200);
}

export function playWrongSound() {
  playTone(200, 0.3, 'sawtooth', 0.2);
  setTimeout(() => playTone(150, 0.4, 'sawtooth', 0.2), 200);
}

export function playStartSound() {
  playTone(440, 0.1, 'square', 0.2);
  setTimeout(() => playTone(554, 0.1, 'square', 0.2), 100);
  setTimeout(() => playTone(659, 0.1, 'square', 0.2), 200);
  setTimeout(() => playTone(880, 0.3, 'square', 0.2), 300);
}

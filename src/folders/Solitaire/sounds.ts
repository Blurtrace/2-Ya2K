/**
 * Síntesis de sonido retro para Solitario usando la Web Audio API nativa.
 * Sin archivos de audio externos, latencia cero y total compatibilidad.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/** Sonido de volteo / movimiento de carta (chasquido retro) */
export const playCardFlip = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
};

/** Sonido de colocación de carta en columna */
export const playCardPlace = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
};

/** Sonido al subir una carta a la fundación (campanilla retro armónica) */
export const playFoundation = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // Acorde C - E - G rápido

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const noteStart = now + idx * 0.035;
    osc.frequency.setValueAtTime(freq, noteStart);

    gain.gain.setValueAtTime(0.12, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteStart);
    osc.stop(noteStart + 0.12);
  });
};

/** Sonido de reparto / pasar mazo (flicteo de cartas) */
export const playStockDeal = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
};

/** Fanfarria triunfal de Windows 98 cuando se completa el solitario */
export const playVictoryFanfare = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Melodía victoriosa clásica 8-bit estilo Solitaire Win
  const melody = [
    { freq: 523.25, dur: 0.1, delay: 0 },      // C5
    { freq: 659.25, dur: 0.1, delay: 0.1 },    // E5
    { freq: 783.99, dur: 0.1, delay: 0.2 },    // G5
    { freq: 1046.5, dur: 0.25, delay: 0.3 },   // C6
    { freq: 783.99, dur: 0.1, delay: 0.55 },   // G5
    { freq: 1046.5, dur: 0.4, delay: 0.65 },   // C6
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const noteStart = now + note.delay;
    osc.frequency.setValueAtTime(note.freq, noteStart);

    gain.gain.setValueAtTime(0.18, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteStart);
    osc.stop(noteStart + note.dur);
  });
};

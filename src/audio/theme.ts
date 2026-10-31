/**
 * "Opening Bell": an original looping theme for the trek, synthesised live with Web Audio.
 * 100 BPM in A minor. Eight bars: a four-bar groove, then the same groove with a lead motif.
 * A trading-floor feel: driving bass, off-beat brass stabs, a ticking hi-hat.
 * After hours ("night") the drums drop out and a low-pass filter closes over the mix.
 */

const BPM = 100;
const STEP = 60 / BPM / 4; // one 16th note, in seconds
const STEPS_PER_BAR = 16;
export const LOOP_STEPS = STEPS_PER_BAR * 8;
const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;
const VOLUME = 0.16;

export const midiToHz = (note: number) => 440 * 2 ** ((note - 69) / 12);

// One chord per bar: bass root and the stab voicing (MIDI note numbers)
const CHORDS: { root: number; tones: number[] }[] = [
  { root: 45, tones: [57, 60, 64] }, // Am
  { root: 45, tones: [57, 60, 64] }, // Am
  { root: 41, tones: [57, 60, 65] }, // F
  { root: 43, tones: [55, 59, 62] }, // G
  { root: 38, tones: [57, 62, 65] }, // Dm
  { root: 45, tones: [57, 60, 64] }, // Am
  { root: 40, tones: [56, 59, 62] }, // E
  { root: 45, tones: [57, 60, 64] }, // Am
];

// Bass line over each bar: semitones above the chord root per 16th step, null for a rest
const BASS: (number | null)[] = [0, null, 12, null, 0, null, 7, 0, null, 0, 12, null, 7, null, 10, null];

// Brass stabs land on the "and" of every beat
const STAB_STEPS = new Set([2, 6, 10, 14]);

// Lead motif for the second half of the loop: [bar, step, MIDI note, length in steps]
const LEAD: [number, number, number, number][] = [
  [4, 0, 76, 3], [4, 4, 74, 2], [4, 6, 72, 2], [4, 8, 69, 6],
  [5, 0, 72, 2], [5, 2, 74, 2], [5, 4, 76, 4], [5, 10, 79, 2], [5, 12, 76, 4],
  [6, 0, 74, 3], [6, 4, 72, 2], [6, 6, 74, 2], [6, 8, 71, 6],
  [7, 0, 69, 2], [7, 2, 72, 2], [7, 4, 76, 2], [7, 6, 74, 2], [7, 8, 69, 8],
];

export type ThemeEvent =
  | { kind: 'kick' }
  | { kind: 'clap' }
  | { kind: 'hat'; level: number }
  | { kind: 'bass'; note: number; steps: number }
  | { kind: 'stab'; notes: number[] }
  | { kind: 'lead'; note: number; steps: number };

// Everything that plays on one 16th-note step of the loop. Pure, so the arrangement is testable.
export function themeEvents(step: number, night: boolean): ThemeEvent[] {
  const bar = Math.floor(step / STEPS_PER_BAR) % CHORDS.length;
  const s = step % STEPS_PER_BAR;
  const chord = CHORDS[bar];
  const events: ThemeEvent[] = [];

  if (!night) {
    if (s === 0 || s === 8 || (s === 11 && bar % 2 === 1)) events.push({ kind: 'kick' });
    if (s === 4 || s === 12) events.push({ kind: 'clap' });
  }
  // The ticker-tape hat: 8ths always, 16th ghosts only during market hours
  if (s % 2 === 0) events.push({ kind: 'hat', level: night ? 0.25 : s % 4 === 2 ? 0.55 : 0.35 });
  else if (!night) events.push({ kind: 'hat', level: 0.12 });

  const offset = BASS[s];
  if (offset !== null) events.push({ kind: 'bass', note: chord.root + offset, steps: 1.6 });

  // At night only the first stab of each bar survives
  if (STAB_STEPS.has(s) && (!night || s === 2)) events.push({ kind: 'stab', notes: chord.tones });

  for (const [b, st, note, len] of LEAD) {
    if (b === bar && st === s) events.push({ kind: 'lead', note, steps: len });
  }
  return events;
}

export class ThemeSequencer {
  private readonly out: GainNode;
  private readonly filter: BiquadFilterNode;
  private readonly noise: AudioBuffer;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private night = false;

  constructor(private readonly ctx: AudioContext, destination: AudioNode) {
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 6000;
    const glue = ctx.createDynamicsCompressor();
    glue.threshold.value = -18;
    glue.ratio.value = 3;
    this.out.connect(this.filter).connect(glue).connect(destination);

    // One second of white noise, reused for hats and claps
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  get playing() {
    return this.timer !== 0;
  }

  start() {
    if (this.timer) return;
    const now = this.ctx.currentTime;
    this.step = 0;
    this.nextTime = now + 0.05;
    this.out.gain.cancelScheduledValues(now);
    this.out.gain.setValueAtTime(this.out.gain.value, now);
    this.out.gain.linearRampToValueAtTime(VOLUME * (this.night ? 0.6 : 1), now + 1.5);
    this.timer = window.setInterval(this.tick, TICK_MS);
  }

  stop() {
    if (!this.timer) return;
    const now = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(now);
    this.out.gain.setValueAtTime(this.out.gain.value, now);
    this.out.gain.linearRampToValueAtTime(0, now + 0.6);
    window.clearInterval(this.timer);
    this.timer = 0;
  }

  // After hours: drums out, filter closed, a little quieter
  setNight(night: boolean) {
    if (night === this.night) return;
    this.night = night;
    const now = this.ctx.currentTime;
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setTargetAtTime(night ? 900 : 6000, now, 0.6);
    if (this.timer) {
      this.out.gain.cancelScheduledValues(now);
      this.out.gain.setTargetAtTime(VOLUME * (night ? 0.6 : 1), now, 0.6);
    }
  }

  // Look-ahead scheduler: queue every step that falls inside the next LOOKAHEAD_S on the audio clock
  private tick = () => {
    while (this.nextTime < this.ctx.currentTime + LOOKAHEAD_S) {
      for (const event of themeEvents(this.step, this.night)) this.play(event, this.nextTime);
      this.nextTime += STEP;
      this.step = (this.step + 1) % LOOP_STEPS;
    }
  };

  private play(event: ThemeEvent, t: number) {
    switch (event.kind) {
      case 'kick':
        return this.kick(t);
      case 'clap':
        return this.noiseHit(t, 'bandpass', 1400, 0.32, 0.12);
      case 'hat':
        return this.noiseHit(t, 'highpass', 7000, 0.22 * event.level, 0.04);
      case 'bass':
        return this.bass(t, midiToHz(event.note), event.steps * STEP);
      case 'stab':
        return this.stab(t, event.notes.map(midiToHz));
      case 'lead':
        return this.lead(t, midiToHz(event.note), event.steps * STEP);
    }
  }

  private envelope(t: number, peak: number, attack: number, release: number) {
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
    gain.connect(this.out);
    return gain;
  }

  private kick(t: number) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    osc.connect(this.envelope(t, 0.9, 0.004, 0.28));
    osc.start(t);
    osc.stop(t + 0.32);
  }

  private noiseHit(t: number, type: BiquadFilterType, freq: number, peak: number, decay: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    src.connect(filter).connect(this.envelope(t, peak, 0.002, decay));
    src.start(t, Math.random() * 0.5);
    src.stop(t + decay + 0.02);
  }

  private bass(t: number, hz: number, dur: number) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = hz;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 6;
    filter.frequency.setValueAtTime(240, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.02);
    filter.frequency.exponentialRampToValueAtTime(280, t + dur);
    osc.connect(filter).connect(this.envelope(t, 0.3, 0.01, dur));
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Brass stab: two slightly detuned saws per chord tone through a low-pass
  private stab(t: number, freqs: number[]) {
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.2);
    filter.connect(this.envelope(t, 0.07, 0.008, 0.22));
    for (const hz of freqs) {
      for (const cents of [-7, 7]) {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = hz;
        osc.detune.value = cents;
        osc.connect(filter);
        osc.start(t);
        osc.stop(t + 0.26);
      }
    }
  }

  private lead(t: number, hz: number, dur: number) {
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = hz;
    // Gentle vibrato that arrives a moment into each note
    const lfo = this.ctx.createOscillator();
    const depth = this.ctx.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(hz * 0.006, t + Math.min(dur, 0.25));
    lfo.connect(depth).connect(osc.frequency);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2800;
    osc.connect(filter).connect(this.envelope(t, 0.06, 0.02, dur));
    osc.start(t);
    lfo.start(t);
    osc.stop(t + dur + 0.05);
    lfo.stop(t + dur + 0.05);
  }
}

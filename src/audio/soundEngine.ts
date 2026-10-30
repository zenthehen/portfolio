/**
 * Zero-dependency Web Audio API sound synthesizer
 * Produces subtle retro terminal clicks, gentle milestone chimes, and server hum.
 * Safe for SSR and strictly muted until explicit user interaction.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = true;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (!muted) {
      this.initContext();
    } else {
      this.stopHum();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playBlip(freq: number = 600, duration: number = 0.05) {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }

  public playBell() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // Pleasant trading bell chime chord (A5 + E6)
      [880, 1318].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const startTime = ctx.currentTime + i * 0.04;
        const dur = 0.6;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }

  public startHum() {
    if (this.muted || this.humOsc) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.humOsc = ctx.createOscillator();
      this.humGain = ctx.createGain();

      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low 55Hz server fan hum

      this.humGain.gain.setValueAtTime(0.02, ctx.currentTime);
      this.humOsc.connect(this.humGain);
      this.humGain.connect(ctx.destination);

      this.humOsc.start();
    } catch {
      this.humOsc = null;
    }
  }

  public stopHum() {
    if (this.humOsc) {
      try {
        this.humOsc.stop();
        this.humOsc.disconnect();
      } catch {}
      this.humOsc = null;
    }
  }
}

export const soundEngine = new SoundEngine();

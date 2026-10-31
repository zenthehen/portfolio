import { describe, it, expect } from 'vitest';
import { soundEngine } from '../src/audio/soundEngine';
import { themeEvents, LOOP_STEPS, midiToHz } from '../src/audio/theme';

describe('Sound Engine', () => {
  it('is muted by default for clean accessibility', () => {
    expect(soundEngine.isMuted()).toBe(true);
  });

  it('updates muted state cleanly', () => {
    soundEngine.setMuted(false);
    expect(soundEngine.isMuted()).toBe(false);
    soundEngine.setMuted(true);
    expect(soundEngine.isMuted()).toBe(true);
  });

  it('does not crash when playing sounds in muted or non-browser environments', () => {
    expect(() => {
      soundEngine.playBlip();
      soundEngine.playBell();
      soundEngine.startHum();
      soundEngine.stopHum();
    }).not.toThrow();
  });
});

describe('"Opening Bell" theme arrangement', () => {
  it('loops eight bars of 16th notes', () => {
    expect(LOOP_STEPS).toBe(128);
  });

  it('puts the clap on beats two and four and the kick on one and three', () => {
    const kinds = (step: number) => themeEvents(step, false).map((e) => e.kind);
    expect(kinds(0)).toContain('kick');
    expect(kinds(8)).toContain('kick');
    expect(kinds(4)).toContain('clap');
    expect(kinds(12)).toContain('clap');
  });

  it('saves the lead melody for the second half of the loop', () => {
    const leadSteps = Array.from({ length: LOOP_STEPS }, (_, s) => s).filter((s) =>
      themeEvents(s, false).some((e) => e.kind === 'lead')
    );
    expect(leadSteps.length).toBeGreaterThan(0);
    expect(Math.min(...leadSteps)).toBeGreaterThanOrEqual(64);
  });

  it('drops the drums after hours but keeps the groove', () => {
    const night = Array.from({ length: LOOP_STEPS }, (_, s) => themeEvents(s, true)).flat();
    expect(night.some((e) => e.kind === 'kick' || e.kind === 'clap')).toBe(false);
    expect(night.some((e) => e.kind === 'bass')).toBe(true);
  });

  it('keeps every note in a sensible range', () => {
    expect(midiToHz(69)).toBeCloseTo(440);
    const notes = Array.from({ length: LOOP_STEPS }, (_, s) => themeEvents(s, false))
      .flat()
      .flatMap((e) => (e.kind === 'bass' || e.kind === 'lead' ? [e.note] : e.kind === 'stab' ? e.notes : []));
    expect(Math.min(...notes)).toBeGreaterThanOrEqual(36);
    expect(Math.max(...notes)).toBeLessThanOrEqual(84);
  });
});

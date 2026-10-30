import { describe, it, expect, vi } from 'vitest';
import { soundEngine } from '../src/audio/soundEngine';

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

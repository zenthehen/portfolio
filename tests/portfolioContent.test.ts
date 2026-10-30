import { describe, it, expect } from 'vitest';
import { STOPS, HOMELAB_SPEC, POKE_QUIPS, PROFILE } from '../src/data/portfolioContent';

describe('Portfolio Content Registry', () => {
  it('contains profile metadata for Rishal Raj Maskey', () => {
    expect(PROFILE.name).toBe('Rishal Raj Maskey');
    expect(PROFILE.email).toBe('masskeyrishal@gmail.com');
    expect(PROFILE.phone).toBe('+977 986-130-4849');
    expect(PROFILE.role).toContain('Assistant Network Administrator');
  });

  it('contains exactly 7 stops with correct milestone ids and data', () => {
    expect(STOPS).toHaveLength(7);
    expect(STOPS[0].id).toBe('market-open');
    expect(STOPS[1].id).toBe('support-level');
    expect(STOPS[2].id).toBe('noc-deck');
    expect(STOPS[3].id).toBe('innovation-plateau');
    expect(STOPS[4].id).toBe('alpha-breakout');
    expect(STOPS[5].id).toBe('proxmox-citadel');
    expect(STOPS[6].id).toBe('ath-summit');
  });

  it('verifies NEPSE Market Analytics details in stop 4', () => {
    const nepseStop = STOPS[4];
    expect(nepseStop.title).toContain('NEPSE Market Analytics');
    expect(nepseStop.projectDetails).toBeDefined();
    expect(nepseStop.projectDetails?.stack.some(s => s.includes('FastAPI'))).toBe(true);
  });

  it('contains complete homelab specification', () => {
    expect(HOMELAB_SPEC.nodes).toHaveLength(3);
    expect(HOMELAB_SPEC.edge.model).toBe('TP-Link ER605');
  });

  it('contains poke quips for candle character', () => {
    expect(POKE_QUIPS.length).toBeGreaterThanOrEqual(4);
    expect(POKE_QUIPS.some(q => q.includes('Circuit breaker'))).toBe(true);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HudHeader } from '../src/components/HudHeader';
import { MiniMap } from '../src/components/MiniMap';
import { VerticalFallback } from '../src/components/VerticalFallback';
import { STOPS, PROFILE } from '../src/data/portfolioContent';

describe('HUD Header Component', () => {
  it('displays real-time altimeter index and network uptime', () => {
    render(
      <HudHeader
        marketIndex={2750}
        uptime="99.99%"
        isMuted={true}
        onToggleSound={() => {}}
        onStartTour={() => {}}
        isTourActive={false}
        viewMode="trek"
        onToggleViewMode={() => {}}
      />
    );
    expect(screen.getByText(/99.99%/i)).toBeInTheDocument();
    expect(screen.getByText(/2,750/i)).toBeInTheDocument();
  });

  it('toggles audio on click', () => {
    const handleToggleSound = vi.fn();
    render(
      <HudHeader
        marketIndex={2750}
        uptime="99.99%"
        isMuted={true}
        onToggleSound={handleToggleSound}
        onStartTour={() => {}}
        isTourActive={false}
        viewMode="trek"
        onToggleViewMode={() => {}}
      />
    );
    const audioBtn = screen.getByRole('button', { name: /toggle audio/i });
    fireEvent.click(audioBtn);
    expect(handleToggleSound).toHaveBeenCalled();
  });
});

describe('MiniMap Component', () => {
  it('renders progress bar and stop pins', () => {
    const handleJump = vi.fn();
    render(
      <MiniMap
        stops={STOPS}
        currentStopIndex={2}
        progressPercent={38}
        onJumpToStop={handleJump}
      />
    );
    expect(screen.getByText(/STOP 3 OF 7/i)).toBeInTheDocument();
  });
});

describe('VerticalFallback Component', () => {
  it('renders all sections in accessible vertical layout', () => {
    render(
      <VerticalFallback
        profile={PROFILE}
        stops={STOPS}
        onOpenProject={() => {}}
        onOpenTopology={() => {}}
      />
    );
    expect(screen.getByText(/From the NOC floor to network administration/i)).toBeInTheDocument();
    expect(screen.getByText(/High School Degree in Science & Computer Science/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StopKiosk } from '../src/components/StopKiosk';
import { STOPS } from '../src/data/portfolioContent';

describe('StopKiosk Component', () => {
  it('renders stop details with correct badges, organization, and title', () => {
    render(
      <StopKiosk
        stop={STOPS[4]}
        isActive={true}
        onOpenDetails={() => {}}
      />
    );
    expect(screen.getByText(/NEPSE Market Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/NEPSE_RADAR/i)).toBeInTheDocument();
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
  });

  it('triggers onOpenDetails when View Architecture button is clicked for stops with projects', () => {
    const handleOpen = vi.fn();
    render(
      <StopKiosk
        stop={STOPS[4]}
        isActive={true}
        onOpenDetails={handleOpen}
      />
    );
    const btn = screen.getByRole('button', { name: /Architecture Details/i });
    fireEvent.click(btn);
    expect(handleOpen).toHaveBeenCalledWith('alpha-breakout');
  });

  it('highlights the kiosk with active styling when Candle arrives', () => {
    const { container } = render(
      <StopKiosk
        stop={STOPS[2]}
        isActive={true}
        onOpenDetails={() => {}}
      />
    );
    const card = container.querySelector('[data-testid="stop-kiosk-card"]');
    expect(card?.className).toContain('border-gold');
  });
});

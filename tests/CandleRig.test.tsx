import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CandleRig } from '../src/components/CandleRig';

describe('CandleRig Component', () => {
  it('renders bullish green styling when walking forward', () => {
    const { container } = render(<CandleRig pose="walk-bull" quip={null} onPoke={() => {}} />);
    const candleBody = container.querySelector('[data-testid="candle-body"]');
    expect(candleBody).toBeInTheDocument();
    expect(candleBody?.getAttribute('fill')).toBe('#3FB68B');
  });

  it('renders bearish red styling when reversing', () => {
    const { container } = render(<CandleRig pose="walk-bear" quip={null} onPoke={() => {}} />);
    const candleBody = container.querySelector('[data-testid="candle-body"]');
    expect(candleBody).toBeInTheDocument();
    expect(candleBody?.getAttribute('fill')).toBe('#EF4444');
  });

  it('triggers onPoke callback when clicked', () => {
    let poked = false;
    render(<CandleRig pose="idle" quip="Test Quip" onPoke={() => { poked = true; }} />);
    fireEvent.click(screen.getByRole('button', { name: /candle/i }));
    expect(poked).toBe(true);
  });

  it('displays the quip thought bubble when a quip is provided', () => {
    render(<CandleRig pose="idle" quip="Circuit breaker hit!" onPoke={() => {}} />);
    expect(screen.getByText(/Circuit breaker hit!/i)).toBeInTheDocument();
  });
});

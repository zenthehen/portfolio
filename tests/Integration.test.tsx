import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Full Application Integration', () => {
  it('mounts the entire candlestick trek application cleanly', () => {
    render(<App />);
    expect(screen.getByText(/RISHAL RAJ MASKEY/i)).toBeInTheDocument();
    expect(screen.getByText(/NEPSE TRADER/i)).toBeInTheDocument();
  });

  it('allows switching to vertical list view and back to trek view', () => {
    render(<App />);
    const toggleViewBtn = screen.getByRole('button', { name: /switch view mode/i });
    fireEvent.click(toggleViewBtn);

    // Now in vertical list view
    expect(screen.getByText(/ALL SYSTEMS OPERATIONAL/i)).toBeInTheDocument();
    expect(screen.getByText(/TREK VIEW/i)).toBeInTheDocument();

    // Toggle back to trek view
    fireEvent.click(toggleViewBtn);
    expect(screen.getByText(/LIST VIEW/i)).toBeInTheDocument();
  });

  it('triggers a quip when Candle is poked', () => {
    render(<App />);
    const candleBtn = screen.getByRole('button', { name: /poke candle/i });
    fireEvent.click(candleBtn);

    // Should display the first poke quip
    expect(screen.getByText(/Circuit breaker hit! \+10% on that breakout/i)).toBeInTheDocument();
  });
});

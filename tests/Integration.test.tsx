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

  it('opens project architecture modal from a kiosk', () => {
    render(<App />);
    const archButtons = screen.getAllByRole('button', { name: /architecture details/i });
    expect(archButtons.length).toBeGreaterThan(0);
    fireEvent.click(archButtons[0]);

    // Modal opens
    expect(screen.getByText(/Key Architectural Highlights/i)).toBeInTheDocument();
  });
});

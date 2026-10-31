import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Full Application Integration', () => {
  it('mounts the entire candlestick trek application cleanly', () => {
    render(<App />);
    expect(screen.getByText('Rishal Raj Maskey')).toBeInTheDocument();
    expect(screen.getByText('NEPSE trader · L2 network admin')).toBeInTheDocument();
  });

  it('allows switching to vertical list view and back to trek view', () => {
    render(<App />);
    const toggleViewBtn = screen.getByRole('button', { name: /switch view mode/i });
    fireEvent.click(toggleViewBtn);

    // Now in vertical list view
    expect(screen.getByText(/ALL SYSTEMS OPERATIONAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Chart view/i)).toBeInTheDocument();

    // Toggle back to trek view
    fireEvent.click(toggleViewBtn);
    expect(screen.getByText(/List view/i)).toBeInTheDocument();
  });

  it('steps forward to the next waypoint from the ruler', () => {
    render(<App />);
    const prev = screen.getByRole('button', { name: /previous waypoint/i });
    const next = screen.getByRole('button', { name: /next waypoint/i });
    expect(prev).toBeDisabled();
    expect(screen.getByText('Pre-open')).toBeInTheDocument();
    fireEvent.click(next);
    expect(next).toBeEnabled();
  });

  it('renders basecamp intro, order book, and summit contact scenes on the trail', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /Rishal Raj Maskey/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Order book/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Let's open a position/i })).toBeInTheDocument();
    expect(screen.getByText(/The servers don't/i)).toBeInTheDocument();
  });

  it('copies the email from the summit contact card', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /copy email address/i }));
    expect(screen.getByText(/Email copied to clipboard/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MarketMascot } from '../src/components/MarketMascot';
import { MASCOT_LINES } from '../src/data/portfolioContent';

const base = {
  x: 200,
  y: 200,
  onClick: () => {},
};

afterEach(() => vi.useRealTimers());

describe('MarketMascot (bull & bear)', () => {
  it('starts as the bull and greets the visitor at pre-open', () => {
    vi.useFakeTimers();
    render(<MarketMascot {...base} camX={0} waypointId="basecamp" waypointX={0} />);
    expect(screen.getByRole('button', { name: /bull/i }).className).toContain('is-on');
    act(() => vi.advanceTimersByTime(1700));
    expect(screen.getByText(MASCOT_LINES.basecamp.bull)).toBeInTheDocument();
  });

  it('swaps to the bear when scrolling backwards, and the bear has its say on arrival', () => {
    vi.useFakeTimers();
    const { rerender } = render(<MarketMascot {...base} camX={2700} waypointId="support-level" waypointX={2700} />);
    rerender(<MarketMascot {...base} camX={2400} velocity={-900} waypointId="market-open" waypointX={1980} />);
    expect(screen.getByRole('button', { name: /bear/i }).className).toContain('is-on');
    expect(screen.getByRole('button', { name: /bull/i }).className).toContain('is-off');

    rerender(<MarketMascot {...base} camX={1980} velocity={0} waypointId="market-open" waypointX={1980} />);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText(MASCOT_LINES['market-open'].bear)).toBeInTheDocument();
  });

  it('gallops while the camera moves and falls asleep after hours', () => {
    const { container, rerender } = render(<MarketMascot {...base} camX={100} waypointId="basecamp" waypointX={0} />);
    rerender(<MarketMascot {...base} camX={140} velocity={800} waypointId="basecamp" waypointX={0} />);
    expect(container.querySelector('.mascot')?.className).toContain('is-running');

    rerender(<MarketMascot {...base} camX={9000} velocity={0} waypointId="after-hours" waypointX={9000} />);
    expect(container.querySelector('.mascot')?.className).toContain('is-sleeping');
  });

  it('reports which character was clicked', () => {
    const onClick = vi.fn();
    render(<MarketMascot {...base} onClick={onClick} camX={0} waypointId="basecamp" waypointX={0} />);
    fireEvent.click(screen.getByRole('button', { name: /bull/i }));
    expect(onClick).toHaveBeenCalledWith('bull');
  });

  it('opens its bubble beside it when walking the phone lane under the cards', () => {
    vi.useFakeTimers();
    const { container } = render(<MarketMascot {...base} bubbleSide camX={0} waypointId="basecamp" waypointX={0} />);
    act(() => vi.advanceTimersByTime(1700));
    expect(container.querySelector('.mascot-bubble')?.className).toContain('mascot-bubble--side');
  });

  it('keeps galloping through a render where the camera position did not change', () => {
    // Extra renders mid-move (e.g. the header index updating) used to read as "stopped"
    const { container, rerender } = render(<MarketMascot {...base} camX={500} velocity={1200} waypointId="order-book" waypointX={1080} />);
    rerender(<MarketMascot {...base} camX={500} velocity={1200} waypointId="order-book" waypointX={1080} />);
    expect(container.querySelector('.mascot')?.className).toContain('is-running');
    expect(screen.getByRole('button', { name: /bull/i }).className).toContain('is-on');
  });
});

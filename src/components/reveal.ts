import type { CSSProperties } from 'react';

// Position in a reveal sequence; index.css turns it into a transition delay
export const stagger = (i: number, delayMs?: number): CSSProperties =>
  ({ '--i': i, ...(delayMs === undefined ? {} : { '--d': `${delayMs}ms` }) }) as CSSProperties;

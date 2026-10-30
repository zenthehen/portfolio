# The Candlestick Trail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance, side-scrolling interactive portfolio where a living Candlestick character navigates across Rishal Raj Maskey's career in NEPSE share trading and network administration from market open to the all-time-high summit.

**Architecture:** A Vite + React + TypeScript single-page application with a continuous vertical scroll-to-horizontal camera mapping engine. Renders 4 parallax depth layers (cyber grid, chart peaks, server racks, interactive chart trail), an animated SVG Candlestick rig, 7 milestone kiosks, an interactive Proxmox topology explorer, project modals, and a synthesized Web Audio engine.

**Tech Stack:** React 19 / Vite, TypeScript, Tailwind CSS, Lucide React, Web Audio API, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-30-candlestick-trek-portfolio-design.md`

## Global Constraints

- Primary colors: Ink `#0D1117`, Panel `#131922`, Bullish Green `#3FB68B`, Bearish Red `#EF4444`, Gold `#C8922A`/`#E0AC49`, Text Cream `#F5F0E8`, Text Slate `#9AA5B1`.
- Zero heavy 3D engine bundles; lightweight SVG and HTML5 Canvas with CSS hardware acceleration targeting 60fps.
- Audio is muted by default; Web Audio context initialized only on explicit user click.
- All real data from `rishal.com.np` must be preserved verbatim (L2 at Silverlining, 3-Node Proxmox, Dual-WAN ER605, NEPSE Market Analytics, STEM capstone, AWS 4x, Islington BSc).
- Accessible fallback available for `prefers-reduced-motion` and quick mobile scanning.

## Review Focus

- **Excessive rapid scroll / wheel event thrashing**: Camera and character state should interpolate smoothly via `requestAnimationFrame` lerp without coordinate popping or jumping.
- **AudioContext policy restrictions**: Unlocking the audio synthesizer on modern browsers requires a user gesture; errors should be caught silently without breaking UI.
- **Mobile touch dragging & small-screen overflow**: On touch screens or viewports < 640px, gestures must map cleanly to camera movement and UI must scale responsively.
- **Clipboard API permissions failure**: Copy buttons for email and phone must fall back gracefully to `document.execCommand('copy')` if Clipboard API is blocked.
- **Modal focus traps & scroll lock**: Opening project modals or topology drawers must lock outer window scrolling and release cleanly on close.

---

### Task 1: Project Scaffolding & Environment Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `tailwind.config.js`, `postcss.config.js`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Runnable React + Vite application with Tailwind CSS and Vitest test suite.

- [ ] **Step 1: Write setup verification test**

```typescript
import { describe, it, expect } from 'vitest';

describe('Project Scaffold', () => {
  it('verifies test environment is operational', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails (missing dependencies/config)**

Run: `npx vitest run tests/setup.test.ts`  
Expected: FAIL / Command error

- [ ] **Step 3: Scaffold project files, install dependencies (`react`, `react-dom`, `lucide-react`, `tailwindcss`, `vite`, `vitest`)**

Set up `package.json`, `vite.config.ts` (with Vitest config), `tailwind.config.js` configuring custom colors (`#0D1117`, `#131922`, `#3FB68B`, `#EF4444`, `#C8922A`), and `index.html`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/setup.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html tailwind.config.js postcss.config.js src/ tests/
git commit -m "feat: scaffold vite react tailwind project with vitest"
```

---

### Task 2: Data Models, Content Registry & Synthesized Sound Engine

**Files:**
- Create: `src/types/portfolio.ts`
- Create: `src/data/portfolioContent.ts`
- Create: `src/audio/soundEngine.ts`
- Test: `tests/portfolioContent.test.ts`
- Test: `tests/soundEngine.test.ts`

**Interfaces:**
- Produces: 
  - `STOPS: PortfolioStop[]` (7 milestone stations with verified data from rishal.com.np)
  - `HOMELAB_SPEC: HomelabTopology` (ER605, 3-Node Proxmox, telemetry stack)
  - `POKE_QUIPS: string[]`
  - `soundEngine: { playBlip(), playBell(), playHum(start/stop), setMuted(bool), isMuted() }`

- [ ] **Step 1: Write tests for portfolio content and sound engine**

```typescript
import { describe, it, expect } from 'vitest';
import { STOPS, HOMELAB_SPEC, POKE_QUIPS } from '../src/data/portfolioContent';

describe('Portfolio Content Registry', () => {
  it('contains exactly 7 stops with correct milestone ids and data', () => {
    expect(STOPS).toHaveLength(7);
    expect(STOPS[0].id).toBe('market-open');
    expect(STOPS[6].id).toBe('ath-summit');
    expect(STOPS[4].title).toContain('NEPSE Market Analytics');
  });

  it('contains complete homelab specification', () => {
    expect(HOMELAB_SPEC.nodes).toHaveLength(3);
    expect(HOMELAB_SPEC.edge.model).toBe('TP-Link ER605');
  });

  it('contains poke quips for candle character', () => {
    expect(POKE_QUIPS.length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/portfolioContent.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/types/portfolio.ts`, `src/data/portfolioContent.ts`, and `src/audio/soundEngine.ts`**

Define TypeScript interfaces for stops, nodes, and credentials. Populate with Rishal Raj Maskey's complete career data. Implement zero-dependency Web Audio API oscillator synthesis for blips, bells, and gentle server hum.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/portfolioContent.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/portfolio.ts src/data/portfolioContent.ts src/audio/soundEngine.ts tests/portfolioContent.test.ts
git commit -m "feat: add portfolio content registry, data models, and audio synthesizer"
```

---

### Task 3: The Living Candlestick Hero Component ("Candle")

**Files:**
- Create: `src/components/CandleRig.tsx`
- Test: `tests/CandleRig.test.tsx`

**Interfaces:**
- Consumes: `CandlePose = 'idle' | 'walk-bull' | 'walk-bear' | 'celebrate'`
- Produces: `<CandleRig pose={pose} quip={activeQuip} onPoke={handlePoke} isJumping={isJumping} />`

- [ ] **Step 1: Write test for CandleRig component**

```typescript
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
    expect(candleBody?.getAttribute('fill')).toBe('#EF4444');
  });

  it('triggers onPoke callback when clicked', () => {
    let poked = false;
    render(<CandleRig pose="idle" quip="Test Quip" onPoke={() => { poked = true; }} />);
    fireEvent.click(screen.getByRole('button', { name: /candle/i }));
    expect(poked).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/CandleRig.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `CandleRig.tsx`**

Build the animated SVG candlestick character:
- Upper wick with flickering flame gradient.
- Lower wick tail.
- Dynamic fill color (`#3FB68B` bull green, `#EF4444` bear red, `#C8922A` gold on celebrate).
- Terminal phosphor eyes and quip thought-bubble popover.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/CandleRig.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/CandleRig.tsx tests/CandleRig.test.tsx
git commit -m "feat: implement animated SVG living candlestick character rig"
```

---

### Task 4: World Engine, Parallax Layers & Chart Trail Canvas

**Files:**
- Create: `src/components/WorldParallax.tsx`
- Create: `src/hooks/useCameraScroller.ts`
- Test: `tests/WorldEngine.test.ts`

**Interfaces:**
- Consumes: `worldX: number`, `worldWidth: number`
- Produces: 
  - `useCameraScroller(options)`: hook managing vertical scroll & keyboard/touch to horizontal camera position with lerp easing.
  - `<WorldParallax camX={camX} worldWidth={worldWidth} stops={STOPS} onStopEnter={fn} />`
  - Dynamic candlestick trail rendering onto foreground canvas.

- [ ] **Step 1: Write test for camera scroller math and parallax coordinates**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateParallaxOffset, mapScrollToCamera } from '../src/hooks/useCameraScroller';

describe('Camera & Parallax Calculations', () => {
  it('maps vertical scroll percentage to world camera offset correctly', () => {
    const camX = mapScrollToCamera(500, 1000, 5000);
    expect(camX).toBe(2500);
  });

  it('calculates parallax layer offsets according to depth factors', () => {
    const skyOffset = calculateParallaxOffset(1000, 0.05);
    const midOffset = calculateParallaxOffset(1000, 0.40);
    expect(skyOffset).toBe(50);
    expect(midOffset).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/WorldEngine.test.ts`  
Expected: FAIL

- [ ] **Step 3: Implement `src/hooks/useCameraScroller.ts` and `src/components/WorldParallax.tsx`**

Implement smooth camera interpolation, touch/wheel/keyboard event binding, 4-tier parallax SVG backgrounds (sky grid, chart mountains, server racks, ground axis), and the candlestick printing trail engine.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/WorldEngine.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCameraScroller.ts src/components/WorldParallax.tsx tests/WorldEngine.test.ts
git commit -m "feat: implement scrollytelling world engine with 4-tier parallax and chart trail"
```

---

### Task 5: Interactive Stops & Milestone Stations

**Files:**
- Create: `src/components/StopKiosk.tsx`
- Modify: `src/components/WorldParallax.tsx`
- Test: `tests/StopKiosk.test.tsx`

**Interfaces:**
- Consumes: `stop: PortfolioStop`, `isActive: boolean`, `onOpenDetails: (id: string) => void`
- Produces: Formatted physical cyber-terminal kiosk at world coordinate $X$, showing role badges, descriptions, stack tags, and trigger buttons.

- [ ] **Step 1: Write test for StopKiosk**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StopKiosk } from '../src/components/StopKiosk';
import { STOPS } from '../src/data/portfolioContent';

describe('StopKiosk Component', () => {
  it('renders stop details with correct badges and title', () => {
    render(<StopKiosk stop={STOPS[4]} isActive={true} onOpenDetails={() => {}} />);
    expect(screen.getByText(/NEPSE Market Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/StopKiosk.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `StopKiosk.tsx`**

Style kiosks with terminal panels, glowing active borders when Candle is near, credential tags, milestone dates, and interactive trigger buttons.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/StopKiosk.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/StopKiosk.tsx tests/StopKiosk.test.tsx
git commit -m "feat: implement interactive milestone kiosks for all 7 career stops"
```

---

### Task 6: Interactive Homelab Topology Explorer & Project Architecture Modal

**Files:**
- Create: `src/components/HomelabTopology.tsx`
- Create: `src/components/ProjectModal.tsx`
- Test: `tests/InteractiveModals.test.tsx`

**Interfaces:**
- Consumes: `HOMELAB_SPEC`, `selectedProject: ProjectDetails | null`, `onClose: () => void`
- Produces: 
  - Visual interactive node graph representing Rishal's 3-node Proxmox VE + Dual-WAN ER605 + Telemetry stack.
  - Deep-dive technical modal for NEPSE Market Analytics & STEM Emergency Traffic preemption.

- [ ] **Step 1: Write test for Homelab Topology and Project Modal**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HomelabTopology } from '../src/components/HomelabTopology';
import { ProjectModal } from '../src/components/ProjectModal';
import { STOPS } from '../src/data/portfolioContent';

describe('Homelab Topology & Project Modal', () => {
  it('renders 3-node cluster and dual-wan nodes in topology', () => {
    render(<HomelabTopology />);
    expect(screen.getByText(/TP-Link ER605/i)).toBeInTheDocument();
    expect(screen.getByText(/TrueNAS SCALE/i)).toBeInTheDocument();
  });

  it('renders modal with project architecture specifications', () => {
    render(<ProjectModal project={STOPS[4].projectDetails!} onClose={() => {}} />);
    expect(screen.getByText(/Floorsheet/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/InteractiveModals.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `HomelabTopology.tsx` and `ProjectModal.tsx`**

Build interactive node cards with ping animations and service badges (`*.maskey.lab`, WireGuard, Grafana). Build accessible modal with escape-key handler and backdrop click dismissal.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/InteractiveModals.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/HomelabTopology.tsx src/components/ProjectModal.tsx tests/InteractiveModals.test.tsx
git commit -m "feat: implement interactive homelab topology explorer and project modals"
```

---

### Task 7: HUD, Ticker Altimeter, Mini-Map Navigation & Vertical Fallback

**Files:**
- Create: `src/components/HudHeader.tsx`
- Create: `src/components/MiniMap.tsx`
- Create: `src/components/VerticalFallback.tsx`
- Test: `tests/HudComponents.test.tsx`

**Interfaces:**
- Consumes: `currentAlt: number`, `currentStopIndex: number`, `soundMuted: boolean`, `onToggleSound: () => void`, `onJumpToStop: (idx: number) => void`, `onStartTour: () => void`
- Produces: Sticky command-center HUD with live market/network ticker, mini-map progress bar, and accessible vertical mode switch.

- [ ] **Step 1: Write test for HUD & Navigation**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HudHeader } from '../src/components/HudHeader';

describe('HUD Header Component', () => {
  it('displays real-time altimeter index and network uptime', () => {
    render(
      <HudHeader
        marketIndex={2750}
        uptime="99.99%"
        isMuted={true}
        onToggleSound={() => {}}
        onStartTour={() => {}}
      />
    );
    expect(screen.getByText(/99.99%/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/HudComponents.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement `HudHeader.tsx`, `MiniMap.tsx`, and `VerticalFallback.tsx`**

Build top HUD bar with brand badge, ticker tape, audio controls, and landmark pins. Implement clean vertical fallback for users with reduced motion enabled or on mobile fallback toggle.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/HudComponents.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/HudHeader.tsx src/components/MiniMap.tsx src/components/VerticalFallback.tsx tests/HudComponents.test.tsx
git commit -m "feat: implement command center HUD, altimeter ticker, mini-map, and vertical fallback"
```

---

### Task 8: Integration, Full Assembly, Guided Tour Mode & Production Build Verification

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/Toast.tsx`
- Test: `tests/Integration.test.tsx`

**Interfaces:**
- Assembles all components: `HudHeader`, `WorldParallax`, `CandleRig`, `StopKiosk`, `ProjectModal`, `HomelabTopology`, `Toast`.
- Verifies guided tour automated playback, copy-to-clipboard alerts, and production build artifact.

- [ ] **Step 1: Write comprehensive integration test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Full Application Integration', () => {
  it('mounts the entire candlestick trek application cleanly', () => {
    render(<App />);
    expect(screen.getByText(/RISHAL RAJ MASKEY/i)).toBeInTheDocument();
    expect(screen.getByText(/ALL SYSTEMS OPERATIONAL/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/Integration.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Wire together `App.tsx` with all state handlers, tour mode, and toast notifications**

Connect camera scroller, sound triggers, guided tour auto-stepping, copyable email (`masskeyrishal@gmail.com`) / phone (`+977 986-130-4849`), CV download triggers, and celebration triggers at the summit.

- [ ] **Step 4: Run all unit & integration tests**

Run: `npx vitest run`  
Expected: ALL PASS

- [ ] **Step 5: Run production build check**

Run: `npm run build`  
Expected: Clean static build in `dist/` with zero bundle warnings.

- [ ] **Step 6: Commit**

```bash
git add src/ tests/
git commit -m "feat: complete full candlestick trek portfolio assembly and production build"
```

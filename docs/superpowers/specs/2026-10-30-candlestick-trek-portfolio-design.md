# Design Spec: The Candlestick Trail — Interactive Portfolio

**Author**: Rishal Raj Maskey & Antigravity  
**Date**: 2026-10-30  
**Status**: Approved / In Design Review  
**Target File**: `docs/superpowers/specs/2026-10-30-candlestick-trek-portfolio-design.md`

---

## 1. Overview & Vision

An interactive, side-scrolling portfolio inspired by the mechanics of a Himalayan trek, but reimagined through the lens of a **NEPSE Share Trader and Network Administrator**. 

Instead of a mountain climber or yak, the hero protagonist is a **living Candlestick character ("Candle")**. As the visitor scrolls vertically (or swipes / uses arrow keys), the camera glides horizontally across a cyber-financial world that transitions from early Kathmandu roots through server rooms, NOC operations floors, machine-learning corridors, and trading floors to the **All-Time-High (ATH) Summit** at 3,200 points with 99.99% network uptime.

Behind Candle, the journey paints a real historical candlestick chart on the grid floor with volume surges and support/resistance levels.

---

## 2. Core Architecture & Stack

* **Framework**: React 18 / 19 + Vite (for lightning-fast HMR, sub-second loads, 60fps canvas/requestAnimationFrame loops).
* **Styling**: Tailwind CSS with custom terminal/financial palette:
  * Ink: `#0D1117`
  * Panel: `#131922`
  * Line/Border: `#222B37`
  * Bullish Green / Success: `#3FB68B`
  * Bearish Red / Alert: `#EF4444`
  * Gold / Primary Accent: `#C8922A` / `#E0AC49`
  * Cream Text: `#F5F0E8`
  * Slate Text: `#9AA5B1`
* **Icons**: `lucide-react`
* **Audio**: Custom zero-dependency synthesized audio engine via Web Audio API (toggleable sound: subtle terminal blips, market bell chime on milestones, gentle ambient server rack hum).
* **Assets**: High-performance inline SVG graphics for character rigs, parallax scenery, server racks, and network topologies.

---

## 3. World Engine & Scrollytelling Mechanics

### 3.1 Coordinate Mapping
* A standard vertical scroll container (`height: ~800vh` to allow continuous, smooth scrolling) drives horizontal camera position $X$ via `requestAnimationFrame`:
  $$\text{camX} = \text{scrollY} \times \text{worldRatio}$$
* Keyboard arrows ($\leftarrow, \rightarrow$), touch drags, or direct jump clicks on the HUD Mini-Map seamlessly update the camera target with smooth easing (lerp).

### 3.2 Parallax Depth Layers
1. **Background Layer 0 (Sky / Nebula Grid)**: Drift factor `0.05`. Deep dark cyber-sky with subtle constellation grid, floating ticker symbols (`NEPSE`, `NABIL`, `CIT`, `SHIVM`, `GBIME`, `HDL`).
2. **Background Layer 1 (Distant Peaks & Charts)**: Drift factor `0.15`. Silhouetted candlestick charts forming mountain ranges, Fibonacci retracement lines, and Bollinger band clouds.
3. **Midground Layer 2 (Infrastructure & Cityscape)**: Drift factor `0.40`. Kathmandu temples blending into data center cooling towers, blinking server racks, fiber optic conduits.
4. **Foreground Trail (Layer 3)**: Drift factor `1.0`. The actual chart grid line where Candle walks. Candle stamps green/red candlesticks with upper/lower wicks onto the ground as it moves forward.
5. **Interactive Stops**: Fixed world-space plateaus $(X_0, X_1, \dots, X_6)$ where physical kiosk terminals display Rishal's portfolio content.

---

## 4. The Hero: The Living Candlestick ("Candle")

* **Visual Design**:
  * Body: Rectangular OHLC candlestick body.
  * Upper Wick: Vertical line with a subtle glowing phosphor flame / data packet.
  * Lower Wick: Vertical tail line with animated footstep dust / electrical sparks.
  * Eyes: High-contrast terminal display eyes that blink, look ahead in the direction of movement, and squint when jumping or excited.
* **States & Poses**:
  * `idle`: Soft breathing pulse, flickering wick flame.
  * `walk-bull`: Gliding forward, body turns vibrant bullish green (`#3FB68B`), stamps a green candle bar onto the chart floor.
  * `walk-bear`: Scrolling backward, body turns bearish red (`#EF4444`), stamps a red candle bar.
  * `celebrate`: Arms/wicks raise up, flame flares gold on milestone discovery.
  * `quip`: Thought bubble appears above candle when clicked/poked.
* **Poke Quips**:
  1. *"Circuit breaker hit! +10% on that trade."*
  2. *"Zero packet loss across all VLANs — ping 1.2ms."*
  3. *"Broker 58 is accumulating... time to scale the infrastructure!"*
  4. *"Keep the networks resilient and the portfolio green."*
  5. *"Proxmox cluster quorum healthy — 3/3 nodes online."*

---

## 5. The Stops (Milestones & Content Model)

### Stop 1: Market Open / Genesis (Kathmandu Roots)
* **World X**: `10%`
* **Theme**: The beginning of the trading & networking journey.
* **Content**:
  * **Role**: Rishal Raj Maskey — Assistant Network Administrator & NEPSE Market Analyst.
  * **Location**: Basundhara, Kathmandu, Nepal.
  * **Foundations**: Uniglobe Secondary School (Science/Computer Science curriculum in mathematics, physics, and programming).
  * **Core Motto**: *"Keeping networks resilient, services online, and data actionable."*

### Stop 2: The Support Level (Certifications & First NOC Hops)
* **World X**: `25%`
* **Theme**: Early credentials and frontline technical battle-testing.
* **Content**:
  * **4× AWS Academy Badges**: Data Center Technician, Cloud Fundamentals, Cloud Security Fundamentals, Cloud Architect.
  * **Vianet Communications (L1 Support, 2023)**: ISP subscriber routing, customer-premises device configuration, field connectivity diagnostics.

### Stop 3: The NOC Command Deck (Enterprise Operations)
* **World X**: `40%`
* **Theme**: Enterprise-grade data center infrastructure.
* **Content**:
  * **Silverlining Data Center (NOC Engineer, 2024–2026)**:
    * 24/7 network monitoring, incident response & alert triage.
    * Freshservice ITSM lifecycle management.
    * Daily replication audits and monthly SLA compliance reports for enterprise and banking institutions.

### Stop 4: The Innovation Plateau (Degree & STEM Capstone)
* **World X**: `55%`
* **Theme**: Software development & Machine Learning systems.
* **Content**:
  * **BSc (Hons) Computer Networking & IT Security** (Islington College / London Met, Dec 2024).
  * **Featured Project — STEM: Emergency Vehicle Traffic Clearance System**:
    * Optical OpenCV computer vision for emergency vehicle detection.
    * Automated traffic signal preemption creating dynamic green corridors for approaching ambulances and fire engines.

### Stop 5: The Alpha Breakout (NEPSE Market Analytics & AI)
* **World X**: `70%`
* **Theme**: Institutional-grade Nepali financial market intelligence.
* **Content**:
  * **Featured Project — NEPSE Market Analytics & AI Suggestions Dashboard**:
    * Full-stack architecture: FastAPI (Python) backend + Next.js 14 / React frontend + SQLite.
    * Real-time NEPSE live market breadth and 13 sector sub-indices.
    * Multi-broker floorsheet accumulation/distribution radar (tracking Broker 58, 45, etc.).
    * 10% Upper/Lower Circuit Tracker and volume spike detection (>3x normal volume).
    * AI Strategy Engine powered by LLMs generating actionable trading insights and risk assessments.
  * Interactive modal displaying full system architecture and screenshots.

### Stop 6: The Proxmox Citadel (Homelab Infrastructure)
* **World X**: `85%`
* **Theme**: Production-grade homelab engineering.
* **Content**:
  * **Visual Interactive Topology**:
    1. *Edge*: TP-Link ER605 Dual-WAN router (Worldlink Primary + CG Net Static IP backup, SNMP v3).
    2. *Compute*: 3-Node Proxmox VE Cluster (HA Quorum, TrueNAS SCALE ZFS storage, Ubuntu monitoring node, testing VMs).
    3. *Telemetry*: Telegraf + InfluxDB + Grafana dashboard stack, Beszel metrics, Speedtest Tracker.
    4. *Access & Zero-Trust*: WireGuard, Cloudflare Tunnel, Tailscale mesh, Nginx Proxy Manager (`*.maskey.lab`).

### Stop 7: The All-Time High Summit (L2 Promotion & Hire Desk)
* **World X**: `100%`
* **Theme**: Promotion to L2 Assistant Network Administrator and direct contact.
* **Content**:
  * **Role Promotion**: Assistant Network Administrator — L2 at Silverlining Data Center (Effective August 1, 2026).
  * **Contact Terminal**:
    * Email: `masskeyrishal@gmail.com` (with one-click copy + toast)
    * Phone: `+977 986-130-4849` (with one-click copy + toast)
    * LinkedIn: `linkedin.com/in/rishal-raj-maskey-09a415185`
    * Download CV: Direct download trigger for `assets/Rishal-Raj-Maskey-CV.pdf`
  * Celebration animation (gold confetti, circuit breaker celebration, trading bell sound).

---

## 6. HUD (Heads-Up Display) & Controls

1. **Top Ticker Bar**:
   * Brand Badge: `RISHAL RAJ MASKEY // NET-OPS & MARKET DESK`
   * Real-time Ticker: `NEPSE: 3,200.00 ▲ +10.0%` · `PING: 1.1ms` · `UPTIME: 99.99%` · `STATUS: CLUSTER OK`
   * Quick Actions: Sound Toggle (🔊/🔇), Tour Mode (▶), Download CV (↓).
2. **Chart Altimeter & Progress Mini-Map**:
   * Shows a miniature candlestick chart progress bar with 7 landmark pins.
   * Clicking any pin smoothly scrubs the camera and moves Candle directly to that station.
3. **Guided Tour Mode**:
   * Pressing Tour walks Candle automatically from Stop 1 to Stop 7, pausing at each stop to narrate achievements before advancing.
4. **Keyboard & Mobile Support**:
   * $\leftarrow$ / $\rightarrow$ or `A` / `D` keys walk Candle backward and forward.
   * Swipe gestures on touch screens.
   * Spacebar triggers a celebratory jump / wick flare.

---

## 7. Accessibility & Performance Guardrails

* **Fallback Mode (`prefers-reduced-motion` or low-power devices)**:
  * Renders a clean, vertical, highly scannable terminal portfolio with all sections, tables, and copyable links, matching the existing visual theme.
* **Audio Accessibility**:
  * Default state is strictly muted. Audio only activates after explicit user click on the sound toggle.
* **Performance Budget**:
  * Zero external heavy 3D bundles; pure Canvas / SVG and hardware-accelerated CSS transforms for steady 60fps rendering.

---

## 8. Verification & Test Plan

1. **Camera & Physics Verification**: Ensure vertical scroll and keyboard inputs smoothly translate to horizontal world camera movement without jitter.
2. **Candle Rig State Changes**: Verify Candle changes color (`#3FB68B` forward, `#EF4444` reverse) and stamps candles correctly.
3. **Data Accuracy**: Verify all information from `rishal.com.np` (job titles, dates, certifications, project highlights, homelab specs, contact info) is accurately represented.
4. **Interactive Features**: Test one-click copy buttons for email/phone with toast alerts, CV download trigger, project detail modals, and homelab topology inspector.
5. **Mobile Responsiveness**: Test touch gestures, responsive HUD, and screen width adaptation from mobile (<600px) to ultra-wide displays.

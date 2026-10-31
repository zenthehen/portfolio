import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { STOPS, PROFILE, HOMELAB_SPEC, SCENES, SKILL_BOOK } from './data/portfolioContent';
import { useCameraScroller } from './hooks/useCameraScroller';
import { soundEngine } from './audio/soundEngine';
import { WorldParallax } from './components/WorldParallax';
import { StopKiosk } from './components/StopKiosk';
import { HudHeader } from './components/HudHeader';
import { MiniMap } from './components/MiniMap';
import { VerticalFallback } from './components/VerticalFallback';
import { ProjectModal } from './components/ProjectModal';
import { HomelabTopology } from './components/HomelabTopology';
import { Toast } from './components/Toast';
import { BasecampScene, OrderBookScene, SummitScene, AfterHoursScene } from './components/TrailScenes';
import { TrailSceneId } from './types/portfolio';
import { buildPriceSeries, priceAt } from './lib/priceSeries';
import { nearestWaypoint } from './lib/waypoints';
import type { MascotCharacter } from './components/MarketMascot';

export default function App() {
  const WORLD_WIDTH = 9000;

  // View & UI states
  const [viewMode, setViewMode] = useState<'trek' | 'vertical'>('trek');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isTopologyOpen, setIsTopologyOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const handleStepRef = useRef<(direction: 1 | -1) => void>(() => {});

  // Scrollytelling Camera Hook
  const {
    camX,
    cameraVelocity,
    jumpToPercent,
    progressPercent,
  } = useCameraScroller({
    worldWidth: WORLD_WIDTH,
    enabled: viewMode === 'trek',
    onStep: (direction) => handleStepRef.current(direction),
  });

  // Everything the camera can rest on, in trail order. The one nearest the camera is current,
  // so the highlighted card is always the one sitting in (or arriving at) its slot.
  const trail = useMemo(() => [...SCENES, ...STOPS].sort((a, b) => a.worldXPercent - b.worldXPercent), []);
  const currentWaypointId = nearestWaypoint(trail, progressPercent)?.id;
  const currentStopIndex = STOPS.findIndex((stop) => stop.id === currentWaypointId); // -1 on a scene
  const activeSceneId = SCENES.find((scene) => scene.id === currentWaypointId)?.id ?? null;

  // The background theme winds down once the market closes (after hours)
  const isAfterHours = currentWaypointId === 'after-hours';
  useEffect(() => soundEngine.setMusicNight(isAfterHours), [isAfterHours]);

  // The plotted career price; the HUD reads the level under the camera so it ticks while scrolling
  const priceSeries = useMemo(() => buildPriceSeries([...SCENES, ...STOPS], WORLD_WIDTH), []);
  const currentMarketIndex = Math.round(priceAt(priceSeries, camX));
  // ▲ while walking forward through the career, ▼ while walking back; it holds while resting.
  // (Following the price line's wiggles instead made the arrow flicker mid-move.)
  const [marketTrend, setMarketTrend] = useState<'up' | 'down'>('up');
  const headingForward = cameraVelocity > 60 ? true : cameraVelocity < -60 ? false : null;
  useEffect(() => {
    if (headingForward !== null) setMarketTrend(headingForward ? 'up' : 'down');
  }, [headingForward]);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Audio Toggle
  const handleToggleSound = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playBell();
      showToast('Sound on: playing "Opening Bell", an original theme');
    } else {
      showToast('Sound off');
    }
  }, [isMuted, showToast]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
    setEmailCopied(true);
    soundEngine.playBell();
    showToast('Email copied to clipboard');
    setTimeout(() => setEmailCopied(false), 2000);
  }, [showToast]);

  // Stable handlers + memoized elements: while the camera moves every frame, cards and scenes
  // are skipped by React unless their own props (active, copied) actually change.
  const openProject = useCallback((id: string) => setActiveProjectId(id), []);
  const openTopology = useCallback(() => setIsTopologyOpen(true), []);
  const beginTrek = useCallback(() => handleStepRef.current(1), []);
  const returnToStart = useCallback(() => jumpToPercent(0), [jumpToPercent]);

  const sceneContent: Record<TrailSceneId, ReactNode> = useMemo(
    () => ({
      basecamp: <BasecampScene profile={PROFILE} onBegin={beginTrek} />,
      'order-book': <OrderBookScene groups={SKILL_BOOK} isActive={activeSceneId === 'order-book'} />,
      summit: (
        <SummitScene
          profile={PROFILE}
          isActive={activeSceneId === 'summit'}
          onCopyEmail={handleCopyEmail}
          copied={emailCopied}
        />
      ),
      'after-hours': <AfterHoursScene profile={PROFILE} onReturn={returnToStart} />,
    }),
    [activeSceneId, emailCopied, handleCopyEmail, beginTrek, returnToStart]
  );

  // Guided Tour Mode logic
  useEffect(() => {
    if (!isTourActive) return;

    let targetIdx = 0;
    const tourInterval = window.setInterval(() => {
      if (targetIdx >= STOPS.length) {
        setIsTourActive(false);
        jumpToPercent(SCENES.find((scene) => scene.id === 'summit')!.worldXPercent);
        soundEngine.playBell();
        showToast('Trek Complete! All-Time High Reached.');
        return;
      }

      const stop = STOPS[targetIdx];
      jumpToPercent(stop.worldXPercent);
      // The bull narrates each stop on arrival, so no toast here
      targetIdx++;
    }, 4500);

    return () => clearInterval(tourInterval);
  }, [isTourActive, jumpToPercent, showToast]);

  // Jump to specific stop
  const handleJumpToStop = useCallback(
    (stopIdx: number) => {
      const stop = STOPS[stopIdx];
      if (stop) {
        jumpToPercent(stop.worldXPercent);
        soundEngine.playBlip(650, 0.05);
      }
    },
    [jumpToPercent]
  );

  // Prev/next waypoint relative to the current one (ruler buttons, arrow keys, horizontal swipes)
  const currentTrailIndex = trail.findIndex((wp) => wp.id === currentWaypointId);
  const nextWaypoint = trail[currentTrailIndex + 1]?.worldXPercent;
  const prevWaypoint = currentTrailIndex > 0 ? trail[currentTrailIndex - 1].worldXPercent : undefined;

  const stepTo = useCallback(
    (pct: number | undefined) => {
      if (pct === undefined) return;
      setIsTourActive(false);
      jumpToPercent(pct);
      soundEngine.playBlip(650, 0.05);
    },
    [jumpToPercent]
  );
  // One step = exactly one waypoint. While a move is still travelling, the next step counts
  // from where it's heading, so quick repeated presses advance card by card instead of stalling.
  const currentTrailIndexRef = useRef(currentTrailIndex);
  currentTrailIndexRef.current = currentTrailIndex;
  const inFlightRef = useRef<{ index: number; at: number } | null>(null);
  const handleStep = useCallback(
    (direction: 1 | -1) => {
      const inFlight = inFlightRef.current;
      const from = inFlight && performance.now() - inFlight.at < 1500 ? inFlight.index : currentTrailIndexRef.current;
      const to = Math.max(0, Math.min(trail.length - 1, from + direction));
      if (to === from) return;
      inFlightRef.current = { index: to, at: performance.now() };
      stepTo(trail[to].worldXPercent);
    },
    [stepTo, trail]
  );
  handleStepRef.current = handleStep;

  // Bull charges to the next card, bear backs off one. At the ends they turn around instead of doing nothing.
  const handleMascotClick = useCallback(
    (character: MascotCharacter) => {
      const atStart = currentTrailIndexRef.current <= 0;
      const atEnd = currentTrailIndexRef.current >= trail.length - 1;
      if (character === 'bull') {
        if (atEnd) jumpToPercent(0);
        else handleStep(1);
      } else {
        handleStep(atStart ? 1 : -1);
      }
    },
    [handleStep, jumpToPercent, trail.length]
  );

  // Snap points: if the page is scrolled some other way (scrollbar drag, resize), it still comes to rest on a waypoint
  const [maxScroll, setMaxScroll] = useState(0);
  useEffect(() => {
    if (viewMode !== 'trek') return;
    const measure = () => setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);
    measure();
    window.addEventListener('resize', measure);
    const root = document.documentElement;
    root.style.scrollSnapType = 'y mandatory';
    return () => {
      window.removeEventListener('resize', measure);
      root.style.scrollSnapType = '';
    };
  }, [viewMode]);

  // Selected project modal details
  const selectedProject = useMemo(() => {
    if (!activeProjectId) return null;
    const stop = STOPS.find((s) => s.id === activeProjectId);
    return stop?.projectDetails ?? null;
  }, [activeProjectId]);

  return (
    <div className="relative min-h-screen bg-paper text-ink-soft selection:bg-mark selection:text-ink">
      {/* ── Fixed Command Center HUD ── */}
      <HudHeader
        marketIndex={currentMarketIndex}
        marketTrend={marketTrend}
        uptime={PROFILE.uptime}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onStartTour={() => setIsTourActive((prev) => !prev)}
        isTourActive={isTourActive}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((prev) => (prev === 'trek' ? 'vertical' : 'trek'))
        }
      />

      {/* ── Main View: Side-Scrolling Trek vs Vertical Fallback ── */}
      {viewMode === 'trek' ? (
        <main className="relative">
          {/* Invisible Vertical Scroll Track: provides native browser scrolling */}
          <div className="relative h-[750vh] w-full pointer-events-none">
            {trail.map((wp) => (
              <div
                key={wp.id}
                className="absolute left-0 w-px h-px snap-start"
                style={{ top: (wp.worldXPercent / 100) * maxScroll }}
              />
            ))}
          </div>

          {/* Fixed Fullscreen Parallax Viewport */}
          <div className="fixed inset-0 pt-14">
            <WorldParallax
              camX={camX}
              cameraVelocity={cameraVelocity}
              worldWidth={WORLD_WIDTH}
              stops={STOPS}
              activeStopIndex={currentStopIndex}
              progressPercent={progressPercent}
              priceSeries={priceSeries}
              currentWaypointId={currentWaypointId}
              marketTrend={marketTrend}
              onMascotClick={handleMascotClick}
              scenes={SCENES.map((scene) => ({ ...scene, content: sceneContent[scene.id] }))}
              renderStopContent={(stop, isActive) => (
                <StopKiosk
                  stop={stop}
                  isActive={isActive}
                  onOpenDetails={openProject}
                  onOpenTopology={openTopology}
                />
              )}
            />
          </div>

          {/* Floating Bottom Mini-Map Progress Track */}
          <MiniMap
            stops={STOPS}
            currentStopIndex={currentStopIndex}
            progressPercent={progressPercent}
            onJumpToStop={handleJumpToStop}
            onPrev={prevWaypoint === undefined ? undefined : () => handleStep(-1)}
            onNext={nextWaypoint === undefined ? undefined : () => handleStep(1)}
            locationLabel={SCENES.find((scene) => scene.id === activeSceneId)?.label ?? null}
          />
        </main>
      ) : (
        <main>
          <VerticalFallback
            profile={PROFILE}
            stops={STOPS}
            skills={SKILL_BOOK}
            onOpenProject={openProject}
            onOpenTopology={openTopology}
          />
        </main>
      )}

      {/* ── Modals & Notifications ── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setActiveProjectId(null)}
        />
      )}

      {isTopologyOpen && (
        <HomelabTopology
          topology={HOMELAB_SPEC}
          onClose={() => setIsTopologyOpen(false)}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}

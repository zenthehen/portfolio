import { useState, useEffect, useCallback, useMemo } from 'react';
import { STOPS, PROFILE, HOMELAB_SPEC } from './data/portfolioContent';
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

export default function App() {
  const WORLD_WIDTH = 6200;

  // View & UI states
  const [viewMode, setViewMode] = useState<'trek' | 'vertical'>('trek');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isTopologyOpen, setIsTopologyOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scrollytelling Camera Hook
  const {
    camX,
    jumpToPercent,
    progressPercent,
  } = useCameraScroller({
    worldWidth: WORLD_WIDTH,
  });

  // Determine current active stop based on progress
  const currentStopIndex = useMemo(() => {
    let activeIdx = 0;
    for (let i = 0; i < STOPS.length; i++) {
      if (progressPercent >= STOPS[i].worldXPercent - 5) {
        activeIdx = i;
      }
    }
    return activeIdx;
  }, [progressPercent]);

  // Current interpolated NEPSE Index (1,100 to 3,200 points)
  const currentMarketIndex = useMemo(() => {
    const currentStop = STOPS[currentStopIndex];
    return currentStop ? currentStop.marketIndex : 1100;
  }, [currentStopIndex]);

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
      showToast('Sound Synthesizer Activated 🔊');
    } else {
      showToast('Sound Muted 🔇');
    }
  }, [isMuted, showToast]);

  // Guided Tour Mode logic
  useEffect(() => {
    if (!isTourActive) return;

    let targetIdx = 0;
    const tourInterval = window.setInterval(() => {
      if (targetIdx >= STOPS.length) {
        setIsTourActive(false);
        soundEngine.playBell();
        showToast('Trek Complete! All-Time High Reached.');
        return;
      }

      const stop = STOPS[targetIdx];
      jumpToPercent(stop.worldXPercent);
      showToast(`Milestone ${targetIdx + 1}: ${stop.title}`);
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

  // Selected project modal details
  const selectedProject = useMemo(() => {
    if (!activeProjectId) return null;
    const stop = STOPS.find((s) => s.id === activeProjectId);
    return stop?.projectDetails ?? null;
  }, [activeProjectId]);

  return (
    <div className="relative min-h-screen bg-ink text-slate selection:bg-gold selection:text-ink">
      {/* ── Fixed Command Center HUD ── */}
      <HudHeader
        marketIndex={currentMarketIndex}
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
          <div className="h-[550vh] w-full pointer-events-none" />

          {/* Fixed Fullscreen Parallax Viewport */}
          <div className="fixed inset-0 pt-14">
            <WorldParallax
              camX={camX}
              worldWidth={WORLD_WIDTH}
              stops={STOPS}
              activeStopIndex={currentStopIndex}
              renderStopContent={(stop, isActive) => (
                <StopKiosk
                  stop={stop}
                  isActive={isActive}
                  onOpenDetails={(id) => setActiveProjectId(id)}
                  onOpenTopology={() => setIsTopologyOpen(true)}
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
          />
        </main>
      ) : (
        <main>
          <VerticalFallback
            profile={PROFILE}
            stops={STOPS}
            onOpenProject={(id) => setActiveProjectId(id)}
            onOpenTopology={() => setIsTopologyOpen(true)}
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

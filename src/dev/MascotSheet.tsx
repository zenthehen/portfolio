import React from 'react';
import { BullRig, BearRig, MascotPose } from '../components/MascotRigs';
import '../components/mascot.css';

// Dev-only pose sheet (open the site with ?mascot-sheet): every pose of both rigs side by side,
// for tuning joints and timing without scrolling the trek to each state.
const BULL_POSES: MascotPose[] = ['idle', 'walk', 'run', 'talk', 'celebrate', 'sleep'];
const BEAR_POSES: MascotPose[] = ['sit', 'walk', 'run', 'grumpy', 'idle', 'sleep'];

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <figure className="flex flex-col items-center gap-2 border border-rule bg-sheet p-3">
    <div className="relative w-[240px] h-[180px]">{children}</div>
    <figcaption className="font-mono text-xs text-ink-soft">{label}</figcaption>
  </figure>
);

export default function MascotSheet() {
  return (
    <main className="min-h-screen graph-paper p-6 flex flex-col gap-6">
      {[
        { name: 'bull', poses: BULL_POSES, Rig: BullRig, className: 'mascot-sprite--bull' },
        { name: 'bear', poses: BEAR_POSES, Rig: BearRig, className: 'mascot-sprite--bear' },
      ].map(({ name, poses, Rig, className }) => (
        <section key={name} className="flex flex-wrap gap-4">
          {poses.map((pose) => (
            <Cell key={pose} label={`${name} · ${pose}`}>
              <div className={`mascot-sprite ${className}`} style={{ '--gait': '0.32s' } as React.CSSProperties}>
                <Rig pose={pose} />
              </div>
            </Cell>
          ))}
        </section>
      ))}
    </main>
  );
}

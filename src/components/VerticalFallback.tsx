import React, { useState } from 'react';
import { UserProfile, PortfolioStop, SkillGroup } from '../types/portfolio';
import { RevealSection } from './RevealSection';
import { stagger } from './reveal';
import { FileDown, Copy, Check, ExternalLink, Layers, Terminal, Activity } from 'lucide-react';

interface VerticalFallbackProps {
  profile: UserProfile;
  stops: PortfolioStop[];
  skills?: SkillGroup[];
  onOpenProject: (stopId: string) => void;
  onOpenTopology: () => void;
}

export const VerticalFallback: React.FC<VerticalFallbackProps> = ({
  profile,
  stops,
  skills = [],
  onOpenProject,
  onOpenTopology,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen graph-paper text-ink-soft font-sans pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-20">
        {/* ── Hero Section ── */}
        <RevealSection className="pt-12 sm:pt-16">
          <p className="flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-[0.14em] text-ink-soft mb-5">
            <span className="w-2 h-2 bg-bull" aria-hidden="true" />
            <span>All systems operational</span>
            <span className="text-ink-faint">·</span>
            <span>Kathmandu</span>
            <span className="text-ink-faint">·</span>
            <span>L2 network admin</span>
          </p>

          <h1 className="font-display font-extrabold uppercase text-5xl sm:text-7xl leading-[0.9] text-ink max-w-3xl">
            Keeping networks <span className="mark inline-block leading-[0.92]">resilient</span>, data actionable, and services online.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ink-soft max-w-xl font-sans leading-relaxed">
            I'm <strong className="text-ink font-medium">Rishal Raj Maskey</strong>, Assistant Network Administrator (L2) at Silverlining Data Center and active NEPSE share trader. Focused on network telemetry, Proxmox virtualization, algorithmic financial data, and high-availability operations.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#contact"
              className="px-4 py-2 rounded bg-ink text-paper font-semibold font-mono text-xs hover:bg-ink-soft transition-colors"
            >
              Get in touch
            </a>
            <a
              href={profile.cvUrl}
              download
              className="px-4 py-2 rounded bg-sheet border border-rule text-ink font-mono text-xs hover:border-ink hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <FileDown size={14} />
              Download CV
            </a>
            <button
              type="button"
              onClick={onOpenTopology}
              className="px-4 py-2 rounded bg-sheet border border-rule text-ink font-mono text-xs hover:border-ink hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Activity size={14} />
              Homelab Architecture
            </button>
          </div>
        </RevealSection>

        {/* ── About Section ── */}
        <RevealSection id="about" className="pt-12 border-t border-rule">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint mb-2">About</p>
          <h2 className="font-display font-extrabold uppercase text-4xl sm:text-5xl leading-[0.92] text-ink mb-4">
            From the NOC floor to network administration.
          </h2>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed max-w-2xl">
            Starting in frontline ISP support at Vianet diagnosing routing and field connectivity, I joined Silverlining Data Center managing 24/7 network monitoring, incident mitigation, and banking SLA replication audits. Stepping into the L2 Assistant Network Administrator role, I oversee enterprise switching, routing, and high-availability clusters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div className="bg-sheet border border-rule p-4 rounded-lg">
              <span className="block font-display font-extrabold uppercase text-2xl leading-none text-ink">L2 Net Admin</span>
              <span className="text-xs text-ink-soft mt-1 block">Silverlining Data Center — Effective Aug 1, 2026</span>
            </div>
            <div className="bg-sheet border border-rule p-4 rounded-lg">
              <span className="block font-display font-extrabold uppercase text-2xl leading-none text-ink">BSc (Hons)</span>
              <span className="text-xs text-ink-soft mt-1 block">Computer Networking &amp; IT Security, Islington</span>
            </div>
            <div className="bg-sheet border border-rule p-4 rounded-lg">
              <span className="block font-display font-extrabold uppercase text-2xl leading-none text-ink">4× AWS Academy</span>
              <span className="text-xs text-ink-soft mt-1 block">Data Center Tech, Security &amp; Solutions Architect</span>
            </div>
          </div>
        </RevealSection>

        {/* ── Order Book (Skills) ── */}
        {skills.length > 0 && (
          <RevealSection id="skills" className="pt-12 border-t border-rule">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-faint mb-2">Order book</p>
            <h2 className="font-display font-extrabold uppercase text-4xl sm:text-5xl leading-[0.92] text-ink mb-6">
              What I bring to the desk.
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skills.map((g, i) => (
                <div key={g.ticker} className="reveal-item bg-sheet border border-rule rounded-lg p-4" style={stagger(i, 200)}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-bull">▲ {g.ticker}</span>
                    <span className="text-sm text-ink">{g.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <span key={item} className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-sheet-2 border border-rule text-ink-soft">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* ── Career & Milestones Log ── */}
        <RevealSection id="career" className="pt-12 border-t border-rule">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint mb-2">Career log</p>
          <h2 className="font-display font-extrabold uppercase text-4xl sm:text-5xl leading-[0.92] text-ink mb-6">
            Every milestone, logged on the ledger.
          </h2>

          <div className="bg-sheet border border-rule rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-sheet-2 border-b border-rule font-mono text-xs text-ink-faint flex items-center gap-2">
              <Terminal size={14} className="text-ink" />
              <span>~/career — tail -f milestones.log</span>
            </div>

            <div className="divide-y divide-rule">
              {stops.map((stop, i) => (
                <div key={stop.id} className="reveal-item p-5 flex flex-col sm:flex-row gap-4 items-start" style={stagger(i, 200)}>
                  <div className="w-28 font-mono text-xs text-ink-faint shrink-0">
                    {stop.date}
                  </div>
                  <div className="w-36 font-mono text-[10.5px] uppercase tracking-wider text-ink shrink-0">
                    [{stop.orderType}]
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-semibold text-ink text-sm sm:text-base">
                      {stop.title} <small className="text-ink-soft font-normal">· {stop.organization}</small>
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {stop.description}
                    </p>
                    {stop.projectDetails && (
                      <button
                        type="button"
                        onClick={() => onOpenProject(stop.id)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-ink hover:underline"
                      >
                        <Layers size={13} />
                        View Architecture Details →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── Contact Section ── */}
        <RevealSection id="contact" className="pt-12 border-t border-rule">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint mb-2">Contact</p>
          <h2 className="font-display font-extrabold uppercase text-4xl sm:text-5xl leading-[0.92] text-ink mb-3">
            Open to interesting problems.
          </h2>
          <p className="text-ink-soft text-sm mb-6 max-w-xl">
            Based in Basundhara, Kathmandu. Whether it's enterprise network infrastructure, Proxmox virtualization, data center telemetry, or financial algorithmic projects — feel free to reach out.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl font-mono text-xs">
            {/* Email Card */}
            <div className="p-3 bg-sheet border border-rule rounded flex items-center justify-between">
              <div>
                <span className="text-ink font-semibold">mail</span> {profile.email}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="p-1 rounded bg-sheet-2 border border-rule hover:border-ink text-ink-soft hover:text-ink"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check size={13} className="text-bull" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-3 bg-sheet border border-rule rounded flex items-center justify-between">
              <div>
                <span className="text-ink font-semibold">tel_</span> {profile.phone}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                className="p-1 rounded bg-sheet-2 border border-rule hover:border-ink text-ink-soft hover:text-ink"
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check size={13} className="text-bull" /> : <Copy size={13} />}
              </button>
            </div>

            {/* LinkedIn Card */}
            <div className="p-3 bg-sheet border border-rule rounded flex items-center justify-between">
              <div>
                <span className="text-ink font-semibold">lnkd</span> /in/rishal-raj-maskey
              </div>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded bg-sheet-2 border border-rule hover:border-ink text-ink-soft hover:text-ink"
                title="Open LinkedIn"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            {/* CV Download Card */}
            <div className="p-3 bg-sheet border border-rule rounded flex items-center justify-between">
              <div>
                <span className="text-ink font-semibold">cv_↓</span> Rishal-Raj-Maskey-CV.pdf
              </div>
              <a
                href={profile.cvUrl}
                download
                className="p-1 rounded bg-sheet-2 border border-rule hover:border-ink text-ink-soft hover:text-ink"
                title="Download CV"
              >
                <FileDown size={13} />
              </a>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
};

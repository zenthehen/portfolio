import React, { useState } from 'react';
import { UserProfile, PortfolioStop } from '../types/portfolio';
import { Mail, Phone, Linkedin, FileDown, Copy, Check, ExternalLink, Layers, Terminal, Activity } from 'lucide-react';

interface VerticalFallbackProps {
  profile: UserProfile;
  stops: PortfolioStop[];
  onOpenProject: (stopId: string) => void;
  onOpenTopology: () => void;
}

export const VerticalFallback: React.FC<VerticalFallbackProps> = ({
  profile,
  stops,
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
    <div className="min-h-screen bg-ink text-slate font-sans pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-20">
        {/* ── Hero Section ── */}
        <section className="pt-12 sm:pt-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-slate border border-line bg-panel px-3 py-1.5 rounded mb-6">
            <span className="w-2 h-2 rounded-full bg-bull animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
            <span className="text-slate-dim">·</span>
            <span>KATHMANDU, NP</span>
            <span className="text-slate-dim">·</span>
            <span className="text-gold font-semibold">L2 NETWORK ADMIN</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-medium text-cream leading-tight max-w-2xl">
            Keeping networks <em className="italic text-gold-bright">resilient</em>, data actionable, and services online.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate max-w-xl font-sans leading-relaxed">
            I'm <strong className="text-cream font-medium">Rishal Raj Maskey</strong>, Assistant Network Administrator (L2) at Silverlining Data Center and active NEPSE share trader. Focused on network telemetry, Proxmox virtualization, algorithmic financial data, and high-availability operations.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#contact"
              className="px-4 py-2 rounded bg-gold text-ink font-semibold font-mono text-xs hover:bg-gold-bright transition-colors"
            >
              Get in touch
            </a>
            <a
              href={profile.cvUrl}
              download
              className="px-4 py-2 rounded bg-panel border border-line text-cream font-mono text-xs hover:border-gold hover:text-gold-bright transition-colors flex items-center gap-1.5"
            >
              <FileDown size={14} />
              Download CV
            </a>
            <button
              type="button"
              onClick={onOpenTopology}
              className="px-4 py-2 rounded bg-panel border border-line text-cream font-mono text-xs hover:border-gold hover:text-gold-bright transition-colors flex items-center gap-1.5"
            >
              <Activity size={14} />
              Homelab Architecture
            </button>
          </div>
        </section>

        {/* ── About Section ── */}
        <section id="about" className="pt-12 border-t border-line">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">// ABOUT</p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-cream mb-4">
            From the NOC floor to network administration.
          </h2>
          <p className="text-slate text-sm sm:text-base leading-relaxed max-w-2xl">
            Starting in frontline ISP support at Vianet diagnosing routing and field connectivity, I joined Silverlining Data Center managing 24/7 network monitoring, incident mitigation, and banking SLA replication audits. Stepping into the L2 Assistant Network Administrator role, I oversee enterprise switching, routing, and high-availability clusters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div className="bg-panel border border-line p-4 rounded-lg">
              <span className="block font-display text-lg font-semibold text-cream">L2 Net Admin</span>
              <span className="text-xs text-slate mt-1 block">Silverlining Data Center — Effective Aug 1, 2026</span>
            </div>
            <div className="bg-panel border border-line p-4 rounded-lg">
              <span className="block font-display text-lg font-semibold text-cream">BSc (Hons)</span>
              <span className="text-xs text-slate mt-1 block">Computer Networking &amp; IT Security, Islington</span>
            </div>
            <div className="bg-panel border border-line p-4 rounded-lg">
              <span className="block font-display text-lg font-semibold text-cream">4× AWS Academy</span>
              <span className="text-xs text-slate mt-1 block">Data Center Tech, Security &amp; Solutions Architect</span>
            </div>
          </div>
        </section>

        {/* ── Career & Milestones Log ── */}
        <section id="career" className="pt-12 border-t border-line">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">// CAREER LOG</p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-cream mb-6">
            Every milestone, logged on the ledger.
          </h2>

          <div className="bg-panel border border-line rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-panel-2 border-b border-line font-mono text-xs text-slate-dim flex items-center gap-2">
              <Terminal size={14} className="text-gold" />
              <span>~/career — tail -f milestones.log</span>
            </div>

            <div className="divide-y divide-line">
              {stops.map((stop) => (
                <div key={stop.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-28 font-mono text-xs text-slate-dim shrink-0">
                    {stop.date}
                  </div>
                  <div className="w-36 font-mono text-[10.5px] uppercase tracking-wider text-gold-bright shrink-0">
                    [{stop.orderType}]
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-semibold text-cream text-sm sm:text-base">
                      {stop.title} <small className="text-slate font-normal">· {stop.organization}</small>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate leading-relaxed">
                      {stop.description}
                    </p>
                    {stop.projectDetails && (
                      <button
                        type="button"
                        onClick={() => onOpenProject(stop.id)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-gold-bright hover:underline"
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
        </section>

        {/* ── Contact Section ── */}
        <section id="contact" className="pt-12 border-t border-line">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">// CONTACT</p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-cream mb-3">
            Open to interesting problems.
          </h2>
          <p className="text-slate text-sm mb-6 max-w-xl">
            Based in Basundhara, Kathmandu. Whether it's enterprise network infrastructure, Proxmox virtualization, data center telemetry, or financial algorithmic projects — feel free to reach out.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl font-mono text-xs">
            {/* Email Card */}
            <div className="p-3 bg-panel border border-line rounded flex items-center justify-between">
              <div>
                <span className="text-gold font-semibold">mail</span> {profile.email}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="p-1 rounded bg-panel-2 border border-line hover:border-gold text-slate hover:text-cream"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check size={13} className="text-bull" /> : <Copy size={13} />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-3 bg-panel border border-line rounded flex items-center justify-between">
              <div>
                <span className="text-gold font-semibold">tel_</span> {profile.phone}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                className="p-1 rounded bg-panel-2 border border-line hover:border-gold text-slate hover:text-cream"
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check size={13} className="text-bull" /> : <Copy size={13} />}
              </button>
            </div>

            {/* LinkedIn Card */}
            <div className="p-3 bg-panel border border-line rounded flex items-center justify-between">
              <div>
                <span className="text-gold font-semibold">lnkd</span> /in/rishal-raj-maskey
              </div>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded bg-panel-2 border border-line hover:border-gold text-slate hover:text-cream"
                title="Open LinkedIn"
              >
                <ExternalLink size={13} />
              </a>
            </div>

            {/* CV Download Card */}
            <div className="p-3 bg-panel border border-line rounded flex items-center justify-between">
              <div>
                <span className="text-gold font-semibold">cv_↓</span> Rishal-Raj-Maskey-CV.pdf
              </div>
              <a
                href={profile.cvUrl}
                download
                className="p-1 rounded bg-panel-2 border border-line hover:border-gold text-slate hover:text-cream"
                title="Download CV"
              >
                <FileDown size={13} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { ProjectDetails } from '../types/portfolio';
import { X, Layers, CheckCircle } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectDetails;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-panel border border-gold/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 bg-panel-2 border-b border-line">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-gold font-semibold">
              {project.kind}
            </span>
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-cream mt-1">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border border-line text-slate hover:text-cream hover:border-gold transition-colors ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <p className="text-slate text-sm sm:text-base leading-relaxed font-sans">
              {project.overview}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-bright mb-3 flex items-center gap-2">
              <Layers size={14} />
              Key Architectural Highlights
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate">
                  <CheckCircle size={14} className="text-bull shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-bright mb-3">
              Technologies &amp; Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-panel-2 border border-line text-cream"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

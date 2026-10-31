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
    <div data-allow-scroll className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/75">
      <div className="relative w-full max-w-2xl bg-sheet border-[1.5px] border-ink overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 bg-sheet-2 border-b border-rule">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
              {project.kind}
            </span>
            <h2 className="font-display font-extrabold uppercase text-3xl leading-[0.95] text-ink mt-1">
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border border-rule text-ink-soft hover:text-ink hover:border-ink transition-colors ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <p className="text-ink-soft text-sm sm:text-base leading-relaxed font-sans">
              {project.overview}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink mb-3 flex items-center gap-2">
              <Layers size={14} />
              Key Architectural Highlights
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft">
                  <CheckCircle size={14} className="text-bull shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink mb-3">
              Technologies &amp; Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-sheet-2 border border-rule text-ink"
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


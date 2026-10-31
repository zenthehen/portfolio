import React, { useState } from 'react';
import { HomelabTopology as TopologyType } from '../types/portfolio';
import { Server, Shield, Globe, Activity, X } from 'lucide-react';

interface HomelabTopologyProps {
  topology: TopologyType;
  onClose: () => void;
}

export const HomelabTopology: React.FC<HomelabTopologyProps> = ({
  topology,
  onClose,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div data-allow-scroll className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/75">
      <div className="relative w-full max-w-4xl bg-sheet border-[1.5px] border-ink overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sheet-2 border-b border-rule">
          <div className="flex items-center gap-2">
            <Activity className="text-ink" size={20} />
            <div>
              <h2 className="font-display font-extrabold uppercase text-2xl leading-none text-ink">
                Homelab Architecture &amp; 3-Node Proxmox Cluster
              </h2>
              <p className="font-mono text-xs text-ink-faint">
                Physical Edge · Virtualization Quorum · Zero-Trust Telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border border-rule text-ink-soft hover:text-ink hover:border-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Topology Visual Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* 01: Dual-WAN Edge Node */}
            <div className="bg-sheet-2 border border-rule rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-ink font-mono text-xs font-semibold uppercase tracking-wider">
                <Globe size={16} />
                <span>{topology.edge.title}</span>
              </div>

              <div>
                <h4 className="font-semibold text-ink text-sm">{topology.edge.model}</h4>
                <div className="font-mono text-xs text-ink-soft space-y-1 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-bull" />
                    <span>{topology.edge.wan1}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-bull" />
                    <span>{topology.edge.wan2}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-rule/60 flex flex-wrap gap-1">
                {topology.edge.features.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-sheet-3 border border-rule text-ink-soft"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* 02: 3-Node Proxmox Cluster */}
            <div className="bg-sheet-2 border-2 border-ink/50 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-ink font-mono text-xs font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Server size={16} />
                  <span>02 / 3-Node Proxmox VE</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-bull/10 text-bull border border-bull/30">
                  HA Quorum OK
                </span>
              </div>

              <div className="space-y-2">
                {topology.nodes.map((node) => {
                  const isSelected = selectedNode === node.nodeId;
                  return (
                    <button
                      key={node.nodeId}
                      type="button"
                      onClick={() =>
                        setSelectedNode(isSelected ? null : node.nodeId)
                      }
                      className={`w-full text-left p-2.5 rounded border transition-all text-xs font-mono ${
                        isSelected
                          ? 'bg-sheet-3 border-ink text-ink'
                          : 'bg-sheet border-rule text-ink-soft hover:text-ink hover:border-ink-faint'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-ink">{node.name}</span>
                        <span className="text-[10px] text-ink font-mono">{node.role}</span>
                      </div>
                      <div className="text-[11px] text-ink-faint">{node.specs}</div>
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-rule flex flex-wrap gap-1">
                          {node.services.map((s) => (
                            <span
                              key={s}
                              className="text-[9.5px] px-1.5 py-0.5 rounded bg-sheet-2 border border-rule text-ink"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 03: Telemetry & Zero-Trust Services */}
            <div className="bg-sheet-2 border border-rule rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-bull font-mono text-xs font-semibold uppercase tracking-wider">
                <Shield size={16} />
                <span>{topology.telemetry.title}</span>
              </div>

              <div className="font-mono text-xs text-ink-soft space-y-2">
                <div>
                  <span className="text-[10px] uppercase text-ink-faint block">
                    Observability Stack
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {topology.telemetry.services.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-sheet-3 border border-rule text-ink"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-ink-faint block">
                    Encrypted Tunnels
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {topology.telemetry.tunnels.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-sheet-3 border border-rule text-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-rule/60">
                  <span className="text-[10px] uppercase text-ink-faint block">
                    Internal Ingress
                  </span>
                  <span className="text-ink text-xs font-semibold">
                    {topology.telemetry.domain}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sheet-2/70 border border-rule rounded-lg p-4 text-xs font-mono text-ink-soft leading-relaxed">
            <span className="text-ink font-semibold">Summary: </span>
            The cluster runs automated live migration, resilient ZFS storage pools with scrub routines, and an end-to-end telemetry pipeline streaming router interface counters and Proxmox node metrics directly to Grafana dashboards.
          </div>
        </div>
      </div>
    </div>
  );
};

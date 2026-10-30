import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomelabTopology } from '../src/components/HomelabTopology';
import { ProjectModal } from '../src/components/ProjectModal';
import { STOPS, HOMELAB_SPEC } from '../src/data/portfolioContent';

describe('Homelab Topology & Project Modal', () => {
  it('renders 3-node cluster and dual-wan nodes in topology', () => {
    render(<HomelabTopology topology={HOMELAB_SPEC} onClose={() => {}} />);
    expect(screen.getByText(/TP-Link ER605/i)).toBeInTheDocument();
    expect(screen.getByText(/TrueNAS SCALE/i)).toBeInTheDocument();
    expect(screen.getByText(/Ubuntu Server Core/i)).toBeInTheDocument();
  });

  it('renders modal with project architecture specifications', () => {
    const nepseProject = STOPS[4].projectDetails!;
    render(<ProjectModal project={nepseProject} onClose={() => {}} />);
    expect(screen.getByText(/NEPSE Market Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Architectural Highlights/i)).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    const handleClose = vi.fn();
    const nepseProject = STOPS[4].projectDetails!;
    render(<ProjectModal project={nepseProject} onClose={handleClose} />);
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});

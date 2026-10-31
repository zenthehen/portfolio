export interface ProjectDetails {
  kind: string;
  title: string;
  overview: string;
  highlights: string[];
  stack: string[];
}

export interface PortfolioStop {
  id: string;
  index: number;
  worldXPercent: number; // 0 to 100
  marketIndex: number;   // e.g. 1100 to 3200
  date: string;
  orderType: string;     // e.g. INITIAL_POSITION, SYSTEM_EXPAND, ALGO_BREAKTHROUGH
  title: string;
  organization: string;
  roleBadge?: string;
  description: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  projectDetails?: ProjectDetails;
}

export interface HomelabTopology {
  edge: {
    title: string;
    model: string;
    wan1: string;
    wan2: string;
    features: string[];
  };
  nodes: {
    nodeId: string;
    name: string;
    role: string;
    services: string[];
    specs: string;
  }[];
  telemetry: {
    title: string;
    services: string[];
    tunnels: string[];
    domain: string;
  };
}

export interface UserProfile {
  name: string;
  role: string;
  organization: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  cvUrl: string;
  uptime: string;
}


export type TrailSceneId = 'basecamp' | 'order-book' | 'summit' | 'after-hours';

export interface TrailScene {
  id: TrailSceneId;
  worldXPercent: number;
  marketIndex: number; // level the plotted price passes through here
  label: string;
}

export interface SkillGroup {
  ticker: string;
  title: string;
  items: string[];
}

import { PortfolioStop, HomelabTopology, UserProfile, SkillGroup, TrailScene } from '../types/portfolio';

export const PROFILE: UserProfile = {
  name: "Rishal Raj Maskey",
  role: "Assistant Network Administrator (L2) & NEPSE Share Trader",
  organization: "Silverlining Data Center",
  location: "Basundhara, Kathmandu, Nepal",
  email: "masskeyrishal@gmail.com",
  phone: "+977 986-130-4849",
  linkedin: "https://linkedin.com/in/rishal-raj-maskey-09a415185",
  cvUrl: "assets/Rishal-Raj-Maskey-CV.pdf",
  uptime: "99.99%",
};

export const HOMELAB_SPEC: HomelabTopology = {
  edge: {
    title: "01 / Dual-WAN Edge",
    model: "TP-Link ER605",
    wan1: "Worldlink (Primary Fiber)",
    wan2: "CG Net (Static Public IP Backup)",
    features: ["SNMP v3 Telemetry", "Automated Failover", "Multi-WAN Policy Routing"],
  },
  nodes: [
    {
      nodeId: "pve-01",
      name: "Node 1: Storage & Cloud Vault",
      role: "TrueNAS SCALE",
      services: ["ZFS RAID Pools", "NFS / SMB Shares", "Immich", "Nextcloud"],
      specs: "HA Quorum · Dedicated ZFS Pool",
    },
    {
      nodeId: "pve-02",
      name: "Node 2: Monitoring & Edge Gateway",
      role: "Ubuntu Server Core",
      services: ["Grafana", "InfluxDB", "Telegraf", "Nginx Proxy Manager", "AdGuard Home DNS"],
      specs: "24/7 Telemetry Pipeline",
    },
    {
      nodeId: "pve-03",
      name: "Node 3: Compute & Sandbox",
      role: "Testing & Staging VMs",
      services: ["Linux Dev Sandbox", "Windows Server VMs", "LXC Containers"],
      specs: "Isolated Virtual Lab",
    },
  ],
  telemetry: {
    title: "03 / Zero-Trust & Observability",
    services: ["Grafana", "InfluxDB", "Telegraf", "Beszel Agents", "Speedtest Tracker"],
    tunnels: ["WireGuard (Static IP)", "Tailscale Mesh", "Cloudflare Tunnel"],
    domain: "*.maskey.lab (Wildcard SSL)",
  },
};

export const STOPS: PortfolioStop[] = [
  {
    id: "market-open",
    index: 0,
    worldXPercent: 22,
    marketIndex: 1100,
    date: "2021-06",
    orderType: "INITIAL_POSITION",
    title: "High School Degree in Science & Computer Science",
    organization: "Uniglobe Secondary School, Kathmandu",
    roleBadge: "FOUNDATIONS",
    description: "Built rigorous core competencies in computer science, software logic, calculus, and physics. Sparked the dual passions for computer networking and financial market dynamics in Nepal.",
    tags: ["Computer Science", "Algorithms", "Mathematics", "Kathmandu"],
    metrics: [
      { label: "Track", value: "Science / CS" },
      { label: "City", value: "Kathmandu, NP" },
    ],
  },
  {
    id: "support-level",
    index: 1,
    worldXPercent: 30,
    marketIndex: 1450,
    date: "2023",
    orderType: "CREDENTIAL_ACQUIRED",
    title: "AWS Academy (4×) & L1 ISP Support",
    organization: "Amazon Web Services & Vianet Communications",
    roleBadge: "FIELD_OPS",
    description: "Completed 4 AWS Academy tracks (Data Center Technician, Cloud Fundamentals, Cloud Security Fundamentals, Solutions Architect). Stepped onto the frontlines as L1 Technical Support at Vianet, diagnosing subscriber fiber links and customer routing equipment.",
    tags: ["4× AWS Academy", "Vianet L1", "Routing", "Fiber Diagnostics", "CPE Config"],
    metrics: [
      { label: "Certifications", value: "4× AWS Academy" },
      { label: "ISP Tier", value: "Vianet L1 Support" },
    ],
  },
  {
    id: "noc-deck",
    index: 2,
    worldXPercent: 38,
    marketIndex: 1950,
    date: "2024 – 2026",
    orderType: "SYSTEM_EXPAND",
    title: "NOC Engineer — 24/7 Enterprise Monitoring",
    organization: "Silverlining Data Center",
    roleBadge: "ENTERPRISE_NOC",
    description: "Orchestrated 24/7 network and data center monitoring, alert triage, incident lifecycle management on Freshservice, and SLA compliance audits. Produced mission-critical daily data replication and performance reports for major banking and enterprise institutions.",
    tags: ["24/7 NOC", "Freshservice ITSM", "Incident Response", "Banking SLAs", "Replication Audits"],
    metrics: [
      { label: "SLA Adherence", value: "99.99%" },
      { label: "Incidents", value: "Zero Unmitigated" },
    ],
  },
  {
    id: "innovation-plateau",
    index: 3,
    worldXPercent: 46,
    marketIndex: 2350,
    date: "2024-12",
    orderType: "AI_VISION_DEPLOY",
    title: "BSc (Hons) Networking & STEM Emergency Traffic AI",
    organization: "Islington College (London Metropolitan University)",
    roleBadge: "GRADUATED",
    description: "Graduated with honors in Computer Networking & IT Security. Engineered STEM (Smart Traffic for Emergency Movement), an automated traffic signal preemption system using OpenCV and machine learning to dynamically clear green corridors for approaching ambulances.",
    tags: ["BSc (Hons)", "OpenCV", "Machine Learning", "Computer Vision", "IoT Preemption"],
    metrics: [
      { label: "Degree", value: "BSc (Hons) First Class" },
      { label: "Capstone", value: "STEM AI Corridor" },
    ],
    projectDetails: {
      kind: "Machine Learning · Computer Vision · Final Year Capstone",
      title: "STEM — Emergency Vehicle Traffic Clearance System",
      overview: "An automated traffic preemption system engineered to dynamically clear green corridors for approaching emergency vehicles (ambulances, fire engines), eliminating intersection congestion delays.",
      highlights: [
        "Real-time optical video stream processing using OpenCV and computer vision models for emergency vehicle identification.",
        "Dynamic distance-threshold triggers calculating vehicle approach velocity and ETA at intersections.",
        "Automated green-light preemption protocol clearing vehicle queues before the emergency vehicle reaches the junction.",
        "Centralized web monitoring interface displaying intersection signal states and emergency transit audit logs."
      ],
      stack: ["Python", "OpenCV", "Machine Learning", "Computer Vision", "Web Dashboard", "IoT Hardware Simulation"]
    }
  },
  {
    id: "alpha-breakout",
    index: 4,
    worldXPercent: 54,
    marketIndex: 2750,
    date: "2025 – Present",
    orderType: "ALGO_BREAKTHROUGH",
    title: "NEPSE Market Analytics & AI Suggestions Dashboard",
    organization: "FinTech Innovation",
    roleBadge: "NEPSE_RADAR",
    description: "An institutional-grade intelligence platform engineered for the Nepal Stock Exchange (NEPSE). Combines real-time floorsheet scraping, 10% circuit tracker, broker accumulation radar (Broker 58, 45), and an AI strategy engine synthesizing technical momentum into trade suggestions.",
    tags: ["FastAPI", "Next.js", "TypeScript", "Floorsheet Scraper", "AI Strategy", "Broker Radar"],
    metrics: [
      { label: "Sectors Tracked", value: "13 Sub-Indices" },
      { label: "Circuit Breakers", value: "±10% Real-time Alert" },
    ],
    projectDetails: {
      kind: "Full-Stack FinTech · Real-Time Scraper · AI Strategy",
      title: "NEPSE Market Analytics & AI Suggestions Dashboard",
      overview: "A full-stack institutional-grade market intelligence platform engineered for the Nepal Stock Exchange (NEPSE). Combines real-time data scraping, floorsheet analytics, candlestick charts, and an AI strategy engine delivering on-demand trade suggestions.",
      highlights: [
        "Real-time NEPSE live market breadth, 13 sector sub-indices, and market capitalization statistics.",
        "Live Upper/Lower 10% Circuit Tracker and institutional Volume Spike alert engine (>3x normal volume).",
        "Multi-broker floorsheet accumulation/distribution radar tracking major brokerage activity (Broker 58, 45, etc.).",
        "AI Strategy Engine powered by LLMs synthesizing technical indicators and volume anomalies into actionable trade suggestions and risk assessments.",
        "Interactive Mark-to-Market Portfolio Manager with live profit/loss calculations and stock search."
      ],
      stack: ["FastAPI (Python)", "Next.js 14 / React", "TypeScript", "Recharts", "Tailwind CSS", "SQLite / SQLAlchemy", "AI / LLM API", "Floorsheet Scraper"]
    }
  },
  {
    id: "proxmox-citadel",
    index: 5,
    worldXPercent: 62,
    marketIndex: 2980,
    date: "2026",
    orderType: "CLUSTER_QUORUM",
    title: "3-Node Proxmox VE Cluster & Dual-WAN Infrastructure",
    organization: "Home Engineering Lab",
    roleBadge: "PROXMOX_HA",
    description: "A production-grade 3-node Proxmox VE homelab with TrueNAS SCALE ZFS storage, dual-WAN edge routing on TP-Link ER605 with automated failover, full Telegraf/InfluxDB/Grafana telemetry, and encrypted Zero-Trust WireGuard & Cloudflare Tunnels.",
    tags: ["Proxmox 3-Node", "TrueNAS SCALE", "ER605 Dual-WAN", "Grafana", "SNMP v3", "WireGuard"],
    metrics: [
      { label: "Cluster Nodes", value: "3-Node Quorum" },
      { label: "WAN Uplinks", value: "Dual Failover (Static IP)" },
    ],
  },
  {
    id: "ath-summit",
    index: 6,
    worldXPercent: 70,
    marketIndex: 3200,
    date: "2026-08-01",
    orderType: "ROLE_UPGRADE",
    title: "Assistant Network Administrator — L2",
    organization: "Silverlining Data Center",
    roleBadge: "L2_PROMOTION",
    description: "Effective August 1, 2026: Stepping into advanced L2 network administration at Silverlining Data Center. Direct ownership of enterprise data center routing, switching topologies, high-availability clusters, and mission-critical client escalations.",
    tags: ["L2 Network Admin", "Enterprise Routing", "Switching", "99.99% Uptime", "Silverlining"],
    metrics: [
      { label: "Status", value: "Promoted to L2" },
      { label: "Uptime Target", value: "99.99% Enterprise SLA" },
    ],
  },
];


// Non-career scenes that bookend the trail (Basecamp → Order Book → … → Summit → After Hours)
export const SCENES: TrailScene[] = [
  { id: 'basecamp', worldXPercent: 0, marketIndex: 1000, label: 'Pre-open' },
  { id: 'order-book', worldXPercent: 12, marketIndex: 1040, label: 'Order book' },
  { id: 'summit', worldXPercent: 82, marketIndex: 3320, label: 'All-time high' },
  { id: 'after-hours', worldXPercent: 100, marketIndex: 3290, label: 'After hours' },
];

export const SKILL_BOOK: SkillGroup[] = [
  {
    ticker: 'NET',
    title: 'Networking & Edge',
    items: ['Enterprise Routing', 'Switching / VLANs', 'Dual-WAN Failover', 'SNMP v3', 'Fiber Diagnostics'],
  },
  {
    ticker: 'VIRT',
    title: 'Virtualization & Storage',
    items: ['Proxmox VE (HA)', 'TrueNAS SCALE', 'ZFS', 'LXC', 'Windows Server', 'Linux'],
  },
  {
    ticker: 'OBS',
    title: 'Observability & NOC',
    items: ['Grafana', 'InfluxDB', 'Telegraf', 'Beszel', 'Freshservice ITSM', 'SLA Audits'],
  },
  {
    ticker: 'SEC',
    title: 'Zero-Trust Access',
    items: ['WireGuard', 'Tailscale', 'Cloudflare Tunnel', 'AdGuard DNS', 'Nginx Proxy Manager'],
  },
  {
    ticker: 'DEV',
    title: 'Code & Data',
    items: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'OpenCV', 'SQLite'],
  },
  {
    ticker: 'NEPSE',
    title: 'Market Analysis',
    items: ['Technical Analysis', 'Floorsheet Reading', 'Broker Accumulation', 'Volume Spikes', 'Risk Sizing'],
  },
];

// What the bull (arriving forward) and the bear (arriving backward) say at each waypoint
export const MASCOT_LINES: Record<string, { bull: string; bear: string }> = {
  basecamp: {
    bull: "Scroll and I'll charge. The bell's about to ring.",
    bear: "Back at pre-open. I'll be here when it dips.",
  },
  'order-book': {
    bull: 'Six long positions. All of them green.',
    bear: "Nice order book. Let's see if it holds.",
  },
  'market-open': {
    bull: 'First position: science and computer science.',
    bear: 'Everyone starts small. Even me.',
  },
  'support-level': {
    bull: '4× AWS Academy. Support level holding.',
    bear: 'Back down to L1 support? Bold move.',
  },
  'noc-deck': {
    bull: '24/7 NOC, 99.99% SLA. Sleep is for bears.',
    bear: 'Retesting the night shifts, are we.',
  },
  'innovation-plateau': {
    bull: 'BSc (Hons) and an AI traffic corridor. Hit the yellow button for the build!',
    bear: 'Pulling back to graduation day.',
  },
  'alpha-breakout': {
    bull: 'He built his own NEPSE radar. Yellow button, see how it works.',
    bear: 'Broker 58 is selling. ...Kidding.',
  },
  'proxmox-citadel': {
    bull: 'Three nodes, quorum healthy. Tap Inspect homelab to look inside.',
    bear: "Even I can't take this cluster down. Go on, inspect it.",
  },
  'ath-summit': {
    bull: 'Promoted to L2. New all-time high!',
    bear: 'Is that the top? ...No. Still holding.',
  },
  summit: {
    bull: "All-time high. Open a position: email's right there.",
    bear: 'Leaving the summit already?',
  },
  'after-hours': {
    bull: "Market's closed. Zzz…",
    bear: "Market's closed. Zzz…",
  },
};

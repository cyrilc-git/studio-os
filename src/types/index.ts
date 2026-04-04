// ============================================
// Studio OS — Core Types
// ============================================

// ---------- Radar ----------
export type RadarSource =
  | "reddit"
  | "producthunt"
  | "hackernews"
  | "google_trends"
  | "indiehackers"
  | "twitter"
  | "github_trending";

export interface RadarIdea {
  id: string;
  title: string;
  description: string;
  source: RadarSource;
  sourceUrl: string;
  detectedAt: string;
  tags: string[];
  upvotes?: number;
  comments?: number;
  rawSignals: Record<string, unknown>;
  status: "new" | "evaluated" | "archived";
  signalScore?: number;
}

// ---------- Signal ----------
export interface SignalDimension {
  key: string;
  label: string;
  description: string;
  score: number; // 1-10
  weight: number; // 0-1
  rationale: string;
}

export interface SignalEvaluation {
  id: string;
  ideaId: string;
  ideaTitle: string;
  dimensions: SignalDimension[];
  overallScore: number; // 0-100
  roiRatio: number; // revenue potential / build effort
  verdict: "GO" | "WAIT" | "NO";
  reasoning: string;
  evaluatedAt: string;
  evaluatedBy: "ai" | "manual";
}

// ---------- Development ----------
export interface DevProject {
  id: string;
  name: string;
  description: string;
  ideaId?: string;
  repo?: string;
  vercelUrl?: string;
  status: "prompting" | "generating" | "deploying" | "live" | "failed";
  messages: DevMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DevMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  codeBlocks?: { filename: string; language: string; code: string }[];
}

// ---------- Maintenance ----------
export interface ProjectHealth {
  id: string;
  name: string;
  repo: string;
  vercelProjectId: string;
  domain: string;
  status: "healthy" | "warning" | "error" | "offline";
  lastDeployAt: string;
  lastCheckAt: string;
  uptimePercent: number;
  errorCount24h: number;
  buildStatus: "success" | "failed" | "building";
  metrics: {
    responseTime: number;
    errorRate: number;
    buildTime: number;
  };
}

// ---------- Commercialisation ----------
export interface LandingPage {
  id: string;
  projectId: string;
  projectName: string;
  template: string;
  status: "draft" | "published";
  url?: string;
  conversions: number;
  visitors: number;
  createdAt: string;
}

export interface GrowthMetric {
  date: string;
  visitors: number;
  signups: number;
  revenue: number;
}

// ---------- Dashboard ----------
export interface ModuleStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "active" | "beta" | "coming_soon";
  path: string;
  stats: { label: string; value: string | number }[];
  color: string;
}

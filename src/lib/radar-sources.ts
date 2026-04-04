// ============================================
// Radar — Source Configurations & Fetchers
// ============================================

import type { RadarSource, RadarIdea } from "@/types";

export interface SourceConfig {
  id: RadarSource;
  name: string;
  icon: string;
  color: string;
  description: string;
  subreddits?: string[];
  enabled: boolean;
}

export const RADAR_SOURCES: SourceConfig[] = [
  {
    id: "reddit",
    name: "Reddit",
    icon: "MessageCircle",
    color: "#FF4500",
    description:
      "Subreddits startup & SaaS : r/SaaS, r/startups, r/Entrepreneur, r/sideproject, r/webdev, r/indiebusiness",
    subreddits: [
      "SaaS",
      "startups",
      "Entrepreneur",
      "sideproject",
      "webdev",
      "indiebusiness",
      "microsaas",
      "InternetIsBeautiful",
    ],
    enabled: true,
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    icon: "Rocket",
    color: "#DA552F",
    description:
      "Nouveaux lancements quotidiens, catégories tech, votes et commentaires de la communauté",
    enabled: true,
  },
  {
    id: "hackernews",
    name: "Hacker News",
    icon: "Newspaper",
    color: "#FF6600",
    description:
      "Front page + Show HN + Ask HN : signaux forts de la communauté tech",
    enabled: true,
  },
  {
    id: "google_trends",
    name: "Google Trends",
    icon: "TrendingUp",
    color: "#4285F4",
    description:
      "Tendances de recherche en hausse, sujets émergents, comparaisons de mots-clés",
    enabled: true,
  },
  {
    id: "indiehackers",
    name: "IndieHackers",
    icon: "Users",
    color: "#1E88E5",
    description:
      "Discussions de la communauté indie, revenue milestones, problèmes récurrents",
    enabled: true,
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: "Twitter",
    color: "#000000",
    description:
      "Influenceurs tech & startup, threads viraux, plaintes récurrentes d'utilisateurs",
    enabled: true,
  },
  {
    id: "github_trending",
    name: "GitHub Trending",
    icon: "Github",
    color: "#333333",
    description:
      "Repos trending, nouvelles libraries, outils open-source populaires",
    enabled: true,
  },
];

// Keywords that signal app/SaaS opportunities
export const OPPORTUNITY_KEYWORDS = [
  // Pain points
  "i wish there was",
  "is there an app",
  "looking for a tool",
  "frustrated with",
  "anyone know a",
  "alternative to",
  "replacement for",
  "built a",
  "i made",
  "launched",
  "just shipped",
  // Business signals
  "paying for",
  "would pay for",
  "shut down",
  "acquired",
  "raised",
  "mrr",
  "arr",
  "revenue",
  "subscribers",
  // Tech trends
  "ai-powered",
  "automation",
  "no-code",
  "api",
  "saas",
  "micro-saas",
  "chrome extension",
  "mobile app",
];

// ---------- Mock data generator for demo ----------
// In production, these would be real API calls

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const MOCK_IDEAS: Omit<RadarIdea, "id">[] = [
  {
    title: "AI Meeting Notes → Action Items Tracker",
    description:
      "Multiple Reddit threads asking for a tool that automatically extracts action items from meeting transcripts and creates tasks in project management tools. Current solutions are expensive ($25+/user/month).",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/SaaS/example",
    detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    tags: ["ai", "productivity", "meetings", "b2b"],
    upvotes: 342,
    comments: 87,
    rawSignals: { subreddit: "r/SaaS", sentiment: "high_demand" },
    status: "new",
  },
  {
    title: "Indie SaaS Analytics Dashboard",
    description:
      "Product Hunt launch showing 500+ upvotes for a simple analytics tool designed for solo founders. Tracks MRR, churn, LTV across Stripe + payment providers. Gap: most analytics tools are enterprise-focused.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example",
    detectedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    tags: ["analytics", "saas", "indie", "b2b"],
    upvotes: 523,
    comments: 156,
    rawSignals: { category: "Developer Tools", rank: 3 },
    status: "new",
  },
  {
    title: "WhatsApp CRM pour Artisans/TPE",
    description:
      "Trending sur Google FR : requêtes en hausse de +340% pour 'CRM WhatsApp'. Les artisans et petites entreprises veulent gérer leurs clients directement depuis WhatsApp. Marché FR sous-servi.",
    source: "google_trends",
    sourceUrl: "https://trends.google.com/trends/explore?q=crm+whatsapp",
    detectedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    tags: ["crm", "whatsapp", "b2b", "france", "tpe"],
    upvotes: undefined,
    comments: undefined,
    rawSignals: { trendGrowth: "+340%", region: "FR" },
    status: "new",
  },
  {
    title: "Open Source Billing / Invoicing for Freelancers",
    description:
      "Show HN post with 200+ points about frustrations with existing invoicing tools. Freelancers want: recurring invoices, multi-currency, tax compliance EU, no monthly fee. OSS alternative to FreshBooks.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example",
    detectedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    tags: ["invoicing", "freelance", "open-source", "b2b"],
    upvotes: 213,
    comments: 94,
    rawSignals: { hnType: "Show HN", points: 213 },
    status: "new",
  },
  {
    title: "AI-powered Code Review Bot for Small Teams",
    description:
      "GitHub trending: several repos around AI code review getting 500+ stars/week. IndieHackers discussion shows devs willing to pay $10-20/month for a lightweight PR reviewer. Enterprise tools too expensive.",
    source: "github_trending",
    sourceUrl: "https://github.com/trending",
    detectedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    tags: ["ai", "developer-tools", "code-review", "b2b"],
    upvotes: 1240,
    comments: 45,
    rawSignals: { starsPerWeek: 540, language: "TypeScript" },
    status: "evaluated",
    signalScore: 78,
  },
  {
    title: "Notion → Client Portal (White-label)",
    description:
      "Forte demande sur IndieHackers et Twitter pour un outil qui transforme une base Notion en portail client brandé. Agences et freelancers veulent partager des livrables sans donner accès à tout leur workspace.",
    source: "indiehackers",
    sourceUrl: "https://indiehackers.com/post/example",
    detectedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    tags: ["notion", "client-portal", "white-label", "b2b"],
    upvotes: 89,
    comments: 34,
    rawSignals: { revenueDiscussed: true, pricingMentioned: "$29/month" },
    status: "new",
  },
  {
    title: "Social Media Scheduler avec IA pour Solopreneurs",
    description:
      "Thread viral sur X (15k likes) d'un solopreneur qui explique perdre 2h/jour sur le content. Demande d'un outil simple : IA génère le contenu, schedule cross-platform, analytics basiques. Buffer/Hootsuite trop complexes.",
    source: "twitter",
    sourceUrl: "https://x.com/example/status/123",
    detectedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    tags: ["social-media", "ai", "content", "solopreneur", "b2c"],
    upvotes: 15200,
    comments: 890,
    rawSignals: { likes: 15200, retweets: 3400, viral: true },
    status: "evaluated",
    signalScore: 62,
  },
  {
    title: "RGPD Compliance Checker SaaS",
    description:
      "Sujet brûlant sur r/webdev et r/Entrepreneur EU : nouvelles amendes RGPD record. Les PME cherchent un outil simple pour scanner leur site et corriger les violations. Marché EU en pleine expansion.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/Entrepreneur/example",
    detectedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    tags: ["rgpd", "compliance", "legal-tech", "b2b", "europe"],
    upvotes: 178,
    comments: 63,
    rawSignals: { subreddit: "r/Entrepreneur", crossPosted: true },
    status: "new",
  },
  {
    title: "Habit Tracker avec Accountability IA",
    description:
      "Product Hunt : app de habit tracking avec coach IA qui envoie des nudges personnalisés. 400+ upvotes. Les commentaires demandent une version plus simple et moins chère que les apps existantes.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example2",
    detectedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    tags: ["habits", "ai", "coaching", "b2c", "wellness"],
    upvotes: 412,
    comments: 128,
    rawSignals: { category: "Productivity", rank: 5 },
    status: "new",
  },
  {
    title: "API Monitoring pour Indie Devs (Lightweight)",
    description:
      "Ask HN : 'What do you use for API monitoring?' — 150+ comments montrant que les devs solos trouvent Datadog/New Relic overkill. Besoin d'un outil simple : uptime, latency, alertes Slack, $5/month.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example2",
    detectedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    tags: ["monitoring", "api", "developer-tools", "b2b"],
    upvotes: 156,
    comments: 152,
    rawSignals: { hnType: "Ask HN", points: 156 },
    status: "evaluated",
    signalScore: 71,
  },
];

export function getMockIdeas(): RadarIdea[] {
  return MOCK_IDEAS.map((idea) => ({
    ...idea,
    id: generateId(),
  }));
}

export function getMockIdeasBySource(source: RadarSource): RadarIdea[] {
  return getMockIdeas().filter((idea) => idea.source === source);
}

export function getSourceStats(): Record<
  RadarSource,
  { count: number; newCount: number }
> {
  const ideas = getMockIdeas();
  const stats: Record<string, { count: number; newCount: number }> = {};
  for (const source of RADAR_SOURCES) {
    const sourceIdeas = ideas.filter((i) => i.source === source.id);
    stats[source.id] = {
      count: sourceIdeas.length,
      newCount: sourceIdeas.filter((i) => i.status === "new").length,
    };
  }
  return stats as Record<RadarSource, { count: number; newCount: number }>;
}

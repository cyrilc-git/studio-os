// ============================================
// Signal — Scoring Framework
// ============================================
// 5 dimensions optimisées pour un solo app studio
// Focus sur le ROI ratio (potentiel revenu ÷ effort de build)

import type { SignalDimension, SignalEvaluation } from "@/types";

export const SIGNAL_DIMENSIONS = [
  {
    key: "market_demand",
    label: "Demande marché",
    description:
      "Intensité du besoin exprimé. Volume de recherche, fréquence des discussions, urgence du problème. Un score élevé = les gens cherchent activement une solution.",
    weight: 0.25,
  },
  {
    key: "revenue_potential",
    label: "Potentiel revenu",
    description:
      "Capacité à monétiser. Willingness to pay, taille du marché adressable, modèle de pricing viable (SaaS, usage, one-time). Score élevé = les utilisateurs paient déjà pour des solutions similaires.",
    weight: 0.25,
  },
  {
    key: "build_effort",
    label: "Effort de build",
    description:
      "Complexité technique et temps nécessaire. Score élevé = facile à construire (inversé : 10 = trivial, 1 = années-homme). Prend en compte la stack existante (React, Supabase, Vercel).",
    weight: 0.2,
  },
  {
    key: "competition",
    label: "Paysage concurrentiel",
    description:
      "Niveau de saturation du marché. Score élevé = peu de concurrence ou concurrents médiocres. Prend en compte les moats, la qualité UX des alternatives, et l'espace pour un indie maker.",
    weight: 0.15,
  },
  {
    key: "timing",
    label: "Timing & tendance",
    description:
      "Fenêtre d'opportunité. Score élevé = le marché est en croissance, la technologie est mature, les early adopters sont prêts. Facteurs : nouvelles régulations, changements technologiques, tendances culturelles.",
    weight: 0.15,
  },
] as const;

export function computeOverallScore(dimensions: SignalDimension[]): number {
  const weighted = dimensions.reduce(
    (sum, d) => sum + d.score * d.weight * 10,
    0
  );
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function computeRoiRatio(dimensions: SignalDimension[]): number {
  const revenue =
    dimensions.find((d) => d.key === "revenue_potential")?.score ?? 5;
  const effort = dimensions.find((d) => d.key === "build_effort")?.score ?? 5;
  // effort is already inverted (10 = easy), so high effort score = low build cost
  // ROI = revenue potential * ease of build
  return Math.round((revenue * effort) / 10 * 10) / 10;
}

export function computeVerdict(
  overallScore: number,
  roiRatio: number
): "GO" | "WAIT" | "NO" {
  if (overallScore >= 70 && roiRatio >= 5) return "GO";
  if (overallScore >= 45 || roiRatio >= 3.5) return "WAIT";
  return "NO";
}

export function createEvaluation(
  ideaId: string,
  ideaTitle: string,
  dimensions: SignalDimension[],
  reasoning: string
): SignalEvaluation {
  const overallScore = computeOverallScore(dimensions);
  const roiRatio = computeRoiRatio(dimensions);
  return {
    id: crypto.randomUUID(),
    ideaId,
    ideaTitle,
    dimensions,
    overallScore,
    roiRatio,
    verdict: computeVerdict(overallScore, roiRatio),
    reasoning,
    evaluatedAt: new Date().toISOString(),
    evaluatedBy: "manual",
  };
}

// Prompt template pour l'évaluation AI via Claude
export function buildEvaluationPrompt(
  title: string,
  description: string
): string {
  return `Tu es un analyste produit expert pour un studio d'apps solo (stack: React, Next.js, Supabase, Vercel).

Évalue cette idée d'app selon 5 dimensions. Pour chaque dimension, donne un score de 1 à 10 et une justification courte.

IDÉE : ${title}
DESCRIPTION : ${description}

DIMENSIONS :
${SIGNAL_DIMENSIONS.map(
  (d) => `- ${d.label} (${d.key}): ${d.description}`
).join("\n")}

IMPORTANT pour "build_effort" : le score est INVERSÉ. 10 = très facile à construire, 1 = extrêmement complexe.

Réponds en JSON strict :
{
  "dimensions": [
    { "key": "market_demand", "score": <1-10>, "rationale": "<1 phrase>" },
    { "key": "revenue_potential", "score": <1-10>, "rationale": "<1 phrase>" },
    { "key": "build_effort", "score": <1-10>, "rationale": "<1 phrase>" },
    { "key": "competition", "score": <1-10>, "rationale": "<1 phrase>" },
    { "key": "timing", "score": <1-10>, "rationale": "<1 phrase>" }
  ],
  "reasoning": "<2-3 phrases résumant le verdict global et la recommandation>"
}`;
}

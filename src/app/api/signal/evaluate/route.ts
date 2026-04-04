import { NextResponse } from "next/server";
import {
  SIGNAL_DIMENSIONS,
  computeOverallScore,
  computeRoiRatio,
  computeVerdict,
  buildEvaluationPrompt,
} from "@/lib/signal-scoring";
import type { SignalDimension } from "@/types";

// POST /api/signal/evaluate
// Evaluates an idea using Claude API
export async function POST(request: Request) {
  try {
    const { title, description, mode = "ai" } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (mode === "ai") {
      // Call Claude API for AI evaluation
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        // Fallback: return simulated evaluation
        return NextResponse.json(simulateEvaluation(title, description));
      }

      const prompt = buildEvaluationPrompt(title, description || "");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        console.error("Claude API error:", response.status);
        return NextResponse.json(simulateEvaluation(title, description));
      }

      const data = await response.json();
      const text =
        data.content?.[0]?.type === "text" ? data.content[0].text : "";

      // Parse JSON from Claude's response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(simulateEvaluation(title, description));
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const dimensions: SignalDimension[] = SIGNAL_DIMENSIONS.map((dim) => {
        const aiDim = parsed.dimensions?.find(
          (d: { key: string }) => d.key === dim.key
        );
        return {
          ...dim,
          score: aiDim?.score ?? 5,
          rationale: aiDim?.rationale ?? "",
        };
      });

      const overallScore = computeOverallScore(dimensions);
      const roiRatio = computeRoiRatio(dimensions);

      return NextResponse.json({
        id: crypto.randomUUID(),
        ideaTitle: title,
        dimensions,
        overallScore,
        roiRatio,
        verdict: computeVerdict(overallScore, roiRatio),
        reasoning: parsed.reasoning || "",
        evaluatedAt: new Date().toISOString(),
        evaluatedBy: "ai",
      });
    }

    // Manual mode: just compute from provided scores
    return NextResponse.json({ error: "Use frontend for manual scoring" });
  } catch (error) {
    return NextResponse.json(
      { error: "Evaluation failed", details: String(error) },
      { status: 500 }
    );
  }
}

function simulateEvaluation(title: string, description: string) {
  // Deterministic-ish mock based on title length
  const seed = title.length % 5;
  const scores = [
    [7, 8, 6, 5, 8],
    [6, 5, 7, 4, 6],
    [9, 7, 4, 7, 9],
    [5, 6, 8, 3, 5],
    [8, 9, 5, 6, 7],
  ][seed];

  const dimensions: SignalDimension[] = SIGNAL_DIMENSIONS.map((dim, i) => ({
    ...dim,
    score: scores[i],
    rationale: `Évaluation simulée pour "${dim.label}"`,
  }));

  const overallScore = computeOverallScore(dimensions);
  const roiRatio = computeRoiRatio(dimensions);

  return {
    id: crypto.randomUUID(),
    ideaTitle: title,
    dimensions,
    overallScore,
    roiRatio,
    verdict: computeVerdict(overallScore, roiRatio),
    reasoning: `Évaluation IA simulée pour "${title}". Connectez votre clé API Anthropic (ANTHROPIC_API_KEY) pour activer l'évaluation réelle.`,
    evaluatedAt: new Date().toISOString(),
    evaluatedBy: "ai" as const,
  };
}

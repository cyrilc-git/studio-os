"use client";

import { useState, useMemo } from "react";
import {
  Signal as SignalIcon,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
} from "lucide-react";
import { SIGNAL_DIMENSIONS, computeOverallScore, computeRoiRatio, computeVerdict } from "@/lib/signal-scoring";
import { MOCK_EVALUATIONS } from "@/lib/mock-data";
import type { SignalEvaluation, SignalDimension } from "@/types";

const VERDICT_CONFIG = {
  GO: {
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle2,
    label: "GO",
  },
  WAIT: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
    label: "WAIT",
  },
  NO: {
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    label: "NO",
  },
};

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="w-full h-2 bg-[#F0F0F2] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function EvaluationCard({ evaluation }: { evaluation: SignalEvaluation }) {
  const [expanded, setExpanded] = useState(false);
  const verdict = VERDICT_CONFIG[evaluation.verdict];
  const VerdictIcon = verdict.icon;

  return (
    <div
      className={`bg-white rounded-xl border ${
        expanded ? verdict.border : "border-[#E5E5EA]"
      } overflow-hidden transition-all duration-200 animate-fadeIn`}
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-[14px] font-bold text-[#1D1D1F] mb-1">
              {evaluation.ideaTitle}
            </h3>
            <p className="text-[12px] text-[#86868B] line-clamp-1">
              {evaluation.reasoning}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Overall Score */}
            <div className="text-center">
              <div
                className={`text-[22px] font-extrabold ${
                  evaluation.overallScore >= 70
                    ? "text-green-600"
                    : evaluation.overallScore >= 50
                    ? "text-amber-600"
                    : "text-red-500"
                }`}
              >
                {evaluation.overallScore}
              </div>
              <div className="text-[10px] text-[#AEAEB2] font-medium">
                /100
              </div>
            </div>
            {/* Verdict badge */}
            <div
              className={`${verdict.bg} ${verdict.color} px-3 py-1.5 rounded-lg flex items-center gap-1.5`}
            >
              <VerdictIcon className="w-4 h-4" />
              <span className="text-[13px] font-bold">{verdict.label}</span>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-[#AEAEB2]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#AEAEB2]" />
            )}
          </div>
        </div>

        {/* Quick metrics row */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
            <Target className="w-3 h-3" />
            ROI: {evaluation.roiRatio}x
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
            <Sparkles className="w-3 h-3" />
            {evaluation.evaluatedBy === "ai" ? "IA" : "Manuel"}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#AEAEB2]">
            <Clock className="w-3 h-3" />
            {new Date(evaluation.evaluatedAt).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[#F0F0F2] pt-4 animate-slideIn">
          {/* Dimensions */}
          <div className="space-y-3 mb-5">
            {evaluation.dimensions.map((dim) => (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold text-[#1D1D1F]">
                    {dim.label}
                  </span>
                  <span className="text-[12px] font-bold text-[#1D1D1F]">
                    {dim.score}/10
                  </span>
                </div>
                <ScoreBar score={dim.score} />
                <p className="text-[11px] text-[#86868B] mt-1">
                  {dim.rationale}
                </p>
              </div>
            ))}
          </div>

          {/* Reasoning */}
          <div className="bg-[#F9F9FB] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#86868B]" />
              <span className="text-[12px] font-semibold text-[#1D1D1F]">
                Analyse
              </span>
            </div>
            <p className="text-[12px] text-[#555] leading-relaxed">
              {evaluation.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function NewEvaluationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(SIGNAL_DIMENSIONS.map((d) => [d.key, 5]))
  );
  const [isEvaluating, setIsEvaluating] = useState(false);

  const dimensions: SignalDimension[] = SIGNAL_DIMENSIONS.map((d) => ({
    ...d,
    score: scores[d.key],
    rationale: "",
  }));

  const overall = computeOverallScore(dimensions);
  const roi = computeRoiRatio(dimensions);
  const verdict = computeVerdict(overall, roi);
  const verdictConfig = VERDICT_CONFIG[verdict];

  const handleAiEvaluate = () => {
    setIsEvaluating(true);
    // Simulated AI evaluation
    setTimeout(() => {
      setScores({
        market_demand: 7,
        revenue_potential: 8,
        build_effort: 6,
        competition: 5,
        timing: 8,
      });
      setIsEvaluating(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E5EA] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-[14px] font-bold text-[#1D1D1F]">
          Nouvelle évaluation
        </h3>
      </div>

      <div className="space-y-3 mb-5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom de l'idée..."
          className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5EA] text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de l'idée, marché cible, proposition de valeur..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-[#E5E5EA] text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 resize-none"
        />
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-5">
        {SIGNAL_DIMENSIONS.map((dim) => (
          <div key={dim.key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-semibold text-[#1D1D1F]">
                {dim.label}
              </label>
              <span className="text-[12px] font-bold text-[#1D1D1F]">
                {scores[dim.key]}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={scores[dim.key]}
              onChange={(e) =>
                setScores((s) => ({
                  ...s,
                  [dim.key]: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-[#AEAEB2] mt-0.5">
              {dim.description}
            </p>
          </div>
        ))}
      </div>

      {/* Live score preview */}
      <div className="flex items-center justify-between p-4 bg-[#F9F9FB] rounded-xl mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] text-[#AEAEB2]">Score global</div>
            <div
              className={`text-[24px] font-extrabold ${
                overall >= 70
                  ? "text-green-600"
                  : overall >= 50
                  ? "text-amber-600"
                  : "text-red-500"
              }`}
            >
              {overall}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#AEAEB2]">ROI ratio</div>
            <div className="text-[24px] font-extrabold text-[#1D1D1F]">
              {roi}x
            </div>
          </div>
        </div>
        <div
          className={`${verdictConfig.bg} ${verdictConfig.color} px-4 py-2 rounded-xl flex items-center gap-2`}
        >
          {(() => {
            const VIcon = verdictConfig.icon;
            return <VIcon className="w-5 h-5" />;
          })()}
          <span className="text-[18px] font-extrabold">{verdict}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAiEvaluate}
          disabled={!title || isEvaluating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
          {isEvaluating ? "Évaluation IA..." : "Évaluer avec l'IA"}
        </button>
        <button
          disabled={!title}
          className="px-4 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-[13px] font-semibold hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}

export default function SignalPage() {
  const [filter, setFilter] = useState<"all" | "GO" | "WAIT" | "NO">("all");

  const evaluations = useMemo(() => {
    if (filter === "all") return MOCK_EVALUATIONS;
    return MOCK_EVALUATIONS.filter((e) => e.verdict === filter);
  }, [filter]);

  const goCount = MOCK_EVALUATIONS.filter((e) => e.verdict === "GO").length;
  const waitCount = MOCK_EVALUATIONS.filter((e) => e.verdict === "WAIT").length;
  const noCount = MOCK_EVALUATIONS.filter((e) => e.verdict === "NO").length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <SignalIcon className="w-5 h-5 text-amber-500" />
          <h1 className="text-[24px] font-extrabold tracking-tight text-[#1D1D1F]">
            Signal
          </h1>
        </div>
        <p className="text-[14px] text-[#86868B]">
          Scoring multi-dimensionnel et priorisation des idées.
        </p>
      </div>

      {/* Verdict summary */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
            filter === "all"
              ? "bg-[#1D1D1F] text-white"
              : "bg-white text-[#86868B] border border-[#E5E5EA] hover:bg-[#F5F5F7]"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Toutes ({MOCK_EVALUATIONS.length})
        </button>
        <button
          onClick={() => setFilter("GO")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
            filter === "GO"
              ? "bg-green-500 text-white"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          GO ({goCount})
        </button>
        <button
          onClick={() => setFilter("WAIT")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
            filter === "WAIT"
              ? "bg-amber-500 text-white"
              : "bg-amber-50 text-amber-600 hover:bg-amber-100"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          WAIT ({waitCount})
        </button>
        <button
          onClick={() => setFilter("NO")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
            filter === "NO"
              ? "bg-red-500 text-white"
              : "bg-red-50 text-red-500 hover:bg-red-100"
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          NO ({noCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Evaluations list */}
        <div className="lg:col-span-3 space-y-3">
          {evaluations.map((evaluation) => (
            <EvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}
          {evaluations.length === 0 && (
            <div className="text-center py-12">
              <SignalIcon className="w-12 h-12 text-[#D1D1D6] mx-auto mb-3" />
              <p className="text-[14px] text-[#86868B]">
                Aucune évaluation avec ce filtre.
              </p>
            </div>
          )}
        </div>

        {/* New evaluation form */}
        <div className="lg:col-span-2">
          <NewEvaluationForm />

          {/* Scoring framework info */}
          <div className="mt-4 bg-white rounded-xl border border-[#E5E5EA] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#86868B]" />
              <h3 className="text-[13px] font-bold text-[#1D1D1F]">
                Framework de scoring
              </h3>
            </div>
            <div className="space-y-2">
              {SIGNAL_DIMENSIONS.map((dim) => (
                <div
                  key={dim.key}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-[#86868B]">{dim.label}</span>
                  <span className="font-bold text-[#1D1D1F]">
                    {dim.weight * 100}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#F0F0F2] space-y-1">
              <p className="text-[11px] text-[#86868B]">
                <span className="font-semibold text-green-600">GO</span> :
                Score ≥ 70 et ROI ≥ 5x
              </p>
              <p className="text-[11px] text-[#86868B]">
                <span className="font-semibold text-amber-600">WAIT</span> :
                Score ≥ 45 ou ROI ≥ 3.5x
              </p>
              <p className="text-[11px] text-[#86868B]">
                <span className="font-semibold text-red-500">NO</span> : En
                dessous
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

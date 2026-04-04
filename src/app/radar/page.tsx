"use client";

import { useState, useMemo } from "react";
import {
  Radar as RadarIcon,
  MessageCircle,
  Rocket,
  Newspaper,
  TrendingUp,
  Users,
  AtSign,
  GitBranch,
  ExternalLink,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Search,
  Clock,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { RADAR_SOURCES } from "@/lib/radar-sources";
import { getMockIdeas } from "@/lib/radar-sources";
import type { RadarSource, RadarIdea } from "@/types";

const SOURCE_ICONS: Record<string, React.ElementType> = {
  reddit: MessageCircle,
  producthunt: Rocket,
  hackernews: Newspaper,
  google_trends: TrendingUp,
  indiehackers: Users,
  twitter: AtSign,
  github_trending: GitBranch,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

function IdeaCard({ idea, onEvaluate }: { idea: RadarIdea; onEvaluate: (idea: RadarIdea) => void }) {
  const SourceIcon = SOURCE_ICONS[idea.source] || RadarIcon;
  const sourceConfig = RADAR_SOURCES.find((s) => s.id === idea.source);

  return (
    <div className="bg-white rounded-xl border border-[#E5E5EA] p-5 hover:shadow-md transition-all duration-200 animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: sourceConfig?.color + "15" }}
          >
            <SourceIcon
              className="w-4 h-4"
              style={{ color: sourceConfig?.color }}
            />
          </div>
          <div>
            <span
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: sourceConfig?.color }}
            >
              {sourceConfig?.name}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-[#AEAEB2]">
              <Clock className="w-3 h-3" />
              {timeAgo(idea.detectedAt)}
            </div>
          </div>
        </div>
        {idea.status === "evaluated" && idea.signalScore && (
          <div
            className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
              idea.signalScore >= 70
                ? "bg-green-50 text-green-600"
                : idea.signalScore >= 50
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            Score: {idea.signalScore}
          </div>
        )}
        {idea.status === "new" && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600">
            NEW
          </span>
        )}
      </div>

      <h3 className="text-[14px] font-bold text-[#1D1D1F] mb-2 leading-snug">
        {idea.title}
      </h3>
      <p className="text-[12px] text-[#86868B] leading-relaxed mb-3 line-clamp-3">
        {idea.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#86868B]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Metrics & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F2]">
        <div className="flex items-center gap-3">
          {idea.upvotes !== undefined && (
            <div className="flex items-center gap-1 text-[11px] text-[#AEAEB2]">
              <ThumbsUp className="w-3 h-3" />
              {idea.upvotes.toLocaleString()}
            </div>
          )}
          {idea.comments !== undefined && (
            <div className="flex items-center gap-1 text-[11px] text-[#AEAEB2]">
              <MessageSquare className="w-3 h-3" />
              {idea.comments}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={idea.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#AEAEB2] hover:text-[#1D1D1F] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {idea.status === "new" && (
            <button
              onClick={() => onEvaluate(idea)}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Évaluer
            </button>
          )}
          {idea.status === "evaluated" && (
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#86868B] hover:text-[#1D1D1F] px-2.5 py-1 rounded-lg transition-colors">
              Voir Signal
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RadarPage() {
  const [selectedSource, setSelectedSource] = useState<RadarSource | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const allIdeas = useMemo(() => getMockIdeas(), []);

  const filteredIdeas = useMemo(() => {
    let ideas = allIdeas;
    if (selectedSource !== "all") {
      ideas = ideas.filter((i) => i.source === selectedSource);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      ideas = ideas.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q))
      );
    }
    return ideas.sort(
      (a, b) =>
        new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }, [allIdeas, selectedSource, searchQuery]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const handleEvaluate = (idea: RadarIdea) => {
    window.location.href = `/signal?ideaId=${idea.id}&title=${encodeURIComponent(idea.title)}`;
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RadarIcon className="w-5 h-5 text-indigo-500" />
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#1D1D1F]">
              Radar
            </h1>
          </div>
          <p className="text-[14px] text-[#86868B]">
            Détection automatique d&apos;opportunités depuis 7 sources.
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-[13px] font-semibold hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`}
          />
          {isScanning ? "Scan en cours..." : "Scanner maintenant"}
        </button>
      </div>

      {/* Source filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSource("all")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-colors ${
            selectedSource === "all"
              ? "bg-[#1D1D1F] text-white"
              : "bg-white text-[#86868B] border border-[#E5E5EA] hover:bg-[#F5F5F7]"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Toutes ({allIdeas.length})
        </button>
        {RADAR_SOURCES.map((source) => {
          const Icon = SOURCE_ICONS[source.id] || RadarIcon;
          const count = allIdeas.filter((i) => i.source === source.id).length;
          if (count === 0) return null;
          return (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-colors ${
                selectedSource === source.id
                  ? "text-white"
                  : "bg-white text-[#86868B] border border-[#E5E5EA] hover:bg-[#F5F5F7]"
              }`}
              style={
                selectedSource === source.id
                  ? { backgroundColor: source.color }
                  : {}
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {source.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAEB2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par mot-clé, tag, description..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5EA] bg-white text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E5EA] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {allIdeas.length}
            </p>
            <p className="text-[11px] text-[#AEAEB2]">Idées totales</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {allIdeas.filter((i) => i.status === "new").length}
            </p>
            <p className="text-[11px] text-[#AEAEB2]">Non évaluées</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {allIdeas.filter((i) => i.status === "evaluated").length}
            </p>
            <p className="text-[11px] text-[#AEAEB2]">Évaluées</p>
          </div>
        </div>
      </div>

      {/* Ideas grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onEvaluate={handleEvaluate} />
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-16">
          <RadarIcon className="w-12 h-12 text-[#D1D1D6] mx-auto mb-3" />
          <p className="text-[14px] text-[#86868B]">
            Aucune idée trouvée pour ces filtres.
          </p>
        </div>
      )}
    </div>
  );
}

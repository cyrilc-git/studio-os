"use client";

import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  WifiOff,
  Activity,
  Clock,
  Zap,
  ExternalLink,
  GitBranch,
  Globe,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { ProjectHealth } from "@/types";

const STATUS_CONFIG = {
  healthy: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Healthy",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Warning",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Error",
  },
  offline: {
    icon: WifiOff,
    color: "text-[#AEAEB2]",
    bg: "bg-[#F5F5F7]",
    border: "border-[#E5E5EA]",
    label: "Offline",
  },
};

function ProjectCard({ project }: { project: ProjectHealth }) {
  const status = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={`bg-white rounded-xl border ${status.border} p-5 transition-all duration-200 animate-fadeIn`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}
          >
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1D1D1F]">
              {project.name}
            </h3>
            <span className={`text-[11px] font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.domain && (
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AEAEB2] hover:text-[#1D1D1F] transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AEAEB2] hover:text-[#1D1D1F] transition-colors"
          >
            <GitBranch className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Metrics grid */}
      {project.status !== "offline" ? (
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-[#F9F9FB] rounded-lg p-3 text-center">
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {project.uptimePercent}%
            </p>
            <p className="text-[10px] text-[#AEAEB2]">Uptime</p>
          </div>
          <div className="bg-[#F9F9FB] rounded-lg p-3 text-center">
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {project.metrics.responseTime}ms
            </p>
            <p className="text-[10px] text-[#AEAEB2]">Latence</p>
          </div>
          <div className="bg-[#F9F9FB] rounded-lg p-3 text-center">
            <p
              className={`text-[18px] font-bold ${
                project.errorCount24h > 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {project.errorCount24h}
            </p>
            <p className="text-[10px] text-[#AEAEB2]">Erreurs 24h</p>
          </div>
          <div className="bg-[#F9F9FB] rounded-lg p-3 text-center">
            <p className="text-[18px] font-bold text-[#1D1D1F]">
              {project.metrics.buildTime}s
            </p>
            <p className="text-[10px] text-[#AEAEB2]">Build</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#F9F9FB] rounded-lg p-4 mb-4 text-center">
          <p className="text-[12px] text-[#AEAEB2]">
            Projet pas encore déployé sur Vercel
          </p>
          <button className="mt-2 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700">
            Configurer le déploiement →
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#AEAEB2]">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {project.lastDeployAt
            ? `Dernier deploy: ${new Date(project.lastDeployAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
            : "Jamais déployé"}
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              project.buildStatus === "success"
                ? "bg-green-500"
                : project.buildStatus === "building"
                ? "bg-amber-500 animate-pulse-dot"
                : "bg-red-500"
            }`}
          />
          Build {project.buildStatus}
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const healthyCount = MOCK_PROJECTS.filter(
    (p) => p.status === "healthy"
  ).length;
  const totalUptime =
    MOCK_PROJECTS.filter((p) => p.status !== "offline").reduce(
      (sum, p) => sum + p.uptimePercent,
      0
    ) / MOCK_PROJECTS.filter((p) => p.status !== "offline").length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-500" />
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#1D1D1F]">
              Maintenance
            </h1>
          </div>
          <p className="text-[14px] text-[#86868B]">
            Monitoring en continu. Agent nocturne actif à 2h00.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-[13px] font-semibold hover:bg-[#333] transition-colors">
          <RefreshCw className="w-4 h-4" />
          Check now
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">
              Projets live
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-[#1D1D1F]">
            {healthyCount}/{MOCK_PROJECTS.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">
              Uptime moyen
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-green-600">
            {totalUptime.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">
              Erreurs totales
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#86868B]" />
            <span className="text-[12px] font-semibold text-[#86868B]">
              Prochain scan
            </span>
          </div>
          <p className="text-[28px] font-extrabold text-[#1D1D1F]">2h00</p>
          <p className="text-[10px] text-[#AEAEB2]">Agent nocturne</p>
        </div>
      </div>

      {/* Project cards */}
      <div className="space-y-4">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Nightly report preview */}
      <div className="mt-8 bg-white rounded-xl border border-[#E5E5EA] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-blue-500" />
          <h2 className="text-[14px] font-bold text-[#1D1D1F]">
            Dernier rapport nocturne
          </h2>
          <span className="text-[11px] text-[#AEAEB2]">3 avril 2026, 02:15</span>
        </div>
        <div className="bg-[#1D1D1F] rounded-xl p-4 font-mono text-[11px] leading-relaxed">
          <p className="text-green-400">
            ✓ mova-recipe — Production stable, 0 erreurs runtime
          </p>
          <p className="text-green-400">
            ✓ heelio-decode — Stable, aucun commit récent
          </p>
          <p className="text-green-400">
            ✓ mova-landing — Landing Apple-style stable
          </p>
          <p className="text-amber-400">
            ⚠ therapilot — Pas encore sur Vercel, migration requise
          </p>
          <p className="text-[#86868B] mt-2">
            ─── Scan terminé en 12s. Prochain run: 4 avril 2026 02:00 ───
          </p>
        </div>
      </div>
    </div>
  );
}

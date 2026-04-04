"use client";

import {
  Radar,
  Signal,
  Code2,
  Shield,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Zap,
  Activity,
} from "lucide-react";
import Link from "next/link";

const MODULES = [
  {
    id: "radar",
    name: "Radar",
    description: "Détecte les idées d'apps à fort potentiel en scannant Reddit, Product Hunt, HN et plus.",
    icon: Radar,
    path: "/radar",
    color: "from-indigo-500 to-blue-600",
    stats: [
      { label: "Sources actives", value: "7" },
      { label: "Idées détectées", value: "10" },
      { label: "Nouvelles", value: "7" },
    ],
    status: "active" as const,
  },
  {
    id: "signal",
    name: "Signal",
    description: "Score et priorise chaque idée sur 5 dimensions avec verdicts GO / WAIT / NO.",
    icon: Signal,
    path: "/signal",
    color: "from-amber-500 to-orange-600",
    stats: [
      { label: "Évaluées", value: "3" },
      { label: "GO", value: "1" },
      { label: "Score moyen", value: "67" },
    ],
    status: "active" as const,
  },
  {
    id: "dev",
    name: "Développement",
    description: "Génère du code via Cursor Cloud Agents. Prompt → Code → GitHub → Deploy.",
    icon: Code2,
    path: "/dev",
    color: "from-emerald-500 to-green-600",
    stats: [
      { label: "Projets", value: "3" },
      { label: "Deployés", value: "2" },
      { label: "En cours", value: "1" },
    ],
    status: "active" as const,
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Monitoring 24/7 de tes projets. Uptime, erreurs, builds, alertes automatiques.",
    icon: Shield,
    path: "/maintenance",
    color: "from-blue-500 to-cyan-600",
    stats: [
      { label: "Projets suivis", value: "3" },
      { label: "Uptime", value: "99.9%" },
      { label: "Erreurs 24h", value: "0" },
    ],
    status: "active" as const,
  },
  {
    id: "growth",
    name: "Growth",
    description: "Landing pages, marketing automatisé et analytics de croissance pour chaque produit.",
    icon: Megaphone,
    path: "/growth",
    color: "from-pink-500 to-rose-600",
    stats: [
      { label: "Landing pages", value: "2" },
      { label: "Visitors/mois", value: "1.2k" },
      { label: "Conversions", value: "3.2%" },
    ],
    status: "beta" as const,
  },
];

const PIPELINE_STEPS = [
  { label: "Radar", icon: Radar, module: "radar", count: 10 },
  { label: "Signal", icon: Signal, module: "signal", count: 3 },
  { label: "Dev", icon: Code2, module: "dev", count: 3 },
  { label: "Live", icon: Activity, module: "maintenance", count: 2 },
  { label: "Growth", icon: Megaphone, module: "growth", count: 2 },
];

export default function Dashboard() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
          <span className="text-[12px] font-semibold text-[#86868B] uppercase tracking-wider">
            Système actif
          </span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#1D1D1F] mb-2">
          Studio OS
        </h1>
        <p className="text-[15px] text-[#86868B] max-w-xl">
          Ton app studio autonome. De l&apos;idée au revenu, chaque étape est
          automatisée.
        </p>
      </div>

      {/* Pipeline overview */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-indigo-500" />
          <h2 className="text-[14px] font-bold text-[#1D1D1F]">
            Pipeline Studio
          </h2>
        </div>
        <div className="flex items-center justify-between">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center">
                <Link
                  href={`/${step.module}`}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-[#86868B] group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868B] group-hover:text-[#1D1D1F] transition-colors">
                    {step.label}
                  </span>
                  <span className="text-[18px] font-bold text-[#1D1D1F]">
                    {step.count}
                  </span>
                </Link>
                {i < PIPELINE_STEPS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#D1D1D6] mx-6" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.id}
              href={mod.path}
              className="group bg-white rounded-2xl border border-[#E5E5EA] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 animate-fadeIn"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1D1D1F]">
                      {mod.name}
                    </h3>
                    {mod.status === "beta" && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        BETA
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D1D1D6] group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-[13px] text-[#86868B] leading-relaxed mb-5">
                {mod.description}
              </p>

              <div className="flex gap-4">
                {mod.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[18px] font-bold text-[#1D1D1F]">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-[#AEAEB2]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick stats bar */}
      <div className="mt-8 bg-white rounded-2xl border border-[#E5E5EA] p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-[13px] font-semibold text-[#1D1D1F]">
            Dernières 24h
          </span>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <span className="text-[13px] font-bold text-[#1D1D1F]">7</span>
            <span className="text-[11px] text-[#AEAEB2] ml-1">nouvelles idées</span>
          </div>
          <div className="text-center">
            <span className="text-[13px] font-bold text-[#1D1D1F]">1</span>
            <span className="text-[11px] text-[#AEAEB2] ml-1">verdict GO</span>
          </div>
          <div className="text-center">
            <span className="text-[13px] font-bold text-green-600">0</span>
            <span className="text-[11px] text-[#AEAEB2] ml-1">erreurs runtime</span>
          </div>
          <div className="text-center">
            <span className="text-[13px] font-bold text-[#1D1D1F]">99.9%</span>
            <span className="text-[11px] text-[#AEAEB2] ml-1">uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

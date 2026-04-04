"use client";

import { useState } from "react";
import {
  Megaphone,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  ExternalLink,
  Plus,
  BarChart3,
  ArrowUpRight,
  MousePointerClick,
  Eye,
  FileText,
  Palette,
  Rocket,
} from "lucide-react";

interface LandingPageItem {
  id: string;
  name: string;
  project: string;
  url: string;
  status: "published" | "draft";
  visitors: number;
  conversions: number;
  conversionRate: number;
}

const LANDING_PAGES: LandingPageItem[] = [
  {
    id: "1",
    name: "MOVA — Landing principale",
    project: "MOVA",
    url: "https://mova.food",
    status: "published",
    visitors: 842,
    conversions: 31,
    conversionRate: 3.7,
  },
  {
    id: "2",
    name: "Heelio — Site corporate",
    project: "Heelio",
    url: "https://heelio.io",
    status: "published",
    visitors: 356,
    conversions: 12,
    conversionRate: 3.4,
  },
];

const GROWTH_METRICS = [
  { month: "Nov", visitors: 320, signups: 8, revenue: 0 },
  { month: "Déc", visitors: 485, signups: 15, revenue: 0 },
  { month: "Jan", visitors: 612, signups: 22, revenue: 240 },
  { month: "Fév", visitors: 780, signups: 28, revenue: 480 },
  { month: "Mar", visitors: 1050, signups: 38, revenue: 720 },
  { month: "Avr", visitors: 1198, signups: 43, revenue: 960 },
];

const TEMPLATES = [
  {
    id: "saas-minimal",
    name: "SaaS Minimal",
    icon: FileText,
    description: "Landing épurée pour SaaS B2B, hero + features + pricing",
  },
  {
    id: "app-showcase",
    name: "App Showcase",
    icon: Palette,
    description: "Vitrine Apple-style avec screenshots et animations",
  },
  {
    id: "waitlist",
    name: "Waitlist",
    icon: Rocket,
    description: "Page d'attente avec compteur et email capture",
  },
];

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<"pages" | "analytics" | "generate">("pages");

  const totalVisitors = LANDING_PAGES.reduce((s, p) => s + p.visitors, 0);
  const totalConversions = LANDING_PAGES.reduce((s, p) => s + p.conversions, 0);
  const avgConversion = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-pink-500" />
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#1D1D1F]">
              Growth
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600">
              BETA
            </span>
          </div>
          <p className="text-[14px] text-[#86868B]">
            Landing pages, analytics et marketing automatisé.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 text-white text-[13px] font-semibold hover:bg-pink-600 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle landing
        </button>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">Visiteurs/mois</span>
          </div>
          <p className="text-[28px] font-extrabold text-[#1D1D1F]">{totalVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="w-4 h-4 text-green-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">Conversions</span>
          </div>
          <p className="text-[28px] font-extrabold text-green-600">{totalConversions}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">Taux conversion</span>
          </div>
          <p className="text-[28px] font-extrabold text-[#1D1D1F]">{avgConversion}%</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-[12px] font-semibold text-[#86868B]">MRR</span>
          </div>
          <p className="text-[28px] font-extrabold text-emerald-600">€960</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "pages" as const, label: "Landing Pages", icon: Globe },
          { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
          { id: "generate" as const, label: "Générateur IA", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1D1D1F] text-white"
                  : "bg-white text-[#86868B] border border-[#E5E5EA] hover:bg-[#F5F5F7]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "pages" && (
        <div className="space-y-3">
          {LANDING_PAGES.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl border border-[#E5E5EA] p-5 animate-fadeIn"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-[#1D1D1F]">
                    {page.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        page.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-[#F5F5F7] text-[#AEAEB2]"
                      }`}
                    >
                      {page.status === "published" ? "LIVE" : "DRAFT"}
                    </span>
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#AEAEB2] hover:text-[#1D1D1F] flex items-center gap-1"
                    >
                      {page.url.replace("https://", "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-[#1D1D1F]">
                      {page.visitors}
                    </p>
                    <p className="text-[10px] text-[#AEAEB2]">Visiteurs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-green-600">
                      {page.conversions}
                    </p>
                    <p className="text-[10px] text-[#AEAEB2]">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-amber-600">
                      {page.conversionRate}%
                    </p>
                    <p className="text-[10px] text-[#AEAEB2]">Taux</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-xl border border-[#E5E5EA] p-5">
          <h3 className="text-[14px] font-bold text-[#1D1D1F] mb-4">
            Évolution 6 mois
          </h3>
          {/* Simple text-based chart */}
          <div className="space-y-3">
            {GROWTH_METRICS.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="w-8 text-[12px] font-semibold text-[#86868B]">
                  {m.month}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-[#F5F5F7] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg transition-all duration-500"
                      style={{
                        width: `${(m.visitors / 1200) * 100}%`,
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1D1D1F]">
                      {m.visitors}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-[11px] font-bold text-green-600">
                      {m.signups} signups
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-[11px] font-bold text-emerald-600">
                      €{m.revenue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F0F0F2]">
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[12px] font-semibold text-green-600">
                +274% visiteurs sur 6 mois
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[12px] font-semibold text-emerald-600">
                MRR de €0 à €960
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "generate" && (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <button
                  key={tpl.id}
                  className="bg-white rounded-xl border border-[#E5E5EA] p-5 text-left hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <Icon className="w-6 h-6 text-pink-500 mb-3" />
                  <h3 className="text-[14px] font-bold text-[#1D1D1F] mb-1">
                    {tpl.name}
                  </h3>
                  <p className="text-[12px] text-[#86868B]">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-[#E5E5EA] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <h3 className="text-[14px] font-bold text-[#1D1D1F]">
                Génération IA
              </h3>
            </div>
            <textarea
              placeholder="Décris ta landing page idéale... Ex: 'Landing page pour un CRM WhatsApp destiné aux artisans français, ton professionnel mais accessible, avec section hero, features, pricing et CTA'"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none mb-3"
            />
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
              <Sparkles className="w-4 h-4" />
              Générer la landing page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

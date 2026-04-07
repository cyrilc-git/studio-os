"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

// ── Mock data ────────────────────────────────────────────────────────────────

const MODELS = [
  {
    id: "opus",
    name: "Claude Opus 4",
    color: "#6366F1",
    inputTokens: 1_240_000,
    outputTokens: 380_000,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.075,
  },
  {
    id: "sonnet",
    name: "Claude Sonnet 4",
    color: "#10B981",
    inputTokens: 8_600_000,
    outputTokens: 2_100_000,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
  },
  {
    id: "haiku",
    name: "Claude Haiku 4",
    color: "#F59E0B",
    inputTokens: 24_500_000,
    outputTokens: 6_200_000,
    costPer1kInput: 0.00025,
    costPer1kOutput: 0.00125,
  },
];

function computeCost(m: (typeof MODELS)[0]) {
  return (
    (m.inputTokens / 1000) * m.costPer1kInput +
    (m.outputTokens / 1000) * m.costPer1kOutput
  );
}

const totalInputTokens = MODELS.reduce((s, m) => s + m.inputTokens, 0);
const totalOutputTokens = MODELS.reduce((s, m) => s + m.outputTokens, 0);
const totalCost = MODELS.reduce((s, m) => s + computeCost(m), 0);

// 30-day daily series (mock — realistic growth curve)
const DAILY_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = subDays(new Date(), 29 - i);
  const factor = 0.5 + (i / 29) * 1.2 + Math.sin(i * 0.7) * 0.15;
  return {
    date: format(day, "MMM d"),
    opus: Math.round(41_333 * factor),
    sonnet: Math.round(356_667 * factor),
    haiku: Math.round(1_023_333 * factor),
  };
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function fmtCost(n: number) {
  return n < 0.01 ? "< $0.01" : `$${n.toFixed(2)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
        {label}
      </span>
      <span
        className="text-[28px] font-extrabold tracking-tight"
        style={{ color: accent ?? "#1D1D1F" }}
      >
        {value}
      </span>
      {sub && <span className="text-[12px] text-[#AEAEB2]">{sub}</span>}
    </div>
  );
}

function ModelRow({ model }: { model: (typeof MODELS)[0] }) {
  const cost = computeCost(model);
  const share = totalCost > 0 ? (cost / totalCost) * 100 : 0;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#F5F5F7] last:border-0">
      {/* Color dot + name */}
      <div className="flex items-center gap-2 w-36 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: model.color }}
        />
        <span className="text-[13px] font-semibold text-[#1D1D1F] truncate">
          {model.name}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${share}%`, background: model.color }}
        />
      </div>

      {/* Tokens */}
      <div className="text-right w-24 shrink-0">
        <p className="text-[13px] font-bold text-[#1D1D1F]">
          {fmtTokens(model.inputTokens + model.outputTokens)}
        </p>
        <p className="text-[10px] text-[#AEAEB2]">tokens</p>
      </div>

      {/* Cost */}
      <div className="text-right w-20 shrink-0">
        <p className="text-[13px] font-bold text-[#1D1D1F]">{fmtCost(cost)}</p>
        <p className="text-[10px] text-[#AEAEB2]">{share.toFixed(1)}%</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl shadow-lg p-3 text-[12px]">
      <p className="font-semibold text-[#1D1D1F] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-[#86868B]">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-semibold text-[#1D1D1F]">
            {fmtTokens(p.value)}
          </span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 border-t border-[#F5F5F7] flex justify-between font-bold text-[#1D1D1F]">
        <span>Total</span>
        <span>{fmtTokens(total)}</span>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export default function UsageDashboard() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[12px] font-semibold text-[#86868B] uppercase tracking-wider">
            Anthropic API
          </span>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#1D1D1F] mb-1">
          Dashboard Usage
        </h1>
        <p className="text-[14px] text-[#86868B]">
          Consommation tokens & coûts sur les 30 derniers jours
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Tokens total"
          value={fmtTokens(totalInputTokens + totalOutputTokens)}
          sub={`${fmtTokens(totalInputTokens)} input · ${fmtTokens(totalOutputTokens)} output`}
        />
        <StatCard
          label="Coût total"
          value={fmtCost(totalCost)}
          sub="30 derniers jours"
          accent="#6366F1"
        />
        <StatCard
          label="Tokens input"
          value={fmtTokens(totalInputTokens)}
          sub="prompt tokens"
        />
        <StatCard
          label="Tokens output"
          value={fmtTokens(totalOutputTokens)}
          sub="completion tokens"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[14px] font-bold text-[#1D1D1F]">
            Tokens / jour par modèle
          </h2>
          <div className="flex items-center gap-4">
            {MODELS.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: m.color }}
                />
                <span className="text-[11px] font-medium text-[#86868B]">
                  {m.id.charAt(0).toUpperCase() + m.id.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={DAILY_DATA}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              {MODELS.map((m) => (
                <linearGradient
                  key={m.id}
                  id={`grad-${m.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={m.color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#AEAEB2" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#AEAEB2" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmtTokens(v)}
              width={42}
            />
            <Tooltip content={<CustomTooltip />} />
            {MODELS.map((m) => (
              <Area
                key={m.id}
                type="monotone"
                dataKey={m.id}
                stroke={m.color}
                strokeWidth={2}
                fill={`url(#grad-${m.id})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Model breakdown */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6">
        <h2 className="text-[14px] font-bold text-[#1D1D1F] mb-4">
          Breakdown par modèle
        </h2>
        <div>
          {/* Header row */}
          <div className="flex items-center gap-4 pb-2 border-b border-[#E5E5EA] mb-1">
            <span className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-wider w-36 shrink-0">
              Modèle
            </span>
            <span className="flex-1" />
            <span className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-wider w-24 text-right shrink-0">
              Tokens
            </span>
            <span className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-wider w-20 text-right shrink-0">
              Coût
            </span>
          </div>
          {MODELS.map((m) => (
            <ModelRow key={m.id} model={m} />
          ))}
        </div>

        {/* Total row */}
        <div className="mt-3 pt-3 border-t border-[#E5E5EA] flex items-center gap-4">
          <span className="text-[12px] font-bold text-[#1D1D1F] w-36 shrink-0">
            Total
          </span>
          <div className="flex-1" />
          <span className="text-[13px] font-bold text-[#1D1D1F] w-24 text-right shrink-0">
            {fmtTokens(totalInputTokens + totalOutputTokens)}
          </span>
          <span className="text-[13px] font-bold text-indigo-600 w-20 text-right shrink-0">
            {fmtCost(totalCost)}
          </span>
        </div>
      </div>

      {/* Wire-up notice */}
      <p className="mt-4 text-center text-[11px] text-[#D1D1D6]">
        Mock data — sera connecté à{" "}
        <code className="font-mono">GET /v1/organizations/usage_report</code>{" "}
        Anthropic API
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Code2,
  Send,
  GitBranch,
  ExternalLink,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Terminal,
  FolderGit2,
  Globe,
  ChevronRight,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: "live" | "building" | "idle";
  repo?: string;
  url?: string;
  lastMessage?: string;
}

const EXISTING_PROJECTS: Project[] = [
  {
    id: "mova",
    name: "MOVA",
    status: "live",
    repo: "cyrilc-git/mova-recipe",
    url: "https://app.mova.food",
    lastMessage: "Migration post-Lovable terminée",
  },
  {
    id: "heelio",
    name: "Heelio Decode",
    status: "live",
    repo: "cyrilc-git/heelio-decode",
    url: "https://decode.heelio.io",
    lastMessage: "Dashboard stable, aucun commit récent",
  },
  {
    id: "therapilot",
    name: "Therapilot",
    status: "building",
    repo: "cyrilc-git/therapilot-ai-copilot",
    lastMessage: "En attente de migration Lovable → Vercel",
  },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function DevPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Studio OS Dev — Connecté à Cursor Cloud Agents.\nDécris ton projet ou ta feature, et je génère le code, crée le repo GitHub, et deploy sur Vercel automatiquement.",
      timestamp: new Date(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsGenerating(true);

    // Simulate Cursor Cloud Agent response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**Compris !** Je lance la génération via Cursor Cloud Agent.

**Pipeline en cours :**
1. ✅ Analyse du prompt
2. ✅ Architecture définie (Next.js + Supabase + Tailwind)
3. ⏳ Génération du code...
4. ⬜ Push GitHub → \`cyrilc-git/new-project\`
5. ⬜ Deploy Vercel → preview URL

*Le Cursor Agent travaille... La preview sera disponible dans ~2 min.*

\`\`\`
POST /api/v1/cursor/agents
{
  "prompt": "${inputValue.substring(0, 60)}...",
  "stack": ["next.js", "supabase", "tailwind"],
  "deploy": "vercel",
  "repo": "cyrilc-git/auto-generated"
}
\`\`\``,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 h-[calc(100vh-0px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Code2 className="w-5 h-5 text-emerald-500" />
          <h1 className="text-[24px] font-extrabold tracking-tight text-[#1D1D1F]">
            Dev
          </h1>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600">
            Cursor Cloud Agents
          </span>
        </div>
        <p className="text-[14px] text-[#86868B]">
          Décris → Génère → Deploy. Prompt-to-production en minutes.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar - Projects */}
        <div className="w-[240px] flex-shrink-0">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 transition-colors mb-4">
            <Plus className="w-4 h-4" />
            Nouveau projet
          </button>

          <div className="space-y-2">
            {EXISTING_PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProject(proj.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedProject === proj.id
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-[#E5E5EA] bg-white hover:bg-[#F5F5F7]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-[#1D1D1F]">
                    {proj.name}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      proj.status === "live"
                        ? "bg-green-500"
                        : proj.status === "building"
                        ? "bg-amber-500 animate-pulse-dot"
                        : "bg-[#D1D1D6]"
                    }`}
                  />
                </div>
                <p className="text-[11px] text-[#AEAEB2] line-clamp-1">
                  {proj.lastMessage}
                </p>
                {proj.url && (
                  <div className="flex items-center gap-3 mt-2">
                    <a
                      href={`https://github.com/${proj.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#AEAEB2] hover:text-[#1D1D1F] flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitBranch className="w-3 h-3" />
                      repo
                    </a>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#AEAEB2] hover:text-[#1D1D1F] flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-3 h-3" />
                      live
                    </a>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="mt-6 bg-white rounded-xl border border-[#E5E5EA] p-4">
            <h3 className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-3">
              Pipeline
            </h3>
            <div className="space-y-2">
              {[
                { icon: Terminal, label: "Prompt", color: "text-indigo-500" },
                {
                  icon: Code2,
                  label: "Cursor Agent",
                  color: "text-emerald-500",
                },
                {
                  icon: FolderGit2,
                  label: "GitHub Push",
                  color: "text-gray-700",
                },
                { icon: Rocket, label: "Vercel Deploy", color: "text-blue-500" },
                { icon: Globe, label: "Preview Live", color: "text-green-500" },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                    <span className="text-[11px] text-[#86868B]">
                      {step.label}
                    </span>
                    {i < 4 && (
                      <ChevronRight className="w-3 h-3 text-[#D1D1D6] ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white"
                      : msg.role === "system"
                      ? "bg-[#F5F5F7] text-[#86868B]"
                      : "bg-[#F9F9FB] text-[#1D1D1F] border border-[#E5E5EA]"
                  }`}
                >
                  <p
                    className="text-[13px] leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold">$1</strong>'
                        )
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="bg-black/5 px-1 rounded text-[12px] font-mono">$1</code>'
                        )
                        .replace(/```[\s\S]*?```/g, (match) => {
                          const code = match.replace(/```\w*\n?/g, "").trim();
                          return `<pre class="bg-[#1D1D1F] text-green-400 p-3 rounded-lg mt-2 text-[11px] font-mono overflow-x-auto">${code}</pre>`;
                        }),
                    }}
                  />
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#F9F9FB] border border-[#E5E5EA] rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span className="text-[13px] text-[#86868B]">
                    Cursor Agent travaille...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#E5E5EA] p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Décris ton app ou ta feature..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E5EA] text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isGenerating}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] text-[#AEAEB2]">
                Powered by Cursor Cloud Agents API
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-600 font-medium">
                  Connecté
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

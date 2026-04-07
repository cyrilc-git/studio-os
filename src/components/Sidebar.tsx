"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radar,
  Signal,
  Code2,
  Shield,
  Megaphone,
  LayoutDashboard,
  Zap,
  BarChart2,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Usage API", path: "/dashboard", icon: BarChart2, color: "#6366F1" },
  { label: "Radar", path: "/radar", icon: Radar, color: "#6366F1" },
  { label: "Signal", path: "/signal", icon: Signal, color: "#F59E0B" },
  { label: "Dev", path: "/dev", icon: Code2, color: "#10B981" },
  { label: "Maintenance", path: "/maintenance", icon: Shield, color: "#3B82F6" },
  { label: "Growth", path: "/growth", icon: Megaphone, color: "#EC4899" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-[#E5E5EA] flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E5E5EA]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-[15px] tracking-tight text-[#1D1D1F]">
              Studio OS
            </span>
            <span className="text-[10px] text-[#AEAEB2] ml-1.5 font-medium">
              v1.0
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/" && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#F0F0F5] text-[#1D1D1F]"
                  : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
              }`}
            >
              <Icon
                className="w-[18px] h-[18px]"
                style={{ color: isActive ? item.color || "#1D1D1F" : undefined }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-[#E5E5EA]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-[11px] font-bold">
            C
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#1D1D1F]">Cyril</p>
            <p className="text-[10px] text-[#AEAEB2]">Solo Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

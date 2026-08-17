"use client";

import {
  Activity,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  Sparkles,
} from "lucide-react";

const NAV = [
  { id: "ops", label: "Operations", icon: LayoutDashboard, active: true },
  { id: "inventory", label: "Inventory", icon: Package, active: false },
  { id: "campaigns", label: "Campaigns", icon: Mail, active: false },
  { id: "agents", label: "Agents", icon: Sparkles, active: false },
  { id: "telemetry", label: "Telemetry", icon: Activity, active: false },
] as const;

export function Sidebar() {
  return (
    <aside className="flex w-[68px] shrink-0 flex-col items-center border-r border-neutral-200 bg-white py-5">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 shadow-sm">
        <span className="font-mono text-sm font-bold tracking-tight text-white">
          H
        </span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV.map(({ id, label, icon: Icon, active }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
              active
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {active && (
              <span className="absolute left-0 h-5 w-0.5 rounded-r bg-neutral-900" />
            )}
            <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        title="Settings"
        aria-label="Settings"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
      >
        <Settings size={18} strokeWidth={1.75} />
      </button>
    </aside>
  );
}

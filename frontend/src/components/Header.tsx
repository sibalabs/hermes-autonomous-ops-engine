"use client";

import { Loader2, Play, Radio } from "lucide-react";
import type { WorkflowStatus } from "@/lib/types";

type HeaderProps = {
  status: WorkflowStatus;
  onExecute: () => void;
  cooldownLabel?: string | null;
};

export function Header({ status, onExecute, cooldownLabel }: HeaderProps) {
  const running = status === "running";
  const coolingDown = Boolean(cooldownLabel);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[15px] font-medium tracking-wide text-neutral-900">
            Hermes{" "}
            <span className="text-neutral-400">{"//"}</span>{" "}
            <span className="text-neutral-600">
              E-Commerce Autonomous Operations
            </span>
          </h1>
          <p className="mt-0.5 text-[11px] tracking-wider text-neutral-400">
            MULTI-AGENT DAILY WORKFLOW · CREWAI SEQUENTIAL PIPELINE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 sm:flex">
          <Radio
            size={12}
            className={
              status === "running"
                ? "animate-status-pulse text-emerald-500"
                : status === "complete"
                  ? "text-emerald-600"
                  : status === "error"
                    ? "text-red-500"
                    : "text-neutral-400"
            }
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            {status === "idle" && "Standby"}
            {status === "running" && "Crew Executing"}
            {status === "complete" && "Workflow Complete"}
            {status === "error" && "Error"}
          </span>
        </div>

        <button
          type="button"
          onClick={onExecute}
          disabled={running}
          className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Play size={14} className="fill-white" />
          )}
          {running
            ? "Executing…"
            : coolingDown
              ? `Available in ${cooldownLabel}`
              : "Execute Daily Workflow"}
        </button>
      </div>
    </header>
  );
}

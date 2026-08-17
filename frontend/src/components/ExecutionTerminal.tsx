"use client";

import { useEffect, useRef } from "react";
import { TerminalSquare } from "lucide-react";
import type { StreamEvent, WorkflowStatus } from "@/lib/types";

type ExecutionTerminalProps = {
  logs: StreamEvent[];
  status: WorkflowStatus;
};

const AGENT_COLORS: Record<string, string> = {
  Orchestrator: "text-neutral-700",
  "Inventory Analyst": "text-violet-700",
  "Market Intelligence Scout": "text-cyan-800",
  "Growth Marketer": "text-fuchsia-700",
};

function prefixFor(type: StreamEvent["type"]) {
  switch (type) {
    case "agent_start":
      return "▶";
    case "thought":
      return "··";
    case "tool":
      return "⚙";
    case "output":
      return "✓";
    case "campaign":
      return "✉";
    case "error":
      return "✗";
    case "done":
      return "■";
    default:
      return "·";
  }
}

export function ExecutionTerminal({ logs, status }: ExecutionTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <section className="flex h-[400px] w-full shrink-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <TerminalSquare size={14} />
            <span className="font-mono text-[11px] tracking-wide">
              hermes://crew/live-execution
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
          {status === "running" ? "streaming" : status}
        </span>
      </div>

      <div className="hermes-scroll min-h-0 flex-1 overflow-x-auto overflow-y-auto bg-[#FCFAF8] p-4 font-mono text-[12.5px] leading-6 text-neutral-900">
        {logs.length === 0 ? (
          <div className="text-neutral-600">
            <p className="font-medium text-neutral-800">$ hermes await --workflow daily</p>
            <p className="mt-2 text-neutral-700">
              {"// Waiting for Execute Daily Workflow…"}
              <span className={status === "idle" ? "cursor-blink-light" : ""} />
            </p>
            <p className="mt-4 text-neutral-500">
              Agents: Inventory Analyst → Market Intelligence Scout → Growth
              Marketer
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log, i) => {
              const agent = log.agent || "system";
              const color = AGENT_COLORS[agent] || "text-neutral-900";
              const isError = log.type === "error";
              const isOutput = log.type === "output" || log.type === "campaign";

              return (
                <div
                  key={`${i}-${log.type}-${log.message.slice(0, 24)}`}
                  className={`fade-up whitespace-pre break-words font-medium ${
                    isError
                      ? "text-red-700"
                      : isOutput
                        ? "text-emerald-800"
                        : "text-neutral-900"
                  }`}
                  style={{ animationDelay: "0ms" }}
                >
                  <span className="font-semibold text-neutral-500">
                    {prefixFor(log.type)}{" "}
                  </span>
                  <span className={`font-semibold ${color}`}>[{agent}]</span>{" "}
                  <span className="font-normal text-neutral-500">{log.type}</span>
                  {"  "}
                  <span>{log.message}</span>
                </div>
              );
            })}
            {status === "running" && (
              <div className="cursor-blink-light pt-1 text-neutral-800" />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
  className?: string;
  /** Slightly larger rendering for wide sequence diagrams. */
  large?: boolean;
};

export function MermaidDiagram({
  chart,
  className,
  large = false,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const isSequence = chart.trim().startsWith("sequenceDiagram");

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!containerRef.current) return;

      try {
        const mermaid = (await import("mermaid")).default;
        const enlarge = large || isSequence;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "#ffffff",
            primaryColor: "#eef2ff",
            primaryTextColor: "#171717",
            primaryBorderColor: "#c7d2fe",
            lineColor: "#a3a3a3",
            secondaryColor: "#fafafa",
            tertiaryColor: "#f5f5f5",
            fontFamily:
              "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            fontSize: enlarge ? "16px" : "14px",
          },
          flowchart: {
            curve: "basis",
            padding: 16,
            htmlLabels: true,
            nodeSpacing: 50,
            rankSpacing: 60,
          },
          sequence: {
            actorMargin: 32,
            boxMargin: 10,
            boxTextMargin: 6,
            noteMargin: 10,
            messageMargin: 36,
            mirrorActors: false,
            useMaxWidth: true,
            width: 160,
            height: 50,
            actorFontSize: 14,
            actorFontWeight: 600,
            messageFontSize: 13,
            messageFontWeight: 500,
            noteFontSize: 12,
          },
        });

        const renderId = `mermaid-${reactId}-${Date.now()}`;
        const { svg } = await mermaid.render(renderId, chart.trim());

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.setAttribute("width", "100%");
            svgEl.removeAttribute("height");
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
            if (enlarge) {
              svgEl.style.minHeight = "480px";
            }
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram",
          );
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId, large, isSequence]);

  if (error) {
    return (
      <p className="text-sm text-neutral-500" role="alert">
        Diagram unavailable: {error}
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full overflow-x-auto"}
      aria-label="Architecture flowchart"
    />
  );
}

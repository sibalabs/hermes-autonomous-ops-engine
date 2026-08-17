"use client";

import { useState } from "react";
import Link from "next/link";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { SiteHeader } from "@/components/SiteHeader";

type TabId = "glance" | "system" | "audit";

const TABS: { id: TabId; label: string }[] = [
  { id: "glance", label: "At a glance" },
  { id: "system", label: "System map" },
  { id: "audit", label: "Audit flow" },
];

const CHARTS: Record<TabId, string> = {
  glance: `
graph LR
  A[1. Read Inventory] --> B[2. Filter Overstock]
  B --> C[3. Market Research]
  C --> D[4. Draft Campaign]
  D --> E[5. Output HTML]
`,
  system: `
graph TB
  subgraph Data["Data Layer"]
    SB[(Supabase Postgres)]
    PV[pgvector Embeddings]
  end

  subgraph Orchestration["Orchestration Layer"]
    API[FastAPI Backend]
    CREW[CrewAI Pipeline]
  end

  subgraph Agents["Agent Layer"]
    IA[Inventory Analyst]
    MS[Market Scout]
    GM[Growth Marketer]
  end

  subgraph Client["Client Layer"]
    NX[Next.js Dashboard]
    SSE[SSE Live Stream]
  end

  SB --> PV
  PV --> API
  API --> CREW
  CREW --> IA
  IA --> MS
  MS --> GM
  GM --> API
  API --> SSE
  SSE --> NX
`,
  audit: `
sequenceDiagram
  actor Operator as Operator
  participant Dash as Hermes Dashboard
  participant API as FastAPI
  participant Crew as CrewAI Orchestrator
  participant Analyst as Inventory Analyst
  participant Scout as Market Intelligence Scout
  participant Marketer as Growth Marketer
  participant DB as Supabase inventory

  Operator->>Dash: 1 Execute Daily Workflow
  Dash->>API: 2 GET /api/run-crew SSE
  API->>Crew: 3 run_crew_stream
  Crew->>DB: 4 Fetch inventory rows
  DB-->>Crew: 5 Catalog data
  Crew->>Crew: 6 Filter overstock stock >= threshold x 3
  Crew->>Analyst: 7 Analyze overstock task
  Analyst-->>Crew: 8 Clearance priority report
  Crew-->>API: 9 SSE agent_start thought output
  API-->>Dash: 10 Stream Execution Terminal
  Crew->>Scout: 11 Market intelligence task
  Scout-->>Crew: 12 Trend brief and promo angles
  Crew-->>API: 13 SSE scout events
  API-->>Dash: 14 Append terminal trail
  Crew->>Marketer: 15 Draft HTML campaign
  Marketer-->>Crew: 16 Subject preview audience HTML
  Crew-->>API: 17 campaign and done events
  API-->>Dash: 18 Campaign payload
  Dash-->>Operator: 19 Live terminal plus campaign preview
`,
}

export function ArchitectureContent() {
  const [activeTab, setActiveTab] = useState<TabId>("glance");

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <SiteHeader />

      <main
        className={`mx-auto px-6 py-16 md:py-20 ${
          activeTab === "audit" ? "max-w-7xl" : "max-w-5xl"
        }`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">
          System Design
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Hermes Architecture
        </h1>
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-neutral-500">
          End-to-end flow from Supabase inventory tracking through CrewAI
          orchestration, real-time market intelligence, and automated campaign
          generation.
        </p>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Architecture views">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={
                  isActive
                    ? "rounded-md border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-600"
                    : "rounded-md border border-transparent bg-transparent px-3.5 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          className="my-8 flex items-center justify-center overflow-x-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        >
          <MermaidDiagram
            key={activeTab}
            chart={CHARTS[activeTab]}
            large={activeTab === "audit"}
            className="w-full overflow-x-auto [&_svg]:mx-auto"
          />
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Back to Hermes
        </Link>
      </main>
    </div>
  );
}

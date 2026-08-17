import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const SECTIONS = [
  {
    title: "The Business Problem",
    body: "E-commerce operations suffer from disjointed inventory tracking and lagging manual pricing strategies. Without 24/7 market intelligence, brands are consistently outpriced by competitors in real-time, leaving massive profit margins on the table.",
  },
  {
    title: "Measurable ROI & Impact",
    body: "Enables fully autonomous inventory tracking and dynamic pricing adjustments. Provides 24/7 market intelligence monitoring, allowing brands to optimize revenue margins instantly without human bottlenecking.",
  },
  {
    title: "Team Enablement & Mentorship",
    body: "As a Lead AI Architect, my engagement does not end at deployment. I actively mentor internal engineering teams on Zero-Trust AI perimeters, multi-agent orchestration, and prompt security—ensuring your developers can securely scale the architecture long after the initial build.",
  },
];

const TECH_STACK = [
  "Supabase",
  "Multi-Agent Operations",
  "Real-Time Dynamic Pricing",
  "Competitor Intelligence APIs",
];

export function UseCaseContent() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Use Case
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Hermes — E-Commerce Ops Engine
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-neutral-500">
          Autonomous multi-agent operations system orchestrating Supabase
          inventory tracking, real-time market intelligence, and dynamic
          pricing.
        </p>

        <div className="space-y-8">
          {SECTIONS.slice(0, 2).map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-neutral-900">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-neutral-500">
                {section.body}
              </p>
            </section>
          ))}

          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-neutral-900">
              Technical Execution Summary
            </h2>
            <ul className="flex flex-wrap gap-2">
              {TECH_STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-neutral-900">
              {SECTIONS[2].title}
            </h2>
            <p className="text-base leading-relaxed text-neutral-500">
              {SECTIONS[2].body}
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Back to Hermes
        </Link>
      </main>
    </div>
  );
}

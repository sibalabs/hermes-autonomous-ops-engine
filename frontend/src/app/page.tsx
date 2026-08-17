import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Hermes // Ops Engine",
  description:
    "Multi-agent orchestration engine connecting Supabase inventory to autonomous outbound marketing.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const features = [
  {
    title: "Inventory Analyst",
    description:
      "Reads Supabase pgvector logic to surface overstock SKUs and aging inventory before it becomes dead stock.",
  },
  {
    title: "Market Intelligence Scout",
    description:
      "Scrapes real-time pricing and sentiment signals so every campaign decision is grounded in live market context.",
  },
  {
    title: "Growth Marketer",
    description:
      "Drafts high-converting HTML campaigns from pipeline output — ready to review, refine, and ship.",
  },
];

const hireChecklist = [
  "CrewAI multi-agent orchestration on Python FastAPI",
  "Next.js 14 operations dashboard with live execution streaming",
  "Supabase database integrations for real-time inventory tracking",
  "Automated market intelligence & targeted campaign generation",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Navigation */}
      <header className="border-b border-neutral-200/80 bg-neutral-50/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-neutral-900"
          >
            Hermes
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/use-case"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Use Case
            </Link>
            <Link
              href="/architecture"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Architecture
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Live Demo
            </Link>
            <a
              href="#hire"
              className="rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Hire AI Architect
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
          <div className="inline-flex items-center rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
            Multi-Agent Orchestration Engine
          </div>

          <h1 className="mt-8 text-balance text-5xl font-medium tracking-tight text-neutral-900 md:text-7xl">
            E-Commerce Operations, Fully Autonomous.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-neutral-500 md:text-lg">
            A sequential CrewAI pipeline connecting Supabase inventory data to
            dynamic outbound marketing campaigns in real-time.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Launch Dashboard ↗
          </Link>

          <div className="relative mx-auto mt-16 max-w-5xl sm:mt-24">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-2xl bg-neutral-900/[0.04] blur-2xl sm:-inset-6"
            />
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]">
              <Image
                src="/hermes-dashboard-preview.png"
                alt="Hermes operations dashboard showing live inventory, agent execution terminal, and generated campaign email"
                width={3200}
                height={1960}
                quality={100}
                priority
                className="h-auto w-full"
                sizes="(max-width: 1280px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>

        {/* Feature Grid — Bento */}
        <section
          id="architecture"
          className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24 md:pb-32"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300"
              >
                <div className="mb-4 h-px w-8 bg-neutral-900 transition-all group-hover:w-12" />
                <h2 className="text-base font-medium tracking-tight text-neutral-900">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hire / Conversion CTA */}
        <section
          id="hire"
          className="scroll-mt-20 border-t border-neutral-200 bg-white py-20"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Ready to Scale E-Commerce Operations
            </p>
            <h2 className="mb-6 text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
              Hire the AI Architect Behind Hermes
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-neutral-500">
              Looking to deploy custom multi-agent workflows, autonomous
              inventory management, or dynamic outbound marketing pipelines for
              your brand?
            </p>

            <ul className="mx-auto grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
              {hireChecklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-neutral-600 md:text-base"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://www.upwork.com/freelancers/~01c74e810b92cb4ef5"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-neutral-900 px-8 py-3 font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                Hire Me on Upwork
              </a>
              <Link
                href="/use-case"
                className="rounded-md border border-neutral-200 bg-white px-8 py-3 font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
              >
                Use Case
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-neutral-500">
            Hermes Autonomous E-Commerce Operations Engine. Architected for
            enterprise scale. © 2026 SIBA Labs, LLC
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-neutral-400">
            DISCLAIMER: This application is a live technical demonstration of
            multi-agent AI orchestration. It actively utilizes the CrewAI
            framework for real-time inventory analysis and marketing campaign
            generation. This is a portfolio asset, not a commercial product. All
            generated market intelligence, inventory insights, and outbound HTML
            marketing assets are strictly for demonstrative purposes and do not
            constitute formal e-commerce operations, consumer deployment, or
            commercial financial advisory.
          </p>
        </div>
      </footer>
    </div>
  );
}

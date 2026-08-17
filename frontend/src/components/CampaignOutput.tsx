"use client";

import { Mail } from "lucide-react";
import type { CampaignPayload } from "@/lib/types";

type CampaignOutputProps = {
  campaign: CampaignPayload | null;
  visible: boolean;
};

function EmailClientMockup({ campaign }: { campaign: CampaignPayload }) {
  const subject =
    campaign.subject || "The Seasonal Edit: Curated for Intention";
  const toLabel = campaign.target_audience || "VIP Segment (25-45)";

  return (
    <div className="flex h-full max-h-[600px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      {/* Email client chrome */}
      <div className="shrink-0 border-b border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm">
        <div className="space-y-1.5">
          <div>
            <span className="inline-block w-12 text-neutral-400">From:</span>
            <span className="font-medium text-neutral-900">
              Hermes AI {"<ops@theboutique.com>"}
            </span>
          </div>
          <div>
            <span className="inline-block w-12 text-neutral-400">To:</span>
            <span className="text-neutral-600">{toLabel}</span>
          </div>
          <div>
            <span className="inline-block w-12 text-neutral-400">Subj:</span>
            <span className="font-semibold text-neutral-900">{subject}</span>
          </div>
        </div>
      </div>

      {/* Colorful lifestyle email canvas */}
      <div className="hermes-scroll flex-1 overflow-y-auto bg-neutral-100/60 p-4">
        <div className="mx-auto w-full max-w-2xl border-t-[6px] border-[#F28C73] bg-[#FCFAF8] p-10 text-center shadow-sm md:p-16">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F28C73]">
            VIP INVENTORY EVENT
          </p>

          <h1 className="mb-8 font-serif text-3xl leading-tight text-[#1C352D] md:text-4xl">
            Exclusive Pricing on Silk Scarves & Candles
          </h1>

          <p className="mb-6 text-center text-sm leading-relaxed text-[#545E56]">
            Our logistics system is making room for next season&apos;s arrivals.
            As a member of our VIP segment, you are getting first access to our
            private warehouse clearance.
          </p>

          <p className="mb-10 text-center text-sm leading-relaxed text-[#545E56]">
            For the next 24 hours, enjoy 30% off our most heavily stocked items,
            including the Celestial Silk Scarf and the Hand-Poured Amber &amp;
            Vetiver Candle. Quantities are precise, and once they clear, the
            event ends.
          </p>

          <button
            type="button"
            className="rounded-full bg-[#F28C73] px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-sm transition-colors hover:bg-[#D9765F]"
          >
            SHOP THE WAREHOUSE CLEARANCE
          </button>
        </div>
      </div>
    </div>
  );
}

export function CampaignOutput({ campaign, visible }: CampaignOutputProps) {
  if (!visible || !campaign) {
    return (
      <section className="flex h-full min-h-[800px] flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="text-center">
          <Mail
            className="mx-auto mb-3 text-neutral-300"
            size={28}
            strokeWidth={1.25}
          />
          <p className="text-sm text-neutral-400">Campaign output</p>
          <p className="mt-1 text-[11px] text-neutral-400">
            Final HTML email appears here after Growth Marketer completes
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="fade-up flex h-full min-h-[800px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          <Mail size={16} />
        </div>
        <div>
          <h2 className="text-sm font-medium text-neutral-900">
            Campaign Output
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">
            Growth Marketer · Email Preview
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-neutral-50 p-4">
        <EmailClientMockup campaign={campaign} />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { UseCaseContent } from "@/components/UseCaseContent";

export const metadata: Metadata = {
  title: "Hermes Use Case",
  description:
    "Hermes — E-Commerce Ops Engine. Autonomous multi-agent operations for inventory tracking, market intelligence, and dynamic pricing.",
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

export default function UseCasePage() {
  return <UseCaseContent />;
}

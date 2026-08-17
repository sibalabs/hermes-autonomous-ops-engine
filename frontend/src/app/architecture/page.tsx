import type { Metadata } from "next";
import { ArchitectureContent } from "@/components/ArchitectureContent";

export const metadata: Metadata = {
  title: "Hermes Architecture",
  description:
    "System design for Hermes — Supabase inventory, CrewAI orchestration, and automated campaign generation.",
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

export default function ArchitecturePage() {
  return <ArchitectureContent />;
}

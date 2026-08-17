"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/use-case", label: "Use Case" },
  { href: "/architecture", label: "Architecture" },
  { href: "/dashboard", label: "Live Demo" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200/80 bg-neutral-50/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-neutral-900"
        >
          Hermes
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-sm text-neutral-900"
                    : "text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="/#hire"
            className="rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Hire AI Architect
          </a>
        </nav>
      </div>
    </header>
  );
}

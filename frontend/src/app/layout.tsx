import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hermes // E-Commerce Autonomous Operations",
  description:
    "Project Hermes — elite multi-agent AI system for boutique e-commerce daily operations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* CRITICAL OPSEC: prevent search engine indexing */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow, noimageindex" />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} bg-neutral-50 font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

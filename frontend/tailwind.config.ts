import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hermes: {
          violet: "#8b5cf6",
          cyan: "#22d3ee",
          terminal: "#FCFAF8",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      keyframes: {
        "status-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
      },
      animation: {
        "status-pulse": "status-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

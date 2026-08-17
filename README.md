# Hermes — Autonomous E-Commerce Ops Engine

**Hermes** is a full-stack, AI-native operations system architected to automate e-commerce inventory tracking and outbound marketing. 

Built with a decoupled frontend/backend architecture, Hermes utilizes a Next.js 14 dashboard to stream real-time execution data from a Python FastAPI backend, where a sequential multi-agent CrewAI pipeline makes autonomous operational decisions grounded in live Supabase vector data.

### 🧠 The Multi-Agent Pipeline
1. **Inventory Analyst:** Reads Supabase pgvector logic to surface overstock SKUs and aging inventory before it becomes dead stock.
2. **Market Intelligence Scout:** Scrapes real-time pricing and sentiment signals so every campaign decision is grounded in live market context.
3. **Growth Marketer:** Drafts high-converting HTML campaigns from pipeline output — ready to review, refine, and ship.

### 🛠️ Tech Stack
* **Frontend:** Next.js 14, React, Tailwind CSS
* **Backend:** Python, FastAPI
* **AI Orchestration:** CrewAI (Multi-Agent Sequential Pipeline)
* **Database:** Supabase (PostgreSQL, pgvector)

---
*Note: Proprietary AI prompts and multi-agent system instructions have been abstracted to a secure environment vault for this public repository deployment.*
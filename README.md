# Hermes — Autonomous E-Commerce Ops Engine

**Hermes** is a full-stack, AI-native operations system architected to automate e-commerce inventory tracking and outbound marketing. 

Built with a decoupled frontend/backend architecture, Hermes utilizes a Next.js 14 dashboard to stream real-time execution data from a Python FastAPI backend, where a sequential multi-agent CrewAI pipeline makes autonomous operational decisions grounded in live Supabase vector data.

## 🧠 The Multi-Agent Pipeline

1. **Inventory Analyst:** Reads Supabase pgvector logic to surface overstock SKUs and aging inventory before it becomes dead stock.
2. **Market Intelligence Scout:** Scrapes real-time pricing and sentiment signals so every campaign decision is grounded in live market context.
3. **Growth Marketer:** Drafts high-converting HTML campaigns from pipeline output — ready to review, refine, and ship.

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React, Tailwind CSS
* **Backend:** Python, FastAPI
* **AI Orchestration:** CrewAI (Multi-Agent Sequential Pipeline)
* **Database & Vector Search:** Supabase (PostgreSQL, pgvector)

## 📂 Repository Structure

* `/backend` — Python FastAPI application, CrewAI agents, task configurations, and secure environment vaults.
* `/frontend` — Next.js 14 application dashboard, real-time execution logs, and live operational dashboard.

## 🔒 Security & Intellectual Property Note

> *Proprietary AI prompts, multi-agent system instructions, and operational logic have been abstracted out of the source code and load dynamically via environment variables (`os.getenv`) in `backend/crew_orchestrator.py`. See `backend/.env.example` for the public redaction structure.*

## 📜 License

Copyright (c) 2026 Siba Labs, LLC. All Rights Reserved. 

This source code and accompanying documentation are provided strictly for technical portfolio demonstration, conceptual review, and recruitment evaluation purposes.

Permission is hereby granted to view and fork this repository for personal, non-commercial evaluation. 

You may NOT use, modify, reproduce, distribute, or commercially deploy this software, its architecture, or its proprietary multi-agent orchestration logic without explicit, prior written permission from the copyright holder.

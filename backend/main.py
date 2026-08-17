"""
Project Hermes — FastAPI Backend

Streams CrewAI multi-agent execution logs to the Next.js dashboard via SSE.
"""

from __future__ import annotations

import json
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from crew_orchestrator import MOCK_INVENTORY, StreamEvent, fetch_inventory, run_crew_stream

load_dotenv()

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="Project Hermes API",
    description="E-Commerce Autonomous Operations — multi-agent CrewAI engine",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    service: str


class InventoryResponse(BaseModel):
    items: list[dict[str, Any]]
    source: str


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", service="hermes-backend")


@app.get("/api/inventory", response_model=InventoryResponse)
async def get_inventory() -> InventoryResponse:
    """Return live Supabase inventory, or mock boutique catalog."""
    items = fetch_inventory()
    source = "supabase" if items is not MOCK_INVENTORY else "mock"
    # fetch_inventory may return supabase rows that equal mock shape — detect via env
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")
    if url and key and "your-project" not in url and "your-supabase" not in key:
        source = "supabase"
    else:
        source = "mock"
    return InventoryResponse(items=items, source=source)


def _format_sse(event: StreamEvent) -> str:
    payload = event.model_dump()
    return f"data: {json.dumps(payload)}\n\n"


@app.get("/api/run-crew")
async def run_crew():
    """
    Server-Sent Events endpoint.

    Streams real-time CrewAI agent thoughts, outputs, and the final
    Growth Marketer HTML campaign to the frontend terminal.
    """

    async def event_generator():
        try:
            async for event in run_crew_stream():
                yield _format_sse(event)
        except Exception as exc:  # noqa: BLE001
            error = StreamEvent(
                type="error",
                agent="Orchestrator",
                message=str(exc),
            )
            yield _format_sse(error)
            done = StreamEvent(
                type="done",
                agent="Orchestrator",
                message="Stream closed after error.",
            )
            yield _format_sse(done)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/run-crew")
async def run_crew_post():
    """POST alias — same SSE stream (useful for clients that prefer POST)."""
    return await run_crew()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8004")),
        reload=True,
    )

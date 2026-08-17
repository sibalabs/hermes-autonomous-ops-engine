"""
Project Hermes — CrewAI Orchestrator

Sequential multi-agent crew:
  1. Inventory Analyst  — finds overstocked boutique items
  2. Market Intelligence Scout — researches trends for those items
  3. Growth Marketer — drafts a promotional HTML email campaign
"""

from __future__ import annotations

import asyncio
import json
import os
from typing import Any, AsyncGenerator, Callable, Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

# ---------------------------------------------------------------------------
# Mock inventory (used when Supabase is unavailable)
# ---------------------------------------------------------------------------
MOCK_INVENTORY: list[dict[str, Any]] = [
    {
        "id": "a1b2c3d4-0001-4000-8000-000000000001",
        "product_name": "Celestial Silk Scarf — Midnight Constellation",
        "stock_level": 142,
        "category": "Accessories",
        "reorder_threshold": 25,
        "image_url": (
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26"
            "?auto=format&fit=crop&w=200&h=200&q=80"
        ),
    },
    {
        "id": "a1b2c3d4-0002-4000-8000-000000000002",
        "product_name": "Artisan Ceramic Pour-Over Set",
        "stock_level": 87,
        "category": "Home & Kitchen",
        "reorder_threshold": 15,
        "image_url": (
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            "?auto=format&fit=crop&w=200&h=200&q=80"
        ),
    },
    {
        "id": "a1b2c3d4-0003-4000-8000-000000000003",
        "product_name": "Hand-Poured Amber & Vetiver Candle",
        "stock_level": 210,
        "category": "Home Fragrance",
        "reorder_threshold": 40,
        "image_url": (
            "https://images.unsplash.com/photo-1603006905003-be475563bc59"
            "?auto=format&fit=crop&w=200&h=200&q=80"
        ),
    },
    {
        "id": "a1b2c3d4-0004-4000-8000-000000000004",
        "product_name": "Organic Linen Lounge Set — Sand",
        "stock_level": 34,
        "category": "Apparel",
        "reorder_threshold": 20,
        "image_url": (
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
            "?auto=format&fit=crop&w=200&h=200&q=80"
        ),
    },
    {
        "id": "a1b2c3d4-0005-4000-8000-000000000005",
        "product_name": "Recycled Brass Statement Earrings",
        "stock_level": 156,
        "category": "Jewelry",
        "reorder_threshold": 30,
        "image_url": (
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"
            "?auto=format&fit=crop&w=200&h=200&q=80"
        ),
    },
]


class InventoryItem(BaseModel):
    id: str
    product_name: str
    stock_level: int
    category: str
    reorder_threshold: int
    image_url: Optional[str] = None


class StreamEvent(BaseModel):
    """SSE payload shape consumed by the frontend terminal."""

    type: str = Field(
        description="agent_start | thought | tool | output | campaign | done | error"
    )
    agent: Optional[str] = None
    message: str = ""
    data: Optional[dict[str, Any]] = None


def _image_catalog() -> dict[str, str]:
    return {
        item["product_name"]: item["image_url"]
        for item in MOCK_INVENTORY
        if item.get("image_url")
    }


def _enrich_images(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Backfill image_url from the mock catalog when Supabase rows omit it."""
    catalog = _image_catalog()
    enriched: list[dict[str, Any]] = []
    for row in rows:
        item = dict(row)
        if not item.get("image_url"):
            item["image_url"] = catalog.get(item.get("product_name", ""))
        enriched.append(item)
    return enriched


def fetch_inventory() -> list[dict[str, Any]]:
    """Load inventory from Supabase when configured; otherwise return mock rows."""
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_KEY", "")

    if url and key and "your-project" not in url and "your-supabase" not in key:
        try:
            from supabase import create_client

            client = create_client(url, key)
            result = client.table("inventory").select("*").execute()
            if result.data:
                return _enrich_images(result.data)
        except Exception as exc:  # noqa: BLE001
            print(f"[hermes] Supabase fetch failed, using mock data: {exc}")

    return MOCK_INVENTORY


def find_overstocked(
    inventory: list[dict[str, Any]], multiplier: float = 3.0
) -> list[dict[str, Any]]:
    """Items whose stock_level exceeds reorder_threshold * multiplier."""
    overstocked = [
        item
        for item in inventory
        if item.get("stock_level", 0)
        >= item.get("reorder_threshold", 0) * multiplier
    ]
    # Always surface at least the top stocked items for demo reliability
    if not overstocked:
        overstocked = sorted(
            inventory, key=lambda x: x.get("stock_level", 0), reverse=True
        )[:2]
    return overstocked


def _emit(
    queue: asyncio.Queue[Optional[StreamEvent]],
    event: StreamEvent,
) -> None:
    queue.put_nowait(event)


def _openai_api_key() -> str:
    return os.getenv("OPENAI_API_KEY", "").strip()


def _openai_model() -> str:
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()
    if model.startswith("openai/"):
        return model
    return f"openai/{model}"


def _has_live_llm() -> bool:
    key = _openai_api_key()
    if not key or "your-key" in key.lower():
        return False
    return key.startswith("sk-")


def _build_llm():
    """CrewAI LLM wired to OpenAI (via LiteLLM)."""
    from crewai import LLM

    return LLM(
        model=_openai_model(),
        api_key=_openai_api_key(),
        max_tokens=4096,
        temperature=0.6,
    )


def _prompt(name: str) -> str:
    """Load a proprietary prompt from the environment. Never ship defaults in source."""
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(
            f"{name} is not set. Add the proprietary prompt to backend/.env "
            "(see backend/.env.example)."
        )
    return value


def _prompt_format(name: str, **kwargs: str) -> str:
    template = _prompt(name)
    for key, value in kwargs.items():
        template = template.replace("{" + key + "}", value)
    return template


def _step_agent_name(step_output: Any) -> str:
    agent = getattr(step_output, "agent", None)
    if agent is None:
        return "Crew"
    role = getattr(agent, "role", None)
    if isinstance(role, str) and role.strip():
        return role
    return str(agent)


def _step_message(step_output: Any) -> str | None:
    thought = getattr(step_output, "thought", None)
    if isinstance(thought, str) and "Failed to parse LLM response" in thought:
        return None

    for attr in ("thought", "text", "result", "output", "raw"):
        value = getattr(step_output, attr, None)
        if isinstance(value, str) and value.strip():
            return value.strip()[:4000]
    text = str(step_output).strip()
    if not text or "Failed to parse LLM response" in text:
        return None
    return text[:4000]


def _build_crew(overstocked_json: str, log_callback: Callable[[str, str], None]):
    """Construct the sequential CrewAI crew. Imported lazily so the API boots without keys."""
    os.environ.setdefault("CREWAI_DISABLE_TELEMETRY", "true")
    os.environ.setdefault("OTEL_SDK_DISABLED", "true")

    from crewai import Agent, Crew, Process, Task

    def step_callback(step_output: Any) -> None:
        message = _step_message(step_output)
        if not message:
            return
        log_callback(_step_agent_name(step_output), message)

    llm = _build_llm()
    output_format = _prompt("AGENT_OUTPUT_FORMAT")

    inventory_analyst = Agent(
        role=_prompt("AGENT_INVENTORY_ANALYST_ROLE"),
        goal=_prompt("AGENT_INVENTORY_ANALYST_GOAL"),
        backstory=f"{_prompt('AGENT_INVENTORY_ANALYST_BACKSTORY')} {output_format}",
        llm=llm,
        verbose=True,
        allow_delegation=False,
        tools=[],
        max_iter=3,
    )

    market_scout = Agent(
        role=_prompt("AGENT_MARKET_SCOUT_ROLE"),
        goal=_prompt("AGENT_MARKET_SCOUT_GOAL"),
        backstory=f"{_prompt('AGENT_MARKET_SCOUT_BACKSTORY')} {output_format}",
        llm=llm,
        verbose=True,
        allow_delegation=False,
        tools=[],
        max_iter=3,
    )

    growth_marketer = Agent(
        role=_prompt("AGENT_GROWTH_MARKETER_ROLE"),
        goal=_prompt("AGENT_GROWTH_MARKETER_GOAL"),
        backstory=f"{_prompt('AGENT_GROWTH_MARKETER_BACKSTORY')} {output_format}",
        llm=llm,
        verbose=True,
        allow_delegation=False,
        tools=[],
        max_iter=3,
    )

    analyze_task = Task(
        description=(
            _prompt_format(
                "CREWAI_INVENTORY_ANALYSIS_TASK",
                inventory_json=overstocked_json,
            )
            + "\n"
            + output_format
        ),
        expected_output=_prompt("CREWAI_INVENTORY_ANALYSIS_EXPECTED_OUTPUT"),
        agent=inventory_analyst,
    )

    scout_task = Task(
        description=_prompt("CREWAI_MARKET_INTEL_TASK") + "\n" + output_format,
        expected_output=_prompt("CREWAI_MARKET_INTEL_EXPECTED_OUTPUT"),
        agent=market_scout,
        context=[analyze_task],
    )

    campaign_task = Task(
        description=_prompt("CREWAI_CAMPAIGN_TASK") + "\n" + output_format,
        expected_output=_prompt("CREWAI_CAMPAIGN_EXPECTED_OUTPUT"),
        agent=growth_marketer,
        context=[analyze_task, scout_task],
    )

    crew = Crew(
        agents=[inventory_analyst, market_scout, growth_marketer],
        tasks=[analyze_task, scout_task, campaign_task],
        process=Process.sequential,
        verbose=True,
        step_callback=step_callback,
    )

    return crew, campaign_task


def _extract_html_campaign(raw: str) -> dict[str, Any]:
    """Pull HTML + metadata from Growth Marketer output."""
    html = raw
    subject = _prompt("CAMPAIGN_DEFAULT_SUBJECT")
    preview = _prompt("CAMPAIGN_DEFAULT_PREVIEW")
    audience = _prompt("CAMPAIGN_DEFAULT_AUDIENCE")

    if "```html" in raw:
        start = raw.index("```html") + len("```html")
        end = raw.index("```", start) if "```" in raw[start:] else len(raw)
        html = raw[start:end].strip()
    elif "```" in raw:
        start = raw.index("```") + 3
        # skip optional language tag
        if "\n" in raw[start:]:
            first_nl = raw.index("\n", start)
            maybe_lang = raw[start:first_nl].strip()
            if maybe_lang and " " not in maybe_lang and len(maybe_lang) < 12:
                start = first_nl + 1
        end = raw.index("```", start) if "```" in raw[start:] else len(raw)
        html = raw[start:end].strip()
    else:
        lower_raw = raw.lower()
        start = lower_raw.find("<!doctype")
        if start < 0:
            start = lower_raw.find("<html")
        if start >= 0:
            end = lower_raw.rfind("</html>")
            html = raw[start : end + 7 if end >= 0 else len(raw)].strip()

    for line in raw.splitlines():
        lower = line.lower().strip()
        if lower.startswith("subject"):
            subject = line.split(":", 1)[-1].strip().strip("*").strip()
        elif "preview" in lower and ":" in line:
            preview = line.split(":", 1)[-1].strip().strip("*").strip()
        elif "audience" in lower and ":" in line:
            audience = line.split(":", 1)[-1].strip().strip("*").strip()

    return {
        "subject": subject,
        "preview": preview,
        "target_audience": audience,
        "html": html,
        "raw": raw,
    }


async def run_crew_stream() -> AsyncGenerator[StreamEvent, None]:
    """
    Execute the Hermes crew and yield SSE-ready StreamEvents.
    Requires a valid OPENAI_API_KEY.
    """
    inventory = fetch_inventory()
    overstocked = find_overstocked(inventory)

    yield StreamEvent(
        type="thought",
        agent="Orchestrator",
        message=f"Loaded {len(inventory)} inventory rows · {len(overstocked)} overstock candidates.",
    )

    if not _has_live_llm():
        yield StreamEvent(
            type="error",
            agent="Orchestrator",
            message=(
                "OPENAI_API_KEY is missing or invalid. "
                "Set a live OpenAI key in backend/.env to run CrewAI."
            ),
        )
        yield StreamEvent(
            type="done",
            agent="Orchestrator",
            message="Live crew was not executed.",
        )
        return

    queue: asyncio.Queue[Optional[StreamEvent]] = asyncio.Queue()
    overstocked_json = json.dumps(overstocked, indent=2)

    def log_callback(agent: str, message: str) -> None:
        _emit(queue, StreamEvent(type="thought", agent=agent, message=message))

    loop = asyncio.get_event_loop()

    def _run_sync() -> str:
        model = _openai_model()
        crew, _campaign_task = _build_crew(overstocked_json, log_callback)

        _emit(
            queue,
            StreamEvent(
                type="agent_start",
                agent="Orchestrator",
                message=f"Crew assembled on OpenAI ({model}) — sequential process starting.",
            ),
        )
        for role in (
            _prompt("AGENT_INVENTORY_ANALYST_ROLE"),
            _prompt("AGENT_MARKET_SCOUT_ROLE"),
            _prompt("AGENT_GROWTH_MARKETER_ROLE"),
        ):
            _emit(
                queue,
                StreamEvent(
                    type="agent_start",
                    agent=role,
                    message=f"{role} standing by.",
                ),
            )

        result = crew.kickoff()
        return str(result)

    async def producer() -> None:
        try:
            raw_result = await loop.run_in_executor(None, _run_sync)
            campaign = _extract_html_campaign(raw_result)
            _emit(
                queue,
                StreamEvent(
                    type="output",
                    agent="Growth Marketer",
                    message=raw_result[:4000],
                ),
            )
            _emit(
                queue,
                StreamEvent(
                    type="campaign",
                    agent="Growth Marketer",
                    message="Final promotional email ready.",
                    data=campaign,
                ),
            )
            _emit(
                queue,
                StreamEvent(
                    type="done",
                    agent="Orchestrator",
                    message="Daily workflow complete.",
                    data={"mode": "live", "overstocked_count": len(overstocked)},
                ),
            )
        except Exception as exc:  # noqa: BLE001
            _emit(
                queue,
                StreamEvent(
                    type="error",
                    agent="Orchestrator",
                    message=f"Crew execution failed: {exc}",
                ),
            )
            _emit(
                queue,
                StreamEvent(
                    type="done",
                    agent="Orchestrator",
                    message="Workflow terminated with errors.",
                ),
            )
        finally:
            await queue.put(None)

    task = asyncio.create_task(producer())

    try:
        while True:
            event = await queue.get()
            if event is None:
                break
            yield event
    finally:
        await task

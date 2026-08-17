import {
  adminPinMatches,
  adminUnlockCookie,
  cooldownCookie,
  getRetryAt,
  isAdminUnlocked,
  markDemoRun,
} from "@/lib/serverRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

function backendBase() {
  return (
    process.env.HERMES_BACKEND_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8004"
  );
}

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function errorStream(base: string, reason: string) {
  const encoder = new TextEncoder();
  const events = [
    {
      type: "error",
      agent: "Orchestrator",
      message: `CrewAI backend is not reachable at ${base}. ${reason} Start it with: cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8004`,
      data: null,
    },
    {
      type: "done",
      agent: "Orchestrator",
      message: "Live crew was not executed.",
      data: null,
    },
  ];

  return new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(sse(event)));
      }
      controller.close();
    },
  });
}

function rateLimitResponse(
  retryAt: number,
  extraSetCookie?: string,
  invalidPin = false,
) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((retryAt - Date.now()) / 1000),
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    "Retry-After": String(retryAfterSeconds),
  });
  headers.append("Set-Cookie", cooldownCookie(retryAt));
  if (extraSetCookie) headers.append("Set-Cookie", extraSetCookie);

  return Response.json(
    {
      error: invalidPin ? "invalid_pin" : "rate_limited",
      retryAt,
      retryAfterSeconds,
    },
    { status: 429, headers },
  );
}

export async function GET(request: Request) {
  const pin = request.headers.get("x-hermes-admin-pin");
  const admin = isAdminUnlocked(request);
  const retryAt = getRetryAt(request);

  if (retryAt && !admin) {
    const invalidPin = Boolean(pin && !adminPinMatches(pin));
    return rateLimitResponse(retryAt, undefined, invalidPin);
  }

  const streamHeaders: Record<string, string> = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  const base = backendBase();

  try {
    const health = await fetch(`${base}/api/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!health.ok) {
      return new Response(
        errorStream(base, `Health check failed (${health.status}).`),
        { headers: streamHeaders },
      );
    }

    const res = await fetch(`${base}/api/run-crew`, {
      headers: { Accept: "text/event-stream" },
      cache: "no-store",
    });

    if (!res.ok || !res.body) {
      return new Response(
        errorStream(base, `Stream unavailable (${res.status}).`),
        { headers: streamHeaders },
      );
    }

    const headers = new Headers(streamHeaders);
    if (adminPinMatches(pin) || admin) {
      headers.append("Set-Cookie", adminUnlockCookie());
    } else {
      headers.append("Set-Cookie", cooldownCookie(markDemoRun(request)));
    }

    return new Response(res.body, { headers });
  } catch (err) {
    const reason =
      err instanceof Error ? err.message : "Connection failed.";
    return new Response(errorStream(base, reason), {
      headers: streamHeaders,
    });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

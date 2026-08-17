import { FALLBACK_INVENTORY } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function backendBase() {
  return (
    process.env.HERMES_BACKEND_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8004"
  );
}

export async function GET() {
  try {
    const res = await fetch(`${backendBase()}/api/inventory`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Backend HTTP ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({
      items: FALLBACK_INVENTORY,
      source: "fallback",
    });
  }
}

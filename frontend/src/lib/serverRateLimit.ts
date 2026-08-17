import { timingSafeEqual } from "crypto";
import { DEMO_COOLDOWN_MS } from "@/lib/demoCooldown";

export const RETRY_COOKIE = "hermes_demo_retry_at";
export const ADMIN_COOKIE = "hermes_admin_unlock";

const lastRunByIp = new Map<string, number>();

function parseCookies(header: string | null) {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (!key) continue;
    out[key] = decodeURIComponent(rest.join("="));
  }
  return out;
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

export function adminPinMatches(provided: string | null) {
  if (!provided) return false;
  const expected = process.env.HERMES_ADMIN_PIN || "7417";
  const a = Buffer.from(provided.trim());
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAdminUnlocked(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  if (cookies[ADMIN_COOKIE] === "1") return true;
  return adminPinMatches(request.headers.get("x-hermes-admin-pin"));
}

export function getRetryAt(request: Request) {
  const now = Date.now();
  const cookies = parseCookies(request.headers.get("cookie"));
  const cookieRetry = Number(cookies[RETRY_COOKIE] || "");
  const ipRetry = lastRunByIp.get(clientKey(request)) ?? 0;
  const retryAt = Math.max(
    Number.isFinite(cookieRetry) ? cookieRetry : 0,
    ipRetry,
  );
  if (retryAt <= now) return null;
  return retryAt;
}

export function markDemoRun(request: Request) {
  const retryAt = Date.now() + DEMO_COOLDOWN_MS;
  lastRunByIp.set(clientKey(request), retryAt);
  return retryAt;
}

export function cooldownCookie(retryAt: number) {
  const maxAge = Math.ceil(DEMO_COOLDOWN_MS / 1000);
  return `${RETRY_COOKIE}=${retryAt}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

export function adminUnlockCookie() {
  return `${ADMIN_COOKIE}=1; Path=/; Max-Age=${60 * 60 * 8}; HttpOnly; SameSite=Lax`;
}

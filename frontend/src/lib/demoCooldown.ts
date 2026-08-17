export const DEMO_COOLDOWN_MS = 20 * 60 * 1000;
export const DEMO_RETRY_STORAGE_KEY = "hermes_demo_retry_at";

export function readStoredRetryAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DEMO_RETRY_STORAGE_KEY);
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= Date.now()) {
    window.localStorage.removeItem(DEMO_RETRY_STORAGE_KEY);
    return null;
  }
  return value;
}

export function storeRetryAt(retryAt: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_RETRY_STORAGE_KEY, String(retryAt));
}

export function clearStoredRetryAt() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_RETRY_STORAGE_KEY);
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

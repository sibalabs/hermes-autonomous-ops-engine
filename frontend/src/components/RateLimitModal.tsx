"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatCountdown } from "@/lib/demoCooldown";

type RateLimitModalProps = {
  retryAt: number;
  pinError?: string | null;
  onClose: () => void;
  onUnlocked: (pin: string) => void;
};

export function RateLimitModal({
  retryAt,
  pinError,
  onClose,
  onUnlocked,
}: RateLimitModalProps) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, retryAt - Date.now()),
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = Math.max(0, retryAt - Date.now());
      setRemainingMs(next);
      if (next <= 0) onClose();
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [retryAt, onClose]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pin.trim().length < 4) {
      setError("Enter the admin PIN to override.");
      return;
    }
    setError(null);
    onUnlocked(pin.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cooldown-title"
        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Rate limit
        </p>
        <h2
          id="cooldown-title"
          className="mt-2 text-xl font-semibold tracking-tight text-neutral-900"
        >
          Live demo cooldown
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          To protect the CrewAI API, each visitor can run the live workflow once
          every 20 minutes. You can try again in:
        </p>

        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 py-5 text-center">
          <p className="font-mono text-4xl font-semibold tracking-widest text-neutral-900">
            {formatCountdown(remainingMs)}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-400">
            Minutes : Seconds
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <label
            htmlFor="admin-pin"
            className="text-xs font-medium uppercase tracking-wider text-neutral-400"
          >
            Admin override
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="PIN"
              value={pin}
              onChange={(event) => {
                setPin(event.target.value);
                setError(null);
              }}
              className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none ring-indigo-200 placeholder:text-neutral-400 focus:border-indigo-300 focus:ring-2"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Override
            </button>
          </div>
          {error || pinError ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error || pinError}
            </p>
          ) : null}
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}

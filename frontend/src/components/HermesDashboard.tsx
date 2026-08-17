"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { InventoryPanel } from "@/components/InventoryPanel";
import { ExecutionTerminal } from "@/components/ExecutionTerminal";
import { CampaignOutput } from "@/components/CampaignOutput";
import { RateLimitModal } from "@/components/RateLimitModal";
import { fetchInventory, getRunCrewUrl } from "@/lib/api";
import {
  DEMO_COOLDOWN_MS,
  clearStoredRetryAt,
  formatCountdown,
  readStoredRetryAt,
  storeRetryAt,
} from "@/lib/demoCooldown";
import type {
  CampaignPayload,
  InventoryItem,
  StreamEvent,
  WorkflowStatus,
} from "@/lib/types";

function isCampaignPayload(data: unknown): data is CampaignPayload {
  return (
    !!data &&
    typeof data === "object" &&
    "html" in data &&
    typeof (data as CampaignPayload).html === "string"
  );
}

export function HermesDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [source, setSource] = useState("loading");
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [logs, setLogs] = useState<StreamEvent[]>([]);
  const [campaign, setCampaign] = useState<CampaignPayload | null>(null);
  const [showCampaign, setShowCampaign] = useState(false);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [showCooldown, setShowCooldown] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingInventory(true);
      const result = await fetchInventory();
      if (!cancelled) {
        setItems(result.items);
        setSource(result.source);
        setLoadingInventory(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stored = readStoredRetryAt();
    if (stored) setRetryAt(stored);
  }, []);

  useEffect(() => {
    if (!retryAt) return;
    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (retryAt <= current) {
        clearStoredRetryAt();
        setRetryAt(null);
        setShowCooldown(false);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [retryAt]);

  const applyRetryAt = useCallback((value: number) => {
    storeRetryAt(value);
    setRetryAt(value);
    setShowCooldown(true);
  }, []);

  const runCrew = useCallback(
    async (pin?: string) => {
      if (status === "running") return;

      const blockedUntil = retryAt && retryAt > Date.now() ? retryAt : readStoredRetryAt();
      if (blockedUntil && blockedUntil > Date.now() && !pin) {
        setRetryAt(blockedUntil);
        setShowCooldown(true);
        return;
      }

      setStatus("running");
      setLogs([]);
      setCampaign(null);
      setShowCampaign(false);
      setPinError(null);

      const url = getRunCrewUrl();
      const headers: Record<string, string> = {
        Accept: "text/event-stream",
      };
      if (pin) headers["x-hermes-admin-pin"] = pin;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (response.status === 429) {
          const data = (await response.json()) as {
            error?: string;
            retryAt?: number;
          };
          const nextRetry =
            typeof data.retryAt === "number"
              ? data.retryAt
              : Date.now() + DEMO_COOLDOWN_MS;
          if (data.error === "invalid_pin") {
            setPinError("That PIN is not valid.");
          }
          applyRetryAt(nextRetry);
          setStatus("idle");
          return;
        }

        if (!response.ok || !response.body) {
          throw new Error(`Stream failed (${response.status})`);
        }

        if (pin) {
          clearStoredRetryAt();
          setRetryAt(null);
          setShowCooldown(false);
        } else {
          const nextRetry = Date.now() + DEMO_COOLDOWN_MS;
          storeRetryAt(nextRetry);
          setRetryAt(nextRetry);
          setShowCooldown(false);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!line) continue;

            try {
              const event = JSON.parse(line.slice(6)) as StreamEvent;
              setLogs((prev) => [...prev, event]);

              if (event.type === "campaign" && isCampaignPayload(event.data)) {
                setCampaign(event.data);
              }

              if (event.type === "done") {
                setStatus("complete");
                setShowCampaign(true);
              }

              if (event.type === "error") {
                setStatus("error");
              }
            } catch {
              // skip malformed SSE frames
            }
          }
        }

        setStatus((prev) => (prev === "running" ? "complete" : prev));
        setShowCampaign(true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown stream error";
        setLogs((prev) => [
          ...prev,
          {
            type: "error",
            agent: "Orchestrator",
            message: `Connection failed: ${message}. Is the FastAPI backend running on :8004?`,
          },
        ]);
        setStatus("error");
      }
    },
    [applyRetryAt, retryAt, status],
  );

  const cooldownActive = Boolean(retryAt && retryAt > now);
  const cooldownLabel = cooldownActive
    ? formatCountdown((retryAt as number) - now)
    : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          status={status}
          onExecute={() => void runCrew()}
          cooldownLabel={cooldownLabel}
        />

        <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="h-[500px] min-h-0">
                <InventoryPanel
                  items={items}
                  source={source}
                  loading={loadingInventory}
                />
              </div>
              <ExecutionTerminal logs={logs} status={status} />
            </div>

            <div className="min-h-[800px] h-full lg:min-h-[916px]">
              <CampaignOutput campaign={campaign} visible={showCampaign} />
            </div>
          </div>
        </main>
      </div>

      {showCooldown && retryAt && retryAt > now ? (
        <RateLimitModal
          retryAt={retryAt}
          pinError={pinError}
          onClose={() => setShowCooldown(false)}
          onUnlocked={(pin) => void runCrew(pin)}
        />
      ) : null}
    </div>
  );
}

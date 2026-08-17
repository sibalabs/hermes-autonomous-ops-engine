"use client";

import Image from "next/image";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import type { InventoryItem } from "@/lib/types";

type InventoryPanelProps = {
  items: InventoryItem[];
  source: string;
  loading?: boolean;
};

function stockStatus(item: InventoryItem) {
  const ratio = item.stock_level / Math.max(item.reorder_threshold, 1);
  if (ratio >= 3)
    return { label: "Overstock", color: "text-amber-600", bar: "bg-amber-500" };
  if (ratio <= 1.2)
    return { label: "Low", color: "text-rose-600", bar: "bg-rose-500" };
  return { label: "Healthy", color: "text-emerald-600", bar: "bg-emerald-500" };
}

function maxStock(items: InventoryItem[]) {
  return Math.max(...items.map((i) => i.stock_level), 1);
}

function ProductThumb({ item }: { item: InventoryItem }) {
  if (!item.image_url) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
        <Package size={16} />
      </div>
    );
  }

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
      <Image
        src={item.image_url}
        alt={item.product_name}
        fill
        sizes="44px"
        className="object-cover"
      />
    </div>
  );
}

export function InventoryPanel({ items, source, loading }: InventoryPanelProps) {
  const peak = maxStock(items);
  const overstockCount = items.filter(
    (i) => i.stock_level >= i.reorder_threshold * 3
  ).length;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
            <Package size={16} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-neutral-900">
              Live Inventory
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">
              Supabase · {source}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <TrendingUp size={12} className="text-neutral-400" />
            {items.length} SKUs
          </span>
          {overstockCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700">
              <AlertTriangle size={11} />
              {overstockCount} overstock
            </span>
          )}
        </div>
      </div>

      <div className="hermes-scroll min-h-0 flex-1 overflow-auto p-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl bg-neutral-100 p-3"
              >
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-neutral-200" />
                <div className="h-11 flex-1 animate-pulse rounded-lg bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-1 grid grid-cols-[minmax(0,1fr)_70px_90px_80px] gap-2 px-3 pb-2 text-[10px] uppercase tracking-widest text-neutral-400">
              <span>Product</span>
              <span className="text-right">Stock</span>
              <span className="text-right">Threshold</span>
              <span className="text-right">Status</span>
            </div>
            {items.map((item, idx) => {
              const status = stockStatus(item);
              const width = Math.min(100, (item.stock_level / peak) * 100);
              return (
                <div
                  key={item.id}
                  className="fade-up border-b border-neutral-100 px-3 py-3 transition hover:bg-neutral-50"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_70px_90px_80px] items-center gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <ProductThumb item={item} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] text-neutral-900">
                          {item.product_name}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-500">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <p className="text-right font-mono text-[13px] text-neutral-900">
                      {item.stock_level}
                    </p>
                    <p className="text-right font-mono text-[12px] text-neutral-500">
                      {item.reorder_threshold}
                    </p>
                    <p
                      className={`text-right text-[10px] font-medium uppercase tracking-wider ${status.color}`}
                    >
                      {status.label}
                    </p>
                  </div>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${status.bar} transition-all duration-700`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

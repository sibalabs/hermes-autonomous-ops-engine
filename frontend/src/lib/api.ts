import type { InventoryItem } from "./types";

/**
 * Same-origin by default (`/api/...` via Next.js route proxies).
 * Set NEXT_PUBLIC_API_URL only when calling FastAPI directly (e.g. local debugging).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function getApiBase() {
  return API_BASE;
}

export function getRunCrewUrl() {
  return `${API_BASE}/api/run-crew`;
}

/** Boutique fallback when backend is offline */
export const FALLBACK_INVENTORY: InventoryItem[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    product_name: "Celestial Silk Scarf — Midnight Constellation",
    stock_level: 142,
    category: "Accessories",
    reorder_threshold: 25,
    image_url:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    product_name: "Artisan Ceramic Pour-Over Set",
    stock_level: 87,
    category: "Home & Kitchen",
    reorder_threshold: 15,
    image_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    product_name: "Hand-Poured Amber & Vetiver Candle",
    stock_level: 210,
    category: "Home Fragrance",
    reorder_threshold: 40,
    image_url:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    product_name: "Organic Linen Lounge Set — Sand",
    stock_level: 34,
    category: "Apparel",
    reorder_threshold: 20,
    image_url:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    product_name: "Recycled Brass Statement Earrings",
    stock_level: 156,
    category: "Jewelry",
    reorder_threshold: 30,
    image_url:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

export async function fetchInventory(): Promise<{
  items: InventoryItem[];
  source: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/inventory`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      items: data.items ?? FALLBACK_INVENTORY,
      source: data.source ?? "api",
    };
  } catch {
    return { items: FALLBACK_INVENTORY, source: "fallback" };
  }
}

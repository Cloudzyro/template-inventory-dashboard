import { useSyncExternalStore } from "react";
import {
  movements as baseMovements,
  products as baseProducts,
  purchaseOrders as baseOrders,
  suppliers,
  type Movement,
  type Product,
  type PurchaseOrder,
} from "../data/inventory";
import { todayISO } from "./format";

// Changes you make in the demo (receiving an order, raising a reorder) are kept
// in this browser with localStorage, so the app feels real without a backend.
// Replace these functions with calls to your API to save them for real.

type Saved = { onHand: Record<string, number>; orders: PurchaseOrder[]; extraMovements: Movement[] };
const KEY = "binwise-demo-v1";

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function fresh(): Saved {
  return { onHand: {}, orders: structuredClone(baseOrders), extraMovements: [] };
}

let saved: Saved = load() ?? fresh();
let snapshot = build(saved);
const listeners = new Set<() => void>();

function build(s: Saved) {
  const products: Product[] = baseProducts.map((p) => ({ ...p, onHand: s.onHand[p.sku] ?? p.onHand }));
  const movements: Movement[] = [...s.extraMovements, ...baseMovements].sort((a, b) => b.at.localeCompare(a.at));
  return { products, orders: s.orders, movements };
}

function commit(next: Saved) {
  saved = next;
  snapshot = build(saved);
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Storage can be blocked; changes still hold until the page reloads
  }
  listeners.forEach((l) => l());
}

export function useInventory() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
  );
}

export type StockStatus = "ok" | "low" | "out";
export function statusOf(p: Product): StockStatus {
  if (p.onHand <= 0) return "out";
  if (p.onHand <= p.reorderPoint) return "low";
  return "ok";
}

const nowStamp = () => `${todayISO()}T${new Date().toTimeString().slice(0, 5)}:00`;

/** Mark an ordered purchase order as received: stock goes up and each line is logged */
export function receiveOrder(id: string, by = "You") {
  const order = saved.orders.find((o) => o.id === id);
  if (!order || order.status !== "Ordered") return;
  const onHand = { ...saved.onHand };
  const extra = [...saved.extraMovements];
  for (const line of order.lines) {
    const current = onHand[line.sku] ?? baseProducts.find((p) => p.sku === line.sku)?.onHand ?? 0;
    onHand[line.sku] = current + line.qty;
    extra.push({ id: `x${Date.now()}${line.sku}`, at: nowStamp(), type: "Received", sku: line.sku, qty: line.qty, ref: id, by });
  }
  const orders = saved.orders.map((o) => (o.id === id ? { ...o, status: "Received" as const, received: todayISO() } : o));
  commit({ onHand, orders, extraMovements: extra });
}

/** Send a draft to the supplier */
export function placeOrder(id: string) {
  commit({ ...saved, orders: saved.orders.map((o) => (o.id === id && o.status === "Draft" ? { ...o, status: "Ordered" as const } : o)) });
}

/** Add a product's reorder quantity to its supplier's open draft, or start a new draft. Returns the order id. */
export function reorder(sku: string): string {
  const p = baseProducts.find((x) => x.sku === sku);
  if (!p) return "";
  const draft = saved.orders.find((o) => o.status === "Draft" && o.supplier === p.supplier);
  if (draft) {
    if (!draft.lines.some((l) => l.sku === sku)) {
      commit({
        ...saved,
        orders: saved.orders.map((o) => (o === draft ? { ...o, lines: [...o.lines, { sku, qty: p.reorderQty, unitCost: p.unitCost }] } : o)),
      });
    }
    return draft.id;
  }
  const highest = Math.max(...saved.orders.map((o) => Number(o.id.replace("PO-", ""))));
  const id = `PO-${highest + 1}`;
  const lead = suppliers.find((s) => s.id === p.supplier)?.leadDays ?? 7;
  const expected = new Date(todayISO() + "T12:00:00");
  expected.setDate(expected.getDate() + lead);
  const order: PurchaseOrder = {
    id,
    supplier: p.supplier,
    status: "Draft",
    created: todayISO(),
    expected: expected.toISOString().slice(0, 10),
    lines: [{ sku, qty: p.reorderQty, unitCost: p.unitCost }],
  };
  commit({ ...saved, orders: [order, ...saved.orders] });
  return id;
}

/** Which open order (draft or ordered) already covers this product, if any */
export function openOrderFor(sku: string, orders: PurchaseOrder[]) {
  return orders.find((o) => o.status !== "Received" && o.lines.some((l) => l.sku === sku));
}

export function resetDemo() {
  commit(fresh());
}

export const orderTotal = (o: PurchaseOrder) => o.lines.reduce((a, l) => a + l.qty * l.unitCost, 0);

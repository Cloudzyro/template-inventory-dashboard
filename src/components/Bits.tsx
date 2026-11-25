import type { Product } from "../data/inventory";
import { num } from "../lib/format";
import { statusOf, type StockStatus } from "../lib/store";

/** Signature: the bin location printed like the label on the shelf */
export function BinLabel({ bin }: { bin: string }) {
  return (
    <span className="bin" title={`Aisle ${bin.split("-")[0]}, bay ${bin.split("-")[1]}, shelf ${bin.split("-")[2]}`}>
      {bin}
    </span>
  );
}

const statusText: Record<StockStatus, string> = { ok: "In stock", low: "Low", out: "Out of stock" };

export function StatusTag({ status }: { status: StockStatus }) {
  return (
    <span className={`status status-${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {statusText[status]}
    </span>
  );
}

/** On hand against the reorder point: the tick marks the reorder point */
export function StockBar({ product }: { product: Product }) {
  const status = statusOf(product);
  const scale = Math.max(product.reorderPoint * 2.5, product.onHand, 1);
  return (
    <span className="stockbar" aria-label={`${num(product.onHand)} on hand, reorder at ${num(product.reorderPoint)}`}>
      <span className="stockbar-track">
        <span className={`stockbar-fill fill-${status}`} style={{ transform: `scaleX(${Math.min(1, product.onHand / scale)})` }} />
        <span className="stockbar-tick" style={{ left: `${(product.reorderPoint / scale) * 100}%` }} />
      </span>
      <span className="stockbar-num">{num(product.onHand)}</span>
    </span>
  );
}

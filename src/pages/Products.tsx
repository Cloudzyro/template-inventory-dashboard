import { Search } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BinLabel, StatusTag, StockBar } from "../components/Bits";
import { categories } from "../data/inventory";
import { money, num, unitMoney } from "../lib/format";
import { openOrderFor, reorder, statusOf, useInventory } from "../lib/store";

const filters = [
  { id: "all", label: "All" },
  { id: "attention", label: "Low or out" },
  { id: "out", label: "Out of stock" },
];

export function Products() {
  const { products, orders } = useInventory();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const cat = params.get("category") ?? "";
  const status = params.get("status") ?? "all";
  const set = (key: string, value: string) =>
    setParams(
      (p) => {
        const next = new URLSearchParams(p);
        if (value && value !== "all") next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const rows = useMemo(
    () =>
      products.filter((p) => {
        const s = statusOf(p);
        if (status === "attention" && s === "ok") return false;
        if (status === "out" && s !== "out") return false;
        if (cat && p.category !== cat) return false;
        const needle = q.trim().toLowerCase();
        return !needle || `${p.name} ${p.sku} ${p.bin}`.toLowerCase().includes(needle);
      }),
    [products, q, cat, status],
  );


  return (
    <>
      <header className="page-head">
        <div>
          <h1>Products</h1>
          <p className="sub">
            {rows.length} of {products.length} products, {money(rows.reduce((a, p) => a + p.onHand * p.unitCost, 0))} at cost
          </p>
        </div>
      </header>

      <div className="filters">
        <label className="search">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input type="search" placeholder="Name, SKU or bin" value={q} onChange={(e) => set("q", e.target.value)} />
        </label>
        <label className="select">
          <span className="sr-only">Category</span>
          <select value={cat} onChange={(e) => set("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <div className="segmented" role="radiogroup" aria-label="Stock status">
          {filters.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={status === f.id} onClick={() => set("status", f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Bin</th>
              <th scope="col">On hand against reorder point</th>
              <th scope="col">Status</th>
              <th scope="col" className="num hide-sm">
                Unit cost
              </th>
              <th scope="col" className="num hide-sm">
                Value
              </th>
              <th scope="col">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const s = statusOf(p);
              const covered = openOrderFor(p.sku, orders);
              return (
                <tr key={p.sku}>
                  <th scope="row">
                    <span className="cell-main">{p.name}</span>
                    <span className="cell-sub mono">
                      {p.sku}, {p.category}
                    </span>
                  </th>
                  <td>
                    <BinLabel bin={p.bin} />
                  </td>
                  <td>
                    <StockBar product={p} />
                  </td>
                  <td>
                    <StatusTag status={s} />
                  </td>
                  <td className="num mono hide-sm">{unitMoney(p.unitCost)}</td>
                  <td className="num mono hide-sm">{money(p.onHand * p.unitCost)}</td>
                  <td className="action">
                    {s !== "ok" &&
                      (covered ? (
                        <button type="button" className="link" onClick={() => navigate(`/orders/${covered.id}`)}>
                          {covered.id}
                        </button>
                      ) : (
                        <button type="button" className="btn btn-small" onClick={() => navigate(`/orders/${reorder(p.sku)}`)}>
                          Reorder {num(p.reorderQty)}
                        </button>
                      ))}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="empty">
                  No products match these filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

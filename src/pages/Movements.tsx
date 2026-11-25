import { useSearchParams } from "react-router";
import { BinLabel } from "../components/Bits";
import type { MovementType } from "../data/inventory";
import { longDate, signed, time, weekday } from "../lib/format";
import { useInventory } from "../lib/store";

const types: (MovementType | "All")[] = ["All", "Received", "Shipped", "Adjusted", "Moved"];

export function Movements() {
  const { movements, products } = useInventory();
  const [params, setParams] = useSearchParams();
  const type = (params.get("type") ?? "All") as MovementType | "All";
  const shown = movements.filter((m) => type === "All" || m.type === type);
  const byDay = new Map<string, typeof shown>();
  shown.forEach((m) => byDay.set(m.at.slice(0, 10), [...(byDay.get(m.at.slice(0, 10)) ?? []), m]));
  const product = (sku: string) => products.find((p) => p.sku === sku);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Stock movements</h1>
          <p className="sub">Every unit in, out, counted or moved, newest first</p>
        </div>
      </header>
      <div className="filters">
        <div className="segmented" role="radiogroup" aria-label="Movement type">
          {types.map((t) => (
            <button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setParams(t === "All" ? {} : { type: t }, { replace: true })}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="panel table-wrap">
        <table className="table ledger">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Product</th>
              <th scope="col" className="hide-sm">Bin</th>
              <th scope="col" className="num">Units</th>
              <th scope="col" className="hide-sm">Reference</th>
              <th scope="col" className="hide-sm">By</th>
            </tr>
          </thead>
          {[...byDay].map(([day, list]) => (
            <tbody key={day}>
              <tr className="day-row">
                <th scope="colgroup" colSpan={7}>
                  {weekday(day)}, {longDate(day)}
                </th>
              </tr>
              {list.map((m) => {
                const p = product(m.sku);
                return (
                  <tr key={m.id}>
                    <td className="mono nowrap">{time(m.at)}</td>
                    <td>{m.type}</td>
                    <th scope="row">
                      <span className="cell-main">{p?.name ?? m.sku}</span>
                      <span className="cell-sub mono">{m.sku}</span>
                    </th>
                    <td className="hide-sm">{p && <BinLabel bin={p.bin} />}</td>
                    <td className={`num mono ${m.qty > 0 ? "in-text" : ""}`}>{signed(m.qty)}</td>
                    <td className="muted hide-sm">{m.ref}</td>
                    <td className="muted hide-sm nowrap">{m.by}</td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
}

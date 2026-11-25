import { Link } from "react-router";
import { suppliers } from "../data/inventory";
import { money, num } from "../lib/format";
import { orderTotal, useInventory } from "../lib/store";

export function Suppliers() {
  const { products, orders } = useInventory();
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Suppliers</h1>
          <p className="sub">{suppliers.length} suppliers, on-time rate over the last 12 months</p>
        </div>
      </header>
      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Supplier</th>
              <th scope="col" className="hide-sm">Contact</th>
              <th scope="col" className="num">Lead time</th>
              <th scope="col">On time</th>
              <th scope="col" className="num hide-sm">Products</th>
              <th scope="col" className="num">Open orders</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => {
              const open = orders.filter((o) => o.supplier === s.id && o.status !== "Received");
              return (
                <tr key={s.id}>
                  <th scope="row">
                    <span className="cell-main">{s.name}</span>
                    <span className="cell-sub">{s.city}</span>
                  </th>
                  <td className="hide-sm">
                    <span className="cell-main">{s.contact}</span>
                    <a className="cell-sub" href={`mailto:${s.email}`}>
                      {s.email}
                    </a>
                  </td>
                  <td className="num mono">{s.leadDays} days</td>
                  <td>
                    <span className="meter-cell">
                      <span className="meter" aria-hidden="true">
                        <span className={s.onTime < 0.85 ? "meter-low" : ""} style={{ transform: `scaleX(${s.onTime})` }} />
                      </span>
                      <span className="mono">{Math.round(s.onTime * 100)}%</span>
                    </span>
                  </td>
                  <td className="num mono hide-sm">{num(products.filter((p) => p.supplier === s.id).length)}</td>
                  <td className="num">
                    {open.length ? (
                      <Link to={`/orders/${open[0].id}`} className="mono">
                        {open.length}, {money(open.reduce((a, o) => a + orderTotal(o), 0))}
                      </Link>
                    ) : (
                      <span className="muted">None</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

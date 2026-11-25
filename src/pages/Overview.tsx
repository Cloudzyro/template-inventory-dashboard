import { Link, useNavigate } from "react-router";
import { BinLabel } from "../components/Bits";
import { FlowChart } from "../components/FlowChart";
import { app, dailyFlow, suppliers } from "../data/inventory";
import { longDate, money, num, shortDate, signed, time } from "../lib/format";
import { openOrderFor, reorder, statusOf, useInventory } from "../lib/store";
import { todayISO } from "../lib/format";

export function Overview() {
  const { products, orders, movements } = useInventory();
  const navigate = useNavigate();
  const counts = { ok: 0, low: 0, out: 0 };
  products.forEach((p) => counts[statusOf(p)]++);
  const value = products.reduce((a, p) => a + p.onHand * p.unitCost, 0);
  const units = products.reduce((a, p) => a + p.onHand, 0);
  const open = orders.filter((o) => o.status === "Ordered");
  const late = open.filter((o) => o.expected < todayISO());
  const alerts = products
    .filter((p) => statusOf(p) !== "ok")
    .sort((a, b) => a.onHand / Math.max(1, a.reorderPoint) - b.onHand / Math.max(1, b.reorderPoint));
  const shipped14 = dailyFlow.reduce((a, d) => a + d.out, 0);
  const received14 = dailyFlow.reduce((a, d) => a + d.in, 0);
  const total = products.length;
  const name = (sku: string) => products.find((p) => p.sku === sku)?.name ?? sku;

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Stock overview</h1>
          <p className="sub">
            {app.warehouse}, {longDate(todayISO())}
          </p>
        </div>
      </header>

      <section className="health" aria-label="Stock health">
        <div className="health-figures">
          <div>
            <p className="label">Stock value at cost</p>
            <p className="figure">{money(value)}</p>
          </div>
          <div>
            <p className="label">Units on hand</p>
            <p className="figure">{num(units)}</p>
          </div>
          <div>
            <p className="label">Products</p>
            <p className="figure">{total}</p>
          </div>
          <div>
            <p className="label">Purchase orders on the way</p>
            <p className="figure">{open.length}</p>
            {late.length > 0 && <p className="figure-note warn">{late.length} past its expected date</p>}
          </div>
        </div>
        <div className="health-bar">
          <div className="split" role="img" aria-label={`${counts.ok} in stock, ${counts.low} low, ${counts.out} out of stock`}>
            <span className="split-ok" style={{ flexGrow: counts.ok }} />
            <span className="split-low" style={{ flexGrow: counts.low }} />
            <span className="split-out" style={{ flexGrow: counts.out }} />
          </div>
          <ul className="split-legend">
            <li>
              <span className="key key-ok" aria-hidden="true" />
              In stock <b>{counts.ok}</b>
            </li>
            <li>
              <span className="key key-low" aria-hidden="true" />
              At or below reorder point <b>{counts.low}</b>
            </li>
            <li>
              <span className="key key-out" aria-hidden="true" />
              Out of stock <b>{counts.out}</b>
            </li>
          </ul>
        </div>
      </section>

      <div className="cols cols-main">
        <section className="panel" aria-labelledby="flow-title">
          <header className="panel-head">
            <div>
              <h2 id="flow-title">Units in and out</h2>
              <p className="sub">
                Last 14 days: {num(received14)} received, {num(shipped14)} shipped
              </p>
            </div>
            <ul className="legend" aria-hidden="true">
              <li>
                <span className="key key-in" /> Received
              </li>
              <li>
                <span className="key key-out" /> Shipped
              </li>
            </ul>
          </header>
          <div className="panel-body">
            <FlowChart days={dailyFlow} />
          </div>
        </section>

        <section className="panel" aria-labelledby="alerts-title">
          <header className="panel-head">
            <div>
              <h2 id="alerts-title">Needs reordering</h2>
              <p className="sub">{alerts.length} products at or below their reorder point</p>
            </div>
          </header>
          <ul className="alerts">
            {alerts.slice(0, 7).map((p) => {
              const covered = openOrderFor(p.sku, orders);
              const supplier = suppliers.find((s) => s.id === p.supplier);
              return (
                <li key={p.sku}>
                  <div className="alert-main">
                    <span className="alert-name">{p.name}</span>
                    <span className="alert-meta">
                      <BinLabel bin={p.bin} />
                      <span className={p.onHand === 0 ? "out-text" : "low-text"}>
                        {p.onHand === 0 ? "None left" : `${num(p.onHand)} left`}
                      </span>
                      <span className="muted">reorder at {num(p.reorderPoint)}</span>
                    </span>
                  </div>
                  {covered ? (
                    <Link className="covered" to={`/orders/${covered.id}`}>
                      {covered.status === "Draft" ? "In draft" : "Ordered"} {covered.id}
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-small" onClick={() => navigate(`/orders/${reorder(p.sku)}`)} title={`Add ${num(p.reorderQty)} to an order from ${supplier?.name}`}>
                      Reorder {num(p.reorderQty)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {alerts.length > 7 && (
            <footer className="panel-foot">
              <Link to="/products?status=attention">All {alerts.length} products</Link>
            </footer>
          )}
        </section>
      </div>

      <section className="panel table-wrap" aria-labelledby="recent-title">
        <header className="panel-head">
          <h2 id="recent-title">Latest movements</h2>
          <Link to="/movements" className="head-link">
            All movements
          </Link>
        </header>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Type</th>
              <th scope="col">Product</th>
              <th scope="col" className="num">
                Units
              </th>
              <th scope="col" className="hide-sm">
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            {movements.slice(0, 6).map((m) => (
              <tr key={m.id}>
                <td className="nowrap">
                  {shortDate(m.at)}, {time(m.at)}
                </td>
                <td>{m.type}</td>
                <td>{name(m.sku)}</td>
                <td className={`num mono ${m.qty > 0 ? "in-text" : ""}`}>{signed(m.qty)}</td>
                <td className="muted hide-sm">{m.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

import { Link, useParams } from "react-router";
import { BinLabel } from "../components/Bits";
import { suppliers } from "../data/inventory";
import { longDate, money, num, unitMoney } from "../lib/format";
import { orderTotal, placeOrder, receiveOrder, useInventory } from "../lib/store";
import { NotFound } from "./NotFound";
import { OrderState } from "./Orders";

export function OrderDetail() {
  const { id } = useParams();
  const { orders, products } = useInventory();
  const order = orders.find((o) => o.id === id);
  if (!order) return <NotFound />;
  const supplier = suppliers.find((s) => s.id === order.supplier);
  const product = (sku: string) => products.find((p) => p.sku === sku);

  const steps = [
    { label: "Drafted", date: order.created, done: true },
    { label: "Ordered", date: order.status === "Draft" ? null : order.created, done: order.status !== "Draft" },
    { label: "Expected", date: order.expected, done: order.status === "Received" },
    { label: "Received", date: order.received ?? null, done: order.status === "Received" },
  ];

  return (
    <>
      <p className="crumbs">
        <Link to="/orders">Purchase orders</Link>
      </p>
      <header className="page-head">
        <div>
          <h1 className="mono-title">{order.id}</h1>
          <p className="sub">
            {supplier?.name}, <OrderState status={order.status} expected={order.expected} received={order.received} />
          </p>
        </div>
        <div className="head-actions">
          {order.status === "Draft" && (
            <button type="button" className="btn" onClick={() => placeOrder(order.id)}>
              Send to {supplier?.name}
            </button>
          )}
          {order.status === "Ordered" && (
            <button type="button" className="btn" onClick={() => receiveOrder(order.id)}>
              Mark received
            </button>
          )}
        </div>
      </header>

      <div className="cols cols-detail">
        <section className="panel table-wrap" aria-label="Order lines">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col" className="hide-sm">Bin</th>
                <th scope="col" className="num">Ordered</th>
                <th scope="col" className="num hide-sm">On hand</th>
                <th scope="col" className="num hide-sm">Unit cost</th>
                <th scope="col" className="num">Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((l) => {
                const p = product(l.sku);
                return (
                  <tr key={l.sku}>
                    <th scope="row">
                      <span className="cell-main">{p?.name ?? l.sku}</span>
                      <span className="cell-sub mono">{l.sku}</span>
                    </th>
                    <td className="hide-sm">{p && <BinLabel bin={p.bin} />}</td>
                    <td className="num mono">{num(l.qty)}</td>
                    <td className="num mono hide-sm">{p ? num(p.onHand) : ""}</td>
                    <td className="num mono hide-sm">{unitMoney(l.unitCost)}</td>
                    <td className="num mono">{money(l.qty * l.unitCost)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2} className="hide-sm">
                  Total
                </th>
                <th scope="row" className="show-sm">
                  Total
                </th>
                <td className="num mono">{num(order.lines.reduce((a, l) => a + l.qty, 0))}</td>
                <td className="hide-sm" />
                <td className="hide-sm" />
                <td className="num mono">{money(orderTotal(order))}</td>
              </tr>
            </tfoot>
          </table>
          {order.note && <p className="note">{order.note}</p>}
        </section>

        <aside className="panel side-panel">
          <h2>Progress</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.label} className={s.done ? "done" : ""}>
                <span className="step-dot" aria-hidden="true" />
                <span>{s.label}</span>
                <span className="muted">{s.date ? longDate(s.date) : "Not yet"}</span>
              </li>
            ))}
          </ol>
          <h2>Supplier</h2>
          <dl className="facts">
            <div><dt>Contact</dt><dd>{supplier?.contact}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${supplier?.email}?subject=${order.id}`}>{supplier?.email}</a></dd></div>
            <div><dt>Usual lead time</dt><dd>{supplier?.leadDays} days</dd></div>
          </dl>
        </aside>
      </div>
    </>
  );
}

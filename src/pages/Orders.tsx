import { Link, useSearchParams } from "react-router";
import { suppliers, type OrderStatus } from "../data/inventory";
import { daysBetween, longDate, money, num, todayISO } from "../lib/format";
import { orderTotal, useInventory } from "../lib/store";

const tabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Draft", label: "Drafts" },
  { id: "Ordered", label: "On the way" },
  { id: "Received", label: "Received" },
];

export function OrderState({ status, expected, received }: { status: OrderStatus; expected: string; received?: string }) {
  if (status === "Received") return <span className="status status-ok"><span className="status-dot" aria-hidden="true" />Received {received ? longDate(received) : ""}</span>;
  if (status === "Draft") return <span className="status status-draft"><span className="status-dot" aria-hidden="true" />Draft</span>;
  const d = daysBetween(todayISO(), expected);
  const text = d < 0 ? `${-d} ${-d === 1 ? "day" : "days"} late` : d === 0 ? "Due today" : `Due in ${d} ${d === 1 ? "day" : "days"}`;
  return <span className={`status ${d < 0 ? "status-out" : "status-way"}`}><span className="status-dot" aria-hidden="true" />{text}</span>;
}

export function Orders() {
  const { orders } = useInventory();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("status") ?? "all") as OrderStatus | "all";
  const shown = orders.filter((o) => tab === "all" || o.status === tab);
  const onTheWay = orders.filter((o) => o.status === "Ordered");
  const supplierName = (id: string) => suppliers.find((s) => s.id === id)?.name ?? id;

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Purchase orders</h1>
          <p className="sub">
            {onTheWay.length} on the way, {money(onTheWay.reduce((a, o) => a + orderTotal(o), 0))} at cost
          </p>
        </div>
      </header>
      <div className="filters">
        <div className="segmented" role="radiogroup" aria-label="Order status">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={tab === t.id} onClick={() => setParams(t.id === "all" ? {} : { status: t.id }, { replace: true })}>
              {t.label} <span className="seg-count">{t.id === "all" ? orders.length : orders.filter((o) => o.status === t.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Supplier</th>
              <th scope="col">Status</th>
              <th scope="col" className="hide-sm">Expected</th>
              <th scope="col" className="num hide-sm">Units</th>
              <th scope="col" className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id} className="row-link">
                <th scope="row">
                  <Link to={`/orders/${o.id}`} className="mono strong-link">
                    {o.id}
                  </Link>
                  <span className="cell-sub">{o.lines.length} {o.lines.length === 1 ? "product" : "products"}, created {longDate(o.created)}</span>
                </th>
                <td>{supplierName(o.supplier)}</td>
                <td>
                  <OrderState status={o.status} expected={o.expected} received={o.received} />
                </td>
                <td className="hide-sm nowrap">{longDate(o.expected)}</td>
                <td className="num mono hide-sm">{num(o.lines.reduce((a, l) => a + l.qty, 0))}</td>
                <td className="num mono">{money(orderTotal(o))}</td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={6} className="empty">No orders here</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

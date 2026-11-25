import { ArrowLeftRight, ClipboardList, Factory, LayoutGrid, Moon, Package, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { app } from "../data/inventory";
import { num } from "../lib/format";
import { statusOf, useInventory } from "../lib/store";

export function Layout() {
  const { products, orders } = useInventory();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Storage can be blocked; the choice still holds for this visit
    }
  }, [dark]);

  const needs = products.filter((p) => statusOf(p) !== "ok").length;
  const open = orders.filter((o) => o.status !== "Received").length;
  const nav = [
    { to: "/", label: "Overview", icon: LayoutGrid, count: null },
    { to: "/products", label: "Products", icon: Package, count: needs ? `${num(needs)} low` : null },
    { to: "/orders", label: "Purchase orders", icon: ClipboardList, count: open ? `${open} open` : null },
    { to: "/suppliers", label: "Suppliers", icon: Factory, count: null },
    { to: "/movements", label: "Stock movements", icon: ArrowLeftRight, count: null },
  ];

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className="side">
        <div className="brand">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect x="1" y="3" width="20" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M1 11h20M11 3v16" stroke="currentColor" strokeWidth="1.8" />
            <rect x="13" y="13" width="6" height="4" rx="1" fill="var(--accent)" />
          </svg>
          <span>{app.name}</span>
        </div>
        <div className="site">
          <span className="site-name">{app.company}</span>
          <span className="site-sub">{app.warehouse}</span>
        </div>
        <nav aria-label="Main">
          <ul>
            {nav.map(({ to, label, icon: Icon, count }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span className="nav-label">{label}</span>
                  {count && <span className="nav-count">{count}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="side-foot">
          <button type="button" className="ghost" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun size={16} strokeWidth={1.5} aria-hidden="true" /> : <Moon size={16} strokeWidth={1.5} aria-hidden="true" />}
            {dark ? "Light theme" : "Dark theme"}
          </button>
          <p className="side-note">Sample data. Everything comes from src/data/inventory.ts.</p>
        </div>
      </aside>
      <main id="main" className="main" key={pathname}>
        <Outlet />
      </main>
    </div>
  );
}

import { app } from "../data/inventory";

const n0 = new Intl.NumberFormat("en-US");
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: app.currency, maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: app.currency, minimumFractionDigits: 2 });

export const todayISO = () => app.today ?? new Date().toISOString().slice(0, 10);
/** 1,240 */
export const num = (n: number) => n0.format(Math.round(n));
/** $48,210 */
export const money = (n: number) => usd.format(n);
/** $9.40 */
export const unitMoney = (n: number) => usd2.format(n);
/** +480 or −60 with a true minus */
export const signed = (n: number) => (n > 0 ? `+${num(n)}` : n < 0 ? `−${num(Math.abs(n))}` : "0");

const asDate = (iso: string) => new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
const md = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const mdy = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const wd = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const tm = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export const shortDate = (iso: string) => md.format(asDate(iso));
export const longDate = (iso: string) => mdy.format(asDate(iso));
export const weekday = (iso: string) => wd.format(asDate(iso));
export const time = (iso: string) => tm.format(asDate(iso)).replace(" AM", " am").replace(" PM", " pm");

/** Whole days from a to b (dates as YYYY-MM-DD) */
export function daysBetween(a: string, b: string) {
  return Math.round((asDate(b).getTime() - asDate(a).getTime()) / 86_400_000);
}

import { useEffect, useRef, useState } from "react";
import { num, shortDate, weekday } from "../lib/format";

type Day = { date: string; in: number; out: number };

/** Units received above the line and shipped below it, one pair of bars per day */
export function FlowChart({ days }: { days: Day[] }) {
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 520 ? 260 : 340;
  const pad = { top: 16, bottom: 28, left: 44, right: 8 };
  const maxIn = Math.max(...days.map((d) => d.in), 1);
  const maxOut = Math.max(...days.map((d) => d.out), 1);
  const step = 250;
  const top = Math.ceil(maxIn / step) * step;
  const bottom = Math.ceil(maxOut / step) * step;
  const ih = H - pad.top - pad.bottom;
  const zero = pad.top + (top / (top + bottom)) * ih;
  const unit = ih / (top + bottom);
  const iw = W - pad.left - pad.right;
  const slot = iw / days.length;
  const bw = Math.min(28, slot * 0.56);
  const ticks: number[] = [];
  for (let v = top; v >= -bottom; v -= step) ticks.push(v);
  const today = days.length - 1;

  return (
    <div className="flow" ref={box}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Units received and shipped per day, last 14 days" onPointerLeave={() => setActive(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line className={t === 0 ? "axis-zero" : "grid"} x1={pad.left} x2={W - pad.right} y1={zero - t * unit} y2={zero - t * unit} />
            <text className="axis" x={pad.left - 8} y={zero - t * unit + 4} textAnchor="end">
              {t === 0 ? "0" : t > 0 ? num(t) : `−${num(-t)}`}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const cx = pad.left + slot * i + slot / 2;
          return (
            <g key={d.date} onPointerEnter={() => setActive(i)} className={active === i ? "col active" : "col"}>
              <rect className="hit" x={cx - slot / 2} y={pad.top} width={slot} height={ih} />
              {d.in > 0 && <rect className="bar-in" x={cx - bw / 2} y={zero - d.in * unit} width={bw} height={d.in * unit} rx={3} />}
              {d.out > 0 && <rect className={i === today ? "bar-out bar-today" : "bar-out"} x={cx - bw / 2} y={zero} width={bw} height={d.out * unit} rx={3} />}
              {(i % 2 === 1 || i === today) && (
                <text className="axis" x={cx} y={H - 8} textAnchor="middle">
                  {i === today ? "Today" : shortDate(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="flow-readout" aria-live="polite">
        {active === null ? (
          <span className="muted">Point at a day to read it</span>
        ) : (
          <>
            <span>
              {weekday(days[active].date)}, {shortDate(days[active].date)}
            </span>
            <span>
              <span className="key key-in" aria-hidden="true" /> {num(days[active].in)} received
            </span>
            <span>
              <span className="key key-out" aria-hidden="true" /> {num(days[active].out)} shipped
            </span>
          </>
        )}
      </p>
      <table className="sr-only">
        <caption>Units per day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Received</th>
            <th scope="col">Shipped</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}>
              <th scope="row">{shortDate(d.date)}</th>
              <td>{d.in}</td>
              <td>{d.out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

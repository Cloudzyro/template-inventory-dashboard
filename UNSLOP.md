# Unslop notes

Pass made with the unslop skill by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.

## Audit (first build)

Level: light. Built against the skill from the start (graphite surfaces, one safety amber accent with dark text, weights 400 to 600, sentence case, no sparklines, a light sidebar so it doesn't repeat the dark-sidebar dashboards), so the first render showed a few real signs:

- Units in and out: the chart was drawn at a fixed 720px and scaled down, so its axis labels shrank to about 8px and the panel left a tall empty band beside the reordering list
- Products: each row's second line (SKU, category and supplier in mono) wrapped to three lines and made the table look noisy
- Phones: the single grid column let the sidebar's tab row widen the page to 661px; hidden table captions (`sr-only`) inside scrolling tables pushed the Products page to 497px at 360px
- Stock health: four status colors would have competed; kept to graphite for in stock, amber for at or below the reorder point and red only for out of stock

None of: gradients, glows, gradient text, emoji, uppercase tracked labels, pill badges, greeting headline, sparklines, rainbow bars, hover scale, transition-all, looping motion, hype words.

## Direction

- Product: stock control for a small restaurant supply warehouse: what's low, what's on the way, what moved
- Character: practical, sturdy, precise
- World: warehouse aisles, yellow bin labels, safety floor markings, a clipboard of purchase orders
- Moments: the mirrored received and shipped chart (deliveries in amber above the line, shipments in grey below) and the on-hand bars with a tick at each reorder point
- Signature: bin locations printed like shelf labels (mono on label yellow), wherever a location appears

## Fixes

- Chart: measured to its panel and redrawn at real size, 340px tall (260px on phones), labels at 11px; a readout line names the day you point at
- Products: second line is SKU and category only; supplier lives on the Suppliers page and the order page
- Layout: `minmax(0, 1fr)` columns and positioned scroll containers, so no page overflows at 360px (checked every route)
- Spacing: 248px sidebar with 36px nav rows and 2px gaps, 14px panel radius, 52px table rows, 60px alert rows
- Color: amber only on primary actions, deliveries and low stock; red only for out of stock and late orders; green only for units received in the ledger
- Motion: one 320ms fade and rise per page, color transitions and a 0.98 press; all off with reduced motion

## Screenshots

- screenshot-2: Products filtered to low or out of stock, with reorder actions and the orders that cover them
- screenshot-3: A purchase order (PO-2418) in dark mode, with lines, progress and supplier

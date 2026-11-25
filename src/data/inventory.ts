// Every product, supplier, order and movement on the dashboard comes from this
// file. It's sample data for a fictional restaurant supply warehouse, Copperline
// Supply Co. Replace these arrays with calls to your own API when you're ready.

export const app = {
  name: "Binwise",
  company: "Copperline Supply Co",
  warehouse: "Reno warehouse",
  /** The sample data treats this date as today, so the demo always looks current. Set to null to use the real date. */
  today: "2026-11-25" as string | null,
  currency: "USD",
};

export type Category = "Bakeware" | "Cutlery" | "Smallwares" | "Storage" | "Disposables" | "Tabletop";
export const categories: Category[] = ["Bakeware", "Cutlery", "Smallwares", "Storage", "Disposables", "Tabletop"];

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  leadDays: number;
  onTime: number; // share of orders delivered by the expected date, last 12 months
};

export const suppliers: Supplier[] = [
  { id: "harlow", name: "Harlow Metalworks", contact: "Dana Pruitt", email: "orders@harlowmetal.example", city: "Sacramento, CA", leadDays: 6, onTime: 0.96 },
  { id: "kestrel", name: "Kestrel Cutlery", contact: "Imran Qadri", email: "sales@kestrelcutlery.example", city: "Portland, OR", leadDays: 10, onTime: 0.88 },
  { id: "bayside", name: "Bayside Plastics", contact: "Lena Okafor", email: "lena@baysideplastics.example", city: "Oakland, CA", leadDays: 4, onTime: 0.93 },
  { id: "greenleaf", name: "Greenleaf Disposables", contact: "Tom Arceneaux", email: "orders@greenleafdisp.example", city: "Salt Lake City, UT", leadDays: 3, onTime: 0.98 },
  { id: "mesa", name: "Mesa Ceramics", contact: "Rosa Villanueva", email: "rosa@mesaceramics.example", city: "Tucson, AZ", leadDays: 14, onTime: 0.81 },
];

export type Product = {
  sku: string;
  name: string;
  category: Category;
  bin: string; // aisle-bay-shelf
  onHand: number;
  reorderPoint: number;
  reorderQty: number;
  unitCost: number;
  supplier: string;
};

export const products: Product[] = [
  { sku: "BK-1826", name: "Half sheet pan, aluminum", category: "Bakeware", bin: "A-01-1", onHand: 412, reorderPoint: 150, reorderQty: 300, unitCost: 9.4, supplier: "harlow" },
  { sku: "BK-1813", name: "Quarter sheet pan, aluminum", category: "Bakeware", bin: "A-01-2", onHand: 96, reorderPoint: 120, reorderQty: 240, unitCost: 6.8, supplier: "harlow" },
  { sku: "BK-2210", name: "Wire cooling rack, half size", category: "Bakeware", bin: "A-01-3", onHand: 188, reorderPoint: 80, reorderQty: 160, unitCost: 7.25, supplier: "harlow" },
  { sku: "BK-3304", name: "Loaf pan, 1 lb", category: "Bakeware", bin: "A-02-1", onHand: 0, reorderPoint: 60, reorderQty: 144, unitCost: 4.9, supplier: "harlow" },
  { sku: "BK-4410", name: "Silicone baking mat, half size", category: "Bakeware", bin: "A-02-2", onHand: 235, reorderPoint: 100, reorderQty: 200, unitCost: 8.1, supplier: "bayside" },
  { sku: "CT-1008", name: "Chef knife, 8 in", category: "Cutlery", bin: "B-01-1", onHand: 64, reorderPoint: 40, reorderQty: 96, unitCost: 22.5, supplier: "kestrel" },
  { sku: "CT-1010", name: "Chef knife, 10 in", category: "Cutlery", bin: "B-01-2", onHand: 18, reorderPoint: 24, reorderQty: 48, unitCost: 27.0, supplier: "kestrel" },
  { sku: "CT-2006", name: "Boning knife, 6 in", category: "Cutlery", bin: "B-01-3", onHand: 41, reorderPoint: 20, reorderQty: 48, unitCost: 17.4, supplier: "kestrel" },
  { sku: "CT-3009", name: "Bread knife, 9 in", category: "Cutlery", bin: "B-02-1", onHand: 29, reorderPoint: 20, reorderQty: 48, unitCost: 19.9, supplier: "kestrel" },
  { sku: "CT-4012", name: "Honing steel, 12 in", category: "Cutlery", bin: "B-02-2", onHand: 9, reorderPoint: 12, reorderQty: 36, unitCost: 14.6, supplier: "kestrel" },
  { sku: "SW-1012", name: "Tongs, 12 in, locking", category: "Smallwares", bin: "C-01-1", onHand: 520, reorderPoint: 200, reorderQty: 480, unitCost: 2.35, supplier: "harlow" },
  { sku: "SW-1104", name: "Ladle, 4 oz", category: "Smallwares", bin: "C-01-2", onHand: 146, reorderPoint: 90, reorderQty: 180, unitCost: 3.6, supplier: "harlow" },
  { sku: "SW-1210", name: "French whisk, 10 in", category: "Smallwares", bin: "C-01-3", onHand: 77, reorderPoint: 60, reorderQty: 120, unitCost: 4.15, supplier: "harlow" },
  { sku: "SW-1320", name: "Squeeze bottle, 20 oz", category: "Smallwares", bin: "C-02-1", onHand: 34, reorderPoint: 150, reorderQty: 600, unitCost: 0.85, supplier: "bayside" },
  { sku: "SW-1401", name: "Pocket thermometer", category: "Smallwares", bin: "C-02-2", onHand: 58, reorderPoint: 50, reorderQty: 100, unitCost: 6.9, supplier: "kestrel" },
  { sku: "SW-1518", name: "Cutting board, 18 x 24, white", category: "Smallwares", bin: "C-03-1", onHand: 92, reorderPoint: 40, reorderQty: 80, unitCost: 18.2, supplier: "bayside" },
  { sku: "SW-1519", name: "Cutting board, 18 x 24, green", category: "Smallwares", bin: "C-03-2", onHand: 0, reorderPoint: 20, reorderQty: 40, unitCost: 18.2, supplier: "bayside" },
  { sku: "ST-2006", name: "Food storage box, 6 qt", category: "Storage", bin: "D-01-1", onHand: 288, reorderPoint: 120, reorderQty: 240, unitCost: 5.4, supplier: "bayside" },
  { sku: "ST-2012", name: "Food storage box, 12 qt", category: "Storage", bin: "D-01-2", onHand: 141, reorderPoint: 80, reorderQty: 160, unitCost: 8.75, supplier: "bayside" },
  { sku: "ST-2022", name: "Ingredient bin, 22 gal", category: "Storage", bin: "D-02-1", onHand: 12, reorderPoint: 15, reorderQty: 30, unitCost: 39.0, supplier: "bayside" },
  { sku: "ST-3216", name: "Deli container, 16 oz, case of 240", category: "Storage", bin: "D-03-1", onHand: 66, reorderPoint: 40, reorderQty: 120, unitCost: 21.6, supplier: "greenleaf" },
  { sku: "ST-3232", name: "Deli container, 32 oz, case of 240", category: "Storage", bin: "D-03-2", onHand: 38, reorderPoint: 40, reorderQty: 120, unitCost: 29.4, supplier: "greenleaf" },
  { sku: "DS-4001", name: "Nitrile gloves, large, box of 100", category: "Disposables", bin: "E-01-1", onHand: 940, reorderPoint: 400, reorderQty: 1200, unitCost: 4.2, supplier: "greenleaf" },
  { sku: "DS-4002", name: "Nitrile gloves, medium, box of 100", category: "Disposables", bin: "E-01-2", onHand: 310, reorderPoint: 400, reorderQty: 1200, unitCost: 4.2, supplier: "greenleaf" },
  { sku: "DS-4110", name: "Kraft takeout box, case of 200", category: "Disposables", bin: "E-02-1", onHand: 174, reorderPoint: 100, reorderQty: 300, unitCost: 31.5, supplier: "greenleaf" },
  { sku: "DS-4205", name: "Parchment sheets, case of 1000", category: "Disposables", bin: "E-02-2", onHand: 83, reorderPoint: 50, reorderQty: 150, unitCost: 24.8, supplier: "greenleaf" },
  { sku: "TB-5008", name: "Ramekin, 3 oz, stoneware", category: "Tabletop", bin: "F-01-1", onHand: 720, reorderPoint: 300, reorderQty: 720, unitCost: 1.1, supplier: "mesa" },
  { sku: "TB-5110", name: "Dinner plate, 10.5 in, stoneware", category: "Tabletop", bin: "F-01-2", onHand: 264, reorderPoint: 288, reorderQty: 576, unitCost: 6.4, supplier: "mesa" },
  { sku: "TB-5212", name: "Pasta bowl, 12 oz, stoneware", category: "Tabletop", bin: "F-02-1", onHand: 402, reorderPoint: 240, reorderQty: 480, unitCost: 5.1, supplier: "mesa" },
  { sku: "TB-5320", name: "Sizzle platter, cast iron", category: "Tabletop", bin: "F-02-2", onHand: 47, reorderPoint: 36, reorderQty: 72, unitCost: 11.3, supplier: "harlow" },
];

export type OrderStatus = "Draft" | "Ordered" | "Received";
export type OrderLine = { sku: string; qty: number; unitCost: number };
export type PurchaseOrder = {
  id: string;
  supplier: string;
  status: OrderStatus;
  created: string; // YYYY-MM-DD
  expected: string; // YYYY-MM-DD
  received?: string;
  lines: OrderLine[];
  note?: string;
};

export const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2418", supplier: "harlow", status: "Ordered", created: "2026-11-20", expected: "2026-11-26", lines: [{ sku: "BK-3304", qty: 144, unitCost: 4.9 }, { sku: "BK-1813", qty: 240, unitCost: 6.8 }], note: "Loaf pans are out. Ask for partial delivery if the full order slips." },
  { id: "PO-2417", supplier: "greenleaf", status: "Ordered", created: "2026-11-21", expected: "2026-11-24", lines: [{ sku: "DS-4002", qty: 1200, unitCost: 4.2 }, { sku: "ST-3232", qty: 120, unitCost: 29.4 }] },
  { id: "PO-2416", supplier: "kestrel", status: "Ordered", created: "2026-11-16", expected: "2026-11-26", lines: [{ sku: "CT-1010", qty: 48, unitCost: 27.0 }, { sku: "CT-4012", qty: 36, unitCost: 14.6 }] },
  { id: "PO-2415", supplier: "mesa", status: "Draft", created: "2026-11-24", expected: "2026-12-08", lines: [{ sku: "TB-5110", qty: 576, unitCost: 6.4 }] },
  { id: "PO-2414", supplier: "bayside", status: "Received", created: "2026-11-12", expected: "2026-11-16", received: "2026-11-16", lines: [{ sku: "ST-2006", qty: 240, unitCost: 5.4 }, { sku: "SW-1518", qty: 80, unitCost: 18.2 }] },
  { id: "PO-2413", supplier: "harlow", status: "Received", created: "2026-11-06", expected: "2026-11-12", received: "2026-11-13", lines: [{ sku: "SW-1012", qty: 480, unitCost: 2.35 }, { sku: "BK-1826", qty: 300, unitCost: 9.4 }] },
  { id: "PO-2412", supplier: "greenleaf", status: "Received", created: "2026-11-03", expected: "2026-11-06", received: "2026-11-06", lines: [{ sku: "DS-4001", qty: 1200, unitCost: 4.2 }, { sku: "DS-4110", qty: 300, unitCost: 31.5 }] },
];

export type MovementType = "Received" | "Shipped" | "Adjusted" | "Moved";
export type Movement = {
  id: string;
  at: string; // ISO date and time
  type: MovementType;
  sku: string;
  qty: number; // signed: positive in, negative out
  ref: string; // purchase order, sales order or a note
  by: string;
};

export const movements: Movement[] = [
  { id: "m31", at: "2026-11-25T09:42:00", type: "Shipped", sku: "DS-4001", qty: -60, ref: "SO-88214 Juniper Table", by: "Marco R." },
  { id: "m30", at: "2026-11-25T09:15:00", type: "Shipped", sku: "SW-1320", qty: -48, ref: "SO-88213 Fern Street Deli", by: "Marco R." },
  { id: "m29", at: "2026-11-25T08:51:00", type: "Adjusted", sku: "CT-4012", qty: -2, ref: "Cycle count, aisle B", by: "Aisha K." },
  { id: "m28", at: "2026-11-25T08:20:00", type: "Shipped", sku: "TB-5110", qty: -96, ref: "SO-88212 Harbor Grill", by: "Marco R." },
  { id: "m27", at: "2026-11-24T16:05:00", type: "Shipped", sku: "ST-3232", qty: -12, ref: "SO-88209 Two Pines Cafe", by: "Jess T." },
  { id: "m26", at: "2026-11-24T14:30:00", type: "Moved", sku: "SW-1518", qty: 0, ref: "C-03-1 from overflow O-04", by: "Aisha K." },
  { id: "m25", at: "2026-11-24T11:12:00", type: "Shipped", sku: "BK-3304", qty: -24, ref: "SO-88205 Rise Bakery", by: "Jess T." },
  { id: "m24", at: "2026-11-24T10:01:00", type: "Shipped", sku: "DS-4002", qty: -120, ref: "SO-88204 Sagebrush Kitchen", by: "Marco R." },
  { id: "m23", at: "2026-11-23T15:44:00", type: "Shipped", sku: "SW-1519", qty: -16, ref: "SO-88199 Juniper Table", by: "Jess T." },
  { id: "m22", at: "2026-11-23T13:20:00", type: "Adjusted", sku: "ST-2022", qty: -1, ref: "Damaged in handling", by: "Aisha K." },
  { id: "m21", at: "2026-11-23T09:30:00", type: "Shipped", sku: "CT-1010", qty: -12, ref: "SO-88195 Harbor Grill", by: "Marco R." },
  { id: "m20", at: "2026-11-21T16:10:00", type: "Shipped", sku: "TB-5008", qty: -240, ref: "SO-88188 Lakeview Hotel", by: "Jess T." },
  { id: "m19", at: "2026-11-21T11:00:00", type: "Shipped", sku: "SW-1012", qty: -96, ref: "SO-88186 Fern Street Deli", by: "Marco R." },
  { id: "m18", at: "2026-11-20T14:22:00", type: "Shipped", sku: "BK-1826", qty: -60, ref: "SO-88181 Rise Bakery", by: "Jess T." },
  { id: "m17", at: "2026-11-16T10:40:00", type: "Received", sku: "ST-2006", qty: 240, ref: "PO-2414", by: "Aisha K." },
  { id: "m16", at: "2026-11-16T10:35:00", type: "Received", sku: "SW-1518", qty: 80, ref: "PO-2414", by: "Aisha K." },
  { id: "m15", at: "2026-11-13T09:05:00", type: "Received", sku: "SW-1012", qty: 480, ref: "PO-2413", by: "Aisha K." },
  { id: "m14", at: "2026-11-13T09:00:00", type: "Received", sku: "BK-1826", qty: 300, ref: "PO-2413", by: "Aisha K." },
];

/** Units in and out per day for the last 14 days, oldest first. */
export const dailyFlow: { date: string; in: number; out: number }[] = [
  { date: "2026-11-12", in: 0, out: 412 },
  { date: "2026-11-13", in: 780, out: 365 },
  { date: "2026-11-14", in: 0, out: 298 },
  { date: "2026-11-15", in: 0, out: 120 },
  { date: "2026-11-16", in: 320, out: 88 },
  { date: "2026-11-17", in: 0, out: 446 },
  { date: "2026-11-18", in: 150, out: 502 },
  { date: "2026-11-19", in: 0, out: 389 },
  { date: "2026-11-20", in: 0, out: 455 },
  { date: "2026-11-21", in: 96, out: 610 },
  { date: "2026-11-22", in: 0, out: 140 },
  { date: "2026-11-23", in: 0, out: 72 },
  { date: "2026-11-24", in: 0, out: 520 },
  { date: "2026-11-25", in: 0, out: 204 },
];

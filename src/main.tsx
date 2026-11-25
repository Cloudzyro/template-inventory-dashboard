import "@fontsource-variable/archivo";
import "@fontsource-variable/red-hat-mono";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import "./index.css";
import { Movements } from "./pages/Movements";
import { NotFound } from "./pages/NotFound";
import { OrderDetail } from "./pages/OrderDetail";
import { Orders } from "./pages/Orders";
import { Overview } from "./pages/Overview";
import { Products } from "./pages/Products";
import { Suppliers } from "./pages/Suppliers";

// A hash router keeps every address after a "#" (for example /#/products?status=out),
// so the server only ever has to send index.html. Deep links and refreshes
// work on any static host with no rewrite rules.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Overview /> },
      { path: "/products", element: <Products /> },
      { path: "/orders", element: <Orders /> },
      { path: "/orders/:id", element: <OrderDetail /> },
      { path: "/suppliers", element: <Suppliers /> },
      { path: "/movements", element: <Movements /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

  import { useState, useMemo } from "react";

const INIT_STATE = {
  products: [
    { id: 1, name: "Nike Shoe", price: 2000, stock: 10 },
    { id: 2, name: "Adidas Shoe", price: 1800, stock: 8 },
    { id: 3, name: "Puma Shoe", price: 1500, stock: 5 },
  ],
  customers: [
    { id: 1, name: "Rahul", totalBuy: 5000 },
    { id: 2, name: "Aman", totalBuy: 3000 },
  ],
  sales: [],
  purchases: [],
};

let _seq = 100;
const uid = () => _seq++;
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const todayStr = () => new Date().toISOString().split("T")[0];
const padInv = (n) => `INV-${String(n).padStart(3, "0")}`;

export default function App() {
  const [db, setDb] = useState(INIT_STATE);
  const [page, setPage] = useState("dashboard");

  const stats = useMemo(() => {
    const totalRevenue = db.sales.reduce((a, s) => a + s.total, 0);
    const totalCost = db.purchases.reduce((a, p) => a + p.total, 0);
    return { totalRevenue, totalCost };
  }, [db]);

  const addSale = () => {
    const invoiceNo = padInv(db.sales.length + 1);

    db.products.slice(0, 2).forEach((p) => {
      if (p.stock <= 0) return;

      setDb((prev) => ({
        ...prev,
        sales: [
          ...prev.sales,
          {
            id: uid(),
            invoiceNo,
            productName: p.name,
            total: p.price,
            date: todayStr(),
          },
        ],
        products: prev.products.map((x) =>
          x.id === p.id ? { ...x, stock: x.stock - 1 } : x
        ),
      }));
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Shoe Shop Manager</h1>

      {/* MENU */}
      <div style={{ marginBottom: 20 }}>
        {[
          "dashboard",
          "inventory",
          "invoice",
          "analytics",
          "stock",
          "customer",
          "help",
          "settings",
        ].map((p) => (
          <button key={p} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Total Revenue: {fmt(stats.totalRevenue)}</p>
          <p>Total Purchase: {fmt(stats.totalCost)}</p>
        </div>
      )}

      {/* INVENTORY */}
      {page === "inventory" && (
        <div>
          <h2>Inventory</h2>
          {db.products.map((p) => (
            <p key={p.id}>
              {p.name} - {fmt(p.price)} (Stock: {p.stock})
            </p>
          ))}
        </div>
      )}

      {/* INVOICE */}
      {page === "invoice" && (
        <div>
          <h2>Invoice</h2>
          <button onClick={addSale}>Generate Invoice</button>

          {db.sales.map((s) => (
            <p key={s.id}>
              {s.invoiceNo} - {s.productName} - {fmt(s.total)}
            </p>
          ))}
        </div>
      )}

      {/* ANALYTICS */}
      {page === "analytics" && (
        <div>
          <h2>Analytics</h2>
          <p>Total Sales: {db.sales.length}</p>
          <p>Products Count: {db.products.length}</p>
          <p>Customers: {db.customers.length}</p>
        </div>
      )}

      {/* STOCK */}
      {page === "stock" && (
        <div>
          <h2>Stock</h2>
          {db.products.map((p) => (
            <p key={p.id}>
              {p.name}: {p.stock} left
            </p>
          ))}
        </div>
      )}

      {/* CUSTOMER */}
      {page === "customer" && (
        <div>
          <h2>Customers</h2>
          {db.customers.map((c) => (
            <p key={c.id}>
              {c.name} - Total Buy: {fmt(c.totalBuy)}
            </p>
          ))}
        </div>
      )}

      {/* HELP */}
      {page === "help" && (
        <div>
          <h2>Help</h2>
          <p>1. Add products in inventory</p>
          <p>2. Purchase to increase stock</p>
          <p>3. Sales to generate invoice</p>
        </div>
      )}

      {/* SETTINGS */}
      {page === "settings" && (
        <div>
          <h2>Settings</h2>
          <p>Shop Name: Shoe Shop Manager</p>
          <p>Currency: INR (₹)</p>
        </div>
      )}
    </div>
  );
}
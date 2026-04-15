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

  // ✅ DISPATCH FIX
  const dispatch = (action) => {
    switch (action.type) {
      case "STOCK_IN":
        setDb((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === action.productId
              ? { ...p, stock: p.stock + action.qty }
              : p
          ),
        }));
        break;

      case "STOCK_OUT":
        setDb((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === action.productId
              ? { ...p, stock: p.stock - action.qty }
              : p
          ),
        }));
        break;

      case "ADD_SALE":
        setDb((prev) => ({
          ...prev,
          sales: [...prev.sales, { ...action.data, id: uid() }],
        }));
        break;

      default:
        break;
    }
  };

  // ✅ HANDLE SALE FIX
  const handleSale = () => {
    if (!db.products.length) return alert("No product");

    const product = db.products[0];

    if (product.stock <= 0) return alert("Out of stock");

    const invoiceNo = padInv(db.sales.length + 1);

    dispatch({
      type: "ADD_SALE",
      data: {
        invoiceNo,
        productName: product.name,
        productId: product.id,
        qty: 1,
        price: product.price,
        total: product.price,
        date: todayStr(),
      },
    });

    dispatch({
      type: "STOCK_OUT",
      productId: product.id,
      qty: 1,
    });
  };

  const stats = useMemo(() => {
    const totalRevenue = db.sales.reduce((a, s) => a + s.total, 0);
    return { totalRevenue };
  }, [db]);

  return (
    <div className="container">
      <h1>Shoe Shop Manager</h1>

      {/* MENU */}
      <div className="navbar">
        {[
          "dashboard",
          "products",
          "purchase",
          "sales",
          "inventory",
          "invoice",
          "analytics",
          "stock",
          "customer",
          "help",
          "settings",
        ].map((p) => (
          <button key={p} className="btn" onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div className="card">
          <h2>Dashboard</h2>
          <p>Total Revenue: {fmt(stats.totalRevenue)}</p>
        </div>
      )}

      {/* PRODUCTS */}
      {page === "products" && (
        <div className="card">
          <h2>Products</h2>
          {db.products.map((p) => (
            <div className="list-item" key={p.id}>
              <span>{p.name} - {fmt(p.price)}</span>
              <span>Stock: {p.stock}</span>
            </div>
          ))}
        </div>
      )}

      {/* PURCHASE */}
      {page === "purchase" && (
        <div className="card">
          <h2>Purchase</h2>
          {db.products.map((p) => (
            <div className="list-item" key={p.id}>
              {p.name}
              <button
                className="btn"
                onClick={() =>
                  dispatch({
                    type: "STOCK_IN",
                    productId: p.id,
                    qty: 5,
                  })
                }
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SALES */}
      {page === "sales" && (
        <div className="card">
          <h2>Sales</h2>
          <button className="btn" onClick={handleSale}>
            Sell Product
          </button>

          {db.sales.map((s) => (
            <div className="list-item" key={s.id}>
              {s.productName} - {fmt(s.total)}
            </div>
          ))}
        </div>
      )}

      {/* INVENTORY */}
      {page === "inventory" && (
        <div className="card">
          <h2>Inventory</h2>
          {db.products.map((p) => (
            <div key={p.id}>
              {p.name} ({p.stock})
            </div>
          ))}
        </div>
      )}

      {/* INVOICE */}
      {page === "invoice" && (
        <div className="card">
          <h2>Invoice</h2>
          {db.sales.map((s) => (
            <div key={s.id}>
              {s.invoiceNo} - {s.productName} - {fmt(s.total)}
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS */}
      {page === "analytics" && (
        <div className="card">
          <h2>Analytics</h2>
          <p>Total Sales: {db.sales.length}</p>
        </div>
      )}

      {/* STOCK */}
      {page === "stock" && (
        <div className="card">
          <h2>Stock</h2>
          {db.products.map((p) => (
            <div key={p.id}>
              {p.name}: {p.stock}
            </div>
          ))}
        </div>
      )}

      {/* CUSTOMER */}
      {page === "customer" && (
        <div className="card">
          <h2>Customers</h2>
          {db.customers.map((c) => (
            <div key={c.id}>
              {c.name} - {fmt(c.totalBuy)}
            </div>
          ))}
        </div>
      )}

      {/* HELP */}
      {page === "help" && (
        <div className="card">
          <h2>Help</h2>
          <p>Use menu to manage shop</p>
        </div>
      )}

      {/* SETTINGS */}
      {page === "settings" && (
        <div className="card">
          <h2>Settings</h2>
          <p>Currency: ₹</p>
        </div>
      )}
    </div>
  );
}
  import { useState, useMemo } from "react";

const INIT_STATE = {
  products: [],
  purchases: [],
  sales: [],
};

let _seq = 1;
const uid = () => _seq++;
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const todayStr = () => new Date().toISOString().split("T")[0];
const padInv = (n) => `INV-${String(n).padStart(3, "0")}`;

function reducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.data] };

    case "STOCK_IN":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.productId
            ? { ...p, stock: p.stock + action.qty }
            : p
        ),
      };

    case "STOCK_OUT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.productId
            ? { ...p, stock: p.stock - action.qty }
            : p
        ),
      };

    case "ADD_PURCHASE":
      return {
        ...state,
        purchases: [...state.purchases, { ...action.data, id: uid() }],
      };

    case "ADD_SALE":
      return {
        ...state,
        sales: [...state.sales, { ...action.data, id: uid() }],
      };

    default:
      return state;
  }
}

export default function App() {
  const [db, setDb] = useState(INIT_STATE);
  const dispatch = (action) => setDb((prev) => reducer(prev, action));

  const [page, setPage] = useState("dashboard");

  const stats = useMemo(() => {
    const totalRevenue = db.sales.reduce((a, s) => a + s.total, 0);
    const totalCost = db.purchases.reduce((a, p) => a + p.total, 0);
    return { totalRevenue, totalCost };
  }, [db]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Shoe Shop Manager</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={() => setPage("purchase")}>Purchase</button>
        <button onClick={() => setPage("sales")}>Sales</button>
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Total Revenue: {fmt(stats.totalRevenue)}</p>
          <p>Total Purchase: {fmt(stats.totalCost)}</p>
        </div>
      )}

      {/* PRODUCTS (ADMIN ADD - LIMIT 10) */}
      {page === "products" && (
        <div>
          <h2>Products (Admin)</h2>

          <button
            onClick={() => {
              if (db.products.length >= 10) {
                alert("Only 10 products allowed");
                return;
              }

              dispatch({
                type: "ADD_PRODUCT",
                data: {
                  id: uid(),
                  name: "Shoe " + (db.products.length + 1),
                  price: 1000 + db.products.length * 100,
                  stock: 10,
                },
              });
            }}
          >
            Add Product
          </button>

          <ul>
            {db.products.map((p) => (
              <li key={p.id}>
                {p.name} - {fmt(p.price)} (Stock: {p.stock})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PURCHASE PAGE (SHOW PRODUCT LIST) */}
      {page === "purchase" && (
        <div>
          <h2>Purchase</h2>

          {db.products.map((p) => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              {p.name} - {fmt(p.price)}

              <button
                onClick={() => {
                  dispatch({
                    type: "ADD_PURCHASE",
                    data: {
                      productName: p.name,
                      productId: p.id,
                      qty: 5,
                      price: p.price,
                      total: p.price * 5,
                      date: todayStr(),
                    },
                  });

                  dispatch({
                    type: "STOCK_IN",
                    productId: p.id,
                    qty: 5,
                  });
                }}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SALES PAGE (SHOW 5 PRODUCTS SALE) */}
      {page === "sales" && (
        <div>
          <h2>Sales</h2>

          <button
            onClick={() => {
              if (db.products.length < 5) {
                alert("At least 5 products required");
                return;
              }

              const invoiceNo = padInv(db.sales.length + 1);

              // First 5 products sale
              db.products.slice(0, 5).forEach((product) => {
                if (product.stock <= 0) return;

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
              });
            }}
          >
            Sell 5 Products
          </button>

          <ul>
            {db.sales.map((s) => (
              <li key={s.id}>
                {s.invoiceNo} - {s.productName} - {fmt(s.total)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
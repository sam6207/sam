import { useState, useMemo } from "react";

const INIT_STATE = {
  products: [],
  customers: [],
  vendors: [],
  manufacturers: [],
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

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.id ? { ...p, ...action.data } : p
        ),
      };

    case "DEL_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.id),
      };

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

    case "ADD_CUSTOMER":
      return { ...state, customers: [...state.customers, action.data] };

    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.id ? { ...c, ...action.data } : c
        ),
      };

    case "DEL_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.id),
      };

    case "ADD_VENDOR":
      return { ...state, vendors: [...state.vendors, action.data] };

    case "UPDATE_VENDOR":
      return {
        ...state,
        vendors: state.vendors.map((v) =>
          v.id === action.id ? { ...v, ...action.data } : v
        ),
      };

    case "DEL_VENDOR":
      return {
        ...state,
        vendors: state.vendors.filter((v) => v.id !== action.id),
      };

    case "ADD_MANUFACTURER":
      return {
        ...state,
        manufacturers: [...state.manufacturers, action.data],
      };

    case "UPDATE_MANUFACTURER":
      return {
        ...state,
        manufacturers: state.manufacturers.map((m) =>
          m.id === action.id ? { ...m, ...action.data } : m
        ),
      };

    case "DEL_MANUFACTURER":
      return {
        ...state,
        manufacturers: state.manufacturers.filter((m) => m.id !== action.id),
      };

    default:
      return state;
  }
}

export default function App() {
  const [db, setDb] = useState(INIT_STATE);
  const dispatch = (action) => setDb((prev) => reducer(prev, action));

  const [page, setPage] = useState("dashboard");
  const [ setSelectedInvoiceNo] = useState(null);

  const goToInvoice = (invoiceNo) => {
    setSelectedInvoiceNo(invoiceNo);
    setPage("invoices");
  };

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

      {page === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Total Revenue: {fmt(stats.totalRevenue)}</p>
          <p>Total Purchase: {fmt(stats.totalCost)}</p>
        </div>
      )}

      {page === "products" && (
        <div>
          <h2>Products</h2>
          <button
            onClick={() =>
              dispatch({
                type: "ADD_PRODUCT",
                data: {
                  id: uid(),
                  name: "New Shoe",
                  price: 1000,
                  stock: 10,
                },
              })
            }
          >
            Add Sample Product
          </button>

          <ul>
            {db.products.map((p) => (
              <li key={p.id}>
                {p.name} - {fmt(p.price)} ({p.stock})
              </li>
            ))}
          </ul>
        </div>
      )}

      {page === "purchase" && (
        <div>
          <h2>Purchase</h2>
          <button
            onClick={() => {
              if (!db.products.length) return alert("Add product first");

              const product = db.products[0];

              dispatch({
                type: "ADD_PURCHASE",
                data: {
                  productName: product.name,
                  productId: product.id,
                  qty: 5,
                  price: product.price,
                  total: product.price * 5,
                  date: todayStr(),
                },
              });

              dispatch({
                type: "STOCK_IN",
                productId: product.id,
                qty: 5,
              });
            }}
          >
            Sample Purchase
          </button>
        </div>
      )}

      {page === "sales" && (
        <div>
          <h2>Sales</h2>
          <button
            onClick={() => {
              if (!db.products.length) return alert("Add product first");

              const product = db.products[0];

              if (product.stock <= 0) return alert("No stock");

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

              goToInvoice(invoiceNo);
            }}
          >
            Sample Sale
          </button>
        </div>
      )}
    </div>
  );
}
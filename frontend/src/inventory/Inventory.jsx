import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, Users, ShoppingCart, Tag,
  Store, UserCircle, Bell, Search,
  Plus, LogOut, Boxes, Trash2, X
} from "lucide-react";

// ─── API HELPER ───────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000";

const api = {
  get:    (path)       => fetch(`${BASE_URL}${path}`).then(r => r.json()),
  post:   (path, body) => fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  delete: (path)       => fetch(`${BASE_URL}${path}`, { method: "DELETE" }).then(r => r.json()),
};

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: "#1c2235",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12,
      padding: 18,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, ghost, icon: Icon, full }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
      background: ghost ? "rgba(255,255,255,0.05)" : "#6366f1",
      border: ghost ? "1px solid rgba(255,255,255,0.1)" : "none",
      borderRadius: 8, padding: "9px 16px", fontSize: 13, color: "#fff",
      fontFamily: "'DM Sans',sans-serif", fontWeight: 500, cursor: "pointer",
      width: full ? "100%" : "auto",
    }}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

function Field({ label, id, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label htmlFor={id} style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 5 }}>{label}</label>}
      <input
        id={id} name={id} {...props}
        style={{
          width: "100%", background: "#0f1117",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "9px 12px",
          fontSize: 13, color: "#e2e8f0",
          fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}>
      <div style={{
        background: "#1c2235", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14, padding: 24, minWidth: 360, maxWidth: 460, width: "90%",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Loading & Error states
function LoadingRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols + 1} style={{ textAlign: "center", padding: 28, color: "#6366f1" }}>
        Loading...
      </td>
    </tr>
  );
}

function ErrorRow({ cols, message }) {
  return (
    <tr>
      <td colSpan={cols + 1} style={{ textAlign: "center", padding: 28, color: "#f43f5e" }}>
        ❌ Error: {message}
      </td>
    </tr>
  );
}

function EntityTable({ columns, rows, onDelete, loading, error }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} style={{
                textAlign: "left", padding: "8px 12px", color: "#64748b",
                fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.07)",
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px",
              }}>{c}</th>
            ))}
            <th style={{
              textAlign: "right", padding: "8px 12px", color: "#64748b",
              fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 11,
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingRow cols={columns.length} />
          ) : error ? (
            <ErrorRow cols={columns.length} message={error} />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: 28, color: "#64748b" }}>
                No records yet
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {columns.map((col) => (
                <td key={col} style={{ padding: "11px 12px", color: "#e2e8f0" }}>
                  {row[col.toLowerCase()] ?? row[col] ?? "—"}
                </td>
              ))}
              <td style={{ padding: "11px 12px", textAlign: "right" }}>
                <button onClick={() => onDelete(row.id || i)} style={{
                  background: "rgba(244,63,94,.12)", border: "none",
                  borderRadius: 6, padding: "4px 8px", color: "#f43f5e", cursor: "pointer",
                }}>
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGES
// ════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, vendors: 0, customers: 0, sales: 0 });

  useEffect(() => {
    // Fetch counts from all APIs
    Promise.all([
      api.get("/products"),
      api.get("/vendors"),
      api.get("/customers"),
      api.get("/sales"),
    ]).then(([products, vendors, customers, sales]) => {
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        vendors:  Array.isArray(vendors)  ? vendors.length  : 0,
        customers:Array.isArray(customers)? customers.length: 0,
        sales:    Array.isArray(sales)    ? sales.length    : 0,
      });
    }).catch(err => console.error("Dashboard fetch error:", err));
  }, []);

  const statCards = [
    { label: "Total Products",  value: stats.products,  color: "#6366f1" },
    { label: "Total Vendors",   value: stats.vendors,   color: "#10b981" },
    { label: "Total Customers", value: stats.customers, color: "#f59e0b" },
    { label: "Total Sales",     value: stats.sales,     color: "#f43f5e" },
  ];

  return (
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
        Inventory Management System
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {statCards.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({});

  // GET all products
  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get("/products")
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // POST new product
  const add = () => {
    if (!form.name || !form.stock) return alert("Name or Stock required");
    api.post("/products", {
      name:        form.name,
      description: form.description || "",
      price:       Number(form.price) || 0,
      stock:       Number(form.stock) || 0,
      vendor_id:   form.vendor_id || null,
      category:    form.category || "",
      status:      "active",
    }).then(() => {
      setModal(false);
      setForm({});
      fetchProducts(); // Refresh list
    }).catch(err => alert("Error: " + err.message));
  };

  // DELETE product
  const deleteProduct = (id) => {
    if (!window.confirm("Delete")) return;
    api.delete(`/products/${id}`)
      .then(() => fetchProducts())
      .catch(err => alert("Error: " + err.message));
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Products</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{products.length} products total</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add Product</Btn>
      </div>
      <Card>
        <EntityTable
          columns={["Name", "description", "Price", "Stock", "Status", "vendor_id", "category", "Created_at"]}
          rows={products}
          onDelete={deleteProduct}
          loading={loading}
          error={error}
        />
      </Card>
      {modal && (
        <Modal title="Add Product" onClose={() => { setModal(false); setForm({}); }}>
          {[
            { label: "Product Name*",  id: "name",        placeholder: "e.g. Basmati Rice" },
            { label: "Stock*",         id: "stock",       placeholder: "e.g. 100",  type: "number" },
            { label: "Price",          id: "price",       placeholder: "e.g. 120",  type: "number" },
            { label: "description",    id: "description", placeholder: "Short description" },
            { label: "vendor ID",      id: "vendor_id",   placeholder: "e.g. 1" },
            { label: "Category",       id: "category",    placeholder: "e.g. Grains" },
          ].map(f => (
            <Field key={f.id} {...f} value={form[f.id] || ""}
              onChange={e => setForm(v => ({ ...v, [f.id]: e.target.value }))} />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Btn ghost onClick={() => { setModal(false); setForm({}); }} full>Cancel</Btn>
            <Btn onClick={add} full>Add Product</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── GENERIC API PAGE ─────────────────────────────────────────────────────────
// Reusable page: fetch from apiPath, show fields, POST on add, DELETE by id
function ApiPage({ title, apiPath, fields, columns }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [modal, setModal]   = useState(false);
  const [vals, setVals]     = useState({});

  const fetchItems = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get(apiPath)
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [apiPath]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const add = () => {
    const required = fields.filter(f => f.required);
    if (required.some(f => !vals[f.id])) {
      return alert(required.map(f => f.label).join(", ") + " required");
    }
    api.post(apiPath, vals)
      .then(() => { setModal(false); setVals({}); fetchItems(); })
      .catch(err => alert("Error: " + err.message));
  };

  const deleteItem = (id) => {
    if (!window.confirm("Delete")) return;
    api.delete(`${apiPath}/${id}`)
      .then(() => fetchItems())
      .catch(err => alert("Error: " + err.message));
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{title}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{items.length} records</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add {title.replace(/s$/, "")}</Btn>
      </div>
      <Card>
        <EntityTable
          columns={columns}
          rows={items}
          onDelete={deleteItem}
          loading={loading}
          error={error}
        />
      </Card>
      {modal && (
        <Modal title={`Add ${title.replace(/s$/, "")}`} onClose={() => { setModal(false); setVals({}); }}>
          {fields.map(f => (
            <Field key={f.id} id={f.id} label={f.label}
              placeholder={f.placeholder} type={f.type || "text"}
              value={vals[f.id] || ""}
              onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))} />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Btn ghost onClick={() => { setModal(false); setVals({}); }} full>Cancel</Btn>
            <Btn onClick={add} full>Save</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── CATEGORIES (local only — no backend route) ───────────────────────────────
function CategoriesPage() {
  const [cats, setCats] = useState(["Tech", "Fashion"]);
  const [val, setVal]   = useState("");

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Categories</div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{cats.length} categories</div>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={val} onChange={e => setVal(e.target.value)}
            placeholder="New category name…"
            style={{
              flex: 1, background: "#0f1117",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "9px 12px",
              fontSize: 13, color: "#e2e8f0",
              fontFamily: "'DM Sans',sans-serif", outline: "none",
            }}
          />
          <Btn icon={Plus} onClick={() => { if (val) { setCats(c => [...c, val]); setVal(""); } }}>Add</Btn>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
        {cats.map((c, i) => (
          <div key={i} style={{
            background: "#1c2235", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "14px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tag size={14} color="#6366f1" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{c}</span>
            </div>
            <button onClick={() => setCats(p => p.filter((_, j) => j !== i))}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  NAV CONFIG
// ════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard",   label: "Dashboard",   Icon: LayoutDashboard },
  { id: "products",    label: "Products",    Icon: Package          },
  { id: "vendors",     label: "Vendors",     Icon: Store            },
  { id: "users",       label: "Users",       Icon: Users            },
  { id: "customers",   label: "Customers",   Icon: UserCircle       },
  { id: "purchase",    label: "Purchase",    Icon: ShoppingCart, badge: 3 },
  { id: "categories",  label: "Categories",  Icon: Tag              },
  { id: "Invoices",    label: "Invoices",    Icon: ShoppingCart     },
  { id: "Sales",       label: "Sales",       Icon: ShoppingCart     },
  { id: "Transaction", label: "Transaction", Icon: ShoppingCart     },
];

// ════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]     = useState("dashboard");
  const [search, setSearch] = useState("");

  const renderPage = () => {
    switch (page) {

      case "dashboard": return <DashboardPage />;

      case "products":  return <ProductsPage />;

      // ── VENDORS ──────────────────────────────────────────────────────────
      case "vendors": return (
        <ApiPage
          title="Vendors" apiPath="/vendors"
          columns={["id", "name", "phone", "email", "address", "created_at"]}
          fields={[
            { id: "name",    label: "Vendor Name*", placeholder: "e.g. Reliance", required: true },
            { id: "phone",   label: "Phone",         placeholder: "+91 98765..." },
            { id: "email",   label: "Email",         placeholder: "vendor@example.com", type: "email" },
            { id: "address", label: "Address",       placeholder: "123 Main St" },
          ]}
        />
      );

      // ── USERS ─────────────────────────────────────────────────────────────
      case "users": return (
        <ApiPage
          title="Users" apiPath="/auth/users"
          columns={["id", "name", "email", "created_at"]}
          fields={[
            { id: "name",     label: "Full Name*",  placeholder: "e.g. Rahul Kumar", required: true },
            { id: "email",    label: "Email*",      placeholder: "rahul@example.com", type: "email", required: true },
            { id: "password", label: "Password*",   placeholder: "••••••", type: "password", required: true },
          ]}
        />
      );

      // ── CUSTOMERS ─────────────────────────────────────────────────────────
      case "customers": return (
        <ApiPage
          title="Customers" apiPath="/customers"
          columns={["id", "name", "phone", "email", "address", "created_at"]}
          fields={[
            { id: "name",    label: "Customer Name*", placeholder: "e.g. Priya Sharma", required: true },
            { id: "phone",   label: "Phone",           placeholder: "+91 98765..." },
            { id: "email",   label: "Email",           placeholder: "priya@example.com", type: "email" },
            { id: "address", label: "Address",         placeholder: "123 Main St" },
          ]}
        />
      );

      // ── PURCHASE ──────────────────────────────────────────────────────────
      case "purchase": return (
        <ApiPage
          title="Purchases" apiPath="/purchases"
          columns={["id", "vendor_id", "product_id", "quantity", "price", "purchase_date"]}
          fields={[
            { id: "vendor_id",     label: "Vendor ID*",   placeholder: "e.g. 1", required: true },
            { id: "product_id",    label: "Product ID*",  placeholder: "e.g. 1", required: true },
            { id: "quantity",      label: "Quantity*",    placeholder: "50", type: "number", required: true },
            { id: "price",         label: "Price",        placeholder: "500", type: "number" },
            { id: "purchase_date", label: "Purchase Date",type: "date" },
          ]}
        />
      );

      // ── INVOICES ──────────────────────────────────────────────────────────
      case "Invoices": return (
        <ApiPage
          title="Invoices" apiPath="/invoices"
          columns={["id", "customer_id", "total_amount", "status", "invoice_date"]}
          fields={[
            { id: "customer_id",  label: "Customer ID*",  placeholder: "e.g. 1", required: true },
            { id: "total_amount", label: "Total Amount*", placeholder: "5000", type: "number", required: true },
            { id: "status",       label: "Status",        placeholder: "unpaid / paid" },
            { id: "invoice_date", label: "Invoice Date",  type: "date" },
          ]}
        />
      );

      // ── SALES ─────────────────────────────────────────────────────────────
      case "Sales": return (
        <ApiPage
          title="Sales" apiPath="/sales"
          columns={["id", "customer_id", "product_id", "quantity", "price", "sale_date", "total_amount", "GST"]}
          fields={[
            { id: "customer_id",  label: "Customer ID*", placeholder: "e.g. 1", required: true },
            { id: "product_id",   label: "Product ID*",  placeholder: "e.g. 1", required: true },
            { id: "quantity",     label: "Quantity*",    placeholder: "10", type: "number", required: true },
            { id: "price",        label: "Price",        placeholder: "500", type: "number" },
            { id: "sale_date",    label: "Sale Date",    type: "date" },
            { id: "total_amount", label: "Total Amount", placeholder: "5000", type: "number" },
            { id: "GST",          label: "GST %",        placeholder: "18" },
          ]}
        />
      );

      // ── TRANSACTIONS ──────────────────────────────────────────────────────
      case "Transaction": return (
        <ApiPage
          title="Transactions" apiPath="/transactions"
          columns={["id", "invoice_id", "type", "amount", "description", "transaction_date"]}
          fields={[
            { id: "invoice_id",        label: "Invoice ID*",        placeholder: "e.g. 1", required: true },
            { id: "type",              label: "Type*",              placeholder: "Sale / Purchase", required: true },
            { id: "amount",            label: "Amount*",            placeholder: "5000", type: "number", required: true },
            { id: "description",       label: "Description",        placeholder: "Details..." },
            { id: "transaction_date",  label: "Transaction Date",   type: "date" },
          ]}
        />
      );

      case "categories": return <CategoriesPage />;
      default:           return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1117" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 220, background: "#161b27",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, background: "#6366f1", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Boxes size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff" }}>StockIQ</span>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "1.2px", padding: "6px 10px 8px" }}>Main</div>
          {NAV.map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setPage(id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "9px 12px", marginBottom: 2,
              borderRadius: 8, border: "none", cursor: "pointer", position: "relative",
              background: page === id ? "rgba(99,102,241,0.18)" : "transparent",
              color: page === id ? "#a5b4fc" : "#94a3b8",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
              fontWeight: page === id ? 500 : 400,
              textAlign: "left",
            }}>
              {page === id && (
                <div style={{
                  position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: 18, background: "#6366f1", borderRadius: 2,
                }} />
              )}
              <Icon size={15} />
              {label}
              {badge && (
                <span style={{
                  marginLeft: "auto", background: "#f43f5e", color: "#fff",
                  fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: 500,
                }}>{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px" }}>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "10px 14px", color: "#94a3b8",
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer",
          }}>
            <LogOut size={14} />
            <li onClick={() => setPage("Login")}>Logout</li>
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{
          background: "#161b27", borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
            <Search size={14} color="#64748b" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="search" placeholder="Search products, vendors, orders…"
              value={search} onChange={e => setSearch(e.target.value)}
              autoComplete="off"
              style={{
                width: "100%", background: "#1c2235",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 9, padding: "8px 14px 8px 36px",
                fontSize: 13.5, color: "#e2e8f0",
                fontFamily: "'DM Sans',sans-serif", outline: "none",
              }}
            />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button style={{
              width: 36, height: 36, background: "#1c2235",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Bell size={15} color="#94a3b8" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
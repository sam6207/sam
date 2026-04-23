import { useState } from "react";
import {
  LayoutDashboard, Package, Users, ShoppingCart, Tag,
  Store, UserCircle, Bell, Search,
  Plus, LogOut, Boxes, Trash2, X
} from "lucide-react";

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

function EntityTable({ columns, rows, onDelete }) {
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: 28, color: "#64748b" }}>
                No records yet
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {Object.values(row).map((val, j) => (
                <td key={j} style={{ padding: "11px 12px", color: "#e2e8f0" }}>{val}</td>
              ))}
              <td style={{ padding: "11px 12px", textAlign: "right" }}>
                <button onClick={() => onDelete(i)} style={{
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
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#64748b", fontSize: 14 }}>
     <h2> Inventory Management System Dashboard</h2>

      </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [name, setName]   = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [vendor_id, setVendorId] = useState("");
  const [category, setCategory] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [quantity, setQuantity] = useState("");

  const add = () => {
    if (!name || !stock) return;
    setProducts(p => [...p, {
      name,
      stock: Number(stock),
      price: `₹${price || 0}`,
      status: Number(stock) < 10 ? "Low" : "In Stock",
    }]);
    setName(""); setStock(""); setPrice(""); setModal(false);
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
          columns={["Name", "Stock", "Price", "Status", "Description", "vendor_id", "category", "created_at", "Quantity"]}
          rows={products}
          onDelete={i => setProducts(p => p.filter((_, j) => j !== i))}
        />
      </Card>
      {modal && (
        <Modal title="Add Product" onClose={() => setModal(false)}>
          <Field label="Product Name"    id="product-name"  placeholder="e.g. Basmati Rice 1kg" value={name}  onChange={e => setName(e.target.value)} />
          <Field label="Stock Quantity"  id="product-stock" type="number" placeholder="e.g. 100" value={stock} onChange={e => setStock(e.target.value)} />
          <Field label="Price"           id="product-price" type="number" placeholder="e.g. 120" value={price} onChange={e => setPrice(e.target.value)} />
          <Field label="Description"     id="product-description" placeholder="e.g. High-quality basmati rice" value={description} onChange={e => setDescription(e.target.value)} />
          <Field label="Vendor ID"       id="product-vendor_id" placeholder="e.g. VEND001" value={vendor_id} onChange={e => setVendorId(e.target.value)} />
          <Field label="Category"        id="product-category" placeholder="e.g. Grains" value={category} onChange={e => setCategory(e.target.value)} />
          <Field label="Created At"      id="product-created_at" type="date" value={created_at} onChange={e => setCreatedAt(e.target.value)} />
          <Field label="Quantity"        id="product-quantity" type="number" placeholder="e.g. 50" value={quantity} onChange={e => setQuantity(e.target.value)} />

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Add Product</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── GENERIC LIST PAGE ────────────────────────────────────────────────────────
function ListPage({ title, fields, columns }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [vals, setVals]   = useState({});

  const add = () => {
    if (fields.some(f => f.required && !vals[f.id])) return;
    setItems(p => [...p, { ...vals }]);
    setVals({}); setModal(false);
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
          onDelete={i => setItems(p => p.filter((_, j) => j !== i))}
        />
      </Card>
      {modal && (
        <Modal title={`Add ${title.replace(/s$/, "")}`} onClose={() => setModal(false)}>
          {fields.map(f => (
            <Field
              key={f.id} id={f.id} label={f.label}
              placeholder={f.placeholder} type={f.type || "text"}
              value={vals[f.id] || ""}
              onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))}
            />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Save</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
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
          <input
            id="cat-name" name="cat-name" value={val}
            onChange={e => setVal(e.target.value)}
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
            <button onClick={() => setCats(p => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
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
  { id: "dashboard",  label: "Dashboard",  Icon: LayoutDashboard },
  { id: "products",   label: "Products",   Icon: Package          },
  { id: "vendors",    label: "Vendors",    Icon: Store            },
  { id: "users",      label: "Users",      Icon: Users            },
  { id: "customers",  label: "Customers",  Icon: UserCircle       },
  { id: "purchase",   label: "Purchase",   Icon: ShoppingCart, badge: 3 },
  { id: "categories", label: "Categories", Icon: Tag              },
  { id: "Invoices",   label: "Invoices",   Icon: ShoppingCart, badge: 3 },
  { id: "Sales",   label: "Sales",   Icon: ShoppingCart, badge: 3 },
  { id: "Transaction",   label: "Transaction",   Icon: ShoppingCart, badge: 3 },
  
];

// ════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]   = useState("dashboard");
  const [search, setSearch] = useState("");

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <DashboardPage />;
      case "products":   return <ProductsPage />;
      case "vendors":    return (
        <ListPage
          title="Vendors"
          columns={["Name", "Phone", "City", "Status", "created_at", "Address", "email", "GST"]}
          fields={[
            { id: "Name",    label: "Vendor Name", placeholder: "e.g. Reliance", required: true },
            { id: "Phone", label: "Phone",      placeholder: "+91 98765..." },
            { id: "City",    label: "City",         placeholder: "Mumbai" },
            { id: "Status",  label: "Status",       placeholder: "Active" },
            { id: "created_at", label: "Created At", type: "date" },
            { id: "Address", label: "Address",      placeholder: "123 Main St" },
            { id: "email", label: "Email",          placeholder: "vendor@example.com", type: "email" },
            { id: "GST", label: "GST",              placeholder: "GST Number" },
          ]}
        />
      );

      case "Invoices":   return (
        <ListPage
          title="Invoices"
          columns={[ "customer_id", "Total_amount", "Status", "Invoice_date", "reference_id"]}
          fields={[
            { id: "customer_id",   label: "Customer ID", placeholder: "e.g. CUST001", required: true },
            { id: "Total_amount",    label: "Total Amount",   placeholder: "50", type: "number", required: true },
            { id: "Status", label: "Status",     placeholder: "Reliance" },
            { id: "Invoice_date",   label: "Invoice Date",       type: "date" },
            { id: "reference_id",  label: "Reference ID",      placeholder: "REF001", type: "number" },
          ]}
        />
      );

      case "users":      return (
        <ListPage
          title="Users"
          columns={["Name", "Role", "Email","Password", "created_at"]}
          fields={[
            { id: "Name",  label: "Full Name", placeholder: "e.g. Rahul Kumar", required: true },
            { id: "Role",  label: "Role",      placeholder: "Admin / Staff" },
            { id: "Email", label: "Email",     placeholder: "rahul@example.com", type: "email" },
            {id: "password", label: "Password", placeholder: "123456", type: "password" },
            {id: "created_at", label: "Created At", type: "date" },
          ]}
        />
      );
      case "customers":  return (
        <ListPage
          title="Customers"
          columns={["Name", "Phone", "email", "Address", "created_at", "Buyer"]}
          fields={[
            { id: "Name",  label: "Customer Name", placeholder: "e.g. Priya Sharma", required: true },
            { id: "Phone", label: "Phone",          placeholder: "+91 98765..." },
            { id: "Email", label: "Email",          placeholder: "priya@example.com", type: "email" },
            { id: "Address", label: "Address",      placeholder: "123 Main St" },
            { id: "created_at", label: "Created At", type: "date" },
            { id: "Buyer", label: "Buyer",          placeholder: "e.g. John Doe" },
          ]}
        />
      );
      case "purchase":   return (
        <ListPage
          title="Purchases"
          columns={["Vendor_id", "Product", "Quantity", "price", "Purchase_Id"]}
          fields={[
            { id: "Vendor_id",   label: "Vendor ID", placeholder: "e.g. VEND001", required: true },
            { id: "Product",    label: "Product",   placeholder: "e.g. Basmati Rice", required: true },
            { id: "Quantity", label: "Quantity",     placeholder: "50", type: "number", required: true },
            { id: "price",   label: "Price",       type: "number" },
            { id: "Purchase_Id",  label: "Purchase ID",      placeholder: "PUR001" },
          ]}
        />
      );


      case "Sales":   return (
        <ListPage
          title="Sales"
          columns={["Customer_id", "Product", "Quantity", "Price", " sale_Date", "Total_amount", "GST"]}
          fields={[
            { id: "Customer_id",   label: "Customer ID", placeholder: "e.g. CUST001", required: true },
            { id: "Product",    label: "Product",   placeholder: "e.g. Basmati Rice", required: true },
            { id: "Quantity", label: "Quantity",     placeholder: "50", type: "number", required: true },
            { id: "Price",  label: "Price",      placeholder: "₹5000", type: "number" },
            { id: "sale_Date",   label: "Sale Date",       type: "date" },
            { id: "Total_amount",    label: "Total Amount",   placeholder: "50", type: "number", required: true },
            { id: "GST", label: "GST",     placeholder: "18%" },
          ]}
         />
        );
        
        case "Transaction":   return (
        <ListPage
          title="Transactions"
          columns={["Invoice_id", "Type", "Amount", "Description", "transaction_date", "Quantity"]}
          fields={[
            { id: "Invoice_id",   label: "Invoice ID", placeholder: "e.g. INV001", required: true },
            { id: "Type",    label: "Type",   placeholder: "e.g. Sale", required: true },
            { id: "Amount", label: "Amount",     placeholder: "50", type: "number", required: true },
            { id: "Description",   label: "Description",       type: "text" },
            { id: "transaction_date",   label: "Transaction Date",       type: "date" },
            { id: "Quantity",    label: "Quantity",   placeholder: "50", type: "number", required: true },
          ]}
        />
      );

      case "categories": return <CategoriesPage />;
      default:           return <DashboardPage />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1117; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #2d3452; border-radius: 4px; }
        input::placeholder { color: #64748b; }
        button:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
      `}</style>

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

          {/* Logout button only — no user info */}
          <div style={{ padding: "12px" }}>
            <button style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "10px 14px", color: "#94a3b8",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer",
            }}>
              <LogOut size={14} />
              Logout
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
            {/* Search */}
            <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
              <Search size={14} color="#64748b" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                id="global-search" name="global-search" type="search"
                placeholder="Search products, vendors, orders…"
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

            {/* Bell only — no user card */}
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
    </>
  );
}
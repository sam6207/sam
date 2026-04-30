import { useState, useEffect } from "react";
import { X, Store, Phone, Mail, MapPin, ShoppingCart, Package, Calendar, TrendingUp } from "lucide-react";

const BASE_URL = "http://localhost:3000";
const api = {
  get: (path) => fetch(`${BASE_URL}${path}`).then(r => r.json()),
};

export default function VendorDetailModal({ vendor, onClose }) {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!vendor) return;
    setLoading(true);
    Promise.all([
      api.get("/purchases"),
      api.get("/products"),
    ]).then(([allPurchases, allProducts]) => {
      const vendorPurchases = Array.isArray(allPurchases)
        ? allPurchases.filter(p => String(p.vendor_id) === String(vendor.id))
        : [];
      setPurchases(vendorPurchases);
      setProducts(Array.isArray(allProducts) ? allProducts : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [vendor]);

  if (!vendor) return null;

  const totalSpend = purchases.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity) || 0), 0);
  const totalItems = purchases.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);

  const getProductName = (pid) => {
    const p = products.find(p => String(p.id) === String(pid));
    return p ? p.name : `Product #${pid}`;
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#161b27",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 18,
        width: "92%", maxWidth: 680,
        maxHeight: "88vh",
        overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        animation: "slideUp 0.22s ease",
      }}>
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
          borderRadius: "18px 18px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0,
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
            }}>
              {vendor.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 700, color: "#fff" }}>
                {vendor.name}
              </div>
              <div style={{ fontSize: 12, color: "#6366f1", marginTop: 2, fontWeight: 500 }}>
                Vendor ID: #{vendor.id}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "6px 8px", color: "#94a3b8", cursor: "pointer",
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { icon: Phone,    label: "Phone",   val: vendor.phone   || "—" },
              { icon: Mail,     label: "Email",   val: vendor.email   || "—" },
              { icon: MapPin,   label: "Address", val: vendor.address || "—" },
              { icon: Calendar, label: "Joined",  val: vendor.created_at ? vendor.created_at.slice(0, 10) : "—" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{
                background: "#1c2235", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "11px 14px",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <Icon size={14} color="#6366f1" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 3, wordBreak: "break-all" }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { label: "Total Purchases", value: purchases.length, color: "#6366f1", icon: ShoppingCart },
              { label: "Total Items",     value: totalItems,       color: "#10b981", icon: Package      },
              { label: "Total Spend",     value: `Rs.${totalSpend.toLocaleString("en-IN")}`, color: "#f59e0b", icon: TrendingUp },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} style={{
                background: "#1c2235", border: `1px solid ${color}22`,
                borderRadius: 10, padding: "14px", textAlign: "center",
              }}>
                <Icon size={18} color={color} style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 3 }}>{value}</div>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700,
            color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
          }}>
            <Store size={14} color="#6366f1" />
            Purchase History
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 28, color: "#6366f1", fontSize: 13 }}>Loading...</div>
          ) : purchases.length === 0 ? (
            <div style={{
              background: "#1c2235", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "28px", textAlign: "center", color: "#64748b", fontSize: 13,
            }}>
              Koi purchase record nahi mila is vendor ke liye.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr>
                    {["#", "Product", "Qty", "Price", "Total", "Date"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "8px 10px", color: "#64748b", fontWeight: 500,
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.6px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p, i) => {
                    const total = (Number(p.price) * Number(p.quantity)) || 0;
                    return (
                      <tr key={p.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "10px 10px", color: "#64748b" }}>{i + 1}</td>
                        <td style={{ padding: "10px 10px", color: "#e2e8f0", fontWeight: 500 }}>
                          {getProductName(p.product_id)}
                        </td>
                        <td style={{ padding: "10px 10px", color: "#e2e8f0" }}>{p.quantity}</td>
                        <td style={{ padding: "10px 10px", color: "#e2e8f0" }}>Rs.{Number(p.price).toLocaleString("en-IN")}</td>
                        <td style={{ padding: "10px 10px", color: "#10b981", fontWeight: 600 }}>
                          Rs.{total.toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "10px 10px", color: "#64748b" }}>
                          {p.purchase_date ? p.purchase_date.slice(0, 10) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
        `}</style>
      </div>
    </div>
  );
}
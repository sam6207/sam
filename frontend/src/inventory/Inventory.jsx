import { useState } from "react";
import {
  LayoutDashboard, Package, Users, ShoppingCart, Tag,
  Store, UserCircle, Bell, Search, TrendingUp,
  AlertTriangle, RefreshCw, MapPin,
  DollarSign, Plus, LogOut, ChevronDown, ArrowUpRight,
  ArrowDownRight, Boxes, Truck, Trash2, X,
  Receipt, FileText
} from "lucide-react";

const MOCK_SALES = [42,38,55,61,47,70,82,66,74,58,90,84,77,95,88,102,78,110,94,84];

const LOCATIONS  = [
  { name:"Main Store",  icon: Store,   units:842,  status:"healthy" },
  { name:"Warehouse",   icon: Boxes,   units:3240, status:"healthy" },
  { name:"Branch 2",    icon: MapPin,  units:128,  status:"low"     },
  { name:"Branch 3",    icon: MapPin,  units:47,   status:"critical"},
  { name:"In Transit",  icon: Truck,   units:560,  status:"transit" },
];
const STATUS_META = {
  healthy:  { color:"#10b981", label:"Healthy"   },
  low:      { color:"#f59e0b", label:"Low Stock"  },
  critical: { color:"#f43f5e", label:"Critical"   },
  transit:  { color:"#6366f1", label:"On Track"   },
};
const ALERTS = [
  { icon: AlertTriangle, type:"crit", name:"Basmati Rice 1kg",  desc:"Stock: 4 · Min: 20",           badge:"Critical", btype:"crit" },
  { icon: RefreshCw,     type:"warn", name:"Surf Excel 500g",   desc:"Auto-reorder triggered · 50u",  badge:"Reorder",  btype:"warn" },
  { icon: AlertTriangle, type:"crit", name:"Tata Salt 1kg",     desc:"Stock: 2 · Min: 15",            badge:"Critical", btype:"crit" },
  { icon: TrendingUp,    type:"info", name:"Amul Butter 500g",  desc:"Demand spike +34% this week",   badge:"Watch",    btype:"ok"   },
];
const TOP_PRODUCTS = [
  { emoji:"", name:"Basmati Rice 1kg",  cat:"Rice",      sold:1240, rev:"₹62k" },
  { emoji:"", name:"Amul Milk 1L",      cat:"Dairy",     sold:980,  rev:"₹49k" },
  { emoji:"", name:"Surf Excel 500g",   cat:"Detergent", sold:760,  rev:"₹38k" },
  { emoji:"", name:"Bread 400g",        cat:"Bakery",    sold:620,  rev:"₹31k" },
  { emoji:"", name:"Tata Salt 1kg",     cat:"Spices",    sold:540,  rev:"₹16k" },
];
const FAST_SLOW = [
  { emoji:"", name:"Basmati Rice",   speed:92, rate:"320/d", type:"fast" },
  { emoji:"", name:"Surf Excel",     speed:78, rate:"210/d", type:"fast" },
  { emoji:"", name:"Dark Chocolate", speed:18, rate:"9/d",   type:"slow" },
  { emoji:"", name:"Ice Cream 500ml",speed:12, rate:"6/d",   type:"slow" },
];
const PREDICTIONS = [
  { emoji:"", name:"Basmati Rice 1kg", meta:"Stockout in ~3 days", pct:82, risk:"High Risk",  rtype:"crit" },
  { emoji:"", name:"Amul Milk 1L",     meta:"Stockout in ~5 days", pct:58, risk:"Medium",     rtype:"warn" },
  { emoji:"", name:"Surf Excel 500g",  meta:"Stockout in ~6 days", pct:44, risk:"Medium",     rtype:"warn" },
  { emoji:"", name:"Bread 400g",       meta:"Restock recommended", pct:28, risk:"Low Risk",   rtype:"ok"   },
];

// ─── MINI BAR CHART ──────────────────────────────────────────────────────────
function MiniBarChart({ data, color = "#6366f1", height = 120 }) {
  const max = Math.max(...data);
  const w = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width:"100%", height }}>
      {data.map((v, i) => {
        const barH = (v / max) * (height - 8);
        return (
          <rect key={i} x={i * w + 0.5} y={height - barH} width={w - 1} height={barH} rx="2" fill={color} opacity="0.85" />
        );
      })}
    </svg>
  );
}

function PLBarChart({ height = 120 }) {
  const profit = [18,22,35,28,31,24,40];
  const loss   = [8,5,12,7,9,6,4];
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
  const maxVal = 40;
  const w = 100 / months.length;
  const mid = height / 2;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width:"100%", height }}>
      <line x1="0" y1={mid} x2="100" y2={mid} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      {months.map((_, i) => {
        const ph = (profit[i] / maxVal) * (mid - 4);
        const lh = (loss[i]   / maxVal) * (mid - 4);
        return (
          <g key={i}>
            <rect x={i*w+1} y={mid-ph} width={w/2-0.5} height={ph} rx="1.5" fill="#10b981" opacity="0.85" />
            <rect x={i*w+w/2} y={mid}  width={w/2-0.5} height={lh} rx="1.5" fill="#f43f5e" opacity="0.75" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
const BADGE = {
  crit: { bg:"rgba(244,63,94,.15)",   color:"#f43f5e" },
  warn: { bg:"rgba(245,158,11,.15)",  color:"#f59e0b" },
  ok:   { bg:"rgba(16,185,129,.15)",  color:"#10b981" },
  info: { bg:"rgba(99,102,241,.15)",  color:"#a5b4fc" },
};
function Badge({ type, children }) {
  const s = BADGE[type] || BADGE.info;
  return (
    <span style={{
      background:s.bg, color:s.color,
      fontSize:11, padding:"3px 8px", borderRadius:6, fontWeight:500, whiteSpace:"nowrap"
    }}>{children}</span>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, up, Icon, accent }) {
  return (
    <div style={{
      background:"#071438", border:"1px solid rgba(255, 255, 255, 0.96)",
      borderRadius:12, padding:"16px 18px", position:"relative", overflow:"hidden"
    }}>
      <div style={{
        position:"absolute", top:-16, right:-16, width:56, height:56,
        borderRadius:"50%", background:accent, opacity:0.1
      }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ fontSize:11, color:"#2f77dc", textTransform:"uppercase", letterSpacing:"0.8px" }}>{label}</span>
        <Icon size={15} color={accent} />
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:700, color:"#fff", marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:12, display:"flex", alignItems:"center", gap:4, color: up ? "#10b981" : "#f43f5e" }}>
        {up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
        {delta}
      </div>
    </div>
  );
}

// ─── SECTION TITLE ───────────────────────────────────────────────────────────
function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#fff" }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:"#eaedf1", marginTop:2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// ─── CARD WRAPPER ────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background:"#071438", border:"1px solid rgba(255, 255, 255, 0.46)",
      borderRadius:12, padding:18, ...style
    }}>{children}</div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(20, 20, 20, 0.65)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:999
    }}>
      <div style={{
        background:"#1c2235", border:"1px solid rgba(255, 255, 255, 0.46)",
        borderRadius:14, padding:24, minWidth:360, maxWidth:460, width:"90%",
        maxHeight:"90vh", overflowY:"auto"
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#fff" }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}>
            <X size={18}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Field({ label, id, type, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label htmlFor={id} style={{ display:"block", fontSize:12, color:"#94a3b8", marginBottom:5 }}>{label}</label>}
      {type === "select" ? (
        <select
          id={id}
          name={id}
          {...props}
          style={{
            width:"100%", background:"#111111", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:8, padding:"9px 12px", fontSize:13, color:"#e2eaf0",
            fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box"
          }}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type || "text"}
          {...props}
          style={{
            width:"100%", background:"#111111", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:8, padding:"9px 12px", fontSize:13, color:"#e2eaf0",
            fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box"
          }}
        />
      )}
    </div>
  );
}

// ─── BTN ─────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, ghost, danger, icon: Icon, full }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", justifyContent:"center", gap:7,
      background: danger ? "#f43f5e" : ghost ? "rgba(255,255,255,0.05)" : "#6366f1",
      border: ghost ? "1px solid rgba(255,255,255,0.1)" : "none",
      borderRadius:8, padding:"9px 16px", fontSize:13, color:"#d1bfbf",
      fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:"pointer",
      transition:"opacity .18s", width: full ? "100%" : "auto"
    }}>
      {Icon && <Icon size={14}/>}{children}
    </button>
  );
}

// ─── ENTITY TABLE ─────────────────────────────────────────────────────────────
function EntityTable({ columns, rows, onDelete }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} style={{ textAlign:"left", padding:"8px 12px", color:"#f5f7fa",
                fontWeight:500, borderBottom:"1px solid rgba(255,255,255,0.07)",
                fontSize:11, textTransform:"uppercase", letterSpacing:"0.6px" }}>
                {c}
              </th>
            ))}
            <th style={{ textAlign:"right", padding:"8px 12px", color:"#cfd7e1", fontWeight:500, borderBottom:"1px solid rgba(255,255,255,0.07)", fontSize:11 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length+1} style={{ textAlign:"center", padding:28, color:"#64748b" }}>No records yet</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:"1px solid rgba(231, 189, 189, 0.04)" }}>
              {Object.values(row).map((val, j) => (
                <td key={j} style={{ padding:"11px 12px", color:"#f5f7fa" }}>{val}</td>
              ))}
              <td style={{ padding:"11px 12px", textAlign:"right" }}>
                <button onClick={() => onDelete(i)} style={{ background:"rgba(244,63,94,.12)",
                  border:"none", borderRadius:6, padding:"4px 8px", color:"#f43f5e", cursor:"pointer" }}>
                  <Trash2 size={13}/>
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

function DashboardPage() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <KpiCard label="Total Products" value="1,284" delta="12% this month"    up Icon={Package}       accent="#6366f1"/>
        <KpiCard label="Today's Sales"  value="₹84,320" delta="8.4% vs yesterday" up Icon={TrendingUp}   accent="#10b981"/>
        <KpiCard label="Low Stock Alerts" value="7"    delta="3 new today"       Icon={AlertTriangle}  accent="#f59e0b"/>
        <KpiCard label="Profit (MTD)"   value="₹2.4L"  delta="5.1% vs last month" up Icon={DollarSign}  accent="#22d3ee"/>
      </div>

      {/* Sales + Alerts */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14 }}>
        <Card>
          <SectionHead title="Daily Sales — April 2026" sub="Last 20 days" />
          <MiniBarChart data={MOCK_SALES} color="#f05518" height={150} />
          <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:"#dae5f5" }}>
            <span>Peak: ₹110k (Apr 18)</span>
            <span>Avg: ₹74k/day</span>
          </div>
        </Card>
        <Card>
          <SectionHead title="Smart Alerts" sub="7 active" />
          {ALERTS.map((a, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:
             i<ALERTS.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background: a.type==="crit" ? "rgba(244,63,94,.12)" :
                 a.type==="warn" ? "rgba(245,158,11,.12)" : "rgba(34,211,238,.12)" }}>
                <a.icon size={14} color={ a.type==="crit" ? "#f43f5e" : a.type==="warn" ? "#d7ee09" : "#22d3ee" }/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.name}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{a.desc}</div>
              </div>
              <Badge type={a.btype}>{a.badge}</Badge>
            </div>
          ))}
        </Card>
      </div>

      {/* Fast/Slow + Predictions + Multi-Stock */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        <Card>
          <SectionHead title="Fast vs Slow Sellers" />
          {FAST_SLOW.map((p, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i<FAST_SLOW.length-1 ? "1px solid rgba(255,255,255,0.06)":"none" }}>
              <span style={{ fontSize:20, width:28, textAlign:"center" }}>{p.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                  <Badge type={p.type==="fast" ? "ok" : "crit"}>{p.type==="fast" ? "Fast" : "Slow"}</Badge>
                  <div style={{ flex:1, height:4, background:"rgba(8, 8, 8, 0.07)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:`${p.speed}%`, height:"100%", background: p.type==="fast" ? "#10b981" : "#f43f5e", borderRadius:3 }}/>
                  </div>
                </div>
              </div>
              <span style={{ fontSize:13, fontWeight:500, color: p.type==="fast" ? "#10b981":"#f43f5e", minWidth:42, textAlign:"right" }}>{p.rate}</span>
            </div>
          ))}
        </Card>

        <Card>
          <SectionHead title="AI Predictions" sub="Next 7 days" />
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {PREDICTIONS.map((p, i) => (
              <div key={i} style={{ background:"#121212", borderRadius:9, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{p.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"#2e2f30" }}>{p.meta}</div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:3, overflow:"hidden", marginTop:5 }}>
                    <div style={{ width:`${p.pct}%`, height:"100%", background:"linear-gradient(90deg,#6366f1,#22d3ee)", borderRadius:3 }}/>
                  </div>
                </div>
                <Badge type={p.rtype}>{p.risk}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHead title="Multi-Stock Locations" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {LOCATIONS.map((l, i) => {
              const s = STATUS_META[l.status];
              return (
                <div key={i} style={{ background:"#121213", borderRadius:9, padding:"10px 12px", border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize:11, color:"#64748b", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}>
                    <l.icon size={11}/>{l.name}
                  </div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#fff" }}>{l.units.toLocaleString()}</div>
                  <div style={{ fontSize:10, color:"#64748b" }}>units</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:5, fontSize:11 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:s.color }}/>
                    <span style={{ color:s.color }}>{s.label}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ background:"#212840", borderRadius:9, padding:"10px 12px", border:"1px dashed rgba(99,102,241,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:3, cursor:"pointer" }}>
              <Plus size={18} color="#6366f1"/>
              <span style={{ fontSize:11, color:"#6366f1" }}>Add Location</span>
            </div>
          </div>
        </Card>
      </div>

      {/* P&L + Top Products */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14 }}>
        <Card>
          <SectionHead title="Profit & Loss — Monthly" sub="FY 2025-26" />
          <PLBarChart height={150} />
          <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:"#64748b" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:"#10b981", display:"inline-block" }}/> Profit</span>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:"#f43f5e", display:"inline-block" }}/> Loss</span>
          </div>
        </Card>
        <Card>
          <SectionHead title="Top Selling Products" sub="This month" />
          {TOP_PRODUCTS.map((p, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i<TOP_PRODUCTS.length-1 ? "1px solid rgba(255,255,255,0.06)":"none" }}>
              <span style={{ fontSize:18, width:28, textAlign:"center" }}>{p.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{p.cat} · {p.sold} sold</div>
              </div>
              <span style={{ fontSize:13, fontWeight:500, color:"#10b981" }}>{p.rev}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const add = async () => {
    if (!name || !stock) return;
    try {
      const res = await fetch("http://localhost:3000/products", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name, stock:Number(stock), price:Number(price)||0, description })
      });
      await res.json();
      setProducts(p => [...p, { name, stock:Number(stock), price:`₹${price||0}`, description, status: Number(stock)<10 ? "Low":"In Stock" }]);
    } catch {
      setProducts(p => [...p, { name, stock:Number(stock), price:`₹${price||0}`, description, status: Number(stock)<10 ? "Low":"In Stock" }]);
    }
    setName(""); setStock(""); setPrice(""); setDescription(""); setModal(false);
  };

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff" }}>Products</div>
          <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>{products.length} products total</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add Product</Btn>
      </div>
      <Card>
        <EntityTable
          columns={["Name","Stock","Price","Description","Status"]}
          rows={products}
          onDelete={i => setProducts(p => p.filter((_,j)=>j!==i))}
        />
      </Card>
      {modal && (
        <Modal title="Add Product" onClose={() => setModal(false)}>
          <Field label="Product Name"    id="product-name"        placeholder="e.g. Basmati Rice 1kg"     value={name}        onChange={e=>setName(e.target.value)} />
          <Field label="Stock Quantity"  id="product-stock"       placeholder="e.g. 100" type="number"    value={stock}       onChange={e=>setStock(e.target.value)} />
          <Field label="Price (₹)"       id="product-price"       placeholder="e.g. 120" type="number"    value={price}       onChange={e=>setPrice(e.target.value)} />
          <Field label="Description"     id="product-description" placeholder="e.g. Aromatic and delicious" value={description} onChange={e=>setDescription(e.target.value)} />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Add Product</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── GENERIC LIST PAGE ────────────────────────────────────────────────────────
function ListPage({ title, fields, columns, apiUrl }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [vals, setVals] = useState({});

  const add = async () => {
    if (fields.some(f => f.required && !vals[f.id])) return;
    if (apiUrl) {
      try {
        await fetch(apiUrl, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify(vals)
        });
      } catch {}
    }
    setItems(p => [...p, { ...vals }]);
    setVals({}); setModal(false);
  };

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff" }}>{title}</div>
          <div style={{ fontSize:13, color:"#c5cdd7", marginTop:3 }}>{items.length} records</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add {title.replace(/s$/,"")}</Btn>
      </div>
      <Card>
        <EntityTable
          columns={columns}
          rows={items}
          onDelete={i => setItems(p => p.filter((_,j)=>j!==i))}
        />
      </Card>
      {modal && (
        <Modal title={`Add ${title.replace(/s$/,"")}`} onClose={() => setModal(false)}>
          {fields.map(f => (
            <Field
              key={f.id} id={f.id} label={f.label}
              placeholder={f.placeholder} type={f.type||"text"}
              value={vals[f.id]||""} onChange={e => setVals(v=>({...v,[f.id]:e.target.value}))}
            />
          ))}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Save</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── SALES PAGE ───────────────────────────────────────────────────────────────
function SalesPage() {
  const [sales, setSales] = useState([]);
  const [modal, setModal] = useState(false);
  const [vals, setVals] = useState({
    customer_id: "", products: "", quantity: "", price: "", sale_date: "", total_amount: ""
  });

  const handleChange = (field, value) => {
    const updated = { ...vals, [field]: value };
    // Auto-calculate total_amount when quantity or price changes
    if (field === "quantity" || field === "price") {
      const qty = field === "quantity" ? Number(value) : Number(updated.quantity);
      const prc = field === "price"    ? Number(value) : Number(updated.price);
      if (qty && prc) updated.total_amount = (qty * prc).toFixed(2);
    }
    setVals(updated);
  };

  const add = async () => {
    if (!vals.customer_id || !vals.products || !vals.quantity) return;
    try {
      await fetch("http://localhost:3000/sales", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          customer_id: vals.customer_id,
          products:    vals.products,
          quantity:    Number(vals.quantity),
          price:       Number(vals.price),
          sale_date:   vals.sale_date,
          total_amount: Number(vals.total_amount)
        })
      });
    } catch {}
    setSales(s => [...s, {
      "Customer ID":   vals.customer_id,
      "Products":      vals.products,
      "Qty":           vals.quantity,
      "Price (₹)":     `₹${vals.price}`,
      "Sale Date":     vals.sale_date,
      "Total (₹)":     `₹${vals.total_amount}`
    }]);
    setVals({ customer_id:"", products:"", quantity:"", price:"", sale_date:"", total_amount:"" });
    setModal(false);
  };

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff" }}>Sales</div>
          <div style={{ fontSize:13, color:"#c5cdd7", marginTop:3 }}>{sales.length} records</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add Sale</Btn>
      </div>
      <Card>
        <EntityTable
          columns={["Customer ID","Products","Qty","Price (₹)","Sale Date","Total (₹)"]}
          rows={sales}
          onDelete={i => setSales(s => s.filter((_,j)=>j!==i))}
        />
      </Card>
      {modal && (
        <Modal title="Add Sale" onClose={() => setModal(false)}>
          <Field
            label="Customer ID" id="sale-customer-id"
            placeholder="e.g. C001" value={vals.customer_id}
            onChange={e => handleChange("customer_id", e.target.value)}
          />
          <Field
            label="Products" id="sale-products"
            placeholder="e.g. Basmati Rice 1kg" value={vals.products}
            onChange={e => handleChange("products", e.target.value)}
          />
          <Field
            label="Quantity" id="sale-quantity" type="number"
            placeholder="e.g. 5" value={vals.quantity}
            onChange={e => handleChange("quantity", e.target.value)}
          />
          <Field
            label="Price per unit (₹)" id="sale-price" type="number"
            placeholder="e.g. 120" value={vals.price}
            onChange={e => handleChange("price", e.target.value)}
          />
          <Field
            label="Sale Date" id="sale-date" type="date"
            value={vals.sale_date}
            onChange={e => handleChange("sale_date", e.target.value)}
          />
          {/* Auto-calculated total — read-only display */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12, color:"#94a3b8", marginBottom:5 }}>Total Amount (₹) — Auto Calculated</label>
            <div style={{
              background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)",
              borderRadius:8, padding:"9px 12px", fontSize:13, color:"#a5b4fc",
              fontWeight:600, fontFamily:"'DM Sans',sans-serif"
            }}>
              ₹{vals.total_amount || "0.00"}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Save Sale</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── INVOICE PAGE ─────────────────────────────────────────────────────────────
function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [modal, setModal] = useState(false);
  const [vals, setVals] = useState({
    customer_id: "", total_amount: "", status: "Pending", invoice_date: "", stocks: ""
  });

  const statusOptions = ["Pending", "Paid", "Cancelled", "Overdue"];

  const add = async () => {
    if (!vals.customer_id || !vals.total_amount) return;
    try {
      await fetch("http://localhost:3000/invoices", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          customer_id:  vals.customer_id,
          total_amount: Number(vals.total_amount),
          status:       vals.status,
          invoice_date: vals.invoice_date,
          stocks:       vals.stocks
        })
      });
    } catch {}

    // eslint-disable-next-line no-unused-vars
    const StatusColor = {
      Paid: "ok", Pending: "warn", Cancelled: "crit", Overdue: "crit"
    };

    setInvoices(inv => [...inv, {
      "Customer ID":    vals.customer_id,
      "Total (₹)":      `₹${vals.total_amount}`,
      "Status":         vals.status,
      "Invoice Date":   vals.invoice_date,
      "Stocks":         vals.stocks
    }]);
    setVals({ customer_id:"", total_amount:"", status:"Pending", invoice_date:"", stocks:"" });
    setModal(false);
  };

  // Status badge render helper inside table
  // eslint-disable-next-line no-unused-vars
  const getStatusBadge = (status) => {
    const map = { Paid:"ok", Pending:"warn", Cancelled:"crit", Overdue:"crit" };
    return <Badge type={map[status] || "info"}>{status}</Badge>;
  };

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff" }}>Invoices</div>
          <div style={{ fontSize:13, color:"#c5cdd7", marginTop:3 }}>{invoices.length} records</div>
        </div>
        <Btn icon={Plus} onClick={() => setModal(true)}>Add Invoice</Btn>
      </div>

      {/* Summary KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[
          { label:"Total Invoices", value: invoices.length, color:"#6366f1" },
          { label:"Paid",           value: invoices.filter(i=>i.Status==="Paid").length,      color:"#10b981" },
          { label:"Pending",        value: invoices.filter(i=>i.Status==="Pending").length,   color:"#f59e0b" },
          { label:"Overdue",        value: invoices.filter(i=>i.Status==="Overdue" || i.Status==="Cancelled").length, color:"#f43f5e" },
        ].map((k,i) => (
          <div key={i} style={{ background:"#071438", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px" }}>
            <div style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <EntityTable
          columns={["Customer ID","Total (₹)","Status","Invoice Date","Stocks"]}
          rows={invoices}
          onDelete={i => setInvoices(inv => inv.filter((_,j)=>j!==i))}
        />
      </Card>

      {modal && (
        <Modal title="Add Invoice" onClose={() => setModal(false)}>
          <Field
            label="Customer ID" id="inv-customer-id"
            placeholder="e.g. C001" value={vals.customer_id}
            onChange={e => setVals(v=>({...v, customer_id:e.target.value}))}
          />
          <Field
            label="Total Amount (₹)" id="inv-total" type="number"
            placeholder="e.g. 5000" value={vals.total_amount}
            onChange={e => setVals(v=>({...v, total_amount:e.target.value}))}
          />
          {/* Status — select dropdown */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12, color:"#94a3b8", marginBottom:5 }}>Status</label>
            <select
              value={vals.status}
              onChange={e => setVals(v=>({...v, status:e.target.value}))}
              style={{
                width:"100%", background:"#111111", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:8, padding:"9px 12px", fontSize:13, color:"#e2eaf0",
                fontFamily:"'DM Sans',sans-serif", outline:"none", boxSizing:"border-box"
              }}
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field
            label="Invoice Date" id="inv-date" type="date"
            value={vals.invoice_date}
            onChange={e => setVals(v=>({...v, invoice_date:e.target.value}))}
          />
          <Field
            label="Stocks / Items" id="inv-stocks"
            placeholder="e.g. Rice 5kg, Salt 2kg" value={vals.stocks}
            onChange={e => setVals(v=>({...v, stocks:e.target.value}))}
          />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn ghost onClick={() => setModal(false)} full>Cancel</Btn>
            <Btn onClick={add} full>Save Invoice</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
function CategoriesPage() {
  const [cats, setCats] = useState(["Tech","Fashion"]);
  const [val, setVal] = useState("");
  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#fff" }}>Categories</div>
          <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>{cats.length} categories</div>
        </div>
      </div>
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:10 }}>
          <input id="cat-name" name="cat-name" value={val} onChange={e=>setVal(e.target.value)} placeholder="New category name…"
            style={{ flex:1, background:"#0f1117", border:"1px solid rgba(43, 40, 40, 0.1)",
               borderRadius:8, padding:"9px 12px", fontSize:13, color:"#e2e8f0", fontFamily:"'DM Sans',sans-serif", outline:"none" }}
          />
          <Btn icon={Plus} onClick={() => { if(val){ setCats(c=>[...c,val]); setVal(""); } }}>Add</Btn>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
        {cats.map((c, i) => (
          <div key={i} style={{ background:"#384981", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Tag size={14} color="#6366f1"/>
              <span style={{ fontSize:13, fontWeight:500 }}>{c}</span>
            </div>
            <button onClick={() => setCats(p=>p.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer" }}>
              <X size={13}/>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard",  label:"Dashboard",  Icon:LayoutDashboard },
  { id:"products",   label:"Products",   Icon:Package         },
  { id:"vendors",    label:"Vendors",    Icon:Store           },
  { id:"users",      label:"Users",      Icon:Users           },
  { id:"customers",  label:"Customers",  Icon:UserCircle      },
  { id:"purchase",   label:"Purchase",   Icon:ShoppingCart, badge:3 },
  { id:"sales",      label:"Sales",      Icon:Receipt         },
  { id:"invoice",    label:"Invoice",    Icon:FileText        },
  { id:"categories", label:"Categories", Icon:Tag             },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const renderPage = () => {
    switch(page) {
      case "dashboard":  return <DashboardPage />;
      case "products":   return <ProductsPage />;

      case "vendors":
        return <ListPage
          title="Vendors"
          columns={["Name","Phone","Email","Address","GST","Vendor ID","Date Added","Rate"]}
          fields={[
            { id:"name",      label:"Vendor Name", placeholder:"e.g. Reliance",          required:true },
            { id:"phone",     label:"Phone",       placeholder:"+91 98765 43210"                       },
            { id:"email",     label:"Email",       placeholder:"vendor@email.com", type:"email"        },
            { id:"address",   label:"Address",     placeholder:"e.g. Mumbai, Maharashtra"              },
            { id:"GST",       label:"GST",         placeholder:"e.g. 27AABCC1234D1Z5"                  },
            { id:"Vendor_ID", label:"Vendor ID",   placeholder:"e.g. V001"                             },
            { id:"date",      label:"Date Added",  placeholder:"Select date", type:"date"              },
            { id:"rate",      label:"Rate",        placeholder:"e.g. 100"                              },
          ]}
          apiUrl="http://localhost:3000/vendors"
        />;

      case "users":
        return <ListPage title="Users" columns={["Name","Role","Email"]}
          fields={[
            { id:"Name",  label:"Full Name", placeholder:"e.g. Rahul Kumar", required:true },
            { id:"Role",  label:"Role",      placeholder:"Admin / Staff"                   },
            { id:"Email", label:"Email",     placeholder:"rahul@example.com", type:"email" },
          ]}
        />;

      case "customers":
        return <ListPage title="Customers" columns={["Name","Phone","City","Address","Email","Buyer"]}
          fields={[
            { id:"Name",    label:"Customer Name", placeholder:"e.g. Priya Sharma", required:true },
            { id:"Phone",   label:"Phone",         placeholder:"+91 98765..."                      },
            { id:"City",    label:"City",           placeholder:"Delhi"                             },
            { id:"address", label:"Address",        placeholder:"e.g. New Delhi"                   },
            { id:"email",   label:"Email",          placeholder:"customer@email.com", type:"email" },
            { id:"Buyer",   label:"Buyer",          placeholder:"e.g. John Doe"                    },
          ]}
          apiUrl="http://localhost:3000/customers"
        />;

      case "purchase":
        return <ListPage title="Purchases" columns={["Item","Qty","Vendor","Date"]}
          fields={[
            { id:"Item",   label:"Item Name", placeholder:"e.g. Basmati Rice", required:true },
            { id:"Qty",    label:"Quantity",  placeholder:"50", type:"number", required:true  },
            { id:"Vendor", label:"Vendor",    placeholder:"Reliance"                          },
            { id:"Date",   label:"Date",      type:"date"                                     },
          ]}
        />;

      case "sales":   return <SalesPage />;
      case "invoice": return <InvoicePage />;

      case "categories": return <CategoriesPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0f1117;color:#e2e8f0;font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0f1117}
        ::-webkit-scrollbar-thumb{background:#2d3452;border-radius:4px}
        input::placeholder{color:#64748b}
        select option{background:#1c2235}
        button:focus-visible{outline:2px solid #646597;outline-offset:2px}
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#0f1117" }}>

        {/* SIDEBAR */}
        <div style={{ width:220, background:"#0c0c0c", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, background:"#6366f1", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Boxes size={16} color="#fff"/>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:"#fff" }}>StockIQ</span>
          </div>
          <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
            <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"1.2px", padding:"6px 10px 8px" }}>Main</div>
            {NAV.map(({ id, label, Icon, badge }) => (
              <button key={id} onClick={() => setPage(id)} style={{
                display:"flex", alignItems:"center", gap:10,
                width:"100%", padding:"9px 12px", marginBottom:2,
                borderRadius:8, border:"none", cursor:"pointer", position:"relative",
                background: page===id ? "rgba(99,102,241,0.18)" : "transparent",
                color: page===id ? "#a5b4fc" : "#94a3b8",
                fontFamily:"'DM Sans',sans-serif", fontSize:13.5, fontWeight: page===id ? 500 : 400,
                transition:"all .15s", textAlign:"left"
              }}>
                {page===id && <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)", width:3, height:18, background:"#6366f1", borderRadius:2 }}/>}
                <Icon size={15}/>
                {label}
                {badge && <span style={{ marginLeft:"auto", background:"#f43f5e", color:"#fff", fontSize:10, padding:"2px 6px", borderRadius:10, fontWeight:500 }}>{badge}</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"12px" }}>
            <div style={{ background:"#1c2235", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>RK</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Rahul Kumar</div>
                <div style={{ fontSize:11, color:"#64748b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>rahul@stockiq.in</div>
              </div>
              <LogOut size={14} color="#64748b" style={{ marginLeft:"auto", cursor:"pointer", flexShrink:0 }}/>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>

          {/* TOPBAR */}
          <div style={{ background:"#ffffff", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 24px", display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:10 }}>
            <div style={{ flex:1, maxWidth:380, position:"relative" }}>
              <Search size={14} color="#64748b" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
              <input
                id="global-search" name="global-search" type="search"
                placeholder="Search products, vendors, orders…"
                value={search} onChange={e=>setSearch(e.target.value)}
                autoComplete="off"
                style={{
                  width:"100%", background:"#1c2235", border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:9, padding:"8px 14px 8px 36px", fontSize:13.5, color:"#e2e8f0",
                  fontFamily:"'DM Sans',sans-serif", outline:"none"
                }}
              />
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={()=>setNotifOpen(n=>!n)} style={{ position:"relative", width:36, height:36, background:"#1c2235", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Bell size={15} color="#94a3b8"/>
                <span style={{ position:"absolute", top:6, right:6, width:7, height:7, background:"#f43f5e", borderRadius:"50%", border:"1.5px solid #161b27" }}/>
              </button>
              {notifOpen && (
                <div style={{ position:"absolute", top:58, right:24, background:"#1c2235", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, width:300, zIndex:100, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
                  <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontWeight:500, fontSize:13 }}>Notifications</span>
                    <Badge type="crit">7 new</Badge>
                  </div>
                  {ALERTS.map((a, i) => (
                    <div key={i} style={{ padding:"12px 16px", borderBottom: i<ALERTS.length-1 ? "1px solid rgba(255,255,255,0.05)":"none", display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:28, height:28, borderRadius:7, background: a.type==="crit" ? "rgba(244,63,94,.12)" : "rgba(245,158,11,.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <a.icon size={12} color={ a.type==="crit" ? "#f43f5e" : "#f59e0b" }/>
                      </div>
                      <div>
                        <div style={{ fontSize:12.5, fontWeight:500 }}>{a.name}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#1c2235", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"6px 12px 6px 6px", cursor:"pointer" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#22d3ee)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, fontFamily:"'Syne',sans-serif", color:"#fff" }}>RK</div>
                <span style={{ fontSize:12.5, fontWeight:500 }}>Rahul Kumar</span>
                <ChevronDown size={13} color="#64748b"/>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div style={{ flex:1, padding:24, overflowY:"auto" }}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
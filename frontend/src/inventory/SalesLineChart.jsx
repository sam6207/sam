import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const BASE_URL = "http://localhost:3000";
const api = {
  get: (path) => fetch(`${BASE_URL}${path}`).then(r => r.json()),
};

function groupByDay(sales) {
  const map = {};
  sales.forEach((sale) => {
    const date = new Date(sale.sale_date);
    if (isNaN(date)) return; 
    const key = date.toISOString().split("T")[0];

    const label = date.toLocaleDateString("en-IN", {
      day:   "2-digit",
      month: "short",
    });

    if (!map[key]) map[key] = { day: label, amount: 0, sales: 0 };
    map[key].amount += Number(sale.total_amount) || 0;
    map[key].sales  += 1;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ ...v, amount: Math.round(v.amount) }));
}
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1c2235",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 16px",
    }}>
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 500 }}>
        ₹ {payload[0]?.value?.toLocaleString()}
      </div>
      <div style={{ color: "#10b981", fontSize: 12, marginTop: 3 }}>
        {payload[1]?.value} Sales
      </div>
    </div>
  );
}

export default function SalesLineChart() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetchSales = useCallback(() => {
    api.get("/sales")
      .then(sales => {
        if (!Array.isArray(sales)) throw new Error("Invalid data");
        setData(groupByDay(sales));
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSales();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // cleanup
  }, [fetchSales]);

  return (
    <div style={{
      background: "#1c2235",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: 20, marginTop: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
            Sales Trend
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
            Daily revenue & sales count
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: "#475569" }}>
              Updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchSales}
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 8, padding: "5px 12px",
              fontSize: 12, color: "#a5b4fc", cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#6366f1" }}>
          Loading chart...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: 40, color: "#f43f5e" }}>
          ❌ Error: {error}
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
          Koi sales data nahi mila abhi
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.07)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              name="Revenue (₹)"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ fill: "#6366f1", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales Count"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
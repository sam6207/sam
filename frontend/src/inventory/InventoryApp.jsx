import { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // DATA STATES
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Tech", "Fashion"]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);

  // INPUT STATES
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [purchaseItem, setPurchaseItem] = useState("");
  const [purchaseQty, setPurchaseQty] = useState("");
  const [customerName, setCustomerName] = useState("");

  // FUNCTIONS
  const addProduct = () => {
    if (!productName || !productStock) return;
    setProducts([...products, { name: productName, stock: productStock }]);
    setProductName("");
    setProductStock("");
  };

  const addCategory = () => {
    if (!categoryName) return;
    setCategories([...categories, categoryName]);
    setCategoryName("");
  };

  const addPurchase = () => {
    if (!purchaseItem || !purchaseQty) return;
    setPurchases([...purchases, { item: purchaseItem, qty: purchaseQty }]);
    setPurchaseItem("");
    setPurchaseQty("");
  };

  const addCustomer = () => {
    if (!customerName) return;
    setCustomers([...customers, customerName]);
    setCustomerName("");
  };

  // PAGES
  const renderPage = () => {
    switch (page) {
      case "products":
        return (
          <>
            <h2>Products</h2>
            <input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              placeholder="Stock"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
            />
            <button onClick={addProduct}>Add</button>

            <ul>
              {products.map((p, i) => (
                <li key={i}>{p.name} - {p.stock}</li>
              ))}
            </ul>
          </>
        );

      case "categories":
        return (
          <>
            <h2>Categories</h2>
            <input
              placeholder="New Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>

            <ul>
              {categories.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        );

      case "purchase":
        return (
          <>
            <h2>Purchase Entry</h2>
            <input
              placeholder="Item"
              value={purchaseItem}
              onChange={(e) => setPurchaseItem(e.target.value)}
            />
            <input
              placeholder="Quantity"
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(e.target.value)}
            />
            <button onClick={addPurchase}>Add</button>

            <ul>
              {purchases.map((p, i) => (
                <li key={i}>{p.item} - {p.qty}</li>
              ))}
            </ul>
          </>
        );

      case "customers":
        return (
          <>
            <h2>Customers</h2>
            <input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <button onClick={addCustomer}>Add</button>

            <ul>
              {customers.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        );

      default:
        return (
          <>
            <h1>Dashboard</h1>

            <div className="cards">
              <div className="card blue">Products: {products.length}</div>
              <div className="card green">
                Stock: {products.reduce((a, b) => a + Number(b.stock || 0), 0)}
              </div>
              <div className="card yellow">Orders: 0</div>
              <div className="card purple">Revenue: ₹1000</div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Inventory MS</h2>

        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={() => setPage("categories")}>Categories</button>
        <button onClick={() => setPage("purchase")}>Purchase</button>
        <button onClick={() => setPage("customers")}>Customers</button>
      </div>

      {/* Main */}
      <div className="main">{renderPage()}</div>
    </div>
  );
} 
import { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // DATA STATES
  const [categories, setCategories] = useState(["Tech", "Fashion"]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [productCount, setProductCount] = useState(0); // just for dashboard count

  // INPUT STATES
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [purchaseItem, setPurchaseItem] = useState("");
  const [purchaseQty, setPurchaseQty] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vendorsName, setVendorsName] = useState("");
  const [usersName, setUsersName] = useState("");

  // FUNCTIONS
  const addProduct = async () => {
    if (!productName || !productStock) return;

    try {
      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          stock: Number(productStock),
          price: 0,
          description: ""
        })
      });
      const data = await res.json();
      console.log("Product added:", data);
      setProductCount(prev => prev + 1);
    } catch (err) {
      console.error("Failed to add product:", err);
    }

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

  const addVendors = () => {
    if (!vendorsName) return;
    setVendors([...vendors, vendorsName]);
    setVendorsName("");
  };

  const addUsers = () => {
    if (!usersName) return;
    setUsers([...users, usersName]);
    setUsersName("");
  };

  // PAGES
  const renderPage = () => {
    switch (page) {
      case "products":
        return (
          <>
            <h2>Products</h2>
            <input placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input placeholder="Stock" value={productStock} onChange={(e) => setProductStock(e.target.value)} />
            <button onClick={addProduct}>Add</button>
            {/* No product list displayed */}
          </>
        );

      case "categories":
        return (
          <>
            <h2>Categories</h2>
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            <button onClick={addCategory}>Add</button>
            <ul>
              {categories.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </>
        );

      case "purchase":
        return (
          <>
            <h2>Purchase</h2>
            <input value={purchaseItem} onChange={(e) => setPurchaseItem(e.target.value)} />
            <input value={purchaseQty} onChange={(e) => setPurchaseQty(e.target.value)} />
            <button onClick={addPurchase}>Add</button>
          </>
        );

      case "customers":
        return (
          <>
            <h2>Customers</h2>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <button onClick={addCustomer}>Add</button>
            <ul>
              {customers.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </>
        );

      case "vendors":
        return (
          <>
            <h2>Vendors</h2>
            <input placeholder="Vendor Name" value={vendorsName} onChange={(e) => setVendorsName(e.target.value)} />
            <button onClick={addVendors}>Add Vendor</button>
            <ul>
              {vendors.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </>
        );

      case "users":
        return (
          <>
            <h2>Users</h2>
            <input placeholder="User Name" value={usersName} onChange={(e) => setUsersName(e.target.value)} />
            <button onClick={addUsers}>Add User</button>
            <ul>
              {users.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </>
        );

      default:
        return (
          <>
            <h1>Dashboard</h1>
            <div className="cards">
              <div className="card">Products: {productCount}</div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Inventory</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={() => setPage("vendors")}>Vendors</button>
        <button onClick={() => setPage("users")}>Users</button>
        <button onClick={() => setPage("customers")}>Customers</button>
        <button onClick={() => setPage("purchase")}>Purchase</button>
        <button onClick={() => setPage("categories")}>Categories</button>
      </div>

      <div className="main">
        <div className="box">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
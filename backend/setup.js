const Database = require('better-sqlite3');
const db = new Database('inventory.sqlite');

console.log('✅ Database connected!');

db.exec("PRAGMA foreign_keys = ON");

// 1. VENDORS TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('✅ Vendors table');

// 2. CUSTOMERS TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('✅ Customers table');

// 3. PRODUCTS TABLE — status aur category add kiye
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    category TEXT,
    vendor_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
  )
`);
console.log('✅ Products table');

// 4. PURCHASES TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);
console.log('✅ Purchases table');

// 5. SALES TABLE — total_amount aur GST add kiye
db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL,
    GST TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);
console.log('✅ Sales table');

// 6. INVOICES TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'unpaid',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )
`);
console.log('✅ Invoices table');

// 7. TRANSACTIONS TABLE — Quantity add kiya
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Quantity INTEGER,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
  )
`);
console.log('✅ Transactions table');

// 8. USERS TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('✅ Users table');

console.log('✅ All tables ready!');

module.exports = db;
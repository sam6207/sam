const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


const customerRouter = require("./router/customers.js");
app.use("/customers", customerRouter);

const purchaseRouter = require("./router/purchases.js");
app.use("/purchases", purchaseRouter);

const saleRouter = require("./router/sale.js");
app.use("/sales", saleRouter);

const invoiceRouter = require("./router/invoice.js");
app.use("/invoices", invoiceRouter);

const transactionRouter = require("./router/transaction.js");
app.use("/transactions", transactionRouter);

const productRouter = require("./router/product.js");
app.use("/products", productRouter);

const vendorRouter = require("./router/vendors.js");
app.use("/vendors", vendorRouter);

const db = require("./setup.js");

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
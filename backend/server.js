const express = require("express");
const app = express();
const PORT = 3000;
const vendorRoutes = requir("./routes/vendor");

app.use("/vendors", vendorRoutes);

app.use(express.json());

const db = require("./setup.js");
console.log("DB type:", typeof db);
console.log("Prepare type:", typeof db.prepare);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/products", (req, res) => {
    try {
        const { name, description, price, stock, vendor_id } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Product name is required" });
        }
        if (price === undefined || price === null) {
            return res.status(400).json({ error: "Price is required" });
        }

        db.prepare(`
            INSERT INTO products (name, description, price, stock, vendor_id)
            VALUES (?, ?, ?, ?, ?)
        `).run(name.trim(), description || null, price, stock || 0, vendor_id || null);

        res.status(201).json({ message: "Product added successfully" });

    } catch (err) {
        res.status(500).json({ error: "Failed to add product", details: err.message });
    }
});

app.get("/products", (req, res) => {
    try {
        const data = db.prepare("SELECT * FROM products").all();
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
});

app.put("/products/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Product name is required" });
        }

        const result = db.prepare("UPDATE products SET name=? WHERE id=?").run(name.trim(), id);

        if (result.changes === 0) {
            return res.status(404).json({ error: `Product with id ${id} not found` });
        }

        res.status(200).json({ message: "Product updated successfully" });

    } catch (err) {
        res.status(500).json({ error: "Failed to update product", details: err.message });
    }
});

app.delete("/products/:id", (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare("DELETE FROM products WHERE id=?").run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: `Product with id ${id} not found` });
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: "Failed to delete product", details: err.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
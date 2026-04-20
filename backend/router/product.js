const express = require("express");
const router = express.Router();
const db = require("../setup");

// CREATE Product
router.post("/", (req, res) => {
    try {
        const name = req.body.name || "";
        const description = req.body.description || "";
        const price = req.body.price !== undefined ? req.body.price : 0;
        const stock = req.body.stock || 0;

        db.prepare(`
            INSERT INTO products (name, description, price, stock)
            VALUES (?, ?, ?, ?)
        `).run(name, description, Number(price), Number(stock));

        res.json({ message: "Product added" });
    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// READ All Products
router.get("/", (req, res) => {
    try {
        const data = db.prepare("SELECT * FROM products").all();
        res.json(data);
    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// READ Single Product
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const data = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!data) return res.status(404).send("Product not found");
    res.json(data);
});

// UPDATE Product
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const name = req.body.name || "";
        const description = req.body.description || "";
        const price = req.body.price !== undefined ? req.body.price : 0;
        const stock = req.body.stock || 0;

        db.prepare(`
            UPDATE products
            SET name = ?, description = ?, price = ?, stock = ?
            WHERE id = ?
        `).run(name, description, Number(price), Number(stock), id);

        res.json({ message: "Product updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Product
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        db.prepare("DELETE FROM products WHERE id = ?").run(id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
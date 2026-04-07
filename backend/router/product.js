const express = require("express");
const router = express.Router();
const db = require("../setup");


//  CREATE Product
router.post("/", (req, res) => {
    const { name, description, price, stock } = req.body;

    db.prepare(`
        INSERT INTO products (name, description, price, stock)
        VALUES (?, ?, ?, ?)
    `).run(name, description, price, stock);

    res.send("Product added");
});


//  READ All Products
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM products").all();
    res.json(data);
});


//  READ Single Product
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM products WHERE id = ?")
                   .get(id);

    if (!data) return res.status(404).send("Product not found");

    res.json(data);
});


//  UPDATE Product
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    db.prepare(`
        UPDATE products
        SET name = ?, description = ?, price = ?, stock = ?
        WHERE id = ?
    `).run(name, description, price, stock, id);

    res.send("Product updated");
});


//  DELETE Product
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM products WHERE id = ?")
      .run(id);

    res.send("Product deleted");
});


module.exports = router;
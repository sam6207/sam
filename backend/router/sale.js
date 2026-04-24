const express = require("express");
const router = express.Router();
const db = require("../setup");

router.post("/", (req, res) => {
  try {
    const { customer_id, product_id, quantity, price, sale_date, total_amount, GST } = req.body;

    if (!customer_id || !product_id || !quantity)
      return res.status(400).json({ error: "customer_id, product_id, quantity required" });

    const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(Number(customer_id));
    if (!customer) return res.status(400).json({ error: `Customer ID ${customer_id} exist nahi karta` });

    const product = db.prepare("SELECT id FROM products WHERE id = ?").get(Number(product_id));
    if (!product) return res.status(400).json({ error: `Product ID ${product_id} exist nahi karta` });

    db.prepare(`
      INSERT INTO sales (customer_id, product_id, quantity, price, sale_date, total_amount, GST)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      Number(customer_id),
      Number(product_id),
      Number(quantity),
      Number(price) || 0,
      sale_date || new Date().toISOString(),
      Number(total_amount) || 0,
      GST || "0"
    );

    res.json({ success: true, message: "Sale added" });
  } catch (err) {
    console.error("Sale error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", (req, res) => {
  try {
    res.json(db.prepare("SELECT * FROM sales").all());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM sales WHERE id = ?").run(req.params.id);
    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
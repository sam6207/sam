const express = require("express");
const router = express.Router();
const db = require("../setup.js");

// GET all customers
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM customers").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single customer
router.get("/:id", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ message: "Customer not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new customer
router.post("/", (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = db.prepare(
      "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)"
    ).run(name, email || null, phone || null, address || null);

    res.json({ id: result.lastInsertRowid, name, email, phone, address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update customer
router.put("/:id", (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const result = db.prepare(
      "UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?"
    ).run(name, email || null, phone || null, address || null, req.params.id);

    if (result.changes === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
router.delete("/:id", (req, res) => {
  try {
    const result = db.prepare("DELETE FROM customers WHERE id=?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
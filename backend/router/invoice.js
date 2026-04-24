const express = require("express");
const router = express.Router();
const db = require("../setup");

// CREATE Invoice
router.post("/", (req, res) => {
  try {
    const { customer_id, total_amount, status, invoice_date } = req.body;

    if (!customer_id || !total_amount) {
      return res.status(400).json({ error: "customer_id and total_amount are required" });
    }

    // Check customer exists (FOREIGN KEY check)
    const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(customer_id);
    if (!customer) {
      return res.status(400).json({ error: `Customer with id ${customer_id} does not exist` });
    }

    const result = db.prepare(`
      INSERT INTO invoices (customer_id, total_amount, status, invoice_date)
      VALUES (?, ?, ?, ?)
    `).run(
      Number(customer_id),
      Number(total_amount),
      status || "unpaid",
      invoice_date || new Date().toISOString()
    );

    res.json({ success: true, id: result.lastInsertRowid, message: "Invoice added" });
  } catch (err) {
    console.error("Invoice POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// READ All Invoices
router.get("/", (req, res) => {
  try {
    const data = db.prepare("SELECT * FROM invoices").all();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Single Invoice
router.get("/:id", (req, res) => {
  try {
    const data = db.prepare("SELECT * FROM invoices WHERE id = ?").get(req.params.id);
    if (!data) return res.status(404).json({ message: "Invoice not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Invoice
router.put("/:id", (req, res) => {
  try {
    const { customer_id, total_amount, status, invoice_date } = req.body;
    db.prepare(`
      UPDATE invoices
      SET customer_id = ?, total_amount = ?, status = ?, invoice_date = ?
      WHERE id = ?
    `).run(customer_id, total_amount, status, invoice_date, req.params.id);

    res.json({ message: "Invoice updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Invoice
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM invoices WHERE id = ?").run(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../setup");

router.get("/", (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM customers WHERE id=?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Customer not found" });
    res.json(row);
  });
});

router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  db.run(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, email, phone });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  db.run(
    "UPDATE customers SET name=?, email=?, phone=? WHERE id=?",
    [name, email, phone, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ message: "Customer not found" });
      res.json({ message: "Customer updated successfully" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM customers WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  });
});

module.exports = router;
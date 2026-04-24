const express = require("express");
const router = express.Router();
const db = require("../setup");

// CREATE Vendor
router.post("/", (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = db.prepare(`
      INSERT INTO vendors (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `).run(name, phone || null, email || null, address || null);

    res.json({ success: true, id: result.lastInsertRowid, message: "Vendor added" });
  } catch (err) {
    console.error("Vendor POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// READ All Vendors
router.get("/", (req, res) => {
  try {
    const data = db.prepare("SELECT * FROM vendors").all();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Single Vendor
router.get("/:id", (req, res) => {
  try {
    const data = db.prepare("SELECT * FROM vendors WHERE id = ?").get(req.params.id);
    if (!data) return res.status(404).json({ message: "Vendor not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Vendor
router.put("/:id", (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const result = db.prepare(`
      UPDATE vendors SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?
    `).run(name, phone || null, email || null, address || null, req.params.id);

    if (result.changes === 0) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Vendor
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM vendors WHERE id = ?").run(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
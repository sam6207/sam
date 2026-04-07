const express = require("express");
const router = express.Router();
const db = require("../setup");


// ✅ CREATE Vendor
router.post("/", (req, res) => {
    const { name, contact } = req.body;

    db.prepare("INSERT INTO vendors (name, contact) VALUES (?, ?)")
      .run(name, contact);

    res.send("Vendor added");
});


// ✅ READ All Vendors
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM vendors").all();
    res.json(data);
});


// ✅ READ Single Vendor
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM vendors WHERE id=?")
                   .get(id);

    res.json(data);
});


// ✅ UPDATE Vendor
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, contact } = req.body;

    db.prepare("UPDATE vendors SET name=?, contact=? WHERE id=?")
      .run(name, contact, id);

    res.send("Vendor updated");
});


// ✅ DELETE Vendor
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM vendors WHERE id=?")
      .run(id);

    res.send("Vendor deleted");
});


module.exports = router;
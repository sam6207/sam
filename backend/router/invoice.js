const express = require("express");
const router = express.Router();
const db = require("../setup");


//  CREATE Invoice
router.post("/", (req, res) => {
    const { customer_id, total_amount, status, invoice_date } = req.body;

    db.prepare(`
        INSERT INTO invoices (customer_id, total_amount, status, invoice_date)
        VALUES (?, ?, ?, ?)
    `).run(customer_id, total_amount, status, invoice_date);

    res.send("Invoice added");
});


//  READ All Invoices
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM invoices").all();
    res.json(data);
});


//  READ Single Invoice
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM invoices WHERE id = ?")
                   .get(id);

    if (!data) return res.status(404).send("Invoice not found");

    res.json(data);
});


//  UPDATE Invoice
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { customer_id, total_amount, status, invoice_date } = req.body;

    db.prepare(`
        UPDATE invoices
        SET customer_id = ?, total_amount = ?, status = ?, invoice_date = ?
        WHERE id = ?
    `).run(customer_id, total_amount, status, invoice_date, id);

    res.send("Invoice updated");
});


//  DELETE Invoice
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM invoices WHERE id = ?")
      .run(id);

    res.send("Invoice deleted");
});


module.exports = router;
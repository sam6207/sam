const express = require("express");
const router = express.Router();
const db = require("../setup");


//  CREATE Transaction
router.post("/", (req, res) => {
    const { invoice_id, type, amount, description, transaction_date, Quantity } = req.body;

    db.prepare(`
        INSERT INTO transactions (invoice_id, type, amount, description, transaction_date, Quantity)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(invoice_id, type, amount, description, transaction_date, Quantity);

    res.send("Transaction added");
});


//  READ All Transactions
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM transactions").all();
    res.json(data);
});


//  READ Single Transaction
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM transactions WHERE id = ?")
                   .get(id);

    if (!data) return res.status(404).send("Transaction not found");

    res.json(data);
});


//  UPDATE Transaction
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { invoice_id, type, amount, description, transaction_date, Quantity } = req.body;

    db.prepare(`
        UPDATE transactions
        SET invoice_id = ?, type = ?, amount = ?, description = ?, transaction_date = ?, Quantity = ?
        WHERE id = ?
    `).run(invoice_id, type, amount, description, transaction_date, Quantity, id);

    res.send("Transaction updated");
});


//  DELETE Transaction
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM transactions WHERE id = ?")
      .run(id);

    res.send("Transaction deleted");
});


module.exports = router;
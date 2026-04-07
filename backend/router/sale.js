const express = require("express");
const router = express.Router();
const db = require("../setup");


//  CREATE Sale
router.post("/", (req, res) => {
    const { customer_id, product_id, quantity, price, sale_date } = req.body;

    db.prepare(`
        INSERT INTO sales (customer_id, product_id, quantity, price, sale_date)
        VALUES (?, ?, ?, ?, ?)
    `).run(customer_id, product_id, quantity, price, sale_date);

    res.send("Sale added");
});


//  READ All Sales
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM sales").all();
    res.json(data);
});


//  READ Single Sale
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM sales WHERE id = ?")
                   .get(id);

    if (!data) return res.status(404).send("Sale not found");

    res.json(data);
});


//  UPDATE Sale
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { customer_id, product_id, quantity, price, sale_date } = req.body;

    db.prepare(`
        UPDATE sales
        SET customer_id = ?, product_id = ?, quantity = ?, price = ?, sale_date = ?
        WHERE id = ?
    `).run(customer_id, product_id, quantity, price, sale_date, id);

    res.send("Sale updated");
});


//  DELETE Sale
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM sales WHERE id = ?")
      .run(id);

    res.send("Sale deleted");
});


module.exports = router;
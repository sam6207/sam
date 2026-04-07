const express = require("express");
const router = express.Router();
const db = require("../setup");


//  CREATE Purchase
router.post("/", (req, res) => {
    const { vendor_id, product_id, quantity, price, purchase_date } = req.body;

    db.prepare(`
        INSERT INTO purchases (vendor_id, product_id, quantity, price, purchase_date)
        VALUES (?, ?, ?, ?, ?)
    `).run(vendor_id, product_id, quantity, price, purchase_date);

    res.send("Purchase added");
});


//  READ All Purchases
router.get("/", (req, res) => {
    const data = db.prepare("SELECT * FROM purchases").all();
    res.json(data);
});


//  READ Single Purchase
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const data = db.prepare("SELECT * FROM purchases WHERE id = ?")
                   .get(id);

    if (!data) return res.status(404).send("Purchase not found");

    res.json(data);
});


//  UPDATE Purchase
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { vendor_id, product_id, quantity, price, purchase_date } = req.body;

    db.prepare(`
        UPDATE purchases
        SET vendor_id = ?, product_id = ?, quantity = ?, price = ?, purchase_date = ?
        WHERE id = ?
    `).run(vendor_id, product_id, quantity, price, purchase_date, id);

    res.send("Purchase updated");
});


//  DELETE Purchase
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.prepare("DELETE FROM purchases WHERE id = ?")
      .run(id);

    res.send("Purchase deleted");
});


module.exports = router;
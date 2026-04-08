const express = require("express");
const router = express.Router();
const db = require("./setup.js");

// ✅ SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  try {
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    stmt.run(name, email, password);
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.json({ message: "User already exists" });
  }
});

// ✅ LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare(
      "SELECT * FROM users WHERE email = ? AND password = ?"
    );
    const user = stmt.get(email, password);

    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.json({ message: "Error occurred" });
  }
});

module.exports = router;

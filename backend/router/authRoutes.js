const express = require("express");
const router = express.Router();
const db = require("../setup");

// SIGNUP
router.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email, password required" });

    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name, email, password);
    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS
router.get("/users", (req, res) => {
  try {
    const data = db.prepare("SELECT id, name, email, created_at FROM users").all();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD USER directly (Users page se)
router.post("/users", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email, password required" });

    const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name, email, password);
    res.json({ success: true, id: result.lastInsertRowid, message: "User added" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// DELETE USER
router.delete("/users/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
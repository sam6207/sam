const express = require('express');
const router = express.Router();
const db = require('../setup.js'); // apna db path check karo

// GET /api/users — Sab users
router.get('/', (req, res) => {
  try {
    const users = db.prepare("SELECT id, name, email FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users — Naya user add karo
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email aur password zaroori hain" });
  }

  try {
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, password);
    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      message: "User successfully add ho gaya!"
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: "Yeh email pehle se exist karta hai" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id — User update karo
router.put('/:id', (req, res) => {
  const { name, email, password } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password)
      WHERE id = ?
    `);
    const result = stmt.run(name, email, password, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "User nahi mila" });
    res.json({ message: "User update ho gaya" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id — User delete karo
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "User nahi mila" });
    res.json({ message: "User delete ho gaya" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../setup.js'); 

// GET /api/users 
router.get('/', (req, res) => {
  try {
    const users = db.prepare("SELECT id, name, email FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users 
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  try {
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, password);
    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      message: "User successfully added!"
    });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: "This email is already in use" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id 
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
    if (result.changes === 0) return res.status(404).json({ error: "NOT FOUND USER" });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id 
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "NOT FOUND USER" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
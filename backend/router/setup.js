
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '../inventory.sqlite'));

module.exports = db;
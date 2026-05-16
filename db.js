const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
  db.run("INSERT INTO users VALUES (1, 'Alice', 'alice@example.com')");
  db.run("INSERT INTO users VALUES (2, 'Bob', 'bob@example.com')");
  db.run("INSERT INTO users VALUES (3, 'Admin', 'admin@example.com')");
});

module.exports = db;


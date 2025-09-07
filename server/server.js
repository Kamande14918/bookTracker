
import express from "express";
import cors from "cors";
const app = express();
import { db } from "./config/database.js";
console.log("[DEBUG] Starting server.js");

app.use(
  cors({
    origin: ["http://localhost:5174"],
  })
);

app.use(express.json());
app.use((req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    return next();
  }
  let data = '';
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => {
    try {
      req.body = data ? JSON.parse(data) : {};
    } catch (e) {
      req.body = {};
    }
    next();
  });
});

// Get all authors
app.get("/authors", async (req, res) => {
  try {
    console.log("[DEBUG] GET /authors");
    const [rows] = await db.query("SELECT * FROM authors ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("[ERROR] /authors:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new author
app.post("/authors", async (req, res) => {
  const { name } = req.body;
  console.log("[DEBUG] POST /authors", req.body);
  try {
    const [result] = await db.query(
      "INSERT INTO authors (name) VALUES (?)",
      [name]
    );
    res.json({ id: result.insertId, name });
  } catch (err) {
    console.error("[ERROR] POST /authors:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all books by an author
app.get("/authors/:id/books", async (req, res) => {
  const { id } = req.params;
  console.log(`[DEBUG] GET /authors/${id}/books`);
  try {
    const [rows] = await db.query(
      "SELECT books.id, books.title, books.isRead FROM books WHERE author_id = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(`[ERROR] /authors/${id}/books:`, err);
    res.status(500).json({ error: err.message });
  }
});



// Get all books with author name
app.get("/books", async (req, res) => {
  try {
    console.log("[DEBUG] GET /books");
    const [rows] = await db.query(`
      SELECT books.id, books.title, books.isRead, authors.name AS author
      FROM books
      JOIN authors ON books.author_id = authors.id
      ORDER BY books.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("[ERROR] /books:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a new book with author_id
app.post("/books", async (req, res) => {
  const { title, author_id } = req.body;
  console.log("[DEBUG] POST /books", req.body);
  try {
    const [result] = await db.query(
      "INSERT INTO books (title, author_id, isRead) VALUES (?, ?, ?)",
      [title, author_id, false]
    );
    res.json({ id: result.insertId, title, author_id, read: false });
  } catch (err) {
    console.error("[ERROR] POST /books:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update book read status
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const read = req.body.isSead !== undefined ? req.body.isRead : req.body.isRead;
  console.log(`[DEBUG] PUT /books/${id}`, req.body);
  try {
    await db.query("UPDATE books SET read = ? WHERE id = ?", [read, id]);
    res.json({ message: "Book updated" });
  } catch (err) {
    console.error(`[ERROR] PUT /books/${id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`[DEBUG] DELETE /books/${id}`);
  try {
    await db.query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error(`[ERROR] DELETE /books/${id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);

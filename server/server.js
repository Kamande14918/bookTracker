// server.js
import express from "express";
const app = express();
import { db } from "./config/database.js";
app.use(express.json());

/**
 * AUTHORS ENDPOINTS
 */

// Get all authors
app.get("/authors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new author
app.post("/authors", async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO authors (name) VALUES (?)",
      [name]
    );
    res.json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all books by an author
app.get("/authors/:id/books", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT books.id, books.title, books.read FROM books WHERE author_id = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * BOOKS ENDPOINTS
 */

// Get all books with author name
app.get("/books", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT books.id, books.title, books.read, authors.name AS author
      FROM books
      JOIN authors ON books.author_id = authors.id
      ORDER BY books.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new book with author_id
app.post("/books", async (req, res) => {
  const { title, author_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO books (title, author_id, read) VALUES (?, ?, ?)",
      [title, author_id, false]
    );
    res.json({ id: result.insertId, title, author_id, read: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book read status
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  try {
    await db.query("UPDATE books SET read = ? WHERE id = ?", [read, id]);
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));

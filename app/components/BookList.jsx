import { useEffect, useState } from "react";
import BookItem from "./BookItem";


export default function BookList(){
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:5000/books");
            if (!res.ok) throw new Error("Failed to fetch books");
            const data = await res.json();
            if (Array.isArray(data)) setBooks(data);
            else setBooks([]);
        } catch (err) {
            setError("Could not load books. Please try again later.");
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    },[]);

    const toggleRead = async (id, isRead) => {
        await fetch(`http://localhost:5000/books/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ isRead }),
        });
        fetchBooks();
    };

    const deleteBook = async (id) => {
        await fetch(`http://localhost:5000/books/${id}`,{
            method: "DELETE"
        });
        fetchBooks();
    };

    if (loading) return <div>Loading books...</div>;
    if (error) return <div style={{color:'red'}}>{error}</div>;
    if (!books.length) return <div>No books found. Add your first book!</div>;

    return (
        <ul className="book-list">
            {books.map((book) => (
                <BookItem
                    key={book.id}
                    book={book}
                    toggleRead={toggleRead}
                    deleteBook={deleteBook}
                />
            ))}
        </ul>
    );
}
import { useEffect, useState } from "react";
import BookItem from "./BookItem";


export default function BookList(){
    const [books,setBooks] = useState([]);
    
    const fetchBooks = async () => {
        
            const  res = await fetch("http://localhost:5000/books");
            const data = await res.json();
            setBooks(data);
    };


    useEffect(() => {
        fetchBooks();
    },[]);

    const toggleRead = async (id, read) => {
        await fetch(`http://localhosst:5000/books/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ read}),
        });
        fetchBooks();
    };

    const deleteBook = async (id) => {
        await fetch(`http://localhost:5000/bookd/${id}`,{
            method: "DELETE"
        });
        fetchBooks();
    }

     return(
        <div className="book-list">
            <h2>Book List</h2>
            {books.map((book) => (
                <BookItem
                    key={book.id}
                    book={book}
                    toggleRead ={toggleRead}
                    deleteBook={deleteBook}
                    />
            
            ))
        }
        </div>
     )
}
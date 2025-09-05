export default function BookItem({ book, toggleRead, deleteBook}){
    return(
        <div className="book-item">
            <div>
                <p>{book.title}</p>
                <p>{book.author}</p>
                <p>
                    Status:{book.read ? "✅ Read" : "📖 Unread"}
                </p>
            </div>
            <div>
                <button onClick={() => toggleRead(book.id, !book.read)}>Toggle Read</button>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react";

export default function BookForm(){
    const [title,  setTitle] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/authors")
        .then((res) => res.json())
        .then(setAuthors);
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !authorId) return;

        await fetch("http://localhost:5000/books",{
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({title, author_id:Number(authorId)}),
        })

        setTitle("");
        setAuthorId("");
        // Reload to see new bookList
        window.location.reload();
    }

    return(
        <form className="book-form" onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select 
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
            >
                <option value="">Select author</option>
                {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                ))}
            </select>
            <button type="submit">Add Book</button>
        </form>
    );
}
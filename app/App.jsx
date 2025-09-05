import { useState } from 'react';
import BookList from './components/BookList';
import BookForm from './components/BookForm';

export default function App(){
     return(
        <div>
            <h1>Book Tracker</h1>
            <BookForm />
            <BookList />
        </div>
     )
}
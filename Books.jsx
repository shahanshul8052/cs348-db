import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Books() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    authorid: '',
    category_id: '',
    ISBN: '',
    publication_date: '',
    quantity_available: '',
  });
  const [updatedBook, setUpdatedBook] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8800/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post('http://localhost:8800/books', newBook);
      fetchBooks();
      setNewBook({
        title: '',
        authorid: '',
        category_id: '',
        ISBN: '',
        publication_date: '',
        quantity_available: '',
      });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleUpdateBook = async (id) => {
    try {
      await axios.put(`http://localhost:8800/books/${id}`, updatedBook[id]);
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setUpdatedBook(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [name]: value
      }
    }));
  };
  

  return (
    <div className="books-container">
      <h2>Books</h2>
      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/author">Author</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/borrowers">Borrowers</Link>
        <Link to="/report">Reports</Link>
      </div>
      <div className="add-book-section">
        <h3>Add New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author ID"
          value={newBook.authorid}
          onChange={(e) => setNewBook({ ...newBook, authorid: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category ID"
          value={newBook.category_id}
          onChange={(e) => setNewBook({ ...newBook, category_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={newBook.ISBN}
          onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
        />
        <input
          type="text"
          placeholder="Publication Date"
          value={newBook.publication_date}
          onChange={(e) => setNewBook({ ...newBook, publication_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Quantity Available"
          value={newBook.quantity_available}
          onChange={(e) => setNewBook({ ...newBook, quantity_available: e.target.value })}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <div>
        <h3>Books List</h3>
        <ul className="books-list">
          {books.map((book) => (
            <li key={book.id}>
              {book.title} (ID: {book.id})
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              <input
                type="text"
                name="title"
                placeholder="New Title"
                value={updatedBook[book.id]?.title || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <input
                type="text"
                name="authorid"
                placeholder="New Author ID"
                value={updatedBook[book.id]?.authorid || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <input
                type="text"
                name="category_id"
                placeholder="New Category ID"
                value={updatedBook[book.id]?.category_id || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <input
                type="text"
                name="ISBN"
                placeholder="New ISBN"
                value={updatedBook[book.id]?.ISBN || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <input
                type="text"
                name="publication_date"
                placeholder="New Publication Date"
                value={updatedBook[book.id]?.publication_date || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <input
                type="text"
                name="quantity_available"
                placeholder="New Quantity Available"
                value={updatedBook[book.id]?.quantity_available || ''}
                onChange={(e) => handleInputChange(e, book.id)}
              />
              <button onClick={() => handleUpdateBook(book.id)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Books;

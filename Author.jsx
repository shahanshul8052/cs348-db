// Authors.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    author_name: '',
    nationality: '',
    birth_date: '',
  });
  const [updatedAuthor, setUpdatedAuthor] = useState({
    author_name: '',
    nationality: '',
    birth_date: '',
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/author');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  /*const handleAddAuthor = async () => {
    try {
      const response = await axios.post('http://localhost:8800/author', newAuthor);
      fetchAuthors();
      setNewAuthor({
        author_name: '',
        nationality: '',
        birth_date: '',
      });
      // Display the ID and name to the user
      alert(`Author added successfully! Author ID: ${response.data.author_id}, Author Name: ${response.data.author_name}`);
    } catch (error) {
      console.error('Error adding author:', error);
    }
  }; */
  const handleAddAuthor = async () => {
    try {
      const response = await axios.post('http://localhost:8800/author', newAuthor);
      fetchAuthors();
      setNewAuthor({
        author_name: '',
        nationality: '',
        birth_date: '',
      });
      // Display the ID and name to the user
      alert(`Author added successfully! Author ID: ${response.data.author_id}, Author Name: ${response.data.author_name}`);
    } catch (error) {
      console.error('Error adding author:', error);
    }
  };
  
  
  
  const handleDeleteAuthor = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/author/${id}`);
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  /*const handleUpdateAuthor = async (id) => {
    try {
      await axios.put(`http://localhost:8800/author/${id}`, updatedAuthor);
      fetchAuthors();
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAuthor({ ...updatedAuthor, [name]: value });
  };
  */
  const handleUpdateAuthor = async (id) => {
    try {
      await axios.put(`http://localhost:8800/author/${id}`, {
        author_name: updatedAuthor[id]?.author_name,
        nationality: updatedAuthor[id]?.nationality,
        birth_date: updatedAuthor[id]?.birth_date
      });
      fetchAuthors();
      // Reset updatedAuthor state
      setUpdatedAuthor({
        author_name: '',
        nationality: '',
        birth_date: ''
      });
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

const handleInputChange = (e, authorId) => {
  const { name, value } = e.target;
  setUpdatedAuthor(prevState => ({
    ...prevState,
    [authorId]: {
      ...prevState[authorId],
      [name]: value
    }
  }));
};


  return (
    <div className="authors-container">
      <h2>Authors</h2>
      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/borrowers">Borrowers</Link>
        <Link to="/report">Report</Link>
      </div>
      <div className="add-author-section">
        <h3>Add New Author</h3>
        <input
          type="text"
          placeholder="Author Name"
          value={newAuthor.author_name}
          onChange={(e) => setNewAuthor({ ...newAuthor, author_name: e.target.value })}
        />
        {/* Other input fields for nationality, birth_date */}
        <button onClick={handleAddAuthor}>Add Author</button>
      </div>
      <div>
        <h3>Authors List</h3>
        <ul className="authors-list">
          {authors.map((author) => (
            <li key={author.author_id}>
            {author.author_name} (ID: {author.author_id})
            <button onClick={() => handleDeleteAuthor(author.author_id)}>Delete</button>
            <input
              type="text"
              name="author_name"
              placeholder="New Author Name"
              value={updatedAuthor[author.author_id]?.author_name || ''}
              onChange={(e) => handleInputChange(e, author.author_id)}
            />
            <input
              type="text"
              name="nationality"
              placeholder="New Nationality"
              value={updatedAuthor[author.author_id]?.nationality || ''}
              onChange={(e) => handleInputChange(e, author.author_id)}
            />
            <input
              type="text"
              name="birth_date"
              placeholder="New Birth Date"
              value={updatedAuthor[author.author_id]?.birth_date || ''}
              onChange={(e) => handleInputChange(e, author.author_id)}
            />
            <button onClick={() => handleUpdateAuthor(author.author_id)}>Update</button>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Authors;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [newBorrower, setNewBorrower] = useState({
    borrower_name: '',
    email: '',
  });
  const [updatedBorrower, setUpdatedBorrower] = useState({
    borrower_name: '',
    email: '',
  });

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const response = await axios.get('http://localhost:8800/borrowers');
      if (Array.isArray(response.data)) {
        setBorrowers(response.data);
      } else {
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching borrowers:', error);
    }
  };

  const handleAddBorrower = async () => {
    try {
      await axios.post('http://localhost:8800/borrowers', newBorrower);
      fetchBorrowers();
      setNewBorrower({ borrower_name: '', email: '' });
    } catch (error) {
      console.error('Error adding borrower:', error);
    }
  };

  const handleDeleteBorrower = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/borrowers/${id}`);
      fetchBorrowers();
    } catch (error) {
      console.error('Error deleting borrower:', error);
    }
  };

  const handleUpdateBorrower = async (id) => {
    try {
      await axios.put(`http://localhost:8800/borrowers/${id}`, updatedBorrower);
      fetchBorrowers();
    } catch (error) {
      console.error('Error updating borrower:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBorrower({ ...updatedBorrower, [name]: value });
  };

  return (
    <div className="borrowers-container">
      <h2>Borrowers</h2>
      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/author">Author</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/report">Reports</Link>
      </div>
      <div className="add-borrower-section">
        <h3>Add New Borrower</h3>
        <input
          type="text"
          placeholder="Borrower Name"
          value={newBorrower.borrower_name}
          onChange={(e) => setNewBorrower({ ...newBorrower, borrower_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newBorrower.email}
          onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
        />
        <button onClick={handleAddBorrower}>Add Borrower</button>
      </div>
      <div>
        <h3>Borrowers List</h3>
        <ul className="borrowers-list">
          {borrowers.map((borrower) => (
            <li key={borrower.borrower_id}>
              {borrower.borrower_name} ({borrower.email})
              <button onClick={() => handleDeleteBorrower(borrower.borrower_id)}>Delete</button>
              <input
                type="text"
                name="borrower_name"
                placeholder="New Borrower Name"
                value={updatedBorrower.borrower_name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="email"
                placeholder="New Email"
                value={updatedBorrower.email}
                onChange={handleInputChange}
              />
              <button onClick={() => handleUpdateBorrower(borrower.borrower_id)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Borrowers;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Report() {
  const [reportData, setReportData] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    title: '',
    author: '',
    startDate: '',
    endDate: '',
    available: false // Added available filter
  });
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    
    fetchAuthors();
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const params = {
        ...filterCriteria,
        author: filterCriteria.author || ''
      };
      const response = await axios.get('http://localhost:8800/books', { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/author');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFilterCriteria({ ...filterCriteria, [name]: inputValue });
  };

  const handleFilterSubmit = () => {
    fetchReportData();
  };

  const getAuthorName = (authorId) => {
    const author = authors.find(author => author.author_id === authorId); // Use 'author_id' instead of 'id'
    return author ? author.author_name : 'Unknown';
  };

  const calculateStatistics = () => {
    // Check if reportData is empty
    if (reportData.length === 0) {
      return {
        totalBooks: 0,
        publicationYearDistribution: {}, // Initialize an empty object for the distribution
        oldestBook: 'N/A',
        newestBook: 'N/A'
      };
    }
  
    // Calculate statistics
    const totalBooks = reportData.length;
  
    // Extract publication years and count books by year
    const publicationYearDistribution = reportData.reduce((distribution, book) => {
      const publicationYear = new Date(book.publication_date).getFullYear();
      distribution[publicationYear] = (distribution[publicationYear] || 0) + 1;
      return distribution;
    }, {});
  
    const oldestBook = new Date(Math.min(...reportData.map(book => new Date(book.publication_date)))).toDateString();
    const newestBook = new Date(Math.max(...reportData.map(book => new Date(book.publication_date)))).toDateString();
  
    return { totalBooks, publicationYearDistribution, oldestBook, newestBook };
  };
  

  const { totalBooks, publicationYearDistribution, oldestBook, newestBook } = calculateStatistics();
  return (
    <div>
      <h1>Library Report</h1>
      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/author">Author</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/borrowers">Borrowers</Link>
      </div>
      <div>
        <input
          type="text"
          name="title"
          value={filterCriteria.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <select
          name="author"
          value={filterCriteria.author}
          onChange={handleInputChange}
        >
          <option value="">Select Author</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>{author.author_name}</option>
          ))}
        </select>
        <input
          type="date"
          name="startDate"
          value={filterCriteria.startDate}
          onChange={handleInputChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          name="endDate"
          value={filterCriteria.endDate}
          onChange={handleInputChange}
          placeholder="End Date"
        />
        {/* Checkbox for Available books */}
        <label>
          Available
          <input
            type="checkbox"
            name="available"
            checked={filterCriteria.available}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleFilterSubmit}>Filter</button>
      </div>
      <div>
  {reportData.map((book) => (
    <div key={book.id}>
      <h2>{book.title}</h2>
      <p>Author: {getAuthorName(book.authorid)}</p> {/* Use book.authorid instead of book.author */}
      <p>Publication Date: {book.publication_date}</p>
      <p>ISBN: {book.ISBN}</p>
      <p>Quantity Available: {book.quantity_available}</p>
    </div>
  ))}
</div>
<div>
  <h2>Statistics:</h2>
  <p>Total Number of Books: {totalBooks}</p>
  {/* Display the publication year distribution */}
  <div>
    <h3>Publication Year Distribution:</h3>
    <ul>
      {Object.entries(publicationYearDistribution).map(([year, count]) => (
        <li key={year}>{year}: {count}</li>
      ))}
    </ul>
  </div>
  <p>Oldest Book: {oldestBook}</p>
  <p>Newest Book: {newestBook}</p>
</div>
    </div>
  );
}

export default Report;

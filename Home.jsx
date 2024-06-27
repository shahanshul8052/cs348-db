// Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to the Library Management System</h2>
      <p>This is the home page of the library management system.</p>
      <div className="button-container">
        <Link to="/books">
          <button className="nav-button">Books</button>
        </Link>
        <Link to="/author">
          <button className="nav-button">Authors</button>
        </Link>
        <Link to="/categories">
          <button className="nav-button">Categories</button>
        </Link>
        <Link to="/borrowers">
          <button className="nav-button">Borrowers</button>
        </Link>
        <Link to="/report">
          <button className="nav-button">Report</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;

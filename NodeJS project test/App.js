import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import Author from './pages/Author';
import Categories from './pages/Categories';
import Borrowers from './pages/Borrowers';
import Report from './pages/Report';
import './style.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/*" element={<Books />} />
          <Route path="/author/*" element={<Author />} />
          <Route path="/categories/*" element={<Categories />} />
          <Route path="/borrowers/*" element={<Borrowers />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    category_name: '',
    description: '',
  });
  const [updatedCategories, setUpdatedCategories] = useState({}); // Use an object to store updated categories

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8800/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:8800/categories', newCategory);
      fetchCategories();
      setNewCategory({
        category_name: '',
        description: '',
      });
      // Update the categories list with the newly added category and its ID
      setCategories([...categories, { ...newCategory, category_id: response.data.category_id }]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await axios.put(`http://localhost:8800/categories/${id}`, updatedCategories[id]);
      fetchCategories();
      // Reset the updated category to prevent multiple updates
      setUpdatedCategories({});
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setUpdatedCategories(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [name]: value
      }
    }));
  };

  return (
    <div className="categories-container">
      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/author">Author</Link>
        <Link to="/borrowers">Borrowers</Link>
        <Link to="/report">Report</Link>
      </div>
      <div className="add-category-section">
        <h2>Categories</h2>
        <h3>Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.category_name}
          onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <div>
        <h3>Categories List</h3>
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category.category_id}>
              <div>
                <strong>{category.category_name}</strong> (ID: {category.category_id})
              </div>
              <div>{category.description}</div>
              <div>
                <button onClick={() => handleDeleteCategory(category.category_id)}>Delete</button>
                <input
                  type="text"
                  name="category_name"
                  placeholder="New Category Name"
                  value={updatedCategories[category.category_id]?.category_name || ''}
                  onChange={(e) => handleInputChange(e, category.category_id)}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="New Description"
                  value={updatedCategories[category.category_id]?.description || ''}
                  onChange={(e) => handleInputChange(e, category.category_id)}
                />
                <button onClick={() => handleUpdateCategory(category.category_id)}>Update</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;

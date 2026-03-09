import React, { useState } from 'react';

const CategoryManager = ({ categories, addCategory, deleteCategory }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory(name);
    setName('');
  };

  return (
    <div className="grid-container">
      <div className="card">
        <h2>Categories</h2>
        <div className="category-list">
          {categories.map(c => (
            <div key={c._id} className="category-item">
              <span>{c.name}</span>
              <button onClick={() => deleteCategory(c._id)} className="btn-danger-text">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-form">
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} className="input-field" />
          <button className="btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
};

export default CategoryManager;
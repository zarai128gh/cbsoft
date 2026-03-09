import React, { useEffect, useState } from 'react';
import { API } from '../../api/api';
import AdminLinks from './AdminLinks';
import './dashboard.css';

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) { console.error(err); }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name: catName });
      setCatName("");
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard">
      <AdminLinks />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            <div style={{ marginTop: '20px' }}>
              <h2>Add New Category</h2>
              <form onSubmit={handleAddCategory}>
                <input placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} required />
                <button type="submit" className="btn-submit">Create</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="main">
        <div className="header"><h1>Categories</h1></div>
        <div className="action-bar" style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button className="btn-add-new" onClick={() => setIsModalOpen(true)}>➕ Add Category</button>
        </div>

        <div className="list-card">
          {categories.length === 0 ? (
            <div className="list-item" style={{justifyContent: 'center', color: '#777'}}>No categories found.</div>
          ) : (
            categories.map(c => (
              <div key={c._id} className="list-item">
                <span>{c.name}</span>
                <button className="btn-delete" onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
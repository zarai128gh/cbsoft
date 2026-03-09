import React, { useState } from 'react';
import { API } from '../../api/api';
import AdminLinks from './AdminLinks';
import './dashboard.css'; 

const AddCategory = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
        return alert("Please enter a name");
    }

    try {
      console.log("Sending Data:", { name }); // Check console to see if data is going
      
      const response = await API.post("/categories", { name });
      
      console.log("Response:", response); // Check console for success
      
      alert("Category created successfully");
      setName("");
      
    } catch (err) {
      console.error("FULL ERROR:", err); // Is line ko zaroor check karein
      // Specific error message dikhao
      if (err.response) {
          alert(`Error: ${err.response.data.message || err.response.statusText}`);
      } else {
          alert("Server is not responding. Check if backend is running.");
      }
    }
  };

  return (
    <div className="dashboard">
      <AdminLinks />
      <div className="main">
        <div className="header">
          <h1>Add New Category</h1>
        </div>
        
        <div className="form-container">
          <h2>Category Info</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                placeholder="Category Name (e.g., Drinks, Snacks)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Create Category</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
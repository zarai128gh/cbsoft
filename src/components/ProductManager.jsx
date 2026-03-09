import React, { useState, useEffect } from 'react';

const ProductManager = ({ products, categories, addProduct, deleteProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');

  useEffect(() => {
    if (categories.length > 0 && !category) setCategory(categories[0].name);
  }, [categories, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({ name, price: parseFloat(price), category });
    setName('');
    setPrice('');
  };

  return (
    <div className="grid-container">
      <div className="card">
        <h2>Product List</h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>
                    <button onClick={() => deleteProduct(p._id)} className="btn-danger-text">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-form">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" required />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProductManager;
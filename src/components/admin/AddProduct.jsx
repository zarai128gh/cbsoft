import React, { useState, useEffect } from 'react';
import { API } from '../../api/api';
import AdminLinks from './AdminLinks';
import './dashboard.css';

const AddProduct = () => {

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: null
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setProduct(prev => ({
            ...prev,
            category: res.data[0].name
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("image", product.image);

    try {
      await API.post('/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Product Added!");

      setProduct({
        name: '',
        price: '',
        category: categories[0]?.name || '',
        image: null
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">

      <AdminLinks />

      <div className="main">
        <div className="header">
          <h1>Add Product</h1>
        </div>

        <div style={{ maxWidth: '500px' }}>
          <div className="modal-content" style={{ position: 'relative', boxShadow: 'none', border: '1px solid #333' }}>

            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              Product Details
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                placeholder="Name"
                value={product.name}
                onChange={e => setProduct({ ...product, name: e.target.value })}
                required
              />

              <select
                value={product.category}
                onChange={e => setProduct({ ...product, category: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Price"
                type="number"
                value={product.price}
                onChange={e => setProduct({ ...product, price: e.target.value })}
                required
              />

              {/* IMAGE INPUT */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.files[0] })
                }
              />

              <button type="submit" className="btn-submit">
                Save Product
              </button>

            </form>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AddProduct;
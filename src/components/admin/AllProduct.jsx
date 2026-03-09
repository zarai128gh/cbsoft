import React, { useEffect, useState } from 'react';
import { API } from '../../api/api';
import AdminLinks from './AdminLinks';
import './dashboard.css';

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // For Edit

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="dashboard">
      <AdminLinks />
      
      {/* Modal Popup */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            <div style={{ marginTop: '20px' }}>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <ProductForm 
                   product={editingProduct} 
                   onSuccess={handleFormSuccess} 
                />
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="header">
          <h1>Products</h1>
        </div>

        {/* Action Button */}
        <div className="action-bar" style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button className="btn-add-new" onClick={openAddModal}>
            ➕ Add Product
          </button>
        </div>

        <div className="table-section">
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    {p.salePrice ? (
                      <>
                        <span style={{textDecoration: 'line-through', color: '#666', marginRight: '5px'}}>${p.price}</span>
                        <span style={{color: '#22c55e', fontWeight: 'bold'}}>${p.salePrice}</span>
                      </>
                    ) : `$${p.price}`}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => openEditModal(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Reusable Form Component for Add/Edit
const ProductForm = ({ product, onSuccess }) => {
  const [data, setData] = useState({ 
    name: product?.name || '', 
    price: product?.price || '', 
    salePrice: product?.salePrice || '', 
    category: product?.category || '' 
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
        const res = await API.get('/categories');
        setCategories(res.data);
        // Set default category only for new product
        if(!product && res.data.length > 0) setData(p => ({...p, category: res.data[0].name}));
    };
    fetchCats();
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        // Update Logic
        await API.put(`/products/${product._id}`, { ...data, price: parseFloat(data.price), salePrice: parseFloat(data.salePrice) });
        alert("Product Updated!");
      } else {
        // Create Logic
        await API.post('/products', { ...data, price: parseFloat(data.price), salePrice: parseFloat(data.salePrice) });
        alert("Product Added!");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} required />
      <select value={data.category} onChange={e => setData({...data, category: e.target.value})}>
        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
      </select>
      <input placeholder="Original Price" type="number" value={data.price} onChange={e => setData({...data, price: e.target.value})} required />
      <input placeholder="Sale Price (Optional)" type="number" value={data.salePrice} onChange={e => setData({...data, salePrice: e.target.value})} />
      <button type="submit" className="btn-submit">{product ? 'Update Product' : 'Save Product'}</button>
    </form>
  );
};

export default AllProduct;
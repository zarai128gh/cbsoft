import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../App'; 

const Dashboard = () => {
    const { products, categories, loading, fetchData } = useContext(GlobalContext);
    const [form, setForm] = useState({ name: '', price: '', category: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!form.category) {
            alert("Please select a category!");
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/products', form);
            alert('Product Added Successfully!');
            fetchData(); // Wannan zai sabunta data ba tare da reload ba
            setForm({ name: '', price: '', category: '' }); // Share form
        } catch (err) {
            console.error(err);
            alert("Error adding product. Make sure server is running on port 5000!");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                fetchData(); // Wannan zai sabunta data
            } catch (err) {
                console.error(err);
                alert("Error deleting product");
            }
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Loading products...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(146, 94, 94, 0.1)' }}>
                <h3 style={{marginBottom: '15px'}}>Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        style={inputS} 
                        placeholder="Product Name" 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})} 
                        required 
                    />
                    
                    {/* WANNAN SHI NE GYARAN: AN CANJA SHI ZAMA DROPDOWN */}
                    <select 
                        style={inputS} 
                        value={form.category} 
                        onChange={e => setForm({...form, category: e.target.value})}
                        required
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                    </select>

                    <input 
                        style={inputS} 
                        placeholder="Price (₦)" 
                        type="number" 
                        value={form.price}
                        onChange={e => setForm({...form, price: e.target.value})} 
                        required 
                    />
                    <button style={btnStyle}>Add Product</button>
                </form>
            </div>

            <div style={{ maxWidth: '600px', margin: '30px auto' }}>
                <h3>Products List ({products.length})</h3>
                
                {products.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#777', background: '#fff', padding: '20px', borderRadius: '5px'}}>No products found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 0 5px rgba(170, 120, 120, 0.1)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left', background: '#f9f9f9' }}>
                                <th style={{padding: '10px'}}>Name</th>
                                <th style={{padding: '10px'}}>Category</th>
                                <th style={{padding: '10px'}}>Price</th>
                                <th style={{padding: '10px'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{p.name}</td>
                                    <td style={{ padding: '10px' }}>{p.category}</td>
                                    <td style={{ padding: '10px' }}>₦{p.price}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => handleDelete(p._id)} style={{ color: 'red', border: '1px solid red', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const inputS = { width: '100%', padding: '10px', margin: '5px 0', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = { padding: '10px', width: '100%', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' };

export default Dashboard;
import React, { useContext, useState } from 'react';
import axios from 'axios';
// A saman POS.jsx
import { GlobalContext } from '../App';


const POS = () => {
    const { products, categories, cart, addToCart, removeFromCart, setCart, clearCart } = useContext(GlobalContext);
    const [drafts, setDrafts] = useState([]);
    const [showDrafts, setShowDrafts] = useState(false);

    const loadDrafts = async () => {
        const res = await axios.get('http://localhost:5000/api/orders/drafts');
        setDrafts(res.data);
        setShowDrafts(!showDrafts);
    };

    const loadOrder = (order) => {
        setCart(order.items);
        setShowDrafts(false);
    };

    const submitOrder = async (status) => {
        if(cart.length === 0) return alert('Cart is empty');
        
        const items = cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        await axios.post('http://localhost:5000/api/orders', { items, status });
        alert(`Order ${status}`);
        clearCart();
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div style={{ display: 'flex', height: '90vh' }}>
            
            {/* Sidebar - Drafts */}
            <div style={{ width: '200px', background: '#ddd', padding: '10px' }}>
                <button onClick={loadDrafts} style={{ width: '100%', padding: '10px' }}>
                    View Drafts
                </button>
                {showDrafts && drafts.map(d => (
                    <div key={d._id} style={{ background: '#fff', margin: '5px 0', padding: '10px' }}>
                        <p style={{ fontSize: '12px' }}>ID: ...{d._id.slice(-5)}</p>
                        <button onClick={() => loadOrder(d)} style={{ width: '100%', background: '#17a2b8', color: '#fff' }}>Load</button>
                    </div>
                ))}
            </div>

            {/* Main Area - Products */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {categories.map(cat => (
                    <div key={cat}>
                        <h3>{cat}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {products.filter(p => p.category === cat).map(p => (
                                <div key={p._id} onClick={() => addToCart(p)} style={productStyle}>
                                    <p>{p.name}</p>
                                    <strong>₦{p.price}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Bar - Cart */}
            <div style={{ width: '300px', background: '#4e4d4d', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h3>Current Order</h3>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {cart.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #b0a1a1', padding: '10px 0' }}>
                            <span>{item.name} x{item.quantity}</span>
                            <button onClick={() => removeFromCart(item._id)} style={{ background: 'red', color: '#fff', border: 'none' }}>X</button>
                        </div>
                    ))}
                </div>
                
                <h2>Total: ₦{total}</h2>
                <button onClick={() => submitOrder('draft')} style={draftBtn}>Save Draft</button>
                <button onClick={() => submitOrder('confirmed')} style={confirmBtn}>Confirm Order</button>
            </div>
        </div>
    );
};

const productStyle = {
    width: '100px',
    padding: '15px',
    background: '#f9f9f9',
    textAlign: 'center',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px'
};

const draftBtn = {
    padding: '15px',
    background: '#ffc107',
    border: 'none',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: '10px',
    cursor: 'pointer'
};

const confirmBtn = {
    padding: '15px',
    background: '#28a745',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
};

export default POS;
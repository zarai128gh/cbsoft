import React from 'react';

const Sidebar = ({ view, setView }) => {
  const navBtn = (active) => ({
    padding: '12px', textAlign: 'left', border: 'none', 
    background: active ? '#98aedb' : '#f3f4f6', color: active ? '#fff' : '#9a7474', 
    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
  });

  return (
    <aside className="sidebar">
      <h1 className="logo">Storematic</h1>
      <nav className="nav-menu">
        <button onClick={() => setView('pos')} style={navBtn(view === 'pos')}> Create Order</button>
        <button onClick={() => setView('products')} style={navBtn(view === 'products')}> Products</button>
        <button onClick={() => setView('categories')} style={navBtn(view === 'categories')}> Categories</button>
        <button onClick={() => setView('orders')} style={navBtn(view === 'orders')}> Orders</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
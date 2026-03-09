import React from 'react';

const POSView = ({ }) => {
  return (
    <div className="pos-container">
      {/* Products Section */}
      <div className="pos-products">
        <h2>Products</h2>
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <h3>{p.name}</h3>
              <p className="category-tag">{p.category}</p>
              <p className="price">${p.price}</p>
              <button onClick={() => addToCart(p)} className="btn-primary">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="pos-cart">
        <h2>Cart</h2>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-text">Empty</p>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div>{item.name} <span className="qty-badge">({item.qty})</span></div>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item._id, -1)} className="btn-small">-</button>
                  <button onClick={() => updateQty(item._id, 1)} className="btn-small">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <h3>Total: ${getTotal().toFixed(2)}</h3>
          <button onClick={confirmOrder} className="btn-success">🖨️ Confirm & Print</button>
        </div>
      </div>
    </div>
  );
};

export default POSView;
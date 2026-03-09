import React, { useState, useEffect } from 'react';
import { API } from '../../api/api';
import AdminLinks from '../admin/AdminLinks';
import '../admin/dashboard.css'; // Common CSS

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // State for Modal/Form
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Orders Fetch Error:", error);
    }
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    
    // Sale Price logic: Agar salePrice hai to wo lo, warna default price
    const currentPrice = product.salePrice || product.price;

    if (exists) {
      setCart(cart.map(item => 
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      // Price update kar ke add karo
      setCart([...cart, { ...product, qty: 1, price: currentPrice }]); 
    }
  };

  const updateQty = (id, change) => {
    const item = cart.find(i => i._id === id);
    if (item.qty + change === 0) {
      setCart(cart.filter(i => i._id !== id));
    } else {
      setCart(cart.map(i => 
        i._id === id ? { ...i, qty: i.qty + change } : i
      ));
    }
  };

  // Calculation using the price stored in cart (which is salePrice)
  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // --- HELPER FUNCTIONS FOR REPORTS ---
  const getDateRange = (type) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (type === 'today') return { start: startOfDay, end: endOfDay };
    if (type === 'yesterday') {
      const yesterdayStart = new Date(startOfDay); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const yesterdayEnd = new Date(endOfDay); yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
      return { start: yesterdayStart, end: yesterdayEnd };
    }
    if (type === 'week') {
      const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return { start: startOfWeek, end: endOfDay };
    }
    if (type === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: startOfMonth, end: endOfDay };
    }
    if (type === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return { start: startOfYear, end: endOfDay };
    }
    return {};
  };

  const calculateSales = (type) => {
    const range = getDateRange(type);
    if (!range.start) return 0;
    return orders
      .filter(o => { const d = new Date(o.date); return d >= range.start && d <= range.end; })
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  // --- FINAL PRINT & CONFIRM FUNCTION (WITH FIX) ---
  const handleFinalSubmit = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    
    try {
      // FIX: Cart items ko map karke SIRF zaroori fields bhejo
      // Yeh ensure karta hai ke backend par sahi price save ho
      const itemsToSave = cart.map(item => ({
        _id: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price // Yahan item.price cart wali salePrice hai
      }));

      const orderData = { 
        items: itemsToSave, // Formatted items array
        total: getTotal(),
        customerName: customerName || 'Walk-in',
        paymentMethod: paymentMethod
      };
      
      const response = await API.post('/orders', orderData);
      const savedOrder = response.data;

      // Print Window Code
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${savedOrder._id}</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; }
              h1 { font-size: 24px; margin-bottom: 5px; }
              h2 { font-size: 14px; color: #555; margin-top: 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
              td { padding: 5px 0; border-bottom: 1px dashed #ccc; }
              .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #000; border-bottom: none; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Storematic</h1>
            <h2>Invoice</h2>
            <p style="font-size: 12px;">Customer: ${savedOrder.customerName}</p>
            <p style="font-size: 12px;">Order ID: ${savedOrder._id}</p>
            <p style="font-size: 12px;">Date: ${new Date(savedOrder.date).toLocaleString()}</p>
            
            <table>
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
              </thead>
              <tbody>
                ${savedOrder.items.map(i => `
                  <tr>
                    <td>${i.name}</td>
                    <td>x${i.qty}</td>
                    <td>$${(i.price * i.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td>TOTAL</td>
                  <td></td>
                  <td>$${savedOrder.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>Thank you for shopping!</p>
              <p>Powered by Storematic</p>
            </div>
            
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      setShowModal(false);
      setCart([]);
      setCustomerName('');
      setPaymentMethod('Cash');
      fetchOrders(); 
      alert("Order Placed Successfully!");
      
    } catch (err) {
      console.error("Order Error:", err);
      alert("Error processing order.");
    }
  };

  return (
    <div className="dashboard">
      <AdminLinks />
      
      <div className="main">
        <div className="header">
          <h1>POS Dashboard</h1>
        </div>

        {/* SALES REPORTS SECTION */}
        <div className="sales-dashboard">
          <div className="report-card">
            <h3>Today's Sale</h3>
            <p className="report-amount">${calculateSales('today').toFixed(2)}</p>
          </div>
          <div className="report-card">
            <h3>Yesterday</h3>
            <p className="report-amount">${calculateSales('yesterday').toFixed(2)}</p>
          </div>
          <div className="report-card">
            <h3>This Week</h3>
            <p className="report-amount">${calculateSales('week').toFixed(2)}</p>
          </div>
          <div className="report-card">
            <h3>This Month</h3>
            <p className="report-amount">${calculateSales('month').toFixed(2)}</p>
          </div>
          <div className="report-card">
            <h3>This Year</h3>
            <p className="report-amount">${calculateSales('year').toFixed(2)}</p>
          </div>
        </div>

        {/* POS LAYOUT CONTAINER */}
        <div className="pos-container">
          
          {/* Products Grid */}
          <div className="pos-products">
            <h2>🛒 Products</h2>
            <div className="product-grid">
              {products.map(p => {
                 // Sale Price Logic for Display
                 const displayPrice = p.salePrice || p.price;
                 return (
                  <div key={p._id} className="product-card">
                    <div className="card-top">
                      <h3>{p.name}</h3>
                      <span className="category-tag">{p.category}</span>
                    </div>
                    <div className="card-price-section">
                      {p.salePrice && p.price && p.salePrice < p.price ? (
                        <>
                          <span className="original-price">${p.price}</span>
                          <span className="sale-price">${p.salePrice}</span>
                        </>
                      ) : (
                        <span className="normal-price">${displayPrice}</span>
                      )}
                    </div>
                    <button onClick={() => addToCart(p)} className="btn-add-cart">Add to Cart</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Section */}
          <div className="pos-cart">
            <div className="cart-header">
              <h2>🛍️ Cart</h2>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? 
                <p className="empty-text">Cart is empty</p> : 
                cart.map(item => (
                  <div key={item._id} className="cart-item-row">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.qty}</span>
                    </div>
                    <div className="qty-controls">
                      <button onClick={() => updateQty(item._id, -1)} className="qty-btn">-</button>
                      <button onClick={() => updateQty(item._id, 1)} className="qty-btn">+</button>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="cart-footer">
              <h3>TOTAL: ${getTotal().toFixed(2)}</h3>
              <button 
                onClick={() => cart.length > 0 && setShowModal(true)} 
                className="btn-place-order"
                disabled={cart.length === 0}
              >
                🧾 Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER CONFIRMATION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2>Order Summary</h2>
            
            <div className="order-summary-list">
              {cart.map(item => (
                <div key={item._id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#ccc'}}>
                  <span>{item.name} x {item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{borderTop: '1px solid #444', marginTop: '10px', paddingTop: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
                <span>Total:</span>
                <span style={{color: '#22c55e'}}>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleFinalSubmit(); }}>
              <input 
                type="text" 
                placeholder="Customer Name (Optional)" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{marginBottom: '10px'}}
              />
              
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{marginBottom: '20px'}}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI / Online</option>
              </select>

              <button type="submit" className="btn-confirm-modal">
                🖨️ Confirm & Print
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
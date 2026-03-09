import React, { useEffect, useState } from 'react';
import { API } from '../../api/api';
import AdminLinks from './AdminLinks';
import './dashboard.css'; 

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      const sorted = [...res.data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  // --- CORRECTED DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        // YAHAN PE BACKTICKS (`) USE HONGE, SINGLE QUOTES (') NAHI
        await API.delete(`/orders/${id}`); 
        
        fetchOrders(); // Refresh list after delete
        alert("Order Deleted Successfully");
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order.");
      }
    }
  };

  return (
    <div className="dashboard">
      <AdminLinks />
      <div className="main-content-area">
        <div className="page-header">
          <h2>📜 Past Orders <span className="badge">{orders.length}</span></h2>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(o => (
              <div key={o._id} className="order-card">
                
                {/* Header with Delete Button */}
                <div className="order-card-header">
                  <div className="order-meta">
                    <div className="order-id">
                      <span className="label">Order ID:</span>
                      <span className="value">{o._id}</span>
                    </div>
                    <div className="order-date">
                      {new Date(o.date).toLocaleString()}
                    </div>
                    {o.customerName && (
                      <div className="order-customer">
                        Customer: {o.customerName}
                      </div>
                    )}
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    className="btn-delete-order" 
                    onClick={() => handleDelete(o._id)}
                    title="Delete Order"
                  >
                    🗑️
                  </button>
                </div>

                <div className="order-card-body">
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items && o.items.map((i, idx) => (
                        <tr key={idx}>
                          <td>{i.name}</td>
                          <td className="text-center">{i.qty}</td>
                          <td className="text-right">${(i.price * i.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-card-footer">
                  <h3>TOTAL: <span className="total-amount">${o.total ? o.total.toFixed(2) : '0.00'}</span></h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
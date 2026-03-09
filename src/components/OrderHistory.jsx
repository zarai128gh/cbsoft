import React, { useState } from 'react';

// New Modal Component for Order Details
const OrderModal = ({ order, onClose, onPrint }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-info-row">
            <span className="label">Order ID:</span>
            <span className="value">{order._id}</span>
          </div>
          <div className="modal-info-row">
            <span className="label">Date:</span>
            <span className="value">{new Date(order.date).toLocaleString()}</span>
          </div>
          
          <div className="divider"></div>
          
          <h3>Items</h3>
          <table className="modal-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.name}</td>
                  <td>{i.qty}</td>
                  <td>${i.price.toFixed(2)}</td>
                  <td><strong>${(i.price * i.qty).toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <div className="modal-total">
            Grand Total: <span>${order.total ? order.total.toFixed(2) : '0.00'}</span>
          </div>
          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">Close</button>
            <button onClick={() => onPrint(order)} className="btn-success">
              🖨️ Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Order History Component
const OrderHistory = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to print specific order from modal
  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${order._id}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; }
            h1 { font-size: 24px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left; }
            td { padding: 5px 0; border-bottom: 1px dashed #ccc; }
            .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #000; }
          </style>
        </head>
        <body>
          <h1>Storematic</h1>
          <p>Order ID: ${order._id}</p>
          <p>Date: ${new Date(order.date).toLocaleString()}</p>
          <table>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>x${i.qty}</td>
                  <td>$${(i.price * i.qty).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL</td>
                <td></td>
                <td>$${order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="card">
        <h2>Past Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div className="empty-box">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="order-list">
            {orders.map(o => (
              <div key={o._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order ID: {o._id}</span>
                  <span className="order-date">{new Date(o.date).toLocaleString()}</span>
                </div>
                
                {/* Quick View of Items */}
                <ul className="order-items">
                  {o.items && o.items.slice(0, 2).map((i, idx) => (
                    <li key={idx}>{i.name} x {i.qty}</li>
                  ))}
                  {o.items && o.items.length > 2 && <li style={{color:'#888'}}>...and {o.items.length - 2} more items</li>}
                </ul>
                
                <div className="order-actions-row">
                  <div className="order-total">
                    Total: <strong>${o.total ? o.total.toFixed(2) : '0.00'}</strong>
                  </div>
                  {/* NEW DETAIL BUTTON */}
                  <button onClick={() => setSelectedOrder(o)} className="btn-detail">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Modal if an order is selected */}
      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onPrint={handlePrintOrder}
        />
      )}
    </>
  );
};

export default OrderHistory;
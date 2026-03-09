import React, { useState } from "react";

const AdminLinks = () => {
  const [open, setOpen] = useState(false);

  // Jab koi link click kare to menu band ho jaye (mobile ke liye)
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR - Sirf Mobile Par Dikhega */}
      <div className="mobile-top-bar">
        <button 
          className="hamburger-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <h2 className="mobile-logo">Storematic</h2>
      </div>

      {/* SIDEBAR - Mobile Par 'active' class se khulega */}
      <div className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">Storematic</h2>
          {/* Close Button Sirf Mobile Par Dikhega */}
          <button className="close-sidebar-btn" onClick={() => setOpen(false)}>
            &times;
          </button>
        </div>

        <ul className="menu">
          <li><a href="/" onClick={handleLinkClick}> POS View</a></li>
          <li><a href="/admin/add_product" onClick={handleLinkClick}> Add Product</a></li>
          <li><a href="/admin/all_product" onClick={handleLinkClick}> All Products</a></li>
          <li><a href="/admin/add_category" onClick={handleLinkClick}> Add Category</a></li>
          <li><a href="/admin/all_category" onClick={handleLinkClick}> All Categories</a></li>
          <li><a href="/admin/orders" onClick={handleLinkClick}> Orders</a></li>
        </ul>
      </div>

      {/* Overlay - Jab menu khule to background kaala ho */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default AdminLinks;
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css';
import Home from './components/user/home';
import AddProduct from './components/admin/AddProduct';

import AllCategory from './components/admin/AllCategory';
import AllProduct from './components/admin/AllProduct';
import AddCategory from './components/admin/AddCategory';
import OrderHistory from './components/admin/OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/add_product" element={<AddProduct />} />
        <Route path="/admin/all_product" element={<AllProduct />} />
        <Route path="/admin/add_category" element={<AddCategory />} />
        <Route path="/admin/all_category" element={<AllCategory />} />
        <Route path="/admin/orders" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
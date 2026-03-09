// src/api/api.js
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api' // Ye URL aapke backend se match karna chahiye
});
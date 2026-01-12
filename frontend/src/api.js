import axios from 'axios';
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
const api = axios.create({ baseURL: BASE, timeout: 10000 });
export default api;

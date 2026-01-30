import axios from "axios";

const BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") ||
  "https://inventarioshalito.onrender.com/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000, // Render puede tardar si despierta
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

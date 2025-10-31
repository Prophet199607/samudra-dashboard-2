import axios from "axios";

const externalApi = axios.create({
  baseURL: import.meta.env.VITE_EXTERNAL_API_BASE_URL,
  auth: {
    username: import.meta.env.VITE_EXTERNAL_API_USER,
    password: import.meta.env.VITE_EXTERNAL_API_PASS,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export default externalApi;

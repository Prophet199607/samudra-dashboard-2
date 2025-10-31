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

externalApi.interceptors.request.use(
  (config) => {
    if (config.method?.toUpperCase() === "POST" && !config.data) {
      config.data = {};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default externalApi;

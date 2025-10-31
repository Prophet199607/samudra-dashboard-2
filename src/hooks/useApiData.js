import { useState, useEffect, useRef } from "react";
import api from "../services/api";

const apiCache = new Map();

export const useApiData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    // Return cached data immediately if available
    if (apiCache.has(endpoint)) {
      setData(apiCache.get(endpoint));
      return;
    }

    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        const response = await api.get(endpoint);
        if (response.data && Array.isArray(response.data)) {
          // Cache the data
          apiCache.set(endpoint, response.data);
          setData(response.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        setError(err.response?.data?.error || `Failed to load ${endpoint}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

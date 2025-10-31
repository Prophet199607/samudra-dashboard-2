import { useState, useEffect, useRef } from "react";
import externalApi from "../services/externalApi";

const apiCache = new Map();

export const useExternalApiData = (
  endpoint,
  { method = "GET", postData = null } = {}
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const calledRef = useRef(false);

  const cacheKey = `${method.toUpperCase()}:${endpoint}:${JSON.stringify(
    postData
  )}`;

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (apiCache.has(cacheKey)) {
      setData(apiCache.get(cacheKey));
      return;
    }

    setLoading(true);
    setError("");

    const fetchData = async () => {
      try {
        let response;
        if (method.toUpperCase() === "POST") {
          response = await externalApi.post(endpoint, postData);
        } else {
          response = await externalApi.get(endpoint);
        }

        let responseData = [];

        if (Array.isArray(response.data)) {
          responseData = response.data;
        } else if (response.data && typeof response.data === "object") {
          const arrayKeys = Object.keys(response.data).filter((key) =>
            Array.isArray(response.data[key])
          );

          if (arrayKeys.length > 0) {
            responseData = response.data[arrayKeys[0]];
          } else {
            responseData = [response.data];
          }
        }

        apiCache.set(cacheKey, responseData);
        setData(responseData);
      } catch (err) {
        setError(err.response?.data?.error || `Failed to load ${endpoint}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cacheKey, endpoint, method, postData]);

  return { data, loading, error };
};

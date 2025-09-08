import React, { useRef, useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="content-inner space-y-4">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{data.message}</h1>
        <p>Welcome, {data.user.username}</p>
      </div>
    </div>
  );
}

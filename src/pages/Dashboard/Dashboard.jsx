import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../auth/auth-context.js";
import { ClipLoader } from "react-spinners";
import api from "../../services/api";
import { Package, Hourglass, Truck } from "lucide-react";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);
  useAuth();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard"));

    api
      .get("/orders/dashboard-stats")
      .then((res) => setStatsData(res.data))
      .catch(() => setError("Failed to load dashboard stats"));
  }, []);

  if (error) return <p className="text-red-500 p-4">{error}</p>;

  if (!data || !statsData) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#3B82F6" size={40} />
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Orders",
      count: statsData.totalOrders ?? 0,
      icon: <Package />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Orders",
      count: statsData.pendingOrders ?? 0,
      icon: <Hourglass />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed Orders",
      count: statsData.completedOrders ?? 0,
      icon: <Truck />,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-4">
      {metricCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100"
        >
          <div className={`p-3 rounded-full ${card.color}`}>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

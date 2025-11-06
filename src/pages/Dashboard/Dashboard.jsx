import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../services/api";
import { Package, Hourglass, Truck, CircleDollarSign } from "lucide-react";

export default function Dashboard() {
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
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  const metricCards = [
    {
      title: "Total Orders",
      count: data.totalOrders || 125,
      icon: <Package />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Approvals",
      count: data.pendingApprovals || 12,
      icon: <Hourglass />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed Deliveries",
      count: data.completedDeliveries || 105,
      icon: <Truck />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Revenue",
      count: data.revenue || "LKR 2.5M",
      icon: <CircleDollarSign />,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-1 sm:p-4">
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

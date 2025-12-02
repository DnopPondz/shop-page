"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0, userCount: 0 });

  useEffect(() => {
    fetch("/api/admin/stats").then((res) => res.json()).then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Sales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Sales</p>
          <h3 className="text-3xl font-bold text-indigo-600">฿{stats.totalSales.toLocaleString()}</h3>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-800">{stats.orderCount}</h3>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-gray-800">{stats.userCount}</h3>
        </div>
      </div>
    </div>
  );
}
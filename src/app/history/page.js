// app/history/page.js
"use client";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // เพิ่ม router เพื่อดีดคนไม่ล็อกอิน

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // ถ้าสถานะคือ "unauthenticated" (ไม่ได้ล็อกอิน) ให้ดีดไปหน้า Login
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // ถ้าล็อกอินแล้ว ค่อยดึงข้อมูล
    if (status === "authenticated") {
      fetch("/api/orders") // ไม่ต้องส่ง email query params แล้ว
        .then((res) => {
           if (!res.ok) throw new Error("Failed to fetch");
           return res.json();
        })
        .then((data) => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [status, router]); // ทำงานเมื่อ status เปลี่ยน

  // ... (ส่วน return JSX เหมือนเดิมเป๊ะ ไม่ต้องแก้) ...
  
  const getStatusColor = (status) => {
     // ... (เหมือนเดิม) ...
      switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <Navbar />
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Order History <span className="text-sm font-normal text-gray-500">({session?.user?.name})</span>
        </h1>

        {orders.length === 0 ? (
            <p className="text-gray-500">คุณยังไม่มีคำสั่งซื้อ</p>
        ) : (
            <div className="space-y-6">
            {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <p className="text-sm text-gray-400">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                    </span>
                </div>
                
                <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700 text-sm">
                        <span>{item.title} x {item.quantity}</span>
                        <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    ))}
                </div>
                
                <hr className="my-4 border-gray-100"/>
                
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-indigo-600">฿{order.total.toLocaleString()}</span>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
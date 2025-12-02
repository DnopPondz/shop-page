"use client";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleOrder = async () => {
    if (!session) return alert("Please login first");
    if (!address) return alert("Please enter shipping address");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total: cartTotal,
        address,
        userEmail: session.user.email
      }),
    });

    if (res.ok) {
      clearCart();
      router.push("/history"); // ไปหน้าประวัติการสั่งซื้อ
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <textarea 
            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            rows="3"
            placeholder="Enter your full address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="flex gap-4">
            <div className="border-2 border-indigo-500 bg-indigo-50 text-indigo-700 p-4 rounded-xl font-bold flex-1 text-center cursor-pointer">
              Cash on Delivery (COD)
            </div>
            <div className="border border-gray-200 p-4 rounded-xl font-bold flex-1 text-center text-gray-400 cursor-not-allowed">
              Credit Card (Coming Soon)
            </div>
          </div>
        </div>

        <button 
          onClick={handleOrder}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-indigo-700 transition"
        >
          Confirm Order (฿{cartTotal.toLocaleString()})
        </button>
      </div>
    </div>
  );
}
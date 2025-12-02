// app/cart/page.js
"use client";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="pt-32 container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
            <Link href="/" className="text-indigo-600 font-bold hover:underline">Go Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* List Items */}
            <div className="flex-1 space-y-6">
              {cart.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <img src={item.image} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-indigo-600 font-bold mt-1">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Remove</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl shadow-lg sticky top-32">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Subtotal</span>
                  <span>฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-6 text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr className="mb-6 border-gray-100" />
                <div className="flex justify-between mb-8 text-2xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>฿{cartTotal.toLocaleString()}</span>
                </div>
                
                <Link href="/checkout">
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition shadow-lg hover:shadow-indigo-500/50">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
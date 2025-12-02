"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar() {
  const { cart, removeFromCart, cartTotal, isCartOpen, closeCart } = useCart();

  return (
    <>
      {/* 1. Backdrop (ฉากหลังสีดำจางๆ) - กดแล้วปิดตะกร้า */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* 2. Sidebar (ตัวตะกร้า) */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Shopping Cart ({cart.length})</h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>

        {/* List Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-180px)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-2">🛒</span>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md bg-white" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-indigo-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Total & Checkout) */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t p-4">
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>Subtotal:</span>
            <span>฿{cartTotal.toLocaleString()}</span>
          </div>
          <Link href="/checkout">
            <button 
              onClick={closeCart}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
              disabled={cart.length === 0}
            >
              Checkout Now
            </button>
          </Link>
          <button 
            onClick={closeCart}
            className="w-full text-center mt-2 text-sm text-gray-500 hover:text-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}
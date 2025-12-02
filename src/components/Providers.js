"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { Toaster } from "react-hot-toast"; // 1. import

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartSidebar />
        <Toaster position="top-center" /> {/* 2. เพิ่มตรงนี้ */}
      </CartProvider>
    </SessionProvider>
  );
}
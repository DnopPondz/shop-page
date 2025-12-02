"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar"; // 1. import มา

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartSidebar /> {/* 2. วางไว้ตรงนี้ มันจะลอยอยู่เหนือทุก content */}
      </CartProvider>
    </SessionProvider>
  );
}
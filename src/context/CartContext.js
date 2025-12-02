"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // 1. เพิ่ม State นี้

  // ... (useEffect โหลดของเดิม เก็บไว้เหมือนเดิม) ...
  useEffect(() => {
    const savedCart = localStorage.getItem("my-shop-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("my-shop-cart", JSON.stringify(cart));
  }, [cart]);

  // ... (ฟังก์ชัน addToCart, removeFromCart เดิม เก็บไว้) ...
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // 2. พอหยิบใส่ตะกร้า ให้เปิด Sidebar โชว์เลย เท่ๆ
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 3. ฟังก์ชันเปิดปิด
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal, 
      cartCount,
      isCartOpen, // ส่งออกไปใช้
      openCart,   // ส่งออกไปใช้
      closeCart   // ส่งออกไปใช้
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
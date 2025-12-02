"use client";
import { createContext, useContext, useState, useEffect } from "react";

// 1. สร้าง Context พร้อม Default Value (กันเหนียวไว้ เวลาเรียกใช้นอก Provider จะได้ไม่ Error)
const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // isMounted ใช้เพื่อป้องกัน Hydration Mismatch (หน้าจอ Server กับ Client ไม่ตรงกัน)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // โหลดข้อมูลจาก LocalStorage เฉพาะตอนอยู่ฝั่ง Client แล้วเท่านั้น
    const savedCart = localStorage.getItem("my-shop-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("my-shop-cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

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
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  // คำนวณค่าต่างๆ
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // 2. สำคัญ: ต้อง Return Provider เสมอ! ห้าม return null หรือ children เปล่าๆ
  // หากยังไม่ Mount (Server Side) ค่า cart จะเป็น [] ว่างๆ ไปก่อน ซึ่งถูกต้องแล้ว
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal, 
      cartCount, 
      isCartOpen, 
      openCart, 
      closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
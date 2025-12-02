// app/page.js
"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
          Discover the <br/> <span className="text-indigo-600">Extraordinary.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          รวมสินค้าคุณภาพดีที่สุด ดีไซน์ล้ำสมัย ส่งตรงถึงหน้าบ้านคุณภายใน 24 ชม.
        </p>
        <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-black transition hover:scale-105">
          Shop Now
        </button>
      </header>

      {/* Product Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">New Arrivals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col">
              <div className="h-64 w-full bg-gray-100 rounded-2xl mb-4 overflow-hidden relative group">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition"
                >
                  🛒 +
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.title}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-600">฿{product.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
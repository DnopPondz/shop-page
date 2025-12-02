"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useSession } from "next-auth/react"; // ใช้เช็คสถานะล็อกอิน
import { useRouter } from "next/navigation";  // ใช้เปลี่ยนหน้า
import toast from "react-hot-toast";          // แจ้งเตือนสวยๆ

export default function ProductList({ initialProducts }) {
  const { addToCart } = useCart();
  const { data: session } = useSession(); // ดึงข้อมูล Session
  const router = useRouter();             
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ฟังก์ชันช่วยกรอง URL รูปภาพ
  const getSafeImage = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http") || image.startsWith("/") || image.startsWith("data:")) {
      return image;
    }
    return "/placeholder.jpg";
  };

  // ดึงหมวดหมู่ทั้งหมดจากสินค้า
  const categories = ["All", ...new Set(initialProducts.map(p => p.category || "General"))];

  // Logic การกรองสินค้า
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // --- ฟังก์ชันเช็คสิทธิ์ก่อนเพิ่มสินค้า ---
  const handleAddToCart = (product) => {
    // 1. เช็คว่าล็อกอินหรือยัง?
    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้า"); 
      router.push("/login"); // ดีดไปหน้า Login ทันที
      return;
    }
    
    // 2. ถ้าล็อกอินแล้ว ให้เพิ่มลงตะกร้าได้
    addToCart(product);
    toast.success("เพิ่มลงตะกร้าแล้ว");
  };

  return (
    <section className="container mx-auto px-6 py-20">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
        <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2">Selected Products</h2>
            <p className="text-slate-500">คัดสรรสินค้าที่ดีที่สุดมาเพื่อคุณ</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Dropdown เลือกหมวดหมู่ */}
          <select 
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm cursor-pointer hover:border-indigo-300 transition"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* ช่องค้นหา */}
          <div className="relative flex-1 sm:w-80">
            <input 
                type="text"
                placeholder="ค้นหาสินค้า..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="group bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
            
            {/* Image Container */}
            <div className="h-64 w-full bg-slate-50 rounded-2xl overflow-hidden relative">
              <Image 
                src={getSafeImage(product.image)} 
                alt={product.title} 
                fill 
                className="object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* ปุ่ม Add to Cart (จะโผล่เมื่อ Hover) */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button 
                    onClick={() => handleAddToCart(product)} // เรียกใช้ฟังก์ชันที่สร้างใหม่
                    className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
                  >
                    <span>🛒</span> Add to Cart
                  </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 pt-4">
                <div className="text-xs font-semibold text-indigo-500 mb-1 uppercase tracking-wider">{product.category || "General"}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate group-hover:text-indigo-600 transition">{product.title}</h3>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-slate-900">฿{product.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-medium line-through">฿{(product.price * 1.2).toLocaleString()}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State (กรณีหาไม่เจอ) */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200 w-full col-span-full">
            <span className="text-6xl mb-4">📦</span>
            <p className="text-xl font-medium text-slate-600">ไม่พบสินค้าที่คุณค้นหา</p>
            <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("All")}}
                className="text-indigo-600 hover:underline mt-2 font-medium"
            >
                ล้างคำค้นหาแล้วดูทั้งหมด
            </button>
        </div>
      )}
    </section>
  );
}
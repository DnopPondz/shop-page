"use client";
import { useState, useEffect } from "react"; // <--- ต้องมีบรรทัดนี้ครับ

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  
  // เพิ่ม loading state เพื่อกันหน้าจอขาว
  const [isLoadingData, setIsLoadingData] = useState(true); 
  const [loading, setLoading] = useState(false); // สำหรับปุ่ม save

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    fetchProducts(); // Refresh list
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await fetch("/api/products", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    setNewProduct({ title: "", description: "", price: "", stock: "", category: "", image: "" });
    setLoading(false);
    fetchProducts();
    alert("Product added!");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>

      {/* 1. Form Add Product */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            className="border p-2 rounded-lg" 
            placeholder="Product Name" 
            value={newProduct.title}
            onChange={e => setNewProduct({...newProduct, title: e.target.value})}
            required
          />
          <input 
            className="border p-2 rounded-lg" 
            placeholder="Category" 
            value={newProduct.category}
            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
          />
          <input 
            type="number"
            className="border p-2 rounded-lg" 
            placeholder="Price (฿)" 
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            required
          />
          <input 
            type="number"
            className="border p-2 rounded-lg" 
            placeholder="Stock Qty" 
            value={newProduct.stock}
            onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
            required
          />
          <input 
            className="border p-2 rounded-lg md:col-span-2" 
            placeholder="Image URL" 
            value={newProduct.image}
            onChange={e => setNewProduct({...newProduct, image: e.target.value})}
          />
          <textarea 
            className="border p-2 rounded-lg md:col-span-2" 
            placeholder="Description" 
            rows="3"
            value={newProduct.description}
            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
          />
          <button disabled={loading} type="submit" className="bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 md:col-span-2 disabled:bg-gray-400">
            {loading ? "Saving..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* 2. Product List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoadingData ? (
                // Skeleton Loader ง่ายๆ
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading products...</td>
                </tr>
            ) : products.length === 0 ? (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
            ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {/* ถ้ามีรูปให้แสดง ถ้าไม่มีแสดง Placeholder */}
                      <img 
                        src={p.image || "https://placehold.co/100?text=No+Image"} 
                        className="w-12 h-12 rounded object-cover bg-gray-100" 
                        alt={p.title}
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-800">{p.title}</td>
                    <td className="p-4 text-indigo-600 font-bold">฿{p.price.toLocaleString()}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-sm font-bold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
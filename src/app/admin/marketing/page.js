"use client";
import { useEffect, useState } from "react";

export default function AdminMarketing() {
  const [coupons, setCoupons] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", discount: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/admin/marketing");
    const data = await res.json();
    if (data.coupons) setCoupons(data.coupons);
    if (data.announcement) {
      setAnnouncement(data.announcement.message);
      setIsAlertActive(data.announcement.isActive);
    }
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    await fetch("/api/admin/marketing", {
      method: "POST",
      body: JSON.stringify({ type: "coupon", ...newCode }),
    });
    setNewCode({ code: "", discount: "" });
    fetchData();
  };

  const deleteCoupon = async (id) => {
    await fetch(`/api/admin/marketing?id=${id}&type=coupon`, { method: "DELETE" });
    fetchData();
  };

  const saveAnnouncement = async () => {
    await fetch("/api/admin/marketing", {
      method: "POST",
      body: JSON.stringify({ 
        type: "announcement", 
        message: announcement, 
        isActive: isAlertActive 
      }),
    });
    alert("Announcement updated!");
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Announcement Alert Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📢 Website Announcement</h2>
        <div className="flex gap-4">
          <input 
            className="flex-1 border p-3 rounded-xl"
            placeholder="Enter alert message (e.g. Flash Sale 50% Off!)"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="w-5 h-5"
              checked={isAlertActive}
              onChange={(e) => setIsAlertActive(e.target.checked)}
            />
            <label>Active</label>
          </div>
          <button onClick={saveAnnouncement} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 font-bold">
            Save
          </button>
        </div>
      </section>

      {/* 2. Discount Codes Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🎟️ Discount Codes</h2>
        
        {/* Form Add Code */}
        <form onSubmit={addCoupon} className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
          <input 
            className="flex-1 border p-2 rounded-lg uppercase"
            placeholder="CODE (e.g. SALE2024)"
            value={newCode.code}
            onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
            required
          />
          <input 
            type="number"
            className="w-32 border p-2 rounded-lg"
            placeholder="Discount ฿"
            value={newCode.discount}
            onChange={(e) => setNewCode({ ...newCode, discount: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
            Add Code
          </button>
        </form>

        {/* List Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c._id} className="border border-dashed border-gray-300 p-4 rounded-xl flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold text-lg text-gray-800">{c.code}</p>
                <p className="text-green-600 font-bold">-฿{c.discount}</p>
              </div>
              <button onClick={() => deleteCoupon(c._id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
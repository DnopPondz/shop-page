"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ProfileForm({ user }) {
  // user.address อาจจะยังไม่มีในตอนแรก ให้เป็นค่าว่าง
  const [address, setAddress] = useState(user.address || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // ยิง API ไปอัพเดทข้อมูลที่ Server
    const res = await fetch("/api/user/update", {
      method: "PUT",
      body: JSON.stringify({ email: user.email, address }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("บันทึกข้อมูลเรียบร้อย!");
    } else {
      alert("เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">ที่อยู่สำหรับจัดส่งสินค้า</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="กรุณากรอกที่อยู่ เบอร์โทรศัพท์..."
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
        </button>
      </form>

      <hr className="my-6" />

      {/* ปุ่ม Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-red-600 font-semibold hover:text-red-800 hover:underline"
      >
        ออกจากระบบ (Logout)
      </button>
    </div>
  );
}
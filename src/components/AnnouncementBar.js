"use client";
import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลจาก API Marketing ที่เราทำไว้
    fetch("/api/admin/marketing")
      .then((res) => res.json())
      .then((data) => {
        // เช็คว่ามีข้อมูล และสถานะ isActive เป็น true ไหม
        if (data.announcement && data.announcement.isActive) {
          setAnnouncement(data.announcement.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // ถ้าไม่มีข้อมูล หรือไม่ได้เปิดใช้งาน ก็ไม่ต้องโชว์อะไรเลย
  if (!announcement) return null;

  return (
    <div className="bg-indigo-600 text-white text-center text-sm font-medium py-2 px-4 relative z-50">
      <p>
        📢 {announcement}
      </p>
    </div>
  );
}
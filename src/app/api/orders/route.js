// app/api/orders/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // 1. เพิ่มตัวดึง Session ฝั่ง Server
import { authOptions } from "../auth/[...nextauth]/route"; // 2. import authOptions

export async function POST(req) {
  // ... (โค้ด POST เดิม ใช้ได้เลย ไม่ต้องแก้) ...
  const { items, total, address, userEmail } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  await db.collection("orders").insertOne({
    userEmail,
    items,
    total,
    address,
    status: "Pending",
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Order placed" });
}

// 3. แก้ GET ใหม่ทั้งหมด (Security Fix)
export async function GET(req) {
  // ดึง Session ของคนที่เรียก API นี้
  const session = await getServerSession(authOptions);

  // ถ้าไม่ได้ล็อกอิน -> ดีดออก
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  
  // ใช้ email จาก session เท่านั้น (ห้ามรับจาก req.url เด็ดขาด)
  const userEmail = session.user.email; 

  // ค้นหาเฉพาะ Order ของ email นี้
  const orders = await db.collection("orders")
    .find({ userEmail: userEmail })
    .sort({ createdAt: -1 })
    .toArray();
  
  return NextResponse.json(orders);
}
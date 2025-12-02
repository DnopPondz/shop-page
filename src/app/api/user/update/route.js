import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // รับข้อมูลที่ส่งมาจากหน้าบ้าน
    const { email, address } = await req.json();
    
    // เชื่อมต่อ Database
    const client = await clientPromise;
    const db = client.db();

    // สั่ง update ข้อมูลใน collection 'users'
    // ค้นหาด้วย email และ set ค่า address ใหม่
    await db.collection("users").updateOne(
      { email: email },
      { $set: { address: address } }
    );

    return NextResponse.json({ message: "อัพเดทข้อมูลสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
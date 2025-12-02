import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// 1. GET: ดึงข้อมูลคูปองและประกาศ (ใช้ทั้งหน้า Admin และ AnnouncementBar)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const coupons = await db.collection("coupons").find({}).toArray();
    const announcement = await db.collection("settings").findOne({ type: "announcement" });

    return NextResponse.json({ coupons, announcement });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// 2. POST: สร้างคูปอง หรือ บันทึกประกาศ
export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    if (body.type === "coupon") {
      // เพิ่มคูปองส่วนลด
      await db.collection("coupons").insertOne({
        code: body.code,
        discount: parseInt(body.discount),
        createdAt: new Date(),
      });
    } else if (body.type === "announcement") {
      // บันทึกประกาศ (ใช้ upsert: true เพื่อให้ทับของเดิมเสมอ)
      await db.collection("settings").updateOne(
        { type: "announcement" },
        { $set: { message: body.message, isActive: body.isActive } },
        { upsert: true }
      );
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

// 3. DELETE: ลบคูปอง
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    const client = await clientPromise;
    const db = client.db();

    await db.collection("coupons").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  // ดึง Order ทั้งหมด เรียงจากล่าสุด
  const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(orders);
}

export async function PUT(req) {
  const { orderId, status } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status: status } }
  );

  return NextResponse.json({ message: "Status updated" });
}
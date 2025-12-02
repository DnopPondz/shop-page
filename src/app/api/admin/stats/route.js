import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  // นับจำนวน Orders
  const orderCount = await db.collection("orders").countDocuments();
  
  // นับจำนวน Users
  const userCount = await db.collection("users").countDocuments();

  // คำนวณยอดขายรวม (Total Sales)
  const orders = await db.collection("orders").find({}).toArray();
  const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  return NextResponse.json({ totalSales, orderCount, userCount });
}
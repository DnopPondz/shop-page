import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(users);
}

export async function PUT(req) {
  const { userId, role } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: role } }
  );

  return NextResponse.json({ message: "Role updated" });
}
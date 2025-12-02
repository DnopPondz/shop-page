// app/api/register/verify/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // หา User ที่ตรงกับ email และ otp และยังไม่หมดอายุ
    const user = await db.collection("users").findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() } // เวลาหมดอายุต้องมากกว่าเวลาปัจจุบัน
    });

    if (!user) {
      return NextResponse.json({ message: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }

    // อัปเดตสถานะเป็นยืนยันแล้ว และลบ OTP ทิ้ง
    await db.collection("users").updateOne(
      { _id: user._id },
      { 
        $set: { isVerified: true },
        $unset: { otp: "", otpExpires: "" } 
      }
    );

    return NextResponse.json({ message: "ยืนยันตัวตนสำเร็จ" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
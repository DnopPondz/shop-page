import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { firstName, lastName, phone, email, password, confirmPassword } = await req.json();

    // 1. Validation เบื้องต้น
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "รหัสผ่านยืนยันไม่ตรงกัน" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 2. เช็คว่ามีอีเมลนี้หรือยัง
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // 3. สร้าง OTP 6 หลัก และเวลาหมดอายุ (15 นาที)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 นาที

    // 4. เข้ารหัส Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. บันทึกลง Database (เพิ่ม field isVerified: false)
    await db.collection("users").insertOne({
      name: `${firstName} ${lastName}`, // รวมชื่อนามสกุลเพื่อความง่ายในการแสดงผล
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
      otp: otp,             // เก็บ OTP
      otpExpires: otpExpires,
      isVerified: false,    // ยังไม่ยืนยัน
      createdAt: new Date(),
    });

    // 6. ส่งอีเมล OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "รหัสยืนยันการสมัครสมาชิก (OTP)",
      html: `
        <h1>รหัส OTP ของคุณคือ: <b>${otp}</b></h1>
        <p>รหัสนี้จะหมดอายุใน 15 นาที</p>
      `,
    });

    return NextResponse.json({ message: "ส่งรหัส OTP ไปยังอีเมลแล้ว" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error }, { status: 500 });
  }
}
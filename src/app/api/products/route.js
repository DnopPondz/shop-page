import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// 1. GET: ดึงสินค้าทั้งหมด (ใช้ได้ทั้งหน้าแรก และหน้า Admin)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // ดึงสินค้าทั้งหมด
    const products = await db.collection("products").find({}).toArray();
    
    // --- FIX: แปลงค่า image ที่เป็น "" ให้เป็น null เพื่อกัน Console Error ---
    const safeProducts = products.map(product => ({
      ...product,
      image: product.image || null 
    }));
    
    return NextResponse.json(safeProducts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. POST: เพิ่มสินค้าใหม่ (สำหรับ Admin)
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, price, stock, category, image } = body;

    // Validation
    if (!title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newProduct = {
      title,
      description: description || "",
      price: parseFloat(price), // แปลงเป็นตัวเลข
      stock: parseInt(stock) || 0, // แปลงเป็นจำนวนเต็ม
      category: category || "General",
      // --- FIX: บันทึกเป็น null ถ้าไม่มีรูป (แทนที่จะเป็น "") ---
      image: image || null, 
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ message: "Product created", product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
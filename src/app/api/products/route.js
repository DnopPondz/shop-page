import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod"; // 1. เรียกใช้ Zod

// 2. สร้าง Schema เพื่อกำหนดกฎของข้อมูลสินค้า
const productSchema = z.object({
  title: z.string().min(3, "ชื่อสินค้าต้องยาวอย่างน้อย 3 ตัวอักษร"),
  description: z.string().optional().or(z.literal("")), // ยอมรับข้อความ หรือค่าว่าง
  // z.coerce.number() จะช่วยแปลง "100" (String) -> 100 (Number) ให้อัตโนมัติ
  price: z.coerce.number().min(0, "ราคาต้องไม่ต่ำกว่า 0"),
  stock: z.coerce.number().int().min(0, "จำนวนสินค้าต้องเป็นจำนวนเต็มบวก"),
  category: z.string().optional().or(z.literal("")),
  image: z.string().optional().nullable().or(z.literal("")),
});

// 1. GET: ดึงสินค้าทั้งหมด (Code เดิม ใช้ได้ปกติ)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const products = await db.collection("products").find({}).toArray();
    
    // แปลงค่า image ที่เป็น "" ให้เป็น null เพื่อกัน Console Error ฝั่ง Client
    const safeProducts = products.map(product => ({
      ...product,
      image: product.image || null 
    }));
    
    return NextResponse.json(safeProducts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. POST: เพิ่มสินค้าใหม่ (อัปเกรดด้วย Zod Validation)
export async function POST(req) {
  try {
    const body = await req.json();

    // --- STEP 1: ตรวจสอบความถูกต้องของข้อมูล ---
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      // ถ้าข้อมูลไม่ผ่านเกณฑ์ ให้ส่ง Error 400 กลับไป พร้อมบอกเหตุผล
      return NextResponse.json({ 
        error: "Validation Failed", 
        details: validation.error.format() // ส่งรายละเอียด field ที่ผิดกลับไป
      }, { status: 400 });
    }

    // --- STEP 2: เตรียมข้อมูลลง Database ---
    // ดึงข้อมูลที่ผ่านการตรวจสอบแล้วออกมา (Safe Data)
    const { title, description, price, stock, category, image } = validation.data;

    const client = await clientPromise;
    const db = client.db();

    const newProduct = {
      title,
      description: description || "",
      price, // เป็น Number แน่นอนแล้ว
      stock, // เป็น Integer แน่นอนแล้ว
      category: category || "General",
      image: image || null, // บันทึกเป็น null ถ้าไม่มีรูป
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ message: "Product created", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error(error); // log error ดูใน server console ได้
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
import clientPromise from "@/lib/mongodb";

export async function getProducts() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const products = await db.collection("products").find({}).toArray();
    
    // แปลงข้อมูลให้เป็น JSON 100% (แก้ปัญหา _id ของ MongoDB)
    return products.map(product => ({
      ...product,
      _id: product._id.toString(),
      image: product.image || null,
      price: product.price || 0,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
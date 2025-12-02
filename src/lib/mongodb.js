// lib/mongodb.js
import { MongoClient } from "mongodb"

// ตรวจสอบว่ามีค่า Connection String หรือยัง
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  // ในโหมด Development เราจะฝากตัวแปร client ไว้ที่ global 
  // เพื่อกันไม่ให้มันต่อ Database ใหม่ทุกครั้งที่เราแก้โค้ดและ Save (Hot Reload)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // ในโหมด Production (ของจริง) สร้าง Connection ปกติ
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// ส่งออกตัว Promise นี้ไปให้ NextAuth ใช้งาน
export default clientPromise
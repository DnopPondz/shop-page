"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // ใช้สำหรับ Auto Login
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  // Step 1: Register, Step 2: Verify OTP
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // จัดการการพิมพ์ข้อมูล
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: ส่งข้อมูลสมัคร
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน");
        setLoading(false);
        return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setStep(2); // ไปหน้า OTP
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  // STEP 2: ยืนยัน OTP และ Auto Login
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. ยิง API ยืนยัน OTP
    const res = await fetch("/api/register/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    if (res.ok) {
      // 2. ถ้ายืนยันผ่าน -> ทำการ Login อัตโนมัติทันที
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password, // ใช้ password ที่เพิ่งกรอกไป
        redirect: false,
      });

      if (loginRes.ok) {
        router.push("/"); // ไปหน้าแรก
      } else {
        router.push("/login"); // ถ้า auto login พลาด ให้ไปหน้า login ปกติ
      }

    } else {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md">
        
        {step === 1 ? (
          // --- ฟอร์มสมัครสมาชิก ---
          <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">สร้างบัญชีใหม่</h1>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="ชื่อ" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
                <input name="lastName" placeholder="นามสกุล" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
              </div>
              <input name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
              <input type="email" name="email" placeholder="อีเมล" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
              <input type="password" name="password" placeholder="รหัสผ่าน" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
              <input type="password" name="confirmPassword" placeholder="ยืนยันรหัสผ่าน" onChange={handleChange} className="border p-3 rounded-lg w-full bg-gray-50" required />
              
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg disabled:bg-gray-400">
                {loading ? "กำลังส่งข้อมูล..." : "สมัครสมาชิก"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
                มีบัญชีอยู่แล้ว? <Link href="/login" className="text-indigo-600 font-bold hover:underline">เข้าสู่ระบบ</Link>
            </p>
          </>
        ) : (
          // --- ฟอร์มกรอก OTP ---
          <>
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">ยืนยันอีเมล</h1>
            <p className="text-center text-gray-500 mb-6 text-sm">เราได้ส่งรหัส OTP ไปที่ {formData.email}</p>
            
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

            <form onSubmit={handleVerify} className="space-y-6">
              <input 
                type="text" 
                placeholder="กรอกรหัส OTP 6 หลัก" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-2 border-indigo-100 p-4 rounded-xl w-full text-center text-2xl tracking-widest font-bold focus:border-indigo-500 outline-none" 
                maxLength={6}
                required 
              />
              
              <button type="submit" disabled={loading} className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg disabled:bg-gray-400">
                {loading ? "กำลังตรวจสอบ..." : "ยืนยันรหัส OTP"}
              </button>
            </form>
            <button onClick={() => setStep(1)} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-800">
                กลับไปแก้ไขข้อมูล
            </button>
          </>
        )}

      </div>
    </div>
  );
}
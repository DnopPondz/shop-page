"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // ไม่ให้ redirect อัตโนมัติ เพื่อเช็ค error ก่อน
    });

    if (res.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/"); // Login ผ่านแล้วไปหน้าแรก
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ</h1>

        {error && <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">{error}</div>}

        {/* ฟอร์ม Login แบบปกติ */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="อีเมล"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
            Login
          </button>
        </form>

        <div className="text-center text-sm mb-4">
          ยังไม่มีบัญชี? <Link href="/register" className="text-blue-500 hover:underline">สมัครสมาชิกที่นี่</Link>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">หรือ</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Buttons (ของเดิม) */}
        <div className="flex flex-col gap-3 mt-4">
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 text-sm">
            Login with Google
          </button>
          <button onClick={() => signIn("facebook", { callbackUrl: "/" })} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm">
            Login with Facebook
          </button>
           {/* Line / Apple Buttons ... */}
        </div>
      </div>
    </div>
  );
}
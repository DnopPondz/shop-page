import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Prompt } from "next/font/google"; // 1. นำเข้าฟอนต์

// 2. ตั้งค่าฟอนต์
const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata = {
  title: "My Modern Shop",
  description: "E-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 3. เรียกใช้ className ของฟอนต์ */}
      <body className={`${prompt.className} bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white`}>
        <AnnouncementBar />
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
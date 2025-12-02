import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar"; // 1. นำเข้า Navbar มาไว้ที่นี่
import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata = {
  title: "My Modern Shop",
  description: "E-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50"> {/* ใส่สีพื้นหลังโทนเทาอ่อน เพื่อความสบายตา */}
        <AnnouncementBar />
        <Providers>
          
          {/* 2. วาง Navbar ไว้ภายใน Providers เพื่อให้เข้าถึง Session/Cart ได้ */}
          {/* และวางไว้นอก <main> เพื่อให้มันลอยอยู่ด้านบนสุดตลอดเวลา */}
          <Navbar /> 
          
          {/* 3. ส่วนเนื้อหาเว็บ (children) */}
          {/* pt-24: เว้นระยะขอบบนเพื่อให้เนื้อหาไม่ถูก Navbar บัง */}
          {/* pb-10: เว้นระยะขอบล่างให้ดูไม่ชิดเกินไป */}
          {/* min-h-screen: ดันให้พื้นหลังเต็มจอเสมอแม้เนื้อหาน้อย */}
          <main className="pb-10 min-h-screen">
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}
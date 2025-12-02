"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 1. Protection: เช็คว่าเป็น Admin จริงไหม
  if (status === "loading") return <div className="p-10">Loading...</div>;
  if (!session || session.user.role !== "admin") {
    redirect("/"); // ถ้าไม่ใช่ Admin ดีดกลับหน้าแรก
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Products", href: "/admin/products", icon: "🏷️" },
    { name: "Marketing & Codes", href: "/admin/marketing", icon: "📢" },
    { name: "Users", href: "/admin/users", icon: "👥" }, // (ถ้าจะทำหน้า Users เพิ่ม)
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-extrabold text-indigo-600">ADMIN PANEL</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
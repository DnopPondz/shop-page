"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, openCart } = useCart();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- เพิ่มโค้ดส่วนนี้ ---
  // ถ้า URL ขึ้นต้นด้วย /admin ให้ซ่อน Navbar ไปเลย
  if (pathname.startsWith("/admin")) {
    return null; 
  }
  // ---------------------

  const isAuthPage = ["/login", "/register"].includes(pathname);
  const formatName = (fullName) => fullName ? fullName.split(" ")[0] : "User";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
        ? "bg-white/80 backdrop-blur-md slate-200/50 py-3 shadow-sm" 
        : "bg-transparent py-5"
    }`}>
      {/* ... (โค้ดส่วนที่เหลือข้างในเหมือนเดิม) ... */}
      <div className="container mx-auto px-6 flex justify-between items-center">
         <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transform group-hover:rotate-12 transition">M</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MY SHOP.</span>
        </Link>

        {/* Center Menu */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
            <Link href="/" className={`px-5 py-2 rounded-full text-sm font-medium transition ${pathname === '/' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
            </Link>
            <Link href="/products" className={`px-5 py-2 rounded-full text-sm font-medium transition ${pathname === '/products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              Shop
            </Link>
          </div>
        )}

        {/* Right Menu */}
        <div className="flex items-center gap-3">
          {!isAuthPage && (
            <>
              <button 
                onClick={openCart} 
                className="relative p-2.5 rounded-full hover:bg-slate-100 transition text-slate-700 border border-transparent hover:border-slate-200"
              >
                🛒
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {session ? (
                <div className="relative group pl-2">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{formatName(session.user.name)}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{session.user.role || "Member"}</p>
                    </div>
                    <div className="relative w-10 h-10 ring-2 ring-indigo-100 rounded-full overflow-hidden">
                        <Image 
                            src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                  </div>
                  
                  {/* Dropdown */}
                  <div className="absolute top-full right-0 pt-3 w-56 hidden group-hover:block">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5 p-1">
                        <Link href="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">
                            🛍️ My Orders
                        </Link>
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">
                            ⚙️ Settings
                        </Link>
                        {session.user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition">
                            📊 Admin Panel
                          </Link>
                        )}
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition">
                            🚪 Sign Out
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-600 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5">
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
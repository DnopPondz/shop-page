"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, openCart } = useCart();
  const pathname = usePathname();

  const isAuthPage = ["/login", "/register"].includes(pathname);

  const formatName = (fullName) => {
    if (!fullName) return "User";
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0];
    const firstName = names[0];
    const lastNameInitial = names[names.length - 1][0]; 
    return `${firstName} ${lastNameInitial.toUpperCase()}.`;
  };

  return (
    // --- FIX: เปลี่ยน fixed -> sticky ---
    <nav className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 1. Logo */}
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
          MY SHOP.
        </Link>

        {/* 2. Menu Center */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition py-2">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition py-2">
              Shop
            </Link>
          </div>
        )}

        {/* 3. Right Side */}
        <div className="flex items-center gap-4">
          
          {isAuthPage ? (
            <Link href="/login" className="bg-black text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-800 transition">
              Login
            </Link>
          ) : (
            <>
              {/* ปุ่ม Cart */}
              <button 
                onClick={openCart} 
                className="relative group p-2 hover:bg-gray-100 rounded-full transition mr-2"
              >
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* ส่วน User Profile */}
              {session ? (
                <div className="relative group flex items-center gap-3 cursor-pointer pb-2">
                  
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-700">
                        {formatName(session.user.name)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {session.user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>

                  <img 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                    className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm group-hover:border-indigo-400 transition" 
                    alt="Profile"
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 pt-2 w-56 hidden group-hover:block">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 md:hidden"> 
                          <p className="text-sm font-bold text-gray-800 truncate">{session.user.name}</p>
                        </div>

                        <Link href="/history" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                          <span>🛍️</span> My Orders
                        </Link>
                        
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                          <span>✏️</span> Edit Profile
                        </Link>
                        
                        {session.user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                            <span>📦</span> Admin Dashboard
                          </Link>
                        )}

                        <button 
                          onClick={() => signOut({ callbackUrl: '/login' })} 
                          className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-100"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="bg-black text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-800 hover:shadow-xl transition transform hover:-translate-y-0.5">
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
import { getProducts } from "@/lib/data";
import ProductList from "@/components/ProductList";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - ดีไซน์ใหม่ */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* พื้นหลังตกแต่ง (Background Elements) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100 shadow-sm">
            🚀 New Collection 2024
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Discover the <br/> 
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Extraordinary.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-light">
            ยกระดับไลฟ์สไตล์ของคุณด้วยสินค้าคุณภาพพรีเมียม ดีไซน์ล้ำสมัย <br className="hidden md:block"/>ส่งตรงถึงหน้าบ้านคุณด้วยบริการที่รวดเร็วที่สุด
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl shadow-indigo-200 hover:bg-slate-800 hover:scale-105 transition duration-300">
              Shop Now
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition duration-300">
              View Catalog
            </button>
          </div>
        </div>
      </section>

      {/* ส่งข้อมูลไปที่ Client Component */}
      <ProductList initialProducts={products} />
    </div>
  );
}
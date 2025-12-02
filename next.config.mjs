/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // อนุญาตทุกโดเมน (สำหรับ Dev) หรือระบุเฉพาะเช่น ui-avatars.com
      },
    ],
  },
};

export default nextConfig;
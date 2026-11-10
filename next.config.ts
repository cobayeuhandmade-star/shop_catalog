import type { NextConfig } from "next";

const securityHeaders = [
  // Chống clickjacking (đặc biệt quan trọng với trang admin)
  { key: "X-Frame-Options", value: "DENY" },
  // Không cho trình duyệt đoán MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Giới hạn thông tin referrer gửi sang site khác
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tắt các quyền không dùng tới
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.cobayeuhandmade.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: 'https://shopapp-online.site',
    // NEXT_PUBLIC_API_URL: 'https://nest-ecom-gw15.onrender.com/auth/register'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qr.sepay.vn",
      },
      {
        protocol: "https",
        hostname: "ecom-nest1.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToastContainer } from "react-toastify";
import AuthSection from "@/components/AuthSection";
import { Providers } from "./providers";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Shop Giày Chính Hãng | Nike, Adidas, Puma",
  description:
    "Cửa hàng giày chính hãng với nhiều mẫu Nike, Adidas, Puma. Giá tốt, giao hàng toàn quốc.",

  openGraph: {
    title: "Shop Giày Chính Hãng | Nike, Adidas, Puma",
    description:
      "Cửa hàng giày chính hãng với nhiều mẫu Nike, Adidas, Puma. Giá tốt, giao hàng toàn quốc.",
    type: "website",
    images: [
      {
        url: "/shopviet.png",
        width: 1200,
        height: 630,
        alt: "ShopViet Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Giày Chính Hãng",
    description: "Nike, Adidas, Puma giá tốt",
    images: ["/shopviet.png"],
  },

  icons: {
    icon: [
      {
        url: "/shopviet.png",
        type: "image/png",
      },
    ],
    shortcut: "/shopviet.png",
    apple: "/shopviet.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <Providers>
          <header className="fixed top-0 left-0 w-full bg-[#e0f7fa] shadow-md z-50">
            <div className="grid grid-cols-12 gap-4 items-end container-layout py-2">
              <div className="flex items-center space-x-6 col-span-2">
                <Link href='/' className="">
                  <Image src="/shopviet.png" alt="MyShop Logo" width={100} height={120} />
                </Link>
              </div>

              {/* SEARCH */}
              <div className="col-span-8 flex justify-center pn-3 pb-2">
                <form action="/" method="GET" className="relative w-full max-w-lg">
                  <Input
                    name="name"
                    placeholder="Tìm kiếm sản phẩm"
                    className="pr-10 bg-white"
                  />

                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>

              <div className="col-span-2 justify-self-end flex items-center gap-4">
                {/* CART */}
                <div className="relative">
                  <Button variant='ghost' size='icon' className="relative">
                    <ShoppingCart className="h-10 w-5 text-red-600" />
                    <Badge className="absolute top-2 right-2 px-1.5 py-0.5 text-xs">1</Badge>
                  </Button>
                  {/* <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg">
                  <div className="p-3 text-sm text-muted-foreground border-b">
                    Sản phẩm mới thêm
                  </div>
                  <ul className="max-h-60 overflow-auto">
                    <li
                      // key={item.id}
                      className="flex items-center p-3 border-b last:border-none"
                    >
                      <img
                        src={'l'}
                        alt={'l'}
                        className="w-12 h-12 object-cover mr-3 rounded"
                      />

                      <div className="flex-1 text-sm overflow-hidden">
                        <div className="font-medium truncate">
                          a
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          a
                        </div>
                      </div>

                      <span className="text-red-600 text-sm ml-2">
                        ₫9
                      </span>
                    </li>
                  </ul>
                  <div className="p-3 text-center">
                    <Button className="w-full bg-orange-500 hover:bg-amber-600 cursor-pointer">Xem giỏ hàng</Button>
                  </div>
                </div> */}
                </div>

                {/* AUTH */}
                <AuthSection></AuthSection>
              </div>
            </div>
          </header>
          {children}
        </Providers>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Star } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

import type { Metadata } from "next";
import PriceFilter from "@/components/PriceFilter";
import CategoryFilter from "@/components/CategoryFilter";
import ProductSortBar from "@/components/SortProductList";


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

export default async function Home({
  searchParams,
}: {
  searchParams: {
    page?: string
    minPrice?: string
    maxPrice?: string
    brandIds?: string
    categories?: string
    name?: string
  }
}) {
  const {page, minPrice, maxPrice, brandIds, categories, name} = await searchParams
  const query = new URLSearchParams()

  if (page) query.set("page", page)
  if (minPrice) query.set("minPrice", minPrice)
  if (maxPrice) query.set("maxPrice", maxPrice)
  if (brandIds) query.set("brandIds", brandIds)
  if (categories) query.set("categories", categories)
  if (name) query.set("name", name)
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${query.toString()}`, {
    cache: 'no-cache'
  })

  // const { data: products }: { data: Product[] } = await data.json()
  const res = await data.json()
  const {
  data: products,
  page: currentPage,
  totalPages,
  limit,
  totalItems
}: {data: Product[], page: number, totalPages: number, limit: number, totalItems: number} = res
  const categoryRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/categories?parentCategoryId=1`,
  {
    cache: "force-cache",
  }
)

const { data: categoriesData } = await categoryRes.json()
  return (
    <>
    <div className="container mx-auto px-4 mt-20">
      <h1 className="text-2xl font-semibold text-center mb-8">Danh sách sản phẩm</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4 uppercase flex items-center">
              <Filter className="w-4 h-4 mr-2 text-red-600" />Bộ lọc tìm kiếm
            </h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <div className="space-y-2">
                {/* <div className="flex items-center space-x-2">
                  <Checkbox />
                  <label className="text-sm">laptop</label>
                </div> */}
                <CategoryFilter categories={categoriesData}></CategoryFilter>
              </div>
            </div>
            {/* BRAND */}
            {/* <div className="border-t pt-2">
              <h3 className="font-semibold mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <label className="text-sm">
                    samsum
                  </label>
                </div>
              </div>
            </div> */}
            {/* PRICE */}
           <PriceFilter></PriceFilter>

            {/* RATING */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Đánh giá</h3>

              <div className="space-y-2">

                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-500">trở lên</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-500">trở lên</span>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <ProductSortBar pageSize={currentPage}></ProductSortBar>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => <ProductCard key={item.id} id={item.id} virtualPrice={item.virtualPrice} image={"/public/icon"} name={item.name} basePrice={item.basePrice}></ProductCard>)}
          </div>

          <div className="flex justify-center mt-10 space-x-2">
            <Button variant='outline'>Previous</Button>
            <span className="px-4 py-2 text-sm">
              1
            </span>

            <Button
              variant="outline"

            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

import { Product } from "@/types/product"
import Image from "next/image"
import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import dynamic from "next/dynamic"
import ProductDetail from "./ProductDetail"

// ===== UTILS =====
function slugify(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

// ===== FETCH =====
async function getProduct(id: string): Promise<Product> {
  if (!id) throw new Error("ID undefined ❌")

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    {
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    return notFound()
  }

  return res.json()
}

// ===== SEO =====
export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; id: string }>
}): Promise<Metadata> {

  const { id, product } = await params // ✅ NEXT 15 FIX

  if (!id) {
    return { title: "Product" }
  }

  try {
    const data = await getProduct(id)

    return {
      metadataBase: new URL("http://localhost:3000"), // dev

      title: `${data.name} | ${data.brand?.name} - Demo Shop`,
      description: `${data.name} chính hãng ${data.brand?.name
        }, giá tốt, giao nhanh toàn quốc`,

      openGraph: {
        title: data.name,
        description: data.name,
        images: [data.images?.[0] || "/image.jpg"],
      },

      twitter: {
        card: "summary_large_image",
        title: data.name,
      },

      alternates: {
        canonical: `https://yourdomain.com/product/${product}/${id}`,
      },
    }
  } catch {
    return { title: "Product" }
  }
}

// ===== PAGE =====
export default async function Page({
  params,
}: {
  params: Promise<{ product: string; id: string }>
}) {

  const { id, product } = await params // ✅ NEXT 15 FIX

  if (!id) return notFound()

  const data = await getProduct(id)

  // ===== REDIRECT SLUG =====
  const correctSlug = slugify(data.name)

  if (product !== correctSlug) {
    redirect(`/product/${correctSlug}/${data.id}`)
  }

  // ===== IMAGE =====
  const image = data.images?.[0] || "/image.jpg"

  // ===== JSON-LD =====
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    image: image,
    brand: {
      "@type": "Brand",
      name: data.brand?.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: data.basePrice,
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-32 px-20">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* IMAGE */}
      <div>
        <Image
          src={image}
          alt={data.name}
          width={400}
          height={400}
          className="rounded-lg border object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />

        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src={image}
              alt="thumb"
              width={80}
              height={80}
              className="rounded-md border hover:opacity-80"
            />
          ))}
        </div>
      </div>

      {/* DETAIL */}
      <ProductDetail product={data} />
    </div>
  )
}
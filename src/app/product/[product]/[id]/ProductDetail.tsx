"use client"
import { handleApiError } from '@/lib/handleApiError'
import { Button } from '@/components/ui/button'
import { Product, SKU } from '@/types/product'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { cartApi } from '@/apiRequests/cartApi'

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()

  const defaultSkus = product?.skus?.[0]
  const [selected, setSelected] = useState<string[]>(
    defaultSkus ? defaultSkus.value.split("-") : []
  )
  const [quantity, setQuantity] = useState(1)

  const skuMap = useMemo(() => {
    const map = new Map<string, SKU>()
    product.skus.forEach((sku) => {
      map.set(sku.value, sku)
    })
    return map
  }, [product])

  const currentSku: SKU | undefined = skuMap.get(selected.join("-"))

  const increase = () => {
    if (!currentSku) return
    if (quantity < currentSku.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!currentSku) return

    if (currentSku.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng")
      return
    }

    try {
      await cartApi.addToCart({
      skuId: currentSku.id,
      quantity,
    })
      toast.success("Đã thêm vào giỏ hàng")

    } catch (error: any) {
        console.log("errr", error)
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập")
        // router.push("/login")
        return
      }

      // 🔥 CASE 2: lỗi khác
      handleApiError(error)
    }
  }

  const handleBuyNow = async () => {
  if (!currentSku) return

  if (currentSku.stock <= 0) {
    toast.error("Sản phẩm đã hết hàng")
    return
  }

  try {
    // 1. thêm vào cart
    await cartApi.addToCart({
      skuId: currentSku.id,
      quantity,
    })

    // 2. chuyển sang cart
    router.push("/cart")

  } catch (error: any) {
    // 🔥 chưa login / refresh fail
    if (error.status === 401) {
      toast.error("Vui lòng đăng nhập")
      router.push("/login")
      return
    }

    handleApiError(error)
  }
}

  if (!currentSku) return null

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>
        {product.name}
      </h2>

      {/* price */}
      <div className='flex items-center gap-4 mb-6'>
        <p className='text-red-600 font-bold text-3xl'>
          {Number(currentSku.price).toLocaleString()}đ
        </p>
        <p className='text-gray-400 line-through text-lg'>
          {Number(product.virtualPrice).toLocaleString()}đ
        </p>
      </div>

      <div className='mb-4 font-semibold text-xl'>Phân loại</div>

      {product.variants?.map((variant, variantIndex) => (
        <div key={variant.value} className='mb-6'>
          <h3 className='font-semibold mb-3'>{variant.value}</h3>

          <div className='flex flex-wrap gap-3'>
            {variant.options.map((option, index) => {
              const active = selected[variantIndex] === option

              return (
                <Button
                  key={index}
                  onClick={() => {
                    const next = [...selected]
                    next[variantIndex] = option
                    setSelected(next)
                  }}
                  className={`font-normal border
                    ${
                      active
                        ? "border-red-600 text-red-600 bg-orange-500/70"
                        : "border-orange-500/70 bg-amber-50 text-red-500"
                    }`}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        </div>
      ))}

      <div className='flex items-center gap-4 mb-6'>
        <h3 className='text-lg font-semibold'>Số lượng</h3>

        <div className='flex items-center border rounded-lg overflow-hidden'>
          <Button variant='ghost' size='icon' onClick={decrease}>
            <Minus className='w-4 h-4' />
          </Button>

          <div className='w-12 text-center font-medium'>
            {quantity}
          </div>

          <Button variant='ghost' size='icon' onClick={increase}>
            <Plus className='w-4 h-4' />
          </Button>
        </div>

        <div>
          {currentSku.stock <= 0 ? (
            <p className="text-red-500 font-semibold">Hết hàng</p>
          ) : (
            <p className="text-gray-500">
              Số lượng còn lại: {currentSku.stock}
            </p>
          )}
        </div>
      </div>

      <div className='flex gap-4'>
        <Button
          className='bg-orange-400/40 text-red-500 border border-orange-400 hover:bg-orange-500/70'
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>

        <Button onClick={handleBuyNow} className='bg-red-600 hover:bg-red-700'>
          Mua ngay
        </Button>
      </div>
    </div>
  )
}
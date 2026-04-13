"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

type PriceFormValues = {
  minPrice: string
  maxPrice: string
}

export default function PriceFilter() {
  const router = useRouter()
  const params = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceFormValues>({
    defaultValues: {
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
    },
  })

  const onSubmit = (data: PriceFormValues) => {
    const query = new URLSearchParams(params.toString())

    query.set("minPrice", data.minPrice)
    query.set("maxPrice", data.maxPrice)

    query.delete("page")

    router.push(`/?${query.toString()}`)
  }

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold mb-3">Khoảng giá</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-2">
          <input
            type="number" // 🔥 FIX
            placeholder="Từ"
            className="w-full border rounded px-2 py-1 text-sm"
            {...register("minPrice", {
              required: "Nhập giá tối thiểu",
              min: {
                value: 0,
                message: ">= 0",
              },
            })}
          />

          <span>-</span>

          <input
            type="number" // 🔥 FIX
            placeholder="Đến"
            className="w-full border rounded px-2 py-1 text-sm"
            {...register("maxPrice", {
              required: "Nhập giá tối đa",
              min: {
                value: 0,
                message: ">= 0",
              },
              validate: (value, formValues) => {
                if (Number(value) < Number(formValues.minPrice)) {
                  return "Max phải >= Min"
                }
                return true
              },
            })}
          />
        </div>

        {/* ERROR */}
        <p className="text-red-500 text-sm mt-1">
          {errors.minPrice?.message || errors.maxPrice?.message}
        </p>

        <button
          type="submit"
          className="mt-2 w-full bg-red-600 text-white text-sm py-1 rounded"
        >
          Áp dụng
        </button>
      </form>
    </div>
  )
}
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"

type Category = {
    id: number
    name: string
}

export default function CategoryFilter({
    categories,
}: {
    categories: Category[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const current = searchParams.get("categories")
    const selected = current ? Number(current) : null

    const toggle = (id: number) => {
        const params = new URLSearchParams(searchParams.toString())

        if (selected === id) {
            // bỏ chọn
            params.delete("categories")
        } else {
            // chọn mới (chỉ 1)
            params.set("categories", String(id))
        }

        params.delete("page")

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="space-y-2">
            {categories?.map((item) => (
                <label
                    key={item.id}
                    htmlFor={`category-${item.id}`}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <Checkbox
                        id={`category-${item.id}`}
                        checked={selected === item.id}
                        onCheckedChange={() => toggle(item.id)}
                         className="border-black/60 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white h-5 w-5"
                    />
                    <span className="text-sm">{item.name}</span>
                </label>
            ))}
        </div>
    )
}
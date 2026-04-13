'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SortBy = {
  createdAt: 'createdAt',
  price: 'price',
  sale: 'sale'
}

const OrderBy = {
  asc: 'asc',
  desc: 'desc'
}

export default function ProductSortBar({ pageSize }: { pageSize: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || 1)

  const sortBy = searchParams.get('sortBy') || SortBy.createdAt
  const orderBy = searchParams.get('orderBy') || OrderBy.desc

  const isActive = (value: string) => sortBy === value

  const pushQuery = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`/?${params.toString()}`)
  }

  const handleSort = (value: string) => {
    pushQuery({
      sortBy: value,
      orderBy: OrderBy.desc, // default
      page: 1
    })
  }

  const handlePriceOrder = (value: string) => {
    pushQuery({
      sortBy: SortBy.price,
      orderBy: value,
      page: 1
    })
  }

  return (
    <div className="bg-gray-300/40 py-4 px-3">
      <div className="flex flex-wrap items-center justify-end gap-4">

        <div className="flex flex-wrap items-center gap-2">
          <div>Sắp xếp theo</div>

          {/* Phổ biến (view → backend chưa có thì map tạm createdAt) */}
          <button
            onClick={() => handleSort(SortBy.createdAt)}
            className={`h-8 px-4 ${
              isActive(SortBy.createdAt)
                ? 'bg-orange-500 text-white hover:bg-orange-500/80'
                : 'bg-white'
            }`}
          >
            Phổ biến
          </button>

          {/* Mới nhất */}
          <button
            onClick={() => handleSort(SortBy.createdAt)}
            className={`h-8 px-4 ${
              isActive(SortBy.createdAt)
                ? 'bg-orange-500 text-white hover:bg-orange-500/80'
                : 'bg-white'
            }`}
          >
            Mới nhất
          </button>

          {/* Bán chạy */}
          <button
            onClick={() => handleSort(SortBy.sale)}
            className={`h-8 px-4 ${
              isActive(SortBy.sale)
                ? 'bg-orange-500 text-white hover:bg-orange-500/80'
                : 'bg-white'
            }`}
          >
            Bán chạy
          </button>

          {/* Giá */}
          <select
            value={sortBy === SortBy.price ? orderBy : ''}
            onChange={(e) => handlePriceOrder(e.target.value)}
            className="h-8 px-4 bg-white"
          >
            <option value="" disabled>
              Giá
            </option>
            <option value={OrderBy.asc}>Giá: Thấp đến cao</option>
            <option value={OrderBy.desc}>Giá: Cao đến thấp</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center">
          <div>
            <span className="text-orange">{page}</span>
            <span>/{pageSize}</span>
          </div>

          <div className="ml-2 flex">
            <button
              disabled={page <= 1}
              onClick={() => pushQuery({ page: page - 1 })}
              className={`w-9 h-8 bg-white ${
                page <= 1 ? 'opacity-50' : ''
              }`}
            >
              ◀
            </button>

            <button
              disabled={page >= pageSize}
              onClick={() => pushQuery({ page: page + 1 })}
              className={`w-9 h-8 bg-white ${
                page >= pageSize ? 'opacity-50' : ''
              }`}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
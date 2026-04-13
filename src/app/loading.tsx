import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-18">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Danh sách sản phẩm
      </h1>

      <div className="grid grid-cols-12 gap-6">

        {/* FILTER SKELETON */}
        <div className="col-span-12 md:col-span-3">
          <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4 animate-pulse">
            
            <div className="h-5 w-40 bg-gray-200 rounded"></div>

            <div className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-10 gap-3 animate-pulse">
            <div className="h-9 w-24 bg-gray-200 rounded"></div>
            <div className="h-9 w-9 bg-gray-200 rounded"></div>
            <div className="h-9 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
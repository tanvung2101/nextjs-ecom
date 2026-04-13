export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg bg-white p-3 space-y-3 animate-pulse">
      {/* IMAGE */}
      <div className="w-full aspect-square bg-gray-200 rounded-md"></div>

      {/* PRODUCT NAME */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
      </div>

      {/* BUTTON / BADGE */}
      <div className="h-8 w-full bg-gray-200 rounded"></div>
    </div>
  );
}
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-md ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}

export function SkeletonFacilityCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-3.5 w-full max-w-32" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonStat() {
  return (
    <div className="bg-white rounded-xl border-t-4 border-gray-100 shadow-sm p-4">
      <Skeleton className="w-9 h-9 rounded-lg mb-3" />
      <Skeleton className="h-6 w-10 mb-1.5" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

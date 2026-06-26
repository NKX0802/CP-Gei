import Link from 'next/link'
import { Heart, Users, ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

const TYPE_COLORS = {
  room:      'bg-blue-100 text-blue-700',
  court:     'bg-orange-100 text-orange-700',
  equipment: 'bg-purple-100 text-purple-700',
}

export default function FacilityCard({ facility, isFavourited = false, onToggleFavourite }) {
  const typeColor = TYPE_COLORS[facility.facility_type] || 'bg-gray-100 text-gray-700'

  function handleFavourite(e) {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleFavourite) onToggleFavourite(facility.facility_id)
  }

  return (
    <Link href={`/facilities/${facility.facility_id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-4/3">
          <img
            src={facility.facility_image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80'}
            alt={facility.facility_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

          {/* Favourite button */}
          <button
            onClick={handleFavourite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isFavourited
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-white/80 text-gray-400 hover:text-red-500'
            }`}
            aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart size={16} className={isFavourited ? 'fill-current' : ''} />
          </button>

          {/* Type chip + status badge overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${typeColor}`}>
              {facility.facility_type}
            </span>
            <StatusBadge status={facility.facility_status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-primary-700 transition-colors">
              {facility.facility_name}
            </h3>
            <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0 mt-0.5">
              <Users size={12} /> {facility.facility_capacity}
            </span>
          </div>

          {facility.facility_description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {facility.facility_description}
            </p>
          )}

          <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  )
}

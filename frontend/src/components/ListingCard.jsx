import React from 'react';
import { Star, Bed, Bath, Users, Flame, Sparkles, MapPin } from 'lucide-react';

export const ListingCard = ({ listing }) => {
  const isDeal = listing.predictedPrice && listing.price < listing.predictedPrice;
  const disc = isDeal ? Math.round(((listing.predictedPrice - listing.price) / listing.predictedPrice) * 100) : 0;

  return (
    <article className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden card-lift flex flex-col hover:border-white/[0.12]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02] shrink-0">
        <img src={listing.imageUrl} alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* Location badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[11px] font-semibold text-white/90">
          <MapPin className="w-3 h-3 text-orange-400" />{listing.neighbourhoodCleansed}
        </div>

        {/* Deal badge */}
        {isDeal && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center gap-1 shadow-lg shadow-rose-500/20">
            <Flame className="w-3 h-3" /> %{disc} Fırsat
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-amber-400 text-[11px] font-bold">
          <Star className="w-3 h-3 fill-amber-400" />
          {Number(listing.reviewScoresRating || 4.8).toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-wider">{listing.roomType}</span>

        <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors">
          {listing.name}
        </h3>

        <div className="flex items-center gap-3 text-[11px] text-white/25">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{listing.accommodates || 2}</span>
          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{listing.bedrooms || 1}</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{listing.bathrooms || 1}</span>
        </div>

        {listing.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {listing.amenities.slice(0,3).map((a,i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 text-[10px] border border-white/[0.04]">{a}</span>
            ))}
            {listing.amenities.length > 3 && <span className="text-[10px] text-white/20 px-1">+{listing.amenities.length-3}</span>}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white">₺{Number(listing.price).toLocaleString('tr-TR',{maximumFractionDigits:0})}</span>
              <span className="text-[11px] text-white/20">/ gece</span>
            </div>
            {listing.predictedPrice && (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-orange-400/70">
                <Sparkles className="w-2.5 h-2.5" /> Tahmini: ₺{Number(listing.predictedPrice).toLocaleString('tr-TR',{maximumFractionDigits:0})}
              </div>
            )}
          </div>
          <button className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-orange-500 border border-white/[0.08] hover:border-orange-400 text-white/70 hover:text-white transition-all">
            İncele
          </button>
        </div>
      </div>
    </article>
  );
};

import React from 'react';
import { Star, MapPin, Users, Bed, Bath, Sparkles, Flame, Check } from 'lucide-react';

export const ListingCard = ({ listing }) => {
  const isDeal = listing.predictedPrice && listing.price < listing.predictedPrice;
  const discountPercent = isDeal
    ? Math.round(((listing.predictedPrice - listing.price) / listing.predictedPrice) * 100)
    : 0;

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={listing.imageUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80"}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-brand-400" />
            <span>{listing.neighbourhoodCleansed}</span>
          </span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-900/70 backdrop-blur-md text-slate-300 border border-white/5">
            {listing.roomType}
          </span>
        </div>

        {/* AI Deal Badge */}
        {isDeal && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center space-x-1 animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>%{discountPercent} Fırsat</span>
            </span>
          </div>
        )}

        {/* Rating overlay at bottom right of image */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(listing.reviewScoresRating || 4.8).toFixed(2)}</span>
          <span className="text-slate-400 font-normal text-[10px]">({listing.numberOfReviews || 24})</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-brand-300 transition-colors" title={listing.name}>
            {listing.name}
          </h3>

          {/* Quick Specs */}
          <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2.5">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.accommodates || 2} Misafir</span>
            </span>
            <span className="flex items-center space-x-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.bedrooms || 1} Yatak O.</span>
            </span>
            <span className="flex items-center space-x-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.bathrooms || 1} Banyo</span>
            </span>
          </div>

          {/* Amenities Pills */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {listing.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/50">
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800/40 text-slate-400">
                  +{listing.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Evaluation Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-white tracking-tight">
                {Number(listing.price).toLocaleString('tr-TR')}
              </span>
              <span className="text-xs text-slate-400 font-medium">TL / gece</span>
            </div>

            {listing.predictedPrice && (
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>AI Değerleme: </span>
                <span className="font-semibold text-slate-300">
                  {Number(listing.predictedPrice).toLocaleString('tr-TR')} TL
                </span>
              </div>
            )}
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition-all border border-slate-700/80">
            Detay
          </button>
        </div>
      </div>
    </div>
  );
};

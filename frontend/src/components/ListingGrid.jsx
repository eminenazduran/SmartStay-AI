import React, { useState } from 'react';
import { ListingCard } from './ListingCard';
import { ChevronDown, Frown, LayoutGrid } from 'lucide-react';

export const ListingGrid = ({ listings }) => {
  const [sort, setSort] = useState('recommended');
  const sorted = [...listings].sort((a,b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating-desc') return (b.reviewScoresRating||0) - (a.reviewScoresRating||0);
    return (b.reviewScoresRating||0) - (a.reviewScoresRating||0);
  });

  if (!sorted.length) return (
    <div id="listings" className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
      <Frown className="w-10 h-10 text-white/10 mx-auto mb-4" />
      <p className="font-bold text-white text-sm">Sonuç bulunamadı</p>
      <p className="text-xs text-white/25 mt-1.5 max-w-xs mx-auto">Filtreleri değiştirip tekrar deneyin.</p>
    </div>
  );

  return (
    <section id="listings" className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-orange-400" />
          {listings.length} ilan bulundu
        </h2>
        <div className="relative">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-3 pr-7 py-2 text-[11px] font-medium text-white/50 focus:outline-none cursor-pointer appearance-none">
            <option value="recommended">En İyi Eşleşme</option>
            <option value="price-asc">Fiyat ↑</option>
            <option value="price-desc">Fiyat ↓</option>
            <option value="rating-desc">Puan ↓</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
};

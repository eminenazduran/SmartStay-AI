import React, { useState } from 'react';
import { ListingCard } from './ListingCard';
import { Sparkles, ArrowUpDown, Frown } from 'lucide-react';

export const ListingGrid = ({ listings }) => {
  const [sortBy, setSortBy] = useState('recommended');

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return (b.reviewScoresRating || 0) - (a.reviewScoresRating || 0);
    // 'recommended' - default sort
    return (b.reviewScoresRating || 0) - (a.reviewScoresRating || 0);
  });

  return (
    <section id="listings" className="space-y-6">
      {/* Grid Header & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Uygun Konaklama Seçenekleri</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {listings.length} İlan
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Yapay zeka dinamik fiyat analizi ve puan sıralamasına göre listelendi
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="recommended">En İyi Eşleşenler</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating-desc">Kullanıcı Puanı: En Yüksek</option>
          </select>
        </div>
      </div>

      {/* Grid Container */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
            <Frown className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Arama Kriterlerine Uygun İlan Bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Lütfen fiyat aralığını genişletmeyi veya farklı bir ilçe / oda tipi seçmeyi deneyiniz.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

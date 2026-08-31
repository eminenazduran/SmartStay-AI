import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchForm } from './components/SearchForm';
import { ListingGrid } from './components/ListingGrid';
import { MOCK_LISTINGS } from './data/mockListings';
import { Sparkles, Compass, ShieldCheck, Cpu, Database, Award } from 'lucide-react';

export function App() {
  const [filteredListings, setFilteredListings] = useState(MOCK_LISTINGS);
  const [currentFilters, setCurrentFilters] = useState({
    neighbourhood: '',
    roomType: '',
    minPrice: 0,
    maxPrice: 10000,
    accommodates: 1,
    amenities: []
  });

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);

    const result = MOCK_LISTINGS.filter((item) => {
      // 1. Neighbourhood filter
      if (filters.neighbourhood && item.neighbourhoodCleansed.toLowerCase() !== filters.neighbourhood.toLowerCase()) {
        return false;
      }

      // 2. Room Type filter
      if (filters.roomType && item.roomType !== filters.roomType) {
        return false;
      }

      // 3. Price Range filter
      if (item.price < filters.minPrice || item.price > filters.maxPrice) {
        return false;
      }

      // 4. Accommodates filter
      if (item.accommodates < filters.accommodates) {
        return false;
      }

      // 5. Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          item.amenities?.some((itemAmenity) => itemAmenity.toLowerCase().includes(amenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    setFilteredListings(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        {/* Background Gradients & Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-brand-600/15 via-primary-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-xl shadow-brand-500/5">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Yapay Zeka Destekli İstanbul Konaklama Platformu</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            En Doğru Fiyata, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Size Özel Konaklamayı
            </span> Keşfedin.
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Inside Airbnb açık verisi, <strong>XGBoost Dinamik Fiyat Regresyonu</strong> ve <strong>TF-IDF & Kosinüs Benzerliği Öneri Motoru</strong> ile ideal evi anında bulun.
          </p>

          {/* Key Metrics / Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="glass-card rounded-xl p-4 border border-slate-800/80 text-center">
              <p className="text-2xl font-black text-white">22.665+</p>
              <p className="text-xs text-slate-400 font-medium">İstanbul İlanı</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800/80 text-center">
              <p className="text-2xl font-black text-brand-400">%79.03</p>
              <p className="text-xs text-slate-400 font-medium">Model R² Skoru</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800/80 text-center">
              <p className="text-2xl font-black text-teal-300">~6 ms</p>
              <p className="text-xs text-slate-400 font-medium">AI Öneri Hızı</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800/80 text-center">
              <p className="text-2xl font-black text-emerald-400">4 Katman</p>
              <p className="text-xs text-slate-400 font-medium">.NET 10 API</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Search & Filter Component */}
        <SearchForm onFilterChange={handleFilterChange} initialFilters={currentFilters} />

        {/* Listing Cards Grid */}
        <ListingGrid listings={filteredListings} />
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">
          SmartStay AI © 2026 — Akıllı Konaklama Öneri & Dinamik Fiyat Değerleme Platformu
        </p>
        <p className="text-[11px] text-slate-600">
          FastAPI • Python XGBoost • ASP.NET Core 10 Web API • Entity Framework Core • React • Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;

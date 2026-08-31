import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ISTANBUL_NEIGHBOURHOODS, ROOM_TYPES, POPULAR_AMENITIES } from '../data/mockListings';

export const SearchForm = ({ onFilterChange, initialFilters }) => {
  const [neighbourhood, setNeighbourhood] = useState(initialFilters?.neighbourhood || 'Tümü');
  const [roomType, setRoomType] = useState(initialFilters?.roomType || 'all');
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || 10000);
  const [accommodates, setAccommodates] = useState(initialFilters?.accommodates || 1);
  const [selectedAmenities, setSelectedAmenities] = useState(initialFilters?.amenities || []);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onFilterChange({
      neighbourhood: neighbourhood === 'Tümü' ? '' : neighbourhood,
      roomType: roomType === 'all' ? '' : roomType,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      accommodates: Number(accommodates),
      amenities: selectedAmenities
    });
  };

  const handleReset = () => {
    setNeighbourhood('Tümü');
    setRoomType('all');
    setMinPrice(0);
    setMaxPrice(10000);
    setAccommodates(1);
    setSelectedAmenities([]);
    onFilterChange({
      neighbourhood: '',
      roomType: '',
      minPrice: 0,
      maxPrice: 10000,
      accommodates: 1,
      amenities: []
    });
  };

  const activeFiltersCount = (neighbourhood !== 'Tümü' ? 1 : 0) +
    (roomType !== 'all' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 10000 ? 1 : 0) +
    (accommodates > 1 ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Akıllı İlan Arama & Filtreleme</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {activeFiltersCount} Aktif
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">İstanbul içindeki 22.000+ konaklama ilanını filtreleyin</p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Filtreleri Sıfırla</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="space-y-6">
        {/* 1. Row: Location & Guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>İlçe / Bölge</span>
            </label>
            <div className="relative">
              <select
                value={neighbourhood}
                onChange={(e) => setNeighbourhood(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                {ISTANBUL_NEIGHBOURHOODS.map((item) => (
                  <option key={item} value={item} className="bg-slate-800 text-white">
                    {item === 'Tümü' ? 'Tüm İstanbul İlçeleri' : `${item}, İstanbul`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Guests Stepper */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              <span>Misafir Sayısı</span>
            </label>
            <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2">
              <span className="text-sm font-medium text-slate-200">
                {accommodates} {accommodates === 1 ? 'Kişi' : 'Kişi ve üzeri'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAccommodates(Math.max(1, accommodates - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                  disabled={accommodates <= 1}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setAccommodates(Math.min(16, accommodates + 1))}
                  className="w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Row: Room Type Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Oda Türü
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {ROOM_TYPES.map((rt) => {
              const isSelected = roomType === rt.id;
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setRoomType(rt.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                    isSelected
                      ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-md shadow-brand-500/10 font-bold'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {rt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Row: Price Range Sliders */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-brand-400" />
              <span>Gecelik Fiyat Aralığı</span>
            </span>
            <span className="font-mono font-bold text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
              {minPrice.toLocaleString('tr-TR')} TL — {maxPrice.toLocaleString('tr-TR')} TL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Min: {minPrice} TL</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Maks: {maxPrice} TL</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-400"
              />
            </div>
          </div>
        </div>

        {/* 4. Row: Amenities Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Popüler Olanaklar
            </label>
            <button
              type="button"
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              className="text-xs text-brand-400 hover:text-brand-300 underline"
            >
              {showAllAmenities ? 'Daha Az Göster' : 'Tümünü Gör'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
            {(showAllAmenities ? POPULAR_AMENITIES : POPULAR_AMENITIES.slice(0, 5)).map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs transition-all border text-left ${
                    isChecked
                      ? 'bg-brand-500/15 border-brand-500/60 text-brand-300 font-medium'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    isChecked ? 'bg-brand-500 border-brand-400 text-slate-900' : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-500 via-teal-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
          >
            <Search className="w-5 h-5 text-slate-950" />
            <span>Filtrelenmiş İlanları Getir</span>
          </button>
        </div>
      </form>
    </div>
  );
};

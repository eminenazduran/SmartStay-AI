import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, SlidersHorizontal, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { ISTANBUL_NEIGHBOURHOODS, ROOM_TYPES, POPULAR_AMENITIES } from '../data/mockListings';

export const SearchForm = ({ onFilterChange, initialFilters }) => {
  const [neighbourhood, setNeighbourhood] = useState(initialFilters?.neighbourhood || 'Tümü');
  const [roomType, setRoomType] = useState(initialFilters?.roomType || 'all');
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || 10000);
  const [accommodates, setAccommodates] = useState(initialFilters?.accommodates || 1);
  const [selectedAmenities, setSelectedAmenities] = useState(initialFilters?.amenities || []);

  const toggleAmenity = a =>
    setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const submit = e => {
    e?.preventDefault();
    onFilterChange({
      neighbourhood: neighbourhood === 'Tümü' ? '' : neighbourhood,
      roomType: roomType === 'all' ? '' : roomType,
      minPrice: Number(minPrice), maxPrice: Number(maxPrice),
      accommodates: Number(accommodates), amenities: selectedAmenities,
    });
  };

  const reset = () => {
    setNeighbourhood('Tümü'); setRoomType('all');
    setMinPrice(0); setMaxPrice(10000);
    setAccommodates(1); setSelectedAmenities([]);
    onFilterChange({ neighbourhood:'', roomType:'', minPrice:0, maxPrice:10000, accommodates:1, amenities:[] });
  };

  const cnt = (neighbourhood !== 'Tümü' ? 1 : 0) + (roomType !== 'all' ? 1 : 0) + (minPrice > 0 || maxPrice < 10000 ? 1 : 0) + (accommodates > 1 ? 1 : 0) + selectedAmenities.length;

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-orange-400" /> Konum
          </label>
          <div className="relative">
            <select value={neighbourhood} onChange={e => setNeighbourhood(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer">
              {ISTANBUL_NEIGHBOURHOODS.map(n => (
                <option key={n} value={n} className="bg-[#141418]">{n === 'Tümü' ? 'Tüm İstanbul' : n}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3 h-3 text-orange-400" /> Misafir
          </label>
          <div className="flex items-center justify-between input-field">
            <span className="text-sm text-white/70 font-medium">{accommodates} kişi</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAccommodates(Math.max(1, accommodates-1))} disabled={accommodates<=1}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center transition disabled:opacity-20">−</button>
              <button type="button" onClick={() => setAccommodates(Math.min(16, accommodates+1))}
                className="w-7 h-7 rounded-lg bg-orange-500/80 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center transition">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Room type */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Oda Türü</label>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map(rt => (
            <button key={rt.id} type="button" onClick={() => setRoomType(rt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                roomType === rt.id
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                  : 'bg-transparent border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60'
              }`}>{rt.label}</button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-orange-400" /> Gecelik Fiyat
          </span>
          <span className="font-mono font-bold text-orange-300 text-xs">
            ₺{minPrice.toLocaleString('tr-TR')} — ₺{maxPrice.toLocaleString('tr-TR')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-[10px] text-white/20 mb-1">Min</p><input type="range" min="0" max="5000" step="100" value={minPrice} onChange={e => setMinPrice(Math.min(+e.target.value, maxPrice-100))} className="w-full cursor-pointer" /></div>
          <div><p className="text-[10px] text-white/20 mb-1">Maks</p><input type="range" min="1000" max="15000" step="250" value={maxPrice} onChange={e => setMaxPrice(Math.max(+e.target.value, minPrice+100))} className="w-full cursor-pointer" /></div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Olanaklar</label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_AMENITIES.map(a => {
            const on = selectedAmenities.includes(a);
            return (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                  on ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' : 'bg-transparent border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.12]'
                }`}>
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition ${on ? 'bg-orange-500 border-orange-400' : 'border-white/15 bg-transparent'}`}>
                  {on && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {cnt > 0 && (
          <button type="button" onClick={reset} className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-white/30 hover:text-rose-400 bg-white/[0.03] border border-white/[0.05] hover:border-rose-500/20 transition-all">
            <RotateCcw className="w-3 h-3" /> Temizle
          </button>
        )}
        <button type="submit" className="btn-accent flex-1 py-3 rounded-xl text-sm">
          <Search className="w-4 h-4" /> İlanları Göster
        </button>
      </div>
    </form>
  );
};

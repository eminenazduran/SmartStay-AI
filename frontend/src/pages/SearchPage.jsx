import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchForm } from '../components/SearchForm';
import { ListingGrid } from '../components/ListingGrid';
import { MapView } from '../components/MapView';
import { MOCK_LISTINGS } from '../data/mockListings';
import { Map, LayoutGrid, Layers, ArrowLeft, SlidersHorizontal, X, Sparkles } from 'lucide-react';

const applyFilter = (source, f) => source.filter(item => {
  if (f.neighbourhood && item.neighbourhoodCleansed.toLowerCase() !== f.neighbourhood.toLowerCase()) return false;
  if (f.roomType && item.roomType !== f.roomType) return false;
  if (item.price < f.minPrice || item.price > f.maxPrice) return false;
  if (item.accommodates < f.accommodates) return false;
  if (f.amenities?.length && !f.amenities.every(a => item.amenities?.some(ia => ia.toLowerCase().includes(a.toLowerCase())))) return false;
  return true;
});

const INIT = { neighbourhood:'', roomType:'', minPrice:0, maxPrice:10000, accommodates:1, amenities:[] };

export const SearchPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const initNeighbourhood = sp.get('neighbourhood') || '';
  const initRoom = sp.get('roomType') || '';

  const [view, setView] = useState('both');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ ...INIT, neighbourhood: initNeighbourhood, roomType: initRoom });
  const [listings, setListings] = useState(applyFilter(MOCK_LISTINGS, { ...INIT, neighbourhood: initNeighbourhood, roomType: initRoom }));

  const handleFilter = f => { setFilters(f); setListings(applyFilter(MOCK_LISTINGS, f)); setShowFilter(false); };

  const cnt = (filters.neighbourhood ? 1 : 0) + (filters.roomType ? 1 : 0) + (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0) + (filters.accommodates > 1 ? 1 : 0) + (filters.amenities?.length || 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Subheader */}
      <div className="sticky top-16 z-40 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">
                İlan Arama
                {filters.neighbourhood && <span className="text-orange-400"> · {filters.neighbourhood}</span>}
                {filters.roomType && <span className="text-orange-400/70"> · {filters.roomType}</span>}
              </h1>
              <p className="text-[11px] text-white/25">{listings.length} sonuç</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                cnt > 0 ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70'
              }`}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtrele
              {cnt > 0 && <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">{cnt}</span>}
            </button>

            <div className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 gap-0.5">
              {[
                { id:'both', label:'Her İkisi', icon: Layers },
                { id:'map',  label:'Harita',    icon: Map },
                { id:'grid', label:'Liste',     icon: LayoutGrid },
              ].map(({id,label,icon:I}) => (
                <button key={id} onClick={() => setView(id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    view===id ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-white/30 hover:text-white/60'
                  }`}>
                  <I className="w-3.5 h-3.5" />
                  <span className={id==='both'?'hidden md:inline':''}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter drawer */}
      {showFilter && (
        <div className="z-40 border-b border-white/5 bg-[#0e0e14]/98">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-white">Filtrele & Ara</p>
              <button onClick={() => setShowFilter(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SearchForm onFilterChange={handleFilter} initialFilters={filters} />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 space-y-8">
        {(view==='both'||view==='map') && (
          <div id="map">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Map className="w-4 h-4 text-orange-400" /> Harita · {listings.length} konum
              </h2>
              <div className="hidden sm:flex items-center gap-4 text-[11px] text-white/20">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-orange-500/50" /> Standart</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500" /> 🔥 Fırsat</span>
              </div>
            </div>
            <MapView listings={listings} />
          </div>
        )}
        {(view==='both'||view==='grid') && <ListingGrid listings={listings} />}
      </main>

      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <p className="text-[11px] text-white/15">SmartStay © 2026</p>
      </footer>
    </div>
  );
};

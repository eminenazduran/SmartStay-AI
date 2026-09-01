import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_LISTINGS, filterListings, ISTANBUL_NEIGHBOURHOODS, ROOM_TYPES } from '../data/mockListings';
import { MapView } from '../components/MapView';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    neighbourhood: searchParams.get('neighbourhood') || '',
    roomType: searchParams.get('roomType') || '',
    minPrice: 0,
    maxPrice: 15000,
    accommodates: 1,
    amenities: []
  });

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [activeListings, setActiveListings] = useState([]);

  useEffect(() => {
    const neighbourhoodParam = searchParams.get('neighbourhood') || '';
    const roomTypeParam = searchParams.get('roomType') || '';
    const newFilters = {
      ...filters,
      neighbourhood: neighbourhoodParam,
      roomType: roomTypeParam
    };
    setFilters(newFilters);
    setActiveListings(filterListings(MOCK_LISTINGS, newFilters));
  }, [searchParams]);

  const handleFilterUpdate = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    setActiveListings(filterListings(MOCK_LISTINGS, updated));
  };

  return (
    <div className="flex-1 mt-16 flex flex-col md:flex-row h-[calc(100vh-64px)] w-full font-body-md overflow-hidden bg-[#fcf8fa]">
      {/* ── LEFT SIDE: Property List (40%) ────────────────────────────── */}
      <section className="w-full md:w-[40%] flex flex-col bg-[#ffffff] border-r border-[#c6c6cd]/30 z-10 shadow-lg md:shadow-none h-full">
        {/* Sticky Filter Bar */}
        <div className="bg-[#ffffff] p-4 sticky top-0 z-20 flex flex-wrap gap-2.5 items-center border-b border-[#c6c6cd]/30 shadow-sm">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="flex items-center gap-2 bg-[#f0edef] px-3.5 py-2 rounded-full border border-[#c6c6cd]/50 hover:border-[#76777d] hover:bg-[#e4e2e4] transition-all text-xs font-semibold text-[#1b1b1d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filtreler
          </button>

          <select
            value={filters.neighbourhood || 'all'}
            onChange={(e) => handleFilterUpdate('neighbourhood', e.target.value)}
            className="bg-[#f0edef] px-3 py-2 rounded-full border border-[#c6c6cd]/50 hover:border-[#76777d] text-xs font-semibold text-[#1b1b1d] appearance-none cursor-pointer pr-6 relative"
          >
            {ISTANBUL_NEIGHBOURHOODS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>

          <select
            value={filters.roomType || 'all'}
            onChange={(e) => handleFilterUpdate('roomType', e.target.value)}
            className="bg-[#f0edef] px-3 py-2 rounded-full border border-[#c6c6cd]/50 hover:border-[#76777d] text-xs font-semibold text-[#1b1b1d] appearance-none cursor-pointer pr-6"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.label}
              </option>
            ))}
          </select>

          <div className="ml-auto text-xs text-[#45464d] flex items-center gap-1 font-semibold">
            <span className="font-bold text-[#1b1b1d]">{activeListings.length}</span> sonuç
          </div>
        </div>

        {/* Filter Drawer Overlay */}
        {showFilterDrawer && (
          <div className="p-4 bg-[#f0edef] border-b border-[#c6c6cd] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1b1b1d]">Fiyat Aralığı (TL)</span>
              <button
                onClick={() => {
                  const resetF = { ...filters, neighbourhood: '', roomType: 'all', minPrice: 0, maxPrice: 15000 };
                  setFilters(resetF);
                  setActiveListings(MOCK_LISTINGS);
                }}
                className="text-[#4648d4] font-semibold hover:underline"
              >
                Sıfırla
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="10000"
                step="250"
                value={filters.maxPrice}
                onChange={(e) => handleFilterUpdate('maxPrice', Number(e.target.value))}
                className="w-full"
              />
              <span className="font-mono font-bold text-[#4648d4] shrink-0">
                Maks: ₺{filters.maxPrice}
              </span>
            </div>
          </div>
        )}

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-24 md:pb-6 bg-[#ffffff]">
          {activeListings.length > 0 ? (
            activeListings.map((listing) => {
              const isGreatValue = listing.aiBadgeType === 'great-value' || listing.price < 2000;

              return (
                <article
                  key={listing.id}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="bg-[#ffffff] rounded-2xl shadow-ambient border border-[#e2e8f0] overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                >
                  {/* AI Badge Overlay */}
                  <div
                    className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                      isGreatValue
                        ? 'bg-ai-purple-gradient text-white'
                        : 'bg-[#e4e2e4]/90 backdrop-blur-sm text-[#1b1b1d] border border-[#c6c6cd]/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isGreatValue ? 'psychology' : 'balance'}
                    </span>
                    {isGreatValue ? 'Harika Değer' : 'Fiyatı Normal'}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#45464d] hover:text-[#ba1a1a] hover:bg-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>

                  <div className="h-56 w-full relative bg-slate-100">
                    <img
                      src={listing.imageUrl}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1b1b1d] mb-1 line-clamp-1">
                          {listing.name}
                        </h3>
                        <p className="text-xs text-[#45464d] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {listing.districtName || listing.neighbourhoodCleansed}, İstanbul
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f0edef] px-2.5 py-1 rounded-lg text-[#1b1b1d] text-xs font-semibold border border-[#c6c6cd]/30 shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-[#dec29a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        {Number(listing.reviewScoresRating || 4.8).toFixed(1)}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-4 border-t border-[#c6c6cd]/30">
                      <div>
                        <p className="text-xs text-[#45464d] mb-0.5">Tahmini Gecelik</p>
                        <p className="text-xl font-extrabold text-[#1b1b1d]">
                          ₺{Number(listing.price).toLocaleString('tr-TR')}
                        </p>
                      </div>

                      {/* Sparkline Trend Chart Mockup */}
                      <div className="w-28 h-10 flex flex-col justify-end relative" title="30-Günlük Fiyat Trendi">
                        <span className={`text-[11px] absolute -top-5 right-0 font-bold px-1.5 py-0.5 rounded ${
                          isGreatValue ? 'text-[#4648d4] bg-[#e1e0ff]/50' : 'text-[#45464d] bg-[#f0edef]'
                        }`}>
                          {listing.trendPercent ? `${listing.trendPercent}% Trend` : 'Stabil'}
                        </span>
                        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 30" width="100%">
                          <path
                            d={isGreatValue ? "M0,25 L20,20 L40,28 L60,15 L80,18 L100,5" : "M0,15 L20,16 L40,14 L60,15 L80,14 L100,15"}
                            fill="none"
                            stroke={isGreatValue ? "#4648d4" : "#76777d"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center text-[#45464d] space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#76777d]">search_off</span>
              <p className="font-bold text-[#1b1b1d]">Arama kriterlerine uygun ilan bulunamadı.</p>
              <p className="text-xs">Lütfen farklı bir ilçe veya fiyat aralığı seçiniz.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── RIGHT SIDE: Interactive Map (60%) ───────────────────────── */}
      <section className={`w-full md:w-[60%] relative bg-[#f0edef] ${mobileMapOpen ? 'block fixed inset-0 z-50 pt-16' : 'hidden md:block'}`}>
        <MapView listings={activeListings} onListingSelect={(item) => navigate(`/listing/${item.id}`)} />

        {/* Mobile close button */}
        {mobileMapOpen && (
          <button
            onClick={() => setMobileMapOpen(false)}
            className="md:hidden absolute top-20 right-4 z-50 bg-[#131b2e] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
          >
            Listeye Dön
          </button>
        )}
      </section>

      {/* Mobile Floating Map Button */}
      <button
        onClick={() => setMobileMapOpen(!mobileMapOpen)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#131b2e] text-white px-6 py-3 rounded-full font-semibold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined">map</span>
        {mobileMapOpen ? 'Listeyi Gör' : 'Haritayı Gör'}
      </button>
    </div>
  );
};

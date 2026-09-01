import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ISTANBUL_NEIGHBOURHOODS, ROOM_TYPES } from '../data/mockListings';
import { MapView } from '../components/MapView';
import { fetchListings } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const loadData = useCallback(async (currentFilters) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchListings(currentFilters);
      if (result && result.success) {
        setActiveListings(result.data || []);
        setIsLiveApi(Boolean(result.isLive));
      } else {
        throw new Error(result?.message || 'İlanlar yüklenirken bir sorun oluştu.');
      }
    } catch (err) {
      console.error('[SearchPage] Veri getirme hatası:', err);
      setErrorMessage(err.message || 'Sunucuya bağlanılamadı.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const neighbourhoodParam = searchParams.get('neighbourhood') || '';
    const roomTypeParam = searchParams.get('roomType') || '';
    const updatedFilters = {
      ...filters,
      neighbourhood: neighbourhoodParam,
      roomType: roomTypeParam
    };
    setFilters(updatedFilters);
    loadData(updatedFilters);
  }, [searchParams, loadData]);

  const handleFilterUpdate = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    loadData(updated);
  };

  return (
    <div className="flex-1 mt-16 flex flex-col md:flex-row h-[calc(100vh-64px)] w-full font-body-md overflow-hidden bg-[#fcf8fa]">
      {/* ── LEFT SIDE: Property List (40%) ────────────────────────────── */}
      <section className="w-full md:w-[40%] flex flex-col bg-[#ffffff] border-r border-[#c6c6cd]/30 z-10 shadow-lg md:shadow-none h-full">
        {/* Sticky Filter Bar */}
        <div className="bg-[#ffffff] p-4 sticky top-0 z-20 flex flex-wrap gap-2.5 items-center border-b border-[#c6c6cd]/30 shadow-sm">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              showFilterDrawer
                ? 'bg-[#4648d4] text-white border-[#4648d4]'
                : 'bg-[#f0edef] border-[#c6c6cd]/50 hover:border-[#76777d] hover:bg-[#e4e2e4] text-[#1b1b1d]'
            }`}
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
            {isLiveApi && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#4648d4] font-bold mr-1">
                <span className="w-2 h-2 rounded-full bg-[#4648d4] animate-pulse"></span>
                Canlı API
              </span>
            )}
            <span className="font-bold text-[#1b1b1d]">{activeListings.length}</span> sonuç
          </div>
        </div>

        {/* Filter Drawer */}
        {showFilterDrawer && (
          <div className="p-4 bg-[#f0edef] border-b border-[#c6c6cd] space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1b1b1d]">Gecelik Fiyat Aralığı (TL)</span>
              <button
                onClick={() => {
                  const resetF = { ...filters, neighbourhood: '', roomType: 'all', minPrice: 0, maxPrice: 15000 };
                  setFilters(resetF);
                  loadData(resetF);
                }}
                className="text-[#4648d4] font-semibold hover:underline cursor-pointer"
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
                className="w-full cursor-pointer accent-[#4648d4]"
              />
              <span className="font-mono font-bold text-[#4648d4] shrink-0">
                Maks: ₺{filters.maxPrice.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="m-4 p-3.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs flex items-center justify-between gap-2 border border-[#ba1a1a]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadData(filters)}
              className="px-2.5 py-1 bg-[#ba1a1a] text-white rounded-lg font-bold hover:bg-[#93000a] transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-24 md:pb-6 bg-[#ffffff]">
          {isLoading ? (
            /* Loading Skeletons */
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-[#e2e8f0] p-4 space-y-4 animate-pulse bg-[#f6f3f5]">
                  <div className="h-48 w-full bg-[#e4e2e4] rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#e4e2e4] rounded w-3/4"></div>
                    <div className="h-3 bg-[#e4e2e4] rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-[#e4e2e4] rounded w-24"></div>
                    <div className="h-6 bg-[#e4e2e4] rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeListings.length > 0 ? (
            activeListings.map((listing) => {
              const isDeal = Boolean(listing.isDeal);
              const discount = listing.discountPercentage || 15;

              return (
                <article
                  key={listing.id}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="bg-[#ffffff] rounded-2xl shadow-ambient border border-[#e2e8f0] overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                >
                  {/* AI Badge Overlay: 🔥 Fırsat Fiyat */}
                  <div
                    className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm ${
                      isDeal
                        ? 'bg-ai-purple-gradient text-white'
                        : 'bg-[#e4e2e4]/95 backdrop-blur-sm text-[#1b1b1d] border border-[#c6c6cd]/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isDeal ? 'local_fire_department' : 'balance'}
                    </span>
                    {isDeal ? `🔥 Fırsat Fiyat (%${discount})` : 'Fiyatı Normal'}
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
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1b1b1d] mb-1 line-clamp-1 group-hover:text-[#4648d4] transition-colors">
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
                        {Number(listing.reviewScoresRating || 4.8).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-4 border-t border-[#c6c6cd]/30">
                      <div>
                        <p className="text-xs text-[#45464d] mb-0.5">Gecelik Fiyat</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold text-[#1b1b1d]">
                            ₺{Number(listing.price).toLocaleString('tr-TR')}
                          </span>
                          {listing.predictedPrice && (
                            <span className="text-[11px] text-[#4648d4] font-semibold">
                              (AI: ₺{Number(listing.predictedPrice).toLocaleString('tr-TR')})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sparkline Trend Chart */}
                      <div className="w-28 h-10 flex flex-col justify-end relative" title="Fiyat Değerlendirmesi">
                        <span className={`text-[11px] absolute -top-5 right-0 font-bold px-1.5 py-0.5 rounded ${
                          isDeal ? 'text-[#4648d4] bg-[#e1e0ff]/60' : 'text-[#45464d] bg-[#f0edef]'
                        }`}>
                          {isDeal ? `-%${discount} Avantaj` : 'Piyasa Değeri'}
                        </span>
                        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 30" width="100%">
                          <path
                            d={isDeal ? "M0,25 L20,20 L40,28 L60,15 L80,18 L100,5" : "M0,15 L20,16 L40,14 L60,15 L80,14 L100,15"}
                            fill="none"
                            stroke={isDeal ? "#4648d4" : "#76777d"}
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

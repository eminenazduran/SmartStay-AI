import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ISTANBUL_NEIGHBOURHOODS, ROOM_TYPES } from '../data/mockListings';
import { MapView } from '../components/MapView';
import { fetchListings } from '../services/api';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read initial params from URL
  const [filters, setFilters] = useState({
    neighbourhood: searchParams.get('neighbourhood') || '',
    roomType: searchParams.get('roomType') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 15000,
    accommodates: Number(searchParams.get('accommodates')) || 1,
    dealType: searchParams.get('dealType') || 'all',
    minRating: searchParams.get('minRating') || '',
    nights: Number(searchParams.get('nights')) || 0,
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    amenities: []
  });

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [activeListings, setActiveListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const updated = {
      neighbourhood: searchParams.get('neighbourhood') || '',
      roomType: searchParams.get('roomType') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 15000,
      accommodates: Number(searchParams.get('accommodates')) || 1,
      dealType: searchParams.get('dealType') || 'all',
      minRating: searchParams.get('minRating') || '',
      nights: Number(searchParams.get('nights')) || 0,
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      amenities: []
    };
    setFilters(updated);
    loadData(updated);
  }, [searchParams]);

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

  const handleFilterUpdate = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // Update URL query string
    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 0) {
        newParams.set(k, v.toString());
      }
    });
    setSearchParams(newParams);
    loadData(updated);
  };

  const removeFilter = (key, defaultValue = '') => {
    handleFilterUpdate(key, defaultValue);
  };

  const resetAllFilters = () => {
    const defaultFilters = {
      neighbourhood: '',
      roomType: 'all',
      minPrice: 0,
      maxPrice: 15000,
      accommodates: 1,
      dealType: 'all',
      minRating: '',
      nights: 0,
      checkIn: '',
      checkOut: '',
      amenities: []
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    loadData(defaultFilters);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full font-body-md overflow-hidden bg-background">
      {/* ── LEFT SIDE: Property List Bar (Independent Scroll) ──────────────── */}
      <section className="w-full md:w-[45%] lg:w-[40%] xl:w-[38%] flex flex-col bg-surface-container-lowest border-r border-border-subtle z-10 h-full overflow-hidden shrink-0">
        
        {/* Sticky Filter Header */}
        <div className="bg-surface-container-lowest p-4 shrink-0 flex flex-wrap gap-2.5 items-center border-b border-border-subtle z-20">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              showFilterDrawer
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container-low border-outline-variant/50 hover:border-outline hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filtreler
          </button>

          {/* İlçe Seçimi */}
          <select
            value={filters.neighbourhood || 'all'}
            onChange={(e) => handleFilterUpdate('neighbourhood', e.target.value)}
            className="bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/50 hover:border-outline text-xs font-semibold text-on-surface appearance-none cursor-pointer pr-6 relative"
          >
            {ISTANBUL_NEIGHBOURHOODS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>

          {/* Oda Türü */}
          <select
            value={filters.roomType || 'all'}
            onChange={(e) => handleFilterUpdate('roomType', e.target.value)}
            className="bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/50 hover:border-outline text-xs font-semibold text-on-surface appearance-none cursor-pointer pr-6"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.label}
              </option>
            ))}
          </select>

          {/* Fırsat Hızlı Filtresi */}
          <button
            onClick={() => handleFilterUpdate('dealType', filters.dealType === 'opportunity' ? 'all' : 'opportunity')}
            className={`px-3 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              filters.dealType === 'opportunity'
                ? 'bg-secondary text-white border-secondary shadow-sm'
                : 'bg-surface-container-low border-outline-variant/50 hover:border-outline text-on-surface'
            }`}
            title="Sadece yapay zekanın piyasa değerinin altında bulduğu fırsat evleri göster"
          >
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            Fırsatlar
          </button>

          <div className="ml-auto text-xs text-on-surface-variant flex items-center gap-1 font-semibold shrink-0">
            {isLiveApi && (
              <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-bold mr-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Canlı API
              </span>
            )}
            <span className="font-bold text-on-surface">{activeListings.length}</span> sonuç
          </div>
        </div>

        {/* Active Filter Badges Strip */}
        {(filters.neighbourhood || (filters.roomType && filters.roomType !== 'all') || filters.dealType !== 'all' || filters.nights > 0 || filters.maxPrice < 15000) && (
          <div className="px-4 py-2.5 bg-surface-container-low/70 border-b border-border-subtle flex flex-wrap gap-2 items-center text-xs shrink-0">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mr-1">Filtreler:</span>
            
            {filters.neighbourhood && (
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-border-subtle px-2.5 py-1 rounded-full text-on-surface font-semibold">
                📍 {filters.neighbourhood}
                <button onClick={() => removeFilter('neighbourhood', '')} className="hover:text-error text-xs ml-0.5">✕</button>
              </span>
            )}

            {filters.roomType && filters.roomType !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-border-subtle px-2.5 py-1 rounded-full text-on-surface font-semibold">
                🏠 {filters.roomType}
                <button onClick={() => removeFilter('roomType', 'all')} className="hover:text-error text-xs ml-0.5">✕</button>
              </span>
            )}

            {filters.dealType === 'opportunity' && (
              <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full font-bold">
                🔥 Fırsat Fiyatlar
                <button onClick={() => removeFilter('dealType', 'all')} className="hover:text-error text-xs ml-0.5">✕</button>
              </span>
            )}

            {filters.nights > 0 && (
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-border-subtle px-2.5 py-1 rounded-full text-on-surface font-semibold">
                📅 {filters.nights} Gece {filters.checkIn && `(${filters.checkIn})`}
                <button onClick={() => { removeFilter('nights', 0); removeFilter('checkIn', ''); removeFilter('checkOut', ''); }} className="hover:text-error text-xs ml-0.5">✕</button>
              </span>
            )}

            {filters.maxPrice < 15000 && (
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-border-subtle px-2.5 py-1 rounded-full text-on-surface font-semibold">
                ₺ ≤ {filters.maxPrice.toLocaleString('tr-TR')}
                <button onClick={() => removeFilter('maxPrice', 15000)} className="hover:text-error text-xs ml-0.5">✕</button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-secondary hover:underline font-bold text-xs ml-auto cursor-pointer"
            >
              Tümünü Temizle
            </button>
          </div>
        )}

        {/* Detailed Filter Drawer */}
        {showFilterDrawer && (
          <div className="p-4 bg-surface-container-low border-b border-border-subtle space-y-4 text-xs shrink-0 max-h-80 overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface text-sm">Gelişmiş Filtreleme</span>
              <button
                onClick={resetAllFilters}
                className="text-secondary font-semibold hover:underline cursor-pointer"
              >
                Sıfırla
              </button>
            </div>

            {/* Fiyat Aralığı */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-on-surface">Maksimum Gecelik Fiyat</label>
                <span className="font-mono font-bold text-secondary">
                  ₺{filters.maxPrice.toLocaleString('tr-TR')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={filters.maxPrice}
                onChange={(e) => handleFilterUpdate('maxPrice', Number(e.target.value))}
                className="w-full cursor-pointer accent-secondary"
              />
            </div>

            {/* AI Değerleme Modu */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFilterUpdate('dealType', 'all')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${
                  filters.dealType === 'all' ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-border-subtle text-on-surface'
                }`}
              >
                Tüm İlanlar
              </button>
              <button
                onClick={() => handleFilterUpdate('dealType', 'opportunity')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all flex items-center justify-center gap-1 ${
                  filters.dealType === 'opportunity' ? 'bg-secondary text-white border-secondary' : 'bg-surface border-border-subtle text-on-surface'
                }`}
              >
                🔥 Sadece Fırsatlar
              </button>
            </div>

            {/* Minimum Misafir */}
            <div>
              <label className="font-semibold text-on-surface block mb-1">Kapasite (Misafir)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleFilterUpdate('accommodates', num)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                      filters.accommodates === num
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-border-subtle text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {num === 6 ? '6+' : num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="m-4 p-3.5 rounded-xl bg-error-container text-on-error-container text-xs flex items-center justify-between gap-2 border border-error/20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadData(filters)}
              className="px-2.5 py-1 bg-error text-on-error rounded-lg font-bold hover:opacity-90 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* ── SCROLLABLE LISTINGS CONTAINER (Only this scrolls) ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-surface-container-lowest">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border-subtle p-4 space-y-4 animate-pulse bg-surface-container-low">
                  <div className="h-48 w-full bg-surface-container rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-container rounded w-3/4"></div>
                    <div className="h-3 bg-surface-container rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-surface-container rounded w-24"></div>
                    <div className="h-6 bg-surface-container rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeListings.length > 0 ? (
            activeListings.map((listing) => {
              const isDeal = Boolean(listing.isDeal);
              const discount = Number(listing.discountPercentage || 0);
              const hasNights = filters.nights > 0;
              const totalStayPrice = hasNights ? Number(listing.price) * filters.nights : null;

              return (
                <article
                  key={listing.id}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="bg-surface rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-[0_20px_40px_rgba(19,27,46,0.08)] transition-all duration-300 cursor-pointer relative"
                >
                  {/* Price Comparison Badge Overlay */}
                  <div
                    className={`absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${
                      listing.isDeal
                        ? 'bg-emerald-50/95 text-emerald-800 border border-emerald-300'
                        : listing.isHigh
                        ? 'bg-rose-50/95 text-rose-800 border border-rose-300'
                        : 'bg-surface/95 text-on-surface border border-border-subtle'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      listing.isDeal ? 'bg-emerald-500' : listing.isHigh ? 'bg-rose-500' : 'bg-slate-400'
                    }`}></span>
                    {listing.isDeal 
                      ? `-%${discount} Daha Uygun` 
                      : listing.isHigh 
                      ? `+${discount}% Daha Yüksek` 
                      : 'Bölge Düzeyinde'}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>

                  <div className="h-52 w-full relative bg-surface-container-low">
                    <img
                      src={listing.imageUrl}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-on-surface mb-1 truncate group-hover:text-secondary transition-colors">
                          {listing.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {listing.districtName || listing.neighbourhoodCleansed}, İstanbul • {listing.roomType}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg text-on-surface text-xs font-semibold border border-border-subtle shrink-0">
                        <span className="material-symbols-outlined text-[15px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        {Number(listing.reviewScoresRating || 4.8).toFixed(2)}
                      </div>
                    </div>

                    <div className="h-px w-full bg-border-subtle my-0.5"></div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-0.5">Gecelik Fiyat</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-sm text-headline-sm text-on-surface">
                            ₺{Number(listing.price).toLocaleString('tr-TR')}
                          </span>
                          {listing.predictedPrice && (
                            <span className="text-[11px] text-secondary font-semibold">
                              (Piyasa: ₺{Number(listing.predictedPrice).toLocaleString('tr-TR')})
                            </span>
                          )}
                        </div>
                        {hasNights && totalStayPrice && (
                          <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                            {filters.nights} gece toplam: <strong className="text-on-surface">₺{Math.round(totalStayPrice).toLocaleString('tr-TR')}</strong>
                          </p>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center text-on-surface-variant space-y-3">
              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
              <p className="font-bold text-on-surface text-base">Arama kriterlerine uygun ilan bulunamadı.</p>
              <p className="text-xs max-w-xs mx-auto">Lütfen farklı bir ilçe seçin veya filtreleri temizleyerek yeniden arayın.</p>
              <button
                onClick={resetAllFilters}
                className="mt-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-surface-tint transition-all"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── RIGHT SIDE: Interactive Leaflet Map (Pinned & Fixed Height) ── */}
      <section className={`w-full md:w-[55%] lg:w-[60%] xl:w-[62%] h-full relative overflow-hidden bg-surface-container-low ${mobileMapOpen ? 'block fixed inset-0 z-50 pt-20' : 'hidden md:block'}`}>
        <MapView listings={activeListings} onListingSelect={(item) => navigate(`/listing/${item.id}`)} />

        {mobileMapOpen && (
          <button
            onClick={() => setMobileMapOpen(false)}
            className="md:hidden absolute top-24 right-4 z-50 bg-primary-container text-on-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg"
          >
            Listeye Dön
          </button>
        )}
      </section>

      {/* Mobile Floating Map Button */}
      <button
        onClick={() => setMobileMapOpen(!mobileMapOpen)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-primary-container text-on-primary px-6 py-3 rounded-full font-semibold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined">map</span>
        {mobileMapOpen ? 'Listeyi Gör' : 'Haritayı Gör'}
      </button>
    </div>
  );
};

export default SearchPage;

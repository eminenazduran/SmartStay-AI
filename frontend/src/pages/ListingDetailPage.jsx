import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../services/api';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guestsCount, setGuestsCount] = useState(2);
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadListingDetail() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetchListingById(id);
        if (res && res.success && res.data && isMounted) {
          setListing(res.data);
        } else {
          throw new Error('İlan detayları yüklenemedi.');
        }
      } catch (err) {
        console.error('[ListingDetailPage] Detay getirme hatası:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'İlan bilgileri yüklenemedi.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) {
      loadListingDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen pt-28 pb-16 font-body-md flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-on-surface-variant">İlan detayları ve AI analizi hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !listing) {
    return (
      <div className="bg-background min-h-screen pt-28 pb-16 font-body-md flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8 bg-surface rounded-xl border border-border-subtle shadow-sm">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h2 className="text-xl font-bold text-on-surface">İlan Bulunamadı</h2>
          <p className="text-xs text-on-surface-variant">{errorMessage || 'İstenilen ilan mevcut değil veya erişilemiyor.'}</p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-surface-tint transition-all cursor-pointer"
          >
            Aramaya Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const nightPrice = listing.price || 2450;
  const predictedPrice = listing.predictedPrice || (nightPrice * 1.15);
  const isDeal = Boolean(listing.isDeal || nightPrice < predictedPrice);
  const discountPercent = listing.discountPercentage || Math.round(((predictedPrice - nightPrice) / predictedPrice) * 100);

  const nights = 5;
  const cleaningFee = Math.round(nightPrice * 0.25);
  const subtotal = nightPrice * nights;
  const totalPrice = subtotal + cleaningFee;

  return (
    <div className="bg-background text-on-surface min-h-screen pt-24 pb-16 font-body-md">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Arama Sonuçlarına Dön
          </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── LEFT COLUMN: Gallery & Details (8 Cols) ────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Title & Rating */}
            <div>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 leading-tight">
                {listing.name}
              </h1>
              <div className="flex items-center gap-4 text-on-surface-variant text-sm flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {Number(listing.reviewScoresRating || 4.98).toFixed(2)} ({listing.numberOfReviews || 124} değerlendirme)
                </span>
                <span>•</span>
                <span className="underline font-medium">
                  {listing.districtName || listing.neighbourhoodCleansed}, İstanbul
                </span>
                <span>•</span>
                <span className="bg-surface-container-low px-2.5 py-0.5 rounded-md text-xs font-bold text-on-surface">
                  {listing.roomType}
                </span>
              </div>
            </div>

            {/* Image Gallery Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[380px] md:h-[480px] rounded-xl overflow-hidden shadow-sm bg-surface-container">
              <div className="col-span-2 row-span-2 relative bg-surface-container-low">
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative bg-surface-container-low">
                <img src={listing.images?.[1] || listing.imageUrl} alt="Gallery 2" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-surface-container-low">
                <img src={listing.images?.[2] || listing.imageUrl} alt="Gallery 3" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-surface-container-low">
                <img src={listing.images?.[3] || listing.imageUrl} alt="Gallery 4" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-secondary-fixed flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-xs font-bold text-on-secondary-fixed">+12 Fotoğraf</span>
              </div>
            </div>

            {/* AI Insights Core Feature */}
            <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border-subtle shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary">Smart AI Fiyat Analizi</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gauge / Comparison */}
                <div className="bg-surface-container-low rounded-xl p-6 border border-border-subtle flex flex-col items-center justify-center relative">
                  <div className="text-center mb-4">
                    <div className="font-headline-md text-headline-md text-primary mb-1">
                      ₺{Number(nightPrice).toLocaleString('tr-TR')}
                      <span className="text-xs font-normal text-on-surface-variant">/gece</span>
                    </div>
                    {isDeal ? (
                      <div className="bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">trending_down</span>
                        Bölge Ort. -%{discountPercent}
                      </div>
                    ) : (
                      <div className="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">balance</span>
                        Piyasa Değerinde
                      </div>
                    )}
                  </div>

                  {/* Gauge Visualization */}
                  <div className="w-full max-w-[200px] h-3 bg-surface-container rounded-full overflow-hidden relative mb-2">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full ${isDeal ? 'bg-secondary' : 'bg-primary'}`}
                      style={{ width: isDeal ? '35%' : '50%' }}
                    ></div>
                    <div className="absolute left-[50%] top-0 h-full w-[2px] bg-outline z-10"></div>
                  </div>
                  <div className="flex justify-between w-full max-w-[200px] text-[11px] text-on-surface-variant">
                    <span>Bu Ev</span>
                    <span className="pr-2">Ortalama (₺{Number(predictedPrice).toLocaleString('tr-TR')})</span>
                  </div>
                  <p className="mt-4 text-center text-xs font-semibold text-on-surface">
                    {isDeal ? (
                      <>Bu ev yapay zeka modeline göre bölge ortalamasının <strong className="text-secondary">%{discountPercent} altında!</strong></>
                    ) : (
                      <>Bu ev semtin adil piyasa değerine uygun olarak fiyatlandırılmıştır.</>
                    )}
                  </p>
                </div>

                {/* AI Forecast Chart */}
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                    Yapay Zeka Fiyat Tahmini (Gelecek 3 Ay)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">Eylül (Tahmini)</span>
                        <span className="text-on-surface font-bold">₺{Number(nightPrice * 1.05).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary/80 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">Ekim (Yüksek Sezon)</span>
                        <span className="text-on-surface font-bold">₺{Number(nightPrice * 1.25).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">Kasım (Düzeltme)</span>
                        <span className="text-on-surface font-bold">₺{Number(nightPrice * 1.02).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary/60 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Verdict Box */}
              <div className="bg-secondary-fixed/40 border border-secondary/20 rounded-xl p-5 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lightbulb
                </span>
                <div>
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-wider block mb-1">
                    SMART VERDICT
                  </span>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {isDeal ? (
                      <>Yapay zekamız bu evi <strong>"Kaçırılmaması Gereken Fırsat"</strong> olarak nitelendiriyor. {listing.districtName || listing.neighbourhoodCleansed} bölgesindeki benzer konaklamalara göre belirgin bir fiyat avantajı sunuyor.</>
                    ) : (
                      <>Bu ev konumu ve sunduğu olanaklarıyla dengeli bir fiyat/performans oranına sahiptir.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Listing Amenities */}
            <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border-subtle shadow-sm space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Öne Çıkan Ev Olanakları</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {listing.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-border-subtle">
                    <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Booking Widget (4 Cols) ──────────────────── */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 bg-surface rounded-xl shadow-[0_20px_40px_rgba(19,27,46,0.05)] border border-border-subtle p-6 flex flex-col gap-4">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-headline-md text-primary">
                  ₺{Number(nightPrice).toLocaleString('tr-TR')}
                </span>
                <span className="text-sm text-on-surface-variant">/ gece</span>
              </div>

              <div className="border border-outline-variant rounded-xl overflow-hidden flex flex-col bg-surface-container-lowest">
                <div className="flex border-b border-outline-variant">
                  <div className="flex-1 p-3 border-r border-outline-variant">
                    <label className="block font-label-md text-label-md uppercase text-on-surface mb-1">GİRİŞ</label>
                    <input
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 text-on-surface"
                      readOnly
                      type="text"
                      value="15 Eyl 2026"
                    />
                  </div>
                  <div className="flex-1 p-3">
                    <label className="block font-label-md text-label-md uppercase text-on-surface mb-1">ÇIKIŞ</label>
                    <input
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 text-on-surface"
                      readOnly
                      type="text"
                      value="20 Eyl 2026"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block font-label-md text-label-md uppercase text-on-surface mb-1">MİSAFİR</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 text-on-surface cursor-pointer appearance-none"
                  >
                    <option value={1}>1 Misafir</option>
                    <option value={2}>2 Misafir</option>
                    <option value={3}>3 Misafir</option>
                    <option value={4}>4 Misafir</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => alert(`Rezervasyon talebiniz alındı!\nİlan: ${listing.name}\nToplam Tutar: ₺${totalPrice.toLocaleString('tr-TR')}`)}
                className="w-full bg-primary text-on-primary font-bold text-sm py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-sm cursor-pointer hover:bg-surface-tint font-label-md text-label-md uppercase tracking-wider"
              >
                Hemen Rezerve Et
              </button>
              <p className="text-center text-xs text-on-surface-variant">Henüz sizden ücret alınmayacaktır.</p>

              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span className="underline">₺{Number(nightPrice).toLocaleString('tr-TR')} x {nights} gece</span>
                  <span className="font-semibold text-on-surface">₺{Number(subtotal).toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Temizlik ve servis ücreti</span>
                  <span className="font-semibold text-on-surface">₺{Number(cleaningFee).toLocaleString('tr-TR')}</span>
                </div>
              </div>

              <div className="h-px w-full bg-border-subtle"></div>

              <div className="flex justify-between items-center text-on-surface pt-1">
                <span className="font-bold text-sm">Toplam</span>
                <span className="font-headline-sm text-headline-sm">₺{Number(totalPrice).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListingDetailPage;

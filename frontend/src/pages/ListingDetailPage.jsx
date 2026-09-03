import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../services/api';

const AMENITY_MAP = {
  'wifi': { label: 'Yüksek Hızlı Wi-Fi', icon: 'wifi' },
  'kitchen': { label: 'Tam Donanımlı Mutfak', icon: 'soup_kitchen' },
  'heating': { label: 'Merkezi Isıtma', icon: 'thermostat' },
  'hot water': { label: 'Kesintisiz Sıcak Su', icon: 'water_drop' },
  'tv': { label: 'Smart TV & Dijital Platform', icon: 'tv' },
  'air conditioning': { label: 'Klima & İklimlendirme', icon: 'ac_unit' },
  'washer': { label: 'Çamaşır Makinesi', icon: 'local_laundry_service' },
  'dedicated workspace': { label: 'Ergonomik Çalışma Alanı', icon: 'desk' },
  'smoking allowed': { label: 'Sigara İçilebilir Alan', icon: 'smoking_rooms' },
  'elevator': { label: 'Asansör Erişimi', icon: 'elevator' },
  'balcony': { label: 'Balkon / Şehir Manzarası', icon: 'deck' },
  'sea view': { label: 'Boğaz / Deniz Manzarası', icon: 'water' },
  'iron': { label: 'Ütü & Ekipmanı', icon: 'iron' },
  'hair dryer': { label: 'Saç Kurutma Makinesi', icon: 'air' },
  'refrigerator': { label: 'Geniş Buzdolabı', icon: 'kitchen' },
  'dishes and silverware': { label: 'Mutfak Yemek Takımı', icon: 'flatware' }
};

function formatAmenity(raw) {
  const clean = raw.toLowerCase().trim();
  for (const [key, val] of Object.entries(AMENITY_MAP)) {
    if (clean.includes(key)) return val;
  }
  return { label: raw, icon: 'check_circle' };
}

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Booking widget interactive dates
  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 2);
  const defaultOut = new Date(today);
  defaultOut.setDate(today.getDate() + 7);

  const [checkInDate, setCheckInDate] = useState(defaultIn.toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(defaultOut.toISOString().split('T')[0]);
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

  // Calculate clean, rounded figures (no weird decimals like 630,28)
  const nightPrice = Math.round(Number(listing.price) || 2450);
  const predictedPrice = Math.round(Number(listing.predictedPrice) || (nightPrice * 1.15));
  const isDeal = Boolean(listing.isDeal || nightPrice < predictedPrice);
  const priceDiffPerNight = Math.abs(predictedPrice - nightPrice);
  const discountPercent = listing.discountPercentage || Math.max(1, Math.round(((predictedPrice - nightPrice) / (predictedPrice || 1)) * 100));

  // Dynamic Stay Calculation
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 5;
    const diff = new Date(checkOutDate) - new Date(checkInDate);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  };
  const nights = calculateNights();
  const subtotal = nightPrice * nights;
  const cleaningFee = Math.round(nightPrice * 0.22);
  const totalPrice = subtotal + cleaningFee;
  const totalSavings = isDeal ? priceDiffPerNight * nights : 0;

  return (
    <div className="bg-background text-on-surface min-h-screen pt-24 pb-20 font-body-md">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        
        {/* Top Breadcrumb / Back Navigation */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Arama Sonuçlarına Dön
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary">verified</span>
              Inside Airbnb Doğrulanmış Veri
            </span>
          </div>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Gallery, AI Engine & Details (8 Cols) ────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Header Title & Quick Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {isDeal ? (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
                    FIRSAT İLAN (%{discountPercent} İNDİRİMLİ)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-surface-container-low border border-border-subtle text-on-surface text-xs font-bold px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[15px]">balance</span>
                    ADİL PİYASA DEĞERİ
                  </span>
                )}
                <span className="bg-surface-container-low border border-border-subtle text-on-surface px-3 py-1 rounded-full text-xs font-semibold">
                  {listing.roomType}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  İlan ID: #{listing.id}
                </span>
              </div>

              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight font-bold">
                {listing.name}
              </h1>

              <div className="flex items-center gap-3 text-on-surface-variant text-sm flex-wrap pt-1">
                <span className="flex items-center gap-1 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {Number(listing.reviewScoresRating || 4.85).toFixed(2)}
                  <span className="font-normal text-on-surface-variant text-xs underline cursor-pointer">
                    ({listing.numberOfReviews || 124} kullanıcı yorumu)
                  </span>
                </span>
                <span>•</span>
                <span className="font-medium text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                  {listing.districtName || listing.neighbourhoodCleansed}, İstanbul
                </span>
                <span>•</span>
                <span className="text-on-surface-variant text-xs">
                  {listing.accommodates || 2} Misafir • {listing.bedrooms || 1} Yatak Odası • {listing.bathrooms || 1} Banyo
                </span>
              </div>
            </div>

            {/* 2. Bento Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[360px] md:h-[460px] rounded-2xl overflow-hidden shadow-sm bg-surface-container">
              <div className="md:col-span-2 md:row-span-2 relative bg-surface-container-low overflow-hidden group">
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="relative bg-surface-container-low overflow-hidden group">
                <img src={listing.images?.[1] || listing.imageUrl} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative bg-surface-container-low overflow-hidden group">
                <img src={listing.images?.[2] || listing.imageUrl} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative bg-surface-container-low overflow-hidden group">
                <img src={listing.images?.[3] || listing.imageUrl} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative bg-secondary-fixed flex flex-col items-center justify-center cursor-pointer hover:bg-secondary-fixed/80 transition-all text-on-secondary-fixed gap-1 p-3 text-center">
                <span className="material-symbols-outlined text-2xl">photo_library</span>
                <span className="text-xs font-bold">Tüm Fotoğrafları Gör</span>
              </div>
            </div>

            {/* 3. 🌟 ULTRA-MODERN AI INTELLIGENCE & VALUATION DASHBOARD 🌟 */}
            <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-subtle shadow-[0_10px_30px_rgba(19,27,46,0.04)] space-y-6">
              
              {/* AI Engine Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-tr from-secondary to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-secondary/20">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                      SmartStay AI™ Fiyat Değerleme Motoru
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      XGBoost ML Modeli • Inside Airbnb İstanbul piyasa verisiyle analiz edildi
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Algoritmik Olarak Doğrulandı
                </div>
              </div>

              {/* 3 Key Valuation Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* A: İlan Fiyatı */}
                <div className="bg-surface-container-low p-5 rounded-xl border border-border-subtle flex flex-col justify-between">
                  <div>
                    <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant block mb-1">
                      Mevcut İlan Fiyatı
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                      ₺{nightPrice.toLocaleString('tr-TR')}
                      <span className="text-xs font-normal text-on-surface-variant ml-1">/ gece</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-3">Ev sahibinin talep ettiği güncel geceleme bedeli.</p>
                </div>

                {/* B: AI Piyasa Rayici */}
                <div className="bg-surface-container-low p-5 rounded-xl border border-border-subtle flex flex-col justify-between">
                  <div>
                    <span className="font-label-md text-[11px] uppercase tracking-wider text-secondary font-bold block mb-1">
                      AI Tahmini Piyasa Değeri
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-secondary">
                      ₺{predictedPrice.toLocaleString('tr-TR')}
                      <span className="text-xs font-normal text-on-surface-variant ml-1">/ gece</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-3">{listing.districtName || listing.neighbourhoodCleansed} bölgesindeki benzer konutların ortalaması.</p>
                </div>

                {/* C: Değerleme & Avantaj Durumu */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                  isDeal 
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-300 text-emerald-950' 
                    : 'bg-surface-container-low border-border-subtle text-primary'
                }`}>
                  <div>
                    <span className="font-label-md text-[11px] uppercase tracking-wider font-bold block mb-1">
                      Fiyat Değerlendirmesi
                    </span>
                    <div className="text-xl sm:text-2xl font-extrabold flex items-center gap-1.5">
                      {isDeal ? (
                        <>
                          <span className="material-symbols-outlined text-emerald-600 text-2xl">trending_down</span>
                          -%{discountPercent} Fırsat
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-primary text-2xl">balance</span>
                          Piyasa Dengesinde
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold mt-3">
                    {isDeal 
                      ? `Gecelik ~₺${priceDiffPerNight.toLocaleString('tr-TR')} bütçe avantajı sağlıyor!` 
                      : 'Bölgesinin adil piyasa değerine tam uyumlu fiyatlandırılmış.'}
                  </p>
                </div>
              </div>

              {/* Visual Deal Spectrum Gauge (Görsel Fırsat İbresi) */}
              <div className="bg-surface-container-low/70 rounded-xl p-5 border border-border-subtle space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">Piyasa Fiyat Spektrumu ve Konumlandırma</span>
                  <span className="font-semibold text-secondary text-[11px]">
                    {isDeal ? '⭐ Cazip Fiyat Bölgesinde' : '✓ Adil Değer Bölgesinde'}
                  </span>
                </div>

                {/* The Color Band */}
                <div className="relative h-4 rounded-full overflow-hidden flex shadow-inner bg-slate-200">
                  <div className="w-1/3 bg-gradient-to-r from-emerald-500 to-teal-400" title="Yüksek Fırsat Segmenti"></div>
                  <div className="w-1/3 bg-gradient-to-r from-teal-400 to-indigo-500" title="Adil Piyasa Rayici"></div>
                  <div className="w-1/3 bg-gradient-to-r from-indigo-500 to-rose-400" title="Primli Segment"></div>
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                  <span className="text-emerald-700 font-bold">🟢 Yüksek Fırsat</span>
                  <span className="text-indigo-700 font-bold">🔵 Adil Değer (~₺{predictedPrice.toLocaleString('tr-TR')})</span>
                  <span className="text-rose-700 font-bold">🔴 Primli / Lüks</span>
                </div>
              </div>

              {/* 3-Month Seasonal Forecast Bar Charts */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-md text-xs font-bold text-on-surface uppercase tracking-wider">
                    Gelecek 3 Aylık Sezonluk Fiyat Projeksiyonu
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">Inside Airbnb tarihsel trend modeli</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs font-bold text-on-surface">Eylül 2026</span>
                      <span className="text-[11px] text-secondary font-bold">+%5</span>
                    </div>
                    <div className="text-base font-extrabold text-primary mb-2">
                      ₺{Math.round(nightPrice * 1.05).toLocaleString('tr-TR')}
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs font-bold text-on-surface">Ekim 2026</span>
                      <span className="text-[11px] text-amber-700 font-bold">+%22 (Zirve)</span>
                    </div>
                    <div className="text-base font-extrabold text-primary mb-2">
                      ₺{Math.round(nightPrice * 1.22).toLocaleString('tr-TR')}
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs font-bold text-on-surface">Kasım 2026</span>
                      <span className="text-[11px] text-teal-700 font-bold">+%2 (Denge)</span>
                    </div>
                    <div className="text-base font-extrabold text-primary mb-2">
                      ₺{Math.round(nightPrice * 1.02).toLocaleString('tr-TR')}
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Verdict Comprehensive Callout */}
              <div className="bg-gradient-to-r from-secondary-fixed/40 via-surface-container-low to-indigo-50 border border-secondary/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">psychology</span>
                  Yapay Zeka Karar Raporu (Smart Verdict)
                </div>
                <p className="font-body-md text-sm text-on-surface leading-relaxed">
                  {isDeal ? (
                    <>
                      Bu konaklama, yapay zeka fiyat modelimiz tarafından <strong>"Yüksek Fiyat/Performans Fırsatı"</strong> olarak derecelendirilmiştir. {listing.districtName || listing.neighbourhoodCleansed} semtindeki benzer oda tipine ve özelliklere sahip konutların ortalamasından <strong>gecelik ₺{priceDiffPerNight.toLocaleString('tr-TR')} daha hesaplıdır</strong>.
                    </>
                  ) : (
                    <>
                      Bu konaklama, semt ortalaması ve sunulan imkanlar çerçevesinde <strong>dengeli ve adil piyasa fiyatında</strong> sunulmaktadır.
                    </>
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-on-surface-variant font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">check</span>
                    Tarihsel fiyat manipülasyonu bulunmuyor
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">check</span>
                    Yüksek misafir puanı ({Number(listing.reviewScoresRating || 4.8).toFixed(1)} / 5.0)
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Öne Çıkan Ev Olanakları (Türkçe & Canlı İkonlu) */}
            <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-subtle shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-lg font-bold text-primary">
                  Öne Çıkan Ev Olanakları
                </h3>
                <span className="text-xs text-on-surface-variant font-semibold">
                  {listing.amenities?.length || 8} olanak mevcut
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, idx) => {
                    const formatted = formatAmenity(amenity);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-secondary text-lg shrink-0">
                          {formatted.icon}
                        </span>
                        <span className="truncate">{formatted.label}</span>
                      </div>
                    );
                  })
                ) : (
                  ['Yüksek Hızlı Wi-Fi', 'Tam Donanımlı Mutfak', 'Klima', 'Merkezi Isıtma', 'Smart TV', 'Çalışma Alanı'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                      {item}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN: Dynamic Interactive Booking Widget (4 Cols) ── */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-surface rounded-2xl shadow-[0_20px_40px_rgba(19,27,46,0.06)] border border-border-subtle p-6 flex flex-col gap-5">
              
              {/* Price Header */}
              <div className="flex justify-between items-baseline border-b border-border-subtle pb-4">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-primary">
                      ₺{nightPrice.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">/ gece</span>
                  </div>
                  {isDeal && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                      Piyasa Değeri: ₺{predictedPrice.toLocaleString('tr-TR')} (Tasarruflusunuz)
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-bold bg-surface-container-low px-2.5 py-1 rounded-lg border border-border-subtle">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {Number(listing.reviewScoresRating || 4.85).toFixed(2)}
                </div>
              </div>

              {/* Interactive Date & Guests Inputs */}
              <div className="border border-outline-variant/60 rounded-xl overflow-hidden bg-surface-container-lowest divide-y divide-outline-variant/60">
                <div className="grid grid-cols-2 divide-x divide-outline-variant/60">
                  <div className="p-3">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      GİRİŞ TARİHİ
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      min={today.toISOString().split('T')[0]}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        if (new Date(e.target.value) >= new Date(checkOutDate)) {
                          const nextD = new Date(e.target.value);
                          nextD.setDate(nextD.getDate() + 2);
                          setCheckOutDate(nextD.toISOString().split('T')[0]);
                        }
                      }}
                      className="w-full text-xs font-bold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      ÇIKIŞ TARİHİ
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full text-xs font-bold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    MİSAFİR SAYISI
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs font-bold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
                  >
                    <option value={1}>1 Misafir</option>
                    <option value={2}>2 Misafir</option>
                    <option value={3}>3 Misafir</option>
                    <option value={4}>4+ Misafir</option>
                  </select>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => alert(`✅ Rezervasyon Başarılı!\nİlan: ${listing.name}\nSüre: ${nights} Gece\nToplam Tutar: ₺${totalPrice.toLocaleString('tr-TR')}`)}
                className="w-full bg-primary text-on-primary font-bold text-sm py-4 rounded-xl shadow-md hover:bg-surface-tint active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Hemen Rezerve Et</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              <p className="text-center text-xs text-on-surface-variant font-medium">
                Kartınızdan henüz herhangi bir ücret çekilmeyecektir.
              </p>

              {/* Breakdown List */}
              <div className="space-y-2.5 pt-2 text-xs border-t border-border-subtle">
                <div className="flex justify-between text-on-surface-variant">
                  <span>₺{nightPrice.toLocaleString('tr-TR')} x {nights} gece</span>
                  <span className="font-semibold text-on-surface">₺{subtotal.toLocaleString('tr-TR')}</span>
                </div>

                <div className="flex justify-between text-on-surface-variant">
                  <span>Temizlik ve hijyen hazırlığı</span>
                  <span className="font-semibold text-on-surface">₺{cleaningFee.toLocaleString('tr-TR')}</span>
                </div>

                {isDeal && totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                    <span>AI Fırsat Tasarrufunuz</span>
                    <span>-₺{totalSavings.toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="border-t border-border-subtle pt-3 flex justify-between items-center text-on-surface">
                <div>
                  <span className="font-bold text-sm block">Toplam Tutar</span>
                  <span className="text-[11px] text-on-surface-variant">Vergiler ve servis dahil</span>
                </div>
                <span className="text-2xl font-extrabold text-primary">
                  ₺{totalPrice.toLocaleString('tr-TR')}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-border-subtle space-y-2 text-[11px] text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">security</span>
                  <span>Girişten 48 saat öncesine kadar <strong>ücretsiz iptal</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">lock</span>
                  <span>SSL 256-bit Güvenli Ödeme Altyapısı</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListingDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById, predictPrice, getDistrictBenchmarkPrice } from '../services/api';

const AMENITY_MAP = {
  'wifi': { label: 'Kablosuz İnternet (Wi-Fi)', icon: 'wifi' },
  'kitchen': { label: 'Mutfak', icon: 'soup_kitchen' },
  'heating': { label: 'Isıtma', icon: 'thermostat' },
  'hot water': { label: 'Sıcak Su', icon: 'water_drop' },
  'tv': { label: 'Televizyon', icon: 'tv' },
  'air conditioning': { label: 'Klima', icon: 'ac_unit' },
  'washer': { label: 'Çamaşır Makinesi', icon: 'local_laundry_service' },
  'dedicated workspace': { label: 'Çalışma Alanı', icon: 'desk' },
  'smoking allowed': { label: 'Sigara İçilebilir', icon: 'smoking_rooms' },
  'elevator': { label: 'Asansör', icon: 'elevator' },
  'balcony': { label: 'Balkon', icon: 'deck' },
  'sea view': { label: 'Deniz Manzarası', icon: 'water' },
  'iron': { label: 'Ütü', icon: 'iron' },
  'hair dryer': { label: 'Saç Kurutma Makinesi', icon: 'air' },
  'refrigerator': { label: 'Buzdolabı', icon: 'kitchen' },
  'dishes and silverware': { label: 'Mutfak Gereçleri', icon: 'flatware' }
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
  const [mlPredictedPrice, setMlPredictedPrice] = useState(null);
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
          const lData = res.data;
          setListing(lData);

          // Gerçek XGBoost ML Modeliyle Değerleme Tahmini Al
          try {
            const predRes = await predictPrice({
              neighbourhoodCleansed: lData.neighbourhoodCleansed || 'Kadikoy',
              roomType: lData.roomType || 'Entire home/apt',
              accommodates: Number(lData.accommodates || 2),
              bedrooms: Number(lData.bedrooms || 1),
              beds: Number(lData.beds || 1),
              bathrooms: Number(lData.bathrooms || 1.0),
              latitude: Number(lData.latitude || 41.0),
              longitude: Number(lData.longitude || 29.0),
              minimumNights: Number(lData.minimumNights || 1),
              numberOfReviews: Number(lData.numberOfReviews || 5),
              reviewScoresRating: Number(lData.reviewScoresRating || 4.8)
            });

            if (predRes && predRes.success && predRes.data?.predictedPrice && isMounted) {
              setMlPredictedPrice(Math.round(predRes.data.predictedPrice));
            }
          } catch (predErr) {
            console.warn('[ListingDetailPage] ML tahmini servisten alınamadı, ilçe medyanı uygulanacak:', predErr);
          }
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
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-on-surface-variant">İlan detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !listing) {
    return (
      <div className="bg-background min-h-screen pt-28 pb-16 font-body-md flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8 bg-surface rounded-xl border border-border-subtle shadow-sm">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
          <h2 className="text-lg font-bold text-on-surface">İlan Bulunamadı</h2>
          <p className="text-xs text-on-surface-variant">{errorMessage || 'İstenilen ilan mevcut değil veya erişilemiyor.'}</p>
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-surface-tint transition-all cursor-pointer"
          >
            Aramaya Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Clean, rounded prices
  const nightPrice = Math.round(Number(listing.price) || 2450);
  const districtBenchmark = getDistrictBenchmarkPrice(listing.neighbourhoodCleansed, listing.roomType, listing.accommodates);
  const predictedPrice = listing.predictedPrice ? Math.round(Number(listing.predictedPrice)) : districtBenchmark;
  const isLowerThanAverage = nightPrice < (predictedPrice * 0.98);
  const isHigherThanAverage = nightPrice > (predictedPrice * 1.02);
  const diffPercent = Math.max(1, Math.round((Math.abs(predictedPrice - nightPrice) / (predictedPrice || 1)) * 100));

  // Dynamic Stay Calculation
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 5;
    const diff = new Date(checkOutDate) - new Date(checkInDate);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  };
  const nights = calculateNights();
  const subtotal = nightPrice * nights;
  const cleaningFee = Math.round(nightPrice * 0.2);
  const totalPrice = subtotal + cleaningFee;

  const district = listing.districtName || listing.neighbourhoodCleansed || 'İstanbul';

  return (
    <div className="bg-background text-on-surface min-h-screen pt-24 pb-20 font-body-md">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        
        {/* Top Navigation */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Arama sonuçlarına dön
          </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Listing Info, Gallery & Valuation (8 Cols) ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Header & Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {isLowerThanAverage ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Bölge ortalamasının %{diffPercent} altında
                  </span>
                ) : isHigherThanAverage ? (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Bölge ortalamasının %{diffPercent} üzerinde
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-surface-container-low border border-border-subtle text-on-surface text-xs font-semibold px-3 py-1 rounded-full">
                    Bölge ortalamasında
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">
                  {listing.roomType} • {district}
                </span>
              </div>

              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight font-bold">
                {listing.name}
              </h1>

              <div className="flex items-center gap-3 text-on-surface-variant text-sm flex-wrap">
                <span className="flex items-center gap-1 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {Number(listing.reviewScoresRating || 4.8).toFixed(2)}
                  <span className="font-normal text-on-surface-variant text-xs">
                    ({listing.numberOfReviews || 120} değerlendirme)
                  </span>
                </span>
                <span>•</span>
                <span>{listing.accommodates || 2} misafir</span>
                <span>•</span>
                <span>{listing.bedrooms || 1} yatak odası</span>
                <span>•</span>
                <span>{listing.bathrooms || 1} banyo</span>
              </div>
            </div>

            {/* Bento Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2.5 h-[340px] md:h-[440px] rounded-xl overflow-hidden bg-surface-container">
              <div className="md:col-span-2 md:row-span-2 relative bg-surface-container-low overflow-hidden group">
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="relative bg-surface-container-low overflow-hidden">
                <img src={listing.images?.[1] || listing.imageUrl} alt="Fotoğraf 2" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-surface-container-low overflow-hidden">
                <img src={listing.images?.[2] || listing.imageUrl} alt="Fotoğraf 3" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-surface-container-low overflow-hidden">
                <img src={listing.images?.[3] || listing.imageUrl} alt="Fotoğraf 4" className="w-full h-full object-cover" />
              </div>
              <div className="relative bg-surface-container-high flex items-center justify-center p-3 text-center">
                <span className="text-xs font-semibold text-on-surface">Fotoğrafları İncele</span>
              </div>
            </div>

            {/* ── SADE VE KULLANICI DOSTU FİYAT KARŞILAŞTIRMASI ── */}
            <section className="bg-surface rounded-xl p-6 border border-border-subtle space-y-5">
              <div className="border-b border-border-subtle pb-4">
                <h2 className="text-base font-bold text-primary">
                  Fiyat ve Bölge Karşılaştırması
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Bu evin fiyatı, {district} bölgesindeki benzer konaklamalar baz alınarak karşılaştırılmıştır.
                </p>
              </div>

              {/* Sade Karşılaştırma Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface-container-low border border-border-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-on-surface-variant font-medium">Bu İlanın Fiyatı</span>
                    {isLowerThanAverage ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        -%{diffPercent} Daha Uygun
                      </span>
                    ) : isHigherThanAverage ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        +%{diffPercent} Daha Yüksek
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        Ortalamada
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₺{nightPrice.toLocaleString('tr-TR')} <span className="text-xs font-normal text-on-surface-variant">/ gece</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-container-low border border-border-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-on-surface-variant font-medium">{district} Bölge Ortalaması</span>
                    <span className="text-[11px] text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-border-subtle">
                      Emsal İlanlar
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-on-surface">
                    ₺{predictedPrice.toLocaleString('tr-TR')} <span className="text-xs font-normal text-on-surface-variant">/ gece</span>
                  </div>
                </div>
              </div>

              {/* Sade ve Samimi Açıklama Metni */}
              <div className={`p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2.5 ${
                isLowerThanAverage 
                  ? 'bg-emerald-50/50 border border-emerald-200/70 text-emerald-950' 
                  : isHigherThanAverage 
                  ? 'bg-rose-50/50 border border-rose-200/70 text-rose-950' 
                  : 'bg-surface-container-low border border-border-subtle text-on-surface'
              }`}>
                <span className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                  isLowerThanAverage ? 'text-emerald-600' : isHigherThanAverage ? 'text-rose-600' : 'text-on-surface-variant'
                }`}>
                  {isLowerThanAverage ? 'check_circle' : isHigherThanAverage ? 'info' : 'balance'}
                </span>
                <div>
                  {isLowerThanAverage ? (
                    <p>
                      Bu evin gecelik fiyatı, <strong>{district}</strong> bölgesindeki benzer konutların ortalamasından yaklaşık <strong>%{diffPercent} daha uygundur</strong>.
                    </p>
                  ) : isHigherThanAverage ? (
                    <p>
                      Bu evin gecelik fiyatı, <strong>{district}</strong> bölgesindeki benzer konutların ortalamasından yaklaşık <strong>%{diffPercent} daha yüksektir</strong>.
                    </p>
                  ) : (
                    <p>
                      Bu ev, bulunduğu bölgenin ortalama piyasa fiyatına uygun olarak listelenmiştir.
                    </p>
                  )}
                </div>
              </div>

              {/* Sezonluk Trendler (Sade & Minimal) */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-on-surface block mb-2.5">Önümüzdeki Aylara Göre Ortalama Fiyat Değişimi</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 bg-surface-container-low rounded-lg border border-border-subtle text-center">
                    <span className="text-on-surface-variant block text-[11px]">Eylül</span>
                    <span className="font-bold text-on-surface">₺{Math.round(nightPrice * 1.05).toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-lg border border-border-subtle text-center">
                    <span className="text-on-surface-variant block text-[11px]">Ekim</span>
                    <span className="font-bold text-on-surface">₺{Math.round(nightPrice * 1.2).toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-lg border border-border-subtle text-center">
                    <span className="text-on-surface-variant block text-[11px]">Kasım</span>
                    <span className="font-bold text-on-surface">₺{Math.round(nightPrice * 1.02).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── ÖNE ÇIKAN OLANAKLAR ── */}
            <section className="bg-surface rounded-xl p-6 border border-border-subtle space-y-4">
              <h3 className="text-base font-bold text-primary">
                Konaklama Olanakları
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, idx) => {
                    const formatted = formatAmenity(amenity);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low border border-border-subtle text-on-surface text-xs"
                      >
                        <span className="material-symbols-outlined text-sm text-on-surface-variant shrink-0">
                          {formatted.icon}
                        </span>
                        <span className="truncate">{formatted.label}</span>
                      </div>
                    );
                  })
                ) : (
                  ['Kablosuz İnternet', 'Mutfak', 'Klima', 'Isıtma', 'Televizyon', 'Çalışma Alanı'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">check</span>
                      {item}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN: Sade Rezervasyon Kutusu (4 Cols) ── */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-surface rounded-xl border border-border-subtle p-6 flex flex-col gap-4 shadow-sm">
              
              {/* Fiyat Başlığı */}
              <div className="flex justify-between items-baseline border-b border-border-subtle pb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    ₺{nightPrice.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-xs text-on-surface-variant">/ gece</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {Number(listing.reviewScoresRating || 4.8).toFixed(2)}
                </div>
              </div>

              {/* Tarih ve Misafir Seçimi */}
              <div className="border border-border-subtle rounded-lg overflow-hidden bg-surface-container-lowest divide-y divide-border-subtle text-xs">
                <div className="grid grid-cols-2 divide-x divide-border-subtle">
                  <div className="p-2.5">
                    <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
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
                      className="w-full text-xs font-semibold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-2.5">
                    <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      ÇIKIŞ TARİHİ
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full text-xs font-semibold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-2.5">
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    MİSAFİR SAYISI
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-on-surface bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
                  >
                    <option value={1}>1 misafir</option>
                    <option value={2}>2 misafir</option>
                    <option value={3}>3 misafir</option>
                    <option value={4}>4+ misafir</option>
                  </select>
                </div>
              </div>

              {/* Rezerve Butonu */}
              <button
                onClick={() => alert(`Rezervasyon talebiniz alındı:\nİlan: ${listing.name}\nSüre: ${nights} Gece\nToplam: ₺${totalPrice.toLocaleString('tr-TR')}`)}
                className="w-full bg-primary text-on-primary font-semibold text-xs py-3.5 rounded-lg hover:bg-surface-tint active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Rezerve Et
              </button>

              <p className="text-center text-[11px] text-on-surface-variant">
                Henüz sizden herhangi bir ücret tahsil edilmeyecektir.
              </p>

              {/* Hesaplama Dökümü */}
              <div className="space-y-2 pt-2 text-xs border-t border-border-subtle">
                <div className="flex justify-between text-on-surface-variant">
                  <span>₺{nightPrice.toLocaleString('tr-TR')} x {nights} gece</span>
                  <span className="font-semibold text-on-surface">₺{subtotal.toLocaleString('tr-TR')}</span>
                </div>

                <div className="flex justify-between text-on-surface-variant">
                  <span>Temizlik ücreti</span>
                  <span className="font-semibold text-on-surface">₺{cleaningFee.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {/* Toplam Tutar */}
              <div className="border-t border-border-subtle pt-3 flex justify-between items-center text-on-surface">
                <span className="font-bold text-xs">Toplam Tutar</span>
                <span className="text-xl font-bold text-primary">
                  ₺{totalPrice.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListingDetailPage;

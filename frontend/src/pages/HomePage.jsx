import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISTANBUL_NEIGHBOURHOODS } from '../data/mockListings';

const DISTRICT_CARDS = [
  {
    name: 'Kadıköy',
    icon: 'apartment',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-secondary',
    aiScore: 94,
    description: 'Kültürel dinamizm ve yüksek ulaşım erişilebilirliği ile premium değer artışı gösteren bölge.',
    price: '₺2,450',
    districtKey: 'Kadikoy'
  },
  {
    name: 'Beşiktaş',
    icon: 'storefront',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
    aiScore: 88,
    description: 'Merkezi iş alanlarına yakınlığı ve boğaz hattı avantajıyla stabil getiri sağlayan lokasyon.',
    price: '₺3,100',
    districtKey: 'Besiktas'
  },
  {
    name: 'Sarıyer',
    icon: 'park',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
    aiScore: 91,
    description: 'Yeşil alanlar ve lüks segment konutlarıyla izole ve prestijli bir konaklama deneyimi.',
    price: '₺4,800',
    districtKey: 'Sariyer'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();

  // Filter States
  const [districtQuery, setDistrictQuery] = useState('');

  // Default dates: tomorrow and 3 days after
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const next3Days = new Date();
  next3Days.setDate(next3Days.getDate() + 4);
  const next3DaysStr = next3Days.toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(tomorrowStr);
  const [checkOutDate, setCheckOutDate] = useState(next3DaysStr);
  const [dealType, setDealType] = useState('all');

  // Calculate nights
  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return 0;
    const diff = new Date(outDate) - new Date(inDate);
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  };

  const nights = calculateNights(checkInDate, checkOutDate);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (districtQuery && districtQuery !== 'all' && districtQuery !== 'Tümü') {
      params.set('neighbourhood', districtQuery);
    }
    if (checkInDate) params.set('checkIn', checkInDate);
    if (checkOutDate) params.set('checkOut', checkOutDate);
    if (nights > 0) params.set('nights', nights.toString());
    if (dealType && dealType !== 'all') params.set('dealType', dealType);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased overflow-x-hidden">

      {/* ── HERO SECTION (Full-bleed Image) ────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center w-full">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            alt="Panoramic Istanbul skyline"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&auto=format&fit=crop&q=80"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center pt-20">
          <span className="inline-block px-4 py-2 bg-surface-glass backdrop-blur-md border border-border-subtle rounded-full font-label-md text-label-md text-primary uppercase tracking-widest mb-6">
            SmartStay
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-xl text-on-primary mb-6 drop-shadow-lg">
            İstanbul'un En Akıllı <br /> Konaklama Rehberi
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-low max-w-2xl mb-12 drop-shadow-md">
            Yapay zeka ile ev fiyatlarını analiz edin, bütçenize en uygun ve gerçek değerinde olan evi saniyeler içinde bulun.
          </p>

          {/* Search Module (Premium Layered Glass) */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-surface-glass backdrop-blur-2xl border border-border-subtle rounded-xl p-8 shadow-[0_20px_60px_rgba(19,27,46,0.08)] w-full max-w-5xl text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* 1. İlçe veya Mahalle Seçimi */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  İlçe veya Mahalle
                </label>
                <div className="relative border-b border-border-subtle focus-within:border-primary transition-colors flex items-center">
                  <span className="material-symbols-outlined absolute left-0 bottom-2 text-on-surface-variant">location_on</span>
                  <input
                    value={districtQuery}
                    onChange={(e) => setDistrictQuery(e.target.value)}
                    list="istanbul-districts-list"
                    className="w-full bg-transparent border-none pl-8 pb-2 pt-2 focus:ring-0 font-body-lg text-on-surface placeholder:text-ink-muted cursor-pointer"
                    placeholder="Örn: Kadıköy, Beşiktaş"
                    type="text"
                  />
                  <datalist id="istanbul-districts-list">
                    {ISTANBUL_NEIGHBOURHOODS.filter(n => n.value !== 'all').map(n => (
                      <option key={n.value} value={n.label} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 2. Gerçek Tarih Seçimi (Giriş - Çıkış) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Giriş - Çıkış
                  </label>
                  {nights > 0 && (
                    <span className="text-[11px] font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">
                      {nights} Gece
                    </span>
                  )}
                </div>
                <div className="relative border-b border-border-subtle focus-within:border-primary transition-colors flex items-center gap-2 pb-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">calendar_month</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="date"
                      min={todayStr}
                      value={checkInDate}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        if (new Date(e.target.value) >= new Date(checkOutDate)) {
                          const nextD = new Date(e.target.value);
                          nextD.setDate(nextD.getDate() + 2);
                          setCheckOutDate(nextD.toISOString().split('T')[0]);
                        }
                      }}
                      className="bg-transparent border-none p-0 focus:ring-0 text-xs font-semibold text-on-surface cursor-pointer w-28"
                      title="Giriş Tarihi"
                    />
                    <span className="text-on-surface-variant text-xs font-bold">→</span>
                    <input
                      type="date"
                      min={checkInDate || todayStr}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-xs font-semibold text-on-surface cursor-pointer w-28"
                      title="Çıkış Tarihi"
                    />
                  </div>
                </div>
              </div>

              {/* 3. AI Değerleme Filtresi */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  AI Değer Skoru
                </label>
                <div className="relative border-b border-border-subtle focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined absolute left-0 bottom-2 text-on-surface-variant">analytics</span>
                  <select
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value)}
                    className="w-full bg-transparent border-none pl-8 pb-2 pt-2 focus:ring-0 font-body-lg text-on-surface appearance-none cursor-pointer pr-6"
                  >
                    <option value="all">Tümü (Tüm İlanlar)</option>
                    <option value="opportunity">🔥 Yüksek Fırsat (Piyasanın Altında)</option>
                    <option value="fair">⚖️ Adil Değer (Piyasa Fiyatında)</option>
                    <option value="rating">⭐ Yüksek Puanlılar (4.8+)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md uppercase tracking-widest hover:bg-surface-tint transition-all shadow-lg flex items-center gap-3 cursor-pointer active:scale-95"
              >
                Bul
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── FEATURED NEIGHBORHOODS ──────────────────────────── */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto mt-12">
        <div className="mb-16">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
            Popüler İstanbul Semtleri
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Gerçek zamanlı piyasa verileri ve AI destekli büyüme skorlarıyla en değerli bölgeleri keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {DISTRICT_CARDS.map((district) => (
            <div
              key={district.name}
              onClick={() => navigate(`/search?neighbourhood=${district.districtKey}`)}
              className="bg-surface rounded-xl border border-border-subtle p-8 hover:shadow-[0_20px_40px_rgba(19,27,46,0.05)] transition-shadow group cursor-pointer flex flex-col justify-between h-[400px]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${district.iconBg} rounded-full flex items-center justify-center ${district.iconColor}`}>
                    <span className="material-symbols-outlined fill">{district.icon}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-low text-primary rounded-full font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm text-green-600">trending_up</span>
                    {district.aiScore} AI Skoru
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">{district.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{district.description}</p>
              </div>
              <div>
                <div className="h-px w-full bg-border-subtle mb-6"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
                      Ort. Gecelik
                    </p>
                    <p className="font-headline-sm text-headline-sm text-primary">{district.price}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SMARTSTAY AI ──────────────────────────── */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto bg-surface-container-low/50">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">
            Neden SmartStay?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Kurumsal düzeyde veri bütünlüğü ile gayrimenkul kiralama sürecinizi optimize ediyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-primary font-light">query_stats</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-4">AI Fiyat Analizi</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Milyonlarca veri noktasını işleyerek, manipülasyondan uzak, tamamen gerçekçi ve adil piyasa değerlerini sunarız.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-primary font-light">lightbulb</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Akıllı Öneriler</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Kişisel tercihlerinize ve bütçe aralığınıza göre optimize edilmiş, gizli fırsatları içeren özel konaklama listeleri oluşturulur.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-primary font-light">dataset</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Şeffaf Veriler</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Geçmiş fiyat trendleri, bölge analizleri ve arz-talep dengesini açıkça sunarak bilinçli kararlar almanızı sağlarız.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

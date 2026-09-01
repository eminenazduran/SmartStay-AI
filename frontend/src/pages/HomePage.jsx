import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DISTRICT_CARDS = [
  {
    name: 'Kadıköy',
    tag: 'Yüksek Talep',
    tagClass: 'bg-[#f0edef] text-[#1b1b1d]',
    trend: '%12 Artış',
    trendIcon: 'trending_up',
    trendColor: 'text-[#4648d4]',
    price: '2,500₺',
    score: '9.2',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80',
    districtKey: 'Kadikoy'
  },
  {
    name: 'Beşiktaş',
    tag: 'Premium',
    tagClass: 'bg-[#fcdeb5] text-[#271901]',
    trend: '%8 Artış',
    trendIcon: 'trending_up',
    trendColor: 'text-[#574425]',
    price: '3,200₺',
    score: '8.8',
    img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&auto=format&fit=crop&q=80',
    districtKey: 'Besiktas'
  },
  {
    name: 'Beyoğlu',
    tag: 'Turistik',
    tagClass: 'bg-[#e4e2e4] text-[#45464d]',
    trend: 'Sabit',
    trendIcon: 'trending_flat',
    trendColor: 'text-[#76777d]',
    price: '2,800₺',
    score: '8.5',
    img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&auto=format&fit=crop&q=80',
    districtKey: 'Beyoglu'
  },
  {
    name: 'Adalar',
    tag: 'Sezonsal',
    tagClass: 'bg-[#f6f3f5] text-[#45464d] border border-[#e2e8f0]',
    trend: '%3 Düşüş',
    trendIcon: 'trending_down',
    trendColor: 'text-[#ba1a1a]',
    price: '4,500₺',
    score: '7.9',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    districtKey: 'Adalar'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [districtQuery, setDistrictQuery] = useState('');
  const [rankType, setRankType] = useState('AI Value Rank');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParam = districtQuery ? `?neighbourhood=${encodeURIComponent(districtQuery)}` : '';
    navigate(`/search${queryParam}`);
  };

  return (
    <div className="flex-grow pt-20 pb-16 px-4 md:px-16 max-w-[1440px] mx-auto w-full space-y-16">
      {/* ── HERO SECTION ───────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden bg-[#131b2e] text-white min-h-[500px] flex items-center shadow-lg">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&auto=format&fit=crop&q=80')"
            }}
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/60 to-transparent" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center space-y-8">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            İstanbul'un En Akıllı Konaklama Rehberi
          </h1>
          <p className="text-base sm:text-lg text-[#bec6e0] max-w-2xl mx-auto font-normal">
            Yapay zeka ile ev fiyatlarını analiz edin, bütçenize en uygun ve gerçek değerinde olan evi saniyeler içinde bulun.
          </p>

          {/* Search Form Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-8 max-w-4xl mx-auto text-left flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d]">
                location_on
              </span>
              <input
                value={districtQuery}
                onChange={(e) => setDistrictQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white text-[#1b1b1d] rounded-xl border border-[#c6c6cd] focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-colors text-sm h-full font-medium"
                placeholder="İlçe veya Mahalle (örn. Kadıköy, Beşiktaş)"
                type="text"
              />
            </div>

            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#45464d]">
                calendar_month
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-white text-[#1b1b1d] rounded-xl border border-[#c6c6cd] focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-colors text-sm h-full font-medium"
                placeholder="Giriş - Çıkış Tarihi"
                type="text"
                readOnly
                defaultValue="Esnek Tarihler"
              />
            </div>

            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4648d4]">
                auto_awesome
              </span>
              <select
                value={rankType}
                onChange={(e) => setRankType(e.target.value)}
                className="w-full pl-12 pr-8 py-4 bg-white text-[#1b1b1d] rounded-xl border border-[#c6c6cd] focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-colors text-sm h-full appearance-none font-medium cursor-pointer"
              >
                <option value="AI Value Rank">AI Value Rank</option>
                <option value="Highest ROI">Highest ROI</option>
                <option value="Undervalued">Fırsat (Undervalued)</option>
                <option value="Premium">Premium Seçenekler</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#4648d4] hover:bg-[#4648d4]/90 text-white font-semibold text-sm px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 h-full min-h-[56px] shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined">search</span>
              Bul
            </button>
          </form>
        </div>
      </section>

      {/* ── POPULAR SEMTLER ──────────────────────────── */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1b1d]">
              Popüler İstanbul Semtleri
            </h2>
            <p className="text-sm text-[#45464d] mt-2">
              Yapay zeka tahminlerine göre öne çıkan bölgeler
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-[#4648d4] font-semibold text-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISTRICT_CARDS.map((district) => (
            <div
              key={district.name}
              onClick={() => navigate(`/search?neighbourhood=${district.districtKey}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden border border-[#e2e8f0] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="h-56 relative overflow-hidden bg-slate-100">
                <img
                  src={district.img}
                  alt={district.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
                  <span className={`material-symbols-outlined ${district.trendColor} text-sm`}>
                    {district.trendIcon}
                  </span>
                  <span className={`text-xs font-semibold ${district.trendColor}`}>
                    {district.trend}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#1b1b1d]">{district.name}</h3>
                  <span className={`${district.tagClass} px-2.5 py-1 rounded-md text-xs font-semibold`}>
                    {district.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#45464d]">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  <span className="text-sm">Ortalama: {district.price} / gece</span>
                </div>
                <div className="pt-4 border-t border-[#e2e8f0] flex justify-between items-center">
                  <span className="text-xs text-[#45464d]">
                    AI Puanı: <span className="text-[#4648d4] font-bold text-sm">{district.score}</span>/10
                  </span>
                  <button className="text-[#4648d4] hover:bg-[#4648d4]/10 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEDEN SMARTSTAY AI ───────────────────────── */}
      <section className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-[#e2e8f0]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b1b1d]">Neden SmartStay AI?</h2>
          <p className="text-base text-[#45464d] mt-4 leading-relaxed">
            Milyonlarca veri noktasını saniyeler içinde analiz eden yapay zeka motorumuzla, konaklama kararlarınızı veriye dayalı alın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 bg-[#131b2e] text-[#7c839b] rounded-2xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">analytics</span>
            </div>
            <h3 className="text-lg font-bold text-[#1b1b1d]">Dinamik Fiyat Analizi</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Gerçek zamanlı piyasa verileri ve tarihsel trendleri kullanarak bir evin gerçek değerini milisaniyeler içinde hesaplar.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 bg-[#6063ee] text-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="text-lg font-bold text-[#1b1b1d]">Akıllı Öneriler</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Bütçenize, tercihlerinize ve lokasyona göre kişiselleştirilmiş, yüksek performanslı konaklama önerileri sunar.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 bg-[#eae7e9] text-[#1b1b1d] rounded-2xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="text-lg font-bold text-[#1b1b1d]">Şeffaf Veri</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Gizli ücretler veya manipüle edilmiş fiyatlar olmadan, %100 tarafsız ve algoritmik olarak doğrulanmış içgörüler.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

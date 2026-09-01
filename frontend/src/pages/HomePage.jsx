import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Check, Sparkles, MapPin, Star, Shield, Heart, Zap, Home, DoorOpen, Hotel, Building2 } from 'lucide-react';

/* İlçe kartları — value alanları mock data ile BİREBİR eşleşiyor */
const DISTRICTS = [
  { value: 'Besiktas',  label: 'Beşiktaş',  img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop&q=80' },
  { value: 'Kadikoy',   label: 'Kadıköy',   img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop&q=80' },
  { value: 'Beyoglu',   label: 'Beyoğlu',   img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop&q=80' },
  { value: 'Fatih',     label: 'Fatih',      img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=400&h=300&fit=crop&q=80' },
  { value: 'Sisli',     label: 'Şişli',      img: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=300&fit=crop&q=80' },
  { value: 'Kadikoy',   label: 'Üsküdar',   img: 'https://images.unsplash.com/photo-1621783865289-0eb7db68c88f?w=400&h=300&fit=crop&q=80' },
];

/* Oda türleri — id'ler mock data roomType ile BİREBİR eşleşiyor */
const ROOM_CARDS = [
  { id: 'Entire home/apt', icon: Home,      label: 'Tüm Ev / Daire', desc: 'Size özel bağımsız alan' },
  { id: 'Private room',    icon: DoorOpen,  label: 'Özel Oda',        desc: 'Ev sahibiyle paylaşımlı' },
  { id: 'Hotel room',      icon: Hotel,     label: 'Otel Odası',      desc: 'Profesyonel hizmet' },
  { id: 'Shared room',     icon: Building2, label: 'Ortak Oda',       desc: 'Bütçe dostu seçenek' },
];

const FEATURES = [
  { icon: Zap,    title: 'Akıllı Fiyat Analizi',   desc: 'Her ilanın gerçek piyasa değerini hesaplar, sizi yüksek fiyattan korur.', color: 'from-amber-500 to-orange-600' },
  { icon: Heart,  title: 'Kişisel Öneriler',        desc: 'İhtiyaçlarınıza göre en uygun ilanları otomatik olarak size sunar.',    color: 'from-rose-500 to-pink-600' },
  { icon: MapPin, title: 'Haritada Keşfet',         desc: 'Tüm ilanları interaktif haritada görün, konuma göre seçin.',             color: 'from-violet-500 to-indigo-600' },
  { icon: Shield, title: 'Fırsat Uyarıları',        desc: 'Piyasa değerinin altındaki ilanları anında tespit eder, kaçırmayın.',   color: 'from-emerald-500 to-teal-600' },
];

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-40 -right-20 w-72 h-72 bg-rose-500/[0.03] rounded-full blur-[80px]" />
          <div className="absolute bottom-40 -left-20 w-72 h-72 bg-violet-500/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
              İstanbul'da<br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
                mükemmel konaklama
              </span>
              <br />sizi bekliyor.
            </h1>
            <p className="text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
              Binlerce ilan arasından bütçenize, konumunuza ve ihtiyaçlarınıza en uygun yeri saniyeler içinde bulun.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto">
            <button onClick={() => navigate('/search')}
              className="w-full flex items-center gap-4 px-6 py-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl text-left hover:bg-white/[0.08] hover:border-white/[0.12] transition-all group cursor-pointer">
              <Search className="w-5 h-5 text-white/30 group-hover:text-orange-400 transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/60 font-medium">Nereye gitmek istiyorsunuz?</p>
                <p className="text-xs text-white/25 mt-0.5">İlçe, fiyat, oda tipi ile arayın</p>
              </div>
              <div className="btn-accent rounded-xl px-4 py-2 text-xs shrink-0">Ara</div>
            </button>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-8">
            {[
              { val: '22.665+', lab: 'Aktif İlan' },
              { val: '4.85★',  lab: 'Ort. Puan' },
              { val: '%100',   lab: 'Ücretsiz' },
            ].map(({ val, lab }) => (
              <div key={lab} className="text-center">
                <p className="text-lg font-extrabold text-white">{val}</p>
                <p className="text-[11px] text-white/25 mt-0.5">{lab}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ İLÇE KEŞFİ ════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">İlçeye göre keşfedin</h2>
            <p className="text-white/30 text-sm">Her ilçenin kendine özgü dokusunu keşfedin</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DISTRICTS.map(({ value, label, img }) => (
              <button key={label} onClick={() => navigate(`/search?neighbourhood=${value}`)}
                className="group relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden card-lift">
                <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg">{label}</p>
                  <p className="text-white/50 text-xs mt-0.5">Konaklamaları keşfet →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ODA TÜRLERİ ════════ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Konaklama türleri</h2>
            <p className="text-white/30 text-sm">Aradığınız rahatlık seviyesine uygun seçenek</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ROOM_CARDS.map(({ id, icon: Icon, label, desc }) => (
              <button key={id} onClick={() => navigate(`/search?roomType=${encodeURIComponent(id)}`)}
                className="group text-left p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all space-y-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/10 flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-rose-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{label}</p>
                  <p className="text-xs text-white/30 mt-1">{desc}</p>
                </div>
                <p className="text-xs font-semibold text-orange-400/80 group-hover:text-orange-400 transition-colors">
                  İlanları gör →
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ÖZELLİKLER ════════ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em]">Neden SmartStay?</p>
            <h2 className="text-3xl font-extrabold text-white">
              Konaklama ararken avantaj sizde olsun
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h3 className="font-bold text-white text-sm">{title}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ NASIL ÇALIŞIR ════════ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-14">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em]">Nasıl Çalışır?</p>
            <h2 className="text-3xl font-extrabold text-white">3 adımda ideal konaklamayı bulun</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Kriterlerinizi belirleyin', desc: 'Konum, bütçe, misafir sayısı ve olanakları seçin.' },
              { n: '2', title: 'Akıllı eşleştirme', desc: 'Sistemimiz en uygun ilanları sizin için sıralar.' },
              { n: '3', title: 'Fırsatı yakalayın', desc: 'Piyasa değerinin altındaki fırsatları öne çıkarırız.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/15 to-rose-500/10 border border-orange-500/15 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-black text-orange-400">{n}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Hayalinizdeki konaklamayı<br />
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">bugün keşfedin.</span>
            </h2>
            <p className="text-white/30 text-sm max-w-sm mx-auto">Ücretsiz, kayıt gerektirmez. Hemen aramaya başlayın.</p>
          </div>

          <button onClick={() => navigate('/search')} className="btn-accent text-base px-10 py-4 rounded-2xl gap-3">
            <Search className="w-5 h-5" />
            Aramaya Başla
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap justify-center gap-5 pt-2">
            {['Ücretsiz', 'Kayıt gerekmez', '22.000+ ilan'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-white/25">
                <Check className="w-3 h-3 text-orange-500/60" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">SmartStay</span> © 2026
          </div>
          <p>İstanbul Konaklama Platformu</p>
        </div>
      </footer>
    </div>
  );
};

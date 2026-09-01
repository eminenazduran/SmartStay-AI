import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_LISTINGS } from '../data/mockListings';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [alarmDistrict, setAlarmDistrict] = useState('');
  const [alarms, setAlarms] = useState(['Kadıköy', 'Beşiktaş']);

  const addAlarm = (e) => {
    e.preventDefault();
    if (alarmDistrict.trim() && !alarms.includes(alarmDistrict.trim())) {
      setAlarms([...alarms, alarmDistrict.trim()]);
      setAlarmDistrict('');
    }
  };

  const removeAlarm = (item) => {
    setAlarms(alarms.filter((a) => a !== item));
  };

  return (
    <div className="flex min-h-screen bg-[#fcf8fa] text-[#1b1b1d] font-body-md pt-16">
      {/* ── SIDEBAR NAVIGATION (Desktop) ────────────────────────────── */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] hidden md:flex flex-col bg-[#f6f3f5] shadow-sm z-40 border-r border-[#e2e8f0] py-8">
        <div className="px-8 mb-8 flex items-center gap-4">
          <img
            className="w-12 h-12 rounded-full object-cover shadow-sm border border-white"
            alt="Host Avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          />
          <div>
            <h2 className="font-bold text-base text-[#1b1b1d]">Host Dashboard</h2>
            <p className="text-xs text-[#45464d]">İlçe: Beyoğlu, İstanbul</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4">
          <Link
            to="/dashboard"
            className="bg-[#131b2e] text-white rounded-xl px-5 py-3.5 flex items-center gap-4 transition-all font-semibold text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span>Dashboard</span>
          </Link>
          <Link
            to="/search"
            className="text-[#45464d] hover:bg-[#eae7e9] hover:text-[#1b1b1d] rounded-xl px-5 py-3.5 flex items-center gap-4 transition-all font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-xl">map</span>
            <span>Explore</span>
          </Link>
          <Link
            to="/dashboard"
            className="text-[#45464d] hover:bg-[#eae7e9] hover:text-[#1b1b1d] rounded-xl px-5 py-3.5 flex items-center gap-4 transition-all font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-xl">query_stats</span>
            <span>Analytics</span>
          </Link>
          <Link
            to="/dashboard"
            className="text-[#45464d] hover:bg-[#eae7e9] hover:text-[#1b1b1d] rounded-xl px-5 py-3.5 flex items-center gap-4 transition-all font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-xl">bookmark</span>
            <span>Saved</span>
          </Link>
        </nav>

        <div className="mt-auto px-6 mb-4">
          <button className="w-full bg-[#4648d4] text-white font-semibold text-sm py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            Get Pro Insights
          </button>
        </div>

        <div className="px-4 flex flex-col gap-1">
          <button
            onClick={() => navigate('/')}
            className="text-[#45464d] hover:bg-[#eae7e9] hover:text-[#1b1b1d] rounded-xl px-5 py-3 flex items-center gap-4 transition-all text-sm font-semibold w-full text-left"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN DASHBOARD CONTENT ───────────────────────────────────── */}
      <main className="flex-1 ml-0 md:ml-[280px] p-6 md:p-12 w-full max-w-[1440px]">
        {/* Dashboard Header */}
        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b1b1d] mb-2">
            Hoş geldiniz, Ahmet.
          </h1>
          <p className="text-sm md:text-base text-[#45464d] flex items-center gap-3 flex-wrap">
            İstanbul piyasası bugün{' '}
            <span className="text-[#98805d] font-semibold bg-[#dec29a]/30 px-3 py-1 rounded-md flex items-center text-xs">
              <span className="material-symbols-outlined text-[18px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                trending_up
              </span>{' '}
              %2 hareketli.
            </span>
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 1. Takip Edilen İlanlar (Saved Homes) - 8 Cols */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 md:p-8 card-shadow border border-[#e2e8f0]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1b1b1d] flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#4648d4]">bookmark</span>
                Takip Edilen İlanlar
              </h3>
              <button onClick={() => navigate('/search')} className="text-[#4648d4] text-xs font-semibold hover:underline">
                Tümünü Gör
              </button>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div
                onClick={() => navigate('/listing/955886')}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white hover:bg-[#f6f3f5] transition-colors border border-[#e2e8f0] cursor-pointer"
              >
                <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={MOCK_LISTINGS[1].imageUrl}
                    alt="Saved 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-[#1b1b1d] truncate mb-0.5">
                    Beyoğlu Modern Loft
                  </h4>
                  <p className="text-xs text-[#45464d] truncate">Cihangir Mah. 2+1</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base font-extrabold text-[#1b1b1d]">
                    ₺45,000<span className="text-xs text-[#76777d] font-normal">/ay</span>
                  </div>
                  <div className="text-xs font-bold text-[#98805d] flex items-center sm:justify-end gap-0.5 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span> ₺2,000
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => navigate('/listing/6983979')}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white hover:bg-[#f6f3f5] transition-colors border border-[#e2e8f0] cursor-pointer"
              >
                <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={MOCK_LISTINGS[2].imageUrl}
                    alt="Saved 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-[#1b1b1d] truncate mb-0.5">
                    Galata Tarihi Stüdyo
                  </h4>
                  <p className="text-xs text-[#45464d] truncate">Galata. 1+0</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-base font-extrabold text-[#1b1b1d]">
                    ₺32,000<span className="text-xs text-[#76777d] font-normal">/ay</span>
                  </div>
                  <div className="text-xs font-bold text-[#ba1a1a] flex items-center sm:justify-end gap-0.5 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span> ₺500
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bölge Analizi (Map Zone) - 4 Cols */}
          <div className="md:col-span-4 bg-white rounded-2xl overflow-hidden card-shadow border border-[#e2e8f0] flex flex-col relative">
            <div className="p-6 pb-3 z-10 relative bg-white">
              <h3 className="text-lg font-bold text-[#1b1b1d] flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#4648d4]">map</span>
                Bölge Analizi
              </h3>
              <p className="text-xs text-[#45464d] mt-1">Sıcak & Soğuk Bölgeler</p>
            </div>
            <div className="flex-1 min-h-[220px] relative bg-[#f0edef]">
              <img
                src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80"
                alt="Map Zone"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
              />
              <div className="absolute top-[35%] left-[35%] w-4 h-4 bg-[#ba1a1a] rounded-full shadow-[0_0_15px_rgba(186,26,26,0.8)] animate-pulse border-2 border-white"></div>
              <div className="absolute top-[60%] left-[55%] w-4 h-4 bg-[#dec29a] rounded-full shadow-[0_0_15px_rgba(222,194,154,0.8)] animate-pulse border-2 border-white"></div>
              <div className="absolute top-[25%] left-[70%] w-4 h-4 bg-[#4648d4] rounded-full shadow-[0_0_15px_rgba(70,72,212,0.8)] border-2 border-white"></div>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-3.5 flex justify-between items-center text-xs font-semibold border-t border-[#e2e8f0] z-10">
              <span className="flex items-center gap-1.5 text-[#1b1b1d]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> Yüksek Talep
              </span>
              <span className="flex items-center gap-1.5 text-[#1b1b1d]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dec29a]"></span> Fırsat Bölgesi
              </span>
            </div>
          </div>

          {/* 3. AI Önerileri - 6 Cols */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 md:p-8 card-shadow relative overflow-hidden group border border-[#e1e0ff]">
            <div className="absolute inset-0 bg-ai-purple-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
            <h3 className="text-xl font-bold text-[#1b1b1d] flex items-center gap-2.5 mb-4 relative z-10">
              <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              AI Önerileri
            </h3>
            <div className="bg-[#f6f3f5] rounded-xl p-5 border border-[#e2e8f0] mb-5 relative z-10">
              <p className="text-sm text-[#1b1b1d] leading-relaxed">
                Bütçenize uygun <strong className="text-[#4648d4]">3 yeni ilan</strong> bulundu. Yatırım getirisi yüksek bölgelerde analiz edildi.
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="w-full bg-white text-[#1b1b1d] border border-[#e2e8f0] font-semibold text-xs py-3.5 rounded-xl hover:bg-[#f6f3f5] transition-colors relative z-10 shadow-sm cursor-pointer"
            >
              Önerileri İncele
            </button>
          </div>

          {/* 4. Fiyat Alarmı - 6 Cols */}
          <div className="md:col-span-6 bg-white rounded-2xl p-6 md:p-8 card-shadow border border-[#e2e8f0]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1b1b1d] flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#76777d]">notifications_active</span>
                Fiyat Alarmı
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-[#c6c6cd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4648d4]"></div>
              </label>
            </div>
            <p className="text-xs text-[#45464d] mb-4">
              Belirli ilçeler için fiyat düşüşlerinden anında haberdar olun.
            </p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {alarms.map((a) => (
                <span key={a} className="px-3 py-1.5 bg-[#f0edef] rounded-full text-xs font-semibold text-[#1b1b1d] flex items-center gap-1.5">
                  {a}
                  <span onClick={() => removeAlarm(a)} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-[#ba1a1a]">
                    close
                  </span>
                </span>
              ))}
            </div>
            <form onSubmit={addAlarm} className="flex gap-2">
              <input
                value={alarmDistrict}
                onChange={(e) => setAlarmDistrict(e.target.value)}
                className="flex-1 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-xs text-[#1b1b1d] focus:outline-none focus:border-[#4648d4]"
                placeholder="İlçe ekle (örn. Kadıköy)..."
                type="text"
              />
              <button type="submit" className="bg-[#4648d4] text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

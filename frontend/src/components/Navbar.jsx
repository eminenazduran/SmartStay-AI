import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Home, Search, Map } from 'lucide-react';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all ${
      isHome ? 'bg-transparent' : 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-extrabold text-white tracking-tight">SmartStay</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Ana Sayfa', icon: Home },
              { to: '/search', label: 'İlan Ara', icon: Search },
              { to: '/search#map', label: 'Harita', icon: Map },
            ].map(({ to, label, icon: I }) => (
              <button key={label} onClick={() => navigate(to)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium">
                <I className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1 bg-[#0a0a0f]/95 backdrop-blur-xl">
            {[
              { to: '/', label: 'Ana Sayfa', icon: Home },
              { to: '/search', label: 'İlan Ara', icon: Search },
            ].map(({ to, label, icon: I }) => (
              <button key={label} onClick={() => { navigate(to); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5">
                <I className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

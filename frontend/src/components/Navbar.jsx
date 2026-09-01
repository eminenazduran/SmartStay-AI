import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf8fa]/85 backdrop-blur-xl border-b border-[#e2e8f0]/80 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="material-symbols-outlined text-[#4648d4] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            insights
          </span>
          <span className="font-extrabold text-xl tracking-tight text-[#1b1b1d]">
            SmartStay AI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/"
            className={`font-semibold text-sm transition-all py-1 border-b-2 ${
              isActive('/')
                ? 'text-[#4648d4] border-[#4648d4]'
                : 'text-[#45464d] border-transparent hover:text-[#1b1b1d]'
            }`}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/search"
            className={`font-semibold text-sm transition-all py-1 border-b-2 ${
              isActive('/search')
                ? 'text-[#4648d4] border-[#4648d4]'
                : 'text-[#45464d] border-transparent hover:text-[#1b1b1d]'
            }`}
          >
            İlan Ara & Keşfet
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => navigate('/search')}
            className="bg-[#4648d4] hover:bg-[#4648d4]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            İlanları İncele
          </button>
        </div>
      </div>
    </nav>
  );
};

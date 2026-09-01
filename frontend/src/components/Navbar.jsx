import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf8fa]/80 backdrop-blur-xl border-b border-[#e2e8f0]/80 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-[#4648d4] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            insights
          </span>
          <span className="font-extrabold text-xl tracking-tight text-[#1b1b1d]">
            SmartStay AI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/search"
            className={`font-semibold text-sm transition-all py-1 border-b-2 ${
              isActive('/search')
                ? 'text-[#4648d4] border-[#4648d4]'
                : 'text-[#45464d] border-transparent hover:text-[#1b1b1d]'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/dashboard"
            className={`font-semibold text-sm transition-all py-1 border-b-2 ${
              isActive('/dashboard')
                ? 'text-[#4648d4] border-[#4648d4]'
                : 'text-[#45464d] border-transparent hover:text-[#1b1b1d]'
            }`}
          >
            AI Insights
          </Link>
          <Link
            to="/search"
            className="font-semibold text-sm text-[#45464d] border-b-2 border-transparent hover:text-[#1b1b1d] transition-all py-1"
          >
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="font-semibold text-sm text-[#45464d] border-b-2 border-transparent hover:text-[#1b1b1d] transition-all py-1"
          >
            Host Dashboard
          </Link>
        </div>

        {/* Right Trailing Icons */}
        <div className="flex items-center gap-2 md:gap-3 text-[#1b1b1d]">
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Notifications"
            className="hover:bg-[#f0edef] rounded-xl p-2 transition-colors active:scale-95"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Account"
            className="hover:bg-[#f0edef] rounded-xl p-2 transition-colors active:scale-95 flex items-center gap-1.5"
            title="User Account"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

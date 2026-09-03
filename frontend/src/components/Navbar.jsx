import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-surface-glass backdrop-blur-3xl border-b border-border-subtle fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-4 sm:px-6 md:px-margin-desktop">
      <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 max-w-container-max mx-auto w-full justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <Logo className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105 shrink-0" />
          <span className="text-lg sm:text-xl font-bold text-primary tracking-tight">
            SmartStay
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className={`font-semibold text-sm transition-colors duration-300 pb-1 border-b-2 ${
              isActive('/')
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            Keşfet
          </Link>
          <Link
            to="/search"
            className={`font-semibold text-sm transition-colors duration-300 pb-1 border-b-2 ${
              isActive('/search')
                ? 'text-primary border-primary'
                : 'text-on-surface-variant border-transparent hover:text-primary'
            }`}
          >
            Analiz
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/search')}
            className="bg-primary text-on-primary px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-surface-tint transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            İlanları İncele
          </button>
        </div>
      </div>
    </header>
  );
};

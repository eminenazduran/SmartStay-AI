import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-surface-glass backdrop-blur-3xl border-b border-border-subtle fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop">
      <div className="flex items-center gap-12 max-w-container-max mx-auto w-full justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span
            className="material-symbols-outlined text-secondary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            insights
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
            SmartStay AI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8">
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
            AI Analiz
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/search')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-colors cursor-pointer shadow-sm"
          >
            İlanları İncele
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Sparkles, Home, MapPin, BrainCircuit, Activity } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-primary-500 to-emerald-400 p-[2px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SmartStay
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Akıllı Konaklama & Değerleme
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#listings" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5">
              <Home className="w-4 h-4 text-slate-400" />
              <span>İlanlar</span>
            </a>
            <a href="#map" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Harita</span>
            </a>
            <a href="#ai-pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5">
              <BrainCircuit className="w-4 h-4 text-slate-400" />
              <span>AI Değerleme</span>
            </a>
          </nav>

          {/* System Status Pill */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-slate-300">FastAPI & .NET 10 Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-border-subtle w-full py-section-gap px-margin-mobile md:px-margin-desktop mt-auto">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
        <div>
          <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary mb-4 block tracking-tight">
            SmartStay AI
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface mt-2 max-w-md opacity-80">
            © 2026 SmartStay AI Istanbul. Institutional Grade Real Estate Data.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
          <Link to="/search" className="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors">
            Semt Rehberi
          </Link>
          <a href="#" className="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors">
            Gizlilik Politikası
          </a>
          <a href="#" className="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors">
            Kullanım Koşulları
          </a>
          <a href="#" className="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors">
            Çerez Politikası
          </a>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-[#e2e8f0]/80 bg-white grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 max-w-[1440px] mx-auto mt-auto">
      <div className="col-span-1 space-y-4">
        <span className="font-extrabold text-xl text-[#1b1b1d]">SmartStay AI</span>
        <p className="text-sm text-[#45464d]">
          © 2026 SmartStay AI Istanbul. Powered by Property Intelligence.
        </p>
      </div>
      <div className="col-span-1 md:col-span-3 flex justify-start md:justify-end gap-8 items-center flex-wrap">
        <Link to="#" className="text-sm text-[#45464d] hover:text-[#1b1b1d] transition-colors">
          Terms
        </Link>
        <Link to="#" className="text-sm text-[#45464d] hover:text-[#1b1b1d] transition-colors">
          Privacy
        </Link>
        <Link to="#" className="text-sm text-[#45464d] hover:text-[#1b1b1d] transition-colors">
          Sitemap
        </Link>
        <Link to="/search" className="text-sm text-[#45464d] hover:text-[#1b1b1d] transition-colors">
          District Guide
        </Link>
      </div>
    </footer>
  );
};

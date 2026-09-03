import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Lazy-loaded route components for optimal performance and code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));

// Reusable page loading fallback
function PageLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-on-surface-variant tracking-wide">Yükleniyor...</p>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  return (
    <div
      className={`bg-background text-on-surface flex flex-col font-sans selection:bg-secondary selection:text-on-secondary antialiased ${
        isSearchPage ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <Navbar />
      <div className={`flex-1 flex flex-col ${isSearchPage ? 'h-[calc(100vh-80px)] overflow-hidden' : ''}`}>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
          </Routes>
        </Suspense>
      </div>
      {!isSearchPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;

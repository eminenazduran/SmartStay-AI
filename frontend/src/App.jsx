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
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-on-surface-variant tracking-wide">Yükleniyor...</p>
    </div>
  );
}

// Global Error Boundary to prevent any blank white screen crash
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SmartStay ErrorBoundary] Yakalanan Hata:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-on-surface">
          <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border-subtle shadow-lg text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">info</span>
            <h2 className="text-lg font-bold text-primary">Sayfa Görüntülenemedi</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              İlan detayları işlenirken beklenmedik bir durum oluştu.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/search';
              }}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-surface-tint transition-all cursor-pointer"
            >
              Arama Sayfasına Dön
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/listing/:id" element={<ListingDetailPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
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

import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import VisitTracker from './components/VisitTracker';
import IntroAnimation from './components/IntroAnimation';
import Footer from './components/Footer';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const SubmitReview = lazy(() => import('./pages/SubmitReview'));
const Profile = lazy(() => import('./pages/Profile'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Payments = lazy(() => import('./pages/Payments'));
const RankingsPage = lazy(() => import('./pages/RankingsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/Privacy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const SupabaseTest = lazy(() => import('./components/SupabaseTest'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
        <ScrollToTop />
        <IntroAnimation />
        <div className="flex flex-col min-h-screen font-sans text-gray-900">
          <VisitTracker />
          <Navbar />
          <main className="flex-grow page-transition">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/test-supabase" element={<SupabaseTest />} />
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitReview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
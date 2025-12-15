import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import VisitTracker from './components/VisitTracker';
import IntroAnimation from './components/IntroAnimation';
import SupabaseTest from './components/SupabaseTest';
import Home from './pages/Home';
import SubmitReview from './pages/SubmitReview';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Payments from './pages/Payments';
import RankingsPage from './pages/RankingsPage';
import NewsPage from './pages/NewsPage';
import About from './pages/About';
import Terms from './pages/Terms';
import ToolDetail from './pages/ToolDetail';
import Leaderboard from './pages/Leaderboard';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import Footer from './components/Footer';

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
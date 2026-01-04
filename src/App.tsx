import React, { useEffect, lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import XpEventRenderer from '@/components/XpEventRenderer';
import Navbar from '@/components/Navbar';
import VisitTracker from '@/components/VisitTracker';
import IntroAnimation from '@/components/IntroAnimation/IntroAnimation';
import CommandPalette from '@/components/CommandPalette';
import Footer from '@/components/Footer';
import { hasSeenIntro } from '@/components/IntroAnimation/utils';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const SubmitReview = lazy(() => import('@/pages/SubmitReview'));
const TaskSubmit = lazy(() => import('@/pages/TaskSubmit'));
const SubmissionHistory = lazy(() => import('@/pages/SubmissionHistory'));
const Profile = lazy(() => import('@/pages/Profile'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Payments = lazy(() => import('@/pages/Payments'));
const RankingsPage = lazy(() => import('@/pages/RankingsPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const About = lazy(() => import('@/pages/About'));
const Terms = lazy(() => import('@/pages/Terms'));
const ToolDetail = lazy(() => import('@/pages/ToolDetail'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Help = lazy(() => import('@/pages/Help'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const Hire = lazy(() => import('@/pages/Hire'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const HireNew = lazy(() => import('@/pages/HireNew'));
const HireDetail = lazy(() => import('@/pages/HireDetail'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const XpHistory = lazy(() => import('@/pages/XpHistory'));
const AdminXpPanelPage = lazy(() => import('@/pages/AdminXpPanelPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminReviews = lazy(() => import('@/pages/admin/Reviews'));
const DeveloperWallet = lazy(() => import('@/pages/DeveloperWallet'));
const CreateTask = lazy(() => import('@/pages/CreateTask'));
const TaskList = lazy(() => import('@/pages/TaskList'));
const ReviewSubmissions = lazy(() => import('@/pages/ReviewSubmissions'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const SupabaseTest = lazy(() => import('@/components/SupabaseTest'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 dark:text-gray-400 font-medium">Loading...</p>
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

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🔥 CRITICAL: Show loading during auth initialization
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <IntroAnimation />
      <XpEventRenderer />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <motion.div
        className="flex flex-col min-h-screen font-sans text-gray-900"
        initial={{ opacity: hasSeenIntro() ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <VisitTracker />
        <Navbar />
        <main className="flex-grow page-transition">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/test-supabase" element={<SupabaseTest />} />
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitReview />} />
              <Route path="/task/:taskId/submit" element={<TaskSubmit />} />
              <Route path="/history" element={<SubmissionHistory />} />
              <Route path="/xp-history" element={<XpHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/list" element={<TaskList />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin/xp" element={<AdminXpPanelPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/hire" element={<Hire />} />
              <Route path="/hire/new" element={<HireNew />} />
              <Route path="/hire/:id" element={<HireDetail />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<DeveloperWallet />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/tasks/review" element={<ReviewSubmissions />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;


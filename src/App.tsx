import React, { useEffect, lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { queryClient } from '@/lib/queryClient';
import XpEventRenderer from '@/components/XpEventRenderer';
import Navbar from '@/components/Navbar';
import VisitTracker from '@/components/VisitTracker';
import IntroAnimation from '@/components/IntroAnimation/IntroAnimation';
import CommandPalette from '@/components/CommandPalette';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { hasSeenIntro } from '@/components/IntroAnimation/utils';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useGlobalErrorHandler } from '@/hooks/useGlobalErrorHandler';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home').catch(err => {
  console.error('Failed to load Home:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const SubmitReview = lazy(() => import('@/pages/SubmitReview').catch(err => {
  console.error('Failed to load SubmitReview:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const TaskSubmit = lazy(() => import('@/pages/TaskSubmit').catch(err => {
  console.error('Failed to load TaskSubmit:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const SubmissionHistory = lazy(() => import('@/pages/SubmissionHistory').catch(err => {
  console.error('Failed to load SubmissionHistory:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Profile = lazy(() => import('@/pages/Profile').catch(err => {
  console.error('Failed to load Profile:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Tasks = lazy(() => import('@/pages/Tasks').catch(err => {
  console.error('Failed to load Tasks:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Payments = lazy(() => import('@/pages/Payments').catch(err => {
  console.error('Failed to load Payments:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const RankingsPage = lazy(() => import('@/pages/RankingsPage').catch(err => {
  console.error('Failed to load RankingsPage:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const NewsPage = lazy(() => import('@/pages/NewsPage').catch(err => {
  console.error('Failed to load NewsPage:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const About = lazy(() => import('@/pages/About').catch(err => {
  console.error('Failed to load About:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Terms = lazy(() => import('@/pages/Terms').catch(err => {
  console.error('Failed to load Terms:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const ToolDetail = lazy(() => import('@/pages/ToolDetail').catch(err => {
  console.error('Failed to load ToolDetail:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Leaderboard = lazy(() => import('@/pages/Leaderboard').catch(err => {
  console.error('Failed to load Leaderboard:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Help = lazy(() => import('@/pages/Help').catch(err => {
  console.error('Failed to load Help:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Privacy = lazy(() => import('@/pages/Privacy').catch(err => {
  console.error('Failed to load Privacy:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy').catch(err => {
  console.error('Failed to load CookiePolicy:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Hire = lazy(() => import('@/pages/Hire').catch(err => {
  console.error('Failed to load Hire:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Onboarding = lazy(() => import('@/pages/Onboarding').catch(err => {
  console.error('Failed to load Onboarding:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const HireNew = lazy(() => import('@/pages/HireNew').catch(err => {
  console.error('Failed to load HireNew:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const HireDetail = lazy(() => import('@/pages/HireDetail').catch(err => {
  console.error('Failed to load HireDetail:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const Dashboard = lazy(() => import('@/pages/Dashboard').catch(err => {
  console.error('Failed to load Dashboard:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const XpHistory = lazy(() => import('@/pages/XpHistory').catch(err => {
  console.error('Failed to load XpHistory:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const AdminXpPanelPage = lazy(() => import('@/pages/AdminXpPanelPage').catch(err => {
  console.error('Failed to load AdminXpPanelPage:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').catch(err => {
  console.error('Failed to load AdminDashboard:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const AdminReviews = lazy(() => import('@/pages/admin/Reviews').catch(err => {
  console.error('Failed to load AdminReviews:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const DeveloperWallet = lazy(() => import('@/pages/DeveloperWallet').catch(err => {
  console.error('Failed to load DeveloperWallet:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const CreateTask = lazy(() => import('@/pages/CreateTask').catch(err => {
  console.error('Failed to load CreateTask:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const TaskList = lazy(() => import('@/pages/TaskList').catch(err => {
  console.error('Failed to load TaskList:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const ReviewSubmissions = lazy(() => import('@/pages/ReviewSubmissions').catch(err => {
  console.error('Failed to load ReviewSubmissions:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const ResetPassword = lazy(() => import('@/pages/ResetPassword').catch(err => {
  console.error('Failed to load ResetPassword:', err);
  return { default: () => <div>Failed to load page</div> };
}));
const SupabaseTest = lazy(() => import('@/components/SupabaseTest').catch(err => {
  console.error('Failed to load SupabaseTest:', err);
  return { default: () => <div>Failed to load page</div> };
}));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
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
  
  // Initialize global error handler
  useGlobalErrorHandler();

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
              <Route path="/history" element={<ProtectedRoute><SubmissionHistory /></ProtectedRoute>} />
              <Route path="/xp-history" element={<ProtectedRoute><XpHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><DeveloperWallet /></ProtectedRoute>} />
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <Router>
                <AppContent />
              </Router>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;


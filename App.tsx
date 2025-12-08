import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitReview from './pages/SubmitReview';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitReview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks" element={<Tasks />} />
            {/* Tool detail route would go here, reusing parts of Home or a dedicated component */}
            <Route path="/tool/:id" element={<div className="p-20 text-center text-xl">Tool Detail Page (Placeholder)</div>} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xs">F</div>
              Follow.ai
            </div>
            <p className="text-gray-500 text-sm mb-6">
              © 2025 Follow.ai. All rights reserved. <br/>
              The first AI tool review platform with mandatory real work verification.
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600">About</a>
              <a href="#" className="hover:text-blue-600">Terms</a>
              <a href="#" className="hover:text-blue-600">Privacy</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 h-[70px] flex items-center shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            F
          </div>
          Follow.ai
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={isActive('/')}>Browse Tools</Link>
          <Link to="/tasks" className={isActive('/tasks')}>
            <span className="flex items-center gap-1">
              Earn Money
            </span>
          </Link>
          <Link to="/payments" className={isActive('/payments')}>Payments</Link>
          <Link to="/rankings" className={isActive('/rankings')}>Rankings</Link>
          <Link to="/news" className={isActive('/news')}>AI News</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
            Submit Review
          </Link>
          <Link to="/profile" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-lg font-medium transition-colors">
            Profile
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden flex flex-col p-4 gap-4">
          <Link to="/" onClick={toggleMobileMenu} className="text-lg font-medium">Browse Tools</Link>
          <Link to="/tasks" onClick={toggleMobileMenu} className="text-lg font-medium">Earn Money</Link>
          <Link to="/payments" onClick={toggleMobileMenu} className="text-lg font-medium">Payments</Link>
          <Link to="/rankings" onClick={toggleMobileMenu} className="text-lg font-medium">Rankings</Link>
          <Link to="/news" onClick={toggleMobileMenu} className="text-lg font-medium">AI News</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="text-lg font-medium">About</Link>
          <Link to="/submit" onClick={toggleMobileMenu} className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium">Submit Review</Link>
          <Link to="/profile" onClick={toggleMobileMenu} className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg text-center font-medium">Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

// Route to label mapping
const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/tasks': 'Tasks',
  '/wallet': 'Wallet',
  '/leaderboard': 'Leaderboard',
  '/xp-history': 'XP History',
  '/hire': 'Hire',
  '/submit': 'Submit Output',
  '/settings': 'Settings',
  '/browse': 'Browse Tools',
  '/reset-password': 'Reset Password',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className = '',
}) => {
  const location = useLocation();
  const { t } = useLanguage();

  // Auto-generate breadcrumbs from current path if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [];

    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      generatedItems.push({
        label,
        href: currentPath,
      });
    }

    return generatedItems;
  })();

  // Don't render if we're on home page and no custom items
  if (!items && location.pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <ol className="flex items-center space-x-1 text-sm">
        {showHome && (
          <li className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
        )}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-1" />
              {isLast || !item.href ? (
                <span className="flex items-center gap-1 text-white dark:text-white font-medium">
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

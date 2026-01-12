import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import ErrorBoundary from '@/components/ErrorBoundary';

// Delay monitoring library initialization until after page load
function initializeMonitoring() {
  // Lazy load Sentry
  import('@/lib/sentry').then(({ initSentry }) => {
    initSentry();
  }).catch(err => console.error('Failed to initialize Sentry:', err));
}

// Initialize monitoring after page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', initializeMonitoring);
  });
} else {
  window.addEventListener('load', initializeMonitoring);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

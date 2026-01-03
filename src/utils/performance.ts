/**
 * Performance Monitoring Utilities
 */

// Web Vitals metrics
interface WebVitals {
  CLS: number | null; // Cumulative Layout Shift
  FID: number | null; // First Input Delay
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
}

let vitals: WebVitals = {
  CLS: null,
  FID: null,
  FCP: null,
  LCP: null,
  TTFB: null,
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Observe Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    vitals.LCP = lastEntry.startTime;
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  // Observe First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry: any) => {
      vitals.FID = entry.processingStart - entry.startTime;
    });
  });
  fidObserver.observe({ type: 'first-input', buffered: true });

  // Observe Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitals.CLS = clsValue;
      }
    });
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });

  // Get FCP from paint entries
  const paintObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        vitals.FCP = entry.startTime;
      }
    });
  });
  paintObserver.observe({ type: 'paint', buffered: true });

  // Get TTFB from navigation timing
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navEntry) {
    vitals.TTFB = navEntry.responseStart - navEntry.requestStart;
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = (): WebVitals => {
  return { ...vitals };
};

/**
 * Measure function execution time
 */
export const measureExecutionTime = async <T>(
  fn: () => T | Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (label) {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
};

/**
 * Create a performance mark
 */
export const mark = (name: string) => {
  performance.mark(name);
};

/**
 * Measure between two marks
 */
export const measure = (name: string, startMark: string, endMark: string): number | null => {
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    return entries.length > 0 ? entries[0].duration : null;
  } catch {
    return null;
  }
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with IntersectionObserver
 */
export const lazyLoadImages = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
};

/**
 * Preload critical resources
 */
export const preloadResource = (
  url: string,
  type: 'script' | 'style' | 'image' | 'font'
) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;

  switch (type) {
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'image':
      link.as = 'image';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
  }

  document.head.appendChild(link);
};

/**
 * Memory usage monitoring (Chrome only)
 */
export const getMemoryUsage = (): { usedJSHeapSize: number; totalJSHeapSize: number } | null => {
  if (typeof window !== 'undefined' && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
    };
  }
  return null;
};

/**
 * Report performance metrics to analytics
 */
export const reportPerformanceMetrics = (endpoint?: string) => {
  const metrics = getPerformanceMetrics();
  const memory = getMemoryUsage();

  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    vitals: metrics,
    memory,
  };

  if (endpoint) {
    // Send to analytics endpoint
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch(console.error);
  }

  return report;
};

export default {
  initPerformanceMonitoring,
  getPerformanceMetrics,
  measureExecutionTime,
  mark,
  measure,
  debounce,
  throttle,
  lazyLoadImages,
  preloadResource,
  getMemoryUsage,
  reportPerformanceMetrics,
};

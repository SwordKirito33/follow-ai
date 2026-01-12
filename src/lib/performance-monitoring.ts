/**
 * Performance Monitoring with Web Vitals
 * Implements Real User Monitoring (RUM) for Core Web Vitals
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  timestamp: number;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitoringConfig {
  onMetric?: (metric: PerformanceMetric) => void;
  sendToAnalytics?: boolean;
  logToConsole?: boolean;
}

/**
 * Get rating for a metric
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };
  
  const [good, poor] = thresholds[name] || [0, 0];
  
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric for reporting
 */
function formatMetric(metric: Metric): PerformanceMetric {
  return {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
  };
}

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: PerformanceMetric) {
  // Send to analytics service (e.g., Google Analytics, PostHog)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
    });
  }
  
  // Send to custom analytics endpoint
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('Web Vital', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

/**
 * Log metric to console
 */
function logToConsole(metric: PerformanceMetric) {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(config: PerformanceMonitoringConfig = {}) {
  const {
    onMetric,
    sendToAnalytics: shouldSendToAnalytics = true,
    logToConsole: shouldLogToConsole = import.meta.env.DEV,
  } = config;
  
  const handleMetric = (metric: Metric) => {
    const formattedMetric = formatMetric(metric);
    
    // Call custom handler
    if (onMetric) {
      onMetric(formattedMetric);
    }
    
    // Send to analytics
    if (shouldSendToAnalytics) {
      sendToAnalytics(formattedMetric);
    }
    
    // Log to console
    if (shouldLogToConsole) {
      logToConsole(formattedMetric);
    }
  };
  
  // Register Web Vitals observers
  onCLS(handleMetric);
  onFID(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
  onINP(handleMetric);
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  
  if (typeof window === 'undefined' || !window.performance) {
    return metrics;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigation) {
    // Time to First Byte
    metrics.push({
      name: 'TTFB',
      value: navigation.responseStart - navigation.requestStart,
      rating: getRating('TTFB', navigation.responseStart - navigation.requestStart),
      delta: 0,
      id: 'manual',
      navigationType: 'navigate',
      timestamp: Date.now(),
    });
    
    // DOM Content Loaded
    metrics.push({
      name: 'DCL',
      value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      rating: 'good',
      delta: 0,
      id: 'manual',
      navigationType: 'navigate',
      timestamp: Date.now(),
    });
    
    // Load Complete
    metrics.push({
      name: 'Load',
      value: navigation.loadEventEnd - navigation.loadEventStart,
      rating: 'good',
      delta: 0,
      id: 'manual',
      navigationType: 'navigate',
      timestamp: Date.now(),
    });
  }
  
  return metrics;
}

/**
 * Performance monitoring store
 */
class PerformanceMonitoringStore {
  private metrics: PerformanceMetric[] = [];
  private listeners: ((metrics: PerformanceMetric[]) => void)[] = [];
  
  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    this.notifyListeners();
  }
  
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  subscribe(listener: (metrics: PerformanceMetric[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getMetrics()));
  }
  
  clear() {
    this.metrics = [];
    this.notifyListeners();
  }
}

export const performanceStore = new PerformanceMonitoringStore();

/**
 * Initialize performance monitoring with store
 */
export function initPerformanceMonitoringWithStore() {
  initPerformanceMonitoring({
    onMetric: (metric) => {
      performanceStore.addMetric(metric);
    },
  });
}

/**
 * Performance Monitor Component
 * Displays real-time Core Web Vitals metrics
 */

import { useEffect, useState } from 'react';
import { performanceStore, type PerformanceMetric } from '../lib/performance-monitoring';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Subscribe to performance metrics
    const unsubscribe = performanceStore.subscribe(setMetrics);
    
    // Load initial metrics
    setMetrics(performanceStore.getMetrics());
    
    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  if (!isVisible) {
    return null;
  }
  
  // Get latest metrics by name
  const latestMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.name] || metric.timestamp > acc[metric.name].timestamp) {
      acc[metric.name] = metric;
    }
    return acc;
  }, {} as Record<string, PerformanceMetric>);
  
  const metricsList = Object.values(latestMetrics);
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <strong>Performance Monitor</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ×
        </button>
      </div>
      
      {metricsList.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No metrics collected yet...</div>
      ) : (
        <div>
          {metricsList.map((metric) => (
            <div
              key={metric.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>{metric.name}</div>
                <div style={{ fontSize: '10px', opacity: 0.7 }}>
                  {metric.navigationType}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    color:
                      metric.rating === 'good'
                        ? '#4ade80'
                        : metric.rating === 'needs-improvement'
                        ? '#fbbf24'
                        : '#f87171',
                    fontWeight: 'bold',
                  }}
                >
                  {metric.value.toFixed(2)}ms
                </div>
                <div style={{ fontSize: '10px', opacity: 0.7 }}>
                  {metric.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '10px',
          opacity: 0.7,
        }}
      >
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

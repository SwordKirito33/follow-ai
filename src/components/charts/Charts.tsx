// Chart Components for Follow.ai
// Data visualization with responsive design

import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showDots?: boolean;
  lineColor?: string;
  fillColor?: string;
  className?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  horizontal?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  barColor?: string;
  className?: string;
}

interface PieChartProps {
  data: DataPoint[];
  size?: number;
  donut?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  className?: string;
}

// ============================================
// Color Palette
// ============================================

const defaultColors = [
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
];

// ============================================
// Line Chart Component
// ============================================

export function LineChart({
  data,
  height = 200,
  showGrid = true,
  showLabels = true,
  showDots = true,
  lineColor = '#8b5cf6',
  fillColor = 'rgba(139, 92, 246, 0.1)',
  className,
}: LineChartProps) {
  const { points, path, fillPath, maxValue, minValue } = useMemo(() => {
    if (data.length === 0) return { points: [], path: '', fillPath: '', maxValue: 0, minValue: 0 };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const padding = 40;
    const chartWidth = 100;
    const chartHeight = height - padding * 2;

    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * chartWidth,
      y: chartHeight - ((d.value - min) / range) * chartHeight + padding,
      ...d,
    }));

    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const fillD = `${pathD} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

    return { points: pts, path: pathD, fillPath: fillD, maxValue: max, minValue: min };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-white/5 dark:bg-gray-800 rounded-lg', className)} style={{ height }}>
        <p className="text-gray-400">暂无数据</p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 100 ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height }}
      >
        {/* Grid Lines */}
        {showGrid && (
          <g className="text-gray-200 dark:text-gray-300">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={40 + (height - 80) * ratio}
                x2="100"
                y2={40 + (height - 80) * ratio}
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
          </g>
        )}

        {/* Fill Area */}
        <path d={fillPath} fill={fillColor} />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Dots */}
        {showDots && points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={lineColor}
            className="hover:r-4 transition-all cursor-pointer"
          />
        ))}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.map((d, i) => (
            <span key={i} className="truncate px-1">{d.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Bar Chart Component
// ============================================

export function BarChart({
  data,
  height = 200,
  horizontal = false,
  showLabels = true,
  showValues = true,
  barColor = '#8b5cf6',
  className,
}: BarChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

  if (data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-white/5 dark:bg-gray-800 rounded-lg', className)} style={{ height }}>
        <p className="text-gray-400">暂无数据</p>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((d, i) => (
          <div key={i}>
            {showLabels && (
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-400 dark:text-gray-400">{d.label}</span>
                {showValues && (
                  <span className="font-medium text-white dark:text-white">{d.value.toLocaleString()}</span>
                )}
              </div>
            )}
            <div className="h-3 bg-white/10 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: d.color || barColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col items-center" style={{ height: height - 40 }}>
            {showValues && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {d.value.toLocaleString()}
              </span>
            )}
            <div
              className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(d.value / maxValue) * 100}%`,
                backgroundColor: d.color || barColor,
              }}
            />
          </div>
          {showLabels && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate max-w-full">
              {d.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Pie Chart Component
// ============================================

export function PieChart({
  data,
  size = 200,
  donut = false,
  showLabels = true,
  showLegend = true,
  className,
}: PieChartProps) {
  const { segments, total } = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    let currentAngle = -90;

    const segs = data.map((d, i) => {
      const angle = (d.value / sum) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const radius = 45;
      const x1 = 50 + radius * Math.cos(startRad);
      const y1 = 50 + radius * Math.sin(startRad);
      const x2 = 50 + radius * Math.cos(endRad);
      const y2 = 50 + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      return {
        ...d,
        color: d.color || defaultColors[i % defaultColors.length],
        percentage: ((d.value / sum) * 100).toFixed(1),
        path: `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      };
    });

    return { segments: segs, total: sum };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-white/5 dark:bg-gray-800 rounded-lg', className)} style={{ width: size, height: size }}>
        <p className="text-gray-400">暂无数据</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
          {donut && (
            <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-900" />
          )}
        </svg>
        {donut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white dark:text-white">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">总计</div>
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-gray-400 dark:text-gray-400">
                {seg.label}
                {showLabels && ` (${seg.percentage}%)`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Progress Ring Component
// ============================================

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#8b5cf6',
  backgroundColor = '#e5e7eb',
  showValue = true,
  label,
  className,
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          className="dark:stroke-gray-700"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white dark:text-white">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Stat Card Component
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = '#8b5cf6',
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-white/10 dark:border-gray-700', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', isPositive ? 'text-green-500' : 'text-red-500')}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
                />
              </svg>
              <span>{Math.abs(change)}%</span>
              {changeLabel && <span className="text-gray-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Sparkline Component
// ============================================

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#8b5cf6',
  className,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length === 0) return '';

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data
      .map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [data, width, height]);

  return (
    <svg width={width} height={height} className={className}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================
// Export All
// ============================================

export default {
  LineChart,
  BarChart,
  PieChart,
  ProgressRing,
  StatCard,
  Sparkline,
};

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface XPChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showLabels?: boolean;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const XPChart: React.FC<XPChartProps> = ({
  data,
  title,
  height = 200,
  showLabels = true,
  color = '#3B82F6',
  gradientFrom = '#3B82F6',
  gradientTo = '#8B5CF6',
}) => {
  const chartData = useMemo(() => {
    if (!data.length) return { points: [], maxValue: 0, minValue: 0 };

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const padding = 40;
    const chartWidth = 100; // percentage
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * (chartWidth - 10) + 5;
      const y = chartHeight - ((d.value - minValue) / range) * chartHeight + padding;
      return { x, y, ...d };
    });

    return { points, maxValue, minValue };
  }, [data, height]);

  const pathD = useMemo(() => {
    if (chartData.points.length < 2) return '';

    const { points } = chartData;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }, [chartData.points]);

  const areaPathD = useMemo(() => {
    if (chartData.points.length < 2) return '';

    const { points } = chartData;
    const bottomY = height - 40;
    
    let d = `M ${points[0].x} ${bottomY}`;
    d += ` L ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    d += ` L ${points[points.length - 1].x} ${bottomY}`;
    d += ' Z';

    return d;
  }, [chartData.points, height]);

  if (!data.length) {
    return (
      <div 
        className="flex items-center justify-center bg-white/5 dark:bg-gray-800 rounded-xl"
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-white dark:text-white mb-4">{title}</h3>
      )}
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.3" />
              <stop offset="100%" stopColor={gradientTo} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={40 + (height - 80) * ratio}
              x2="100"
              y2={40 + (height - 80) * ratio}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="2,2"
              className="text-gray-400 dark:text-gray-400"
            />
          ))}

          {/* Area */}
          <motion.path
            d={areaPathD}
            fill="url(#xpGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {chartData.points.map((point, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="white"
                stroke={color}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="cursor-pointer hover:r-4 transition-all"
              />
            </motion.g>
          ))}
        </svg>

        {/* Labels */}
        {showLabels && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500 dark:text-gray-400">
            {chartData.points.filter((_, i) => i % Math.ceil(chartData.points.length / 5) === 0 || i === chartData.points.length - 1).map((point, i) => (
              <span key={i}>{point.label || point.date}</span>
            ))}
          </div>
        )}

        {/* Y-axis labels */}
        <div className="absolute top-10 left-0 bottom-10 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{chartData.maxValue.toLocaleString()}</span>
          <span>{Math.round((chartData.maxValue + chartData.minValue) / 2).toLocaleString()}</span>
          <span>{chartData.minValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default XPChart;

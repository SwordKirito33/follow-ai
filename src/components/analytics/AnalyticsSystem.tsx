import React, { useState } from 'react';

// =====================================================
// 数据分析和报告组件
// 任务: 241-270 数据分析相关任务
// =====================================================

// =====================================================
// 统计卡片组件
// =====================================================

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ReactNode;
  color?: 'primary' | 'green' | 'yellow' | 'red' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    green: 'from-green-500/10 to-green-500/5 text-green-500',
    yellow: 'from-yellow-500/10 to-yellow-500/5 text-yellow-500',
    red: 'from-red-500/10 to-red-500/5 text-red-500',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              change.type === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change.type === 'increase' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span>{change.value}%</span>
              <span className="text-muted-foreground">{change.period}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-background/50 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// 图表组件
// =====================================================

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartData[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  showLabels = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative" style={{ height }}>
      {/* Grid */}
      {showGrid && (
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-border/30" />
          ))}
        </div>
      )}

      {/* Chart */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Area */}
        <polygon
          points={areaPoints}
          fill="url(#gradient)"
          opacity="0.3"
        />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          vectorEffect="non-scaling-stroke"
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="fill-primary"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" className="text-primary" />
            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {data.map((d, i) => (
            <span key={i} className="truncate">{d.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

interface BarChartProps {
  data: ChartData[];
  height?: number;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  horizontal = false
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  if (horizontal) {
    return (
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-foreground">{d.label}</span>
              <span className="text-muted-foreground">{d.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: d.color || 'hsl(var(--primary))'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div
            className="w-full rounded-t-lg transition-all duration-500"
            style={{
              height: `${(d.value / maxValue) * 100}%`,
              backgroundColor: d.color || 'hsl(var(--primary))'
            }}
          />
          <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
};

interface PieChartProps {
  data: ChartData[];
  size?: number;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLegend = true
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const defaultColors = [
    'hsl(var(--primary))',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899'
  ];

  let currentAngle = 0;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...d,
      startAngle,
      endAngle: currentAngle,
      color: d.color || defaultColors[i % defaultColors.length]
    };
  });

  const getPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M 50 50 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={getPath(seg.startAngle, seg.endAngle, 45)}
            fill={seg.color}
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}
        <circle cx="50" cy="50" r="25" fill="hsl(var(--background))" />
      </svg>

      {showLegend && (
        <div className="space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-foreground">{seg.label}</span>
              <span className="text-sm text-muted-foreground">
                ({((seg.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// 活动热力图组件
// =====================================================

interface ActivityHeatmapProps {
  data: Array<{
    date: Date;
    count: number;
  }>;
  weeks?: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  weeks = 12
}) => {
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-primary/25';
    if (intensity < 0.5) return 'bg-primary/50';
    if (intensity < 0.75) return 'bg-primary/75';
    return 'bg-primary';
  };

  // 生成日历数据
  const calendar: Array<Array<{ date: Date; count: number } | null>> = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7) + 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let week = 0; week < weeks; week++) {
    const weekData: Array<{ date: Date; count: number } | null> = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      
      if (date > today) {
        weekData.push(null);
      } else {
        const found = data.find(d => 
          d.date.toDateString() === date.toDateString()
        );
        weekData.push({
          date,
          count: found?.count || 0
        });
      }
    }
    calendar.push(weekData);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-6" />
        {calendar.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-3 h-3 rounded-sm ${day ? getColor(day.count) : 'bg-transparent'}`}
                title={day ? `${day.date.toLocaleDateString('zh-CN')}: ${day.count} 活动` : ''}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>少</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-primary/25" />
          <div className="w-3 h-3 rounded-sm bg-primary/50" />
          <div className="w-3 h-3 rounded-sm bg-primary/75" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>多</span>
      </div>
    </div>
  );
};

// =====================================================
// 数据表格组件
// =====================================================

interface DataTableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = '暂无数据',
  onRowClick
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`
                  px-4 py-3 text-left text-sm font-medium text-muted-foreground
                  ${col.sortable ? 'cursor-pointer hover:text-foreground' : ''}
                `}
                style={{ width: col.width }}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <div className="flex items-center gap-1">
                  {col.title}
                  {col.sortable && sortKey === col.key && (
                    <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={i}
                className={`
                  border-b border-border/50 transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-foreground">
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : String(row[col.key as keyof T] ?? '')
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// =====================================================
// 数据导出组件
// =====================================================

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  formats?: Array<'csv' | 'json' | 'xlsx'>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  formats = ['csv', 'json']
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ].join('\n');
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  const exportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>导出</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-background rounded-lg border border-border shadow-lg z-50">
            {formats.includes('csv') && (
              <button
                onClick={exportCSV}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg"
              >
                导出 CSV
              </button>
            )}
            {formats.includes('json') && (
              <button
                onClick={exportJSON}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors last:rounded-b-lg"
              >
                导出 JSON
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;

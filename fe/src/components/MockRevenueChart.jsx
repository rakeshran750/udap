import React from "react";

const data = [
  { label: "Sep", revenue: 30, sales: 28 },
  { label: "Oct", revenue: 12, sales: 22 },
  { label: "Nov", revenue: 26, sales: 34 },
  { label: "Dec", revenue: 32, sales: 30 },
  { label: "Jan", revenue: 18, sales: 24 },
  { label: "Feb", revenue: 36, sales: 31 },
  { label: "Mar", revenue: 40, sales: 68 },
  { label: "Apr", revenue: 28, sales: 58 },
  { label: "May", revenue: 52, sales: 62 },
  { label: "Jun", revenue: 22, sales: 28 },
  { label: "Jul", revenue: 34, sales: 34 },
  { label: "Aug", revenue: 46, sales: 48 },
];

export default function MockRevenueChart() {
  const width = 800;
  const height = 320;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.sales])) + 10;
  const stepX = innerWidth / (data.length - 1);

  const scaleY = (value) => height - padding - (value / maxValue) * innerHeight;

  const buildPath = (key) => {
    return data
      .map((point, idx) => `${idx === 0 ? "M" : "L"} ${padding + stepX * idx} ${scaleY(point[key])}`)
      .join(" ");
  };

  const buildArea = () => {
    const topLine = data
      .map((point, idx) => `${idx === 0 ? "M" : "L"} ${padding + stepX * idx} ${scaleY(point.sales)}`)
      .join(" ");
    const bottomLine = data
      .slice()
      .reverse()
      .map((point, idx) => `L ${padding + stepX * (data.length - 1 - idx)} ${scaleY(point.revenue)}`)
      .join(" ");
    return `${topLine} ${bottomLine} Z`;
  };

  return (
    <div className="card-modern animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              <span className="text-sm font-semibold text-gray-900">Total Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-semibold text-gray-900">Total Sales</span>
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-semibold text-gray-800">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-12 6h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Dec 14, 2025 – Dec 20, 2025</span>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 overflow-hidden">
          <button className="px-3 py-1 hover:bg-white transition-colors">Day</button>
          <button className="px-3 py-1 bg-white shadow-sm">Week</button>
          <button className="px-3 py-1 hover:bg-white transition-colors">Month</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-full">
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 20, 40, 60, 80, 100].map((y) => {
            const yPos = scaleY(y);
            return (
              <g key={y}>
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={yPos}
                  y2={yPos}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400"
                >
                  {y}
                </text>
              </g>
            );
          })}

          {/* Area between sales and revenue */}
          <path d={buildArea()} fill="url(#salesFill)" />

          {/* Revenue line */}
          <path
            d={buildPath("revenue")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {data.map((point, idx) => (
            <circle
              key={`rev-${idx}`}
              cx={padding + stepX * idx}
              cy={scaleY(point.revenue)}
              r="4"
              fill="#2563eb"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Sales line */}
          <path
            d={buildPath("sales")}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {data.map((point, idx) => (
            <circle
              key={`sales-${idx}`}
              cx={padding + stepX * idx}
              cy={scaleY(point.sales)}
              r="4"
              fill="#10b981"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* X labels */}
          {data.map((point, idx) => (
            <text
              key={`label-${idx}`}
              x={padding + stepX * idx}
              y={height - padding + 16}
              textAnchor="middle"
              className="text-[11px] fill-gray-500"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

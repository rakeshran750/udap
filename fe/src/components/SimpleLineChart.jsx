import React, { useMemo, useState } from "react";

const dayData = [
  { label: "6 AM", value: 12 },
  { label: "9 AM", value: 18 },
  { label: "12 PM", value: 26 },
  { label: "3 PM", value: 32 },
  { label: "6 PM", value: 38 },
  { label: "9 PM", value: 28 },
  { label: "12 AM", value: 20 },
];

const weekData = [
  { label: "Sun", value: 12 },
  { label: "Mon", value: 18 },
  { label: "Tue", value: 20 },
  { label: "Wed", value: 26 },
  { label: "Thu", value: 30 },
  { label: "Fri", value: 22 },
  { label: "Sat", value: 28 },
];

const monthData = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}`,
  value: 15 + Math.round(20 * Math.sin(i / 4) + 10 * Math.cos(i / 2)),
}));

export default function SimpleLineChart() {
  const [range, setRange] = useState("week");

  const data = useMemo(() => {
    if (range === "day") return dayData;
    if (range === "month") return monthData;
    return weekData; // week
  }, [range]);

  const padding = 40;
  const height = 260;
  const baseWidth = 800;
  const minStep = range === "month" ? 36 : range === "day" ? 100 : 60;
  const dynamicWidth = padding * 2 + Math.max(minStep * (data.length - 1), baseWidth - padding * 2);
  const innerWidth = dynamicWidth - padding * 2;
  const innerHeight = height - padding * 2;

  const maxValue = Math.max(...data.map((d) => d.value)) + 10;
  const stepX = innerWidth / (data.length - 1 || 1);
  const scaleY = (v) => height - padding - (v / maxValue) * innerHeight;

  const pathD = data
    .map((point, idx) => `${idx === 0 ? "M" : "L"} ${padding + stepX * idx} ${scaleY(point.value)}`)
    .join(" ");

  return (
    <div className="card-modern animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Trend Overview</h3>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 p-1">
          {["day", "week", "month"].map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`px-3 py-1 rounded-full transition-colors ${
                range === option
                  ? "bg-white shadow-sm text-orange-600"
                  : "hover:bg-white text-gray-700"
              }`}
            >
              {option === "week" ? "Week" : option === "month" ? "Month" : "Year"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${dynamicWidth} ${height}`}
          width={dynamicWidth}
          height={height}
          style={{ minWidth: `${dynamicWidth}px` }}
        >
          <defs>
            <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 20, 40, 60, 80, 100].map((y) => {
            const yPos = scaleY(y);
            return (
              <g key={y}>
                <line
                  x1={padding}
                  x2={dynamicWidth - padding}
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

          {/* Area fill */}
          <path
            d={`${pathD} L ${padding + stepX * (data.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#lineFill)"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Points */}
          {data.map((point, idx) => (
            <circle
              key={idx}
              cx={padding + stepX * idx}
              cy={scaleY(point.value)}
              r="4"
              fill="#fff"
              stroke="#f97316"
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

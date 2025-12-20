import { useNavigate } from "react-router-dom";

export default function StatSummaryCard({ title, ctaLabel, onAdd, metrics = [] }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onAdd) onAdd();
    else navigate("/transactions");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold shadow hover:bg-orange-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {ctaLabel}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-xl border p-4 bg-${metric.color || "white"}-50 border-${metric.color || "gray"}-100`}
          >
            <p className="text-xs font-semibold text-gray-500 mb-2">{metric.label}</p>
            <p className="text-2xl font-bold" style={{ color: metric.textColor || "#111827" }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

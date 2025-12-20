import { useNavigate } from "react-router-dom";

export default function MobileNavBar({ dukanName }) {
  const navigate = useNavigate();
  const name = dukanName || localStorage.getItem("dukanName") || "Your Shop";

  return (
    <div className="md:hidden sticky top-0 z-30 bg-white border-b border-orange-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">UK</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Shop</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/account")}
        className="p-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 active:scale-95 transition-transform"
        aria-label="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}

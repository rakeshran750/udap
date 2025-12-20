import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import MobileNavBar from "../components/MobileNavBar";

const actions = [
  { label: "Add Customer", path: "/customers", icon: "user-plus", color: "bg-orange-100 text-orange-700" },
  { label: "Add Transaction", path: "/transactions", icon: "cash", color: "bg-green-100 text-green-700" },
  { label: "View Customers", path: "/customers", icon: "users", color: "bg-blue-100 text-blue-700" },
  { label: "View Transactions", path: "/transactions", icon: "receipt", color: "bg-purple-100 text-purple-700" },
  { label: "Account", path: "/account", icon: "settings", color: "bg-gray-100 text-gray-700" },
];

const icons = {
  "user-plus": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14a4 4 0 10-8 0 4 4 0 008 0zm6 0v1a2 2 0 01-2 2h-1m-4 0h-4m-4 0H6a2 2 0 01-2-2v-1m16-5a2 2 0 11-4 0 2 2 0 014 0zm-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  cash: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  receipt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.317.834 2.378 2.378a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.834 3.317-2.378 2.378a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.317-.834-2.378-2.378a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.834-3.317 2.378-2.378.996.607 2.296.07 2.572-1.066z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function MobileDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 pb-24">
      <MobileNavBar />

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-3 rounded-xl ${action.color} px-3 py-3 text-left shadow-sm active:scale-[0.99] transition-transform`}
            >
              <span className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center">
                {icons[action.icon]}
              </span>
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation activeTab="dashboard" />
    </div>
  );
}

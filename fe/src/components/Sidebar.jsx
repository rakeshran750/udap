import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ dukanInfo, onLogout, expanded, setExpanded }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'transactions',
      path: '/transactions',
      label: 'Transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'customers',
      path: '/customers',
      label: 'Customers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'account',
      path: '/account',
      label: 'Account',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-orange-100 shadow-lg z-40 transition-all duration-300 ${
          expanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo (toggle handled by top navbar) */}
        <div className="flex items-center justify-start h-16 px-4 border-b border-orange-100">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-lg">उ</span>
            </div>
            <span className={`font-bold text-lg text-gray-800 whitespace-nowrap transition-all duration-300 ${
              expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}>
              {dukanInfo?.name || "Udhari Khata"}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 px-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
              title={!expanded ? item.label : ''}
            >
              <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'}`}>
                {item.icon}
              </span>
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* App version */}
        <div className="mt-auto p-3 border-t border-orange-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-lg">UK</span>
            </div>
            <div className={`text-sm text-gray-600 transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              <p className="font-semibold text-gray-800">Udhari Khata</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                isActive(item.path)
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className={`mb-1 transition-transform duration-200 ${
                isActive(item.path) ? "scale-110" : "scale-100"
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs font-semibold transition-all duration-200 ${
                isActive(item.path) ? "text-orange-600" : "text-gray-500"
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button (Top Right) */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-orange-100 touch-target"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Slide-out Menu */}
      {mobileOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">उ</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{dukanInfo?.name || "Udhari Khata"}</p>
                  <p className="text-xs text-gray-500">{dukanInfo?.phone}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="py-4 px-3 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile version block */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-100 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">UK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Udhari Khata</p>
                  <p className="text-xs text-gray-500">v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

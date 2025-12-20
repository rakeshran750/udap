import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import CompleteSignup from "./pages/CompleteSignup";
import AddShop from "./pages/AddShop";
import Breadcrumbs from "./components/Breadcrumbs";

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout({ dukanInfo, onLogout, sidebarExpanded, setSidebarExpanded, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const SIDEBAR_EXPANDED_WIDTH = 256; // tailwind w-64
  const SIDEBAR_COLLAPSED_WIDTH = 80; // tailwind w-20
  const TOGGLE_WIDTH = 36; // px
  const TOGGLE_HEIGHT = 48; // px
  const toggleLeft = (sidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH) - TOGGLE_WIDTH / 2;
  // Center the chip in the navbar height (64px)
  const toggleTop = 16;
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const avatarLetter = userData?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Sidebar 
        dukanInfo={dukanInfo} 
        onLogout={onLogout} 
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      {/* Floating sidebar toggle at the boundary */}
      <button
        onClick={() => setSidebarExpanded((v) => !v)}
        aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        className="hidden md:flex items-center justify-center fixed z-50 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors animate-slide-up"
        style={{ left: toggleLeft, top: toggleTop, width: TOGGLE_WIDTH, height: TOGGLE_HEIGHT }}
      >
        <svg
          className={`w-4 h-4 transition-transform ${sidebarExpanded ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main content with dynamic sidebar offset */}
      <main className={`pb-20 md:pb-0 transition-all duration-300 animate-fade-in ${
        sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
      }`}>
        <div
          className="sticky top-0 z-30 h-16 border-b border-orange-100/60"
          style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #fff7ed 100%)", paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
          
            </div>

            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setShowAccountMenu((v) => !v)}
                className="flex items-center space-x-2 px-2 py-2 rounded-full bg-gray-100 text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-800 flex items-center justify-center text-sm font-semibold overflow-hidden">
                  {avatarLetter}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{userData?.name || "Account"}</span>
                <svg className={`w-4 h-4 text-gray-600 transition-transform ${showAccountMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-slide-down">
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowAccountMenu(false);
                      navigate("/account");
                    }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Profile</span>
                  </button>
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowAccountMenu(false);
                      navigate("/dashboard");
                    }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h6M5 7h.01M5 11h.01M5 15h.01" />
                    </svg>
                    <span className="text-sm font-medium">Calendar</span>
                  </button>
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowAccountMenu(false);
                      navigate("/account");
                    }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12M6 8h12M6 16h12" />
                    </svg>
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <div className="border-t border-gray-200">
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        setShowAccountMenu(false);
                        onLogout();
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pt-3">
          <Breadcrumbs key={location.pathname} />
        </div>
        <div className="pt-2 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dukanInfo, setDukanInfo] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Check if user is already logged in (using token)
    const token = localStorage.getItem("token");
    const dukanId = localStorage.getItem("dukanId");
    
    if (token) {
      setIsAuthenticated(true);
      if (dukanId) {
        setDukanInfo({
          _id: dukanId,
          name: localStorage.getItem("dukanName") || "",
          phone: localStorage.getItem("dukanPhone") || "",
        });
      }
    }

    // Listen for login events
    const handleShowLogin = () => navigate('/login');
    const handleDukanLoggedIn = (event) => {
      setIsAuthenticated(true);
      setDukanInfo(event.detail);
      navigate('/dashboard');
    };

    window.addEventListener('showLogin', handleShowLogin);
    window.addEventListener('dukanLoggedIn', handleDukanLoggedIn);

    return () => {
      window.removeEventListener('showLogin', handleShowLogin);
      window.removeEventListener('dukanLoggedIn', handleDukanLoggedIn);
    };
  }, [navigate]);

  const handleLoginSuccess = (dukan) => {
    setIsAuthenticated(true);
    if (dukan) {
      setDukanInfo(dukan);
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dukanId");
    localStorage.removeItem("dukanName");
    localStorage.removeItem("dukanPhone");
    setIsAuthenticated(false);
    setDukanInfo(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route 
        path="/verify-otp" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyOtp />} 
      />
      <Route 
        path="/complete-signup" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CompleteSignup />} 
      />
      <Route 
        path="/add-shop" 
        element={
          <ProtectedRoute isAuthenticated={!!localStorage.getItem("token")}>
            <AddShop />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout dukanInfo={dukanInfo} onLogout={handleLogout} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout dukanInfo={dukanInfo} onLogout={handleLogout} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
              <Transactions />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout dukanInfo={dukanInfo} onLogout={handleLogout} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
              <Customers />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout dukanInfo={dukanInfo} onLogout={handleLogout} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
              <CustomerDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout dukanInfo={dukanInfo} onLogout={handleLogout} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
              <Account dukanInfo={dukanInfo} onLogout={handleLogout} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

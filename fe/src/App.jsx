import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout({ dukanInfo, onLogout, sidebarExpanded, setSidebarExpanded, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Sidebar 
        dukanInfo={dukanInfo} 
        onLogout={onLogout} 
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      {/* Main content with dynamic sidebar offset */}
      <main className={`pb-20 md:pb-0 transition-all duration-300 animate-fade-in ${
        sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
      }`}>
        {children}
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

    // Check if user is already logged in
    const dukanId = localStorage.getItem("dukanId");
    if (dukanId) {
      setIsAuthenticated(true);
      setDukanInfo({
        _id: dukanId,
        name: localStorage.getItem("dukanName") || "",
        phone: localStorage.getItem("dukanPhone") || "",
      });
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
    setDukanInfo(dukan);
    navigate('/dashboard');
  };

  const handleLogout = () => {
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

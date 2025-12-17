import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [dukanInfo, setDukanInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

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
    const handleShowLogin = () => setShowLogin(true);
    const handleDukanLoggedIn = (event) => {
      setIsAuthenticated(true);
      setDukanInfo(event.detail);
      setShowLogin(false);
    };

    window.addEventListener('showLogin', handleShowLogin);
    window.addEventListener('dukanLoggedIn', handleDukanLoggedIn);

    return () => {
      window.removeEventListener('showLogin', handleShowLogin);
      window.removeEventListener('dukanLoggedIn', handleDukanLoggedIn);
    };
  }, []);

  const handleLoginSuccess = (dukan) => {
    setIsAuthenticated(true);
    setDukanInfo(dukan);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("dukanId");
    localStorage.removeItem("dukanName");
    localStorage.removeItem("dukanPhone");
    setIsAuthenticated(false);
    setDukanInfo(null);
    setShowLogin(false);
  };

  // Show login page
  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <Landing />;
  }

  // Show dashboard if authenticated
  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <Transactions />;
      case "customers":
        return <Customers />;
      case "account":
        return <Account dukanInfo={dukanInfo} onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Navbar dukanInfo={dukanInfo} onLogout={handleLogout} />
      <main className="animate-fade-in">
        {renderActivePage()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Navbar({ dukanInfo, onLogout }) {
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setInstallPrompt(null);
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-soft backdrop-blur-xl border-b border-orange-100 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-glow border border-orange-100">
              <svg viewBox="0 0 64 64" className="w-9 h-9">
                <defs>
                  <linearGradient id="shopAwning" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                </defs>
                <rect x="10" y="24" width="44" height="26" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="10" y="18" width="44" height="10" rx="2" fill="url(#shopAwning)" />
                <path d="M10 18h44v6c0 4-4 7-8 7s-8-3-8-7c0 4-4 7-8 7s-8-3-8-7c0 4-4 7-8 7s-8-3-8-7v-6z" fill="#fff7ed" />
                <rect x="16" y="30" width="12" height="12" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" />
                <rect x="36" y="30" width="12" height="12" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1.5" />
                <rect x="30" y="34" width="6" height="16" rx="1.5" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                <rect x="28" y="42" width="10" height="8" rx="2" fill="#1f2937" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {dukanInfo?.name || "Udhari Khata"}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {dukanInfo?.phone || "Customer Transaction Manager"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Install App</span>
              </button>
            )}
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg hover:bg-orange-200 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse-slow ${
                online ? "bg-green-500" : "bg-red-500"
              }`} />
              <div
                className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${
                  online 
                    ? "bg-green-100 text-green-700 shadow-sm" 
                    : "bg-red-100 text-red-700 shadow-sm"
                }`}
              >
                {online ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

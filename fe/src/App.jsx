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
import BannerSlider from "./components/BannerSlider";
import { subscribeToast } from "./utils/toast";

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
  const NAVBAR_HEIGHT = 64; // px
  const TOGGLE_WIDTH = 20; // px, slender vertical pill
  const TOGGLE_HEIGHT = 35; // px, centered within navbar height
  const toggleLeft = (sidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH) - TOGGLE_WIDTH / 2;
  // Center the chip in the navbar height
  const toggleTop = (NAVBAR_HEIGHT - TOGGLE_HEIGHT) / 2;
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // unified chat state
  const chatPanelRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hello, I'm John. How may I help you?" },
    { from: "user", text: "Hi John, how are you?" },
    { from: "bot", text: "I am good. How may I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBodyRef = useRef(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const outsideAccount = accountMenuRef.current && !accountMenuRef.current.contains(event.target);
      const outsideNotifs = notificationsRef.current && !notificationsRef.current.contains(event.target);
      const outsideChatPanel = chatPanelRef.current && !chatPanelRef.current.contains(event.target);
      if (outsideAccount) setShowAccountMenu(false);
      if (outsideNotifs) setShowNotifications(false);
      if (outsideChatPanel) setIsChatOpen(false);
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
  const agentName = "Rakesh Ran";

  const handleSendChat = (event) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setChatMessages((prev) => [...prev, { from: "user", text: message }]);
    setChatInput("");
    // Simple acknowledgement without backend
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: "bot", text: "Thanks! We will get back to you shortly." }]);
    }, 400);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  // Close chat when navigating to a different page to keep per-page sync
  useEffect(() => {
    setIsChatOpen(false);
  }, [location.pathname]);

  // Global toast listener
  useEffect(() => {
    const unsubscribe = subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 3500);
    });
    return unsubscribe;
  }, []);

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
        className="hidden md:flex items-center justify-center fixed z-50 rounded-full bg-gray-100/90 text-gray-700 border border-gray-300 shadow-lg backdrop-blur hover:bg-gray-200 transition-all animate-slide-up"
        style={{ left: toggleLeft, top: toggleTop, width: TOGGLE_WIDTH, height: TOGGLE_HEIGHT }}
      >
        <svg
          className={`w-2.5 h-2.5 transition-transform ${sidebarExpanded ? "" : "rotate-180"}`}
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
          className="sticky top-0 z-30 h-16 border-b border-orange-100/60 bg-white"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
          
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications((v) => !v);
                    setShowAccountMenu(false);
                    setIsChatOpen(false);
                  }}
                  className="relative p-2 rounded-full bg-gray-100 text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-200 transition-colors"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-slide-down">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">Notifications</p>
                      <span className="text-[11px] uppercase tracking-wide text-gray-500">Today</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                      {[
                        { title: "New feature", body: "Record transactions faster with quick add.", time: "2m ago" },
                        { title: "Reminder", body: "Add your first shop to start tracking.", time: "1h ago" },
                        { title: "Tip", body: "Invite customers to pay on time.", time: "3h ago" },
                      ].map((item, idx) => (
                        <div key={idx} className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.body}</p>
                          <span className="text-[11px] text-gray-400">{item.time}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full text-center text-sm font-semibold text-orange-600 py-2 hover:bg-orange-50 border-t border-gray-100"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsChatOpen((v) => !v);
                  setShowAccountMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-orange-100 text-orange-700 border border-orange-200 shadow-sm hover:bg-orange-200 transition-colors"
                aria-label="Open chat panel"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l2 2h3a2 2 0 012 2v3.5a2 2 0 01-2 2V14a5 5 0 11-10 0v-1.5a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2z" />
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                  <circle cx="14" cy="10" r="1" fill="currentColor" />
                </svg>
                <span className="text-sm font-semibold hidden sm:inline">AI Chat</span>
              </button>

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
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pt-3 space-y-2">
          <Breadcrumbs key={location.pathname} />
        </div>
        <div className="pt-2 px-4 sm:px-6 lg:px-4 space-y-3">
          {children}
        </div>
      </main>

      {/* Side chat panel under navbar (synced with all chat buttons) */}
      {isChatOpen && (
        <div
          ref={chatPanelRef}
          className="fixed top-16 right-4 bottom-4 bg-white border border-orange-100 rounded-3xl shadow-2xl overflow-hidden animate-slide-in-right z-40 w-96 max-w-[90vw]"
        >
          <div className="px-3 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Live Chat</p>
              <p className="text-xs text-orange-50">Ask anything about your shop</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chat panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="max-h-full h-full flex flex-col bg-gradient-to-b from-white via-white to-orange-50">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-xs font-bold text-orange-700">
                      JD
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug shadow-sm max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-orange-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    <div className="mt-1 text-[10px] uppercase tracking-wide opacity-70">
                      {msg.from === "user" ? "you" : agentName}
                    </div>
                  </div>
                  {msg.from === "user" && (
                    <div className="w-6 h-6 flex items-center justify-center text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="border-t border-orange-100 bg-white px-3 py-3">
              <div className="flex items-center bg-gray-50 rounded-2xl border border-orange-100 px-3 py-2 shadow-inner space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask us anything..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l14-7-7 14-2-5-5-2z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          )
        </div>
      )}

      {/* Floating chat button */}
      {false && (
      <button
        onClick={() => {
          setIsChatOpen((v) => !v);
          setShowNotifications(false);
          setShowAccountMenu(false);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m-5 0a4 4 0 110-8h8a4 4 0 010 8h-1l-4 4v-4" />
        </svg>
        <span className="font-semibold text-sm hidden sm:inline">{isChatOpen ? "Close chat" : "Chat with us"}</span>
      </button>
      )}

      {/* Chat panel */}
      {false && isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] bg-white shadow-2xl rounded-3xl border border-orange-100 overflow-hidden animate-slide-in-right">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 overflow-hidden flex items-center justify-center text-sm font-bold">
                {agentName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-sm">{agentName}</p>
                <p className="text-xs text-orange-50 flex items-center space-x-1">
                  <span className="h-2 w-2 bg-green-300 rounded-full inline-block" />
                  <span>Online</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={chatBodyRef} className="max-h-80 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-white via-white to-orange-50">
            <div className="text-center text-[11px] uppercase tracking-wide text-gray-400">chat started</div>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
              >
                {msg.from === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center text-xs font-bold text-orange-700">
                    JD
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-snug shadow-sm max-w-[80%] ${
                    msg.from === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  <div className="mt-1 text-[10px] uppercase tracking-wide opacity-70">
                    {msg.from === "user" ? "you" : agentName}
                  </div>
                </div>
                {msg.from === "user" && (
                  <div className="w-6 h-6 flex items-center justify-center text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="border-t border-orange-100 bg-white px-3 py-3">
            <div className="flex items-center bg-gray-50 rounded-2xl border border-orange-100 px-3 py-2 shadow-inner space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder=" How can we help?"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l14-7-7 14-2-5-5-2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-80 max-w-[90vw]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start space-x-3 rounded-2xl px-4 py-3 shadow-lg border ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}
          >
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}>
              {toast.type === "error" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 text-sm font-semibold leading-snug">{toast.message}</div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
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

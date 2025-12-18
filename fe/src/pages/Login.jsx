import { useState } from "react";
import { api } from "../api/api";

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.trim() === "") {
      setError("Please enter your mobile number");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const response = await api.findDukanByPhone(cleanPhone);
      
      if (response.success && response.dukan) {
        // Store dukan ID in localStorage
        localStorage.setItem("dukanId", response.dukan._id);
        localStorage.setItem("dukanName", response.dukan.name);
        localStorage.setItem("dukanPhone", response.dukan.phone);
        
        // Trigger login success
        if (onLoginSuccess) {
          onLoginSuccess(response.dukan);
        } else {
          // Fallback: reload page or trigger custom event
          window.dispatchEvent(new CustomEvent('dukanLoggedIn', { detail: response.dukan }));
          window.location.reload();
        }
      } else {
        setError("Dukan not found with this phone number");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to login. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="card-modern animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-2xl">उ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Enter your mobile number to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-500 font-medium">+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  className="input-modern pl-20"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(value);
                    setError("");
                  }}
                  disabled={loading}
                  maxLength={10}
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter the mobile number associated with your dukan
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !phone}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Login</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-orange-700">
                <strong>Demo:</strong> Use mobile number <strong>9625296634</strong> to login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const signupEmail = localStorage.getItem("signupEmail");
    if (!signupEmail) {
      navigate("/register");
      return;
    }
    setEmail(signupEmail);
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ""); // Only numbers
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.verifySignupOtp(email, otpValue);
      navigate("/complete-signup");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired OTP. Please try again.";
      setError(errorMessage);
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await api.sendSignupOtp(email);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to resend OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="card-modern animate-scale-in">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xl sm:text-2xl">उ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Verify Email</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter the 6-digit code sent to
              <br />
              <span className="font-semibold text-gray-900 break-all">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center space-x-2 sm:space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-all touch-target"
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none touch-target"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-orange-600 font-semibold hover:text-orange-700 disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Change email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


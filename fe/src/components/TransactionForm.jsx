import { useState } from "react";
import { api } from "../api/api";
import { v4 as uuidv4 } from "uuid";

export default function TransactionForm({ customerId, refresh }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("UDHARI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    setLoading(true);

    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setError("Please login to add transactions");
      setLoading(false);
      return;
    }

    try {
      await api.addTransaction({
        dukanId: dukanId,
        customerId,
        amount: Number(amount),
        type,
        deviceTxnId: uuidv4(),
      });
      setAmount("");
      refresh();
      
      // Show success feedback
      const button = document.querySelector('[data-submit-btn]');
      if (button) {
        button.classList.add('bg-green-500');
        setTimeout(() => button.classList.remove('bg-green-500'), 500);
      }
    } catch (err) {
      setError("Failed to save transaction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      submit();
    }
  };

  return (
    <div className="card-modern animate-scale-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Add Transaction</h3>
        <p className="text-sm text-gray-500">Record a new transaction for this customer</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              ₹
            </span>
            <input
              type="number"
              placeholder="Enter amount"
              className="input-modern pl-10"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setType("UDHARI");
                setError("");
              }}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                type === "UDHARI"
                  ? "bg-red-50 border-red-500 text-red-700 shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
              disabled={loading}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Udhari</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setType("PAID");
                setError("");
              }}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                type === "PAID"
                  ? "bg-green-50 border-green-500 text-green-700 shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
              disabled={loading}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Paid</span>
              </div>
            </button>
          </div>
        </div>

        <button
          data-submit-btn
          onClick={submit}
          disabled={loading || !amount}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Transaction</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

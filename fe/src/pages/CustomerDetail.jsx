import { useEffect, useState } from "react";
import { api } from "../api/api";
import TransactionForm from "../components/TransactionForm";

export default function CustomerDetail({ customer, back }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshBalance = () => {
    setLoading(true);
    api.getBalance(customer._id)
      .then((r) => setBalance(r.balance))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshBalance();
  }, [customer._id]);

  const isDebt = balance > 0;
  const balanceFormatted = Math.abs(balance).toLocaleString('en-IN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 animate-fade-in">
      <button 
        onClick={back} 
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Customers</span>
      </button>

      <div className="card-modern mb-6 animate-slide-down">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${
            isDebt 
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white" 
              : "bg-gradient-to-br from-green-500 to-green-600 text-white"
          }`}>
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
            {customer.phone && (
              <p className="text-gray-500 flex items-center space-x-2 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{customer.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-xl transition-all duration-300 ${
          isDebt ? "bg-red-50 border-2 border-red-200" : "bg-green-50 border-2 border-green-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Current Balance</p>
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              ) : (
                <p className={`text-4xl font-bold ${isDebt ? "text-red-600" : "text-green-600"}`}>
                  ₹{balanceFormatted}
                </p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              isDebt ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {isDebt ? "Owes" : "Paid"}
            </div>
          </div>
        </div>
      </div>

      <div className="animate-slide-up">
        <TransactionForm
          customerId={customer._id}
          refresh={refreshBalance}
        />
      </div>
    </div>
  );
}

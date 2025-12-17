import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setError("Please login to view transactions");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api.getTransactionsByDukan(dukanId)
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        setError("Failed to load transactions. Please try again.");
        console.error("Error loading transactions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-fade-in">
        <div className="card-modern text-center py-12">
          <div className="flex flex-col items-center justify-center">
            <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-fade-in">
        <div className="card-modern text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h2>
          <p className="text-gray-600">View all your transaction history</p>
        </div>
        <div className="card-modern text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500">Transactions will appear here once you start recording them</p>
        </div>
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = formatDate(transaction.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h2>
        <p className="text-gray-600">View all your transaction history</p>
      </div>

      <div className="space-y-6 animate-slide-up">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date}>
            <div className="sticky top-16 z-10 bg-gray-50 py-2 px-4 mb-3 rounded-lg">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{date}</h3>
            </div>
            <div className="space-y-2">
              {dateTransactions.map((transaction) => {
                const isUdhari = transaction.type === "UDHARI";
                const customer = transaction.customerId;
                
                return (
                  <div
                    key={transaction._id}
                    className="card-modern p-4 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isUdhari 
                            ? "bg-red-100" 
                            : "bg-green-100"
                        }`}>
                          {isUdhari ? (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">
                            {customer?.name || "Unknown Customer"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatTime(transaction.createdAt)}
                          </p>
                          {customer?.phone && (
                            <p className="text-xs text-gray-400 mt-1">{customer.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-4">
                        <div className={`text-xl font-bold ${
                          isUdhari ? "text-red-600" : "text-green-600"
                        }`}>
                          {isUdhari ? "+" : "-"}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </div>
                        <div className={`text-xs font-semibold mt-1 px-2 py-1 rounded ${
                          isUdhari 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {isUdhari ? "Udhari" : "Paid"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


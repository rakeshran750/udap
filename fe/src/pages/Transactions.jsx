import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalUdhari: 0, totalCollection: 0, count: 0 });

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
        setFilteredTransactions(data);
        
        // Calculate stats
        let totalUdhari = 0;
        let totalCollection = 0;
        data.forEach(txn => {
          if (txn.type === 'UDHARI') totalUdhari += txn.amount;
          else totalCollection += txn.amount;
        });
        setStats({ totalUdhari, totalCollection, count: data.length });
      })
      .catch((err) => {
        setError("Failed to load transactions. Please try again.");
        console.error("Error loading transactions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter transactions based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(txn => 
      txn.customerId?.name?.toLowerCase().includes(query) ||
      txn.customerId?.phone?.includes(query) ||
      txn.amount.toString().includes(query)
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-slide-down">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Transactions</h2>
        <p className="text-gray-600">View all your transaction history</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
        <div className="card-modern p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.count}</p>
        </div>
        <div className="card-modern p-4 text-center bg-red-50 border-red-100">
          <p className="text-xs text-red-600 mb-1">Udhari</p>
          <p className="text-xl font-bold text-red-600">₹{stats.totalUdhari.toLocaleString('en-IN')}</p>
        </div>
        <div className="card-modern p-4 text-center bg-green-50 border-green-100">
          <p className="text-xs text-green-600 mb-1">Collection</p>
          <p className="text-xl font-bold text-green-600">₹{stats.totalCollection.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 animate-slide-up">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer name, phone or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern pl-12"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card-modern text-center py-12">
          <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card-modern text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="card-modern text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">{searchQuery ? 'No transactions found' : 'No transactions yet'}</p>
        </div>
      )}

      {/* Transactions Table */}
      {!loading && !error && filteredTransactions.length > 0 && (
        <div className="card-modern p-0 overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((txn) => {
                  const isUdhari = txn.type === 'UDHARI';
                  return (
                    <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isUdhari ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            <span className={`text-sm font-bold ${isUdhari ? 'text-red-600' : 'text-green-600'}`}>
                              {txn.customerId?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{txn.customerId?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{formatDate(txn.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-900">{formatDate(txn.createdAt)}</p>
                        <p className="text-xs text-gray-500">{formatTime(txn.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isUdhari 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isUdhari ? 'Udhari' : 'Paid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${isUdhari ? 'text-red-600' : 'text-green-600'}`}>
                          {isUdhari ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

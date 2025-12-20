import { useEffect, useState } from "react";
import { api } from "../api/api";
import StatSummaryCard from "../components/StatSummaryCard";


export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalUdhari: 0, totalCollection: 0, count: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
    type: "UDHARI",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setError("Please login to view transactions");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [transactionsData, customersData] = await Promise.all([
        api.getTransactionsByDukan(dukanId),
        api.getCustomers(dukanId)
      ]);

      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
      setCustomers(customersData || []);
      
      // Calculate stats
      let totalUdhari = 0;
      let totalCollection = 0;
      transactionsData.forEach(txn => {
        if (txn.type === 'UDHARI') totalUdhari += txn.amount;
        else totalCollection += txn.amount;
      });
      setStats({ totalUdhari, totalCollection, count: transactionsData.length });
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    { label: "Total", value: stats.count.toLocaleString('en-IN'), color: "orange", textColor: "#0f172a" },
    { label: "Udhari", value: `₹${stats.totalUdhari.toLocaleString('en-IN')}`, color: "red", textColor: "#dc2626" },
    { label: "Collection", value: `₹${stats.totalCollection.toLocaleString('en-IN')}`, color: "green", textColor: "#15803d" },
  ];

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

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      setFormError("Please select a customer");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    const dukanId = localStorage.getItem("dukanId");
    if (!dukanId) {
      setFormError("Please login to create transactions");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      await api.addTransaction({
        dukanId,
        customerId: formData.customerId,
        amount: Number(formData.amount),
        type: formData.type,
      });

      // Reset form
      setFormData({
        customerId: "",
        amount: "",
        type: "UDHARI",
      });
      setShowCreateForm(false);
      
      // Refresh transactions
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create transaction. Please try again.";
      setFormError(errorMessage);
      console.error("Create transaction error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">
      <div className="mb-6">
        <StatSummaryCard
          title="Transactions Overview"
          ctaLabel="Create Transaction"
          onAdd={() => setShowCreateForm(true)}
          metrics={metrics}
        />
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

      {/* Create Transaction Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create Transaction</h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError("");
                    setFormData({ customerId: "", amount: "", type: "UDHARI" });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-700">{formError}</p>
                </div>
              )}

              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => {
                      setFormData({ ...formData, customerId: e.target.value });
                      setFormError("");
                    }}
                    className="input-modern"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} {customer.phone ? `(${customer.phone})` : ""}
                      </option>
                    ))}
                  </select>
                  {customers.length === 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      No customers found. <a href="/customers" className="text-orange-600 hover:underline">Create one</a>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="input-modern pl-10"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({ ...formData, amount: e.target.value });
                        setFormError("");
                      }}
                      disabled={submitting}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "UDHARI" })}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                        formData.type === "UDHARI"
                          ? "bg-red-50 border-red-500 text-red-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                      disabled={submitting}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Udhari</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "PAID" })}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                        formData.type === "PAID"
                          ? "bg-green-50 border-green-500 text-green-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                      disabled={submitting}
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

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 touch-target disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Transaction"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormError("");
                      setFormData({ customerId: "", amount: "", type: "UDHARI" });
                    }}
                    className="btn-secondary px-6 touch-target"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
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

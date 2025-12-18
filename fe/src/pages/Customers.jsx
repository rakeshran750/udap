import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, withBalance: 0, totalBalance: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setError("Please login to view customers");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api.getCustomers(dukanId)
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);

        // Fetch balances for all customers
        const balancePromises = data.map((c) =>
          api.getBalance(c._id).then((r) => ({ id: c._id, balance: r.balance }))
        );

        Promise.all(balancePromises).then((balanceResults) => {
          const balanceMap = {};
          let totalBalance = 0;
          let withBalance = 0;
          
          balanceResults.forEach(({ id, balance }) => {
            balanceMap[id] = balance;
            if (balance > 0) {
              totalBalance += balance;
              withBalance++;
            }
          });
          
          setBalances(balanceMap);
          setStats({ total: data.length, withBalance, totalBalance });
        });
      })
      .catch((err) => {
        setError("Failed to load customers. Please try again.");
        console.error("Error loading customers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter customers based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(c => 
      c.name?.toLowerCase().includes(query) ||
      c.phone?.includes(query)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleCustomerClick = (customer) => {
    navigate(`/customers/${customer._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-slide-down">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Customers</h2>
        <p className="text-gray-600">Manage customer transactions and balances</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
        <div className="card-modern p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="card-modern p-4 text-center bg-orange-50 border-orange-100">
          <p className="text-xs text-orange-600 mb-1">With Balance</p>
          <p className="text-xl font-bold text-orange-600">{stats.withBalance}</p>
        </div>
        <div className="card-modern p-4 text-center bg-red-50 border-red-100">
          <p className="text-xs text-red-600 mb-1">Total Due</p>
          <p className="text-xl font-bold text-red-600">₹{stats.totalBalance.toLocaleString('en-IN')}</p>
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
            placeholder="Search by customer name or phone..."
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
          <p className="text-gray-600">Loading customers...</p>
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
      {!loading && !error && filteredCustomers.length === 0 && (
        <div className="card-modern text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-500">{searchQuery ? 'No customers found' : 'No customers yet'}</p>
        </div>
      )}

      {/* Customers Table */}
      {!loading && !error && filteredCustomers.length > 0 && (
        <div className="card-modern p-0 overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => {
                  const balance = balances[customer._id] || 0;
                  const hasBalance = balance > 0;
                  
                  return (
                    <tr 
                      key={customer._id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            hasBalance ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            <span className={`text-sm font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                              {customer.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${hasBalance ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{Math.abs(balance).toLocaleString('en-IN')}
                        </span>
                        {hasBalance && (
                          <p className="text-xs text-red-500">Due</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
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

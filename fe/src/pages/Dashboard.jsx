import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBalance: 0,
    periods: []
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [stats7, stats15, stats30, transactions] = await Promise.all([
        api.getDashboardStats(dukanId, 7),
        api.getDashboardStats(dukanId, 15),
        api.getDashboardStats(dukanId, 30),
        api.getTransactionsByDukan(dukanId),
      ]);

      setStats({
        totalBalance: stats7.data?.totalBalance || 0,
        periods: [
          {
            label: "7 Days",
            udhari: stats7.data?.totalUdhari || 0,
            collection: stats7.data?.totalCollection || 0,
            newCustomers: stats7.data?.newCustomers || 0,
            repeatCustomers: stats7.data?.repeatCustomers || 0,
          },
          {
            label: "15 Days",
            udhari: stats15.data?.totalUdhari || 0,
            collection: stats15.data?.totalCollection || 0,
            newCustomers: stats15.data?.newCustomers || 0,
            repeatCustomers: stats15.data?.repeatCustomers || 0,
          },
          {
            label: "30 Days",
            udhari: stats30.data?.totalUdhari || 0,
            collection: stats30.data?.totalCollection || 0,
            newCustomers: stats30.data?.newCustomers || 0,
            repeatCustomers: stats30.data?.repeatCustomers || 0,
          },
        ]
      });

      // Get last 5 transactions
      setRecentTransactions(transactions.slice(0, 5));
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate chart data (last 7 days)
  const getChartData = () => {
    const period = stats.periods[0] || { udhari: 0, collection: 0 };
    const total = period.udhari + period.collection;
    const udhariPercent = total > 0 ? (period.udhari / total) * 100 : 50;
    const collectionPercent = total > 0 ? (period.collection / total) * 100 : 50;
    return { udhariPercent, collectionPercent, udhari: period.udhari, collection: period.collection };
  };

  const chartData = getChartData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-slide-down">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Your business overview</p>
      </div>

      {/* Total Balance Card */}
      <div className="card-modern bg-gradient-to-r from-orange-500 to-red-500 mb-6 animate-slide-up">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm font-semibold text-orange-100 mb-1">Total Pending Balance</p>
            {loading ? (
              <div className="h-10 w-40 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl md:text-4xl font-bold">
                ₹{stats.totalBalance.toLocaleString('en-IN')}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Period Stats - Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory mb-6 animate-slide-up">
        {stats.periods.map((period, index) => (
          <div 
            key={index} 
            className="card-modern min-w-[260px] flex-shrink-0 snap-start"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-100">
              <span className="text-base font-bold text-gray-900">{period.label}</span>
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-2">
                <p className="text-xs text-red-600 font-medium">Udhari</p>
                {loading ? (
                  <div className="h-5 w-14 bg-red-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-lg font-bold text-red-600">₹{period.udhari.toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-green-600 font-medium">Collection</p>
                {loading ? (
                  <div className="h-5 w-14 bg-green-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-lg font-bold text-green-600">₹{period.collection.toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-600 font-medium">New</p>
                {loading ? (
                  <div className="h-5 w-8 bg-blue-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-lg font-bold text-blue-600">{period.newCustomers}</p>
                )}
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs text-purple-600 font-medium">Repeat</p>
                {loading ? (
                  <div className="h-5 w-8 bg-purple-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-lg font-bold text-purple-600">{period.repeatCustomers}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout - Graph & Recent Transactions */}
      <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
        {/* Analytics Chart */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Analytics (7 Days)</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Weekly</span>
          </div>

          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                {/* Collection (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${chartData.collectionPercent * 2.51} 251`}
                  strokeLinecap="round"
                />
                {/* Udhari (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${chartData.udhariPercent * 2.51} 251`}
                  strokeDashoffset={`-${chartData.collectionPercent * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{((chartData.udhari + chartData.collection) / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <div>
                <p className="text-xs text-gray-500">Udhari</p>
                <p className="text-sm font-bold text-gray-900">₹{chartData.udhari.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <div>
                <p className="text-xs text-gray-500">Collection</p>
                <p className="text-sm font-bold text-gray-900">₹{chartData.collection.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn, index) => (
                <div 
                  key={txn._id || index} 
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'UDHARI' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {txn.type === 'UDHARI' ? (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {txn.customerId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${txn.type === 'UDHARI' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'UDHARI' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

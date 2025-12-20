import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import MockRevenueChart from "../components/MockRevenueChart";
import SimpleLineChart from "../components/SimpleLineChart";
import StatSummaryCard from "../components/StatSummaryCard";
import MobileDashboard from "./MobileDashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBalance: 0,
    periods: []
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const dukanId = localStorage.getItem("dukanId");
    
    if (!dukanId) {
      setLoading(false);
      // User has no shop, show empty state
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Calculate chart data (last 7 days)
  const getChartData = () => {
    const period = stats.periods[0] || { udhari: 0, collection: 0 };
    const total = period.udhari + period.collection;
    const udhariPercent = total > 0 ? (period.udhari / total) * 100 : 50;
    const collectionPercent = total > 0 ? (period.collection / total) * 100 : 50;
    return { udhariPercent, collectionPercent, udhari: period.udhari, collection: period.collection };
  };

  const chartData = getChartData();

  const dukanId = localStorage.getItem("dukanId");
  const totalAmount = chartData.udhari + chartData.collection;
  const metrics = [
    { label: "Total", value: `₹${totalAmount.toLocaleString('en-IN')}`, color: "orange", textColor: "#0f172a" },
    { label: "Udhari", value: `₹${chartData.udhari.toLocaleString('en-IN')}`, color: "red", textColor: "#dc2626" },
    { label: "Collection", value: `₹${chartData.collection.toLocaleString('en-IN')}`, color: "green", textColor: "#15803d" },
  ];

  if (isMobile) {
    return <MobileDashboard />;
  }

  // Show empty state if no shop
  if (!dukanId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">
      <div className="card-modern text-center py-12 animate-slide-up">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Shop Added Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add your first shop to start managing customers and transactions. You can add a shop from the Account section.
          </p>
          <a
            href="/account"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Go to Account</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 animate-fade-in">



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


      {/* Two Column Layout - Graph & Recent Transactions */}
      <div className="grid md:grid-cols-6 gap-6 animate-slide-up">
        {/* Analytics Chart */}
        <div className="col-span-4" >
          <SimpleLineChart />
        </div>

        <div className="card-modern col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i)=>(
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.slice(0,5).map((txn, idx) => (
                <div key={txn._id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{txn.customerId?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {txn.customerId?.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${txn.type === 'UDHARI' ? 'text-red-600' : 'text-green-600'}`}>
                      {txn.type === 'UDHARI' ? '+' : '-'}ƒ,1{txn.amount.toLocaleString('en-IN')}
                    </span>
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

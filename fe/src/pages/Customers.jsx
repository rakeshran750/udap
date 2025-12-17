import { useEffect, useState } from "react";
import { api } from "../api/api";
import CustomerCard from "../components/CustomerCard";
import CustomerDetail from "./CustomerDetail";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [balances, setBalances] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        // Fetch balances for all customers
        const balancePromises = data.map((c) =>
          api.getBalance(c._id).then((r) => ({ id: c._id, balance: r.balance }))
        );

        Promise.all(balancePromises).then((balanceResults) => {
          const balanceMap = {};
          balanceResults.forEach(({ id, balance }) => {
            balanceMap[id] = balance;
          });
          setBalances(balanceMap);
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

  if (selected)
    return (
      <div className="pb-24 md:pb-0">
        <CustomerDetail customer={selected} back={() => setSelected(null)} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customers</h2>
        <p className="text-gray-600">Manage customer transactions and balances</p>
      </div>

      {loading && (
        <div className="card-modern text-center py-12 animate-fade-in">
          <div className="flex flex-col items-center justify-center">
            <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card-modern text-center py-12 animate-fade-in">
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
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="card-modern text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
          <p className="text-gray-500">Start by adding your first customer</p>
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          {customers.map((c, index) => (
            <CustomerCard
              key={c._id}
              customer={c}
              balance={balances[c._id] || 0}
              onClick={() => setSelected(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
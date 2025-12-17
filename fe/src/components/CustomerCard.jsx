export default function CustomerCard({ customer, balance, onClick }) {
  const isDebt = balance > 0;
  const balanceFormatted = Math.abs(balance).toLocaleString('en-IN');

  return (
    <div
      onClick={onClick}
      className="card-modern card-hover cursor-pointer group animate-scale-in"
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md transition-all duration-300 group-hover:scale-110 ${
              isDebt 
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white" 
                : "bg-gradient-to-br from-green-500 to-green-600 text-white"
            }`}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-primary-600 transition-colors">
              {customer.name}
            </h3>
            <div className="flex items-center space-x-2">
              {customer.phone && (
                <>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm text-gray-500 truncate">{customer.phone}</p>
                </>
              )}
              {!customer.phone && (
                <p className="text-sm text-gray-400 italic">No phone number</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <div className={`text-right px-4 py-2 rounded-xl transition-all duration-300 ${
            isDebt 
              ? "bg-red-50 group-hover:bg-red-100" 
              : "bg-green-50 group-hover:bg-green-100"
          }`}>
            <div className={`text-2xl font-bold ${
              isDebt ? "text-red-600" : "text-green-600"
            }`}>
              ₹{balanceFormatted}
            </div>
            <div className={`text-xs font-semibold mt-1 ${
              isDebt ? "text-red-600" : "text-green-600"
            }`}>
              {isDebt ? "Owes" : "Paid"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Tap to view details</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const handleGetStarted = () => {
    // Trigger login via custom event
    window.dispatchEvent(new CustomEvent('showLogin'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12 animate-slide-down">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-glow-lg">
            <span className="text-white font-bold text-4xl">U</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Udhari App
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Manage Customer Transactions
          </p>
          <p className="text-lg text-gray-500">
            Track balances, record transactions, and manage your business effortlessly
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="card-modern text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Balances</h3>
            <p className="text-gray-600">Keep track of all customer balances in one place</p>
          </div>

          <div className="card-modern text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Record Transactions</h3>
            <p className="text-gray-600">Quickly add udhari and payment transactions</p>
          </div>

          <div className="card-modern text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">PWA Ready</h3>
            <p className="text-gray-600">Install as an app and use offline</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-scale-in">
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg px-8 py-4 shadow-glow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>Simple. Fast. Reliable.</p>
        </div>
      </div>
    </div>
  );
}


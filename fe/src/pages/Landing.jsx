import { useState } from "react";
import { useNavigate } from "react-router-dom";

const content = {
  en: {
    brandName: "Udhari Khata",
    heroTitle: "Manage your shop credit easily",
    heroSubtitle: "Track customer credit, record transactions, and manage your shop effortlessly",
    heroTagline: "Digital Udhari Management for Your Shop",
    learnMore: "Learn more",
    getStarted: "Get Started",
    moreThan: "More than 500+",
    shopOwners: "shop owners",
    features: "FEATURES",
    featuresTitle: "Get a many of interesting features",
    feature1Title: "Track Credit",
    feature1Desc: "Keep track of all customer balances in one place",
    feature2Title: "Customer List", 
    feature2Desc: "All customer info and dues at one place",
    feature3Title: "Works Offline",
    feature3Desc: "Use without internet - offline support",
    aboutTitle: "About Us",
    aboutDesc: "We are dedicated to helping small shop owners in rural India manage their daily credit transactions digitally. No more lost records, no more disputes - just simple, reliable tracking.",
    aboutPoint1: "Built for Indian shop owners",
    aboutPoint2: "Simple and easy to use",
    aboutPoint3: "Works in Hindi and English",
    testimonials: "TESTIMONIALS",
    testimonialsTitle: "What our users say",
    trustTitle: "Kirana, Medical, General Store",
    trustDesc: "Made for every type of shop. Whether village or town, say goodbye to paper ledgers!",
    trustPoint1: "No more paper bahi khata",
    trustPoint2: "No chance of mistakes",
    trustPoint3: "Check accounts anytime, anywhere",
    freeToUse: "Free to use",
    madeFor: "Made for Bharat with",
    tagline: "Simple • Fast • Reliable",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    home: "Home",
    about: "About",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  hi: {
    brandName: "उधारी खाता",
    heroTitle: "अपनी दुकान का उधार आसानी से संभालें",
    heroSubtitle: "ग्राहकों की उधारी, लेन-देन और दुकान का हिसाब आसानी से रखें",
    heroTagline: "आपकी दुकान के लिए डिजिटल उधारी प्रबंधन",
    learnMore: "और जानें",
    getStarted: "शुरू करें",
    moreThan: "500+ से ज्यादा",
    shopOwners: "दुकानदार",
    features: "सुविधाएं",
    featuresTitle: "कई दिलचस्प सुविधाएं पाएं",
    feature1Title: "उधारी का हिसाब",
    feature1Desc: "सभी ग्राहकों का बकाया एक जगह देखें",
    feature2Title: "ग्राहक सूची",
    feature2Desc: "सभी ग्राहकों की जानकारी और बकाया एक जगह",
    feature3Title: "ऑफलाइन चलाएं",
    feature3Desc: "बिना इंटरनेट भी काम करे",
    aboutTitle: "हमारे बारे में",
    aboutDesc: "हम भारत के छोटे दुकानदारों को उनके रोज़मर्रा के उधार लेन-देन को डिजिटल रूप से प्रबंधित करने में मदद करने के लिए समर्पित हैं। अब कोई खोई हुई प्रविष्टियाँ नहीं, कोई विवाद नहीं।",
    aboutPoint1: "भारतीय दुकानदारों के लिए बनाया",
    aboutPoint2: "सरल और उपयोग में आसान",
    aboutPoint3: "हिंदी और अंग्रेज़ी में काम करता है",
    testimonials: "प्रशंसापत्र",
    testimonialsTitle: "हमारे उपयोगकर्ता क्या कहते हैं",
    trustTitle: "किराना, मेडिकल, जनरल स्टोर",
    trustDesc: "हर तरह की दुकान के लिए बनाया गया। चाहे गाँव हो या कस्बा, अब खाता बही की झंझट खत्म!",
    trustPoint1: "कागज की बही से छुटकारा",
    trustPoint2: "गलती की कोई गुंजाइश नहीं",
    trustPoint3: "कभी भी, कहीं भी देखें हिसाब",
    freeToUse: "मुफ्त में इस्तेमाल करें",
    madeFor: "भारत के लिए बनाया",
    tagline: "सरल • तेज़ • भरोसेमंद",
    contactUs: "संपर्क करें",
    quickLinks: "त्वरित लिंक",
    home: "होम",
    about: "हमारे बारे में",
    contact: "संपर्क",
    rights: "सर्वाधिकार सुरक्षित।",
  }
};

const testimonials = [
  {
    name: { en: "Ramesh Kumar", hi: "रमेश कुमार" },
    role: { en: "Kirana Store Owner, Varanasi", hi: "किराना स्टोर मालिक, वाराणसी" },
    text: { en: "This app has made my life so much easier. No more maintaining paper registers!", hi: "इस ऐप ने मेरी ज़िंदगी बहुत आसान कर दी है। अब कोई कागज़ी रजिस्टर नहीं रखना पड़ता!" },
    rating: 5,
  },
  {
    name: { en: "Sunita Devi", hi: "सुनीता देवी" },
    role: { en: "Medical Store, Patna", hi: "मेडिकल स्टोर, पटना" },
    text: { en: "Very simple to use. Even my father who is 65 years old uses it easily.", hi: "बहुत आसान है। मेरे 65 साल के पिताजी भी इसे आराम से चलाते हैं।" },
    rating: 5,
  },
  {
    name: { en: "Mohammad Irfan", hi: "मोहम्मद इरफान" },
    role: { en: "General Store, Lucknow", hi: "जनरल स्टोर, लखनऊ" },
    text: { en: "Best app for udhari management. Customers also trust the digital records.", hi: "उधारी प्रबंधन के लिए सबसे अच्छा ऐप। ग्राहक भी डिजिटल रिकॉर्ड पर भरोसा करते हैं।" },
    rating: 5,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[lang];

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Fixed */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">उ</span>
          </div>
          <span className="font-bold text-lg md:text-xl text-gray-800">{t.brandName}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Nav Links - Fixed width to prevent shifting */}
          <button onClick={() => scrollToSection('home')} className="w-20 text-center text-gray-600 hover:text-orange-500 font-medium transition-colors">
            {t.home}
          </button>
          <button onClick={() => scrollToSection('about')} className="w-20 text-center text-gray-600 hover:text-orange-500 font-medium transition-colors">
            {t.about}
          </button>
          <button onClick={() => scrollToSection('features')} className="w-20 text-center text-gray-600 hover:text-orange-500 font-medium transition-colors">
            {lang === 'hi' ? 'सुविधाएं' : 'Features'}
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="w-24 text-center text-gray-600 hover:text-orange-500 font-medium transition-colors">
            {lang === 'hi' ? 'प्रशंसापत्र' : 'Testimonials'}
          </button>
          <button onClick={() => scrollToSection('contact')} className="w-20 text-center text-gray-600 hover:text-orange-500 font-medium transition-colors">
            {t.contact}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 ml-4">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === "en" 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === "hi" 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              हि
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogin}
              className="bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all hover:shadow-lg text-sm sm:text-base"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all hover:shadow-lg text-sm sm:text-base"
            >
              {t.getStarted}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden z-50 animate-slide-down">
            <div className="flex flex-col space-y-3 mb-4">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                {t.home}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                {t.about}
              </button>
              <button onClick={() => scrollToSection('features')} className="text-left text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                {lang === 'hi' ? 'सुविधाएं' : 'Features'}
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-left text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                {lang === 'hi' ? 'प्रशंसापत्र' : 'Testimonials'}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                {t.contact}
              </button>
            </div>
            <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 mb-4">
              <button
                onClick={() => setLang("en")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-1 ${
                  lang === "en" 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-gray-600"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-1 ${
                  lang === "hi" 
                    ? "bg-white text-orange-600 shadow-sm" 
                    : "text-gray-600"
                }`}
              >
                हिंदी
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleLogin}
                className="w-full bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 px-6 py-3 rounded-full font-medium"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
              >
                {t.getStarted}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce hidden md:block" />
        <div className="absolute top-40 left-20 w-3 h-3 bg-blue-400 rounded-full animate-pulse hidden md:block" />
        <div className="absolute top-16 right-1/4 w-6 h-6 bg-green-400 rounded-full opacity-60 hidden md:block" />
        <div className="absolute top-32 right-10 w-4 h-4 bg-pink-400 rounded-full animate-bounce hidden md:block" style={{ animationDelay: '0.5s' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in text-center md:text-left order-2 md:order-1">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                {lang === 'hi' ? (
                  <>
                    अपनी दुकान का{" "}
                    <span className="text-orange-500">उधार आसानी से</span>{" "}
                    संभालें
                  </>
                ) : (
                  <>
                    Manage your{" "}
                    <span className="text-orange-500">shop credit</span>{" "}
                    easily
                  </>
                )}
              </h1>
              <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => scrollToSection('about')}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:shadow-xl"
                >
                  {t.learnMore}
                </button>
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3.5 rounded-full font-medium transition-all"
                >
                  {t.getStarted}
                </button>
              </div>
            </div>

            {/* Right Content - Image with Orange Blob */}
            <div className="relative animate-scale-in order-1 md:order-2">
              {/* Orange blob background */}
              <div className="absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-90" />
              
              {/* Main Image - Indian Rural Shop */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&q=80"
                  alt="Indian Rural Shop Owner"
                  className="w-56 md:w-72 lg:w-80 mx-auto rounded-2xl shadow-2xl"
                />
                
                {/* Stats Card */}
                <div className="absolute -bottom-4 left-4 md:left-0 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center space-x-3 animate-slide-up">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm md:text-base">{t.moreThan}</p>
                    <p className="text-gray-500 text-xs md:text-sm">{t.shopOwners}</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-10 -left-2 md:-left-4 bg-white rounded-xl shadow-lg p-2 md:p-3 animate-bounce">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="absolute bottom-20 -right-2 md:-right-4 bg-white rounded-xl shadow-lg p-2 md:p-3 animate-bounce" style={{ animationDelay: '0.3s' }}>
                <svg className="w-6 h-6 md:w-7 md:h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
                  alt="Shop owner with mobile"
                  className="w-full h-40 md:h-52 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80"
                  alt="Hand with phone"
                  className="w-full h-32 md:h-40 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1595877244574-e90ce41ce089?w=400&q=80"
                  alt="Kirana store"
                  className="w-full h-32 md:h-40 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80"
                  alt="Rural market"
                  className="w-full h-40 md:h-52 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-orange-500 font-medium tracking-wider mb-2">{lang === 'hi' ? 'हमारे बारे में' : 'ABOUT US'}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t.aboutTitle}</h2>
              <p className="text-gray-600 text-lg mb-8">{t.aboutDesc}</p>
              
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">✓</span>
                  <span className="text-gray-700">{t.aboutPoint1}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">✓</span>
                  <span className="text-gray-700">{t.aboutPoint2}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">✓</span>
                  <span className="text-gray-700">{t.aboutPoint3}</span>
                </li>
              </ul>

              <button
                onClick={handleGetStarted}
                className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-lg"
              >
                {t.getStarted}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-orange-500 font-medium tracking-wider mb-2">{t.features}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{t.featuresTitle}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{t.feature1Title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t.feature1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{t.feature2Title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t.feature2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{t.feature3Title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-medium tracking-wider mb-2">{t.testimonials}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{t.testimonialsTitle}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow border border-orange-100">
                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 mb-6 italic">"{item.text[lang]}"</p>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.name[lang].charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.name[lang]}</p>
                    <p className="text-gray-500 text-sm">{item.role[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-14 text-white">
                <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 flex items-center">
                  <svg className="w-7 h-7 md:w-8 md:h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t.trustTitle}
                </h3>
                <p className="text-base md:text-lg text-orange-100 mb-6 md:mb-8">
                  {t.trustDesc}
                </p>
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-center text-orange-100 text-sm md:text-base">
                    <span className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t.trustPoint1}
                  </li>
                  <li className="flex items-center text-orange-100 text-sm md:text-base">
                    <span className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t.trustPoint2}
                  </li>
                  <li className="flex items-center text-orange-100 text-sm md:text-base">
                    <span className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t.trustPoint3}
                  </li>
                </ul>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80" 
                  alt="Indian Shop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg md:text-xl font-bold px-8 md:px-12 py-4 md:py-5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {t.getStarted} →
          </button>
          <p className="mt-4 text-gray-500">{t.freeToUse}</p>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">उ</span>
                </div>
                <span className="font-bold text-xl">{t.brandName}</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                {t.heroSubtitle}
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t.quickLinks}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-orange-500 transition-colors">{t.home}</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition-colors">{t.about}</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'सुविधाएं' : 'Features'}</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-orange-500 transition-colors">{lang === 'hi' ? 'प्रशंसापत्र' : 'Testimonials'}</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t.contactUs}</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+919625296634" className="hover:text-orange-500 transition-colors">+91-9625296634</a>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:rakeshran750@gmail.com" className="hover:text-orange-500 transition-colors text-sm md:text-base break-all">rakeshran750@gmail.com</a>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>India 🇮🇳</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2024 {t.brandName}. {t.rights}</p>
            <p className="mt-2 md:mt-0 flex items-center">
              {t.madeFor}
              <svg className="w-4 h-4 mx-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              | {t.tagline}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

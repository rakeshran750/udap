import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { showErrorToast, showSuccessToast } from "../utils/toast";

export default function Account({ dukanInfo, onLogout }) {
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddShop, setShowAddShop] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const dukanName = dukanInfo?.name || localStorage.getItem("dukanName") || "";
  const dukanPhone = dukanInfo?.phone || localStorage.getItem("dukanPhone") || "";
  const dukanId = dukanInfo?._id || localStorage.getItem("dukanId") || "";

  useEffect(() => {
    fetchUserAndShops();
  }, []);

  const fetchUserAndShops = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch shops
      const shopsData = await api.getAllDukans();
      setShops(shopsData || []);
      
      // If user has shops, set the first one as active
      if (shopsData && shopsData.length > 0 && !dukanId) {
        const firstShop = shopsData[0];
        localStorage.setItem("dukanId", firstShop._id);
        localStorage.setItem("dukanName", firstShop.name);
        localStorage.setItem("dukanPhone", firstShop.phone || "");
      }
    } catch (err) {
      console.error("Error fetching user/shops:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleAddShop = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === "") {
      showErrorToast("Please enter shop name");
      return;
    }

    if (!formData.phone || formData.phone.trim() === "") {
      showErrorToast("Please enter shop phone number");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      showErrorToast("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await api.createDukan({
        name: formData.name,
        ownerName: formData.ownerName || user?.name || "",
        phone: formData.phone.replace(/\D/g, ""),
        address: formData.address || "",
      });

      if (response.data) {
        // Store shop info
        localStorage.setItem("dukanId", response.data._id);
        localStorage.setItem("dukanName", response.data.name);
        localStorage.setItem("dukanPhone", response.data.phone);
        
        // Reset form
        setFormData({
          name: "",
          ownerName: "",
          phone: "",
          address: "",
        });
        setShowAddShop(false);
        showSuccessToast("Shop created successfully");
        
        // Refresh shops list
        await fetchUserAndShops();
        
        // Reload to update app state
        window.location.reload();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create shop. Please try again.";
      setError(errorMessage);
      showErrorToast(errorMessage);
      console.error("Create shop error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("dukanId");
      localStorage.removeItem("dukanName");
      localStorage.removeItem("dukanPhone");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-24 animate-fade-in">


      <div className="space-y-6 animate-slide-up">
        {/* User Profile Card */}
        <div className="card-modern">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || "User"}</h3>
              <p className="text-gray-600 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{user?.email || "No email"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Shops Section */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Shops</h3>
            {!showAddShop && (
              <button
                onClick={() => setShowAddShop(true)}
                className="btn-primary py-2 px-3 sm:px-4 text-xs sm:text-sm touch-target"
              >
                + Add Shop
              </button>
            )}
          </div>
          {showAddShop && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-900">Add Shop</h4>
                    <button
                      onClick={() => {
                        setShowAddShop(false);
                        setError("");
                        setFormData({
                          name: "",
                          ownerName: "",
                          phone: "",
                          address: "",
                        });
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleAddShop} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Shop Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        placeholder="e.g., Ramesh Kirana Store"
                        className="input-modern"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Owner Name
                      </label>
                      <input
                        name="ownerName"
                        type="text"
                        placeholder="Enter owner name"
                        className="input-modern"
                        value={formData.ownerName}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Shop Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                          <span className="text-gray-500 font-medium">+91</span>
                        </div>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          className="input-modern pl-16"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            handleChange({ target: { name: "phone", value } });
                          }}
                          disabled={submitting}
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Shop Address
                      </label>
                      <textarea
                        name="address"
                        rows={3}
                        placeholder="Enter shop address (optional)"
                        className="input-modern resize-none"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex-1 py-3 disabled:opacity-50 touch-target"
                      >
                        {submitting ? "Creating..." : "Create Shop"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddShop(false);
                          setError("");
                          setFormData({
                            name: "",
                            ownerName: "",
                            phone: "",
                            address: "",
                          });
                        }}
                        className="btn-secondary py-3 px-6 touch-target"
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

          {!showAddShop && (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : shops.length === 0 ? (
                <div className="text-center py-8 border-t border-gray-100 mt-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">No shops added yet</p>
                  <button
                    onClick={() => setShowAddShop(true)}
                    className="btn-primary"
                  >
                    Add Your First Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-3 border-t border-gray-100 pt-4 mt-4">
                  {shops.map((shop) => (
                    <div
                      key={shop._id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        shop._id === dukanId
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-orange-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{shop.name}</h4>
                          <p className="text-sm text-gray-600">
                            {shop.phone ? `+91 ${shop.phone}` : "No phone"}
                            {shop._id === dukanId && (
                              <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </p>
                        </div>
                        {shop._id !== dukanId && (
                          <button
                            onClick={() => {
                              localStorage.setItem("dukanId", shop._id);
                              localStorage.setItem("dukanName", shop.name);
                              localStorage.setItem("dukanPhone", shop.phone || "");
                              window.location.reload();
                            }}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Current Shop Info (if exists) */}
        {dukanId && dukanName && (
          <div className="card-modern">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Shop Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Store Name</p>
                    <p className="font-semibold text-gray-900">{dukanName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-semibold text-gray-900">{dukanPhone || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


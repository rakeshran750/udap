import { Link, useLocation } from "react-router-dom";

const labels = {
  "": "Home",
  dashboard: "Dashboard",
  transactions: "Transactions",
  customers: "Customers",
  account: "Account",
  login: "Login",
  register: "Register",
  "verify-otp": "Verify OTP",
  "complete-signup": "Complete Signup",
  "add-shop": "Add Shop",
};

const formatSegment = (segment) => {
  if (labels[segment] !== undefined) return labels[segment];
  if (/^[a-f0-9]{10,}$/i.test(segment)) return "Detail";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs = [
    {
      name: labels[""] || "Home",
      path: "/",
    },
    ...segments.map((segment, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      return { name: formatSegment(segment), path };
    }),
  ];

  return (
    <nav className="text-sm text-gray-500 flex items-center flex-wrap gap-2" aria-label="Breadcrumb">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={crumb.path} className="flex items-center gap-2">
            {idx !== 0 && (
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {isLast ? (
              <span className="font-semibold text-orange-600">{crumb.name}</span>
            ) : (
              <Link to={crumb.path} className="text-orange-600 hover:underline">
                {crumb.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

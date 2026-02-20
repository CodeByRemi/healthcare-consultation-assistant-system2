import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    if (item === "Login") {
      navigate("/choose-path");
    }
    // Add other navigation handlers as needed
  };

  return (
    <nav className="absolute w-full top-0 z-50 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwGxHeUaYhBFlm1FiEDBlhJgd4Ll4hcaEI0dbgBRDE2tTjLHwzT_Is4u-OcH5V9PVb0qc4xE1Iuaj1Bs3L3XjhoD4MkxLkKKX2sOHIJu8J5G7RNiiZ9EEQbfXZ0RVWp1xgSYPBJJEjcJ7muFBTwBgRdrbCr6Nc5iKdfwI3PUaYUneVk08jaEpwJsA4X0rh_KooINYMU4jHaDO7ivnpNmX1XQR8K7Q0bIb2a3G91zMP0wltAuChzDOzL9JqkuAH2tQ2IB_5UNX0_Gk"
            alt="Medicare Logo"
            className="h-8 opacity-80"
          />
          <span className="text-xl font-bold tracking-widest uppercase text-primary">
            Medicare
          </span>
        </div>

        <div className="hidden md:flex gap-10 text-sm font-medium uppercase">
          {["Services", "Doctors", "About Us", "Login", "Contact Us"].map(
            (item) => (
              <button
                key={item}
                onClick={() => handleNavigation(item)}
                className="hover:text-secondary transition-colors cursor-pointer bg-none border-none"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

import { useNavigate } from "react-router-dom";

export default function LoginNavbar() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar {
          animation: slideDown 0.6s ease-out;
        }

        .home-btn {
          transition: all 0.3s ease;
          position: relative;
        }

        .home-btn:hover {
          transform: translateX(-4px);
        }

        .home-btn::before {
          content: '←';
          margin-right: 0.5rem;
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .home-btn:hover::before {
          transform: translateX(-3px);
        }
      `}</style>
      
      <nav className="navbar w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Branding */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Medicare
              </span>
            </div>

            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="home-btn flex items-center px-4 py-2 text-blue-500 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

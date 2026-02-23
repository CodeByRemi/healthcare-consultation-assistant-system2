import { useNavigate } from "react-router-dom";
import patientimg from "../../../assets/patientreg.png";

export default function LoginNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white/95 backdrop-blur border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={patientimg}
                alt="Medicare Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-primary tracking-wide">
                Medicare
              </span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 text-primary font-semibold hover:text-accent hover:bg-surface rounded-lg transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>
  );
}

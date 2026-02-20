import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "./AuthInput";

export default function AuthLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br bg-green-700 from-gray-50 to-gray-100 p-4">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-container {
          animation: fadeIn 0.5s ease-out;
        }

        .header {
          animation: slideInUp 0.6s ease-out;
        }

        .subtitle {
          animation: fadeIn 0.7s ease-out 0.15s both;
        }

        .form-item {
          animation: slideInUp 0.6s ease-out both;
          transition: all 0.3s ease;
        }

        .form-item:nth-child(1) { animation-delay: 0.1s; }
        .form-item:nth-child(2) { animation-delay: 0.18s; }

        .submit-btn {
          animation: slideInUp 0.6s ease-out 0.3s both;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover:before {
          left: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          background-color: #2563eb;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .footer-link {
          animation: fadeIn 0.7s ease-out 0.45s both;
        }

        .footer-link button {
          position: relative;
          transition: color 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font: inherit;
        }

        .footer-link button::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .footer-link button:hover::after {
          width: 100%;
        }

        .remember-checkbox {
          animation: slideInUp 0.6s ease-out 0.26s both;
        }
      `}</style>

      <div className="form-container w-full max-w-md">
        <div className="header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign In
          </h1>
          <div className="w-12 h-1 bg-blue-500 rounded"></div>
        </div>
        <p className="text-sm text-gray-600 mb-8 subtitle">
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-item">
            <AuthInput label="Email Address" type="email" placeholder="john@example.com" />
          </div>
          <div className="form-item">
            <AuthInput label="Password" type="password" placeholder="••••••••" />
          </div>

          <div className="remember-checkbox flex items-center gap-2">
            <input type="checkbox" id="remember" className="w-4 h-4 cursor-pointer accent-blue-500" />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn w-full py-2.5 rounded-lg text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 pb-4">
          <a href="#" className="text-sm text-blue-500 font-semibold hover:text-blue-600">
            Forgot your password?
          </a>
        </div>

        <p className="text-sm text-center text-gray-600 footer-link">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/patient-reg")}
            className="text-blue-500 font-semibold hover:text-blue-600"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

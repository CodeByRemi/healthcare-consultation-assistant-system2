import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "./AuthInput";
import AuthSelect from "./AuthSelect";

export default function RegisterForm() {
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
    <div className="w-full">
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
        .form-item:nth-child(3) { animation-delay: 0.26s; }
        .form-item:nth-child(4) { animation-delay: 0.34s; }
        .form-item:nth-child(5) { animation-delay: 0.42s; }

        .submit-btn {
          animation: slideInUp 0.6s ease-out 0.5s both;
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

        .signin-link {
          animation: fadeIn 0.7s ease-out 0.6s both;
        }

        .signin-link a {
          position: relative;
          transition: color 0.3s ease;
        }

        .signin-link a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .signin-link a:hover::after {
          width: 100%;
        }
      `}</style>

      <div className="form-container max-w-md mx-auto py-12">
        <div className="header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <div className="w-12 h-1 bg-blue-500 rounded"></div>
        </div>
        <p className="text-sm text-gray-600 mb-8 subtitle">
          Please fill in your details to register.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-item">
            <AuthInput label="Full Name" placeholder="John Doe" />
          </div>
          <div className="form-item">
            <AuthInput label="Email Address" type="email" placeholder="john@example.com" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-item">
            <AuthInput label="Phone Number" placeholder="+234 800 000 0000" />
            <AuthSelect label="Gender" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 form-item">
            <AuthInput label="Password" type="password" placeholder="••••••••" />
            <AuthInput label="Confirm Password" type="password" placeholder="••••••••" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn w-full py-2.5 rounded-lg text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 signin-link">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/patient-login")}
            className="text-blue-500 font-semibold hover:text-blue-600 bg-none border-none cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

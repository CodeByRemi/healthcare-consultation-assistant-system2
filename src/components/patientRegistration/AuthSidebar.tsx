
import patientimg from "../../assets/patientreg.png";
export default function AuthSidebar() {
  return (
    <div className="md:w-1/2 bg-linear-to-br from-blue-100 to-white dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4));
          }
        }

        @keyframes rotateBlob {
          0% {
            transform: translate(100px, 100px) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(100px, 100px) rotate(180deg) scale(1.1);
          }
          100% {
            transform: translate(100px, 100px) rotate(360deg) scale(1);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
          }
        }

        .medicare-text {
          animation: slideInRight 0.8s ease-out 0.2s both, textGlow 3s ease-in-out infinite 0.6s;
          letter-spacing: 2px;
          font-weight: 700;
          font-size: 1.75rem;
          background: linear-gradient(135deg, #ffffff, #e8f4ff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3));
        }

        .sidebar-container {
          animation: slideInLeft 0.8s ease-out;
        }

        .logo-image {
          animation: floatLogo 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite;
        }

        .welcome-heading {
          animation: fadeInDown 0.8s ease-out 0.2s both, textGlow 3s ease-in-out infinite 0.8s;
        }

        .welcome-subtitle {
          animation: slideInRight 0.8s ease-out 0.4s both;
        }

        .blob-shape {
          animation: rotateBlob 20s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#0056b3"
            className="blob-shape"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.9,32.3C59.6,43.1,48.3,51.8,36.4,58.6C24.5,65.4,12,70.3,-1.2,72.4C-14.4,74.5,-29.9,73.8,-42.9,67.6C-55.9,61.4,-66.4,49.7,-73.4,36.5C-80.4,23.3,-83.9,8.6,-82.4,-5.5C-80.9,-19.6,-74.4,-33.1,-64.3,-43.3C-54.2,-53.5,-40.5,-60.4,-27.1,-68.2C-13.7,-76,-0.6,-84.7,13.2,-82.8C27,-80.9,40,-95,44.7,-76.4Z"
          />
        </svg>
      </div>

      <div className="sidebar-container text-center ">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src={patientimg}
            alt="Medicare Logo"
            className="logo-image h-14 w-14"
          />
          <span className="medicare-text">Medicare</span>
        </div>

        {/* <h2 className="welcome-heading text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Welcome to Medicare
        </h2> */}
        {/* <p className="welcome-subtitle text-gray-600 dark:text-gray-300">
          Your health, our priority. Join our secure healthcare system.
        </p> */}
      </div>
    </div>
  );
}

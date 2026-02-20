export default function GlobalStyles() {
  return (
    <style>{`
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }
      .animate-float { animation: float 8s ease-in-out infinite; }
      .animate-pulse-glow { animation: pulse-glow 10s ease-in-out infinite; }
      .glass-effect {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .organic-shape {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      }
      .gradient-bg {
        background:
          radial-gradient(circle at 20% 20%, rgba(10, 110, 209, 0.08), transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(46, 204, 113, 0.08), transparent 40%),
          #F9FAFB;
      }
    `}</style>
  );
}
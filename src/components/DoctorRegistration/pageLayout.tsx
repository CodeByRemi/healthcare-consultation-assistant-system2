export default function PageLayout({ children }) {
  return (
    <div className="bg-background-dark min-h-screen text-white font-display">
      <div className="px-4 md:px-10 lg:px-40 py-5">
        {children}
      </div>
    </div>
  );
}

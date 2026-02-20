import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-4xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {children}
      </div>
    </div>
  );
}

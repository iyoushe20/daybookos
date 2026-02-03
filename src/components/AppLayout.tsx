import { ReactNode } from 'react';
import { MainNav } from './MainNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}

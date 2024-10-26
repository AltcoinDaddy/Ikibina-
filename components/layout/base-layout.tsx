// components/layout/base-layout.tsx
import { Navigation } from '@/components/layout/navigation';
import { ThemeProvider } from '@/components/providers/theme-provider'; // Updated import
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from '@/contexts/web3-context';
import { cn } from '@/lib/utils';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Web3Provider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className={cn("container mx-auto px-4 py-6", className)}>
            {children}
          </main>
          <Toaster />
        </div>
      </Web3Provider>
    </ThemeProvider>
  );
}
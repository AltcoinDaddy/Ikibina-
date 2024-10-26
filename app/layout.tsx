// app/layout.tsx
import { BaseLayout } from '@/components/layout/base-layout';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: 'Ikibina Digital - Traditional Savings on Blockchain',
  description: 'Modern tontine savings groups powered by blockchain technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
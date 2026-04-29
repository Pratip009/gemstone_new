import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'GemStone Shop',
  description: 'Premium diamonds and gemstones',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

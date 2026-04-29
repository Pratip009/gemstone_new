import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from '@/components/ui/Navbar';
import './global.css';

export const metadata: Metadata = {
  title: 'Alpha Imports — Fine Diamonds & Gemstones',
  description: 'Curated collection of premium diamonds and gemstones',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <footer className="mt-24 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex flex-col items-center gap-4">
                <p className="font-serif text-2xl" style={{ color: 'var(--text)' }}>
                  💎 Alpha Imports
                </p>
                <div className="gold-divider w-16" />
                <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)', letterSpacing: '0.2em' }}>
                  Fine Diamonds & Gemstones
                </p>
                <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
                  © {new Date().getFullYear()} GemStone. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
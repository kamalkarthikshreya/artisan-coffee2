import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artisan Coffee',
  description: 'Premium coffee for coffee lovers',
};

import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-[#1A0F0A] text-[#F5E6D3]`}>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

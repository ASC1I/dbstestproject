import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BUYME',
  description: 'A modern auction platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <Toaster position='bottom-right' toastOptions={{ duration: 3000 }} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
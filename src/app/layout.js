import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BUYME',
  description: 'A modern auction platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
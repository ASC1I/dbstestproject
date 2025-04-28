'use client';

import { usePathname } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';
import CustomerRepNavigation from '@/components/CustomerRepNavigation';
import Navigation from '@/components/Navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return (
      <>
        <AdminNavigation />
        {children}
      </>
    );
  }

  if (pathname.startsWith('/customer-rep')) {
    return (
      <>
        <CustomerRepNavigation />
        {children}
      </>
    );
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
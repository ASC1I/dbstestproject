'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the admin is logged in
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      router.push('/admin'); // Redirect to login page if not logged in
      return;
    }

    const fetchReport = async () => {
      try {
        const { data, error } = await supabase.rpc('get_sales_report');

        if (error) {
          console.error('Error fetching sales report:', error.message);
          setError('Failed to fetch sales report.');
          return;
        }

        setReport(data[0]); // The function returns a single row
      } catch (err) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here is the sales report:</p>

      <h2 className="text-2xl font-bold mt-6">Total Earnings</h2>
      <p>${report.total_earnings}</p>

      <h2 className="text-2xl font-bold mt-6">Earnings by Vehicle Type</h2>
      <ul>
        {report.earnings_by_vehicle_type.map((type, index) => (
          <li key={index}>
            {type.vehicle_type}: ${type.earnings}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-6">Earnings by Make</h2>
      <ul>
        {report.earnings_by_make.map((make, index) => (
          <li key={index}>
            {make.make}: ${make.earnings}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-6">Best Buyer</h2>
      <p>
        {report.best_buyer.buyer_email} (Total Spent: $
        {report.best_buyer.total_spent})
      </p>

      <h2 className="text-2xl font-bold mt-6">Best-Selling Item</h2>
      <p>
        {report.best_selling_item.vehicle_name} (Sale Price: $
        {report.best_selling_item.sale_price})
      </p>
    </div>
  );
}
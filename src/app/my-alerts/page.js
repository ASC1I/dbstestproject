'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('Alert')
        .select('*')
        .eq('userId', user.id) // Fetch alerts for the logged-in user
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
      } else {
        setAlerts(data || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Alerts</h1>
      {alerts.length > 0 ? (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="p-4 border rounded-md shadow-sm">
              {alert.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No alerts yet.</p>
      )}
    </div>
  );
}
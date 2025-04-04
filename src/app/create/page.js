'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [bidIncrement, setBidIncrement] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');


  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const checkAuth = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    fetchMake();
    fetchModel();
    fetchVehicleType();
    checkAuth();
  }, [checkAuth]);

  async function fetchVehicleType() {
    try {
      const { data, error } = await supabase
        .from('VehicleType')
        .select('*')
        .order('name');

      if (error) throw error;
      setVehicleTypes(data || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    }
  }

  async function fetchMake() {
    try {
      const { data, error } = await supabase
        .from('Make')
        .select('*')
        .order('name');

      if (error) throw error;
      setMakes(data || []);
    } catch (error) {
      console.error('Error fetching makes:', error);
    }
  }

  async function fetchModel() {
    try {
      const { data, error } = await supabase
        .from('Model')
        .select('*')
        .order('name');

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create an auction');

      const { error } = await supabase.from('Vehicle').insert([
        {
          name,
          description,
          start_price: parseFloat(startPrice), 
          bid_increment: parseFloat(bidIncrement),
          end_date: endDate,
          sellerId: user.id,
          vehicleTypeId: vehicleType,
          makeId: make,
          modelId: model,
          color,
          location,
        },
      ]);

      if (error) throw error;
      router.push('/my-items');
    } catch (error) {
      console.error('Error creating auction:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'startPrice') {
      setStartPrice(value);
    } else if (name === 'bidIncrement') {
      setBidIncrement(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    } else if (name === 'vehicleTypeId') {
      setVehicleType(value);
    } else if (name === 'makeId') {
      setMake(value);
    } else if (name === 'modelId') {
      setModel(value);
    } else if (name === 'color') {
      setColor(value);
    } else if (name === 'location') {
      setLocation(value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Create New Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            name="vehicleTypeId"
            required
            value={vehicleType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a vehicle type</option>
            {vehicleTypes.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Make
          </label>
          <select
            name="makeId"
            required
            value={make}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a make</option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model
          </label>
          <select
            name="modelId"
            required
            value={model}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            name="color"
            required
            value={color}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            value={location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Starting Price ($)
          </label>
          <input
            type="number"
            name="startPrice"
            required
            min="0"
            step="0.01"
            value={startPrice}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bid Increment ($)
          </label>
          <input
            type="number"
            name="bidIncrement"
            required
            min="1"
            step="0.01"
            value={bidIncrement}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endDate"
            required
            value={endDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Creating...' : 'Create Auction'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function SearchFilter({ onFilterChange }) {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  async function fetchVehicleTypes() {
    try {
      const { data, error } = await supabase
        .from('VehicleType')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching vehicle types:', error.message);
      } else {
        setVehicleTypes(data || []);
      }
    } catch (error) {
      console.error('Error fetching vehicle types:', error.message);
    }
  }

  async function fetchMakes(vehicleTypeId) {
    try {
      // Query the `_VehicleTypeMakes` table to get the related makes
      const { data: vehicleTypeMakes, error: innerError } = await supabase
        .from('_VehicleTypeMakes')
        .select('A') // 'A' refers to the `Make` IDs
        .eq('B', vehicleTypeId); // 'B' refers to the `VehicleType` ID

      if (innerError) throw innerError;

      // Use the retrieved Make IDs to fetch the actual Make details
      const makeIds = vehicleTypeMakes.map((item) => item.A);
      const { data: makes, error: outerError } = await supabase
        .from('Make')
        .select('id, name')
        .in('id', makeIds)
        .order('name');

      if (outerError) throw outerError;

      setMakes(makes || []);
      setModels([]); // Reset models when vehicle type changes
    } catch (error) {
      console.error('Error fetching makes:', error.message || error);
    }
  }

  async function fetchModels(makeId, vehicleTypeId) {
    try {
      const { data, error } = await supabase
        .from('Model')
        .select('*')
        .eq('makeId', makeId) // Filter by selected Make
        .eq('vehicleTypeId', vehicleTypeId) // Filter by selected Vehicle Type
        .order('name');

      if (error) {
        console.error('Error fetching models:', error.message);
      } else {
        setModels(data || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error.message);
    }
  }

  function handleVehicleTypeChange(e) {
    const vehicleTypeId = e.target.value;
    setSelectedVehicleType(vehicleTypeId);
    setSelectedMake('');
    setSelectedModel('');
    setMakes([]);
    setModels([]);
    if (vehicleTypeId) {
      fetchMakes(vehicleTypeId);
    }
    onFilterChange({ vehicleTypeId, makeId: '', modelId: '' });
  }

  function handleMakeChange(e) {
    const makeId = e.target.value;
    setSelectedMake(makeId);
    setSelectedModel('');
    setModels([]);
    if (makeId) {
      fetchModels(makeId, selectedVehicleType);
    }
    onFilterChange({ vehicleTypeId: selectedVehicleType, makeId, modelId: '' });
  }

  function handleModelChange(e) {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    onFilterChange({ vehicleTypeId: selectedVehicleType, makeId: selectedMake, modelId });
  }

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <select
        value={selectedVehicleType}
        onChange={handleVehicleTypeChange}
        className="p-2 border rounded"
      >
        <option value="">Select Vehicle Type</option>
        {vehicleTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      <select
        value={selectedMake}
        onChange={handleMakeChange}
        className="p-2 border rounded"
        disabled={!makes.length}
      >
        <option value="">Select Make</option>
        {makes.map((make) => (
          <option key={make.id} value={make.id}>
            {make.name}
          </option>
        ))}
      </select>

      <select
        value={selectedModel}
        onChange={handleModelChange}
        className="p-2 border rounded"
        disabled={!models.length}
      >
        <option value="">Select Model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
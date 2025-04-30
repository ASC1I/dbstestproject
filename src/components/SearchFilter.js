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
    fetchMakes(); // Fetch all makes initially
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

  async function fetchMakes() {
    try {
      const { data, error } = await supabase
        .from('Make')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching makes:', error.message);
      } else {
        setMakes(data || []);
      }
    } catch (error) {
      console.error('Error fetching makes:', error.message);
    }
  }

  async function fetchModels(makeId) {
    try {
      const { data, error } = await supabase
        .from('Model')
        .select('*')
        .eq('makeId', makeId) // Filter by selected Make
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
    onFilterChange({ vehicleTypeId, makeId: selectedMake, modelId: selectedModel });
  }

  function handleMakeChange(e) {
    const makeId = e.target.value;
    setSelectedMake(makeId);
    setSelectedModel('');
    setModels([]); // Reset models when make changes
    if (makeId) {
      fetchModels(makeId);
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  Ruler,
  Weight,
  FileText,
  Plus,
  X
} from 'lucide-react';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    intermediateStops: [],
    departureDate: '',
    maxDimensions: {
      length: '',
      width: '',
      height: ''
    },
    maxWeight: '',
    cargoTypes: [],
    availableSpace: '',
    pricePerKg: '',
    description: ''
  });
  const [newStop, setNewStop] = useState('');

  const cargoTypeOptions = [
    'fragile', 'heavy', 'liquid', 'food', 'electronics', 'furniture', 'documents', 'other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCargoTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      cargoTypes: prev.cargoTypes.includes(type)
        ? prev.cargoTypes.filter(t => t !== type)
        : [...prev.cargoTypes, type]
    }));
  };

  const addIntermediateStop = () => {
    if (newStop.trim()) {
      setFormData(prev => ({
        ...prev,
        intermediateStops: [...prev.intermediateStops, newStop.trim()]
      }));
      setNewStop('');
    }
  };

  const removeIntermediateStop = (index) => {
    setFormData(prev => ({
      ...prev,
      intermediateStops: prev.intermediateStops.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/announcements', {
        ...formData,
        maxWeight: parseFloat(formData.maxWeight),
        availableSpace: parseFloat(formData.availableSpace),
        pricePerKg: parseFloat(formData.pricePerKg),
        maxDimensions: {
          length: parseFloat(formData.maxDimensions.length) || undefined,
          width: parseFloat(formData.maxDimensions.width) || undefined,
          height: parseFloat(formData.maxDimensions.height) || undefined
        }
      });

      toast.success('Announcement created successfully!');
      navigate('/my-announcements');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Transport Announcement</h1>
          <p className="text-gray-600 mt-2">Share your transport details to connect with cargo senders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Route Information */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Route Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Start Location *</label>
                <input
                  type="text"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter departure city/location"
                />
              </div>

              <div>
                <label className="form-label">End Location *</label>
                <input
                  type="text"
                  name="endLocation"
                  value={formData.endLocation}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter destination city/location"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="form-label">Intermediate Stops (Optional)</label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add intermediate stop"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIntermediateStop())}
                />
                <button
                  type="button"
                  onClick={addIntermediateStop}
                  className="btn-outline flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              {formData.intermediateStops.length > 0 && (
                <div className="space-y-2">
                  {formData.intermediateStops.map((stop, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span>{stop}</span>
                      <button
                        type="button"
                        onClick={() => removeIntermediateStop(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="form-label">Departure Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          {/* Cargo Specifications */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2 text-secondary-600" />
              Cargo Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Maximum Weight (kg) *</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="maxWeight"
                    value={formData.maxWeight}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="input-field pl-10"
                    placeholder="Maximum cargo weight"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Available Space (m³) *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="availableSpace"
                    value={formData.availableSpace}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="input-field pl-10"
                    placeholder="Available cargo space"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="form-label">Maximum Dimensions (cm) - Optional</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="number"
                    name="maxDimensions.length"
                    value={formData.maxDimensions.length}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="Length"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="maxDimensions.width"
                    value={formData.maxDimensions.width}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="maxDimensions.height"
                    value={formData.maxDimensions.height}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="form-label">Accepted Cargo Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {cargoTypeOptions.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cargoTypes.includes(type)}
                      onChange={() => handleCargoTypeChange(type)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-accent-600" />
              Pricing
            </h3>

            <div className="max-w-md">
              <label className="form-label">Price per Kilogram ($) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field pl-10"
                  placeholder="Price per kg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Set your rate per kilogram of cargo transported
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Additional Information
            </h3>

            <div>
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Add any additional details about your transport service, special requirements, or terms..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-announcements')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
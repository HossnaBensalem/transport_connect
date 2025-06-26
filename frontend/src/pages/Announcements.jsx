import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Star, 
  Filter,
  Search,
  Truck,
  Weight,
  Ruler
} from 'lucide-react';
import { format } from 'date-fns';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startLocation: '',
    endLocation: '',
    cargoTypes: '',
    minDate: '',
    maxDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  const fetchAnnouncements = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/announcements?${params}`);
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      startLocation: '',
      endLocation: '',
      cargoTypes: '',
      minDate: '',
      maxDate: ''
    });
  };

  // Helper function to safely display rating
  const displayRating = (rating) => {
    if (rating === null || rating === undefined || !Number.isFinite(rating)) {
      return 'New';
    }
    return Number(rating).toFixed(1);
  };

  const cargoTypeOptions = [
    'fragile', 'heavy', 'liquid', 'food', 'electronics', 'furniture', 'documents', 'other'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Transport Announcements
          </h1>
          <p className="text-gray-600">
            Find the perfect transport solution for your cargo needs
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">From Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="startLocation"
                    value={filters.startLocation}
                    onChange={handleFilterChange}
                    className="input-field pl-10"
                    placeholder="Enter start location"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">To Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="endLocation"
                    value={filters.endLocation}
                    onChange={handleFilterChange}
                    className="input-field pl-10"
                    placeholder="Enter destination"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Cargo Type</label>
                <select
                  name="cargoTypes"
                  value={filters.cargoTypes}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {cargoTypeOptions.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  name="minDate"
                  value={filters.minDate}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  name="maxDate"
                  value={filters.maxDate}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Announcements Grid */}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new transport options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="card hover:shadow-lg transition-shadow">
                {/* Driver Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {announcement.driver?.firstName?.charAt(0) || 'D'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {announcement.driver?.firstName || 'Driver'} {announcement.driver?.lastName || ''}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {displayRating(announcement.driver?.rating)}
                      </span>
                      {announcement.driver?.isVerified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span className="font-medium">{announcement.startLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-secondary-600" />
                    <span className="font-medium">{announcement.endLocation}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">
                      {format(new Date(announcement.departureDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Max Weight:</span>
                    <span className="font-medium">{announcement.maxWeight} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-primary-600">
                      ${announcement.pricePerKg}/kg
                    </span>
                  </div>
                </div>

                {/* Cargo Types */}
                {announcement.cargoTypes?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Accepted Cargo:</p>
                    <div className="flex flex-wrap gap-1">
                      {announcement.cargoTypes.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {announcement.cargoTypes.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{announcement.cargoTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/announcements/${announcement._id}`}
                  className="btn-primary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
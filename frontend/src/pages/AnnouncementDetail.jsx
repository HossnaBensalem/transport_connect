import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Star, 
  Weight,
  Ruler,
  DollarSign,
  User,
  MessageCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    cargoDetails: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      type: '',
      description: '',
      value: ''
    },
    pickupLocation: '',
    deliveryLocation: '',
    notes: ''
  });

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(`/api/announcements/${id}`);
      setAnnouncement(response.data.announcement);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Failed to load announcement');
      navigate('/announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setRequestData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setRequestData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/requests', {
        ...requestData,
        announcement: id
      });
      
      toast.success('Transport request sent successfully!');
      setShowRequestForm(false);
      setRequestData({
        cargoDetails: {
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          type: '',
          description: '',
          value: ''
        },
        pickupLocation: '',
        deliveryLocation: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  // Helper function to safely display rating
  const displayRating = (rating) => {
    if (rating === null || rating === undefined || !Number.isFinite(rating)) {
      return 'New Driver';
    }
    return Number(rating).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcement not found</h2>
          <button onClick={() => navigate('/announcements')} className="btn-primary">
            Back to Announcements
          </button>
        </div>
      </div>
    );
  }

  const estimatedPrice = requestData.cargoDetails.weight ? 
    (parseFloat(requestData.cargoDetails.weight) * announcement.pricePerKg).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/announcements')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Announcements</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Driver Info */}
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {announcement.driver?.firstName?.charAt(0) || 'D'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {announcement.driver?.firstName || 'Driver'} {announcement.driver?.lastName || ''}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-600">
                        {displayRating(announcement.driver?.rating)}
                      </span>
                    </div>
                    {announcement.driver?.isVerified && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <p className="text-gray-600 mb-2">Contact Information:</p>
                <p className="text-gray-900">{announcement.driver?.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Route Details */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Route Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">From</p>
                    <p className="text-gray-600">{announcement.startLocation}</p>
                  </div>
                </div>

                {announcement.intermediateStops?.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-accent-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Intermediate Stops</p>
                      {announcement.intermediateStops.map((stop, index) => (
                        <p key={index} className="text-gray-600">{stop}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-secondary-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">To</p>
                    <p className="text-gray-600">{announcement.endLocation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Departure Date</p>
                    <p className="text-gray-600">
                      {format(new Date(announcement.departureDate), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Specifications */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cargo Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Weight className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Max Weight</p>
                      <p className="text-gray-600">{announcement.maxWeight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Available Space</p>
                      <p className="text-gray-600">{announcement.availableSpace} m³</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {announcement.maxDimensions && (
                    <div className="flex items-center space-x-3">
                      <Ruler className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Max Dimensions</p>
                        <p className="text-gray-600">
                          {announcement.maxDimensions.length} × {announcement.maxDimensions.width} × {announcement.maxDimensions.height} cm
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Price per kg</p>
                      <p className="text-primary-600 font-semibold">${announcement.pricePerKg}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accepted Cargo Types */}
              {announcement.cargoTypes?.length > 0 && (
                <div className="mt-6">
                  <p className="font-medium text-gray-900 mb-3">Accepted Cargo Types</p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.cargoTypes.map((type) => (
                      <span
                        key={type}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {announcement.description && (
                <div className="mt-6">
                  <p className="font-medium text-gray-900 mb-2">Additional Information</p>
                  <p className="text-gray-600">{announcement.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            {user && user.role === 'sender' && user.id !== announcement.driver?._id && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Transport Request</h3>
                
                {!showRequestForm ? (
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="btn-primary w-full"
                  >
                    Request Transport
                  </button>
                ) : (
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    {/* Cargo Details */}
                    <div>
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        name="cargoDetails.weight"
                        value={requestData.cargoDetails.weight}
                        onChange={handleRequestChange}
                        required
                        className="input-field"
                        placeholder="Enter weight"
                      />
                    </div>

                    <div>
                      <label className="form-label">Cargo Type</label>
                      <select
                        name="cargoDetails.type"
                        value={requestData.cargoDetails.type}
                        onChange={handleRequestChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select type</option>
                        {announcement.cargoTypes?.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="form-label">Length (cm)</label>
                        <input
                          type="number"
                          name="cargoDetails.dimensions.length"
                          value={requestData.cargoDetails.dimensions.length}
                          onChange={handleRequestChange}
                          className="input-field"
                          placeholder="L"
                        />
                      </div>
                      <div>
                        <label className="form-label">Width (cm)</label>
                        <input
                          type="number"
                          name="cargoDetails.dimensions.width"
                          value={requestData.cargoDetails.dimensions.width}
                          onChange={handleRequestChange}
                          className="input-field"
                          placeholder="W"
                        />
                      </div>
                      <div>
                        <label className="form-label">Height (cm)</label>
                        <input
                          type="number"
                          name="cargoDetails.dimensions.height"
                          value={requestData.cargoDetails.dimensions.height}
                          onChange={handleRequestChange}
                          className="input-field"
                          placeholder="H"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Pickup Location</label>
                      <input
                        type="text"
                        name="pickupLocation"
                        value={requestData.pickupLocation}
                        onChange={handleRequestChange}
                        required
                        className="input-field"
                        placeholder="Enter pickup address"
                      />
                    </div>

                    <div>
                      <label className="form-label">Delivery Location</label>
                      <input
                        type="text"
                        name="deliveryLocation"
                        value={requestData.deliveryLocation}
                        onChange={handleRequestChange}
                        required
                        className="input-field"
                        placeholder="Enter delivery address"
                      />
                    </div>

                    <div>
                      <label className="form-label">Description</label>
                      <textarea
                        name="cargoDetails.description"
                        value={requestData.cargoDetails.description}
                        onChange={handleRequestChange}
                        className="input-field"
                        rows="3"
                        placeholder="Describe your cargo..."
                      />
                    </div>

                    <div>
                      <label className="form-label">Cargo Value ($)</label>
                      <input
                        type="number"
                        name="cargoDetails.value"
                        value={requestData.cargoDetails.value}
                        onChange={handleRequestChange}
                        className="input-field"
                        placeholder="Estimated value"
                      />
                    </div>

                    <div>
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={requestData.notes}
                        onChange={handleRequestChange}
                        className="input-field"
                        rows="2"
                        placeholder="Any special instructions..."
                      />
                    </div>

                    {/* Estimated Price */}
                    {estimatedPrice > 0 && (
                      <div className="bg-primary-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Estimated Price:</p>
                        <p className="text-xl font-bold text-primary-600">${estimatedPrice}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button type="submit" className="btn-primary flex-1">
                        Send Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="btn-outline flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Contact Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about this transport? Contact our support team.
              </p>
              <button className="btn-outline w-full flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
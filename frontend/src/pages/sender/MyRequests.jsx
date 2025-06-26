import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Package, 
  MapPin, 
  User, 
  Star, 
  Clock,
  DollarSign,
  MessageCircle,
  Eye,
  StarIcon
} from 'lucide-react';
import { format } from 'date-fns';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await axios.get('/api/requests/my');
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await axios.put(`/api/requests/${requestId}/status`, { status });
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status } : req
      ));
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  const handleRateDriver = async () => {
    try {
      await axios.post(`/api/requests/${selectedRequest._id}/rate`, {
        rating,
        comment
      });
      
      setRequests(requests.map(req => 
        req._id === selectedRequest._id 
          ? { ...req, driverRating: { rating, comment } }
          : req
      ));
      
      toast.success('Rating submitted successfully');
      setShowRatingModal(false);
      setSelectedRequest(null);
      setRating(5);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  // Helper function to safely display rating
  const displayRating = (rating) => {
    if (rating === null || rating === undefined || !Number.isFinite(rating)) {
      return 'New';
    }
    return Number(rating).toFixed(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">My Transport Requests</h1>
          <p className="text-gray-600 mt-2">Track and manage your cargo transport requests</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'in_transit', 'delivered', 'rejected', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Requests' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                {status !== 'all' && (
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {requests.filter(r => r.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Requests */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No requests yet' : `No ${filter} requests`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start by browsing transport announcements and sending requests.'
                : `You don't have any ${filter} requests at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/browse-announcements" className="btn-primary">
                Browse Announcements
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {request.driver?.firstName?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.driver?.firstName || 'Driver'} {request.driver?.lastName || ''}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {displayRating(request.driver?.rating)}
                          </span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Route Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Route Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary-600" />
                        <span className="text-gray-600">From:</span>
                        <span className="font-medium">{request.announcement?.startLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-secondary-600" />
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">{request.announcement?.endLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-accent-600" />
                        <span className="text-gray-600">Pickup:</span>
                        <span className="font-medium">{request.pickupLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-accent-600" />
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">{request.deliveryLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cargo Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{request.cargoDetails?.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{request.cargoDetails?.weight} kg</span>
                      </div>
                      {request.cargoDetails?.dimensions?.length && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium">
                            {request.cargoDetails.dimensions.length} × {request.cargoDetails.dimensions.width} × {request.cargoDetails.dimensions.height} cm
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-primary-600">${request.estimatedPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/chat?driver=${request.driver?._id}&announcement=${request.announcement?._id}`}
                      className="btn-outline flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message Driver</span>
                    </Link>
                    <button className="btn-outline flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                        className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancel Request
                      </button>
                    )}

                    {request.status === 'delivered' && !request.driverRating && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRatingModal(true);
                        }}
                        className="btn-primary flex items-center space-x-1"
                      >
                        <Star className="h-4 w-4" />
                        <span>Rate Driver</span>
                      </button>
                    )}

                    {request.driverRating && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>Rated: {request.driverRating.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rate {selectedRequest?.driver?.firstName} {selectedRequest?.driver?.lastName}
              </h3>
              
              <div className="mb-4">
                <label className="form-label">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <StarIcon className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Share your experience with this driver..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setSelectedRequest(null);
                    setRating(5);
                    setComment('');
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRateDriver}
                  className="btn-primary flex-1"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
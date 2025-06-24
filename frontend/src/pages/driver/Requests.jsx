import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Package, 
  MapPin, 
  User, 
  Star, 
  Check, 
  X, 
  Clock,
  DollarSign,
  MessageCircle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests');
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
          <h1 className="text-3xl font-bold text-gray-900">Transport Requests</h1>
          <p className="text-gray-600 mt-2">Manage incoming transport requests from senders</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'in_transit', 'delivered', 'rejected'].map((status) => (
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
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Transport requests will appear here when senders contact you.'
                : `You don't have any ${filter} requests at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {request.sender.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.sender.firstName} {request.sender.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {Number.isFinite(request.sender.rating) ? request.sender.rating.toFixed(1) : 'New'}
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
                        <span className="font-medium">{request.announcement.startLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-secondary-600" />
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium">{request.announcement.endLocation}</span>
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
                        <span className="font-medium capitalize">{request.cargoDetails.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{request.cargoDetails.weight} kg</span>
                      </div>
                      {request.cargoDetails.dimensions.length && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium">
                            {request.cargoDetails.dimensions.length} × {request.cargoDetails.dimensions.width} × {request.cargoDetails.dimensions.height} cm
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estimated Price:</span>
                        <span className="font-medium text-primary-600">${request.estimatedPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {request.cargoDetails.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm">{request.cargoDetails.description}</p>
                  </div>
                )}

                {/* Notes */}
                {request.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-gray-600 text-sm">{request.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/chat?sender=${request.sender._id}&announcement=${request.announcement._id}`}
                      className="btn-outline flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </Link>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                        className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'accepted')}
                        className="btn-primary flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'in_transit')}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Start Transport</span>
                    </button>
                  )}

                  {request.status === 'in_transit' && (
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'delivered')}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Mark Delivered</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
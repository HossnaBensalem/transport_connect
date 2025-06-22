import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Package, 
  Edit3, 
  Trash2,
  Eye,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

const MyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAnnouncements();
  }, []);

  const fetchMyAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements/my');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Announcements</h1>
            <p className="text-gray-600 mt-2">Manage your transport announcements</p>
          </div>
          <Link to="/create-announcement" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New</span>
          </Link>
        </div>

        {/* Announcements */}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first transport announcement to start connecting with senders.
            </p>
            <Link to="/create-announcement" className="btn-primary">
              Create Announcement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="card hover:shadow-lg transition-shadow">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(announcement.status)}`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                    <span className="text-gray-600">Available Space:</span>
                    <span className="font-medium">{announcement.availableSpace} m³</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price per kg:</span>
                    <span className="font-medium text-primary-600">${announcement.pricePerKg}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Requests:</span>
                    <span className="font-medium">{announcement.requestCount || 0}</span>
                  </div>
                </div>

                {/* Cargo Types */}
                {announcement.cargoTypes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Cargo Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {announcement.cargoTypes.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {announcement.cargoTypes.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{announcement.cargoTypes.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/announcements/${announcement._id}`}
                    className="btn-outline flex-1 text-center flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  <Link
                    to={`/requests?announcement=${announcement._id}`}
                    className="btn-primary flex-1 text-center"
                  >
                    Requests ({announcement.requestCount || 0})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnnouncements;
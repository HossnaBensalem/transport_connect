import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  Trash2,
  User,
  Truck,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage]);

  const fetchAnnouncements = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      const response = await axios.get(`/api/admin/announcements?${params}`);
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await axios.delete(`/api/admin/announcements/${announcementId}`);
      setAnnouncements(announcements.filter(ann => ann._id !== announcementId));
      toast.success('Announcement deleted successfully');
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const confirmDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
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

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = !filters.search || 
      announcement.startLocation.toLowerCase().includes(filters.search.toLowerCase()) ||
      announcement.endLocation.toLowerCase().includes(filters.search.toLowerCase()) ||
      `${announcement.driver.firstName} ${announcement.driver.lastName}`.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || announcement.status === filters.status;
    
    return matchesSearch && matchesStatus;
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
          <h1 className="text-3xl font-bold text-gray-900">Announcements Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage transport announcements</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by route or driver..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Stats */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
              <Truck className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {filteredAnnouncements.length} announcements
              </span>
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {announcement.driver.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {announcement.driver.firstName} {announcement.driver.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{announcement.driver.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(announcement.status)}`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </span>
                </div>

                {/* Route */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{announcement.startLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-secondary-600" />
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{announcement.endLocation}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Departure</p>
                      <p className="font-medium">
                        {format(new Date(announcement.departureDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Max Weight</p>
                      <p className="font-medium">{announcement.maxWeight} kg</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Price/kg</p>
                      <p className="font-medium text-primary-600">${announcement.pricePerKg}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Space</p>
                      <p className="font-medium">{announcement.availableSpace} m³</p>
                    </div>
                  </div>
                </div>

                {/* Cargo Types */}
                {announcement.cargoTypes && announcement.cargoTypes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Cargo Types:</p>
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

                {/* Created Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Created {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  {announcement.requestCount && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {announcement.requestCount} requests
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => confirmDelete(announcement)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && !loading && (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-600">
              {filters.search || filters.status 
                ? 'Try adjusting your filters' 
                : 'No transport announcements have been created yet'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Announcement
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this announcement from{' '}
                <span className="font-medium">
                  {selectedAnnouncement.driver.firstName} {selectedAnnouncement.driver.lastName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-900">
                  {selectedAnnouncement.startLocation} → {selectedAnnouncement.endLocation}
                </p>
                <p className="text-sm text-gray-600">
                  Departure: {format(new Date(selectedAnnouncement.departureDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedAnnouncement(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(selectedAnnouncement._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
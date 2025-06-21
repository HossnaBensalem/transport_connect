import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Truck, 
  Package, 
  MessageCircle, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const renderDriverDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Truck className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Announcements</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.announcements || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <CheckCircle className="h-8 w-8 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedRequests || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg">
              <Clock className="h-8 w-8 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingRequests || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/create-announcement"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Create Announcement</h4>
            <p className="text-gray-600">Post a new transport announcement</p>
          </Link>

          <Link
            to="/requests"
            className="p-6 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">View Requests</h4>
            <p className="text-gray-600">Manage incoming transport requests</p>
          </Link>

          <Link
            to="/my-announcements"
            className="p-6 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <Truck className="h-12 w-12 mx-auto mb-4 text-secondary-600" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">My Announcements</h4>
            <p className="text-gray-600">View and manage your announcements</p>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderSenderDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalRequests || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <CheckCircle className="h-8 w-8 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedRequests || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg">
              <Clock className="h-8 w-8 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingRequests || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/announcements"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Browse Transports</h4>
            <p className="text-gray-600">Find available transport options</p>
          </Link>

          <Link
            to="/my-requests"
            className="p-6 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <Package className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">My Requests</h4>
            <p className="text-gray-600">Track your transport requests</p>
          </Link>

          <Link
            to="/chat"
            className="p-6 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-secondary-600" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Messages</h4>
            <p className="text-gray-600">Chat with drivers</p>
          </Link>
        </div>
      </div>
    </div>
  );

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome to your {user?.role} dashboard. Here's your overview.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-medium">
                  {user?.rating?.average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-500">
                  ({user?.rating?.count || 0} reviews)
                </span>
              </div>
              {user?.isVerified && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {user?.role === 'driver' ? renderDriverDashboard() : renderSenderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Truck, 
  Package, 
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
              </div>
            </div>
          </div>

          {/* Active Drivers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.users?.drivers || 0}</p>
              </div>
            </div>
          </div>

          {/* Active Senders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Senders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.users?.senders || 0}</p>
              </div>
            </div>
          </div>

          {/* Acceptance Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.requests?.acceptanceRate || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Announcements Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Announcements</span>
                <span className="font-bold text-gray-900">{stats?.announcements?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Announcements</span>
                <span className="font-bold text-green-600">{stats?.announcements?.active || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{
                    width: `${stats?.announcements?.total > 0 
                      ? (stats.announcements.active / stats.announcements.total) * 100 
                      : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Requests Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requests Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">Pending</span>
                </div>
                <span className="font-bold text-yellow-600">{stats?.requests?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">Completed</span>
                </div>
                <span className="font-bold text-green-600">{stats?.requests?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-bold text-gray-900">{stats?.requests?.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Recent Users
            </h3>
            <div className="space-y-3">
              {stats?.recentActivity?.users?.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )) || <p className="text-gray-500">No recent users</p>}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Announcements
            </h3>
            <div className="space-y-3">
              {stats?.recentActivity?.announcements?.map((announcement, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {announcement.driver?.firstName} {announcement.driver?.lastName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {announcement.startLocation} → {announcement.endLocation}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      ${announcement.pricePerKg}/kg
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      announcement.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                </div>
              )) || <p className="text-gray-500">No recent announcements</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
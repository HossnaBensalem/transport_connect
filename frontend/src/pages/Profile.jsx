import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Star, 
  Edit3, 
  Save, 
  X,
  Shield,
  Truck,
  Package
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data.user);
      setFormData({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        phone: response.data.user.phone
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put('/api/users/profile', formData);
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone
    });
    setIsEditing(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">
                  {profile?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {profile?.firstName} {profile?.lastName}
              </h2>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.role === 'driver' 
                    ? 'bg-primary-100 text-primary-800' 
                    : profile?.role === 'sender'
                    ? 'bg-secondary-100 text-secondary-800'
                    : 'bg-accent-100 text-accent-800'
                }`}>
                  {profile?.role === 'driver' && <Truck className="inline h-4 w-4 mr-1" />}
                  {profile?.role === 'sender' && <Package className="inline h-4 w-4 mr-1" />}
                  {profile?.role === 'admin' && <Shield className="inline h-4 w-4 mr-1" />}
                  {profile?.role?.charAt(0)?.toUpperCase() + profile?.role?.slice(1)}
                </span>
                
                {profile?.isVerified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center space-x-1 mb-6">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-semibold">
                  {profile?.rating?.average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-500">
                  ({profile?.rating?.count || 0} reviews)
                </span>
              </div>

              {profile?.role === 'driver' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Completed Transports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.completedTransports || 0}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSubmit}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="input-field pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Account Type</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile?.role?.charAt(0)?.toUpperCase() + profile?.role?.slice(1) || ''}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Account type cannot be changed after registration.
                  </p>
                </div>

                <div>
                  <label className="form-label">Member Since</label>
                  <input
                    type="text"
                    value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
              </form>
            </div>

            {/* Account Status */}
            <div className="card mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Account Verification</p>
                    <p className="text-sm text-gray-600">
                      {profile?.isVerified 
                        ? 'Your account is verified and trusted by the community'
                        : 'Complete verification to build trust with other users'
                      }
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile?.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.isVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Account Status</p>
                    <p className="text-sm text-gray-600">
                      Your account is active and in good standing
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
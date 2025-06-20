import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import Request from '../models/Request.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeDrivers = await User.countDocuments({ role: 'driver', isActive: true });
    const activeSenders = await User.countDocuments({ role: 'sender', isActive: true });
    const totalAnnouncements = await Announcement.countDocuments();
    const activeAnnouncements = await Announcement.countDocuments({ status: 'active' });
    const totalRequests = await Request.countDocuments();
    const completedRequests = await Request.countDocuments({ status: 'delivered' });
    const pendingRequests = await Request.countDocuments({ status: 'pending' });

    // Calculate acceptance rate
    const acceptedRequests = await Request.countDocuments({ status: { $in: ['accepted', 'in_transit', 'delivered'] } });
    const acceptanceRate = totalRequests > 0 ? (acceptedRequests / totalRequests * 100).toFixed(2) : 0;

    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName role createdAt');
    const recentAnnouncements = await Announcement.find()
      .populate('driver', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      users: {
        total: totalUsers,
        drivers: activeDrivers,
        senders: activeSenders
      },
      announcements: {
        total: totalAnnouncements,
        active: activeAnnouncements
      },
      requests: {
        total: totalRequests,
        completed: completedRequests,
        pending: pendingRequests,
        acceptanceRate: parseFloat(acceptanceRate)
      },
      recentActivity: {
        users: recentUsers,
        announcements: recentAnnouncements
      }
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const announcements = await Announcement.find()
      .populate('driver', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments();

    res.json({
      success: true,
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
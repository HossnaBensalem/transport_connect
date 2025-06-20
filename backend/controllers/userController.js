import User from '../models/User.js';
import Request from '../models/Request.js';
import Announcement from '../models/Announcement.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let stats = {};
    
    if (req.user.role === 'driver') {
      const announcements = await Announcement.countDocuments({ driver: userId });
      const completedRequests = await Request.countDocuments({ 
        driver: userId, 
        status: 'delivered' 
      });
      const pendingRequests = await Request.countDocuments({ 
        driver: userId, 
        status: 'pending' 
      });
      
      stats = { announcements, completedRequests, pendingRequests };
    } else if (req.user.role === 'sender') {
      const totalRequests = await Request.countDocuments({ sender: userId });
      const completedRequests = await Request.countDocuments({ 
        sender: userId, 
        status: 'delivered' 
      });
      const pendingRequests = await Request.countDocuments({ 
        sender: userId, 
        status: 'pending' 
      });
      
      stats = { totalRequests, completedRequests, pendingRequests };
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
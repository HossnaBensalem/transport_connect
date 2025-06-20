import express from 'express';
import { 
  getDashboardStats, 
  getUsers, 
  updateUserStatus,
  verifyUser,
  getAnnouncements as getAdminAnnouncements,
  deleteAnnouncement as adminDeleteAnnouncement
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);
router.put('/users/:id/verify', protect, authorize('admin'), verifyUser);
router.get('/announcements', protect, authorize('admin'), getAdminAnnouncements);
router.delete('/announcements/:id', protect, authorize('admin'), adminDeleteAnnouncement);

export default router;
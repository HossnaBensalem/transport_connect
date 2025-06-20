import express from 'express';
import { getProfile, updateProfile, getUserStats } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);

export default router;
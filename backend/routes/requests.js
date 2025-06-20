import express from 'express';
import { body } from 'express-validator';
import { 
  createRequest, 
  getRequests, 
  updateRequestStatus,
  getMyRequests,
  rateUser
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, [
  body('announcement').notEmpty().withMessage('Announcement ID is required'),
  body('cargoDetails.weight').isNumeric().withMessage('Weight is required'),
  body('cargoDetails.type').notEmpty().withMessage('Cargo type is required'),
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('deliveryLocation').notEmpty().withMessage('Delivery location is required')
], createRequest);

router.get('/', protect, getRequests);
router.get('/my', protect, getMyRequests);
router.put('/:id/status', protect, updateRequestStatus);
router.post('/:id/rate', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], rateUser);

export default router;
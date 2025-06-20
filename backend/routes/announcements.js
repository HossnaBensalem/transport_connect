import express from 'express';
import { body } from 'express-validator';
import { 
  createAnnouncement, 
  getAnnouncements, 
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getMyAnnouncements
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('driver'), [
  body('startLocation').notEmpty().withMessage('Start location is required'),
  body('endLocation').notEmpty().withMessage('End location is required'),
  body('departureDate').isISO8601().withMessage('Valid departure date is required'),
  body('maxWeight').isNumeric().withMessage('Max weight must be a number'),
  body('availableSpace').isNumeric().withMessage('Available space must be a number'),
  body('pricePerKg').isNumeric().withMessage('Price per kg must be a number')
], createAnnouncement);

router.get('/', getAnnouncements);
router.get('/my', protect, authorize('driver'), getMyAnnouncements);
router.get('/:id', getAnnouncement);
router.put('/:id', protect, authorize('driver'), updateAnnouncement);
router.delete('/:id', protect, authorize('driver'), deleteAnnouncement);

export default router;
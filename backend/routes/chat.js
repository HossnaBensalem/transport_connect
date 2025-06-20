import express from 'express';
import { getChatsByUser, getChatMessages, markMessagesAsRead } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChatsByUser);
router.get('/:chatId/messages', protect, getChatMessages);
router.put('/:chatId/read', protect, markMessagesAsRead);

export default router;
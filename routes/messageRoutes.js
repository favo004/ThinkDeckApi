import express from 'express';
import { verifyToken } from '../controllers/authController';
import { addMessage, deleteMessage, getMessages, updateMessage } from '../controllers/messageController';

const router = express.Router();

// Get messages
router.get('/messages', verifyToken, getMessages);
// Add message
router.post('/messages', verifyToken, addMessage);
// Update message
router.put('/messages', verifyToken, updateMessage);
// Delete message
router.delete('/messages', verifyToken, deleteMessage);

export default router;
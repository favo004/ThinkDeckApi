import express from 'express';
import { addMessage, deleteMessage, getMessages, updateMessage } from '../controllers/messageController';

const router = express.Router();

// Get messages
router.get('/messages', getMessages);
// Add message
router.post('/messages', addMessage);
// Update message
router.put('/messages', updateMessage);
// Delete message
router.delete('/messages', deleteMessage);

export default router;
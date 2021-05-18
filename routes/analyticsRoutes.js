import express from 'express';
import { addDislike, addHighlight, addLike, getDislikes, getHighlights, getLikes, removeDislike, removeHighlight, removeLike } from '../controllers/analyticsController';
import { verifyToken } from '../controllers/authController';

const router = express.Router();

// Get analytics
router.get('/likes', getLikes);
router.get('/dislikes', getDislikes);
router.get('/highlights', getHighlights);

// Add analytics
router.post('/likes', verifyToken, addLike);
router.post('/dislikes', verifyToken, addDislike);
router.post('/highlights', verifyToken, addHighlight);

// Delete analytics
router.delete('/likes', verifyToken, removeLike);
router.delete('/dislikes', verifyToken, removeDislike);
router.delete('/highlights', verifyToken, removeHighlight);

export default router;
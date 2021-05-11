import express from 'express';
import { addDislike, addHighlight, addLike, getDislikes, getHighlights, getLikes, removeDislike, removeHighlight, removeLike } from '../controllers/analyticsController';

const router = express.Router();

// Get analytics
router.get('/likes', getLikes);
router.get('/dislikes', getDislikes);
router.get('/highlights', getHighlights);

// Add analytics
router.post('/likes', addLike);
router.post('/dislikes', addDislike);
router.post('/highlights', addHighlight);

// Delete analytics
router.delete('/likes', removeLike);
router.delete('/dislies', removeDislike);
router.delete('/highlights', removeHighlight);

export default router;
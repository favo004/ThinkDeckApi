import express from 'express';
import { verifyToken } from '../controllers/authController';
import { addFollow, deleteFollow, getFollows } from '../controllers/followController';

const router = express.Router();

// Get follows
router.get('/follows', getFollows);

// Add follow
router.post('/follows', verifyToken, addFollow);

// Delete follow
router.delete('/follows', verifyToken, deleteFollow);

export default router;
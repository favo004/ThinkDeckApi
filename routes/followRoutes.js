import express from 'express';
import { addFollow, deleteFollow, getFollows } from '../controllers/followController';

const router = express.Router();

// Get follows
router.get('/follows', getFollows);

// Add follow
router.post('/follows', addFollow);

// Delete follow
router.post('/follows', deleteFollow);

export default router;
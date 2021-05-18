import express from 'express'
import { verifyToken } from '../controllers/authController';
import { addThought, deleteThought, getThoughtById, getThoughts, updateThought } from '../controllers/thoughtController';

const router = express.Router();

// Get thoughts
router.get('/thoughts', getThoughts);

// Get by id
router.get('/thoughts/:id', getThoughtById);

// Add thought
router.post('/thoughts', verifyToken, addThought)

// Update thought
router.put('/thoughts', verifyToken, updateThought)

// Delete thought
router.delete('/thoughts', verifyToken, deleteThought)

export default router;
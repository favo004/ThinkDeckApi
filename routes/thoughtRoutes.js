import express from 'express'
import { addThought, deleteThought, getThoughts, updateThought } from '../controllers/thoughtController';

const router = express.Router();

// Get thoughts
router.get('/thoughts', getThoughts);

// Add thought
router.post('/thoughts', addThought)

// Update thought
router.put('/thoughts', updateThought)

// Delete thought
router.delete('/thoughts', deleteThought)

export default router;
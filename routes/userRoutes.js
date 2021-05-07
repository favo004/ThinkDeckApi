import express from 'express'
import { createNewUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController';

const router = express.Router();

// Get all users
router.get('/users', getUsers);

// Get user by id
router.get('/users/:id', getUserById);

// Add new user
router.post('/users', createNewUser);

// Update user
router.put('/users', updateUser);

// Delete user
router.delete('/users', deleteUser);


export default router;
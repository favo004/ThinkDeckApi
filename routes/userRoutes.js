import express from 'express'
import { verifyToken } from '../controllers/authController';
import { createNewUser, deleteUser, getUserById, getUsers, login, updateUser } from '../controllers/userController';

const router = express.Router();

// Get all users
router.get('/users', getUsers);

// Get user by id
router.get('/users/:id', getUserById);

// Add new user
router.post('/users', createNewUser);

// Update user
router.put('/users', verifyToken, updateUser);

// Delete user
router.delete('/users', verifyToken, deleteUser);

// Login
router.post('/login', login);

export default router;
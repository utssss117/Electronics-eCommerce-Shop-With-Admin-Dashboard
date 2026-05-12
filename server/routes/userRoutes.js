const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserRole, deleteUser, getUserStats } = require('../controllers/userController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// All routes are admin-only
router.get('/stats', protect, admin, getUserStats);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;

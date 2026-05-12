const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
  getOrderStats
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Protected routes (logged in users)
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;

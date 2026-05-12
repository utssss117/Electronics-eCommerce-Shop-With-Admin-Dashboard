const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
  getBrands
} = require('../controllers/productController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// Public routes
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;

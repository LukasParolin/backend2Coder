const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo admin)
router.post('/', authenticateJWT, authorizeRole(['admin']), productController.createProduct);
router.put('/:id', authenticateJWT, authorizeRole(['admin']), productController.updateProduct);
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), productController.deleteProduct);

module.exports = router; 
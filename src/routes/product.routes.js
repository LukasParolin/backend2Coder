const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateJWT, authorizeAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo administradores)
router.post('/', authenticateJWT, authorizeAdmin, productController.createProduct);
router.put('/:id', authenticateJWT, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticateJWT, authorizeAdmin, productController.deleteProduct);

module.exports = router; 
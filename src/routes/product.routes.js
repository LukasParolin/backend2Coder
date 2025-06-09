const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authorizeAdmin } = require('../middlewares/auth.middleware');
const { validateProductData, validateMongoId } = require('../middlewares/validation.middleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', validateMongoId('id'), productController.getProductById);

// Rutas protegidas (solo administradores)
router.post('/', authorizeAdmin, validateProductData, productController.createProduct);
router.put('/:id', authorizeAdmin, validateMongoId('id'), productController.updateProduct);
router.delete('/:id', authorizeAdmin, validateMongoId('id'), productController.deleteProduct);

module.exports = router; 
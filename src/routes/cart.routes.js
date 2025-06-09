const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authorizeUser, authorizeAdmin } = require('../middlewares/auth.middleware');
const { validateQuantity, validateMongoId } = require('../middlewares/validation.middleware');

// Rutas del carrito (requieren autenticación)
router.get('/:cid', authorizeUser, validateMongoId('cid'), cartController.getCartById);
router.post('/:cid/products/:pid', authorizeUser, validateMongoId('cid'), validateMongoId('pid'), validateQuantity, cartController.addProductToCart);
router.delete('/:cid/products/:pid', authorizeUser, validateMongoId('cid'), validateMongoId('pid'), cartController.removeProductFromCart);
router.delete('/:cid', authorizeUser, validateMongoId('cid'), cartController.clearCart);

// Ruta para procesar compra (solo usuarios autenticados)
router.post('/:cid/purchase', authorizeUser, validateMongoId('cid'), cartController.purchaseCart);

// Rutas de tickets
router.get('/tickets/user', authorizeUser, cartController.getUserTickets);
router.get('/tickets/:code', authorizeUser, cartController.getTicketByCode);
router.get('/tickets', authorizeAdmin, cartController.getAllTickets);

module.exports = router; 
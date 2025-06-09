const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authorizeAdmin, authorizeOwnerOrAdmin } = require('../middlewares/auth.middleware');
const { validateUserData, validateMongoId } = require('../middlewares/validation.middleware');

// Rutas públicas
router.post('/', validateUserData, userController.createUser);

// Rutas protegidas solo para administradores
router.get('/', authorizeAdmin, userController.getAllUsers);
router.delete('/:id', authorizeAdmin, validateMongoId('id'), userController.deleteUser);

// Rutas protegidas para el propietario o administrador
router.get('/:id', authorizeOwnerOrAdmin, validateMongoId('id'), userController.getUserById);
router.put('/:id', authorizeOwnerOrAdmin, validateMongoId('id'), userController.updateUser);

module.exports = router; 
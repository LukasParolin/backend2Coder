const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT, authorizeAdmin, authorizeUser } = require('../middlewares/auth.middleware');

// Rutas públicas
router.post('/', userController.createUser);

// Rutas protegidas solo para administradores
router.get('/', authenticateJWT, authorizeAdmin, userController.getAllUsers);
router.delete('/:id', authenticateJWT, authorizeAdmin, userController.deleteUser);

// Rutas protegidas para usuarios autenticados
router.get('/:id', authenticateJWT, authorizeUser, userController.getUserById);
router.put('/:id', authenticateJWT, authorizeUser, userController.updateUser);

module.exports = router; 
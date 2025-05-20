const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');

// Rutas públicas
router.post('/', userController.createUser);

// Rutas protegidas
router.get('/', authenticateJWT, authorizeRole(['admin']), userController.getAllUsers);
router.get('/:id', authenticateJWT, userController.getUserById);
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), userController.deleteUser);

module.exports = router; 
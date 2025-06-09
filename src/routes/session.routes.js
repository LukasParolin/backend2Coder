const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticateLocal, authenticateCurrent } = require('../middlewares/auth.middleware');
const { validateEmail, validatePassword } = require('../middlewares/validation.middleware');

// Ruta para login - usa middleware de autenticación local
router.post('/login', authenticateLocal, sessionController.login);

// Ruta para obtener el usuario actual (protegida con estrategia current)
router.get('/current', authenticateCurrent, sessionController.getCurrentUser);

// Ruta para logout (opcional, ya que el token se maneja en el cliente)
router.post('/logout', sessionController.logout);

// Rutas para recuperación de contraseña
router.post('/forgot-password', validateEmail, sessionController.requestPasswordReset);
router.get('/reset-password/:token', sessionController.validateResetToken);
router.post('/reset-password/:token', validatePassword, sessionController.resetPassword);

module.exports = router; 
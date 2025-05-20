const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

// Ruta para login
router.post('/login', sessionController.login);

// Ruta para obtener el usuario actual (protegida)
router.get('/current', authenticateJWT, sessionController.getCurrentUser);

// Ruta para logout (opcional, ya que el token se maneja en el cliente)
router.post('/logout', sessionController.logout);

module.exports = router; 
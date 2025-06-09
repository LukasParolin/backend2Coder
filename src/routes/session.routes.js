const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticateLocal, authenticateJWT } = require('../middlewares/auth.middleware');

// Ruta para login - usa middleware de autenticación local
router.post('/login', authenticateLocal, sessionController.login);

// Ruta para obtener el usuario actual (protegida con JWT)
router.get('/current', authenticateJWT, sessionController.getCurrentUser);

// Ruta para logout (opcional, ya que el token se maneja en el cliente)
router.post('/logout', sessionController.logout);

module.exports = router; 
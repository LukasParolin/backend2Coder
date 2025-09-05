const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoption.controller');
const { authorizeUser, authorizeAdmin } = require('../middlewares/auth.middleware');
const { validateMongoId, validatePetData } = require('../middlewares/validation.middleware');

// Rutas públicas
router.get('/adoptions', adoptionController.getAllAdoptions);
router.get('/adoptions/:aid', validateMongoId('aid'), adoptionController.getAdoptionById);

// Rutas protegidas para usuarios autenticados
router.post('/:uid/:pid', authorizeUser, validateMongoId('uid'), validateMongoId('pid'), adoptionController.adoptPet);

// Rutas protegidas para administradores
router.post('/pets', authorizeAdmin, validatePetData, adoptionController.createPetForAdoption);

module.exports = router;

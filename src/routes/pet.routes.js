const express = require('express');
const { getAllPets } = require('../controllers/pet.controller');
const router = express.Router();

router.get('/', getAllPets);

module.exports = router;

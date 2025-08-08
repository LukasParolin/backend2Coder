const express = require('express');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/user.model');
const Pet = require('../models/pet.model');
const PetRepository = require('../repositories/pet.repository');

const router = express.Router();
const petRepository = new PetRepository();

// --- Generación de datos mock ---
// Uso faker para conseguir variedad y bcrypt para dejar la contraseña tal como estaría en producción.
// Separamos la construcción de un usuario individual para dejar claro el shape.
const PASSWORD_HASH = bcrypt.hashSync('coder123', 10); // Hash reutilizado (optimización menor)
const ROLES = ['user', 'admin'];

function buildMockUser() {
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: PASSWORD_HASH,
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    cart: null, // No generamos carrito aquí para mantener simple el mock
    pets: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generateMockUsers(count = 50) {
  return Array.from({ length: count }, () => buildMockUser());
}

// Endpoint original /mockingpets migrado al router de mocks para centralizar todo lo "fake"
router.get('/mockingpets', (req, res) => {
  const pets = Array.from({ length: 50 }, () => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.person.firstName(),
    specie: faker.helpers.arrayElement(['dog','cat','bird','hamster','fish']),
    age: faker.number.int({ min: 0, max: 15 }),
    adopted: faker.datatype.boolean()
  }));
  res.json({ status: 'success', data: { pets } });
});

// GET /mockingusers -> genera X usuarios mock (default 50). No se persisten.
router.get('/mockingusers', (req, res) => {
  const { quantity } = req.query;
  const count = parseInt(quantity, 10) || 50;
  const users = generateMockUsers(count);
  res.json({ status: 'success', data: { users, count: users.length } });
});

// POST /generateData -> genera e inserta en BD usuarios y mascotas.
// Nota: intencionalmente no se crea carrito ni se dispara email de bienvenida para mantenerlo liviano.
router.post('/generateData', async (req, res, next) => {
  try {
    const usersToGenerate = parseInt(req.body.users, 10) || 0;
    const petsToGenerate = parseInt(req.body.pets, 10) || 0;

    const createdUsers = [];

  // Generar usuarios y persistir uno a uno (loop simple; podríamos usar insertMany pero perderíamos hooks individuales si existieran)
    if (usersToGenerate > 0) {
      const mockUsers = generateMockUsers(usersToGenerate);
      for (const u of mockUsers) {
        // Crear documento Mongoose real
        const userDoc = new User({
          first_name: u.first_name,
          last_name: u.last_name,
          email: u.email,
          age: u.age,
          password: u.password,
          role: u.role
        });
        const saved = await userDoc.save();
        createdUsers.push(saved);
      }
    }

    const petDocs = [];
    if (petsToGenerate > 0) {
      for (let i = 0; i < petsToGenerate; i++) {
        petDocs.push({
          name: faker.person.firstName(),
          specie: faker.helpers.arrayElement(['dog','cat','bird','hamster','fish']),
          age: faker.number.int({ min: 0, max: 15 }),
          adopted: false
        });
      }
      await petRepository.createManyPets(petDocs);
    }

    res.status(201).json({
      status: 'success',
      message: 'Datos generados correctamente',
      data: {
        usersInserted: createdUsers.length,
        petsInserted: petDocs.length
      }
    });
  } catch (error) { next(error); }
});

module.exports = router;

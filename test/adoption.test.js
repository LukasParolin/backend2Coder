const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');
const Pet = require('../src/models/pet.model');

describe('Adoption Router Tests', function() {
  let adminToken;
  let userToken;
  let adminId;
  let userId;
  let petId;

  before(async function() {
    // Conectar a la base de datos de prueba
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test');
    }
  });

  beforeEach(async function() {
    // Limpiar base de datos antes de cada test
    await User.deleteMany({});
    await Pet.deleteMany({});

    // Crear usuario administrador
    const adminResponse = await request(app)
      .post('/api/users')
      .send({
        first_name: 'Admin',
        last_name: 'Test',
        email: 'admin@test.com',
        age: 30,
        password: 'admin123',
        role: 'admin'
      });

    adminId = adminResponse.body.data.user._id;

    // Login como administrador
    const adminLoginResponse = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      });

    adminToken = adminLoginResponse.body.data.token;

    // Crear usuario normal
    const userResponse = await request(app)
      .post('/api/users')
      .send({
        first_name: 'User',
        last_name: 'Test',
        email: 'user@test.com',
        age: 25,
        password: 'user123',
        role: 'user'
      });

    userId = userResponse.body.data.user._id;

    // Login como usuario
    const userLoginResponse = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'user@test.com',
        password: 'user123'
      });

    userToken = userLoginResponse.body.data.token;

    // Crear una mascota para pruebas
    const petResponse = await request(app)
      .post('/api/adoptions/pets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Firulais',
        specie: 'dog',
        age: 3
      });

    petId = petResponse.body.data.pet._id;
  });

  after(async function() {
    // Limpiar después de todos los tests
    await User.deleteMany({});
    await Pet.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/adoptions/adoptions', function() {
    it('debe obtener todas las adopciones (inicialmente vacío)', async function() {
      const response = await request(app)
        .get('/api/adoptions/adoptions')
        .expect(200);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.adoptions).to.be.an('array');
      expect(response.body.data.adoptions).to.have.length(0);
      expect(response.body.data.count).to.equal(0);
    });

    it('debe obtener adopciones cuando existen mascotas adoptadas', async function() {
      // Adoptar la mascota primero
      await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      const response = await request(app)
        .get('/api/adoptions/adoptions')
        .expect(200);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.adoptions).to.be.an('array');
      expect(response.body.data.adoptions).to.have.length(1);
      expect(response.body.data.count).to.equal(1);
      expect(response.body.data.adoptions[0].adopted).to.be.true;
    });
  });

  describe('GET /api/adoptions/adoptions/:aid', function() {
    it('debe obtener una adopción específica por ID', async function() {
      // Adoptar la mascota primero
      await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      const response = await request(app)
        .get(`/api/adoptions/adoptions/${petId}`)
        .expect(200);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.adoption).to.be.an('object');
      expect(response.body.data.adoption._id).to.equal(petId);
      expect(response.body.data.adoption.adopted).to.be.true;
    });

    it('debe retornar error 404 para una adopción que no existe', async function() {
      const response = await request(app)
        .get(`/api/adoptions/adoptions/${petId}`)
        .expect(404);

      expect(response.body.status).to.equal('error');
      expect(response.body.message).to.include('no está adoptada');
    });

    it('debe retornar error 400 para ID inválido', async function() {
      const response = await request(app)
        .get('/api/adoptions/adoptions/invalid-id')
        .expect(400);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('POST /api/adoptions/:uid/:pid', function() {
    it('debe permitir a un usuario autenticado adoptar una mascota', async function() {
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.include('adoptada exitosamente');
      expect(response.body.data.adoption.adopted).to.be.true;
      expect(response.body.data.adoption.owner).to.equal(userId);
    });

    it('debe retornar error 401 sin autenticación', async function() {
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .expect(401);

      expect(response.body.status).to.equal('error');
    });

    it('debe retornar error 400 si la mascota ya está adoptada', async function() {
      // Adoptar la mascota primero
      await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Intentar adoptar nuevamente
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.status).to.equal('error');
      expect(response.body.message).to.include('ya está adoptada');
    });

    it('debe retornar error 404 para usuario inexistente', async function() {
      const fakeUserId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/adoptions/${fakeUserId}/${petId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.status).to.equal('error');
      expect(response.body.message).to.include('Usuario no encontrado');
    });

    it('debe retornar error 404 para mascota inexistente', async function() {
      const fakePetId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post(`/api/adoptions/${userId}/${fakePetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.status).to.equal('error');
      expect(response.body.message).to.include('Mascota no encontrada');
    });

    it('debe retornar error 400 para IDs inválidos', async function() {
      const response = await request(app)
        .post('/api/adoptions/invalid-user-id/invalid-pet-id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('POST /api/adoptions/pets', function() {
    it('debe permitir a un administrador crear una mascota para adopción', async function() {
      const petData = {
        name: 'Michi',
        specie: 'cat',
        age: 2
      };

      const response = await request(app)
        .post('/api/adoptions/pets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(petData)
        .expect(201);

      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.include('disponible para adopción');
      expect(response.body.data.pet.name).to.equal('Michi');
      expect(response.body.data.pet.specie).to.equal('cat');
      expect(response.body.data.pet.age).to.equal(2);
      expect(response.body.data.pet.adopted).to.be.false;
    });

    it('debe retornar error 401 sin autenticación', async function() {
      const petData = {
        name: 'Michi',
        specie: 'cat',
        age: 2
      };

      const response = await request(app)
        .post('/api/adoptions/pets')
        .send(petData)
        .expect(401);

      expect(response.body.status).to.equal('error');
    });

    it('debe retornar error 403 para usuarios no administradores', async function() {
      const petData = {
        name: 'Michi',
        specie: 'cat',
        age: 2
      };

      const response = await request(app)
        .post('/api/adoptions/pets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(petData)
        .expect(403);

      expect(response.body.status).to.equal('error');
    });

    it('debe retornar error 400 para datos inválidos', async function() {
      const petData = {
        // name faltante
        specie: 'cat',
        age: -1 // edad inválida
      };

      const response = await request(app)
        .post('/api/adoptions/pets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(petData)
        .expect(400);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('Flujo completo de adopción', function() {
    it('debe realizar un flujo completo de adopción exitoso', async function() {
      // 1. Crear una mascota (admin)
      const petResponse = await request(app)
        .post('/api/adoptions/pets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Rex',
          specie: 'dog',
          age: 5
        })
        .expect(201);

      const newPetId = petResponse.body.data.pet._id;

      // 2. Verificar que aparece en la lista de adopciones (inicialmente vacía)
      let adoptionsResponse = await request(app)
        .get('/api/adoptions/adoptions')
        .expect(200);

      expect(adoptionsResponse.body.data.count).to.equal(0);

      // 3. Adoptar la mascota
      await request(app)
        .post(`/api/adoptions/${userId}/${newPetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // 4. Verificar que aparece en la lista de adopciones
      adoptionsResponse = await request(app)
        .get('/api/adoptions/adoptions')
        .expect(200);

      expect(adoptionsResponse.body.data.count).to.equal(1);
      expect(adoptionsResponse.body.data.adoptions[0].name).to.equal('Rex');

      // 5. Obtener la adopción específica
      const adoptionResponse = await request(app)
        .get(`/api/adoptions/adoptions/${newPetId}`)
        .expect(200);

      expect(adoptionResponse.body.data.adoption.adopted).to.be.true;
      expect(adoptionResponse.body.data.adoption.owner).to.equal(userId);
    });
  });
});

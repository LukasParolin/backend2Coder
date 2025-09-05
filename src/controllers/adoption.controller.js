const PetRepository = require('../repositories/pet.repository');
const UserRepository = require('../repositories/user.repository');
const { AppError } = require('../middlewares/errorHandler');

class AdoptionController {
  constructor() {
    this.petRepository = new PetRepository();
    this.userRepository = new UserRepository();
  }

  // Obtener todas las adopciones
  async getAllAdoptions(req, res, next) {
    try {
      const pets = await this.petRepository.getAllPets();
      const adoptedPets = pets.filter(pet => pet.adopted);
      
      res.status(200).json({
        status: 'success',
        data: {
          adoptions: adoptedPets,
          count: adoptedPets.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener adopción por ID
  async getAdoptionById(req, res, next) {
    try {
      const { aid } = req.params;
      const pet = await this.petRepository.getPetById(aid);
      
      if (!pet.adopted) {
        throw new AppError('Esta mascota no está adoptada', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          adoption: pet
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Adoptar una mascota
  async adoptPet(req, res, next) {
    try {
      const { uid, pid } = req.params;
      
      // Verificar que el usuario existe
      const user = await this.userRepository.getUserById(uid);
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }

      // Verificar que la mascota existe y no está adoptada
      const pet = await this.petRepository.getPetById(pid);
      if (!pet) {
        throw new AppError('Mascota no encontrada', 404);
      }

      if (pet.adopted) {
        throw new AppError('Esta mascota ya está adoptada', 400);
      }

      // Adoptar la mascota
      const adoptedPet = await this.petRepository.updatePet(pid, { 
        adopted: true,
        owner: uid
      });

      // Agregar la mascota al usuario
      await this.userRepository.updateUser(uid, {
        $push: { pets: pid }
      });

      res.status(200).json({
        status: 'success',
        message: 'Mascota adoptada exitosamente',
        data: {
          adoption: adoptedPet,
          user: user._id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear una mascota para adopción
  async createPetForAdoption(req, res, next) {
    try {
      const petData = {
        ...req.body,
        adopted: false
      };

      const newPet = await this.petRepository.createPet(petData);

      res.status(201).json({
        status: 'success',
        message: 'Mascota creada y disponible para adopción',
        data: {
          pet: newPet
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

// Crear instancia del controlador
const adoptionController = new AdoptionController();

module.exports = {
  getAllAdoptions: adoptionController.getAllAdoptions.bind(adoptionController),
  getAdoptionById: adoptionController.getAdoptionById.bind(adoptionController),
  adoptPet: adoptionController.adoptPet.bind(adoptionController),
  createPetForAdoption: adoptionController.createPetForAdoption.bind(adoptionController)
};

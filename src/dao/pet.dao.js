const Pet = require('../models/pet.model');

class PetDAO {
  async findAll() {
    return await Pet.find();
  }

  async create(petData) {
    const pet = new Pet(petData);
    return await pet.save();
  }

  async createMany(petsData) {
    return await Pet.insertMany(petsData);
  }
}

module.exports = PetDAO;

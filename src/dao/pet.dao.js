const Pet = require('../models/pet.model');

class PetDAO {
  async findAll() {
    return await Pet.find();
  }

  async findById(id) {
    return await Pet.findById(id);
  }

  async create(petData) {
    const pet = new Pet(petData);
    return await pet.save();
  }

  async updateById(id, updateData) {
    return await Pet.findByIdAndUpdate(id, updateData, { new: true });
  }

  async createMany(petsData) {
    return await Pet.insertMany(petsData);
  }
}

module.exports = PetDAO;

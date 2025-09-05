const PetDAO = require('../dao/pet.dao');

class PetRepository {
  constructor() {
    this.petDAO = new PetDAO();
  }

  async getAllPets() {
    return await this.petDAO.findAll();
  }

  async getPetById(id) {
    return await this.petDAO.findById(id);
  }

  async createPet(petData) {
    return await this.petDAO.create(petData);
  }

  async updatePet(id, updateData) {
    return await this.petDAO.updateById(id, updateData);
  }

  async createManyPets(petsData) {
    return await this.petDAO.createMany(petsData);
  }
}

module.exports = PetRepository;

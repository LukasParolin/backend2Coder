const PetDAO = require('../dao/pet.dao');

class PetRepository {
  constructor() {
    this.petDAO = new PetDAO();
  }

  async getAllPets() {
    return await this.petDAO.findAll();
  }

  async createPet(petData) {
    return await this.petDAO.create(petData);
  }

  async createManyPets(petsData) {
    return await this.petDAO.createMany(petsData);
  }
}

module.exports = PetRepository;

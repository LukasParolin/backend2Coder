const PetRepository = require('../repositories/pet.repository');

class PetController {
  constructor() {
    this.petRepository = new PetRepository();
  }

  async getAllPets(req, res, next) {
    try {
      const pets = await this.petRepository.getAllPets();
      res.status(200).json({ status: 'success', data: { pets } });
    } catch (error) { next(error); }
  }
}

const petController = new PetController();
module.exports = { getAllPets: petController.getAllPets.bind(petController) };

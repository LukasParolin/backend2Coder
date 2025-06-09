const Ticket = require('../models/ticket.model');

class TicketDAO {
  async findAll() {
    try {
      return await Ticket.find().populate('products.product');
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Ticket.findById(id).populate('products.product');
    } catch (error) {
      throw new Error(`Error al obtener ticket por ID: ${error.message}`);
    }
  }

  async findByPurchaser(purchaser) {
    try {
      return await Ticket.find({ purchaser }).populate('products.product');
    } catch (error) {
      throw new Error(`Error al obtener tickets por comprador: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Ticket.findOne({ code }).populate('products.product');
    } catch (error) {
      throw new Error(`Error al obtener ticket por código: ${error.message}`);
    }
  }

  async create(ticketData) {
    try {
      const newTicket = new Ticket(ticketData);
      return await newTicket.save();
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await Ticket.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).populate('products.product');
    } catch (error) {
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await Ticket.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar ticket: ${error.message}`);
    }
  }
}

module.exports = TicketDAO; 
const Product = require('../models/product.model');

class ProductDAO {
  async findAll() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Product.findOne({ code });
    } catch (error) {
      throw new Error(`Error al obtener producto por código: ${error.message}`);
    }
  }

  async create(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async updateStock(id, newStock) {
    try {
      return await Product.findByIdAndUpdate(id, { stock: newStock }, { new: true });
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  async findByCategory(category) {
    try {
      return await Product.find({ category });
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`);
    }
  }
}

module.exports = ProductDAO; 
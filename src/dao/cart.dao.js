const Cart = require('../models/cart.model');

class CartDAO {
  async findById(id) {
    try {
      return await Cart.findById(id).populate('products.product');
    } catch (error) {
      throw new Error(`Error al obtener carrito por ID: ${error.message}`);
    }
  }

  async create(cartData) {
    try {
      const newCart = new Cart(cartData);
      return await newCart.save();
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await Cart.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).populate('products.product');
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await Cart.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar carrito: ${error.message}`);
    }
  }

  async addProduct(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async removeProduct(cartId, productId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { products: [], total: 0 },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error al limpiar carrito: ${error.message}`);
    }
  }
}

module.exports = CartDAO; 
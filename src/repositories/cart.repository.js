const CartDAO = require('../dao/cart.dao');
const { CartDTO, CartSummaryDTO } = require('../dto/cart.dto');
const { AppError } = require('../middlewares/errorHandler');

class CartRepository {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async getCartById(id) {
    const cart = await this.cartDAO.findById(id);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }
    return CartDTO.fromCart(cart);
  }

  async createCart(cartData = { products: [], total: 0 }) {
    const newCart = await this.cartDAO.create(cartData);
    return CartDTO.fromCart(newCart);
  }

  async updateCart(id, updateData) {
    const cart = await this.cartDAO.findById(id);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const updatedCart = await this.cartDAO.updateById(id, updateData);
    return CartDTO.fromCart(updatedCart);
  }

  async deleteCart(id) {
    const cart = await this.cartDAO.findById(id);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }

    await this.cartDAO.deleteById(id);
    return { message: 'Carrito eliminado correctamente' };
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const updatedCart = await this.cartDAO.addProduct(cartId, productId, quantity);
    return CartDTO.fromCart(updatedCart);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const updatedCart = await this.cartDAO.removeProduct(cartId, productId);
    return CartDTO.fromCart(updatedCart);
  }

  async clearCart(cartId) {
    const cart = await this.cartDAO.findById(cartId);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }

    const clearedCart = await this.cartDAO.clearCart(cartId);
    return CartDTO.fromCart(clearedCart);
  }

  async getCartSummary(id) {
    const cart = await this.cartDAO.findById(id);
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }
    return CartSummaryDTO.fromCart(cart);
  }
}

module.exports = CartRepository; 
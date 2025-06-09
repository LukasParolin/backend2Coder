const CartRepository = require('../repositories/cart.repository');
const ProductRepository = require('../repositories/product.repository');
const PurchaseService = require('../services/purchase.service');
const { AppError } = require('../middlewares/errorHandler');

class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.purchaseService = new PurchaseService();
  }

  // Obtener carrito por ID
  async getCartById(req, res, next) {
    try {
      const cart = await this.cartRepository.getCartById(req.params.cid);

      res.status(200).json({
        status: 'success',
        data: {
          cart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Agregar producto al carrito (solo usuarios)
  async addProductToCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const { quantity = 1 } = req.body;
      const user = req.user;

      // Verificar que el carrito pertenece al usuario (excepto admin)
      if (user.role !== 'admin' && user.cart.toString() !== cid) {
        return next(new AppError('No puedes agregar productos a un carrito que no es tuyo', 403));
      }

      // Verificar que el producto existe
      const product = await this.productRepository.getProductById(pid);

      // Verificar stock disponible
      if (product.stock < quantity) {
        return next(new AppError(`Stock insuficiente. Disponible: ${product.stock}`, 400));
      }

      // Agregar producto al carrito
      const updatedCart = await this.cartRepository.addProductToCart(cid, pid, quantity);

      res.status(200).json({
        status: 'success',
        message: 'Producto agregado al carrito',
        data: {
          cart: updatedCart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar producto del carrito
  async removeProductFromCart(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const user = req.user;

      // Verificar que el carrito pertenece al usuario (excepto admin)
      if (user.role !== 'admin' && user.cart.toString() !== cid) {
        return next(new AppError('No puedes modificar un carrito que no es tuyo', 403));
      }

      const updatedCart = await this.cartRepository.removeProductFromCart(cid, pid);

      res.status(200).json({
        status: 'success',
        message: 'Producto eliminado del carrito',
        data: {
          cart: updatedCart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Limpiar carrito
  async clearCart(req, res, next) {
    try {
      const { cid } = req.params;
      const user = req.user;

      // Verificar que el carrito pertenece al usuario (excepto admin)
      if (user.role !== 'admin' && user.cart.toString() !== cid) {
        return next(new AppError('No puedes limpiar un carrito que no es tuyo', 403));
      }

      const clearedCart = await this.cartRepository.clearCart(cid);

      res.status(200).json({
        status: 'success',
        message: 'Carrito limpiado',
        data: {
          cart: clearedCart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Procesar compra del carrito
  async purchaseCart(req, res, next) {
    try {
      const { cid } = req.params;
      const user = req.user;

      // Verificar que el carrito pertenece al usuario (excepto admin)
      if (user.role !== 'admin' && user.cart.toString() !== cid) {
        return next(new AppError('No puedes comprar un carrito que no es tuyo', 403));
      }

      // Procesar la compra
      const purchaseResult = await this.purchaseService.processPurchase(cid, user.email);

      const statusCode = purchaseResult.success ? 200 : 400;

      res.status(statusCode).json({
        status: purchaseResult.success ? 'success' : 'partial_success',
        message: purchaseResult.message,
        data: {
          ticket: purchaseResult.ticket,
          failedProducts: purchaseResult.failedProducts,
          totalAmount: purchaseResult.totalAmount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener tickets del usuario
  async getUserTickets(req, res, next) {
    try {
      const user = req.user;
      const tickets = await this.purchaseService.getTicketsByUser(user.email);

      res.status(200).json({
        status: 'success',
        data: {
          tickets
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener ticket por código
  async getTicketByCode(req, res, next) {
    try {
      const { code } = req.params;
      const ticket = await this.purchaseService.getTicketByCode(code);

      res.status(200).json({
        status: 'success',
        data: {
          ticket
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener todos los tickets (solo admin)
  async getAllTickets(req, res, next) {
    try {
      const tickets = await this.purchaseService.getAllTickets();

      res.status(200).json({
        status: 'success',
        data: {
          tickets
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

// Crear instancia del controlador
const cartController = new CartController();

module.exports = {
  getCartById: cartController.getCartById.bind(cartController),
  addProductToCart: cartController.addProductToCart.bind(cartController),
  removeProductFromCart: cartController.removeProductFromCart.bind(cartController),
  clearCart: cartController.clearCart.bind(cartController),
  purchaseCart: cartController.purchaseCart.bind(cartController),
  getUserTickets: cartController.getUserTickets.bind(cartController),
  getTicketByCode: cartController.getTicketByCode.bind(cartController),
  getAllTickets: cartController.getAllTickets.bind(cartController)
}; 
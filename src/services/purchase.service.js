const CartDAO = require('../dao/cart.dao');
const TicketDAO = require('../dao/ticket.dao');
const ProductRepository = require('../repositories/product.repository');
const EmailService = require('./email.service');
const { TicketDTO, TicketSummaryDTO } = require('../dto/ticket.dto');
const Ticket = require('../models/ticket.model');
const { AppError } = require('../middlewares/errorHandler');

class PurchaseService {
  constructor() {
    this.cartDAO = new CartDAO();
    this.ticketDAO = new TicketDAO();
    this.productRepository = new ProductRepository();
    this.emailService = new EmailService();
  }

  async processPurchase(cartId, purchaserEmail) {
    try {
      // Obtener el carrito con productos poblados
      const cart = await this.cartDAO.findById(cartId);
      if (!cart || cart.products.length === 0) {
        throw new AppError('El carrito está vacío', 400);
      }

      const purchasedProducts = [];
      const failedProducts = [];
      let totalAmount = 0;

      // Verificar stock y procesar cada producto
      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;

        try {
          // Verificar stock disponible
          if (product.stock >= requestedQuantity) {
            // Actualizar stock del producto
            await this.productRepository.updateProductStock(product._id, requestedQuantity);
            
            // Agregar a productos comprados
            const productTotal = product.price * requestedQuantity;
            purchasedProducts.push({
              product: product._id,
              quantity: requestedQuantity,
              price: product.price,
              title: product.title
            });
            
            totalAmount += productTotal;
          } else {
            // Agregar a productos fallidos
            failedProducts.push({
              product: product._id,
              title: product.title,
              requestedQuantity,
              availableStock: product.stock,
              reason: 'Stock insuficiente'
            });
          }
        } catch (error) {
          failedProducts.push({
            product: product._id,
            title: product.title,
            requestedQuantity,
            reason: `Error al procesar: ${error.message}`
          });
        }
      }

      let ticket = null;
      let purchaseResult = {
        success: false,
        message: '',
        ticket: null,
        failedProducts: failedProducts,
        totalAmount: 0
      };

      // Si hay productos comprados exitosamente, crear ticket
      if (purchasedProducts.length > 0) {
        const ticketData = {
          code: Ticket.generateCode(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: purchaserEmail,
          products: purchasedProducts,
          status: failedProducts.length > 0 ? 'pending' : 'completed'
        };

        ticket = await this.ticketDAO.create(ticketData);

        // Limpiar carrito de productos comprados exitosamente
        await this.removeSuccessfulProductsFromCart(cartId, purchasedProducts);

        // Enviar email de confirmación
        this.emailService.sendTicketEmail(purchaserEmail, ticket).catch(console.error);

        purchaseResult = {
          success: true,
          message: failedProducts.length > 0 
            ? 'Compra parcialmente completada. Algunos productos no pudieron ser procesados.'
            : 'Compra completada exitosamente.',
          ticket: ticket,
          failedProducts: failedProducts,
          totalAmount: totalAmount
        };
      } else {
        purchaseResult = {
          success: false,
          message: 'No se pudo procesar ningún producto. Revisa el stock disponible.',
          ticket: null,
          failedProducts: failedProducts,
          totalAmount: 0
        };
      }

      return purchaseResult;

    } catch (error) {
      throw new AppError(`Error al procesar la compra: ${error.message}`, 500);
    }
  }

  async removeSuccessfulProductsFromCart(cartId, purchasedProducts) {
    try {
      const cart = await this.cartDAO.findById(cartId);
      if (!cart) return;

      // Filtrar productos que no fueron comprados
      const remainingProducts = cart.products.filter(cartItem => {
        return !purchasedProducts.some(purchased => 
          purchased.product.toString() === cartItem.product._id.toString()
        );
      });

      // Actualizar carrito con productos restantes
      await this.cartDAO.updateById(cartId, { 
        products: remainingProducts,
        total: this.calculateCartTotal(remainingProducts)
      });

    } catch (error) {
      console.error('Error al actualizar carrito después de compra:', error);
    }
  }

  calculateCartTotal(products) {
    return products.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  async getTicketsByUser(userEmail) {
    try {
      const tickets = await this.ticketDAO.findByPurchaser(userEmail);
      return TicketSummaryDTO.fromTickets(tickets);
    } catch (error) {
      throw new AppError(`Error al obtener tickets del usuario: ${error.message}`, 500);
    }
  }

  async getTicketByCode(code) {
    try {
      const ticket = await this.ticketDAO.findByCode(code);
      if (!ticket) {
        throw new AppError('Ticket no encontrado', 404);
      }
      return TicketDTO.fromTicket(ticket);
    } catch (error) {
      throw new AppError(`Error al obtener ticket: ${error.message}`, 500);
    }
  }

  async getAllTickets() {
    try {
      const tickets = await this.ticketDAO.findAll();
      return TicketSummaryDTO.fromTickets(tickets);
    } catch (error) {
      throw new AppError(`Error al obtener todos los tickets: ${error.message}`, 500);
    }
  }
}

module.exports = PurchaseService; 
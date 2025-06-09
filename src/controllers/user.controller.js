const UserRepository = require('../repositories/user.repository');
const EmailService = require('../services/email.service');
const CartRepository = require('../repositories/cart.repository');
const Validators = require('../utils/validators');
const { AppError } = require('../middlewares/errorHandler');

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
    this.cartRepository = new CartRepository();
  }

  // Obtener todos los usuarios
  async getAllUsers(req, res, next) {
    try {
      const users = await this.userRepository.getAllUsers();
      
      res.status(200).json({
        status: 'success',
        data: {
          users
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un usuario por ID
  async getUserById(req, res, next) {
    try {
      const user = await this.userRepository.getUserById(req.params.id);
      
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo usuario
  async createUser(req, res, next) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;
      
      // Validar datos de entrada
      const validationErrors = Validators.validateUserData(req.body);
      if (validationErrors.length > 0) {
        return next(new AppError(`Errores de validación: ${validationErrors.join(', ')}`, 400));
      }
      
      // Crear un carrito vacío para el usuario
      const newCart = await this.cartRepository.createCart();
      
      // Crear el usuario con el carrito
      const userData = {
        first_name,
        last_name,
        email,
        age,
        password,
        cart: newCart.id,
        role: role || 'user'
      };
      
      const newUser = await this.userRepository.createUser(userData);
      
      // Enviar email de bienvenida (no bloqueante)
      this.emailService.sendWelcomeEmail(email, first_name).catch(console.error);
      
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un usuario
  async updateUser(req, res, next) {
    try {
      const { first_name, last_name, age, role } = req.body;
      
      // No permitir actualizar email o password en esta ruta
      const updateData = { first_name, last_name, age, role };
      
      const updatedUser = await this.userRepository.updateUser(req.params.id, updateData);
      
      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar un usuario
  async deleteUser(req, res, next) {
    try {
      const user = await this.userRepository.getUserById(req.params.id);
      
      // También eliminar su carrito
      if (user.cart) {
        await this.cartRepository.deleteCart(user.cart);
      }
      
      const result = await this.userRepository.deleteUser(req.params.id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

// Crear instancia del controlador
const userController = new UserController();

module.exports = {
  getAllUsers: userController.getAllUsers.bind(userController),
  getUserById: userController.getUserById.bind(userController),
  createUser: userController.createUser.bind(userController),
  updateUser: userController.updateUser.bind(userController),
  deleteUser: userController.deleteUser.bind(userController)
}; 
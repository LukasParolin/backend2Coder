const Validators = require('../utils/validators');
const { AppError } = require('./errorHandler');

// Middleware para validar datos de usuario
const validateUserData = (req, res, next) => {
  try {
    const validationErrors = Validators.validateUserData(req.body);
    if (validationErrors.length > 0) {
      return next(new AppError(`Errores de validación: ${validationErrors.join(', ')}`, 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para validar datos de producto
const validateProductData = (req, res, next) => {
  try {
    const validationErrors = Validators.validateProductData(req.body);
    if (validationErrors.length > 0) {
      return next(new AppError(`Errores de validación: ${validationErrors.join(', ')}`, 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para validar email
const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !Validators.validateEmail(email)) {
      return next(new AppError('Email válido es requerido', 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para validar password
const validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || !Validators.validatePassword(password)) {
      return next(new AppError('Contraseña debe tener al menos 6 caracteres', 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para validar cantidad en carrito
const validateQuantity = (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity !== undefined && !Validators.validateQuantity(quantity)) {
      return next(new AppError('La cantidad debe ser un número entero positivo', 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para validar IDs de MongoDB
const validateMongoId = (paramName) => {
  return (req, res, next) => {
    try {
      const id = req.params[paramName];
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!id || !mongoIdRegex.test(id)) {
        return next(new AppError(`ID ${paramName} inválido`, 400));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validateUserData,
  validateProductData,
  validateEmail,
  validatePassword,
  validateQuantity,
  validateMongoId
}; 
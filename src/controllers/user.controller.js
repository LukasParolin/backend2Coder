const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const { AppError } = require('../middlewares/errorHandler');

// Obtener todos los usuarios
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Ya existe un usuario con ese correo electrónico', 400));
    }
    
    // Crear un carrito vacío para el usuario
    const newCart = await Cart.create({
      products: [],
      total: 0
    });
    
    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Crear el usuario
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id,
      role: role || 'user'
    });
    
    // No devolver la contraseña
    newUser.password = undefined;
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario
const updateUser = async (req, res, next) => {
  try {
    const { first_name, last_name, age, role } = req.body;
    
    // No permitir actualizar email o password en esta ruta
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { first_name, last_name, age, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return next(new AppError('Usuario no encontrado', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }
    
    // También eliminar su carrito
    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart);
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}; 
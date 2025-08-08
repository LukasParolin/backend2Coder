const User = require('../models/user.model');
const DatabaseCheck = require('../utils/database-check');

class UserDAO {
  async findAll() {
    try {
  return await User.find().select('-password').populate('pets');
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async findById(id) {
    try {
  return await User.findById(id).select('-password').populate('pets');
    } catch (error) {
      throw new Error(`Error al obtener usuario por ID: ${error.message}`);
    }
  }

  async findByIdWithPassword(id) {
    try {
      return await User.findById(id).select('+password');
    } catch (error) {
      throw new Error(`Error al obtener usuario con contraseña: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
  return await User.findOne({ email }).select('-password').populate('pets');
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  async findByEmailWithPassword(email) {
    try {
      DatabaseCheck.throwIfNotConnected('buscar usuario por email con contraseña');
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      throw new Error(`Error al obtener usuario por email con contraseña: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).select('-password');
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async findByResetToken(token) {
    try {
      return await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    } catch (error) {
      throw new Error(`Error al buscar token de reset: ${error.message}`);
    }
  }

  async updatePassword(id, hashedPassword) {
    try {
      return await User.findByIdAndUpdate(id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      });
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }
}

module.exports = UserDAO; 
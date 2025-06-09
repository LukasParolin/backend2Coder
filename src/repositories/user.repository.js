const UserDAO = require('../dao/user.dao');
const { UserDTO, UserPublicDTO, UserCreateDTO } = require('../dto/user.dto');
const bcrypt = require('bcrypt');
const { AppError } = require('../middlewares/errorHandler');

class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async getAllUsers() {
    const users = await this.userDAO.findAll();
    return UserDTO.fromUsers(users);
  }

  async getUserById(id) {
    const user = await this.userDAO.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return UserDTO.fromUser(user);
  }

  async getUserByEmail(email) {
    const user = await this.userDAO.findByEmail(email);
    return user ? UserDTO.fromUser(user) : null;
  }

  async getUserForLogin(email) {
    const user = await this.userDAO.findByEmailWithPassword(email);
    return user;
  }

  async createUser(userData) {
    const userCreateDTO = new UserCreateDTO(userData);
    
    // Verificar si el usuario ya existe
    const existingUser = await this.userDAO.findByEmail(userCreateDTO.email);
    if (existingUser) {
      throw new AppError('Ya existe un usuario con ese correo electrónico', 400);
    }

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(userCreateDTO.password, 10);
    userCreateDTO.password = hashedPassword;

    const newUser = await this.userDAO.create(userCreateDTO);
    return UserDTO.fromUser(newUser);
  }

  async updateUser(id, updateData) {
    const user = await this.userDAO.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const updatedUser = await this.userDAO.updateById(id, updateData);
    return UserDTO.fromUser(updatedUser);
  }

  async deleteUser(id) {
    const user = await this.userDAO.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    await this.userDAO.deleteById(id);
    return { message: 'Usuario eliminado correctamente' };
  }

  async getUserPublicInfo(id) {
    const user = await this.userDAO.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return UserPublicDTO.fromUser(user);
  }

  async findByResetToken(token) {
    return await this.userDAO.findByResetToken(token);
  }

  async updateUserResetToken(id, token, expires) {
    return await this.userDAO.updateById(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });
  }

  async resetPassword(id, newPassword, oldPassword) {
    const user = await this.userDAO.findByIdWithPassword(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Verificar que la nueva contraseña no sea igual a la actual
    const isSameAsCurrent = await user.isValidPassword(newPassword);
    if (isSameAsCurrent) {
      throw new AppError('La nueva contraseña no puede ser igual a la actual', 400);
    }

    // Verificar que la nueva contraseña no sea igual a la anterior
    if (user.previousPassword) {
      const isSameAsPrevious = await bcrypt.compare(newPassword, user.previousPassword);
      if (isSameAsPrevious) {
        throw new AppError('La nueva contraseña no puede ser igual a la anterior', 400);
      }
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Guardar la contraseña actual como anterior
    await this.userDAO.updateById(id, { previousPassword: user.password });
    
    // Actualizar la contraseña
    await this.userDAO.updatePassword(id, hashedPassword);
    
    return { message: 'Contraseña actualizada correctamente' };
  }
}

module.exports = UserRepository; 
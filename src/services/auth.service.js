const crypto = require('crypto');
const UserRepository = require('../repositories/user.repository');
const EmailService = require('./email.service');
const { AppError } = require('../middlewares/errorHandler');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  async requestPasswordReset(email) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new AppError('No se encontró un usuario con ese correo electrónico', 404);
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRES || 3600000)); // 1 hora

    // Guardar token en base de datos
    await this.userRepository.updateUserResetToken(user.id, resetToken, resetExpires);

    // Enviar email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña'
    };
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Token inválido o expirado', 400);
    }

    // Restablecer la contraseña
    await this.userRepository.resetPassword(user._id, newPassword);

    return {
      success: true,
      message: 'Contraseña restablecida correctamente'
    };
  }

  async validateResetToken(token) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Token inválido o expirado', 400);
    }

    return {
      success: true,
      message: 'Token válido',
      userId: user._id
    };
  }
}

module.exports = AuthService; 
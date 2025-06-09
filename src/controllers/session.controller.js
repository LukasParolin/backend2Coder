const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.service');
const UserRepository = require('../repositories/user.repository');
const { UserPublicDTO } = require('../dto/user.dto');
const { AppError } = require('../middlewares/errorHandler');

// Generar un token JWT
const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return token;
};

// Login de usuario - simplificado para usar con middleware de Passport
const login = (req, res) => {
  // El usuario viene del middleware de autenticación de Passport
  const user = req.user;
  
  // Generar token JWT
  const token = generateToken(user);
  
  // Enviar respuesta con DTO público
  const userDTO = UserPublicDTO.fromUser(user);
  
  res.status(200).json({
    status: 'success',
    data: {
      user: userDTO,
      token
    }
  });
};

// Obtener información del usuario actual usando DTO
const getCurrentUser = (req, res) => {
  const userDTO = UserPublicDTO.fromUser(req.user);
  
  res.status(200).json({
    status: 'success',
    data: {
      user: userDTO
    }
  });
};

// Cerrar sesión (en el cliente se debe eliminar el token)
const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada correctamente'
  });
};

// Solicitar reset de contraseña
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(new AppError('El email es requerido', 400));
    }

    const authService = new AuthService();
    const result = await authService.requestPasswordReset(email);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Validar token de reset
const validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const authService = new AuthService();
    const result = await authService.validateResetToken(token);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Reset de contraseña
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return next(new AppError('La nueva contraseña es requerida', 400));
    }

    const authService = new AuthService();
    const result = await authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getCurrentUser,
  logout,
  requestPasswordReset,
  validateResetToken,
  resetPassword
}; 
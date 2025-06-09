const jwt = require('jsonwebtoken');
const { AppError } = require('../middlewares/errorHandler');

// Generar un token JWT
const generateToken = (user) => {
  const payload = {
    id: user._id,
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
  
  // Enviar respuesta
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
};

// Obtener información del usuario actual
const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      }
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

module.exports = {
  login,
  getCurrentUser,
  logout
}; 
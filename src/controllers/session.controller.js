const jwt = require('jsonwebtoken');
const passport = require('passport');
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

// Login de usuario
const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(new AppError('Credenciales inválidas', 401));
    }
    
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
  })(req, res, next);
};

// Obtener información del usuario actual
const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
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
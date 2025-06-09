const passport = require('passport');
const { AppError } = require('./errorHandler');

// Middleware para autenticación con estrategia local (login)
const authenticateLocal = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(new AppError('Credenciales inválidas', 401));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para validar JWT
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(new AppError('No autorizado. Por favor inicie sesión.', 401));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para verificar roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('No autorizado. Por favor inicie sesión.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tiene permisos para realizar esta acción.', 403));
    }

    next();
  };
};

// Middleware para solo administradores
const authorizeAdmin = authorizeRole(['admin']);

// Middleware para usuarios autenticados (cualquier rol)
const authorizeUser = authorizeRole(['user', 'admin']);

module.exports = {
  authenticateLocal,
  authenticateJWT,
  authorizeRole,
  authorizeAdmin,
  authorizeUser
}; 
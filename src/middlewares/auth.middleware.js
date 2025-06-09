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

// Middleware para la estrategia current
const authenticateCurrent = (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
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
const authorizeAdmin = (req, res, next) => {
  authenticateCurrent(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'admin') {
      return next(new AppError('Acceso denegado. Solo administradores pueden realizar esta acción.', 403));
    }
    
    next();
  });
};

// Middleware para usuarios autenticados (cualquier rol)
const authorizeUser = (req, res, next) => {
  authenticateCurrent(req, res, (err) => {
    if (err) return next(err);
    
    if (!['user', 'admin'].includes(req.user.role)) {
      return next(new AppError('Acceso denegado. Usuario no autorizado.', 403));
    }
    
    next();
  });
};

// Middleware para verificar si el usuario es dueño del recurso o admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  authenticateCurrent(req, res, (err) => {
    if (err) return next(err);
    
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.id === req.params.id || req.user._id.toString() === req.params.id;
    
    if (!isAdmin && !isOwner) {
      return next(new AppError('Acceso denegado. Solo puedes acceder a tu propia información.', 403));
    }
    
    next();
  });
};

module.exports = {
  authenticateLocal,
  authenticateJWT,
  authenticateCurrent,
  authorizeRole,
  authorizeAdmin,
  authorizeUser,
  authorizeOwnerOrAdmin
}; 
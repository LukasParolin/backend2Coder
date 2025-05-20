const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');
const { AppError } = require('../middlewares/errorHandler');

const initializePassport = () => {
  // Estrategia Local
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // Buscar el usuario por email y traer la contraseña
          const user = await User.findOne({ email }).select('+password');

          if (!user) {
            return done(new AppError('Usuario no encontrado', 404), false);
          }

          // Verificar la contraseña
          const isValid = await user.isValidPassword(password);
          if (!isValid) {
            return done(new AppError('Contraseña incorrecta', 401), false);
          }

          // No devolver la contraseña
          user.password = undefined;
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia JWT
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'default_jwt_secret',
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

module.exports = { initializePassport }; 
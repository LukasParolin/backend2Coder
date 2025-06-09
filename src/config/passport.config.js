const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserRepository = require('../repositories/user.repository');
const { AppError } = require('../middlewares/errorHandler');
const DatabaseCheck = require('../utils/database-check');
const DemoData = require('../utils/demo-data');

const initializePassport = () => {
  const userRepository = new UserRepository();

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
          let user;
          
          // Si no hay conexión a la base de datos, usar datos de demostración
          if (!DatabaseCheck.isConnected()) {
            const demoUser = DemoData.getUser();
            if (email === demoUser.email) {
              const isValid = await demoUser.isValidPassword(password);
              if (isValid) {
                const userWithoutPassword = { ...demoUser };
                delete userWithoutPassword.password;
                delete userWithoutPassword.isValidPassword;
                return done(null, userWithoutPassword);
              }
            }
            return done(new AppError('Usuario no encontrado en modo demostración', 404), false);
          }

          // Buscar el usuario por email y traer la contraseña
          user = await userRepository.getUserForLogin(email);

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
          // Si hay error de base de datos, intentar con datos de demostración
          if (error.message.includes('Base de datos no disponible')) {
            const demoUser = DemoData.getUser();
            if (email === demoUser.email) {
              const isValid = await demoUser.isValidPassword(password);
              if (isValid) {
                const userWithoutPassword = { ...demoUser };
                delete userWithoutPassword.password;
                delete userWithoutPassword.isValidPassword;
                return done(null, userWithoutPassword);
              }
            }
            return done(new AppError('Usuario no encontrado en modo demostración', 404), false);
          }
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
    'jwt',
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        let user;
        
        // Si no hay conexión a la base de datos, usar datos de demostración
        if (!DatabaseCheck.isConnected()) {
          const demoUser = DemoData.getUser();
          if (jwtPayload.id === demoUser._id) {
            const userWithoutPassword = { ...demoUser };
            delete userWithoutPassword.password;
            delete userWithoutPassword.isValidPassword;
            return done(null, userWithoutPassword);
          }
          return done(null, false);
        }

        user = await userRepository.getUserById(jwtPayload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        // Si hay error de base de datos, intentar con datos de demostración
        if (error.message.includes('Base de datos no disponible')) {
          const demoUser = DemoData.getUser();
          if (jwtPayload.id === demoUser._id) {
            const userWithoutPassword = { ...demoUser };
            delete userWithoutPassword.password;
            delete userWithoutPassword.isValidPassword;
            return done(null, userWithoutPassword);
          }
        }
        return done(error, false);
      }
    })
  );

  // Estrategia current - misma que JWT pero con nombre específico
  passport.use(
    'current',
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        let user;
        
        // Si no hay conexión a la base de datos, usar datos de demostración
        if (!DatabaseCheck.isConnected()) {
          const demoUser = DemoData.getUser();
          if (jwtPayload.id === demoUser._id) {
            const userWithoutPassword = { ...demoUser };
            delete userWithoutPassword.password;
            delete userWithoutPassword.isValidPassword;
            return done(null, userWithoutPassword);
          }
          return done(null, false);
        }

        user = await userRepository.getUserById(jwtPayload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        // Si hay error de base de datos, intentar con datos de demostración
        if (error.message.includes('Base de datos no disponible')) {
          const demoUser = DemoData.getUser();
          if (jwtPayload.id === demoUser._id) {
            const userWithoutPassword = { ...demoUser };
            delete userWithoutPassword.password;
            delete userWithoutPassword.isValidPassword;
            return done(null, userWithoutPassword);
          }
        }
        return done(error, false);
      }
    })
  );
};

module.exports = { initializePassport }; 
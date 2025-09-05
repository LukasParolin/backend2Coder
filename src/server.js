require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { initializePassport } = require('./config/passport.config');
const { swaggerUi, specs } = require('./config/swagger.config');

// Importar rutas
const userRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const mocksRouter = require('./routes/mocks.router');
const petRoutes = require('./routes/pet.routes');
const adoptionRoutes = require('./routes/adoption.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static('public'));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Documentación con Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/mocks', mocksRouter);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Ecommerce funcionando correctamente',
    version: '2.0.0',
    features: [
      'Autenticación JWT con Passport',
      'Sistema de roles (user/admin)',
      'Recuperación de contraseña por email',
      'Carrito de compras',
      'Sistema de tickets',
      'Arquitectura con Repository Pattern',
      'DTOs para transferencia de datos',
      'Middleware de autorización avanzado'
    ]
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
    await connectDB();
  });
} else {
  // En modo test, solo conectar a la base de datos
  connectDB();
}

module.exports = app; 
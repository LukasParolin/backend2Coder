require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { initializePassport } = require('./config/passport.config');

// Importar rutas
const userRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'API de Ecommerce funcionando correctamente' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await connectDB();
}); 
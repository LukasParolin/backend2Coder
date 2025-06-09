const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Conexión a MongoDB establecida exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    console.log('⚠️  El servidor continuará funcionando sin base de datos');
    console.log('💡 Para usar todas las funcionalidades, configura la conexión a MongoDB');
  }
};

module.exports = { connectDB }; 
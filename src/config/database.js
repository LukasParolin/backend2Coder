const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('✅ Conexión a MongoDB establecida exitosamente');
    console.log('🏷️  Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    console.log('⚠️  El servidor continuará funcionando sin base de datos');
    console.log('💡 Para usar todas las funcionalidades, configura la conexión a MongoDB');
    
    // Información de debugging
    if (error.message.includes('ENOTFOUND')) {
      console.log('🌐 Error de red - verifica tu conexión a internet');
    }
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Error de autenticación - verifica usuario y contraseña en Atlas');
    }
    if (error.message.includes('timed out')) {
      console.log('⏰ Timeout de conexión - verifica que la URI sea correcta');
    }
  }
};

module.exports = { connectDB }; 
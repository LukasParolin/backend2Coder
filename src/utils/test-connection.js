require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🔍 Probando conexión a MongoDB...');
  console.log('📍 URI configurada:', process.env.MONGODB_URI ? 'URI presente' : 'URI no encontrada');
  
  try {
    // Configuración adicional para MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
    };

    console.log('⏳ Intentando conectar...');
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ ¡Conexión exitosa a MongoDB!');
    console.log('📊 Estado de conexión:', mongoose.connection.readyState);
    console.log('🏷️  Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Probar una operación simple
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones disponibles:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado exitosamente');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('🌐 Error de red - verifica tu conexión a internet');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Error de autenticación - verifica usuario y contraseña');
    }
    
    if (error.message.includes('timed out')) {
      console.log('⏰ Timeout de conexión - verifica que la URI sea correcta');
    }
    
    console.log('💡 URI utilizada:', process.env.MONGODB_URI?.substring(0, 50) + '...');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testConnection().then(() => process.exit(0));
}

module.exports = { testConnection }; 
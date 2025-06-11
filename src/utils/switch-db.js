#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../../.env');

const configs = {
  local: {
    MONGODB_URI: 'mongodb://localhost:27017/ecommerce',
    description: 'Base de datos local MongoDB'
  },
  atlas: {
    MONGODB_URI: 'mongodb+srv://lukasparolinmazzeo:oSubGpWxldtqg3EDqclusIer0.if6ldqr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
    description: 'MongoDB Atlas (requiere IP whitelisted)'
  }
};

const switchDatabase = (target) => {
  if (!configs[target]) {
    console.log('❌ Configuración no válida. Usa: local o atlas');
    return;
  }

  try {
    // Leer archivo .env actual
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar la URI de MongoDB
    const newUri = configs[target].MONGODB_URI;
    envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${newUri}`);
    
    // Escribir archivo actualizado
    fs.writeFileSync(envPath, envContent);
    
    console.log(`✅ Base de datos cambiada a: ${configs[target].description}`);
    console.log(`📍 Nueva URI: ${newUri.substring(0, 50)}...`);
    
  } catch (error) {
    console.error('❌ Error al cambiar configuración:', error.message);
  }
};

// Uso desde línea de comandos
const target = process.argv[2];
if (target) {
  switchDatabase(target);
} else {
  console.log('🔧 Uso: node src/utils/switch-db.js [local|atlas]');
  console.log('');
  console.log('Opciones disponibles:');
  Object.entries(configs).forEach(([key, config]) => {
    console.log(`  ${key}: ${config.description}`);
  });
}

module.exports = { switchDatabase }; 
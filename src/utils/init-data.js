require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/database');
const User = require('../models/user.model');
const Product = require('../models/product.model');

const initializeData = async () => {
  try {
    console.log('🚀 Inicializando datos de prueba...');
    await connectDB();
    
    // Limpiar datos existentes
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Datos anteriores eliminados');
    
    // Crear usuario admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      first_name: 'Admin',
      last_name: 'Sistema',
      email: 'admin@ecommerce.com',
      age: 30,
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('👤 Usuario admin creado: admin@ecommerce.com / admin123');
    
    // Crear usuario normal
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'user@ecommerce.com',
      age: 25,
      password: userPassword,
      role: 'user'
    });
    await user.save();
    console.log('👤 Usuario normal creado: user@ecommerce.com / user123');
    
    // Crear productos de prueba
    const products = [
      {
        title: 'iPhone 15 Pro',
        description: 'El último iPhone con chip A17 Pro y cámara de 48MP',
        price: 999.99,
        stock: 50,
        category: 'Electronics',
        thumbnails: ['https://via.placeholder.com/300x300/007bff/ffffff?text=iPhone+15'],
        status: true,
        code: 'IPHONE15PRO'
      },
      {
        title: 'MacBook Air M2',
        description: 'Laptop ultradelgada con chip M2 de Apple',
        price: 1199.99,
        stock: 30,
        category: 'Electronics',
        thumbnails: ['https://via.placeholder.com/300x300/28a745/ffffff?text=MacBook+Air'],
        status: true,
        code: 'MACBOOKAIRM2'
      },
      {
        title: 'AirPods Pro 2',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 249.99,
        stock: 100,
        category: 'Electronics',
        thumbnails: ['https://via.placeholder.com/300x300/ffc107/000000?text=AirPods+Pro'],
        status: true,
        code: 'AIRPODSPRO2'
      },
      {
        title: 'Apple Watch Series 9',
        description: 'Smartwatch con GPS y monitoreo de salud',
        price: 399.99,
        stock: 75,
        category: 'Wearables',
        thumbnails: ['https://via.placeholder.com/300x300/dc3545/ffffff?text=Apple+Watch'],
        status: true,
        code: 'APPLEWATCH9'
      },
      {
        title: 'iPad Pro 12.9"',
        description: 'Tablet profesional con chip M2 y pantalla Liquid Retina',
        price: 1099.99,
        stock: 25,
        category: 'Electronics',
        thumbnails: ['https://via.placeholder.com/300x300/6f42c1/ffffff?text=iPad+Pro'],
        status: true,
        code: 'IPADPRO129'
      }
    ];
    
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      console.log(`📱 Producto creado: ${productData.title}`);
    }
    
    console.log('✅ Datos de prueba inicializados exitosamente');
    console.log('');
    console.log('🔑 Credenciales de prueba:');
    console.log('   Admin: admin@ecommerce.com / admin123');
    console.log('   Usuario: user@ecommerce.com / user123');
    console.log('');
    console.log('🌐 Accede a: http://localhost:8080');
    
  } catch (error) {
    console.error('❌ Error inicializando datos:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeData();
}

module.exports = { initializeData }; 
// Datos de demostración para cuando no hay conexión a la base de datos

const demoProducts = [
  {
    _id: 'demo_product_1',
    title: 'Laptop Gaming',
    description: 'Laptop de alta performance para gaming',
    price: 1299.99,
    stock: 5,
    category: 'Tecnología',
    code: 'LAP001',
    thumbnails: ['https://via.placeholder.com/300x200'],
    status: true
  },
  {
    _id: 'demo_product_2', 
    title: 'Smartphone Pro',
    description: 'Smartphone de última generación',
    price: 899.99,
    stock: 10,
    category: 'Tecnología',
    code: 'SMT001',
    thumbnails: ['https://via.placeholder.com/300x200'],
    status: true
  },
  {
    _id: 'demo_product_3',
    title: 'Auriculares Bluetooth',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    price: 199.99,
    stock: 15,
    category: 'Audio',
    code: 'AUR001',
    thumbnails: ['https://via.placeholder.com/300x200'],
    status: true
  }
];

const demoUser = {
  _id: 'demo_user_admin',
  firstName: 'Admin',
  lastName: 'Demo',
  email: 'admin@example.com',
  age: 30,
  role: 'admin',
  password: '$2b$10$DUyWkKPZ6NAN3uT78bV6CeT08UfHzwbFjarZAbn5avzX1g8zQsl6W', // Hash de "admin123"
  isValidPassword: async function(password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, this.password);
  }
};

class DemoData {
  static getProducts() {
    return demoProducts;
  }

  static getProductById(id) {
    return demoProducts.find(product => product._id === id);
  }

  static getUser() {
    return demoUser;
  }

  static isAvailable() {
    return true; // Los datos demo siempre están disponibles
  }

  static getDatabaseStatus() {
    return {
      connected: false,
      mode: 'demo',
      message: 'Usando datos de demostración. Conecta a MongoDB para funcionalidad completa.'
    };
  }
}

module.exports = DemoData; 
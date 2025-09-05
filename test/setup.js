// Configuración global para tests
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test';
process.env.JWT_SECRET = 'test_jwt_secret_2024';

// Suprimir logs durante tests
const originalConsoleLog = console.log;
console.log = () => {};

// Restaurar console.log después de todos los tests si es necesario
after(() => {
  console.log = originalConsoleLog;
});

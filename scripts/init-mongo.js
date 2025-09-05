// Script de inicialización para MongoDB en Docker
print('Iniciando configuración de la base de datos...');

// Crear usuario administrador por defecto
db = db.getSiblingDB('ecommerce');

// Crear colecciones básicas
db.createCollection('users');
db.createCollection('products');
db.createCollection('carts');
db.createCollection('pets');
db.createCollection('tickets');

print('Base de datos configurada correctamente.');

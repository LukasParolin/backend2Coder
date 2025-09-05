const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Ecommerce - Backend2Coder',
      version: '1.0.0',
      description: 'API Backend completa para un sistema de ecommerce con autenticación JWT, sistema de roles, carrito de compras y adopción de mascotas',
      contact: {
        name: 'Backend2Coder',
        email: 'admin@ecommerce.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan@example.com'
            },
            age: {
              type: 'number',
              minimum: 18,
              description: 'Edad del usuario',
              example: 30
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario',
              example: 'user'
            },
            cart: {
              type: 'string',
              description: 'ID del carrito del usuario'
            },
            pets: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array de IDs de mascotas adoptadas'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          },
          required: ['first_name', 'last_name', 'email', 'age', 'password']
        },
        UserCreate: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan@example.com'
            },
            age: {
              type: 'number',
              minimum: 18,
              description: 'Edad del usuario',
              example: 30
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña del usuario',
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario (opcional, por defecto: user)',
              example: 'user'
            }
          },
          required: ['first_name', 'last_name', 'email', 'age', 'password']
        },
        UserUpdate: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan@example.com'
            },
            age: {
              type: 'number',
              minimum: 18,
              description: 'Edad del usuario',
              example: 30
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Mensaje de error'
            },
            statusCode: {
              type: 'number',
              example: 400
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // rutas a los archivos que contienen las definiciones de la API
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs
};

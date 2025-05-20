# API de Ecommerce con Node.js, Express y MongoDB

API Backend para un sistema de ecommerce con autenticación JWT y MongoDB.

## Requisitos

- Node.js (v14 o superior)
- MongoDB

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

## Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## Características

- Autenticación con JWT (JSON Web Tokens)
- Sistema de roles (user, admin)
- CRUD completo de usuarios
- Middleware de manejo de errores
- Conexión a MongoDB

## Estructura del Proyecto

```
├── src/
│   ├── config/           # Configuraciones (DB, Passport)
│   ├── controllers/      # Controladores
│   ├── middlewares/      # Middlewares personalizados
│   ├── models/           # Modelos de datos (Mongoose)
│   ├── routes/           # Rutas de la API
│   └── server.js         # Punto de entrada de la aplicación
├── .env                  # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Sistema de Autenticación y Autorización

El proyecto implementa un sistema de autenticación y autorización completo con las siguientes características:

### Modelo de Usuario

- **Campos del usuario**: first_name, last_name, email, age, password, cart, role
- **Seguridad**: La contraseña se almacena encriptada usando bcrypt.hashSync
- **Validación**: Incluye validaciones para correo electrónico y edad

### Estrategias de Passport

- **LocalStrategy**: Para la autenticación con email y contraseña
- **JWTStrategy**: Para la autenticación con token JWT
- **Endpoints de autenticación**:
  - Login: Genera token JWT
  - Current: Obtiene datos del usuario actual
  - Logout: Cierra la sesión (se elimina el token en el cliente)

### Gestión de Tokens JWT

- **Generación**: El token incluye id, email y role del usuario
- **Expiración**: Configurable mediante variable de entorno (default: 24h)
- **Almacenamiento**: El token se envía al cliente y debe incluirse en los headers de las peticiones

### Autorización basada en roles

- **Roles disponibles**: user, admin
- **Middleware de autorización**: Permite restringir rutas según el rol del usuario
- **Protección de rutas**: Las rutas críticas requieren autenticación mediante JWT

## Rutas de la API

### Usuarios

- `POST /api/users`: Crear un nuevo usuario
- `GET /api/users`: Obtener todos los usuarios (admin)
- `GET /api/users/:id`: Obtener un usuario por ID
- `PUT /api/users/:id`: Actualizar un usuario
- `DELETE /api/users/:id`: Eliminar un usuario (admin)

### Autenticación

- `POST /api/sessions/login`: Iniciar sesión
- `GET /api/sessions/current`: Obtener usuario actual
- `POST /api/sessions/logout`: Cerrar sesión

### Productos

- `GET /api/products`: Obtener todos los productos
- `GET /api/products/:id`: Obtener un producto por ID
- `POST /api/products`: Crear un nuevo producto (admin)
- `PUT /api/products/:id`: Actualizar un producto (admin)
- `DELETE /api/products/:id`: Eliminar un producto (admin)

## Ejemplo de Uso

### Crear un Usuario

```
POST /api/users
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 30,
  "password": "password123"
}
```

### Login

```
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

Respuesta de ejemplo:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Acceder a Ruta Protegida

```
GET /api/sessions/current
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Crear un Producto (solo admin)

```
POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Producto de ejemplo",
  "description": "Descripción del producto",
  "price": 999.99,
  "stock": 100,
  "category": "Electrónica"
}
```

## Licencia

MIT

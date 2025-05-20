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

### Acceder a Ruta Protegida

```
GET /api/sessions/current
Authorization: Bearer your_jwt_token
```

## Licencia

MIT # backend2Coder

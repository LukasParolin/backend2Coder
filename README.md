# API de Ecommerce con Arquitectura Profesional

API Backend completa para un sistema de ecommerce con autenticación JWT, sistema de roles, carrito de compras, procesamiento de tickets y arquitectura basada en patrones de diseño profesionales.

## 🚀 Características Principales

- **Autenticación y Autorización**: JWT con Passport.js y sistema de roles
- **Recuperación de Contraseña**: Sistema completo con envío de emails
- **Carrito de Compras**: Gestión completa con verificación de stock
- **Sistema de Tickets**: Procesamiento de compras con generación automática
- **Arquitectura Profesional**: Repository Pattern, DAOs, DTOs y Services
- **Seguridad Avanzada**: Middleware de autorización específico por rol
- **Notificaciones por Email**: Sistema completo de mailing

## 📋 Requisitos

- Node.js (v14 o superior)
- MongoDB
- Cuenta de Gmail para envío de emails

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=8080
NODE_ENV=development

# Configuración de la base de datos
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Configuración JWT
JWT_SECRET=mi_super_secreto_jwt_para_desarrollo_2024
JWT_EXPIRES_IN=24h

# Configuración de Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
CLIENT_URL=http://localhost:3000

# Configuración de reset de contraseña
RESET_TOKEN_EXPIRES=3600000
```

## 🚀 Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 🏗️ Arquitectura del Proyecto

```
├── src/
│   ├── config/           # Configuraciones (DB, Passport)
│   ├── controllers/      # Controladores de rutas
│   ├── dao/             # Data Access Objects
│   ├── dto/             # Data Transfer Objects
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de datos (Mongoose)
│   ├── repositories/    # Repository Pattern
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   └── server.js        # Punto de entrada
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Sistema de Autenticación y Autorización

### Modelo de Usuario

- **Campos**: first_name, last_name, email, age, password, cart, role
- **Seguridad**: Contraseñas encriptadas con bcrypt
- **Validaciones**: Email único, edad mínima, formato de email
- **Reset de contraseña**: Tokens seguros con expiración

### Estrategias de Passport como Middlewares

- **`authenticateLocal`**: Para login con email/contraseña
- **`authenticateJWT`**: Para autenticación con token JWT
- **`authenticateCurrent`**: Estrategia específica para /current
- **Middlewares de autorización**:
  - `authorizeAdmin`: Solo administradores
  - `authorizeUser`: Usuarios autenticados (user + admin)
  - `authorizeOwnerOrAdmin`: Propietario del recurso o admin

### Gestión de Tokens JWT

- **Generación**: Incluye id, email y role del usuario
- **Expiración**: Configurable (default: 24h)
- **Seguridad**: Secret key configurable por ambiente

## 📧 Sistema de Recuperación de Contraseña

- **Solicitud**: POST `/api/sessions/forgot-password`
- **Validación**: GET `/api/sessions/reset-password/:token`
- **Reset**: POST `/api/sessions/reset-password/:token`
- **Seguridad**: 
  - Tokens únicos con expiración de 1 hora
  - Prevención de reutilización de contraseñas anteriores
  - Emails HTML con botones de acción

## 🛒 Sistema de Carrito y Compras

### Gestión del Carrito

- **Ver carrito**: GET `/api/carts/:cid`
- **Agregar producto**: POST `/api/carts/:cid/products/:pid`
- **Eliminar producto**: DELETE `/api/carts/:cid/products/:pid`
- **Limpiar carrito**: DELETE `/api/carts/:cid`

### Procesamiento de Compras

- **Procesar compra**: POST `/api/carts/:cid/purchase`
- **Verificación de stock**: Automática antes de procesar
- **Compras parciales**: Manejo de productos sin stock
- **Generación de tickets**: Automática con código único

### Sistema de Tickets

- **Campos**: code, purchase_datetime, amount, purchaser, products, status
- **Estados**: pending, completed, failed
- **Consultas**:
  - Tickets del usuario: GET `/api/carts/tickets/user`
  - Ticket por código: GET `/api/carts/tickets/:code`
  - Todos los tickets (admin): GET `/api/carts/tickets`

## 🏛️ Patrones de Diseño Implementados

### Repository Pattern

Separa la lógica de acceso a datos de la lógica de negocio:

```javascript
// UserRepository maneja toda la lógica de negocio de usuarios
const userRepository = new UserRepository();
const user = await userRepository.getUserById(id);
```

### DAO (Data Access Object)

Encapsula el acceso directo a la base de datos:

```javascript
// UserDAO maneja solo las operaciones de base de datos
const userDAO = new UserDAO();
const user = await userDAO.findById(id);
```

### DTO (Data Transfer Object)

Controla qué datos se envían al cliente:

```javascript
// Solo información no sensible
const userDTO = UserPublicDTO.fromUser(user);
```

### Service Layer

Contiene la lógica de negocio compleja:

```javascript
// PurchaseService maneja toda la lógica de compras
const purchaseService = new PurchaseService();
const result = await purchaseService.processPurchase(cartId, email);
```

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| POST | `/api/sessions/login` | Iniciar sesión | Público |
| GET | `/api/sessions/current` | Usuario actual | JWT |
| POST | `/api/sessions/logout` | Cerrar sesión | Público |
| POST | `/api/sessions/forgot-password` | Solicitar reset | Público |
| GET | `/api/sessions/reset-password/:token` | Validar token | Público |
| POST | `/api/sessions/reset-password/:token` | Reset contraseña | Público |

### Usuarios

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| POST | `/api/users` | Crear usuario | Público |
| GET | `/api/users` | Listar usuarios | Admin |
| GET | `/api/users/:id` | Ver usuario | Propietario/Admin |
| PUT | `/api/users/:id` | Actualizar usuario | Propietario/Admin |
| DELETE | `/api/users/:id` | Eliminar usuario | Admin |

### Productos

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| GET | `/api/products` | Listar productos | Público |
| GET | `/api/products/:id` | Ver producto | Público |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/:id` | Actualizar producto | Admin |
| DELETE | `/api/products/:id` | Eliminar producto | Admin |

### Carrito y Compras

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| GET | `/api/carts/:cid` | Ver carrito | Usuario |
| POST | `/api/carts/:cid/products/:pid` | Agregar producto | Usuario |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar producto | Usuario |
| DELETE | `/api/carts/:cid` | Limpiar carrito | Usuario |
| POST | `/api/carts/:cid/purchase` | Procesar compra | Usuario |
| GET | `/api/carts/tickets/user` | Mis tickets | Usuario |
| GET | `/api/carts/tickets/:code` | Ver ticket | Usuario |
| GET | `/api/carts/tickets` | Todos los tickets | Admin |

## 📧 Sistema de Emails

### Tipos de Email

1. **Bienvenida**: Al registrar usuario
2. **Reset de contraseña**: Con enlace seguro
3. **Confirmación de compra**: Con detalles del ticket

### Configuración

Requiere configurar las variables de entorno para Gmail:

```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
```

## 🔒 Autorización por Roles

### Administrador (`admin`)
- Gestión completa de usuarios
- CRUD completo de productos
- Visualización de todos los tickets
- Acceso a estadísticas del sistema

### Usuario (`user`)
- Gestión de su propio perfil
- Agregar productos al carrito
- Procesar compras
- Ver sus propios tickets

## 🧪 Ejemplos de Uso

### Registro de Usuario

```bash
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

```bash
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Agregar Producto al Carrito

```bash
POST /api/carts/60d21b4667d0d8992e610c85/products/60d21b4667d0d8992e610c86
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "quantity": 2
}
```

### Procesar Compra

```bash
POST /api/carts/60d21b4667d0d8992e610c85/purchase
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Solicitar Reset de Contraseña

```bash
POST /api/sessions/forgot-password
Content-Type: application/json

{
  "email": "juan@example.com"
}
```

## 🚀 Mejoras Implementadas

### Arquitectura
- ✅ Repository Pattern para separación de capas
- ✅ DAOs para acceso a datos
- ✅ DTOs para transferencia segura
- ✅ Services para lógica de negocio

### Seguridad
- ✅ Middleware de autorización específico
- ✅ Estrategia "current" de Passport
- ✅ Validación de propietario de recursos
- ✅ Tokens seguros para reset de contraseña

### Funcionalidad
- ✅ Sistema completo de carrito
- ✅ Procesamiento de compras con verificación de stock
- ✅ Generación automática de tickets
- ✅ Sistema de emails transaccionales
- ✅ Manejo de compras parciales

### Experiencia de Usuario
- ✅ Emails HTML profesionales
- ✅ Mensajes de error descriptivos
- ✅ Respuestas consistentes de la API
- ✅ Documentación completa

## 📝 Licencia

MIT

---

**Desarrollado con ❤️ usando Node.js, Express, MongoDB y las mejores prácticas de desarrollo backend.**

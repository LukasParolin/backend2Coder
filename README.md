# API de Ecommerce con Arquitectura Profesional

API Backend completa para un sistema de ecommerce con autenticación JWT, sistema de roles, carrito de compras, procesamiento de tickets, adopción de mascotas y arquitectura basada en patrones de diseño profesionales.

## 🚀 Características Principales

- **Autenticación y Autorización**: JWT con Passport.js y sistema de roles
- **Recuperación de Contraseña**: Sistema completo con envío de emails
- **Carrito de Compras**: Gestión completa con verificación de stock
- **Sistema de Tickets**: Procesamiento de compras con generación automática
- **Sistema de Adopciones**: Gestión completa de adopción de mascotas
- **Arquitectura Profesional**: Repository Pattern, DAOs, DTOs y Services
- **Seguridad Avanzada**: Middleware de autorización específico por rol
- **Notificaciones por Email**: Sistema completo de mailing
- **Documentación API**: Swagger/OpenAPI integrado
- **Tests Funcionales**: Cobertura completa con Mocha y Chai
- **Containerización**: Docker y Docker Compose incluidos

## 🐳 Docker y Containerización

### Imagen de DockerHub

La imagen oficial del proyecto está disponible en DockerHub:

**🔗 [lukasparolin/backend2coder-ecommerce](https://hub.docker.com/r/lukasparolin/backend2coder-ecommerce)**

### Ejecutar con Docker

#### Opción 1: Usar imagen de DockerHub (Recomendado)

```bash
# Ejecutar solo la aplicación (requiere MongoDB local)
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e JWT_SECRET=mi_super_secreto_jwt_2024 \
  lukasparolin/backend2coder-ecommerce:latest

# Acceder a la aplicación
curl http://localhost:8080

# Ver documentación Swagger
open http://localhost:8080/api-docs
```

#### Opción 2: Docker Compose (Aplicación + MongoDB)

```bash
# Clonar el repositorio
git clone <repository-url>
cd Backend2Coder

# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

#### Opción 3: Construir imagen localmente

```bash
# Construir la imagen
docker build -t backend2coder-ecommerce:local .

# Ejecutar
docker run -d \
  --name ecommerce-api-local \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e JWT_SECRET=mi_super_secreto_jwt_2024 \
  backend2coder-ecommerce:local
```

### Servicios Incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| API Principal | 8080 | Aplicación Node.js |
| MongoDB | 27017 | Base de datos |
| Mongo Express | 8081 | Interfaz web para MongoDB |
| Swagger Docs | 8080/api-docs | Documentación de la API |

### Variables de Entorno Docker

```env
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb://mongo:27017/ecommerce
JWT_SECRET=mi_super_secreto_jwt_para_produccion_2024
JWT_EXPIRES_IN=24h
```

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

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Cobertura de Tests

- ✅ **Adoption Router**: Tests funcionales completos
  - GET `/api/adoptions/adoptions` - Obtener todas las adopciones
  - GET `/api/adoptions/adoptions/:aid` - Obtener adopción por ID
  - POST `/api/adoptions/:uid/:pid` - Adoptar mascota
  - POST `/api/adoptions/pets` - Crear mascota para adopción
- ✅ **Casos de Error**: Validación de errores 400, 401, 403, 404
- ✅ **Autenticación**: Tests con tokens JWT
- ✅ **Autorización**: Tests de roles (user/admin)
- ✅ **Flujo Completo**: Tests de integración end-to-end

### Configuración de Tests

Los tests utilizan una base de datos separada y se ejecutan con:
- **Mocha**: Framework de testing
- **Chai**: Librería de aserciones
- **Supertest**: Tests HTTP

## 📚 Documentación API (Swagger)

### Acceso a la Documentación

Una vez que el servidor esté ejecutándose, la documentación Swagger estará disponible en:

**🔗 [http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

### Módulos Documentados

- ✅ **Users**: Documentación completa con Swagger
  - Esquemas de datos (User, UserCreate, UserUpdate)
  - Respuestas de error y éxito
  - Autenticación y autorización
  - Ejemplos de uso

### Características de la Documentación

- **OpenAPI 3.0**: Estándar moderno de documentación
- **Interfaz Interactiva**: Probar endpoints directamente
- **Autenticación JWT**: Soporte para tokens Bearer
- **Esquemas de Validación**: Modelos de datos completos
- **Ejemplos de Respuesta**: Para todos los endpoints

## 🐾 Sistema de Adopciones

### Endpoints de Adopción

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| GET | `/api/adoptions/adoptions` | Listar adopciones | Público |
| GET | `/api/adoptions/adoptions/:aid` | Ver adopción específica | Público |
| POST | `/api/adoptions/:uid/:pid` | Adoptar mascota | Usuario |
| POST | `/api/adoptions/pets` | Crear mascota | Admin |

### Flujo de Adopción

1. **Admin crea mascota**: POST `/api/adoptions/pets`
2. **Usuario adopta**: POST `/api/adoptions/:uid/:pid`
3. **Verificación**: La mascota se marca como adoptada
4. **Relación**: Se establece relación usuario-mascota

### Modelo de Mascota

```javascript
{
  name: String,        // Nombre de la mascota
  specie: String,      // Especie (dog, cat, bird, etc.)
  age: Number,         // Edad en años
  adopted: Boolean,    // Estado de adopción
  owner: ObjectId      // ID del usuario que adoptó
}
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

### Adopciones

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| GET | `/api/adoptions/adoptions` | Listar adopciones | Público |
| GET | `/api/adoptions/adoptions/:aid` | Ver adopción específica | Público |
| POST | `/api/adoptions/:uid/:pid` | Adoptar mascota | Usuario |
| POST | `/api/adoptions/pets` | Crear mascota | Admin |

### Mascotas

| Método | Endpoint | Descripción | Autorización |
|--------|----------|-------------|--------------|
| GET | `/api/pets` | Listar mascotas | Público |

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

## 🧪 Datos Mock y Generación Masiva

Se añadió un router específico para aislar toda la lógica de mocking bajo la ruta base `/api/mocks`.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/mocks/mockingpets` | 50 mascotas fake (no persistidas) |
| GET | `/api/mocks/mockingusers?quantity=Q` | Q (default 50) usuarios mock con password encriptada |
| POST | `/api/mocks/generateData` | Inserta en la BD usuarios y mascotas (body: `{ "users": number, "pets": number }`) |

### Formato de Usuarios Mock

Los usuarios generados incluyen:

- `_id` simulado estilo Mongo
- `first_name`, `last_name`, `email` aleatorios
- `password` = hash de `coder123`
- `role` alternando entre `user` y `admin`
- `pets` array vacío (campo agregado al modelo real para consistencia)

### Decisiones de Diseño

- Se reutiliza un único hash de la contraseña para evitar recomputar bcrypt en cada iteración.
- No se generan carritos ni se envían emails en `/generateData` para mantener el proceso rápido y predecible.
- Se prefirió un bucle `for` sobre `insertMany` para usuarios a fin de conservar la posibilidad de hooks/validaciones por documento (trade-off de simplicidad vs performance; ajustable si hiciera falta volumen muy alto).

### Ejemplo de Inserción Masiva

```bash
POST /api/mocks/generateData
Content-Type: application/json

{
  "users": 10,
  "pets": 25
}
```

Luego verificar:

- `GET /api/pets` (público) para mascotas
- `GET /api/users` (requiere admin) para usuarios

## 🚀 Mejoras Implementadas (v2.0)

### 🐳 Dockerización Completa

- ✅ **Dockerfile optimizado** con imagen Alpine y usuario no-root
- ✅ **Docker Compose** para desarrollo completo (App + MongoDB + Mongo Express)
- ✅ **Imagen en DockerHub**: `lukasparolin/backend2coder-ecommerce:latest`
- ✅ **Scripts automatizados** para build y deploy
- ✅ **Health checks** integrados para monitoreo
- ✅ **Optimización de imagen** con .dockerignore

### 📚 Documentación y Testing

- ✅ **Swagger/OpenAPI 3.0** integrado en `/api-docs`
- ✅ **Documentación completa del módulo Users**
- ✅ **Tests funcionales completos** para adoption router
- ✅ **Framework de testing** con Mocha, Chai y Supertest
- ✅ **Cobertura de casos de error** y autenticación

### 🐾 Sistema de Adopciones

- ✅ **Router de adopciones** completamente funcional
- ✅ **CRUD de mascotas** para adopción
- ✅ **Gestión de relaciones** usuario-mascota
- ✅ **Validaciones y autorización** por roles
- ✅ **Endpoints RESTful** siguiendo mejores prácticas

### 🔧 Mejoras Técnicas

- ✅ **Separación de entornos** (development, test, production)
- ✅ **Configuración modular** de Swagger
- ✅ **Middleware de validación** mejorado
- ✅ **Manejo de errores** unificado
- ✅ **Logging estructurado** para producción

## 📋 Instrucciones de Despliegue

### Para Desarrollo Local

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd Backend2Coder

# 2. Configurar entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Instalar dependencias
npm install

# 4. Ejecutar en desarrollo
npm run dev
```

### Para Producción con Docker

```bash
# Opción 1: Usar imagen de DockerHub
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/ecommerce \
  -e JWT_SECRET=your-super-secret-jwt-key \
  lukasparolin/backend2coder-ecommerce:latest

# Opción 2: Docker Compose (recomendado)
docker-compose up -d
```

### Para Testing

```bash
# Ejecutar tests localmente
npm test

# Ejecutar tests en Docker
docker run --rm \
  -e NODE_ENV=test \
  lukasparolin/backend2coder-ecommerce:latest npm test
```

## 🔗 Enlaces Importantes

- **🐳 Imagen Docker**: [lukasparolin/backend2coder-ecommerce](https://hub.docker.com/r/lukasparolin/backend2coder-ecommerce)
- **📚 Documentación API**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs) (cuando esté ejecutándose)
- **🗂️ Repositorio**: [GitHub](https://github.com/LukasParolin/backend2Coder)

## 📝 Licencia

MIT

---

**Desarrollado con ❤️ usando Node.js, Express, MongoDB, Docker y las mejores prácticas de desarrollo backend.**


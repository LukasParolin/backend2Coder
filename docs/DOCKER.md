# Guía de Docker - Backend2Coder

## 🐳 Construir y Ejecutar con Docker

### Construcción Local

```bash
# Construir imagen localmente
docker build -t backend2coder-ecommerce:local .

# Ver la imagen creada
docker images | grep backend2coder-ecommerce
```

### Ejecución Básica

```bash
# Ejecutar contenedor básico
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  backend2coder-ecommerce:local

# Ver logs del contenedor
docker logs -f ecommerce-api

# Detener contenedor
docker stop ecommerce-api
docker rm ecommerce-api
```

### Ejecución con Variables de Entorno

```bash
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/ecommerce \
  -e JWT_SECRET=tu_secreto_super_seguro \
  -e JWT_EXPIRES_IN=24h \
  backend2coder-ecommerce:local
```

### Ejecución con Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver estado de servicios
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## 🔧 Comandos Útiles

### Debugging

```bash
# Ejecutar bash dentro del contenedor
docker exec -it ecommerce-api /bin/sh

# Inspeccionar configuración del contenedor
docker inspect ecommerce-api

# Ver recursos utilizados
docker stats ecommerce-api
```

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Limpiar todo (cuidado!)
docker system prune -a
```

### Networking

```bash
# Crear red personalizada
docker network create ecommerce-network

# Ejecutar con red personalizada
docker run -d \
  --name ecommerce-api \
  --network ecommerce-network \
  -p 8080:8080 \
  backend2coder-ecommerce:local
```

## 📊 Monitoreo y Health Checks

### Health Check Manual

```bash
# Verificar health check
docker exec ecommerce-api curl -f http://localhost:8080/

# Ver estado de salud
docker inspect --format='{{.State.Health.Status}}' ecommerce-api
```

### Logs Estructurados

```bash
# Ver logs con timestamps
docker logs -t ecommerce-api

# Seguir logs en tiempo real
docker logs -f --since=10m ecommerce-api
```

## 🚀 Despliegue en Producción

### Mejores Prácticas

1. **Variables de Entorno**: Nunca hardcodear secretos
2. **Volúmenes**: Usar para datos persistentes
3. **Health Checks**: Configurar para alta disponibilidad
4. **Límites de Recursos**: Establecer CPU y memoria
5. **Multi-stage Builds**: Para imágenes más pequeñas

### Ejemplo de Producción

```bash
docker run -d \
  --name ecommerce-api-prod \
  --restart unless-stopped \
  -p 8080:8080 \
  --memory="512m" \
  --cpus="1.0" \
  -e NODE_ENV=production \
  -e MONGODB_URI=$MONGODB_URI \
  -e JWT_SECRET=$JWT_SECRET \
  -v /var/log/ecommerce:/usr/src/app/logs \
  lukasparolin/backend2coder-ecommerce:latest
```

## 🔐 Seguridad

### Configuraciones Recomendadas

```bash
# Ejecutar con usuario no-root (ya configurado en Dockerfile)
# Usar secrets para información sensible
# Configurar firewall para limitar acceso a puertos
# Usar HTTPS en producción con reverse proxy
```

### Variables de Entorno Seguras

```bash
# Usar Docker secrets en Docker Swarm
echo "mi_jwt_secreto" | docker secret create jwt_secret -

# Usar archivos de entorno
docker run --env-file .env.production backend2coder-ecommerce:latest
```

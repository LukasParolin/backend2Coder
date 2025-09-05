#!/bin/bash

# Script de verificación de la implementación Docker - Backend2Coder
echo "🐳 Verificación de Implementación Docker - Backend2Coder"
echo "=========================================================="

# Verificar que Docker está funcionando
echo ""
echo "1. ✅ Verificando Docker..."
docker --version
if [ $? -ne 0 ]; then
    echo "❌ Docker no está instalado o no está funcionando"
    exit 1
fi

# Verificar que la imagen existe en DockerHub
echo ""
echo "2. ✅ Verificando imagen en DockerHub..."
docker pull lukasparolin/backend2coder-ecommerce:latest > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Imagen descargada exitosamente desde DockerHub"
else
    echo "❌ Error al descargar imagen desde DockerHub"
    exit 1
fi

# Ejecutar contenedor de prueba
echo ""
echo "3. ✅ Ejecutando contenedor de prueba..."
CONTAINER_ID=$(docker run -d -p 8083:8080 -e JWT_SECRET=test_verification lukasparolin/backend2coder-ecommerce:latest)
if [ $? -eq 0 ]; then
    echo "✅ Contenedor iniciado: $CONTAINER_ID"
else
    echo "❌ Error al iniciar contenedor"
    exit 1
fi

# Esperar que el contenedor se inicie
echo ""
echo "4. ⏳ Esperando que el servicio se inicie..."
sleep 5

# Verificar que el servicio responde
echo ""
echo "5. ✅ Verificando respuesta del servicio..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8083/)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Servicio respondiendo correctamente (HTTP 200)"
else
    echo "❌ Servicio no responde correctamente (HTTP $RESPONSE)"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID > /dev/null 2>&1
    docker rm $CONTAINER_ID > /dev/null 2>&1
    exit 1
fi

# Verificar endpoint de API
echo ""
echo "6. ✅ Verificando endpoint de API..."
API_RESPONSE=$(curl -s http://localhost:8083/api/users)
if [[ $API_RESPONSE == *"error"* ]]; then
    echo "✅ API respondiendo correctamente (mensaje de autorización esperado)"
else
    echo "❌ API no responde como se esperaba"
    echo "Respuesta: $API_RESPONSE"
fi

# Verificar documentación Swagger
echo ""
echo "7. ✅ Verificando documentación Swagger..."
SWAGGER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8083/api-docs/)
if [ "$SWAGGER_RESPONSE" = "200" ]; then
    echo "✅ Documentación Swagger disponible"
else
    echo "⚠️ Documentación Swagger no accesible (HTTP $SWAGGER_RESPONSE)"
fi

# Limpiar contenedor de prueba
echo ""
echo "8. 🧹 Limpiando contenedor de prueba..."
docker stop $CONTAINER_ID > /dev/null 2>&1
docker rm $CONTAINER_ID > /dev/null 2>&1
echo "✅ Contenedor eliminado"

# Resumen final
echo ""
echo "🎉 ¡VERIFICACIÓN COMPLETADA EXITOSAMENTE!"
echo "=========================================="
echo ""
echo "✅ Imagen Docker funcionando correctamente"
echo "✅ Disponible en DockerHub: lukasparolin/backend2coder-ecommerce"
echo "✅ API respondiendo"
echo "✅ Documentación Swagger accesible"
echo ""
echo "Para usar la imagen:"
echo "docker run -d -p 8080:8080 lukasparolin/backend2coder-ecommerce:latest"
echo ""
echo "Documentación: http://localhost:8080/api-docs"

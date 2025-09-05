#!/bin/bash

# Script para construir y subir la imagen Docker a DockerHub
# Uso: ./scripts/docker-build-and-push.sh [tag]

set -e

# Configuración
DOCKER_USERNAME="lukasparolin"
IMAGE_NAME="backend2coder-ecommerce"
TAG=${1:-latest}
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "🐳 Construyendo imagen Docker: $FULL_IMAGE_NAME"

# Construir la imagen
docker build -t $FULL_IMAGE_NAME .

echo "✅ Imagen construida exitosamente"

# Opcional: Ejecutar tests en contenedor
echo "🧪 Ejecutando tests en contenedor..."
docker run --rm \
  -e NODE_ENV=test \
  -e MONGODB_URI=mongodb://localhost:27017/ecommerce_test \
  $FULL_IMAGE_NAME npm test || echo "⚠️ Tests fallaron, continuando..."

# Subir a DockerHub
echo "📤 Subiendo imagen a DockerHub..."
docker push $FULL_IMAGE_NAME

echo "🎉 Imagen subida exitosamente a DockerHub!"
echo "📋 Para ejecutar la imagen:"
echo "   docker run -d -p 8080:8080 $FULL_IMAGE_NAME"
echo ""
echo "🔗 Imagen disponible en: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"

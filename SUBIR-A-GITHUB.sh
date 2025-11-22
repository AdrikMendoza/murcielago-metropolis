#!/bin/bash

# Script para subir el código a GitHub
# Ejecuta este script después de instalar Git

echo "🚀 Subiendo código a GitHub..."
echo ""

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado"
    echo "Por favor instala Git desde: https://git-scm.com/download/mac"
    exit 1
fi

# Ir a la carpeta del proyecto
cd "/Users/matanas/flappy bird"

# Inicializar Git si no está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
fi

# Agregar todos los archivos
echo "📝 Agregando archivos..."
git add .

# Hacer commit
echo "💾 Haciendo commit..."
git commit -m "Primera versión: Juego Murciélago en la Metrópolis futurista"

# Agregar el repositorio remoto
echo "🔗 Conectando con GitHub..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/mathias-andrew-m/murcielago-en-metropolis.git

# Cambiar a rama main
git branch -M main

# Subir el código
echo "⬆️  Subiendo código a GitHub..."
echo ""
echo "⚠️  Si te pide usuario y contraseña:"
echo "   - Usuario: tu usuario de GitHub"
echo "   - Contraseña: usa un Personal Access Token (NO tu contraseña normal)"
echo "   - Crea un token en: https://github.com/settings/tokens"
echo ""
git push -u origin main

echo ""
echo "✅ ¡Código subido exitosamente!"
echo ""
echo "🌐 Tu repositorio: https://github.com/mathias-andrew-m/murcielago-en-metropolis"
echo ""
echo "🚀 Siguiente paso: Despliega en Vercel"
echo "   1. Ve a https://vercel.com"
echo "   2. Conecta tu repositorio de GitHub"
echo "   3. ¡Listo!"


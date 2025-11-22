# 📋 Instrucciones para Subir a GitHub y Desplegar en Vercel

## ✅ Archivos Preparados

Ya he eliminado los archivos innecesarios:
- ❌ `netlify.toml` (eliminado)
- ❌ `firebase.json` (eliminado)
- ✅ `vercel.json` (mantenido para Vercel)

## 🚀 Paso 1: Instalar Git (si no lo tienes)

### En Mac:
```bash
# Opción 1: Desde la web
# Descarga desde: https://git-scm.com/download/mac

# Opción 2: Con Homebrew
brew install git

# Opción 3: Instalar Xcode Command Line Tools
xcode-select --install
```

## 🚀 Paso 2: Subir Código a GitHub

### Opción A: Usar el Script Automático

1. Abre la Terminal
2. Ejecuta:
```bash
cd "/Users/matanas/flappy bird"
chmod +x SUBIR-A-GITHUB.sh
./SUBIR-A-GITHUB.sh
```

### Opción B: Comandos Manuales

```bash
# Ir a la carpeta del proyecto
cd "/Users/matanas/flappy bird"

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Primera versión: Juego Murciélago en la Metrópolis"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/mathias-andrew-m/murcielago-en-metropolis.git

# Cambiar a rama main
git branch -M main

# Subir el código
git push -u origin main
```

### ⚠️ Si te pide autenticación:

1. **Usuario**: Tu usuario de GitHub (`mathias-andrew-m`)
2. **Contraseña**: **NO uses tu contraseña normal**
   - Ve a: https://github.com/settings/tokens
   - Haz clic en "Generate new token (classic)"
   - Nombre: `Vercel Deploy`
   - Permisos: Marca `repo` (todos los permisos de repositorio)
   - Genera el token y cópialo
   - Úsalo como contraseña cuando Git te lo pida

## 🚀 Paso 3: Desplegar en Vercel

### Método 1: Desde la Web (Más Fácil) ⭐

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** (puedes usar tu cuenta de GitHub)
3. Haz clic en **"Add New Project"**
4. Selecciona tu repositorio: `mathias-andrew-m/murcielago-en-metropolis`
5. Vercel detectará automáticamente:
   - Framework: Other (sitio estático)
   - Build Command: (vacío, no necesario)
   - Output Directory: (vacío)
6. Haz clic en **"Deploy"**
7. ¡Espera 10-20 segundos y tu juego estará en línea! 🎉

### Método 2: Desde la Terminal

```bash
# Instalar Vercel CLI
npm install -g vercel

# Ir a la carpeta del proyecto
cd "/Users/matanas/flappy bird"

# Desplegar
vercel

# Sigue las instrucciones:
# - ¿Set up and deploy? → Y
# - ¿Which scope? → Tu cuenta
# - ¿Link to existing project? → N
# - ¿Project name? → murcielago-en-metropolis
# - ¿Directory? → . (punto)
```

## ✅ Resultado

Tu juego estará disponible en:
- `https://murcielago-en-metropolis.vercel.app`
- O una URL personalizada que elijas

## 🔄 Actualizar el Juego en el Futuro

Cada vez que hagas cambios:

```bash
cd "/Users/matanas/flappy bird"
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel se actualizará automáticamente en 1-2 minutos.

## 📁 Archivos que se Subirán

- ✅ `index.html` - Página principal
- ✅ `style.css` - Estilos futuristas
- ✅ `game.js` - Lógica del juego
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `README.md` - Documentación
- ✅ `.gitignore` - Archivos a ignorar

## 🆘 Problemas Comunes

### "Git no está instalado"
- Instala Git desde: https://git-scm.com/download/mac
- O ejecuta: `xcode-select --install`

### "Permission denied"
- Necesitas un Personal Access Token de GitHub
- Crea uno en: https://github.com/settings/tokens

### "Repository not found"
- Verifica que el repositorio existe: https://github.com/mathias-andrew-m/murcielago-en-metropolis
- Verifica que tienes permisos de escritura

---

**¡Tu juego estará en línea en minutos!** 🚀🦇✨


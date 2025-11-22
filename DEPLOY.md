# 🚀 Guía de Despliegue - GitHub + Vercel

## Paso 1: Preparar Git

Si no tienes Git instalado, descárgalo desde [git-scm.com](https://git-scm.com)

## Paso 2: Inicializar el Repositorio

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd "/Users/matanas/flappy bird"

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Primera versión: Juego Murciélago en la Metrópolis"
```

## Paso 3: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión (o crea una cuenta)
2. Haz clic en el botón **"+"** (arriba a la derecha) > **"New repository"**
3. Nombre del repositorio: `murcielago-metropolis` (o el que prefieras)
4. Descripción: "Juego futurista de murciélago volando por metrópolis nocturna"
5. **NO marques** "Initialize with README" (ya tenemos uno)
6. Haz clic en **"Create repository"**

## Paso 4: Conectar con GitHub

GitHub te mostrará comandos. Ejecuta estos (reemplaza `TU-USUARIO` con tu usuario de GitHub):

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/murcielago-metropolis.git

# Cambiar a la rama main
git branch -M main

# Subir el código
git push -u origin main
```

Si te pide autenticación:
- Usa un **Personal Access Token** en lugar de tu contraseña
- Crea uno en: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
- Permisos necesarios: `repo`

## Paso 5: Desplegar en Vercel

### Opción A: Desde la Web (Más Fácil)

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** (puedes usar tu cuenta de GitHub)
3. Haz clic en **"Add New Project"**
4. Selecciona tu repositorio `murcielago-metropolis`
5. Vercel detectará automáticamente la configuración
6. Haz clic en **"Deploy"**
7. ¡Espera unos segundos y tu juego estará en línea!

### Opción B: Desde la Terminal

```bash
# Instalar Vercel CLI
npm install -g vercel

# En la carpeta del proyecto
cd "/Users/matanas/flappy bird"

# Desplegar
vercel

# Sigue las instrucciones
# - ¿Set up and deploy? → Y
# - ¿Which scope? → Tu cuenta
# - ¿Link to existing project? → N
# - ¿Project name? → murcielago-metropolis (o el que prefieras)
# - ¿Directory? → . (punto)
```

## Paso 6: ¡Listo! 🎉

Tu juego estará disponible en una URL como:
- `murcielago-metropolis.vercel.app`
- O una URL personalizada si la configuraste

## 🔄 Actualizar el Juego

Cada vez que hagas cambios:

```bash
# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push

# Vercel se actualizará automáticamente
```

## 📝 Notas Importantes

- ✅ Vercel se actualiza automáticamente cuando haces `git push`
- ✅ El archivo `vercel.json` ya está configurado
- ✅ No necesitas instalar nada adicional
- ✅ HTTPS es automático y gratuito

---

**¡Tu juego está listo para ser viral!** 🚀🦇✨


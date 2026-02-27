# 🚀 Guía de Deployment

Esta guía te ayudará a desplegar ArquiBOSS a producción.

## Opciones de Deployment

### 1. **Railway.app** (Recomendado - Gratuito hasta $5/mes)

#### Paso a Paso:

1. **Crear cuenta y conectar GitHub**
   - Ir a https://railway.app
   - Sign up con GitHub
   - Conectar tu repositorio

2. **Crear proyecto en Railway**
   - Click en "Create New Project"
   - Click en "Deploy from GitHub repo"
   - Seleccionar tu repo `mi-proyecto-fullstack`

3. **Configurar variables de entorno**
   - En Railway Dashboard: Settings → Environment
   - Agregar variables:
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=tu-mysql-host
   DB_USER=admin
   DB_PASS=tu_password
   DB_NAME=arquiboss
   JWT_SECRET=tu_secret_key_segura
   ```

4. **Configurar Base de Datos MySQL**
   - En Railway: "Create" → MySQL
   - Copiar credenciales y agregarlas a variables de entorno

5. **Deploy automático**
   - Al hacer push a GitHub, Railway deploya automáticamente
   - El Procfile indica cómo iniciar: `web: node app.js`

**Tu app estará en:** `https://tu-proyecto.up.railway.app`

---

### 2. **Render.com** (Alternativa gratuita)

#### Paso a Paso:

1. **Crear cuenta**
   - Ir a https://render.com
   - Sign up

2. **Crear nuevo Web Service**
   - Click en "Create +"
   - Seleccionar "Web Service"
   - Conectar GitHub repo

3. **Configurar build**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

4. **Agregar variables de entorno**
   - Environment: Add environment variable
   ```
   NODE_ENV=production
   JWT_SECRET=tu_secret_key
   DB_HOST=...
   DB_USER=...
   DB_PASS=...
   ```

5. **Base de Datos**
   - Render: Click "Create +" → PostgreSQL
   - O usar base de datos externa (MySQL)

**Tu app estará en:** `https://tu-proyecto.onrender.com`

---

### 3. **Heroku** (De pago, pero fue popular)

**Costo:** $7/mes (dynos)

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create tu-app-name

# 4. Add environment variables
heroku config:set JWT_SECRET=tu_secret
heroku config:set DB_HOST=tu-db-host

# 5. Deploy
git push heroku main
```

---

## Configurar Base de Datos Remota

### Opción A: Railway MySQL
- Railway automáticamente te proporciona credenciales
- Agregar a variables de entorno

### Opción B: Azure Database for MySQL
```bash
# 1. Crear base de datos en Azure
# 2. Obtener connection string
# 3. Usar en DB_HOST, DB_USER, DB_PASS
```

### Opción C: Clever Cloud MySQL
```bash
# 1. Crear base de datos
# 2. Copiar credenciales
# 3. Configurar en Railway/Render
```

---

## Variables de Entorno Necesarias

```env
# Obligatorias
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
PORT=3000

# Base de Datos
DB_HOST=localhost
DB_USER=admin
DB_PASS=contraseña_segura
DB_NAME=arquiboss
DB_PORT=3306

# Frontend (opcional, por defecto http://localhost:3000)
REACT_APP_API_URL=https://tu-app.onrender.com/api

# APIs Externas (opcionales)
OPENWEATHER_API_KEY=tu_api_key
```

---

## Checklist Pre-Deployment

- [ ] `.env` configurado con variables correctas
- [ ] `Procfile` existe en raíz del proyecto
- [ ] `client/build` generado con `npm run build`
- [ ] `package.json` tiene script `build` y `heroku-postbuild`
- [ ] Base de datos remota creada y accesible
- [ ] JWT_SECRET es fuerte y seguro
- [ ] CORS configurado para dominio de producción

---

## Troubleshooting

### Problema: "Cannot find module 'path'"
**Solución:** Agregar `const path = require('path');` en app.js ✅ (ya hecho)

### Problema: "Aplicación no encuentra React build"
**Solución:** Ejecutar `npm run build` antes de deploy

### Problema: Errores 401 en API
**Solución:** Verificar JWT_SECRET es igual en frontend y backend

### Problema: Base de datos no conecta
**Solución:** Verificar credenciales en variables de entorno

### Problema: CORS errors
**Solución:** Actualizar `REACT_APP_API_URL` en .env con URL correcta

---

## Comandos Útiles

```bash
# Local development
npm run dev

# Production build
npm run build

# Test production locally
NODE_ENV=production npm start

# Ver logs en Railway
railway logs

# Ver logs en Render
render logs

# SSH to server (Railway)
railway shell

# Reintentar deployment (Render)
# En dashboard: Manual deploy → Deploy latest commit
```

---

## URLs de Monitoreo

- **Railway:** https://railway.app/dashboard
- **Render:** https://dashboard.render.com
- **Application:** https://tu-app.onrender.com

---

## Soporte

Si tienes problemas:
1. Revisar logs en el dashboard
2. Verificar variables de entorno
3. Revisar base de datos está corriendo
4. Probar localmente primero: `NODE_ENV=production npm start`

**¡Listo! Tu app está en producción! 🎉**

# 🏗️ ArquiBOSS - Full Stack Architecture Portfolio

Una aplicación web completa para gestionar proyectos arquitectónicos con autenticación JWT, CRUD de proyectos con upload de imágenes, integración de APIs de clima y geolocalización.

## 📋 Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar proyectos
- 🔐 **Autenticación JWT**: Login/Logout con tokens seguros
- 🖼️ **Upload de Imágenes**: Multer para gestión de archivos
- 🌤️ **API Clima**: Integración con Open-Meteo y OpenWeather
- 📍 **Geolocalización**: Ubicación automática del usuario
- ⚛️ **React Frontend**: Interfaz moderna y responsiva
- 📱 **Responsive Design**: Compatible con móviles y desktop

## 🛠️ Tecnologías

- **Node.js, Express.js** - Backend
- **React 18** - Frontend
- **MySQL, Sequelize** - Base de datos
- **JWT** - Autenticación
- **Multer** - Upload de archivos
- **CORS** - Control de acceso
- **Jest** - Testing

## 🚀 Inicio Rápido

### Instalación Local

```bash
# 1. Instalar dependencias del backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Instalar dependencias del frontend
cd client && npm install && cd ..

# 4. Iniciar en desarrollo
npm run dev
# Backend: http://localhost:3000
# Frontend (React): http://localhost:3001
```

### Build para Producción

```bash
npm run build
```

### Ejecutar en Producción

```bash
NODE_ENV=production npm start
```

## 🌐 Deployment en Railway/Render

El Procfile está configurado para deploy automático:

```bash
# 1. Crear cuenta en railway.app o render.com
# 2. Conectar repositorio GitHub
# 3. Agregar variables de entorno en el dashboard
# 4. Deploy automático al hacer push
```

## 📦 Estructura

```
├── app.js                    # Servidor Express
├── config/db.js              # Conexión BD
├── controllers/              # Lógica
├── middleware/               # Auth, uploads
├── models/                   # Sequelize models
├── routes/                   # API endpoints
├── uploads/                  # Imágenes
├── client/                   # React app
├── Procfile                  # Deploy config
└── package.json
```

## 🔗 API

- `GET /api/proyectos` - Listar proyectos
- `POST /api/proyectos` - Crear (requiere token)
- `PUT /api/proyectos/:id` - Editar (requiere token)
- `DELETE /api/proyectos/:id` - Eliminar (requiere token)
- `GET /api/clima` - Clima actual
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

## npm run dev

## Tests

npm test

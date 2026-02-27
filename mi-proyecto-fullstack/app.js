require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();


app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


if (process.env.NODE_ENV !== 'test') {
    sequelize.sync({ force: false })
        .then(() => console.log('✅ Base de datos sincronizada'))
        .catch(err => console.log('❌ Error de conexión:', err));
}


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));


app.use('/api/clima', require('./routes/climaRoutes')); 

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Servidor ArquiBOSS funcionando 🚀');
    });
}

// Fallback para React Router en producción
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
}


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend en puerto ${PORT}`);
    });
}

module.exports = app;
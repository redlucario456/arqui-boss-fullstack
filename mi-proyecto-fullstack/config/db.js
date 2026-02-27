const { Sequelize } = require('sequelize');

// Ya NO cargamos dotenv aquí, porque app.js ya lo hizo por nosotros
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // Mantenemos la consola limpia
    }
);

module.exports = sequelize;
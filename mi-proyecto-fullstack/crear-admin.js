require('dotenv').config();
const sequelize = require('./config/db');
const bcrypt = require('bcrypt');

async function crearUsuario() {
    try {
        await sequelize.authenticate();
        // Generamos el hash usando bcrypt directamente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Insertamos directamente en la tabla Usuarios
        await sequelize.query(
            `DELETE FROM Usuarios WHERE email = 'prohakermemo@gmail.com'`
        );
        await sequelize.query(
            `INSERT INTO Usuarios (nombre, email, password, createdAt, updatedAt) 
             VALUES ('Angel Admin', 'prohakermemo@gmail.com', '${hashedPassword}', NOW(), NOW())`
        );

        console.log('✅ Usuario creado con éxito con contraseña: 123456');
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

crearUsuario();
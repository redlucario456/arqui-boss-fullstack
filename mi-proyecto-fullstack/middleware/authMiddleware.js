const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer el token del header
    const token = req.header('Authorization');

    // Revisar si no hay token
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, permiso no válido' });
    }

    try {
        // Quitar la palabra 'Bearer ' si existe
        const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        // Verificar token
        const cifrado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = cifrado;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};
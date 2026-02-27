module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Error interno en el servidor de ArquiBOSS",
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};
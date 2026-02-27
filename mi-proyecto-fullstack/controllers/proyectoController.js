const Proyecto = require('../models/Proyecto');

// Obtener todos
exports.obtenerProyectos = async (req, res, next) => {
    try {
        const proyectos = await Proyecto.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(proyectos);
    } catch (error) {
        next(error);
    }
};

// Crear
exports.crearProyecto = async (req, res, next) => {
    try {
        let { titulo, descripcion } = req.body;

        if (!descripcion) {
            return res.status(400).json({
                message: "La descripción es obligatoria"
            });
        }

        if (!titulo) titulo = "Consulta de Cliente";

        const imageUrl = req.file
            ? `uploads/${req.file.filename}`
            : 'uploads/default.jpg';

        const nuevoProyecto = await Proyecto.create({
            titulo,
            descripcion,
            imageUrl
        });

        res.status(201).json(nuevoProyecto);

    } catch (error) {
        next(error);
    }
};

// Actualizar
exports.actualizarProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;

        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({
                message: "Proyecto no encontrado"
            });
        }

        proyecto.titulo = titulo || proyecto.titulo;
        proyecto.descripcion = descripcion || proyecto.descripcion;

        // si vino un archivo nuevo reemplazamos la imagen
        if (req.file) {
            // intentar borrar el archivo anterior si no es default
            if (proyecto.imageUrl && !proyecto.imageUrl.includes('default.jpg')) {
                const fs = require('fs');
                fs.unlink(proyecto.imageUrl, err => {
                    if (err) console.warn('No se pudo borrar imagen antigua', err);
                });
            }
            proyecto.imageUrl = `uploads/${req.file.filename}`;
        }

        await proyecto.save();

        res.json({
            message: "Actualizado correctamente",
            proyecto
        });

    } catch (error) {
        next(error);
    }
};

// Eliminar
exports.eliminarProyecto = async (req, res, next) => {
    try {

        const proyecto = await Proyecto.findByPk(req.params.id);

        if (!proyecto) {
            return res.status(404).json({
                message: "Proyecto no encontrado"
            });
        }

        await proyecto.destroy();

        res.json({
            message: "Eliminado correctamente"
        });

    } catch (error) {
        next(error);
    }
};

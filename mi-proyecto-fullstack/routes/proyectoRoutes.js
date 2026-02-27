const express = require('express');
const router = express.Router();

const controller = require('../controllers/proyectoController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', controller.obtenerProyectos);

// allow file upload on create and update
router.post('/', authMiddleware, upload.single('imagen'), controller.crearProyecto);
router.put('/:id', authMiddleware, upload.single('imagen'), controller.actualizarProyecto);
router.delete('/:id', authMiddleware, controller.eliminarProyecto);

module.exports = router;

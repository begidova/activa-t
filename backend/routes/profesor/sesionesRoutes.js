const express = require('express');
const router = express.Router();
const sesionController = require('../../controllers/profesor/sesionesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('PROFESOR'), sesionController.obtenerSesiones);
router.get('/:id', verificarToken, checkRol('PROFESOR'), sesionController.obtenerSesion);
router.post('/', verificarToken, checkRol('PROFESOR'), sesionController.crearSesion);
router.put('/:id', verificarToken, checkRol('PROFESOR'), sesionController.actualizarSesion);
router.delete('/:id', verificarToken, checkRol('PROFESOR'), sesionController.borrarSesion);

module.exports = router;
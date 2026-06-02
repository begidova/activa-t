const express = require('express');
const router = express.Router();
const sesionesController = require('../../controllers/alumno/sesionesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), sesionesController.obtenerMisSesiones);
router.get('/:id', verificarToken, checkRol('ALUMNO'), sesionesController.obtenerSesion);

module.exports = router;

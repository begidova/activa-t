const express = require('express');
const router = express.Router();
const calificacionesController = require('../../controllers/alumno/calificacionesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), calificacionesController.obtenerMisNotas);
router.get('/media', verificarToken, checkRol('ALUMNO'), calificacionesController.obtenerCalificacionMedia);
router.get('/ultimas', verificarToken, checkRol('ALUMNO'), calificacionesController.obtenerUltimasCalificaciones);
router.get('/pruebas-fisicas', verificarToken, checkRol('ALUMNO'), calificacionesController.obtenerMisEstadisticas);
module.exports = router;

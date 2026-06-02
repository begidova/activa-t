const express = require('express');
const router = express.Router();
const calificacionesController = require('../../controllers/profesor/calificacionesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.post('/', verificarToken, checkRol('PROFESOR'), calificacionesController.guardarNota);
router.post('/actividad/:actividadId', verificarToken, checkRol('PROFESOR'), calificacionesController.guardarCalificacionesGrupo);
router.get('/actividad/:actividadId', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerCalificacionesGrupoByActividad);
router.get('/prueba-fisica/:alumnoId', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerEstadisticasAlumno);
router.get('/alumno/:alumnoId', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerNotasAlumno);
router.get('/media-total', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerMediaCalificaciones);
router.get('/peores-alumnos', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerPeoresAlumnos);
router.get('/media-cursos', verificarToken, checkRol('PROFESOR'), calificacionesController.obtenerMediaCursos);

module.exports = router;
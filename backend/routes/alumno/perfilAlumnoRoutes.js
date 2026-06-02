const express = require('express');
const router = express.Router();
const perfilAlumnoController = require('../../controllers/alumno/perfilAlumnoController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), perfilAlumnoController.obtenerPerfilAlumno);
router.get('/datos-fisicos', verificarToken, checkRol('ALUMNO'), perfilAlumnoController.obtenerDatosFisicos);

module.exports = router;

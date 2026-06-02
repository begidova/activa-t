const express = require('express');
const router = express.Router();
const alumnosController = require('../../controllers/profesor/alumnosController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');
const uploadCloud = require('../../config/cloudinary');

router.get('/', verificarToken, checkRol('PROFESOR'), alumnosController.obtenerAlumnosByCursoAndByGrupo);
router.get('/cursos-grupos', verificarToken, checkRol('PROFESOR'), alumnosController.obtenerCursosGrupos);
router.get('/:id', verificarToken, alumnosController.obtenerAlumnoById);
// 'foto' es el nombre del campo en el FormData del frontend
router.put('/:id/foto', verificarToken, checkRol('PROFESOR'), uploadCloud.single('foto'), alumnosController.subirFoto);


module.exports = router;
const express = require('express');
const router = express.Router();
const actividadController = require('../../controllers/profesor/actividadesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('PROFESOR'), actividadController.obtenerActividadesByCursoAndByGrupo)
router.get('/sin-calificar', verificarToken, checkRol('PROFESOR'), actividadController.obtenerActividadesSinCalificar)
router.get('/:id', verificarToken, checkRol('PROFESOR'), actividadController.obtenerActividadById);
router.post('/', verificarToken, checkRol('PROFESOR'), actividadController.crearActividad);
router.delete('/:id', verificarToken, checkRol('PROFESOR'), actividadController.borrarActividad);
router.put('/:id', verificarToken, checkRol('PROFESOR'), actividadController.actualizarActividad);

module.exports = router;
const express = require('express');
const router = express.Router();
const progresoGrupoController = require('../../controllers/profesor/progresoGrupoController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.post('/', verificarToken, checkRol('PROFESOR'), progresoGrupoController.finalizarSesion);
router.get('/', verificarToken, checkRol('PROFESOR'), progresoGrupoController.obtenerProximasSesiones);

module.exports = router;
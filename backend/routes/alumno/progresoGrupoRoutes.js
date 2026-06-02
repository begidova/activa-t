const express = require('express');
const router = express.Router();
const progresoGrupoController = require('../../controllers/alumno/progresoGrupoController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), progresoGrupoController.obtenerProximaSesion);

module.exports = router;
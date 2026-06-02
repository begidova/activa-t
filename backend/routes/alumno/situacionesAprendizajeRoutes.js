const express = require('express');
const router = express.Router();
const situacionesAprendizajeController = require('../../controllers/alumno/situacionesAprendizajeController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), situacionesAprendizajeController.obtenerSituacionesAprendizaje);

module.exports = router;
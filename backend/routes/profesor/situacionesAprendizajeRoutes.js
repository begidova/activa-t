const express = require('express');
const router = express.Router();
const situacionesAprendizajeController = require('../../controllers/profesor/situacionesAprendizajeController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('PROFESOR'), situacionesAprendizajeController.obtenerSituacionesAprendizaje);

module.exports = router;
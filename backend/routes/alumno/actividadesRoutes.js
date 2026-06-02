const express = require('express');
const router = express.Router();
const actividadesController = require('../../controllers/alumno/actividadesController');
const verificarToken = require('../../middlewares/authMiddleware');
const checkRol = require('../../middlewares/checkRol');

router.get('/', verificarToken, checkRol('ALUMNO'), actividadesController.obtenerMisActividades);

module.exports = router;
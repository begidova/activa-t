const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/registro', authController.crearProfesor);
router.post('/login', authController.loguearUsuario);
router.post('/registro-alumnos', verificarToken, checkRol('PROFESOR'), upload.single('archivo'), authController.registrarAlumnos);


module.exports = router;
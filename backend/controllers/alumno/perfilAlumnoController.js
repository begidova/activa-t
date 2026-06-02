const Usuario = require('../../models/Usuario');

exports.obtenerDatosFisicos = async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.usuario.id);
        res.json(alumno.datosFisicos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cargar el dashboard" });
    }
};

exports.obtenerPerfilAlumno = async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.usuario.id);
        res.json(alumno);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cargar el alumno" });
    }
};

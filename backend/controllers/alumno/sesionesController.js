const Sesion = require('../../models/Sesion');

exports.obtenerSesion = async (req, res) => {
    try {
        const sesion = await Sesion.findById(req.params.id).populate("situacionAprendizaje");
        if (!sesion) return res.status(404).json({ mensaje: "Sesión no encontrada" });
        res.status(200).json(sesion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la sesión", error: error.message });
    }
};

exports.obtenerMisSesiones = async (req, res) => {
    try {
        const sesiones = await Sesion.find({ curso: req.usuario.curso })
            .sort({ numeroSesion: 1 })
            .populate('situacionAprendizaje');
        res.json(sesiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus sesiones" });
    }
};

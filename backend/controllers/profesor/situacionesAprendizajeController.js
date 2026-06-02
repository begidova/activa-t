const SituacionAprendizaje = require('../../models/SituacionAprendizaje');

exports.obtenerSituacionesAprendizaje = async (req, res) => {
    try {
        const situacionesAprendizaje = await SituacionAprendizaje.find().sort({ tema: 1 });
        res.json(situacionesAprendizaje);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener situaciones de aprendizaje" });
    }
};
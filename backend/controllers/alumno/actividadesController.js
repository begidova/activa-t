const Actividad = require('../../models/Actividad');

exports.obtenerMisActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find({ 
            curso: req.usuario.curso,
            grupo: req.usuario.grupo
        })
        .populate('situacionAprendizaje');
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus actividades" });
    }
};

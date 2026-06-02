const ProgresoGrupo = require('../../models/ProgresoGrupo');
const Sesion = require('../../models/Sesion')

exports.obtenerProximaSesion = async (req, res) => {
    try {
        const { curso, grupo } = req.usuario; 
        const progreso = await ProgresoGrupo.findOne({ curso, grupo });
        const numeroSiguiente = progreso ? progreso.ultimaSesion + 1 : 1;
        const proximaSesion = await Sesion.findOne({ 
            curso: curso, 
            numeroSesion: numeroSiguiente 
        }).populate('situacionAprendizaje');
        if (!proximaSesion) return res.status(400).json({ mensaje: "No hay próximas sesiones programadas." });
        res.json(proximaSesion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la sesión", error: error.message });
    }
};
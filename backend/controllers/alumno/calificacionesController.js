const Calificacion = require('../../models/Calificacion');

exports.obtenerMisNotas = async (req, res) => {
    try {
        const notas = await Calificacion.find({ alumno: req.usuario.id })
            .populate({
                path: 'actividad',
                populate: { path: 'situacionAprendizaje' }
            });
        res.json(notas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus notas" });
    }
};

exports.obtenerCalificacionMedia = async (req, res) => {
    try {
        const calificaciones = await Calificacion.find({ alumno: req.usuario.id })
        const totalNotas = calificaciones.length;
        const sumaNotas = calificaciones.reduce((acc, curr) => acc + curr.puntuacion, 0);
        const notaMedia = totalNotas > 0 ? (sumaNotas / totalNotas).toFixed(2) : 0;
        res.json(notaMedia);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus nota media" });
    }
};

exports.obtenerUltimasCalificaciones = async (req, res) => {
    try {
        const ultimasCalificaciones = await Calificacion.find({ alumno: req.usuario.id })
            .populate('actividad')
            .sort({ fechaRegistro: -1 })
            .limit(5);
        const progreso = ultimasCalificaciones.map(c => ({
            nombre: c.actividad.nombre,
            nota: c.puntuacion
        })).reverse();
        res.json(progreso);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus ultimas notas" });
    }
};

exports.obtenerMisEstadisticas = async (req, res) => {
    try {
        const estadisticas = await Calificacion.find({ alumno: req.usuario.id })
            .populate({
                path: 'actividad',
                match: {tipo: 'PRUEBA FISICA'}
            })
            .sort({fechaRegistro: -1});
    const pruebasFisicas = estadisticas.filter(c => c.actividad !== null);
    res.status(200).json(pruebasFisicas);
} catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tus estadisticas" });
    }
};

const Calificacion = require('../../models/Calificacion');

exports.obtenerNotasAlumno = async (req, res) => {
    try {
        const { alumnoId } = req.params;
        const notas = await Calificacion.find({ alumno: alumnoId })
            .populate({
                path: 'actividad',
                populate: { path: 'situacionAprendizaje' }
            })
            .sort({ fechaRegistro: -1 });
        res.status(200).json(notas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las notas del alumno", error: error.message });
    }
};

exports.guardarNota = async (req, res) => {
    try {
        const { alumno, actividad, puntuacion, comentario } = req.body;
        const nota = await Calificacion.findOneAndUpdate(
            { alumno, actividad },
            { puntuacion, comentario, fechaRegistro: Date.now() },
            { new: true, upsert: true }
        );
        res.json({ mensaje: "Nota guardada", datos: nota });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar", error: error.message });
    }
};

exports.obtenerMediaCalificaciones = async (req, res) => {
    try {
        const mediaGlobal = await Calificacion.aggregate([
            { $group: { _id: null, promedio: { $avg: "$puntuacion" } } }
        ]);
        res.status(200).json(mediaGlobal[0]?.promedio.toFixed(2) || 0);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la media del centro", error: error.message });
    }
};

exports.obtenerPeoresAlumnos = async (req, res) => {
    try {
        const alumnosRiesgo = await Calificacion.aggregate([
            { $group: { _id: "$alumno", promedio: { $avg: "$puntuacion" } } },
            { $match: { promedio: { $lt: 5 } } },
            { 
                $lookup: {
                    from: 'usuarios',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'datosAlumno'
                } 
            },
            { $unwind: "$datosAlumno" },
            { 
                $project: {
                    _id: 1,
                    promedio: 1,
                    nombre: "$datosAlumno.nombre",
                    apellido: "$datosAlumno.apellido",
                    curso: "$datosAlumno.curso",
                    grupo: "$datosAlumno.grupo"
                } 
            }
        ]);
        res.status(200).json(alumnosRiesgo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los peores alumnos del centro", error: error.message });
    }
};

exports.obtenerMediaCursos = async (req, res) => {
    try {
        const comparativaCursos = await Calificacion.aggregate([
            {
                $lookup: {
                    from: "usuarios",
                    localField: "alumno",
                    foreignField: "_id",
                    as: "datosAlumno"
                }
            },
            { $unwind: "$datosAlumno" },
            {
                $group: {
                    _id: "$datosAlumno.curso",
                    media: { $avg: "$puntuacion" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(comparativaCursos.map(c => ({
            curso: `${c._id}º ESO`,
            Media: c.media.toFixed(2)
        })));
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los peores alumnos del centro", error: error.message });
    }
};

exports.guardarCalificacionesGrupo = async (req, res) => {
    const notas = req.body;
    const { actividadId } = req.params;
    try {
        const operaciones = Object.keys(notas).map(alumnoId => ({
            updateOne: {
                filter: { actividad: actividadId, alumno: alumnoId },
                update: { 
                    puntuacion: notas[alumnoId].puntuacion, 
                    comentario: notas[alumnoId].comentario,
                    fecha: new Date()
                },
                upsert: true
            }
        }));
        await Calificacion.bulkWrite(operaciones);
        res.json({ mensaje: "Calificaciones actualizadas" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar calificaciones", error });
    }
};

exports.obtenerCalificacionesGrupoByActividad = async (req, res) => {
    try {
        const { actividadId } = req.params;
        const notas = await Calificacion.find({ actividad: actividadId });
        res.status(200).json(notas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener calificaciones", error });
    }
};

exports.obtenerEstadisticasAlumno = async (req, res) => {
    try {
        const { alumnoId } = req.params;
        const calificaciones = await Calificacion.find({ alumno: alumnoId })
            .populate({
                path: 'actividad',
                match: {tipo: 'PRUEBA FISICA'}
            })
            .sort({fechaRegistro: -1});
        const pruebasFisicas = calificaciones.filter(c => c.actividad !== null);
        res.status(200).json(pruebasFisicas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las estadisticas del alumno", error: error.message });
    }
};

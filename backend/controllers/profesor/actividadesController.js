const Actividad = require('../../models/Actividad');
const Calificacion = require('../../models/Calificacion');

exports.crearActividad = async (req, res) => {
    try {
        const nuevaActividad = new Actividad(req.body);
        const actividadGuardada = await nuevaActividad.save();
        res.status(201).json({
            mensaje: "¡Actividad guardada con éxito!",
            datos: actividadGuardada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar", error: error.message });
    }
};

exports.obtenerActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find().sort({ fecha: 1 })
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener alumnos", error: error.message });
    }
};

exports.obtenerActividadById = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) return res.status(404).json({ mensaje: "Actividad no encontrada" });
        res.status(200).json(actividad);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la sesión", error: error.message });
    }
};

exports.borrarActividad = async (req, res) => {
    try {
        const actividadBorrada = await Actividad.findByIdAndDelete(req.params.id);
        if (!actividadBorrada) {
            return res.status(404).json({ mensaje: "No se encontró la sesión para borrar" });
        }
        res.status(200).json({ 
            mensaje: "Actividad eliminada correctamente",
            detalles: actividadBorrada 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al borrar la actividad", error: error.message });
    }
};

exports.actualizarActividad = async (req, res) => {
    try {
        const actividadActualizada = await Actividad.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!actividadActualizada) {
            return res.status(404).json({ mensaje: "No se encontró la actividad" });
        }
        res.status(200).json({
            mensaje: "Actividad actualizada con éxito",
            datos: actividadActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
    }
};

exports.obtenerActividadesByCursoAndByGrupo = async (req, res, next) => {
    try {
        const { curso, grupo } = req.query;
        let filtro = {};
        if (curso) filtro.curso = curso;
        if (grupo) filtro.grupo = grupo;
        const actividades = await Actividad.find(filtro)
            .populate('situacionAprendizaje') 
            .sort({ fecha: 1 });
        res.json(actividades);
    } catch (error) {
        next(error);
    }
};

exports.obtenerActividadesSinCalificar = async (req, res) => {
    try {
        const idsConNota = await Calificacion.distinct('actividad');
        const actividadesSinNota = await Actividad.find({
            _id: { $nin: idsConNota }
        }).select('nombre fecha curso grupo'); 
        res.status(200).json(actividadesSinNota);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las actividades sin calificar", error: error.message });
    }
};

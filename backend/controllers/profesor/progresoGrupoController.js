const ProgresoGrupo = require('../../models/ProgresoGrupo');
const Sesion = require('../../models/Sesion');

exports.finalizarSesion = async (req, res) => {
    const { curso, grupo, numeroSesion, situacionAprendizajeId } = req.body;
    try {
        const progresoActual = await ProgresoGrupo.findOne({ curso, grupo });
        const ultimaCompletada = progresoActual ? progresoActual.ultimaSesion : 0;
        if (numeroSesion <= ultimaCompletada) {
            return res.status(400).json({ 
                mensaje: `Esta sesión ya fue registrada. El grupo ya va por la sesión ${ultimaCompletada}.` 
            });
        }
        const siguienteSesion = await Sesion.findOne({
            curso: curso,
            numeroSesion: { $gt: ultimaCompletada } 
        }).sort({ numeroSesion: 1 });
        if (numeroSesion !== siguienteSesion.numeroSesion) {
            return res.status(400).json({ 
                mensaje: `No puedes saltarte sesiones. La siguiente sesión para este grupo es la ${siguienteSesion.numeroSesion}.` 
            });
        }
        await ProgresoGrupo.findOneAndUpdate(
            { curso, grupo },
            { $set: { ultimaSesion: numeroSesion, situacionAprendizaje: situacionAprendizajeId }},
            { upsert: true, new: true }
        );
        res.json({ mensaje: "Progreso guardado correctamente" });
    } catch (err) {
        res.status(500).json({ mensaje: "Error al guardar progreso" });
    }
};

exports.obtenerProximasSesiones = async (req, res) => {
    try {
        const progresos = await ProgresoGrupo.find().populate('situacionAprendizaje');
        const estadoGrupos = await Promise.all(progresos.map(async (p) => {
            const siguienteNumero = p.ultimaSesion + 1;
            const datosSesion = await Sesion.findOne({
                curso: p.curso,
                numeroSesion: siguienteNumero,
                situacionAprendizaje: p.situacionAprendizaje._id
            });
            return {
                curso: p.curso,
                grupo: p.grupo,
                saNombre: p.situacionAprendizaje.titulo,
                ultimaSesion: p.ultimaSesion,
                proximaSesion: datosSesion || null
            };
        }));
        res.json(estadoGrupos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el estado de los grupos", error: error.message });
    }
};
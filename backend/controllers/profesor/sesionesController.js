const Sesion = require('../../models/Sesion');

exports.crearSesion = async (req, res) => {
    try {
        const nuevaSesion = new Sesion(req.body);
        const sesionGuardada = await nuevaSesion.save();
        res.status(201).json({
            mensaje: "¡Sesión guardada con éxito!",
            datos: sesionGuardada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar", error: error.message });
    }
};

exports.obtenerSesiones =  async (req, res) => {
    try {
        const { curso } = req.query;
        let filtro = {};
        if (curso) filtro.curso = curso;
        const sesiones = await Sesion.find(filtro).populate("situacionAprendizaje");
        res.status(200).json(sesiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al filtrar sesiones", error: error.message });
    }
};

exports.obtenerSesion = async (req, res) => {
    try {
        const sesion = await Sesion.findById(req.params.id).populate("situacionAprendizaje");
        if (!sesion) return res.status(404).json({ mensaje: "Sesión no encontrada" });
        res.status(200).json(sesion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la sesión", error: error.message });
    }
};

exports.borrarSesion =  async (req, res) => {
    try {
        const sesionBorrada = await Sesion.findByIdAndDelete(req.params.id);
        if (!sesionBorrada) {
            return res.status(404).json({ mensaje: "No se encontró la sesión para borrar" });
        }
        res.status(200).json({ 
            mensaje: "Sesión eliminada correctamente",
            detalles: sesionBorrada 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al borrar la sesión", error: error.message });
    }
};

exports.actualizarSesion = async (req, res) => {
    try {
        const sesionActualizada = await Sesion.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!sesionActualizada) {
            return res.status(404).json({ mensaje: "No se encontró la sesión" });
        }
        res.status(200).json({
            mensaje: "Sesión actualizada con éxito",
            datos: sesionActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
    }
};

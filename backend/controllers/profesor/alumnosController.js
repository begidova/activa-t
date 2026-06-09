const Usuario = require('../../models/Usuario');

exports.obtenerAlumnos = async (req, res) => {
    try {
        const alumnos = await Usuario.find({ rol: 'ALUMNO' }).select('-password');
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener alumnos", error: error.message });
    }
};

exports.obtenerCursosGrupos = async (req, res) => {
    try {
        const cursos = await Usuario.find({ rol: 'ALUMNO' }).distinct('curso');
        const mapa = {};
        for (const c of cursos) {
            mapa[c] = await Usuario.distinct('grupo', {curso: c});
        }
        res.json(mapa);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener estructura" });
    }
};

exports.obtenerAlumnoById = async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.params.id).select('-password');
        if (!alumno) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el alumno", error: error.message });
    }
};

exports.subirFoto = async (req, res) => {
    try {
        const { id } = req.params;
        // Multer-storage-cloudinary nos da la URL en req.file.path
        if (!req.file) return res.status(400).json({ msg: "No se subió ninguna imagen" });
        const alumnoActualizado = await Usuario.findByIdAndUpdate(
            id,
            { imagenAvatar: req.file.path },
            { new: true }
        );
        res.json(alumnoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al subir la imagen");
    }
};

exports.obtenerAlumnosByCursoAndByGrupo = async (req, res, next) => {
    try {
        const { curso, grupo } = req.query;
        let filtro = {};
        filtro.rol = 'ALUMNO';
        if (curso) filtro.curso = curso;
        if (grupo) filtro.grupo = grupo;
        const usuarios = await Usuario.find(filtro).select('-password');
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
};

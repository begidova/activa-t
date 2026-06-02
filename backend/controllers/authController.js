const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const fs = require('fs');

exports.crearProfesor = async (req, res) => {
    try {
        const { nombre, email, password, rol, curso, grupo, codigoSecreto } = req.body;
        const existe = await Usuario.countDocuments({ email: new RegExp(email.toLowerCase())});
        if (existe <= 0 ) {
            if (codigoSecreto === 'Profe2026EF') {
                const salt = await bcrypt.genSalt(10);
                const passwordHasheada = await bcrypt.hash(password, salt);
                const nuevoUsuario = new Usuario({
                    nombre,
                    email: email.toLowerCase(),
                    password: passwordHasheada,
                    rol,
                    curso,
                    grupo
                });
                await nuevoUsuario.save();
                res.status(201).json({ mensaje: "Usuario creado con éxito" });
            } else {
                res.status(400).json({mensaje: "El codigo introducido es incorrecto"});
            }
        } else {
            res.status(400).json({mensaje: "Ya existe un usuario con ese correo"});
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar", error: error.message });
    }
};

exports.loguearUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ mensaje: "Email no encontrado" });
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol, curso: usuario.curso, grupo: usuario.grupo }, 
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );
        res.json({
            mensaje: "Login correcto",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

exports.registrarAlumnos = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ mensaje: "No se ha subido archivo" });
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const alumnosExcel = xlsx.utils.sheet_to_json(sheet);
        const salt = await bcrypt.genSalt(10);
        const alumnos = [];
        for (let al of alumnosExcel) {
            const email = await generarEmailUnico(al.Nombre, al.Apellidos);
            const passTexto = `E.Fisica${al.Curso}${al.Grupo}`;
            const passwordHasheada = await bcrypt.hash(passTexto, salt);
            const nuevoAlumno = new Usuario({
                nombre: `${al.Nombre} ${al.Apellidos}`,
                email: email,
                password: passwordHasheada,
                rol: 'ALUMNO',
                curso: al.Curso,
                grupo: al.Grupo,
                imagenAvatar: '',
                datosFisicos: {
                    peso: al.Peso || 0,
                    altura: al.Altura || 0,
                    edad: al.Edad || 0
                }
            });
            alumnos.push(nuevoAlumno.save());
        }
        await Promise.all(alumnos);
        res.status(201).json({ mensaje: `¡Éxito! Se han creado ${alumnos.length} alumnos.` });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al procesar excel", error: error.message });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); 
    }
};

exports.cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;
        const usuario = await Usuario.findById(req.usuario.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        const esValida = await bcrypt.compare(passwordActual, usuario.password);
        if (!esValida) {
            return res.status(400).json({ mensaje: "La contraseña actual no es correcta" });
        }
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(passwordNueva, salt);
        await usuario.save();
        res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cambiar la contraseña", error: error.message });
    }
};

async function generarEmailUnico(nombre, apellidos) {
    const nombreLimpio = limpiarTextoParaEmail(nombre);
    const apellidosLimpios = limpiarTextoParaEmail(apellidos);
    let base = `${nombreLimpio}.${apellidosLimpios.replace(/ /g, "")}`;
    let email = `${base}@edu.es`; 
    let contador = 1;
    let existe = await Usuario.findOne({ email: email });
    while (existe) {
        email = `${base}${contador}@edu.es`;
        existe = await Usuario.findOne({ email: email });
        contador++;
    }
    return email;
}

const limpiarTextoParaEmail = (texto) => {
    return texto
        .toLowerCase()
        .normalize("NFD") // Separa el carácter del acento (ej: 'á' -> 'a' + '´')
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
        .replace(/ñ/g, "n") // Cambia la ñ por n
        .replace(/\s+/g, "") // Elimina espacios
        .trim();
};

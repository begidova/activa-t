const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { 
        type: String, 
        enum: ['PROFESOR', 'ALUMNO', 'PADRE'], 
        required: true 
    },
    curso: { type: Number }, 
    grupo: { type: String },
    imagenAvatar: { type: String },
    datosFisicos: {
        altura: Number,
        peso: Number,
        edad: Number
    },
}, { versionKey: false });

module.exports = mongoose.model('Usuario', usuarioSchema);
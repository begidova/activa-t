const mongoose = require('mongoose');

const reglaSchema = new mongoose.Schema({
    titulo: { type: String },
    descripcion: { type: String }
}, { _id: false });

const actividadSchema = new mongoose.Schema({
    titulo: { type: String },
    descripcion: { type: String },
    reglas: [reglaSchema] 
}, { _id: false });

const faseSchema = new mongoose.Schema({
    tiempo: { type: Number, required: true },
    actividades: [actividadSchema]
}, { _id: false });

const sesionSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    numeroSesion: { type: Number, required: true },
    situacionAprendizaje: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SituacionAprendizaje', 
        required: true 
    },
    curso: { type: Number, required: true }, 
    inicio: faseSchema,
    bloqueCentral: faseSchema,
    cierre: faseSchema,
}, { versionKey: false });

module.exports = mongoose.model('Sesion', sesionSchema);
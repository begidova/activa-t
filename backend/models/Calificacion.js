const mongoose = require('mongoose');

const CalificacionSchema = new mongoose.Schema({
    alumno: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    actividad: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Actividad',
        required: true 
    },
    puntuacion: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 10 
    },
    comentario: { type: String },
    fechaRegistro: { type: Date, default: Date.now },
    situacionAprendizaje: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SituacionAprendizaje', 
        required: true 
    }
}, { versionKey: false });

module.exports = mongoose.model('Calificacion', CalificacionSchema);
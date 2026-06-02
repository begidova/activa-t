const mongoose = require('mongoose');

const progresoGrupoSchema = new mongoose.Schema({
    curso: { 
        type: Number, 
        required: true 
    },
    grupo: { 
        type: String, 
        required: true 
    },
    situacionAprendizaje: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SituacionAprendizaje', 
        required: true 
    },
    ultimaSesion: { 
        type: Number, 
        default: 0 
    },
}, { versionKey: false });

progresoGrupoSchema.index({ curso: 1, grupo: 1, situacionAprendizaje: 1 }, { unique: true });

module.exports = mongoose.model('ProgresoGrupo', progresoGrupoSchema);
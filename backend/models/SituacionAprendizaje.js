const mongoose = require('mongoose');

const situacionAprendizajeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    curso: { type: Number, required: true },
    trimestre: { type: Number, required: true },
    tema: { type: Number }, 
}, { 
    versionKey: false,
    collection: 'situacionesaprendizaje' 
});

module.exports = mongoose.model('SituacionAprendizaje', situacionAprendizajeSchema);
const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { 
        type: String, 
        enum: ['EXAMEN', 'TAREA', 'PRUEBA FISICA', 'ACTITUD'], 
        required: true 
    },
    fecha: { type: Date, default: Date.now, required: true},
    curso: { type: Number, required: true },
    grupo: { type: String, required: true },
    situacionAprendizaje: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SituacionAprendizaje', 
    },
    trimestre: { type: Number, required: true },
    atributoFisico: { type: String }
}, { versionKey: false });

ActividadSchema.pre('findOneAndDelete', async function(next) {
    const actividadId = this.getQuery()._id;
    try {
        await mongoose.model('Calificacion').deleteMany({ actividad: actividadId });
    } catch (err) {
        console.error("Error en el pre-borrado de calificaciones:", err);
        throw err;
    }
});

module.exports = mongoose.model('Actividad', ActividadSchema);
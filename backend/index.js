const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const sesionesRoutesProfesor = require('./routes/profesor/sesionesRoutes');
const actividadesRoutesProfesor = require('./routes/profesor/actividadesRoutes');
const alumnosRoutesProfesor = require('./routes/profesor/alumnosRoutes');
const calificacionesRoutesProfesor = require('./routes/profesor/calificacionesRoutes');
const situacionesAprendizajeRoutesProfesor = require('./routes/profesor/situacionesAprendizajeRoutes');
const progresoGrupoRoutesProfesor = require('./routes/profesor/progresoGrupoRoutes');

const calificacionesRoutesAlumno = require('./routes/alumno/calificacionesRoutes');
const perfilRoutesAlumno = require('./routes/alumno/perfilAlumnoRoutes');
const sesionesRoutesAlumno = require('./routes/alumno/sesionesRoutes');
const progresoGrupoRoutesAlumno = require('./routes/alumno/progresoGrupoRoutes');
const actividadesRoutesAlumno = require('./routes/alumno/actividadesRoutes');
const situacionesAprendizajeRoutesAlumno = require('./routes/alumno/situacionesAprendizajeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sesiones', sesionesRoutesProfesor);
app.use('/api/actividades', actividadesRoutesProfesor);
app.use('/api/alumnos', alumnosRoutesProfesor);
app.use('/api/calificaciones', calificacionesRoutesProfesor);
app.use('/api/situaciones-aprendizaje', situacionesAprendizajeRoutesProfesor);
app.use('/api/progreso-grupo', progresoGrupoRoutesProfesor);

app.use('/api/calificaciones-alumno', calificacionesRoutesAlumno);
app.use('/api/perfil-alumno', perfilRoutesAlumno);
app.use('/api/sesiones-alumno', sesionesRoutesAlumno);
app.use('/api/progreso-grupo-alumno', progresoGrupoRoutesAlumno);
app.use('/api/actividades-alumno', actividadesRoutesAlumno);
app.use('/api/situaciones-aprendizaje-alumno', situacionesAprendizajeRoutesAlumno);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

app.get('/', (req, res) => {
    res.send('Servidor del TFG funcionando');
});

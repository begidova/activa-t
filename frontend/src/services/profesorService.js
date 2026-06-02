import api from './api';

//  RECURSOS (SESIONES Y ACTIVIDADES)

export const obtenerRecursos = async (endpoint) => {
    const res = await api.get(`/${endpoint}`);
    return res.data;
};

export const obtenerRecurso = async (endpoint, recursoId) => {
    const res = await api.get(`/${endpoint}/${recursoId}`);
    return res.data;
};

export const crearRecurso = async (endpoint, datos) => {
    const res = await api.post(`/${endpoint}`, datos);
    return res.data;
};

export const actualizarRecurso = async (endpoint, id, datos) => {
    const res = await api.put(`/${endpoint}/${id}`, datos);
    return res.data;
};

export const eliminarRecurso = async (endpoint, id) => {
    const res = await api.delete(`/${endpoint}/${id}`);
    return res.data;
};

export const obtenerActividades = async (curso, grupo) => {
    const res = await api.get(`/actividades?curso=${curso}&grupo=${grupo}`);
    return res.data;
};

//  CALIFICACIONES

export const guardarCalificaciones = async (nota) => {
    const res = await api.post('/calificaciones', nota);
    return res.data;
};

export const guardarCalificacionesGrupo = async (actividadId, notas) => {
    const res = await api.post(`/calificaciones/actividad/${actividadId}`, notas);
    return res.data;
};

export const obtenerCalificacionesActividad = async (actividadId) => {
    const res = await api.get(`/calificaciones/actividad/${actividadId}`);
    return res.data;
};

export const obtenerCalificacionesAlumno = async (alumnoId) => {
    const res = await api.get(`/calificaciones/alumno/${alumnoId}`);
    return res.data;
};

export const obtenerEstadisticasAlumno = async (alumnoId) => {
    const res = await api.get(`/calificaciones/prueba-fisica/${alumnoId}`);
    return res.data;
};

//  ALUMNOS

export const obtenerCursosGrupos = async () => {
    const res = await api.get('/alumnos/cursos-grupos');
    return res.data;
};

export const guardarFoto = async (alumnoId, form) => {
    const res = await api.put(`/alumnos/${alumnoId}/foto`, form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};

export const obtenerAlumnosByCursoAndGrupo = async (curso, grupo) => {
    const res = await api.get(`/alumnos?curso=${curso}&grupo=${grupo}`);
    return res.data;
};

export const obtenerAlumnoById = async (alumnoId) => {
    const res = await api.get(`/alumnos/${alumnoId}`);
    return res.data;
};

export const guardarAlumnosCSV = async (form) => {
    const res = await api.post(`/auth/registro-alumnos`, form, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    });
    return res.data;
};

export const obtenerAlumnos = async () => {
    const res = await api.get(`/alumnos`);
    return res.data;
};

//  SITUACIONES DE APRENDIZAJE

export const obtenerTodasSituacionesAprendizaje = async () => {
    const res = await api.get('/situaciones-aprendizaje');
    return res.data;
}

//  PROGRESO

export const guardarProgresoSesion = async (progreso) => {
    const res = await api.post('/progreso-grupo', progreso);
    return res.data;
}

export const obtenerProximaSesion = async () => {
    const res = await api.get('/progreso-grupo');
    return res.data;
}

//  DASHBOARD

export const obtenerMediaCalificaciones = async () => {
    const res = await api.get('/calificaciones/media-total');
    return res.data;
}

export const obtenerPeoresAlumnos = async () => {
    const res = await api.get('/calificaciones/peores-alumnos');
    return res.data;
}

export const obtenerMediaCursos = async () => {
    const res = await api.get('/calificaciones/media-cursos');
    return res.data;
}

export const obtenerActividadesSinCalificar = async () => {
    const res = await api.get('/actividades/sin-calificar');
    return res.data;
}

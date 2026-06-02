import api from './api';

export const obtenerMisCalificaciones = async () => {
    const res = await api.get('/calificaciones-alumno');
    return res.data;
};

export const obtenerDatosFisicos = async () => {
    const res = await api.get('/perfil-alumno/datos-fisicos');
    return res.data;
};

export const obtenerCalificacionMedia = async () => {
    const res = await api.get('/calificaciones-alumno/media');
    return res.data;
};

export const obtenerUltimasCalificaciones = async () => {
    const res = await api.get('/calificaciones-alumno/ultimas');
    return res.data;
};

export const obtenerMisEstadisticas = async () => {
    const res = await api.get('/calificaciones-alumno/pruebas-fisicas');
    return res.data;
};

export const obtenerAlumno = async () => {
    const res = await api.get('/perfil-alumno');
    return res.data;
}

export const obtenerSesiones = async () => {
    const res = await api.get('/sesiones-alumno');
    return res.data;
}

export const obtenerSesion = async (sesionId) => {
    const res = await api.get(`/sesiones-alumno/${sesionId}`);
    return res.data;
}

export const obtenerProximaSesion = async () => {
    const res = await api.get('/progreso-grupo-alumno');
    return res.data;
}

export const actualizarPassword = async (datos) => {
    const res = await api.put('/perfil-alumno', datos);
    return res.data;
};

export const obtenerActividades = async (datos) => {
    const res = await api.get('/actividades-alumno', datos);
    return res.data;
};

export const obtenerSituacionesAprendizaje = async (datos) => {
    const res = await api.get('/situaciones-aprendizaje-alumno', datos);
    return res.data;
};
import api from './api';

export const iniciarSesionUsuario = async (datos) => {
    const res = await api.post('/auth/login', datos);
    return res.data;
};

export const registrarProfesor = async (datos) => {
    const res = await api.post('/auth/registro', datos);
    return res.data;
}

export const actualizarPassword = async (datos) => {
    const res = await api.put('/auth', datos);
    return res.data;
};
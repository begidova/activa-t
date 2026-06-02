import { Navigate } from 'react-router-dom';

const RutaPublica = ({ usuario, children }) => {
    return (usuario) ? <Navigate to={`/inicio-${usuario.rol.toLowerCase()}`} replace /> : children;
};

export default RutaPublica;
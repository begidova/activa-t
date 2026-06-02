import { Navigate } from 'react-router-dom';
import { Outlet } from "react-router";

const RutaProtegida = ({ usuario, rolPermitido, children }) => {
    if (!usuario) return <Navigate to="/login" replace />;
    
    if (rolPermitido && usuario.rol !== rolPermitido) {
        return <Navigate to={`/inicio-${usuario.rol.toLowerCase()}`} replace />;
    }

    return children ? children : <Outlet />;
};

export default RutaProtegida;
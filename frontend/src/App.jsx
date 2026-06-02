import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 

import Login from './pages/auth/Login';
import GestionAlumnos from "./pages/profesor/GestionAlumnos";
import Registro from './pages/auth/Registro';
import ListaAlumnos from './pages/profesor/ListaAlumnos';
import PantallaGestion from './pages/profesor/PantallaGestion';
import PantallaNotasAlumno from './pages/profesor/PantallaNotasAlumno';
import PantallaEstadisticas from './pages/shared/PantallaEstadisticas';
import FormularioSesion from './components/formularios/FormularioSesion';
import TarjetaSesion from './components/cards/TarjetaSesion';
import FormularioActividad from './components/formularios/FormularioActividad';
import TarjetaActividad from './components/cards/TarjetaActividad';
import NavbarProfesor from './components/layout/NavbarProfesor';
import NavbarAlumno from './components/layout/NavbarAlumno';
import Header from './components/layout/Header';
import RutaProtegida from './hoc/RutaProtegida';
import RutaPublica from './hoc/RutaPublica';
import PantallaMisNotas from './pages/alumno/PantallaMisNotas';
import DashboardAlumno from './pages/alumno/DashboardAlumno';
import DashboardProfesor from './pages/profesor/DashboardProfesor';
import PantallaMisSesiones from './pages/alumno/PantallaMisSesiones';
import PantallaCalificacion from './pages/profesor/PantallaCalificacion';
import PantallaSesion from './pages/shared/PantallaSesion';
import CambiarPassword from './pages/shared/CambiarPassword';
import PantallaMisActividades from './pages/alumno/PantallaMisActividades';
import './styles/Global.css';

function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('userRol');
    const nombre = localStorage.getItem('userName');
    const id = localStorage.getItem('userId');
    return (token && rol) ? { id, nombre, rol, token } : null;
  });

  const salir = () => {
    localStorage.clear();
    setUsuario(null);
    navigate('/login')
  };

  return (
    <div className="container">
      {usuario && <Header rol={usuario.rol} nombre={usuario.nombre} onSalir={salir} />}
      {usuario?.rol === 'PROFESOR' && <NavbarProfesor />}
      {usuario?.rol === 'ALUMNO' && <NavbarAlumno />}
      <main>
        <Routes>
          <Route path="/registro" element={
            <RutaPublica usuario={usuario}>
              <Registro />
            </RutaPublica>} />
          <Route path="/login" element={
            <RutaPublica usuario={usuario}>
              <Login loguearUsuario={setUsuario} />
            </RutaPublica>} />
          
          <Route path="/gestion" element={<RutaProtegida usuario={usuario} rolPermitido="PROFESOR" />}>
            <Route path="inicio" element={<DashboardProfesor />} />
            <Route path="sesiones" element={<PantallaGestion
              titulo="Gestión de Sesiones"
              endpoint="sesiones"
              Formulario={FormularioSesion}
              Tarjeta={TarjetaSesion}
              campoBusqueda="titulo"
              nombreEntidad="sesión" />} />
            <Route path="sesiones/:sesionId" element={<PantallaSesion />} />
            <Route path="alumnos" element={<ListaAlumnos />}/>
            <Route path="alumnos/importar" element={<GestionAlumnos />} />
            <Route path="alumnos/:alumnoId/calificaciones" element={<PantallaNotasAlumno />} />
            <Route path="alumnos/:alumnoId/estadisticas" element={<PantallaEstadisticas />} />
            <Route path="actividades" element={<PantallaGestion
              titulo="Gestión de Actividades"
              endpoint="actividades"
              Formulario={FormularioActividad}
              Tarjeta={TarjetaActividad}
              campoBusqueda="nombre"
              nombreEntidad="actividad"/>} />
            <Route path="actividades/:actividadId/calificaciones" element={<PantallaCalificacion />} />
            <Route path='perfil' element={<CambiarPassword />} />
          </Route>

          <Route path='/alumno' element={<RutaProtegida usuario={usuario} rolPermitido="ALUMNO" />}>
            <Route path='inicio' element={<DashboardAlumno />} />
            <Route path='calificaciones' element={<PantallaMisNotas />} />
            <Route path='estadisticas' element={<PantallaEstadisticas />} />
            <Route path='sesiones' element={<PantallaMisSesiones />} />
            <Route path='sesiones/:sesionId' element={<PantallaSesion />} />
            <Route path='perfil' element={<CambiarPassword />} />
            <Route path='actividades' element={<PantallaMisActividades />} />
          </Route>

          <Route path="/" element={<Navigate to={usuario ? (usuario.rol === 'PROFESOR' ? "/gestion/inicio" : "/alumno/inicio") : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
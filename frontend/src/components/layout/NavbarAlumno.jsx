import { NavLink } from 'react-router-dom';

function NavbarAlumno() {
  return (
    <nav className="navbar">
      <NavLink to="/alumno/inicio" className="nav-btn">Inicio</NavLink>
      <NavLink to="/alumno/sesiones" className="nav-btn">Mis Sesiones</NavLink>
      <NavLink to="/alumno/estadisticas" className="nav-btn">Mi Perfil Físico</NavLink>
      <NavLink to="/alumno/calificaciones" className="nav-btn">Mis Notas</NavLink>
      <NavLink to="/alumno/actividades" className="nav-btn">Mis Actividades</NavLink>
    </nav>
  );
}

export default NavbarAlumno;
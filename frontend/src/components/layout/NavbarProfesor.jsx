import { NavLink } from 'react-router-dom';

function NavbarProfesor() {
  return (
    <nav className="navbar">
      <NavLink to="/gestion/inicio" className="nav-btn">Inicio</NavLink>
      <NavLink to="/gestion/sesiones" className="nav-btn">Sesiones</NavLink>
      <NavLink to="/gestion/alumnos" className="nav-btn">Alumnos</NavLink>
      <NavLink to="/gestion/actividades" className="nav-btn">Actividades</NavLink>
    </nav>
  );
}

export default NavbarProfesor;
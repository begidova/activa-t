import { useState } from 'react';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/A C T I V A - T.png'; 
import '../../styles/Header.css';

function Header({ rol, nombre, onSalir }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="main-header">
      <div className="header-brand-section" onClick={() => navigate(rol === 'ALUMNO' ? 'inicio-alumno' : 'inicio-profesor')} title="Ir al inicio">
        <img src={logo} alt="Logo Activa-T" className="header-logo" />
        <h1 className="header-app-name">A C T I V A - T</h1>
      </div>
      <div className="header-user-section">
        <div className="user-dropdown-trigger" onClick={() => setMenuAbierto(!menuAbierto)}>
          <div className="avatar-circle">
            {nombre ? nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="welcome-text">
            Bienvenido, <strong>{nombre}</strong>
          </span>
          <ChevronDown size={16} className={`arrow ${menuAbierto ? 'up' : ''}`} />
          {menuAbierto && (
            <div className="user-menu-dropdown">
              <div className="menu-item" onClick={() => navigate(rol === 'ALUMNO' ? '/alumno/perfil' : '/gestion/perfil')}>
                <Settings size={16} />
                <span>Cambiar Contraseña</span>
              </div>
              <hr className="dropdown-divider" />
              <div className="menu-item logout" onClick={onSalir}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
  
export default Header;
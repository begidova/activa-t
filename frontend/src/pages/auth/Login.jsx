import { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; 

import { iniciarSesionUsuario } from '../../services/authService';
import logo from '../../assets/A C T I V A - T.png'
import '../../styles/Login.css';

function Login({ loguearUsuario }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [tipoAviso, setTipoAviso] = useState('error');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expirado') === 'true') {
        setError('Tu sesión ha caducado. Por favor, entra de nuevo.');
        setTipoAviso('warning');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await iniciarSesionUsuario(datos);
      // Guardamos el token en el almacenamiento del navegador (localStorage)
      localStorage.setItem('token', res.token);
      localStorage.setItem('userRol', res.usuario.rol);
      localStorage.setItem('userName', res.usuario.nombre);
      localStorage.setItem('userId', res.usuario.id);
      loguearUsuario({
        ...res.usuario,
        token: res.token
      });
      (res.usuario.rol === 'ALUMNO') ? navigate('/inicio-alumno') : navigate('/inicio-profesor');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <img src={logo} width={200} alt="Logo Activa-T" />
          <h2>A C T I V A - T</h2>
          <p>Introduce tus credenciales para continuar</p>
        </div>
        {error && 
          <div className={tipoAviso === 'warning' ? 'warning-badge' : 'error-badge'}>
            {error}
          </div>
        }
        <div className="input-with-icon">
          <Mail size={18} />
          <input 
            type="email" placeholder="Correo electrónico" 
            required value={datos.email}
            onChange={(e) => setDatos({...datos, email: e.target.value})}
          />
        </div>
        <div className="input-with-icon">
          <Lock size={18} />
          <input type="password" placeholder="Contraseña" required value={datos.password} onChange={(e) => setDatos({...datos, password: e.target.value})}/>
        </div>

        <button type="submit" className="btn-login">ENTRAR</button>
        <p onClick={() => navigate(`/registro`)} className="auth-link">
          Regístrate aquí si eres profesor
        </p>
      </form>
    </div>
  );
}

export default Login;
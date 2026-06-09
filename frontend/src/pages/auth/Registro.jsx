import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

import { registrarProfesor } from '../../services/authService';
import '../../styles/Login.css';

function Registro() {
    const [error, setError] = useState('');
    const [datos, setDatos] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'PROFESOR', 
        curso: 0,
        grupo: '',
        codigo: ''
    });
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (datos.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
            await registrarProfesor(datos);
            navigate(`/login`);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al registrarse");
        }
    };

    return (
        <div className="login-screen">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>Crear Cuenta</h2>
                {error && <div className="error-badge">{error}</div>}
                <input type="text" placeholder="Nombre completo" required onChange={(e) => setDatos({...datos, nombre: e.target.value})}/>
                <input type="email" placeholder="Correo electrónico" required onChange={(e) => setDatos({...datos, email: e.target.value})}/>
                <input type="password" placeholder="Contraseña" required onChange={(e) => setDatos({...datos, password: e.target.value})}/>
                <input type="text" placeholder="Código de centro" required onChange={(e) => setDatos({...datos, codigo: e.target.value})}/>
                <button type="submit" className="btn-login">REGISTRARME</button>
                <p onClick={() => navigate(`/login`)} className="auth-link">
                    ¿Ya tienes cuenta? Inicia sesión
                </p>
            </form>
        </div>
    );
}

export default Registro;
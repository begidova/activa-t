import { useState } from 'react';
import { Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

import { actualizarPassword } from '../../services/authService';
import '../../styles/CambiarPassword.css'; 

function CambiarPassword() {
    const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' });
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [verPassword, setVerPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.nueva !== form.confirmar) return setMensaje({ tipo: 'error', texto: 'Las nuevas contraseñas no coinciden' });
        if (form.nueva.length < 6) return setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
        try {
            await actualizarPassword({ pwdActual: form.actual, pwdNueva: form.nueva });
            setMensaje({ tipo: 'exito', texto: 'Contraseña cambiada con éxito' });
            setForm({ actual: '', nueva: '', confirmar: '' });
        } catch (err) {
            setMensaje({ 
                tipo: 'error', 
                texto: err.response?.data?.mensaje || 'Error al cambiar la contraseña' 
            });
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="card-cambio-pass">
                <h2><Lock size={22} /> Seguridad de la cuenta</h2>
                <p className="card-subtitle">Te recomendamos usar una contraseña única que no utilices en otros servicios.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Contraseña Actual</label>
                        <input type={verPassword ? "text" : "password"} value={form.actual} 
                            onChange={(e) => setForm({...form, actual: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Nueva Contraseña</label>
                        <input type={verPassword ? "text" : "password"} value={form.nueva}
                            onChange={(e) => setForm({...form, nueva: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input type={verPassword ? "text" : "password"} value={form.confirmar}
                            onChange={(e) => setForm({...form, confirmar: e.target.value})} required />
                    </div>
                    <div className="opciones-pass">
                        <button type="button" className="btn-ver" onClick={() => setVerPassword(!verPassword)}>
                            {verPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
                            <span>{verPassword ? "Ocultar" : "Mostrar"} contraseñas</span>
                        </button>
                    </div>
                    {mensaje.texto && (
                        <div className={`alerta ${mensaje.tipo}`}>
                            <AlertCircle size={18} /> <span>{mensaje.texto}</span>
                        </div>
                    )}
                    <button type="submit" className="btn-primario">
                        <Save size={18} /> Actualizar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CambiarPassword;
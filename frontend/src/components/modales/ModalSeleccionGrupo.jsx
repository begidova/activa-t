import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

import { obtenerCursosGrupos, guardarProgresoSesion } from '../../services/profesorService';
import '../../styles/ModalSeleccionGrupo.css';

function ModalSeleccionGrupo({ sesion, abierto, alCerrar, cargando }) {
    const [grupos, setGrupos] = useState([]); 
    const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    useEffect(() => {
        if (abierto) {
            const cargarEstructura = async () => {
                try {
                    const res = await obtenerCursosGrupos();
                    setGrupos(res[sesion.curso] || []);
                } catch (error) {
                    console.error("Error cargando grupos:", error);
                }
            };
            cargarEstructura();
            setGrupoSeleccionado("");
        }
    }, [abierto, sesion.curso]);
    
    const handleFinalizar = async () => {
        try {
            const res = await guardarProgresoSesion({
                curso: sesion.curso,
                grupo: grupoSeleccionado,
                numeroSesion: sesion.numeroSesion,
                situacionAprendizajeId: sesion.situacionAprendizaje._id
            });
            setTipoMensaje("exito");
            setMensaje(res.mensaje || "¡Progreso actualizado correctamente!");
            setTimeout(() => {
                alCerrar();
                setMensaje("");
            }, 2000);
        } catch (error) {
            setTipoMensaje("error");
            const errorMsg = error.response?.data?.mensaje || "Error al guardar el progreso";
            setMensaje(errorMsg);
        }
    };

    if (!abierto) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-contenido-pro">
                <header className="modal-header">
                    <div className="modal-titulo-icon">
                        <Users size={24} color="#4f46e5" />
                        <h3>Registrar Progreso</h3>
                    </div>
                </header>
                <div className="modal-body">
                    <p>¿Qué grupo de <strong>{sesion.curso}º ESO</strong> ha completado esta sesión?</p>
                    <div className="grid-grupos">
                        {grupos.map(g => (
                            <button key={g} className={`card-grupo-selector ${grupoSeleccionado === g ? 'seleccionado' : ''}`}
                                onClick={() => setGrupoSeleccionado(g)} disabled={cargando}>
                                <span className="letra-grupo">{g}</span>
                                <span className="label-grupo">Grupo {g}</span>
                            </button>
                        ))}
                    </div>
                    {mensaje && (
                        <div className={`status-badge-modal ${tipoMensaje === 'exito' ? 'exito' : 'error'}`}>
                            {mensaje}
                        </div>
                    )}
                </div>

                <footer className="modal-footer">
                    <button className="btn-cancelar" onClick={alCerrar}>Cancelar</button>
                    <button className="btn-confirmar-pro" onClick={handleFinalizar} disabled={!grupoSeleccionado || cargando || tipoMensaje === 'exito'}>
                        {cargando ? 'Guardando...' : 'Confirmar'}
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default ModalSeleccionGrupo;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, List, Play, Target, Flag, CheckCircle } from 'lucide-react';

import { obtenerRecurso } from '../../services/profesorService';
import { obtenerSesion } from '../../services/alumnoService';
import ModalSeleccionGrupo from '../../components/modales/ModalSeleccionGrupo';
import '../../styles/PantallaSesion.css';

function PantallaSesion() {
    const { sesionId } = useParams();
    const navigate = useNavigate();
    const usuarioRol = localStorage.getItem('userRol');
    const esProfesor = usuarioRol === 'PROFESOR';
    const [sesion, setSesion] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarSesion = async () => {
            try {
                const data = (esProfesor)? await obtenerRecurso("sesiones", sesionId) : await obtenerSesion(sesionId);
                setSesion(data);
            } catch (error) {
                console.error("Error al cargar la sesión", error);
            } finally {
                setCargando(false);
            }
        };
        cargarSesion();
    }, [sesionId]);

    if (cargando) return <div className="container">Cargando detalles de la sesión...</div>;
    if (!sesion) return <div className="container">No se encontró la sesión.</div>;

    const renderActividades = (actividades) => (
        <div className="lista-actividades-detalle">
            {actividades.map((act, idx) => (
                <div key={idx} className="actividad-item-detalle">
                    <h4>{act.titulo}</h4>
                    <p>{act.descripcion || act.instrucciones}</p>
                    {act.reglas && act.reglas.length > 0 && (
                        <ul className="reglas-lista">
                            {act.reglas.map((regla, rIdx) => (
                                <li key={rIdx}>
                                    {regla.titulo ? ( <strong>{regla.titulo}: </strong> ) : null }
                                    {regla.descripcion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="container animate-fade-in">
            <header className="detalle-header">
                <button onClick={() => navigate(esProfesor ? "/gestion/sesiones" : "/alumno/sesiones")} className="btn-back">
                    <ChevronLeft size={16} /> Volver
                </button>
                <div className="detalle-titulo-container">
                    <span className="sesion-numero-tag">Sesión #{sesion.numeroSesion}</span>
                    <h1>{sesion.titulo}</h1>
                    <div className="detalle-meta-info">
                        <span><Target size={14} /> {sesion.curso}º ESO</span>
                        <span><Clock size={14} /> {(sesion.inicio?.tiempo || 0) + (sesion.bloqueCentral?.tiempo || 0) + (sesion.cierre?.tiempo || 0)} min</span>
                    </div>
                </div>
                <div style={{ width: '100px' }}>
                    {esProfesor && (
                        <button className="btn-finalizar" onClick={ () => setModalAbierto(true) }>
                            <CheckCircle size={18} /> Finalizar Sesión
                        </button>
                    )}
                </div>
            </header>
            <ModalSeleccionGrupo 
                abierto={modalAbierto}
                alCerrar={() => setModalAbierto(false)}
                sesion={sesion}
            />
            <div className="sesion-grid-detalle">
                {sesion.inicio.actividades.length > 0 ? (
                    <section className="fase-seccion inicio">
                        <div className="fase-header">
                            <Play size={24} className="icon-fase" />
                            <div>
                                <h3>Inicio</h3>
                                <span>Duración: {sesion.inicio?.tiempo} min</span>
                            </div>
                        </div>
                        {renderActividades(sesion.inicio?.actividades || [])}
                    </section>
                    ) : null
                }
                <section className="fase-seccion principal">
                    <div className="fase-header">
                        <List size={24} className="icon-fase" />
                        <div>
                            <h3>Parte Principal</h3>
                            <span>Duración: {sesion.bloqueCentral?.tiempo} min</span>
                        </div>
                    </div>
                    {renderActividades(sesion.bloqueCentral?.actividades || [])}
                </section>

                {sesion.cierre.actividades.length > 0 ? (
                    <section className="fase-seccion cierre">
                        <div className="fase-header">
                            <Flag size={24} className="icon-fase" />
                            <div>
                                <h3>Cierre</h3>
                                <span>Duración: {sesion.cierre?.tiempo} min</span>
                            </div>
                        </div>
                        {renderActividades(sesion.cierre?.actividades || [])}
                    </section>
                    ) : null
                }
            </div>
        </div>
    );
}

export default PantallaSesion;
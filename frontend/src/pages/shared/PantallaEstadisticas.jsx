import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, Camera, ChevronLeft } from 'lucide-react';

import ModalAvatar from '../../components/modales/ModalAvatar';
import GraficoRadar from '../../components/graficos/GraficoRadar';
import GraficoEvolucion from '../../components/graficos/GraficoEvolucion';
import { prepararDatosRadar, prepararDatosLinea } from '../../utils/formatters';
import { obtenerEstadisticasAlumno, obtenerAlumnoById } from '../../services/profesorService';
import { obtenerMisEstadisticas, obtenerAlumno } from '../../services/alumnoService';
import '../../styles/PantallaEstadisticas.css';

function PantallaEstadisticas () {
    const { alumnoId } = useParams();
    const navigate = useNavigate();
    const [rawData, setRawData] = useState([]);
    const [alumno, setAlumno] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    const cargarDatos = useCallback(async () => {
        if (!alumnoId) setCargando(true);
        try {
            const resAlu = (alumnoId) ? await obtenerAlumnoById(alumnoId) : await obtenerAlumno();
            const stats = (alumnoId) ? await obtenerEstadisticasAlumno(alumnoId) : await obtenerMisEstadisticas();
            setAlumno(resAlu);
            setRawData(stats);
        } catch (error) {
            console.error("Error al cargar estadísticas", error);
        } finally {
            setCargando(false);
        }
    }, [alumnoId]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const radarData = prepararDatosRadar(rawData);
    const lineData = prepararDatosLinea(rawData);

    if (cargando) return <div className="container">Cargando perfil...</div>;
    if (!rawData) return <div className="container">No hay datos suficientes para generar estadísticas.</div>;

    return (
        <div className="container">
            <header className="profile-header">
                {alumnoId ? (
                    <button onClick={() => navigate("/gestion/alumnos")} className="btn-back"><ChevronLeft /> Volver</button>
                ) : null}
                <div className="eval-info">
                    <h2><TrendingUp /> Perfil Físico: {alumno?.nombre || 'Cargando...'}</h2>
                </div>
                <button onClick={() => setMostrarModal(true)} className="btn-avatar">
                    <Camera size={20} /> 
                    <span>{alumno?.imagenAvatar ? 'Ver Avatar' : 'Subir Avatar'}</span>
                </button>
            </header>

            {mostrarModal && 
                <ModalAvatar
                    abierto={mostrarModal}
                    alumno={alumno}
                    setMostrarModal={setMostrarModal} 
                    setAlumno={setAlumno}
                    estadisticas={lineData}
                    soloLectura={!(alumnoId)}/>
            }
            <div className="stats-dashboard">
                <div className="chart-card">
                    <h3><Activity size={22} color="#4f46e5"/> Perfil de Capacidades Actuales</h3>
                    {lineData.length > 0 ? (
                        <div className="radar-wrapper">
                            <GraficoRadar 
                                data={radarData} 
                                mostrarT1={lineData.some(d => d.name === "1º Trimestre")}
                                mostrarT2={lineData.some(d => d.name === "2º Trimestre")}
                                mostrarT3={lineData.some(d => d.name === "3º Trimestre")}
                            />                    
                        </div>
                    ) : (
                        <div className="no-data-placeholder">
                            Aún no hay datos físicos registrados para este alumno.
                        </div>
                    )}
                </div>
                <div className="chart-card">
                    <h3><TrendingUp size={22} color="#4f46e5"/> Evolución Temporal por Trimestre</h3>
                    {lineData.length > 0 ? (
                        <div className="line-wrapper">
                            <GraficoEvolucion data={lineData} />                    
                        </div>
                    ) : (
                        <div className="no-data-placeholder">
                            No hay evolución temporal disponible.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PantallaEstadisticas;
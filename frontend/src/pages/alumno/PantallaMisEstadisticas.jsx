import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Camera } from 'lucide-react';

import GraficoEvolucion from '../shared/graficos/GraficoEvolucion';
import GraficoRadar from '../shared/graficos/GraficoRadar';
import ModalAvatar from '../../components/modales/ModalAvatar';
import { prepararDatosLinea, prepararDatosRadar } from '../../utils/formatters';
import { obtenerMisEstadisticas, obtenerAlumno } from '../../services/alumnoService';
import '../../styles/PantallaEstadisticas.css'


function PantallaMisEstadisticas() {
    const [datos, setDatos] = useState(null);
    const [alumno, setAlumno] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);

    const cargarEstadisticas = async () => {
        try {
            const resDatos = await obtenerMisEstadisticas();
            const resAlumno = await obtenerAlumno();
            setAlumno(resAlumno);
            setDatos(resDatos);
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    if (cargando) return <div className="container">Analizando rendimiento...</div>;
    if (!datos) return <div className="container">No hay datos suficientes para generar estadísticas.</div>;

    const radarData = prepararDatosRadar(datos);
    const lineData = prepararDatosLinea(datos);

    return (
        <div className="container">
            <header className="profile-header">
                <div className="profile-title-section">
                    <h2><TrendingUp /> Perfil de Aptitud Física: {alumno?.nombre || 'Cargando...'}</h2>
                </div>
                <button onClick={() => setMostrarModal(true)} className="btn-primario">
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
                    soloLectura = {true}
                />
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
                            No hay evolución temporal disponible aún.
                        </div>
                    )}
                </div>
            </div>
        </div>    
    );
}

export default PantallaMisEstadisticas;
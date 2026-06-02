import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TarjetaSesionAlumno from '../../components/cards/TarjetaSesionAlumno';
import FiltrosSesiones from '../../components/filtros/FiltrosSesiones';
import { obtenerSesiones, obtenerProximaSesion } from '../../services/alumnoService';
import '../../styles/PantallaMisSesiones.css';

function PantallaMisSesiones() {
    const [sesiones, setSesiones] = useState([]);
    const [progreso, setProgreso] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroSA, setFiltroSA] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataSesiones = await obtenerSesiones();
                const dataProgreso = await obtenerProximaSesion();
                setSesiones(dataSesiones);
                setProgreso(dataProgreso);
            } catch (error) {
                console.error("Error al cargar sesiones del alumno", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    const sesionesFiltradas = sesiones.filter(sesion => {
        const coincideNombre = sesion.titulo.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideSA = filtroSA === '' || sesion.situacionAprendizaje?.titulo === filtroSA;
        return coincideNombre && coincideSA;
    });

    if (cargando) return <div className="container">Cargando tus clases...</div>;

    const numeroSesionActual = (progreso?.numeroSesion || 0);

    const manejarClickSesion = (sesionId, numeroSesion) => {
        if (numeroSesion <= numeroSesionActual) {
            navigate(`/alumno/sesiones/${sesionId}`);
        } else {
            alert("Esta sesión está bloqueada. Aún no ha sido impartida por tu profesor.");
        }
    };

    return (
        <div className="container animate-fade-in">
            <header className="alumno-header">
                <h2>Mis Sesiones</h2>
            </header>
            <FiltrosSesiones 
                filtroNombre={filtroNombre}
                setFiltroNombre={setFiltroNombre}
                filtroSA={filtroSA}
                setFiltroSA={setFiltroSA}
            />
            <div className="sesiones-layout">
                <section className="historial-container">
                    <div className="sesiones-grid-alumno">
                        {sesionesFiltradas.map(sesion => (
                            <TarjetaSesionAlumno 
                                key={sesion._id}
                                sesion={sesion}
                                esSiguiente={sesion.numeroSesion === numeroSesionActual}
                                bloqueada={sesion.numeroSesion > numeroSesionActual} 
                                alHacerClic={() => manejarClickSesion(sesion._id, sesion.numeroSesion)} 
                            />                        
                        ))}
                    </div>
                    {sesionesFiltradas.length === 0 && (
                        <p className="no-results">No se encontraron sesiones con esos filtros.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default PantallaMisSesiones;
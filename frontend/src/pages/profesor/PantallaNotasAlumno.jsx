import { useState, useEffect } from 'react';
import { History, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { obtenerAlumnoById, obtenerCalificacionesAlumno,  } from '../../services/profesorService';
import FiltrosNotas from '../../components/filtros/FiltrosNotas';

function PantallaNotasAlumno() {
    const { alumnoId } = useParams(); 
    const navigate = useNavigate();
    const [alumno, setAlumno] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroTrimestre, setFiltroTrimestre] = useState('');

    const cargarDatos = async () => {
        try {
            const alumnoData = await obtenerAlumnoById(alumnoId);
            setAlumno(alumnoData);
            refrescarNotas();
        } catch (error) {
            console.error("Error al cargar las notas", error);
        }
    };
    
    useEffect(() => {
        if (alumnoId) cargarDatos();
    }, [alumnoId]);

    const refrescarNotas = async () => {
        const res = await obtenerCalificacionesAlumno(alumnoId);
        setHistorial(res);
    };

    const notasFiltradas = historial.filter(n => {
        const nombreActividad = n.actividad?.nombre || "";
        const tipoActividad = n.actividad?.tipo || "";
        const trimestreActividad = n.actividad?.trimestre || "";
        const coincideNombre = nombreActividad.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideTipo = filtroTipo === '' || tipoActividad === filtroTipo;
        const coincideTrimestre = filtroTrimestre === '' || String(trimestreActividad) === filtroTrimestre;
        return coincideNombre && coincideTipo && coincideTrimestre;
    });

    if (!alumno) return <div className="container">Cargando datos del alumno</div>;

    return (
        <div className="container">
            <header className="eval-header">
                <button onClick={() => navigate("/gestion/alumnos")} className="btn-back"><ChevronLeft /> Volver</button>
                <div className="eval-info">
                    <h2>Notas de: {alumno.nombre} ({alumno.curso}º{alumno.grupo})</h2>
                </div>
                <div className="eval-info">
                </div>
            </header>
            <FiltrosNotas
                filtroNombre={filtroNombre}
                setFiltroNombre={setFiltroNombre}
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                filtroTrimestre={filtroTrimestre}
                setFiltroTrimestre={setFiltroTrimestre}
                />
            <h3><History size={20} /> Historial del Alumno</h3>
            <table className="tabla-alumnos">
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th>Tipo</th>
                        <th>Nota</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {notasFiltradas.length > 0 ? (
                        notasFiltradas.map(n => (
                        <tr key={n._id}>
                            <td>{n.actividad?.nombre}</td>
                            <td>{n.actividad?.tipo}</td>
                            <td style={{fontWeight: 'bold', color: n.puntuacion >= 5 ? '#27ae60' : '#e74c3c'}}>
                                {n.puntuacion}
                            </td>
                            <td>{new Date(n.fechaRegistro).toLocaleDateString()}</td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{textAlign: 'center'}}>No hay notas registradas todavía</td></tr>
                    )}
                </tbody>
            </table>
        </div>

    );
}

export default PantallaNotasAlumno;
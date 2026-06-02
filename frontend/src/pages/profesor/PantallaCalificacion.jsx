import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, User, MessageSquare } from 'lucide-react';

import { obtenerAlumnosByCursoAndGrupo, guardarCalificacionesGrupo, obtenerRecurso, obtenerCalificacionesActividad } from '../../services/profesorService';
import '../../styles/PantallaCalificacion.css';

function PantallaCalificacion() {
    const { actividadId } = useParams();
    const navigate = useNavigate();
    const [actividad, setActividad] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const [notas, setNotas] = useState({}); 
    const [aviso, setAviso] = useState({ texto: '', tipo: '' });

    const cargarDatos = async () => {
        try {
            const act = await obtenerRecurso("actividades", actividadId);
            const listaAlumnos = await obtenerAlumnosByCursoAndGrupo(act.curso, act.grupo);
            const notasExistentes = await obtenerCalificacionesActividad(actividadId);
            const estadoNotasInicial = {};
            listaAlumnos.forEach(al => {
                const notaPrevia = notasExistentes.find(n => n.alumno === al._id);
                estadoNotasInicial[al._id] = { 
                    puntuacion: notaPrevia ? notaPrevia.puntuacion : '', 
                    comentario: notaPrevia ? notaPrevia.comentario : '' 
                };
            });
            setActividad(act);
            setAlumnos(listaAlumnos);
            setNotas(estadoNotasInicial);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [actividadId]);

    const mostrarAviso = (texto, tipo = 'success') => {
        setAviso({ texto, tipo });
        setTimeout(() => setAviso({ texto: '', tipo: '' }), 3000);
    };

    const handleNotaChange = (alumnoId, campo, valor) => {
        setNotas(prev => ({
            ...prev,
            [alumnoId]: { ...prev[alumnoId], [campo]: valor }
        }));
    };

    const handleGuardar = async () => {
        try {
            const notasFiltradas = Object.keys(notas).reduce((acc, alumnoId) => {
                const nota = notas[alumnoId].puntuacion;
                if (nota !== '' && nota !== null && nota !== undefined) {
                    acc[alumnoId] = notas[alumnoId];
                }
                return acc;
            }, {});
            await guardarCalificacionesGrupo(actividadId, notasFiltradas);
            mostrarAviso("Notas guardadas correctamente");
        } catch (error) {
            mostrarAviso("Error al procesar la solicitud", "error");
        }
    };

    if (!actividad) return <div className="container">Cargando actividad...</div>;

    return (
        <div className="container">
            <header className="eval-header">
                <button onClick={() => navigate("/gestion/actividades")} className="btn-back"><ChevronLeft /> Volver</button>
                <div className="eval-info">
                    <h2>{actividad.nombre}</h2>
                    <span>{actividad.curso}º ESO - Grupo {actividad.grupo}</span>
                </div>
                <button onClick={handleGuardar} className="btn-save-all">
                    <Save size={20} /> Guardar Todo
                </button>
            </header>
            {aviso.texto && <div className={`status-msg ${aviso.tipo}`}>{aviso.texto}</div>}
            <div className="eval-table-container">
                <table className="eval-table">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th style={{ width: '120px' }}>Nota (0-10)</th>
                            <th>Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map(alumno => (
                            <tr key={alumno._id}>
                                <td className="alumno-cell">
                                        <User className="mini-avatar-placeholder" />
                                    <span>{alumno.nombre}</span>
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        min="0" max="10" step="0.1"
                                        value={notas[alumno._id]?.puntuacion}
                                        onChange={(e) => handleNotaChange(alumno._id, 'puntuacion', e.target.value)}
                                        className="input-nota"
                                    />
                                </td>
                                <td className="comentario-cell">
                                    <MessageSquare size={16} className="icon-msg" />
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Muy buena ejecución..."
                                        value={notas[alumno._id]?.comentario}
                                        onChange={(e) => handleNotaChange(alumno._id, 'comentario', e.target.value)}
                                        className="input-comentario"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PantallaCalificacion;
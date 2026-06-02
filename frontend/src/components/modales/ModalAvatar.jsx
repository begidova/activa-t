import { X } from 'lucide-react';
import { useEffect, useState } from 'react'; 

import { guardarFoto, obtenerCalificacionesAlumno } from '../../services/profesorService';
import { obtenerMisCalificaciones } from '../../services/alumnoService';
import '../../styles/ModalAvatar.css';

function ModalAvatar({ abierto, setMostrarModal, alumno, setAlumno, estadisticas, soloLectura = false }) {
    const [archivo, setArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [statsCalculadas, setStatsCalculadas] = useState(null);

    const handleSubirFoto = async (e) => {
        e.preventDefault();
        if (!archivo) return;
        const formData = new FormData();
        formData.append('foto', archivo);
        setSubiendo(true);
        try {
            const res = await guardarFoto(alumno._id, formData);
            if (res && res._id) {
                setAlumno(res);
            }
        } catch (error) {
            console.error("Error al subir", error);
        } finally {
            setSubiendo(false);
        }
    };

    const calcularAtributos = async () => {
        if (estadisticas && estadisticas.length > 0 && alumno.imagenAvatar) {
            const calificaciones = soloLectura ? 
                await obtenerMisCalificaciones() : await obtenerCalificacionesAlumno(alumno._id);
            const notasActitud = calificaciones.filter(n => n.actividad?.tipo === 'ACTITUD');
            const promedioActitud = notasActitud.length > 0 ? 
                notasActitud.reduce((acc, curr) => acc + curr.puntuacion, 0) / notasActitud.length : 0;

            const stats = estadisticas[estadisticas.length - 1];
            const movilidad = (stats.Agilidad + stats.Flexibilidad) * 5;
            const potencia = (stats.Velocidad + stats.Salto) * 5;
            const disciplina = promedioActitud + stats.Resistencia * 10 + alumno.datosFisicos.edad;
            const atletico = ((stats.Resistencia + stats.Salto + stats.Velocidad) / 3) * 10;
            setStatsCalculadas({
                movilidad: movilidad.toFixed(),
                potencia: potencia.toFixed(),
                disciplina: disciplina.toFixed(),
                atletico: atletico.toFixed()
            });
        }
    }

    useEffect(() => {
        calcularAtributos();
    }, [estadisticas, alumno]);

    if (!abierto) return null;

    return (
        <div className="modal-overlay" >
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Detalles del Alumno</h3>
                    <button className="btn-close" onClick={() => setMostrarModal(false)}><X /></button>
                </div>
                {alumno?.imagenAvatar ? (
                    <div className="foto-detalle">
                        <img src={alumno.imagenAvatar} alt="Alumno" style={{ width: '100%', borderRadius: '10px' }} />
                        <div className="atributos-grid" style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="atributo-card">
                                <span className="label">MOVILIDAD</span>
                                <span className="valor">{statsCalculadas?.movilidad || '--'}</span>
                            </div>
                            <div className="atributo-card">
                                <span className="label">POTENCIA</span>
                                <span className="valor">{statsCalculadas?.potencia || '--'}</span>
                            </div>
                            <div className="atributo-card">
                                <span className="label">DISCIPLINA</span>
                                <span className="valor">{statsCalculadas?.disciplina || '--'}</span>
                            </div>
                            <div className="atributo-card">
                                <span className="label">ATLÉTICO</span>
                                <span className="valor">{statsCalculadas?.atletico || '--'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        {soloLectura ? (
                            <div className="mensaje-vacio">
                                <p>Aún no tienes un avatar asignado.</p>
                                <p className="text-muted">Pide a tu profesor que suba una foto para ver tus estadísticas avanzadas.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubirFoto} style={{ textAlign: 'center', padding: '20px' }}>
                                <p>El alumno no tiene una imagen. Selecciona una para subirla.</p>
                                <input name='imagenAvatar' type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} 
                                    style={{ margin: '20px 0' }}/>
                                <button type="submit" className="btn-confirmar-avatar" disabled={subiendo || !archivo}>
                                    {subiendo ? 'Subiendo...' : 'Subir'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>  
    );
}

export default ModalAvatar;
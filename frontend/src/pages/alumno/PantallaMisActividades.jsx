import { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

import TarjetaActividad from '../../components/cards/TarjetaActividad';
import FiltrosNotas from '../../components/filtros/FiltrosNotas';
import { obtenerActividades } from '../../services/alumnoService';
import '../../styles/PantallaMisActividades.css';

function PantallaMisActividades() {
    const [actividades, setActividades] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroTrimestre, setFiltroTrimestre] = useState('');
    
    useEffect(() => {
        const cargarData = async () => {
            try {
                const data = await obtenerActividades();
                setActividades(data);
            } catch (err) {
                console.error(err);
            } finally {
                setCargando(false);
            }
        };
        cargarData();
    }, []);

    const actividadesFiltradas = actividades.filter(a => {
        const nombreActividad = a.nombre || "";
        const tipoActividad = a.tipo || "";
        const trimestreActividad = a.trimestre || "";
        const coincideNombre = nombreActividad.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideTipo = filtroTipo === '' || tipoActividad === filtroTipo;
        const coincideTrimestre = filtroTrimestre === '' || String(trimestreActividad) === filtroTrimestre;
        return coincideNombre && coincideTipo && coincideTrimestre;
    });

    if (cargando) return <div className="container">Cargando actividades...</div>;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const proximas = [];
    const completadas = [];

    actividadesFiltradas.forEach(act => {
        const fechaAct = act.fecha?.$date ? new Date(act.fecha.$date) : new Date(act.fecha);
        (fechaAct >= hoy) ? proximas.push(act) : completadas.push(act);
    });

    proximas.sort((a, b) => new Date(a.fecha?.$date || a.fecha) - new Date(b.fecha?.$date || b.fecha));
    completadas.sort((a, b) => new Date(b.fecha?.$date || b.fecha) - new Date(a.fecha?.$date || a.fecha));
    
    return (
        <div className="container animate-fade-in">
            <header className="actividades-header">
                <h2>Mis Actividades</h2>
            </header>
            <FiltrosNotas 
                filtroNombre={filtroNombre} setFiltroNombre={setFiltroNombre}
                filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
                filtroTrimestre={filtroTrimestre} setFiltroTrimestre={setFiltroTrimestre}
            />
            <div className="actividades-layout">
                <section className="actividades-seccion">
                    <div className="seccion-label">
                        <Clock size={18} color="#f39c12" />
                        <span>PRÓXIMAS ACTIVIDADES ({proximas.length})</span>
                    </div>
                    {proximas.length > 0 ? (
                        <div className='grid-actividades'>
                            {proximas.map(act => (
                                <TarjetaActividad key={act._id} dato={act} />
                            ))}
                        </div>
                    ) : (
                        <p className="no-data-text">No tienes actividades programadas próximamente.</p>
                    )}
                </section>

                <section className="actividades-seccion">
                    <div className="seccion-label">
                        <CheckCircle2 size={18} color="#27ae60" />
                        <span>FINALIZADAS</span>
                    </div>
                    <div className='grid-actividades'>
                        {completadas.map(act => (
                            <TarjetaActividad key={act._id} dato={act} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PantallaMisActividades;
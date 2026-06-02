import { useEffect, useState } from 'react';

import TarjetaCalificacion from '../../components/cards/TarjetaCalificacion';
import FiltrosNotas from '../../components/filtros/FiltrosNotas';
import { obtenerMisCalificaciones } from '../../services/alumnoService';
import '../../styles/PantallaGestion.css';

function PantallaMisNotas() {
    const [notas, setNotas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroTrimestre, setFiltroTrimestre] = useState('');

    const cargarNotas = async () => {
        try {
            const res = await obtenerMisCalificaciones();
            setNotas(res);
        } catch (error) {
            console.error("Error al obtener notas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarNotas();
    }, []);

    const notasFiltradas = notas.filter(n => {
        const nombreActividad = n.actividad?.nombre || "";
        const tipoActividad = n.actividad?.tipo || "";
        const trimestreActividad = n.actividad?.trimestre || "";
        const coincideNombre = nombreActividad.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideTipo = filtroTipo === '' || tipoActividad === filtroTipo;
        const coincideTrimestre = filtroTrimestre === '' || String(trimestreActividad) === filtroTrimestre;
        return coincideNombre && coincideTipo && coincideTrimestre;
    });

    if (cargando) return <div className="container"><p>Cargando tus notas...</p></div>;

    return (
        <div className="container">
            <h2>Mis Calificaciones</h2>
            <FiltrosNotas 
                filtroNombre={filtroNombre} 
                setFiltroNombre={setFiltroNombre}
                filtroTipo={filtroTipo} 
                setFiltroTipo={setFiltroTipo}
                filtroTrimestre={filtroTrimestre} 
                setFiltroTrimestre={setFiltroTrimestre}
            />
            <div className="lista-elementos">
                {notasFiltradas.length > 0 ? (
                    notasFiltradas.map(nota => (
                        <TarjetaCalificacion key={nota._id} nota={nota} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#888' }}>
                        No hay calificaciones registradas para este periodo.
                    </p>
                )}
            </div>
        </div>
    );
}

export default PantallaMisNotas;
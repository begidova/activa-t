import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { actualizarRecurso, crearRecurso, eliminarRecurso, obtenerRecursos } from '../../services/profesorService';
import ModalConfirmar from '../../components/modales/ModalConfirmar';
import FiltrosSesiones from '../../components/filtros/FiltrosSesiones';
import FiltrosNotas from '../../components/filtros/FiltrosNotas';
import '../../styles/PantallaGestion.css';

function PantallaGestion({ titulo, endpoint, Formulario, Tarjeta, campoBusqueda = 'titulo', nombreEntidad }) {
    const [elementos, setElementos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [aviso, setAviso] = useState({ texto: '', tipo: '' });
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idABorrar, setIdABorrar] = useState(null);
    const [busqueda, setBusqueda] = useState(sessionStorage.getItem(`busqueda_${endpoint}`) || '');
    const [filtroCurso, setFiltroCurso] = useState(sessionStorage.getItem(`curso_${endpoint}`) || '');
    const [filtroSA, setFiltroSA] = useState(sessionStorage.getItem(`sda_${endpoint}`) || '');
    const [filtroTipo, setFiltroTipo] = useState(sessionStorage.getItem(`tipo_${endpoint}`) || '');
    const [filtroTrimestre, setFiltroTrimestre] = useState(sessionStorage.getItem(`trimestre_${endpoint}`) || '');

    const navigate = useNavigate();

    const obtenerDatos = async () => {
        try {
            const res = await obtenerRecursos(endpoint);
            setElementos(res);
        } catch (error) {
            console.error("Error al obtener datos", error);
        }
    };

    const mostrarAviso = (texto, tipo = 'success') => {
        setAviso({ texto, tipo });
        setTimeout(() => setAviso({ texto: '', tipo: '' }), 3000);
    };

    const guardar = async (datosForm, id) => {
        try {
            if (id) {
                const res = await actualizarRecurso(endpoint, id, datosForm);
                setElementos(elementos.map(el => el._id === id ? res.datos : el));
                setEditando(null);
                mostrarAviso("Actualizado con éxito");
            } else {
                await crearRecurso(endpoint, datosForm);
                mostrarAviso("Guardado correctamente");
            }
            await obtenerDatos()
        } catch (error) {
            mostrarAviso("Error al procesar la solicitud", "error");
        }
    };

    const confirmarEliminacion = async () => {
        try {
            await eliminarRecurso(endpoint, idABorrar);
            setElementos(elementos.filter(el => el._id !== idABorrar));
            setModalAbierto(false);
            mostrarAviso("Eliminado correctamente");
        } catch (error) {
            mostrarAviso("Error al eliminar", "error");
        }
    };

    const manejarEditar = (elemento) => {
        setEditando(elemento);
        window.scrollTo({
            top: 300,
            behavior: 'smooth' 
        });
    };

    useEffect(() => {
        sessionStorage.setItem(`busqueda_${endpoint}`, busqueda);
        sessionStorage.setItem(`curso_${endpoint}`, filtroCurso);
        sessionStorage.setItem(`sda_${endpoint}`, filtroSA);
    }, [busqueda, filtroCurso, filtroSA, endpoint]);

    useEffect(() => { obtenerDatos(); }, [endpoint]);

    const filtrados = elementos.filter(el => {
        const coincideBusqueda = (el[campoBusqueda] || el.nombre || "").toLowerCase().includes(busqueda.toLowerCase());
        if (endpoint === "sesiones") {
            const coincideCurso = filtroCurso === '' || String(el.curso) === filtroCurso;
            const coincideSDA = filtroSA === '' || (el.situacionAprendizaje?.titulo === filtroSA);            
            return coincideBusqueda && coincideCurso && coincideSDA;
        } else {
            const coincideTipo = filtroTipo === '' || el.tipo === filtroTipo;
            const coincideTrimestre = filtroTrimestre === '' || String(el.trimestre) === filtroTrimestre;
            return coincideBusqueda && coincideTipo && coincideTrimestre;
        }

    }).slice(0, 15);

    return (
        <div className="container">
            <h2>{titulo}</h2>
            <Formulario
                guardar={guardar} 
                datoAEditar={editando} 
                cancelarEdicion={() => setEditando(null)}
                sesiones={elementos}
            />
            {aviso.texto && <div className={`status-msg ${aviso.tipo}`}>{aviso.texto}</div>}
            {endpoint === "sesiones" ? (
                <FiltrosSesiones
                    filtroNombre={busqueda} 
                    setFiltroNombre={setBusqueda} 
                    filtroSA={filtroSA}
                    setFiltroSA={setFiltroSA} 
                    filtroCurso={filtroCurso}
                    setFiltroCurso={setFiltroCurso}
                />
                ) : (
                <FiltrosNotas
                    filtroNombre={busqueda}
                    setFiltroNombre={setBusqueda}
                    filtroTipo={filtroTipo}
                    setFiltroTipo={setFiltroTipo}
                    filtroTrimestre={filtroTrimestre}
                    setFiltroTrimestre={setFiltroTrimestre}
                />
            )}
            <ModalConfirmar 
                abierto={modalAbierto}
                entidad={nombreEntidad}
                confirmarEliminacion={confirmarEliminacion}
                cancelarEliminacion={() => setModalAbierto(false)}
            />
            <div className="lista-elementos">
                {filtrados.length > 0 ? (
                    filtrados.map(el => (
                        <div key={el._id} 
                            onClick={() => {
                            if (endpoint === 'actividades') {
                                navigate(`/gestion/${endpoint}/${el._id}/calificaciones`);
                            } else navigate(`/gestion/${endpoint}/${el._id}`)
                        }}>
                            <Tarjeta 
                                dato={el} 
                                onEliminar={(e) => { e.stopPropagation(); setIdABorrar(el._id); setModalAbierto(true); }} 
                                onEditar={(e) => {e.stopPropagation(); manejarEditar(el)}}
                            />
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1', marginTop: '20px' }}>
                        No se ha encontrado {nombreEntidad}.
                    </p>
                )}
            </div>
        </div>
    );
}

export default PantallaGestion;
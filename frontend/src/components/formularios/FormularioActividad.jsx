import { useEffect, useState } from 'react';
import { PlusCircle, Edit } from 'lucide-react';

import { obtenerCursosGrupos, obtenerTodasSituacionesAprendizaje } from '../../services/profesorService';
import '../../styles/Formulario.css';

const estadoInicial = {
    nombre: '',
    tipo: 'TAREA',
    curso: 1,
    grupo: '',
    fecha: new Date().toISOString().split('T')[0],
    situacionAprendizaje: '',
    trimestre: 1,
    atributoFisico: 'Resistencia'
};
  
function FormularioActividad({ guardar, datoAEditar, cancelarEdicion }) {
    const [datos, setDatos] = useState(estadoInicial);
    const [mapaGrupos, setMapaGrupos] = useState({});
    const [listaTemas, setListaTemas] = useState([]); 
    const [temasFiltrados, setTemasFiltrados] = useState([]);

    useEffect(() => {
        cargarEstructura();
        cargarSDAs();
    }, []);

    useEffect(() => {
        if (datoAEditar) {
            setDatos({
                ...datoAEditar,
                situacionAprendizaje: datoAEditar.situacionAprendizaje?._id,
                fecha: datoAEditar.fecha ? datoAEditar.fecha.split('T')[0] : estadoInicial.fecha
            });
        } else {
            setDatos(estadoInicial);
            cargarEstructura();
        }
    }, [datoAEditar]);

    useEffect(() => {
        if (datos.tipo === 'TAREA' || datos.tipo === 'EXAMEN') {
            const filtrados = listaTemas.filter(s => s.curso === Number(datos.curso));
            setTemasFiltrados(filtrados);
            
            if (!filtrados.some(f => f._id === datos.situacionAprendizaje)) {
                setDatos(prev => ({ ...prev, situacionAprendizaje: '', trimestre: 1 }));
            }
        }
    }, [datos.curso, listaTemas, datos.tipo]);

    const cargarSDAs = async () => {
        try {
            const res = await obtenerTodasSituacionesAprendizaje();
            setListaTemas(res);
        } catch (error) {
            console.error("Error cargando situaciones de aprendizaje:", error);
        }
    };

    const cargarEstructura = async () => {
        try {
            const res = await obtenerCursosGrupos();
            setMapaGrupos(res);
            const cursosDisponibles = Object.keys(res);
            if (cursosDisponibles.length > 0 && !datoAEditar) {
                const primerCurso = cursosDisponibles[0];
                setDatos(d => ({ 
                    ...d, 
                    curso: primerCurso, 
                    grupo: res[primerCurso][0] 
                }));
            }
        } catch (error) {
            console.error("Error cargando grupos:", error);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosFinales = { ...datos };
        (datos.tipo === 'ACTITUD' || datos.tipo === 'PRUEBA FISICA') ?
            delete datosFinales.situacionAprendizaje : delete datosFinales.atributoFisico;
        (datos.tipo === 'ACTITUD') ? delete datosFinales.atributoFisico : null;
        guardar(datosFinales, datoAEditar?._id);
        if (!datoAEditar) {
            setDatos({
                ...estadoInicial,
                curso: Object.keys(mapaGrupos)[0],
                grupo: mapaGrupos[Object.keys(mapaGrupos)[0]][0]
            });    
        }
    };

    const manejarCambioTema = (e) => {
        const temaSeleccionado = temasFiltrados.find(t => t._id === e.target.value);
        if (temaSeleccionado) {
            setDatos({
                ...datos,
                situacionAprendizaje: temaSeleccionado._id,
                trimestre: temaSeleccionado.trimestre
            });
        }
    };

    return (
        <form className="form-card-actividad" onSubmit={handleSubmit}>
            <h3 className="form-actividad-title">
                {datoAEditar ? <><Edit size={20} /> Editando Actividad</> : <><PlusCircle size={20} /> Nueva Actividad</>}
            </h3>
            <input type="text" placeholder="Nombre (ej: Flexibilidad)" required value={datos.nombre}
                onChange={e => setDatos({...datos, nombre: e.target.value})}/>
            <select value={datos.tipo} onChange={e => setDatos({...datos, tipo: e.target.value})}>
                <option value="TAREA">Tarea</option>
                <option value="EXAMEN">Examen</option>
                <option value="PRUEBA FISICA">Prueba Física</option>
                <option value="ACTITUD">Actitud</option>
            </select>
            <div className="form-actividad-row">
                <select value={datos.curso} onChange={e => setDatos({...datos, curso: e.target.value})}>
                    {Object.keys(mapaGrupos).map(c => (
                        <option key={c} value={c}>{c}º ESO</option>
                    ))}
                </select>
                <select value={datos.grupo} onChange={e => setDatos({...datos, grupo: e.target.value.toUpperCase()})}>
                    {mapaGrupos[String(datos.curso)]?.map(g => (
                        <option key={g} value={g}>Grupo {g}</option>
                    ))}
                </select>
            </div>
            {datos.tipo === "TAREA" || datos.tipo === "EXAMEN" ? (
                <select value={datos.situacionAprendizaje} onChange={manejarCambioTema} required>
                    <option value="">Seleccionar situacion de aprendizaje</option>
                    {temasFiltrados.map(t => (
                        <option key={t._id} value={t._id}>Tema {t.tema}: {t.titulo}</option>
                    ))}
                </select>
            ) : (
                <select value={datos.trimestre} onChange={e => setDatos({...datos, trimestre: e.target.value})}>
                    <option value="1">1º Trimestre</option>
                    <option value="2">2º Trimestre</option>
                    <option value="3">3º Trimestre</option>
                </select>
            )}
            {datos.tipo === "PRUEBA FISICA" && 
                <select value={datos.atributoFisico} onChange={e => setDatos({...datos, atributoFisico: e.target.value})}>
                    <option value='Resistencia'>Resistencia</option>
                    <option value='Salto'>Salto</option>
                    <option value='Flexibilidad'>Flexibilidad</option>
                    <option value='Velocidad'>Velocidad</option>
                    <option value='Agilidad'>Agilidad</option>
                </select>            
            }
            <input type="date" required value={datos.fecha} onChange={e => setDatos({...datos, fecha: e.target.value})} />
            <div className="form-actividad-actions">
                <button type="submit" className="btn-actividad-save" style={{ backgroundColor: datoAEditar ? '#3498db' : '#2ecc71' }}>
                    {datoAEditar ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR ACTIVIDAD'}
                </button>
                {datoAEditar && (
                    <button type="button" onClick={cancelarEdicion} className='btn-actividad-cancel'>
                        Cancelar edición
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormularioActividad;
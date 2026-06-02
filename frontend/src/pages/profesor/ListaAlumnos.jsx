import { GraduationCap, BarChart3, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import { obtenerAlumnos } from '../../services/profesorService';
import FiltrosAlumnos from '../../components/filtros/FiltrosAlumnos';
import '../../styles/ListaAlumnos.css';

function ListaAlumnos() {
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState(sessionStorage.getItem('busqueda_alumnos') || '');
    const [filtroGrupo, setFiltroGrupo] = useState(sessionStorage.getItem('grupo_alumnos') || '');

    const navigate = useNavigate();

    const recuperarAlumnos = async () => {
        const res = await obtenerAlumnos();
        setAlumnos(res);
    };

    useEffect(() => {
        sessionStorage.setItem('busqueda_alumnos', busqueda);
        sessionStorage.setItem('grupo_alumnos', filtroGrupo);
    }, [busqueda, filtroGrupo]);

    useEffect(() => { recuperarAlumnos() }, []);

    const alumnosFiltrados = alumnos.filter(al => {
        const coincideBusqueda = al.nombre.toLowerCase().includes(busqueda.toLowerCase());
        if (!filtroGrupo) return coincideBusqueda
        const [cursoFiltrado, grupoFiltrado] = filtroGrupo.split('-');
        const coincideCurso = String(al.curso) === cursoFiltrado;
        const coincideGrupo = al.grupo === grupoFiltrado;
        
        return coincideBusqueda && coincideCurso && coincideGrupo;
    }).slice(0, 25);

    return (
        <div className="container">
            <div className="lista-alumnos-header">
                <div className="titulo-seccion">
                    <h2 className="titulo-principal">Listado General de Alumnos</h2>
                </div>
                <button 
                    className="btn-importar-alumnos" 
                    onClick={() => navigate('/gestion/alumnos/importar')} >
                    <UserPlus size={20} />
                    <span>Importar Alumnos</span>
                </button>
            </div>
            <FiltrosAlumnos
                filtroNombre={busqueda}
                setFiltroNombre={setBusqueda}
                filtroCurso={filtroGrupo}
                setFiltroCurso={setFiltroGrupo}
            />
            <table className="tabla-alumnos">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Curso</th>
                        <th>Grupo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnosFiltrados.map(al => (
                        <tr key={al._id}>
                            <td>{al.nombre}</td>
                            <td>{al.email}</td>
                            <td style={{textAlign: 'center'}}>{al.curso}º</td>
                            <td style={{textAlign: 'center'}}>{al.grupo}</td>
                            <td className="celda-acciones">
                                <div className="contenedor-acciones">
                                    <button className="btn-accion btn-nota" onClick={() => navigate(`/gestion/alumnos/${al._id}/calificaciones`)}>
                                        <GraduationCap size={16} />
                                        <span>Notas</span>
                                    </button>
                                    <button className="btn-accion btn-perfil" onClick={() => navigate(`/gestion/alumnos/${al._id}/estadisticas`)}>
                                        <BarChart3 size={16} />
                                        <span>Estadísticas</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaAlumnos;
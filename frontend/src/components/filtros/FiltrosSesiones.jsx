import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';

import { obtenerSituacionesAprendizaje } from '../../services/alumnoService';
import { obtenerTodasSituacionesAprendizaje } from '../../services/profesorService';
import '../../styles/FiltrosSesiones.css';

function FiltrosSesiones({ filtroNombre, setFiltroNombre, filtroSA, setFiltroSA, filtroCurso, setFiltroCurso }) {
    const usuarioRol = localStorage.getItem('userRol');
    const esProfesor = usuarioRol === 'PROFESOR';
    const [situacionesAprendizaje, setSituacionesAprendizaje] = useState([]);
    const [saFiltradas, setSaFiltradas] = useState([]);

    const cargarDatos = async () => {
        try {
            const opcionesSA = (esProfesor)? await obtenerTodasSituacionesAprendizaje() : await obtenerSituacionesAprendizaje();
            setSituacionesAprendizaje(opcionesSA);
            setSaFiltradas(opcionesSA);
        } catch (error) {
            console.error("Error al cargar las situaciones de aprendizaje", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [esProfesor]);

    useEffect(() => {
        if (!filtroCurso) {
            setSaFiltradas(situacionesAprendizaje);
        } else {
            const filtradas = situacionesAprendizaje.filter(sa => String(sa.curso) === String(filtroCurso));
            setSaFiltradas(filtradas);
        }
    }, [filtroCurso, situacionesAprendizaje]);

    return (
        <div className="filtros-container">
            <div className="filter-box">
                <Filter size={18} className="filter-icon" />
                <select 
                    value={filtroSA} 
                    onChange={(e) => setFiltroSA(e.target.value)}
                >
                    <option value="">Todos los temas</option>
                    {saFiltradas.map(sa => (
                        <option key={sa._id} value={sa.titulo}>
                            Tema {sa.tema}: {sa.titulo}
                        </option>
                    ))}
                </select>
            </div>
            {esProfesor && 
                <div className="filter-box">
                    <Filter size={18} className="filter-icon" />
                    <select 
                        value={filtroCurso} 
                        onChange={(e) => setFiltroCurso(e.target.value)}
                    >
                        <option value="">Todos los cursos</option>
                        <option value="1">1º ESO</option>
                        <option value="2">2º ESO</option>
                        <option value="3">3º ESO</option>
                        <option value="4">4º ESO</option>
                    </select>
                </div>
            }
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre de sesión..." 
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>
        </div>
    );
}

export default FiltrosSesiones;
import { Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { obtenerCursosGrupos } from '../../services/profesorService';

function FiltrosAlumnos({ filtroNombre, setFiltroNombre, filtroCurso, setFiltroCurso }) {
    const [estructura, setEstructura] = useState({});

    const recuperarGrupos = async () => {
        try {
            const res = await obtenerCursosGrupos();
            setEstructura(res)
        } catch (error) {
            console.error("Error al obtener los grupos:", error);
        }
    }

    useEffect(() => {
        recuperarGrupos();
    }, [])

    const listaOpciones = Object.keys(estructura).flatMap(curso => 
        estructura[curso].map(grupo => ({
            value: `${curso}-${grupo}`, 
            label: `${curso}º ESO ${grupo}` 
        }))
    );

    return (
        <div className="filtros-container">
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar nombre..." 
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>
            <div className="filter-box">
                <Filter size={18} className="filter-icon" />
                <select 
                    value={filtroCurso} 
                    onChange={(e) => setFiltroCurso(e.target.value)}
                >
                    <option value="">Todos los cursos</option>
                    {listaOpciones.map((opcion, index) => (
                        <option key={index} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default FiltrosAlumnos;
import { Search, Filter, Calendar } from 'lucide-react';

function FiltrosNotas({ filtroNombre, setFiltroNombre, filtroTipo, setFiltroTipo, filtroTrimestre, setFiltroTrimestre }) {
    return (
        <div className="filtros-container">
            <div className="filter-box">
                <Filter size={18} className="filter-icon" />
                <select 
                    value={filtroTipo} 
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <option value="">Todos los tipos</option>
                    <option value="TAREA">Tarea</option>
                    <option value="EXAMEN">Examen</option>
                    <option value="PRUEBA FISICA">Prueba Física</option>
                    <option value="ACTITUD">Actitud</option>
                </select>
            </div>
            <div className="filter-box">
                <Calendar size={18} className="filter-icon" />
                <select 
                    value={filtroTrimestre} 
                    onChange={(e) => setFiltroTrimestre(e.target.value)}
                >
                    <option value="">Todos los trimestres</option>
                    <option value="1">1º Trimestre</option>
                    <option value="2">2º Trimestre</option>
                    <option value="3">3º Trimestre</option>
                </select>
            </div>
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar actividad..." 
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>
        </div>
    );
}

export default FiltrosNotas;
import { Clock, BookOpen, ChevronRight, PlayCircle, Lock } from 'lucide-react';
import '../../styles/TarjetaSesionAlumno.css';

function TarjetaSesionAlumno({ sesion, esSiguiente, bloqueada, alHacerClic }) {
    const tiempoTotal = (sesion.inicio?.tiempo || 0) + (sesion.bloqueCentral?.tiempo || 0) + (sesion.cierre?.tiempo || 0);

    return (
        <div className={`tarjeta-sesion-alumno ${esSiguiente ? 'destacada' : ''}${bloqueada ? 'sesion-bloqueada' : ''}`}
            onClick={() => (!bloqueada)? alHacerClic(sesion._id) : null}>
            {esSiguiente && !bloqueada && <span className="label-proxima">TU PRÓXIMA CLASE</span>}
            {bloqueada && <span className="label-bloqueada" >BLOQUEADA</span>}
            <div className="sesion-card-header">
                <span className="numero-sesion">SESIÓN {sesion.numeroSesion}</span>
            </div>
            <div className="sesion-card-body">
                <h3>{sesion.titulo}</h3>
                <p className="sa-nombre">
                    <BookOpen size={14} /> 
                    {sesion.situacionAprendizaje?.titulo || "Unidad Didáctica"}
                </p>
            </div>
            <div className="sesion-card-footer">
                <div className="info-secundaria">
                    <div className="recursos-count">
                        {sesion.bloqueCentral?.actividades?.length || 0} Actividades
                    </div>
                    <div className="duracion-tag-footer">
                        <Clock size={14} />
                        <span> {tiempoTotal} min</span>
                    </div>
                </div>
                <div className={`btn-entrar ${bloqueada ? 'btn-bloqueado' : ''}`}>
                    {bloqueada ? <Lock size={18} /> : <ChevronRight size={24} />}
                </div>
            </div>
            {esSiguiente && !bloqueada && <PlayCircle className="icon-play-bg" size={70} />}
        </div>
    );
}

export default TarjetaSesionAlumno;
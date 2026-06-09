import { Trash2, Users, Clock, Hash, Layout, Pencil } from 'lucide-react';
import '../../styles/TarjetaSesion.css';

function TarjetaSesion({ dato, onEliminar, onEditar }) {
  const tiempoTotal = (dato.inicio?.tiempo || 0) + (dato.bloqueCentral?.tiempo || 0) + (dato.cierre?.tiempo || 0);
  const totalActividades = dato.bloqueCentral?.actividades?.length || 0;

  return (
    <div className="sesion-card">
      <div className="acciones-tarjeta">
        <Pencil className="edit-icon" size={18} onClick={(e) => {e.stopPropagation(); onEditar(e)}} />
        <Trash2 className="delete-icon" size={18} onClick={(e) => {e.stopPropagation(); onEliminar(e)}} />
      </div>
      <h3 className="sesion-titulo">
        {dato.numeroSesion ? `Sesión ${dato.numeroSesion}: ` : ''}{dato.titulo}
      </h3>
      <div className="meta-info">
        <div className="meta-item">
          <Users size={14} /> <span>{dato.curso}º ESO</span>
        </div>
        <div className="meta-item">
          <Clock size={14} /> <span>{tiempoTotal} min</span>
        </div>
        <div className="meta-item">
          <Hash size={14} /> <span>{totalActividades} actividades</span>
        </div>
        <div className="meta-item">
          <Layout size={14} /> <span>{dato.situacionAprendizaje?.titulo || 'SA General'}</span>
        </div>
      </div>
      <p className="resumen-texto">
        <strong>Fase Central: </strong>
        {dato.bloqueCentral?.actividades[0]?.titulo || "Sin actividades registradas"}
      </p>
    </div>
  );
}

export default TarjetaSesion;
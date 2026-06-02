import { Trash2, Users, Dumbbell, Calendar, Pencil } from 'lucide-react';
import '../../styles/TarjetaActividad.css'

const TIPOS_CONFIG = {
  "PRUEBA FISICA": { color: "#e74c3c" },
  "TAREA": { color: "#3498db" },
  "EXAMEN": { color: "#9b59b6" },
  "ACTITUD": { color: "#2ecc71" }
};

function TarjetaActividad({ dato, onEliminar, onEditar }) {
  const usuarioRol = localStorage.getItem('userRol');
  const esProfesor = usuarioRol === 'PROFESOR';
  const config = TIPOS_CONFIG[dato.tipo] || { color: "#64748b" };

  return (
    <div className="actividad-card" style={{ borderLeft: `5px solid ${config.color}` }}>
      {esProfesor && 
        <div className="actividad-acciones">
          <Pencil className="icon-edit" size={18} onClick={(e) => {e.stopPropagation(); onEditar(e)}} />
          <Trash2 className="icon-delete" size={18} onClick={(e) => {e.stopPropagation(); onEliminar(e)}} />
        </div>
      }
      <h3 className="actividad-titulo">{dato.nombre}</h3>
      <div className="actividad-meta">
        {esProfesor && 
          <span><Users size={14} /> {dato.curso}º{dato.grupo}</span>
        }
        <span><Calendar size={14} /> {new Date(dato.fecha).toLocaleDateString('es-ES')}</span>
        <span style={{ color: config.color, fontWeight: 'bold' }}>
          <Dumbbell size={14} /> {dato.tipo}
        </span>
      </div>
      <p className="actividad-detalle">
        {(dato.tipo === "TAREA" || dato.tipo === "EXAMEN") ?
          (`Tema ${dato.situacionAprendizaje?.tema}: ${dato.situacionAprendizaje?.titulo}`) 
          : dato.tipo === "PRUEBA FISICA" ? (`Prueba: ${dato.atributoFisico}`) 
          : `${dato.trimestre}º Trimestre`}
      </p>
    </div>
  )
}

export default TarjetaActividad;
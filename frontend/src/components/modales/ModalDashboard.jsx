import { Calendar, GraduationCap, ChevronRight, User, X } from 'lucide-react';

import '../../styles/ModalDashboard.css';

function ModalDashboard({ abierto, cerrar, titulo, lista }) {
    
    if (!abierto) return null;

    return (
        <div className="modal-overlay" onClick={cerrar}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{titulo}</h2>
                    <button className="btn-close" onClick={cerrar}><X size={24} /></button>
                </div>
                <div className="modal-body">
                    {lista.length === 0 ? (
                        <p className="empty-msg">No hay elementos para mostrar.</p>
                    ) : (
                        <div className="grid-detalles">
                            {lista.map((item, idx) => (
                                <div key={idx} className="item-detalle-card">
                                    <div className="item-header">
                                        <User size={20} /> <h4>{item.nombre || item.saNombre}</h4>
                                    </div>
                                    <div className="item-info">
                                        {item.proximaSesion !== undefined && (
                                            <>
                                                <p><GraduationCap size={14} /> <strong>Grupo:</strong> {item.curso}º ESO {item.grupo}</p>
                                                <div className="next-session-badge">
                                                    <ChevronRight size={14} />
                                                    <span>Siguiente: <strong>Sesión {item.ultimaSesion + 1}</strong></span>
                                                </div>
                                                <p className="titulo-sesion-modal">{item.proximaSesion?.titulo || "SA Finalizada"}</p>
                                            </>
                                        )}
                                        <p><GraduationCap size={14} /> <strong>Curso:</strong> {item.curso}º ESO {item.grupo}</p>
                                        {item.promedio !== undefined && (
                                            <p className="nota-alerta">
                                                <strong>Promedio:</strong> {item.promedio}
                                            </p>
                                        )}
                                        {item.fecha && (
                                            <p><Calendar size={14} /> 
                                                <strong>Fecha:</strong> {new Date(item.fecha).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalDashboard;
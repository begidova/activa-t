import { BookOpen, Calendar, Award } from 'lucide-react';

function TarjetaCalificacion ({ nota }) {
    return (
        <div key={nota._id} className="sesion-card">
            <div className="nota-badge" style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: nota.puntuacion >= 5 ? '#2ecc71' : '#e74c3c',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '1.2rem'
            }}>
                {nota.puntuacion}
            </div>
            <h3 style={{ margin: '0 0 10px 0', paddingRight: '60px' }}>
                {nota.actividad?.nombre}
            </h3>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BookOpen size={14} />
                {(nota.actividad?.tipo === "TAREA" || nota.actividad?.tipo === "EXAMEN") ?
                    <> <strong>Tema {nota.actividad?.situacionAprendizaje?.tema}:</strong> {nota.actividad?.situacionAprendizaje?.titulo} </>
                    : nota.actividad?.tipo === "PRUEBA FISICA" ? <> <strong>Prueba: </strong> {nota.actividad?.atributoFisico} </>
                    : nota.actividad?.trimestre + "º Trimestre"
                }
            </div>
            <div className="meta-info">
                <span><Calendar size={14} /> {new Date(nota.actividad?.fecha).toLocaleDateString()}</span>
                <span><Award size={14} /> {nota.actividad?.tipo}</span>
            </div>
            {nota.comentario && (
                <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                    <strong>Comentario: </strong> {nota.comentario}
                </p>
            )}
        </div>
    );
}

export default TarjetaCalificacion;
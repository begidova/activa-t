import { useState, useEffect } from 'react';
import { PlusCircle, Edit } from 'lucide-react';

import { obtenerTodasSituacionesAprendizaje } from '../../services/profesorService';
import { mapearArrayATexto, mapearTextoAArray } from '../../utils/mapper';
import '../../styles/FormularioSesion.css';

const estadoInicial = {
  titulo: '',
  numeroSesion: 1,
  situacionAprendizaje: '',
  curso: 1,
  tiempoInicio: 10,
  actividadesInicio: '',
  tiempoBloqueCentral: 35,
  actividadesBloqueCentral: '',
  tiempoCierre: 5,
  actividadesCierre: ''
};

function FormularioSesion({ guardar, datoAEditar, cancelarEdicion, sesiones=[] }) {
  const [formData, setFormData] = useState(estadoInicial);
  const [situaciones, setSituaciones] = useState([]);
  const [saFiltradas, setSaFiltradas] = useState([]);

  const cargarSA = async () => {
    try {
      const res = await obtenerTodasSituacionesAprendizaje();
      setSituaciones(res);
    } catch (error) {
      console.error("Error al cargar las situaicones de aprendizaje en el formulario", error);
    }
  };

  useEffect(() => {
    cargarSA();
  }, []);

  useEffect(() => {
    const filtradas = situaciones.filter(sa => String(sa.curso) === String(formData.curso));
    setSaFiltradas(filtradas);
    const sigueExistiendo = filtradas.some(sa => sa._id === formData.situacionAprendizaje);
    if (!sigueExistiendo && !datoAEditar) {
      setFormData(prev => ({ ...prev, situacionAprendizaje: '' }));
    }
  }, [formData.curso, situaciones, datoAEditar]);

  useEffect(() => {
    if (!datoAEditar && formData.curso) {
      const sesionesDeEsteCurso = sesiones.filter(s => {
        return String(s.curso) === String(formData.curso);
      });
      const numerosOcupados = sesionesDeEsteCurso
        .map(s => Number(s.numeroSesion))
        .filter(num => !isNaN(num)) 
        .sort((a, b) => a - b);
      let numeroSugerido = 1;
      while (numerosOcupados.includes(numeroSugerido)) {
        numeroSugerido++;
      }
      setFormData(prev => ({ ...prev, numeroSesion: numeroSugerido }));
    }
  }, [formData.curso, formData.situacionAprendizaje, datoAEditar, sesiones]);

  useEffect(() => {
    if (datoAEditar) {
      const saDeLaSesion = situaciones.find(sa => sa._id === (datoAEditar.situacionAprendizaje?._id || datoAEditar.situacionAprendizaje));
      const cursoReal = saDeLaSesion ? String(saDeLaSesion.curso) : String(datoAEditar.curso || '1');
      setFormData({
        titulo: datoAEditar.titulo || '',
        numeroSesion: datoAEditar.numeroSesion || 1,
        situacionAprendizaje: datoAEditar.situacionAprendizaje?._id || datoAEditar.situacionAprendizaje || '',
        curso: cursoReal,
        tiempoInicio: datoAEditar.inicio?.tiempo || 10,
        actividadesInicio: mapearArrayATexto(datoAEditar.inicio?.actividades),
        tiempoBloqueCentral: datoAEditar.bloqueCentral?.tiempo || 35,
        actividadesBloqueCentral: mapearArrayATexto(datoAEditar.bloqueCentral?.actividades),
        tiempoCierre: datoAEditar.cierre?.tiempo || 5,
        actividadesCierre: mapearArrayATexto(datoAEditar.cierre?.actividades)
      });
    } else {
      setFormData(estadoInicial);
    }
  }, [datoAEditar, situaciones]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datosEstructurados = {
      titulo: formData.titulo,
      numeroSesion: Number(formData.numeroSesion),
      situacionAprendizaje: formData.situacionAprendizaje || null,
      curso: Number(formData.curso),
      inicio: {
        tiempo: Number(formData.tiempoInicio),
        actividades: mapearTextoAArray(formData.actividadesInicio)
      },
      bloqueCentral: {
        tiempo: Number(formData.tiempoBloqueCentral),
        actividades: mapearTextoAArray(formData.actividadesBloqueCentral)
      },
      cierre: {
        tiempo: Number(formData.tiempoCierre),
        actividades: mapearTextoAArray(formData.actividadesCierre)
      }
    };
    guardar(datosEstructurados, datoAEditar?._id);
    setFormData(estadoInicial);
  };

  return (
    <form onSubmit={handleSubmit} className="form-card-sesion">
      <h3 className="form-title">
        {datoAEditar ? <><Edit size={20} /> Editando Sesión</> : <><PlusCircle size={20} /> Nueva Sesión</>}
      </h3>
      <div className="form-row">
        <div className="form-item flex-3">
          <label className="form-label">Título de la Sesión</label>
          <input 
            type="text" placeholder="Ej: Descubrimiento del Datchball" 
            value={formData.titulo} required
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-item flex-1">
          <label className="form-label">Curso</label>
          <select value={formData.curso} onChange={(e) => setFormData({...formData, curso: e.target.value})}>
            <option value="1">1º ESO</option>
            <option value="2">2º ESO</option>
            <option value="3">3º ESO</option>
            <option value="4">4º ESO</option>
          </select>
        </div>
        <div className="form-item flex-2">
          <label className="form-label">Situación de Aprendizaje</label>
          <select value={formData.situacionAprendizaje} required
            onChange={(e) => setFormData({...formData, situacionAprendizaje: e.target.value})}>
            <option value="">Selecciona un tema...</option>
            {saFiltradas.map(sa => (
              <option key={sa._id} value={sa._id}>Tema {sa.tema}: {sa.titulo}</option>
            ))}
          </select>
        </div>
      </div>
      <hr className="form-divider" />
      <div className="fase-container">
        <div className="fase-header-form">
          <span className="fase-title">PARTE INICIAL (Calentamiento)</span>
          <div className="form-item-inline">
            <label className="form-label-inline">Tiempo:</label>
            <input type="number" placeholder="Mins" className="input-tiempo" min="0" value={formData.tiempoInicio} required
              onChange={(e) => setFormData({...formData, tiempoInicio: e.target.value})}/>
            <span className="mins-tag">min</span>
          </div>
        </div>
        <textarea 
          placeholder="Formato -> Título: Descripción...&#10;* Regla o variante 1&#10;* Regla o variante 2" 
          value={formData.actividadesInicio}
          onChange={(e) => setFormData({...formData, actividadesInicio: e.target.value})}
          rows={4}
        />
      </div>
      <div className="fase-container">
        <div className="fase-header-form">
          <span className="fase-title">BLOQUE CENTRAL (Principal)</span>
          <div className="form-item-inline">
            <label className="form-label-inline">Tiempo:</label>
            <input type="number" placeholder="Mins" className="input-tiempo" min="0" value={formData.tiempoBloqueCentral} required
              onChange={(e) => setFormData({...formData, tiempoBloqueCentral: e.target.value})}/>
            <span className="mins-tag">min</span>
          </div>
        </div>
        <textarea 
          placeholder="Formato -> Título: Descripción...&#10;* Regla o variante 1" 
          value={formData.actividadesBloqueCentral}
          onChange={(e) => setFormData({...formData, actividadesBloqueCentral: e.target.value})}
          rows={5}
        />
      </div>
      <div className="fase-container">
        <div className="fase-header-form">
          <span className="fase-title">PARTE FINAL (Cierre)</span>
          <div className="form-item-inline">
            <label className="form-label-inline">Tiempo:</label>
            <input type="number" placeholder="Mins" className="input-tiempo" min="0" value={formData.tiempoCierre} required
              onChange={(e) => setFormData({...formData, tiempoCierre: e.target.value})}/>
            <span className="mins-tag">min</span>
          </div>
        </div>
        <textarea 
          placeholder="Formato -> Título: Descripción..." 
          value={formData.actividadesCierre}
          onChange={(e) => setFormData({...formData, actividadesCierre: e.target.value})}
          rows={3}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-submit-sesion" style={{ backgroundColor: datoAEditar ? '#3498db' : '#2ecc71' }}>
          {datoAEditar ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR SESIÓN'}
        </button>
        {datoAEditar && (
          <button type="button" onClick={cancelarEdicion} className="btn-cancel-sesion">
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioSesion;
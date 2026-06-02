import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileSpreadsheet } from 'lucide-react';

import { guardarAlumnosCSV } from '../../services/profesorService';
import '../../styles/GestionAlumnos.css';

function GestionAlumnos() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();


  const manejarSubida = async (e) => {
    e.preventDefault();
    if (!archivo) setMensaje("Selecciona un archivo .xlsx");

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      setMensaje("Registrando alumnos...");
      const res = await guardarAlumnosCSV(formData);
      setMensaje(res.mensaje);
    } catch (err) {
      setMensaje('Error en la subida: ' + (err.response?.data?.mensaje || 'Error desconocido'));
    }
  };

  return (
    <div className="container">
      <div className="importar-header">
        <div className="header-left">
          <button onClick={() => navigate("/gestion/alumnos")} className="btn-volver-minimal"><ChevronLeft /> Volver</button>
          <div className="titulo-contenedor">
            <div className="icono-titulo">
               <FileSpreadsheet size={28} color="#27ae60" />
            </div>
            <div>
              <h2 className="titulo-principal">Importar Estudiantes</h2>
              <p className="subtitulo-seccion">Sube tu archivo Excel para el registro de alumnos</p>
            </div>
          </div>
        </div>
      </div>      
      <div className="form-card">
        <p>El archivo debe tener las columnas: <b>Nombre, Apellidos, Curso, Grupo, Peso, Altura, Edad</b></p>
        <form onSubmit={manejarSubida}>
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={(e) => setArchivo(e.target.files[0])}
            style={{marginBottom: '20px'}}
            />
          <button type="submit" className="btn-save">SUBIR Y REGISTRAR ALUMNOS</button>
        </form>
        {mensaje && <p className={`status-msg ${mensaje.includes('Éxito') ? 'success' : 'error'}`}>{mensaje}</p>}
      </div>
    </div>
  );
}

export default GestionAlumnos;
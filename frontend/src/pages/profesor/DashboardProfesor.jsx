import { useEffect, useState } from 'react';
import { Users, AlertCircle, Calendar, FileWarning, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { obtenerMediaCalificaciones, obtenerPeoresAlumnos, obtenerProximaSesion, obtenerActividadesSinCalificar, obtenerMediaCursos } from '../../services/profesorService';
import ModalDashboard from '../../components/modales/ModalDashBoard';
import '../../styles/Dashboard.css';

function DashboardProfesor() {
    const [stats, setStats] = useState(null);
    const [modalConfig, setModalConfig] = useState({ abierto: false, titulo: '', lista: [] });

    const fetchStats = async () => {
        try {
            const resMediaTotal = await obtenerMediaCalificaciones();
            const resPeoresAlumnos = await obtenerPeoresAlumnos();
            const resProximaSesion = await obtenerProximaSesion();
            const resActSinCalif = await obtenerActividadesSinCalificar();
            const resMediaCursos = await obtenerMediaCursos();
            setStats({
                mediaGlobal: resMediaTotal,
                alumnosRiesgo: resPeoresAlumnos,
                proximaSesion: resProximaSesion,
                actividadesSinCalificar: resActSinCalif,
                graficoCursos: resMediaCursos
            });
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const abrirAlumnosRiesgo = async () => {
        setModalConfig({
            abierto: true,
            titulo: 'Alumnos con Promedio Insuficiente',
            lista: stats.alumnosRiesgo
        });
    };
    
    const abrirActividadesPendientes = async () => {
        setModalConfig({
            abierto: true,
            titulo: 'Actividades sin Calificar',
            lista: stats.actividadesSinCalificar
        });
    };
    
    const abrirProximasSesiones = () => {
        setModalConfig({
            abierto: true,
            titulo: 'Progreso por Grupos',
            lista: stats.proximaSesion
        });
    };

    if (!stats) return <div className="container">Cargando visión general...</div>;

    return (
        <div className="container">
            <ModalDashboard 
                abierto={modalConfig.abierto}
                titulo={modalConfig.titulo}
                lista={modalConfig.lista}
                cerrar={() => setModalConfig({ ...modalConfig, abierto: false })}
            />
            <div className="dashboard-grid">
                <div className="dash-card border-blue">
                    <Users size={32} color="#3498db" />
                    <div>
                        <h3>Media Global</h3>
                        <p className="dash-value">{stats.mediaGlobal}</p>
                    </div>
                </div>
                <div className="dash-card border-red" onClick={abrirAlumnosRiesgo}>
                    <AlertCircle size={32} color="#e74c3c" />
                    <div>
                        <h3>Alumnos en Riesgo</h3>
                        <p className="dash-value">{stats.alumnosRiesgo.length}</p>
                    </div>
                </div>
                <div className="dash-card border-orange" onClick={abrirActividadesPendientes}>
                    <FileWarning size={32} color="#f39c12" />
                    <div>
                        <h3>Actividades sin Nota</h3>
                        <p className="dash-value">{stats.actividadesSinCalificar.length}</p>
                    </div>
                </div>
            </div>
            <div className="dashboard-main-profesor">
                <div className="dash-card border-green" onClick={abrirProximasSesiones}>
                    <Calendar size={32} color="#27ae60" />
                    <div>
                        <h3>Progreso Grupos</h3>
                        <p className="dash-value">{stats.proximaSesion.length} Activos</p>
                    </div>
                </div>
                <div className="dash-card-full">
                    <h3><BarChart3 size={20} /> Media por Cursos</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.graficoCursos}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="curso" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Bar dataKey="Media" fill="#3498db" radius={[4, 4, 0, 0]}>
                                    {stats.graficoCursos.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.Media < 5 ? '#e74c3c' : '#3498db'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProfesor;
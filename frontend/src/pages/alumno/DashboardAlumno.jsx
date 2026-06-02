import { useEffect, useState } from 'react';
import { Award, Calendar, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { obtenerDatosFisicos, obtenerProximaSesion, obtenerCalificacionMedia, obtenerUltimasCalificaciones } from '../../services/alumnoService';
import '../../styles/Dashboard.css';

function DashboardAlumno() {
    const [datos, setDatos] = useState(null);

    const cargarDashboard = async () => {
        try {
            const resDatosFisicos = await obtenerDatosFisicos();
            const resProxSesion = await obtenerProximaSesion();
            const resNotaMedia = await obtenerCalificacionMedia();
            const resProgreso = await obtenerUltimasCalificaciones();
            setDatos({
                datosFisicos: resDatosFisicos, 
                proximaSesion: resProxSesion, 
                notaMedia: resNotaMedia,
                progreso: resProgreso
            });
        } catch (err) { console.error(err); }
    };
    
    useEffect(() => {
        cargarDashboard();
    }, []);
    
    // IMC: peso / altura^2 (altura en metros)
    const calcularIMC = () => {
        if (!datos?.datosFisicos?.peso || !datos?.datosFisicos?.altura) return "N/A";
        return (datos.datosFisicos.peso / (datos.datosFisicos.altura * datos.datosFisicos.altura)).toFixed(1);
    };
    
    if (!datos) return <div className="container">Cargando dashboard...</div>;
    
    const imc = calcularIMC();

    return (
        <div className="container">
            <div className="dashboard-grid">
                <div className="dash-card">
                    <Award size={30} color="#f1c40f" />
                    <div>
                        <h3>Nota Media</h3>
                        <p className="dash-value">{datos.notaMedia}</p>
                    </div>
                </div>
                <div className="dash-card">
                    <Calendar size={30} color="#3498db" />
                    <div>
                        <h3>Próxima Sesión</h3>
                        <p className="dash-value" style={{ fontSize: '1rem', marginTop: '5px' }}>
                            {datos.proximaSesion?.titulo || "No hay sesiones"}
                        </p>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Sesión #{datos.proximaSesion?.numeroSesion}
                        </span>
                    </div>
                </div>
                <div className="dash-card">
                    <Activity size={30} color="#2ecc71" />
                    <div>
                        <h3>Tu IMC</h3>
                        <p className="dash-value">{imc}</p>
                        <span className="imc-status">{imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Normal' : 'Sobrepeso'}</span>
                    </div>
                </div>
            </div>
            <div className="dashboard-main" style={{ marginTop: '30px' }}>
                <div className="chart-container dash-card-full">
                    <h3><TrendingUp size={20} /> Evolución de tus últimas notas</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer key={datos.progreso.length}>
                            <LineChart data={datos.progreso} margin={{ top: 10, right: 30, left: 0, bottom: 20 }} >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="nombre" interval={0} tick={{ fontSize: 12 }} height={60} />
                                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="nota" stroke="#3498db" strokeWidth={3} dot={{ r: 6 }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardAlumno;
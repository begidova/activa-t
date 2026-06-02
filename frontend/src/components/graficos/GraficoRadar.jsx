import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

function GraficoRadar({ data, mostrarT1, mostrarT2, mostrarT3 }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="77%" data={data}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 13 }} />
                <PolarRadiusAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} axisLine={false} tick={false} />
                {mostrarT1 && (
                    <Radar name="1º Trimestre" dataKey="T1" stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
                )}
                {mostrarT2 && (
                    <Radar name="2º Trimestre" dataKey="T2" stroke="#e67e22" fill="#e67e22" fillOpacity={0.3} />
                )}
                {mostrarT3 && (
                    <Radar name="3º Trimestre" dataKey="T3" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.3} />
                )}
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </RadarChart>
        </ResponsiveContainer>
    );
}

export default GraficoRadar;
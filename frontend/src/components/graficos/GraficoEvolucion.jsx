import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

function GraficoEvolucion({ data }) {
    const [lineasOcultas, setLineasOcultas] = useState({
        Resistencia: false,
        Salto: false,
        Flexibilidad: false,
        Velocidad: false,
        Agilidad: false
    });

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setLineasOcultas((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }} />
                <Line name="Resistencia" dataKey="Resistencia" stroke="#3498db" strokeWidth={3} dot={{ r: 6 }} hide={lineasOcultas.Resistencia} />
                <Line name="Salto" dataKey="Salto" stroke="#e74c3c" strokeWidth={3} dot={{ r: 6 }} hide={lineasOcultas.Salto} />
                <Line name="Flexibilidad" dataKey="Flexibilidad" stroke="#9b59b6" strokeWidth={3} dot={{ r: 6 }} hide={lineasOcultas.Flexibilidad} />
                <Line name="Velocidad" dataKey="Velocidad" stroke="#f1c40f" strokeWidth={3} dot={{ r: 6 }} hide={lineasOcultas.Velocidad} />
                <Line name="Agilidad" dataKey="Agilidad" stroke="#2ecc71" strokeWidth={3} dot={{ r: 6 }} hide={lineasOcultas.Agilidad} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default GraficoEvolucion;
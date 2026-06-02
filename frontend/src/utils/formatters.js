export const prepararDatosRadar = (rawData) => {
    const atributos = ['Resistencia', 'Salto', 'Flexibilidad', 'Velocidad', 'Agilidad'];
    return atributos.map(attr => {
        const findNota = (trimestre) => {
            const notaObj = rawData
                .filter(n => n.actividad.trimestre === trimestre && n.actividad.atributoFisico === attr)
                .pop();
            return notaObj ? notaObj.puntuacion : 0;
        };
        return {
            subject: attr,
            T1: findNota(1),
            T2: findNota(2),
            T3: findNota(3),
            fullMark: 10
        };
    });
};

export const prepararDatosLinea = (rawData) => {
    return [1, 2, 3].map(t => {
        const notasTrimestre = rawData.filter(n => n.actividad.trimestre === t);
        if (notasTrimestre.length === 0) return null;
        const dataPoint = { name: `${t}º Trimestre` };
        notasTrimestre.forEach(n => {
            const attr = n.actividad.atributoFisico;
            if (attr) {
                dataPoint[attr] = n.puntuacion;
            }
        });
        return dataPoint;
    }).filter(item => item !== null);
};
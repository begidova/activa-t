export const mapearArrayATexto = (actividadesArray) => {
    if (!actividadesArray || !Array.isArray(actividadesArray)) return '';    
    return actividadesArray.map(act => {
        const titulo = act.titulo ? act.titulo.trim() : '';
        const descripcion = act.descripcion ? act.descripcion.trim() : '';
        let textoActividad = titulo ? `${titulo}: ${descripcion}` : descripcion;
        if (act.reglas && Array.isArray(act.reglas) && act.reglas.length > 0) {
            const textoReglas = act.reglas.map(r => {
                const rTitulo = r.titulo ? r.titulo.trim() : '';
                const rDesc = r.descripcion ? r.descripcion.trim() : '';  
                if (!rDesc) return '';
                return rTitulo ? `* ${rTitulo}: ${rDesc}` : `* ${rDesc}`;
            })
            .filter(linea => linea !== '')
            .join('\n');
            if (textoReglas) {
                textoActividad += `\n${textoReglas}`;
            }
        }
        return textoActividad;
    })
    .filter(texto => texto.trim() !== '')
    .join('\n');
  };
  
export const mapearTextoAArray = (texto) => {
    if (!texto || !texto.trim()) return [];  
    const lineas = texto.split('\n');
    const actividades = [];
    lineas.forEach(linea => {
        const lineaLimpia = linea.trim();
        if (!lineaLimpia) return;
        if (lineaLimpia.startsWith('*')) {
            const contenidoRegla = lineaLimpia.replace(/^\*+\s*/, '').trim();
            let rTitulo = "";
            let rDescripcion = "";
            if (contenidoRegla.includes(':')) {
                const partesRegla = contenidoRegla.split(':');
                rTitulo = partesRegla[0].trim();
                rDescripcion = partesRegla.slice(1).join(':').trim();
            } else rDescripcion = contenidoRegla;
            if (actividades.length > 0) {
                const ultimaActividad = actividades[actividades.length - 1];
                if (!ultimaActividad.reglas) ultimaActividad.reglas = [];
                ultimaActividad.reglas.push({
                    titulo: rTitulo,
                    descripcion: rDescripcion
                });
            }
        } else {
            let titulo = "";
            let descripcion = "";
            if (lineaLimpia.includes(':')) {
                const partes = lineaLimpia.split(':');
                titulo = partes[0].trim();
                descripcion = partes.slice(1).join(':').trim();
            } else {
                descripcion = lineaLimpia;
            }
            actividades.push({
                titulo,
                descripcion,
                reglas: []
            });
        }
    });
    return actividades;
};
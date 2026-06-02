const checkRol = (rolPermitido) => {
    return (req, res, next) => {
        if (!req.usuario) return res.status(401).json({ mensaje: "No hay usuario autenticado" });
        if (req.usuario.rol !== rolPermitido) {
            return res.status(403).json({ 
                mensaje: `Acceso denegado: se requiere rol de ${rolPermitido}` 
            });
        }
        next();
    };
};

module.exports = checkRol;